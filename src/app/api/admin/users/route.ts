import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getCurrentAuthUser, normalizeUserRole, UserRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/admin/users
 * Strictly admin-only: Returns unified list of users combining Clerk & Neon DB.
 */
export async function GET() {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin clearance required.' },
        { status: 403 }
      );
    }

    // 1. Fetch Clerk Users
    let clerkUsers: any[] = [];
    try {
      const client = await clerkClient();
      const userListRes = await client.users.getUserList({ limit: 100 });
      clerkUsers = userListRes.data || [];
    } catch (clerkErr) {
      console.warn('[Admin Users API] Clerk list warning:', clerkErr);
    }

    // 2. Fetch Neon DB Users
    let dbUsers: any[] = [];
    try {
      dbUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('[Admin Users API] Neon DB list warning:', dbErr);
    }

    const dbUserMap = new Map<string, any>();
    const dbEmailMap = new Map<string, any>();
    dbUsers.forEach((u) => {
      if (u.clerkId) dbUserMap.set(u.clerkId, u);
      if (u.email) dbEmailMap.set(u.email.toLowerCase(), u);
    });

    const seenClerkIds = new Set<string>();

    const users = clerkUsers.map((u) => {
      seenClerkIds.add(u.id);
      const primaryEmail =
        u.emailAddresses.find((e: any) => e.id === u.primaryEmailAddressId)?.emailAddress ||
        u.emailAddresses[0]?.emailAddress ||
        '';

      const metadata = (u.publicMetadata || {}) as {
        role?: string;
        department?: string;
        studentId?: string;
      };

      // Correlate with Neon DB
      const matchedDb = dbUserMap.get(u.id) || (primaryEmail ? dbEmailMap.get(primaryEmail.toLowerCase()) : null);

      const effectiveRole: UserRole = matchedDb?.role
        ? normalizeUserRole(matchedDb.role)
        : normalizeUserRole(metadata.role);

      const department = matchedDb?.branch
        ? `B.Tech ${matchedDb.branch} (Sem ${matchedDb.semester || 1})`
        : metadata.department || 'B.Tech Core';

      return {
        id: u.id,
        fullName: matchedDb?.fullName || [u.firstName, u.lastName].filter(Boolean).join(' ') || 'SETGOI Member',
        email: primaryEmail || matchedDb?.email || '',
        role: effectiveRole,
        department,
        studentId: matchedDb?.universityRoll || metadata.studentId || '',
        imageUrl: u.imageUrl,
        createdAt: u.createdAt,
        onboardingCompleted: matchedDb?.onboardingCompleted ?? metadata?.role ? true : false,
      };
    });

    // Add any Neon DB users that might not have been returned in the first 100 Clerk users
    dbUsers.forEach((du) => {
      if (!seenClerkIds.has(du.clerkId)) {
        users.push({
          id: du.clerkId,
          fullName: du.fullName || 'SETGOI Member',
          email: du.email,
          role: normalizeUserRole(du.role),
          department: du.branch ? `B.Tech ${du.branch} (Sem ${du.semester || 1})` : 'B.Tech Core',
          studentId: du.universityRoll || '',
          imageUrl: undefined,
          createdAt: du.createdAt.toISOString(),
          onboardingCompleted: du.onboardingCompleted,
        });
      }
    });

    return NextResponse.json({ users, total: users.length });
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

    // Self-demotion prevention
    if (userId === caller.userId && targetRoleLower !== 'admin') {
      return NextResponse.json(
        { error: 'Self-demotion prevented: You cannot revoke admin clearance from your own account.' },
        { status: 400 }
      );
    }

    // 1. Update Neon PostgreSQL
    let updatedDbUser = null;
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ id: userId }, { clerkId: userId }],
        },
      });

      if (existingUser) {
        updatedDbUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            role: targetRoleUpper,
            onboardingCompleted: targetRoleLower === 'student' ? existingUser.onboardingCompleted : true,
          },
        });
      }
    } catch (dbErr: any) {
      console.warn('[Admin Users API] Neon DB update warning:', dbErr?.message || dbErr);
    }

    // 2. Update Clerk
    const clerkIdToUse = updatedDbUser?.clerkId || userId;
    try {
      const client = await clerkClient();
      const targetUser = await client.users.getUser(clerkIdToUse);
      const existingMetadata = (targetUser.publicMetadata || {}) as Record<string, any>;

      await client.users.updateUserMetadata(clerkIdToUse, {
        publicMetadata: {
          ...existingMetadata,
          role: targetRoleLower,
          updatedAt: new Date().toISOString(),
          promotedBy: caller.email || caller.userId,
        },
      });
    } catch (clerkErr: any) {
      console.warn('[Admin Users API] Clerk update warning:', clerkErr?.message || clerkErr);
    }

    return NextResponse.json({
      success: true,
      userId,
      role: targetRoleUpper,
      message: `User role successfully updated to ${targetRoleUpper}.`,
    });
  } catch (err: any) {
    console.error('[Admin Users API] PATCH Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}
