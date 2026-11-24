import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { BTechBranch } from '@/config/curriculum';
import { resolveAndHealUser, isSuperAdminEmail } from '@/lib/rbac';

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
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'SETGOI Member';
    const metadata = (user?.publicMetadata || {}) as Record<string, any>;

    // Try reading from Postgres first (auto-healing Dev-to-Prod clerkId by email)
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
      degree: dbUser?.degree || metadata.degree || 'B.Tech',
      branch: (dbUser?.branch || metadata.branch || 'CSE') as BTechBranch,
      semester: dbUser?.semester || metadata.semester || 3,
      passoutYear: dbUser?.passoutYear || metadata.passoutYear || new Date().getFullYear() + 2,
      universityRoll: dbUser?.universityRoll || metadata.universityRoll || null,
      onboardingCompleted: dbUser?.onboardingCompleted ?? metadata.onboardingCompleted ?? false,
    };

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error('[Profile API GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rawBranch = typeof body.branch === 'string' ? body.branch.toUpperCase() : undefined;
    const branch: BTechBranch | undefined =
      rawBranch && ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'AIML'].includes(rawBranch)
        ? (rawBranch as BTechBranch)
        : undefined;

    const semester = body.semester !== undefined ? Math.min(8, Math.max(1, parseInt(body.semester, 10) || 3)) : undefined;
    const passoutYear = body.passoutYear !== undefined ? parseInt(body.passoutYear, 10) : undefined;
    const universityRoll = body.universityRoll !== undefined ? (typeof body.universityRoll === 'string' ? body.universityRoll.trim() : null) : undefined;

    const user = await currentUser();
    const primaryEmail =
      user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
      user?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'SETGOI Member';

    // 1. Update Neon Postgres (auto-healing Dev-to-Prod clerkId by email)
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
            ...(branch ? { branch } : {}),
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

    // 2. Update Clerk Metadata
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
