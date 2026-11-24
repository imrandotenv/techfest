import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isSuperAdminEmail } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export default async function AuthCallbackPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const primaryEmail =
    user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
    user?.emailAddresses[0]?.emailAddress ||
    null;
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'SETGOI Member';

  // 1. Super Admin Check: Immediate elevation & direct routing to /admin
  if (isSuperAdminEmail(primaryEmail)) {
    try {
      // Ensure role = "ADMIN" and onboardingCompleted in Neon DB
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          role: 'ADMIN',
          email: primaryEmail || `${userId}@admin.setgoi.ac.in`,
          fullName,
          onboardingCompleted: true,
        },
        create: {
          clerkId: userId,
          email: primaryEmail || `${userId}@admin.setgoi.ac.in`,
          fullName,
          role: 'ADMIN',
          degree: 'B.Tech',
          onboardingCompleted: true,
        },
      });

      // Ensure role = "admin" in Clerk publicMetadata
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: 'admin',
          isSuperAdmin: true,
          onboardingCompleted: true,
        },
      });
    } catch (err) {
      console.warn('[auth-callback] Super Admin bootstrap warning:', err);
    }

    redirect('/admin');
  }

  // 2. Regular User: Check Neon DB for existing user & onboarding status
  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
  } catch (e: any) {
    console.warn('[auth-callback] Neon DB query note:', e?.message || e);
  }

  // If no record exists OR onboardingCompleted === false -> route strictly to /onboarding
  if (!dbUser || !dbUser.onboardingCompleted) {
    redirect('/onboarding');
  }

  // 3. User has completed onboarding: sync Clerk session metadata & route to role dashboard
  const userRole = (dbUser.role || 'STUDENT').toUpperCase();

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: userRole.toLowerCase(),
        onboardingCompleted: true,
        branch: dbUser.branch || undefined,
        semester: dbUser.semester || undefined,
        passoutYear: dbUser.passoutYear || undefined,
        universityRoll: dbUser.universityRoll || undefined,
      },
    });
  } catch (clerkErr) {
    console.warn('[auth-callback] Clerk metadata sync note:', clerkErr);
  }

  if (userRole === 'ADMIN') {
    redirect('/admin');
  } else if (userRole === 'FACULTY') {
    redirect('/faculty');
  } else {
    redirect('/student');
  }
}
