import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { BTechBranch } from '@/config/curriculum';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const rawBranch = typeof body.branch === 'string' ? body.branch.toUpperCase() : 'CSE';
    const branch: BTechBranch = ['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'AIML'].includes(rawBranch)
      ? (rawBranch as BTechBranch)
      : 'CSE';

    const semester = Math.min(8, Math.max(1, parseInt(body.semester, 10) || 3));
    const passoutYear = parseInt(body.passoutYear, 10) || new Date().getFullYear() + 2;
    const universityRoll = typeof body.universityRoll === 'string' ? body.universityRoll.trim() : null;

    const user = await currentUser();
    const primaryEmail =
      user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
      user?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'SETGOI Student';

    // 1. Persist to Neon Postgres
    let dbUser = null;
    try {
      dbUser = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          email: primaryEmail,
          fullName,
          branch,
          semester,
          passoutYear,
          universityRoll: universityRoll || undefined,
          degree: 'B.Tech',
          onboardingCompleted: true,
        },
        create: {
          clerkId: userId,
          email: primaryEmail,
          fullName,
          role: 'STUDENT',
          degree: 'B.Tech',
          branch,
          semester,
          passoutYear,
          universityRoll: universityRoll || undefined,
          onboardingCompleted: true,
        },
      });
    } catch (dbErr: any) {
      console.warn('[Onboarding API] Neon Postgres query note:', dbErr?.message || dbErr);
    }

    // 2. Persist to Clerk publicMetadata
    try {
      const client = await clerkClient();
      const clerkUserRecord = await client.users.getUser(userId);
      const existingMeta = clerkUserRecord.publicMetadata || {};

      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...existingMeta,
          onboardingCompleted: true,
          degree: 'B.Tech',
          branch,
          semester,
          passoutYear,
          universityRoll: universityRoll || null,
          role: existingMeta.role || 'student',
        },
      });
    } catch (clerkErr: any) {
      console.warn('[Onboarding API] Clerk publicMetadata update note:', clerkErr?.message || clerkErr);
    }

    return NextResponse.json({
      success: true,
      onboardingCompleted: true,
      profile: {
        clerkId: userId,
        email: primaryEmail,
        fullName,
        degree: 'B.Tech',
        branch,
        semester,
        passoutYear,
        universityRoll,
        onboardingCompleted: true,
      },
    });
  } catch (err: any) {
    console.error('[Onboarding API] Unexpected failure:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
