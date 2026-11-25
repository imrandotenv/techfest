import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { BTechBranch } from '@/config/curriculum';
import {
  resolveAndHealUser,
  isSuperAdminEmail,
  MASTER_ADMIN_EMAIL,
  FacultyScope,
} from '@/lib/rbac';

const VALID_BRANCHES: BTechBranch[] = [
  'CSE',
  'CSE-AIML',
  'CSE-DS',
  'ECE',
  'EE',
  'EEE',
  'ME',
  'CE',
];

function sanitizeBranch(raw?: string | null): BTechBranch {
  const upper = (raw || 'CSE').trim().toUpperCase();
  if (VALID_BRANCHES.includes(upper as BTechBranch)) {
    return upper as BTechBranch;
  }
  return 'CSE';
}

function sanitizeScopes(raw: unknown): FacultyScope[] {
  if (!Array.isArray(raw)) return [];
  const result: FacultyScope[] = [];
  for (const item of raw) {
    if (!item || typeof item.branch !== 'string' || !Array.isArray(item.semesters)) continue;
    const branch = sanitizeBranch(item.branch);
    const semesters = Array.from<number>(
      new Set(
        item.semesters
          .map((s: any) => Number(s))
          .filter((n: number) => Number.isInteger(n) && n >= 1 && n <= 8)
      )
    ).sort((a, b) => a - b);
    if (semesters.length > 0) {
      result.push({ branch, semesters });
    }
  }
  return result;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const primaryEmail =
      user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
      user?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.username ||
      'SETGOI Member';
    const metadata = (user?.publicMetadata || {}) as Record<string, any>;

    const dbUser = await resolveAndHealUser({
      clerkUserId: userId,
      email: primaryEmail,
      fullName,
    }).catch((e: any) => {
      console.warn('[Profile API] Database read note:', e?.message || e);
      return null;
    });

    const profile = {
      clerkId: userId,
      email: dbUser?.email || primaryEmail,
      fullName: dbUser?.fullName || fullName,
      role: dbUser?.role || metadata.role || 'STUDENT',
      isMasterAdmin: dbUser?.isMasterAdmin ?? false,
      requestedRole: dbUser?.requestedRole || null,
      approvalStatus: dbUser?.approvalStatus || 'APPROVED',
      employeeId: dbUser?.employeeId || null,
      designation: dbUser?.designation || null,
      department: dbUser?.department || dbUser?.branch || 'CSE',
      degree: dbUser?.degree || metadata.degree || 'B.Tech',
      branch: sanitizeBranch(dbUser?.branch || metadata.branch || 'CSE'),
      semester: dbUser?.semester || metadata.semester || 3,
      passoutYear: dbUser?.passoutYear || metadata.passoutYear || new Date().getFullYear() + 2,
      universityRoll: dbUser?.universityRoll || metadata.universityRoll || null,
      requestedScopes: dbUser?.requestedScopes || [],
      assignedScopes: dbUser?.assignedScopes || [],
      onboardingNote: dbUser?.onboardingNote || null,
      onboardingCompleted: dbUser?.onboardingCompleted ?? metadata.onboardingCompleted ?? false,
    };

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error('[Profile API GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || 'STUDENT').toUpperCase().trim() as
      | 'STUDENT'
      | 'FACULTY'
      | 'ADMIN';

    const user = await currentUser();
    const primaryEmail =
      user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
      user?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fallbackName =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.username ||
      'SETGOI Member';

    const fullName =
      typeof body.fullName === 'string' && body.fullName.trim()
        ? body.fullName.trim()
        : fallbackName;

    const isMaster = primaryEmail.trim().toLowerCase() === MASTER_ADMIN_EMAIL;
    const isWhitelisted = isMaster || isSuperAdminEmail(primaryEmail);

    let updateData: Record<string, any> = {
      clerkId: userId,
      email: primaryEmail,
      fullName,
      degree: 'B.Tech',
      onboardingCompleted: true,
    };
    let redirectTo = '/dashboard';
    let clerkMetaPatch: Record<string, any> = {
      onboardingCompleted: true,
      degree: 'B.Tech',
    };

    if (mode === 'STUDENT' && !isMaster) {
      const branch = sanitizeBranch(body.branch);
      const semester = Math.min(8, Math.max(1, parseInt(body.semester, 10) || 3));
      const passoutYear = parseInt(body.passoutYear, 10) || new Date().getFullYear() + 2;
      const universityRoll =
        typeof body.universityRoll === 'string' && body.universityRoll.trim()
          ? body.universityRoll.trim()
          : null;

      updateData = {
        ...updateData,
        role: isWhitelisted ? 'ADMIN' : 'STUDENT',
        requestedRole: null,
        approvalStatus: 'APPROVED',
        branch,
        department: branch,
        semester,
        passoutYear,
        universityRoll,
      };
      redirectTo = '/dashboard';
      clerkMetaPatch = {
        ...clerkMetaPatch,
        role: isWhitelisted ? 'admin' : 'student',
        isSuperAdmin: isWhitelisted,
        approvalStatus: 'APPROVED',
        branch,
        department: branch,
        semester,
        passoutYear,
        universityRoll,
      };
    } else if (mode === 'FACULTY' && !isMaster) {
      const employeeId = typeof body.employeeId === 'string' ? body.employeeId.trim() : '';
      const designation =
        typeof body.designation === 'string' && body.designation.trim()
          ? body.designation.trim()
          : 'Assistant Professor';
      const department = sanitizeBranch(body.department || body.branch);
      const requestedScopes = sanitizeScopes(body.requestedScopes);
      const onboardingNote =
        typeof body.onboardingNote === 'string' && body.onboardingNote.trim()
          ? body.onboardingNote.trim()
          : null;

      if (!employeeId) {
        return NextResponse.json(
          { error: 'Faculty / Employee ID is required for Faculty onboarding.' },
          { status: 400 }
        );
      }

      if (requestedScopes.length === 0) {
        return NextResponse.json(
          { error: 'Please select at least one branch & semester in Requested Teaching Scope.' },
          { status: 400 }
        );
      }

      updateData = {
        ...updateData,
        role: 'STUDENT',
        requestedRole: 'FACULTY',
        approvalStatus: 'PENDING',
        employeeId,
        designation,
        department,
        branch: department,
        semester: requestedScopes[0]?.semesters[0] || 3,
        requestedScopes,
        onboardingNote,
      };
      redirectTo = '/dashboard';
      clerkMetaPatch = {
        ...clerkMetaPatch,
        role: 'student',
        requestedRole: 'FACULTY',
        approvalStatus: 'PENDING',
        department,
        branch: department,
      };
    } else if (mode === 'ADMIN' || isMaster) {
      const designation =
        typeof body.designation === 'string' && body.designation.trim()
          ? body.designation.trim()
          : isMaster
          ? 'System Architect & Master Admin'
          : 'Department Admin';

      if (isMaster) {
        updateData = {
          ...updateData,
          role: 'ADMIN',
          isMasterAdmin: true,
          requestedRole: null,
          approvalStatus: 'APPROVED',
          designation,
          department: sanitizeBranch(body.department || 'CSE'),
          branch: sanitizeBranch(body.department || 'CSE'),
        };
        redirectTo = '/admin';
        clerkMetaPatch = {
          ...clerkMetaPatch,
          role: 'admin',
          isSuperAdmin: true,
          isMasterAdmin: true,
          approvalStatus: 'APPROVED',
        };
      } else {
        const employeeId = typeof body.employeeId === 'string' ? body.employeeId.trim() : '';
        const department =
          typeof body.department === 'string' && body.department.trim()
            ? body.department.trim().toUpperCase()
            : 'ADMINISTRATION';
        const onboardingNote =
          typeof body.onboardingNote === 'string' && body.onboardingNote.trim()
            ? body.onboardingNote.trim()
            : null;

        if (!employeeId) {
          return NextResponse.json(
            { error: 'Employee / Office ID is required for Admin verification.' },
            { status: 400 }
          );
        }

        updateData = {
          ...updateData,
          role: 'STUDENT',
          requestedRole: 'ADMIN',
          approvalStatus: 'PENDING',
          employeeId,
          designation,
          department,
          branch: VALID_BRANCHES.includes(department as BTechBranch) ? department : 'CSE',
          onboardingNote,
        };
        redirectTo = '/dashboard';
        clerkMetaPatch = {
          ...clerkMetaPatch,
          role: 'student',
          requestedRole: 'ADMIN',
          approvalStatus: 'PENDING',
          department,
        };
      }
    }

    let existingUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!existingUser && primaryEmail) {
      existingUser = await prisma.user.findFirst({
        where: { email: { equals: primaryEmail, mode: 'insensitive' } },
      });
    }

    const dbUser = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: updateData,
        })
      : await prisma.user.create({
          data: updateData as any,
        });

    try {
      const client = await clerkClient();
      const clerkUserRecord = await client.users.getUser(userId);
      const existingMeta = clerkUserRecord.publicMetadata || {};
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...existingMeta,
          ...clerkMetaPatch,
        },
      });
    } catch (clerkErr: any) {
      console.warn('[Profile API POST] Clerk metadata update note:', clerkErr?.message || clerkErr);
    }

    return NextResponse.json({
      success: true,
      redirectTo,
      approvalStatus: dbUser.approvalStatus,
      role: dbUser.role,
      requestedRole: dbUser.requestedRole,
      profile: dbUser,
    });
  } catch (err: any) {
    console.error('[Profile API POST] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save onboarding profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    if (body.mode) {
      return POST(req);
    }

    const rawBranch = typeof body.branch === 'string' ? body.branch.toUpperCase() : undefined;
    const branch: BTechBranch | undefined =
      rawBranch && VALID_BRANCHES.includes(rawBranch as BTechBranch)
        ? (rawBranch as BTechBranch)
        : undefined;

    const semester =
      body.semester !== undefined
        ? Math.min(8, Math.max(1, parseInt(body.semester, 10) || 3))
        : undefined;
    const passoutYear = body.passoutYear !== undefined ? parseInt(body.passoutYear, 10) : undefined;
    const universityRoll =
      body.universityRoll !== undefined
        ? typeof body.universityRoll === 'string'
          ? body.universityRoll.trim()
          : null
        : undefined;

    const user = await currentUser();
    const primaryEmail =
      user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
      user?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.username ||
      'SETGOI Member';

    let dbUser = null;
    try {
      let existingUser = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (!existingUser && primaryEmail) {
        existingUser = await prisma.user.findFirst({
          where: { email: { equals: primaryEmail, mode: 'insensitive' } },
        });
      }

      const isWhitelisted = isSuperAdminEmail(primaryEmail);

      if (existingUser) {
        dbUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            clerkId: userId,
            ...(branch ? { branch, department: branch } : {}),
            ...(semester !== undefined ? { semester } : {}),
            ...(passoutYear !== undefined ? { passoutYear } : {}),
            ...(universityRoll !== undefined ? { universityRoll } : {}),
            ...(isWhitelisted ? { role: 'ADMIN' } : {}),
          },
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: primaryEmail,
            fullName,
            role: isWhitelisted ? 'ADMIN' : 'STUDENT',
            degree: 'B.Tech',
            branch: branch || 'CSE',
            department: branch || 'CSE',
            semester: semester || 3,
            passoutYear: passoutYear || new Date().getFullYear() + 2,
            universityRoll: universityRoll || undefined,
            onboardingCompleted: true,
          },
        });
      }
    } catch (dbErr: any) {
      console.warn('[Profile API PATCH] Database write note:', dbErr?.message || dbErr);
    }

    try {
      const client = await clerkClient();
      const clerkUserRecord = await client.users.getUser(userId);
      const existingMeta = clerkUserRecord.publicMetadata || {};

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...existingMeta,
          ...(branch ? { branch } : {}),
          ...(semester !== undefined ? { semester } : {}),
          ...(passoutYear !== undefined ? { passoutYear } : {}),
          ...(universityRoll !== undefined ? { universityRoll } : {}),
        },
      });
    } catch (clerkErr: any) {
      console.warn('[Profile API PATCH] Clerk metadata update note:', clerkErr?.message || clerkErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Academic profile updated successfully',
      profile: {
        branch: branch || dbUser?.branch,
        semester: semester || dbUser?.semester,
        passoutYear: passoutYear || dbUser?.passoutYear,
        universityRoll: universityRoll !== undefined ? universityRoll : dbUser?.universityRoll,
      },
    });
  } catch (err: any) {
    console.error('[Profile API PATCH] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update profile' }, { status: 500 });
  }
}
