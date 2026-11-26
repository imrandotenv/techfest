import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import {
  getCurrentAuthUser,
  normalizeUserRole,
  UserRole,
  MASTER_ADMIN_EMAIL,
  assertNotMasterAdminTarget,
  RBACError,
} from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/admin/users
 * Strictly admin-only: Returns real registered users from Neon DB + Clerk sync
 * with search, role filter, and pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin clearance required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const roleFilter = (searchParams.get('role') || 'ALL').toUpperCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get('limit') || '20', 10) || 20));

    // 1. Purge any leftover dummy/seed user rows (@setgoi.ac.in, @example.com, seed_*) safely
    const masterUser = await prisma.user
      .findFirst({
        where: { email: { equals: MASTER_ADMIN_EMAIL, mode: 'insensitive' } },
        select: { id: true },
      })
      .catch(() => null);

    const seedUsers = await prisma.user
      .findMany({
        where: {
          OR: [
            { email: { endsWith: '@setgoi.ac.in', mode: 'insensitive' } },
            { email: { endsWith: '@example.com', mode: 'insensitive' } },
            { clerkId: { startsWith: 'seed_' } },
          ],
        },
        select: { id: true },
      })
      .catch(() => []);

    const seedIds = seedUsers
      .map((s) => s.id)
      .filter((id) => !masterUser || id !== masterUser.id);

    if (seedIds.length > 0 && masterUser) {
      await Promise.all([
        prisma.note.updateMany({ where: { uploaderId: { in: seedIds } }, data: { uploaderId: masterUser.id } }),
        prisma.forumPost.updateMany({ where: { authorId: { in: seedIds } }, data: { authorId: masterUser.id } }),
        prisma.forumReply.updateMany({ where: { authorId: { in: seedIds } }, data: { authorId: masterUser.id } }),
        prisma.notice.updateMany({ where: { authorId: { in: seedIds } }, data: { authorId: masterUser.id } }),
        prisma.vivaSession.updateMany({ where: { userId: { in: seedIds } }, data: { userId: masterUser.id } }),
        prisma.attendanceRecord.deleteMany({ where: { userId: { in: seedIds } } }),
      ]).catch(() => {});
      await prisma.user.deleteMany({ where: { id: { in: seedIds } } }).catch(() => {});
    }

    await prisma.$executeRawUnsafe(
      `UPDATE "User" SET "department" = "branch" WHERE "department" IS NULL AND "branch" IS NOT NULL`
    ).catch(() => {});

    // 2. Fetch live Clerk users and upsert them into Neon PostgreSQL
    const clerkUsers = await clerkClient()
      .then((client) => client.users.getUserList({ limit: 100 }))
      .then((res) => res.data || [])
      .catch(() => []);

    for (const cu of clerkUsers) {
      const primaryEmail =
        cu.emailAddresses.find((e: any) => e.id === cu.primaryEmailAddressId)?.emailAddress ||
        cu.emailAddresses[0]?.emailAddress ||
        '';
      if (!primaryEmail || primaryEmail.toLowerCase().includes('clerk_test@example.com')) {
        continue;
      }
      const clerkFullName =
        [cu.firstName, cu.lastName].filter(Boolean).join(' ').trim() ||
        cu.username ||
        null;
      const isMaster = primaryEmail.trim().toLowerCase() === MASTER_ADMIN_EMAIL;
      const metadata = (cu.publicMetadata || {}) as Record<string, any>;

      const existing = await prisma.user
        .findFirst({
          where: {
            OR: [
              { clerkId: cu.id },
              { email: { equals: primaryEmail, mode: 'insensitive' } },
            ],
          },
        })
        .catch(() => null);

      if (existing) {
        await prisma.user
          .update({
            where: { id: existing.id },
            data: {
              clerkId: cu.id,
              email: primaryEmail,
              ...(clerkFullName ? { fullName: clerkFullName } : {}),
              ...(isMaster
                ? {
                    role: 'ADMIN',
                    isMasterAdmin: true,
                    approvalStatus: 'APPROVED',
                    onboardingCompleted: true,
                  }
                : {}),
            },
          })
          .catch(() => {});
      } else {
        const metaBranch =
          typeof metadata.branch === 'string' ? metadata.branch.toUpperCase().trim() : null;
        const metaDept =
          typeof metadata.department === 'string'
            ? metadata.department.toUpperCase().trim()
            : metaBranch;
        await prisma.user
          .create({
            data: {
              clerkId: cu.id,
              email: primaryEmail,
              fullName: clerkFullName || 'SETGOI Member',
              role: isMaster ? 'ADMIN' : normalizeUserRole(metadata.role).toUpperCase(),
              isMasterAdmin: isMaster,
              approvalStatus: isMaster ? 'APPROVED' : metadata.approvalStatus || 'APPROVED',
              branch: metaBranch,
              department: metaDept,
              semester: metadata.semester ? Number(metadata.semester) : null,
              onboardingCompleted: isMaster || Boolean(metadata.onboardingCompleted),
            },
          })
          .catch(() => {});
      }
    }

    const dbUsers = await prisma.user
      .findMany({
        orderBy: { createdAt: 'desc' },
      })
      .catch(() => []);

    const clerkMap = new Map<string, any>();
    clerkUsers.forEach((cu) => clerkMap.set(cu.id, cu));

    const seenClerkIds = new Set<string>();
    const combined: Array<{
      id: string;
      clerkId: string;
      fullName: string;
      email: string;
      role: UserRole;
      department: string;
      branch?: string | null;
      semester?: number | null;
      studentId: string;
      rollNumber: string;
      isVerifiedClerk: boolean;
      isMasterAdmin?: boolean;
      requestedRole?: string | null;
      approvalStatus?: string;
      employeeId?: string | null;
      designation?: string | null;
      requestedScopes?: any;
      assignedScopes?: any;
      onboardingNote?: string | null;
      imageUrl?: string;
      createdAt: string;
      onboardingCompleted: boolean;
    }> = [];

    // Primary source: Neon DB users
    for (const du of dbUsers) {
      seenClerkIds.add(du.clerkId);
      const cu = clerkMap.get(du.clerkId);
      const effectiveRole = normalizeUserRole(du.role);
      const isMaster =
        Boolean(du.isMasterAdmin) ||
        du.email.trim().toLowerCase() === MASTER_ADMIN_EMAIL;
      combined.push({
        id: du.clerkId || du.id,
        clerkId: du.clerkId,
        fullName:
          du.fullName ||
          (cu ? [cu.firstName, cu.lastName].filter(Boolean).join(' ') : '') ||
          'SETGOI Member',
        email: du.email,
        role: isMaster ? 'admin' : effectiveRole,
        department: du.department || du.branch || 'CSE',
        branch: du.branch,
        semester: du.semester,
        studentId: du.universityRoll || '',
        rollNumber: du.universityRoll || '',
        isVerifiedClerk: Boolean(cu),
        isMasterAdmin: isMaster,
        requestedRole: du.requestedRole,
        approvalStatus: du.approvalStatus || 'APPROVED',
        employeeId: du.employeeId,
        designation: du.designation,
        requestedScopes: du.requestedScopes,
        assignedScopes: du.assignedScopes,
        onboardingNote: du.onboardingNote,
        imageUrl: cu?.imageUrl,
        createdAt: du.createdAt.toISOString(),
        onboardingCompleted: du.onboardingCompleted,
      });
    }

    // Secondary: any Clerk users not yet synced to Neon DB
    for (const cu of clerkUsers) {
      if (seenClerkIds.has(cu.id)) continue;
      const primaryEmail =
        cu.emailAddresses.find((e: any) => e.id === cu.primaryEmailAddressId)?.emailAddress ||
        cu.emailAddresses[0]?.emailAddress ||
        '';
      const metadata = (cu.publicMetadata || {}) as Record<string, any>;
      combined.push({
        id: cu.id,
        clerkId: cu.id,
        fullName: [cu.firstName, cu.lastName].filter(Boolean).join(' ') || 'SETGOI Member',
        email: primaryEmail,
        role: normalizeUserRole(metadata.role),
        department: metadata.branch
          ? `B.Tech ${metadata.branch} (Sem ${metadata.semester || 1})`
          : metadata.department || 'Pending Onboarding',
        branch: metadata.branch || null,
        semester: metadata.semester ? Number(metadata.semester) : null,
        studentId: metadata.studentId || '',
        rollNumber: metadata.universityRoll || metadata.studentId || '',
        isVerifiedClerk: true,
        imageUrl: cu.imageUrl,
        createdAt: new Date(cu.createdAt).toISOString(),
        onboardingCompleted: Boolean(metadata.onboardingCompleted),
      });
    }

    const counts = {
      total: combined.length,
      admin: combined.filter((u) => u.role === 'admin').length,
      faculty: combined.filter((u) => u.role === 'faculty').length,
      student: combined.filter((u) => u.role === 'student').length,
    };

    const filtered = combined.filter((u) => {
      if (roleFilter !== 'ALL' && u.role.toUpperCase() !== roleFilter) {
        return false;
      }
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.studentId.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });

    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
    const safePage = Math.min(page, totalPages);
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    return NextResponse.json({
      success: true,
      users: paginated,
      total: totalFiltered,
      page: safePage,
      limit,
      totalPages,
      counts,
    });
  } catch (err: any) {
    console.error('[Admin Users API] GET Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch user list' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Strictly admin-only: Updates a user's role across both Neon DB and Clerk.
 */
export async function PATCH(req: Request) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin clearance required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, role } = body as { userId: string; role: string };

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Both userId and role are required.' },
        { status: 400 }
      );
    }

    const targetRoleLower: UserRole = normalizeUserRole(role);
    const targetRoleUpper = targetRoleLower.toUpperCase();

    if (userId === caller.userId && targetRoleLower !== 'admin') {
      return NextResponse.json(
        { error: 'Self-demotion prevented: You cannot revoke admin clearance from your own account.' },
        { status: 400 }
      );
    }

    let updatedDbUser = null;
    try {
      const existing = await prisma.user.findFirst({
        where: { OR: [{ clerkId: userId }, { id: userId }] },
      });
      if (existing) {
        updatedDbUser = await prisma.user.update({
          where: { id: existing.id },
          data: {
            role: targetRoleUpper,
            onboardingCompleted: targetRoleLower === 'student' ? existing.onboardingCompleted : true,
          },
        });
      }
    } catch (dbErr) {
      console.warn('[Admin Users API] Neon DB update warning:', dbErr);
    }

    const clerkId = updatedDbUser?.clerkId || userId;
    try {
      const client = await clerkClient();
      const targetClerkUser = await client.users.getUser(clerkId);
      const existingMetadata = (targetClerkUser.publicMetadata || {}) as Record<string, any>;
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          ...existingMetadata,
          role: targetRoleLower,
          isSuperAdmin: targetRoleLower === 'admin',
          onboardingCompleted: targetRoleLower === 'student' ? existingMetadata.onboardingCompleted : true,
          updatedAt: new Date().toISOString(),
          promotedBy: caller.email || caller.userId,
        },
      });
    } catch (clerkErr) {
      console.warn('[Admin Users API] Clerk metadata update warning:', clerkErr);
    }

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      action: 'ROLE_CHANGE',
      target: updatedDbUser?.email || clerkId,
      details: `Updated role clearance to ${targetRoleUpper}`,
    });

    return NextResponse.json({
      success: true,
      userId,
      role: targetRoleUpper,
      message: `User role updated to ${targetRoleUpper} across Neon DB & Clerk.`,
    });
  } catch (err: any) {
    console.error('[Admin Users API] PATCH Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Admin-only: Pre-authorizes a Faculty or Admin email so when they sign in via Clerk,
 * resolveAndHealUser() automatically binds their role and department.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      email,
      fullName,
      role = 'FACULTY',
      department = 'CSE',
      designation,
    } = body;

    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const targetRoleUpper = String(role).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'FACULTY';
    const callerIsMasterAdmin =
      (caller.email || '').trim().toLowerCase() === MASTER_ADMIN_EMAIL;

    if (targetRoleUpper === 'ADMIN' && !callerIsMasterAdmin) {
      return NextResponse.json(
        { error: 'Only Master Admin can pre-authorize ADMIN accounts.' },
        { status: 403 }
      );
    }

    const cleanDept = String(department || 'CSE').toUpperCase().trim();
    const existing = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } },
    });

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            role: targetRoleUpper,
            department: cleanDept,
            branch: cleanDept,
            approvalStatus: 'APPROVED',
            onboardingCompleted: true,
            ...(fullName?.trim() ? { fullName: fullName.trim() } : {}),
            ...(designation?.trim() ? { designation: designation.trim() } : {}),
          },
        })
      : await prisma.user.create({
          data: {
            clerkId: `invited_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            email: cleanEmail,
            fullName: fullName?.trim() || cleanEmail.split('@')[0],
            role: targetRoleUpper,
            department: cleanDept,
            branch: cleanDept,
            designation: designation?.trim() || (targetRoleUpper === 'ADMIN' ? 'Department Admin' : 'Faculty'),
            approvalStatus: 'APPROVED',
            degree: 'B.Tech',
            onboardingCompleted: true,
          },
        });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      actorEmail: caller.email || undefined,
      actorRole: callerIsMasterAdmin ? 'MASTER_ADMIN' : 'ADMIN',
      action: 'USER_PREAUTHORIZED',
      target: cleanEmail,
      targetType: 'USER',
      targetLabel: user.fullName || cleanEmail,
      details: `Pre-authorized ${cleanEmail} as ${targetRoleUpper} (${cleanDept})`,
    });

    return NextResponse.json({
      success: true,
      user,
      message: `${cleanEmail} pre-authorized as ${targetRoleUpper} (${cleanDept}).`,
    }, { status: 201 });
  } catch (err: any) {
    console.error('[Admin Users POST] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to pre-authorize user' },
      { status: 500 }
    );
  }
}
