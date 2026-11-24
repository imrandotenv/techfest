import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isSuperAdminEmail, resolveAndHealUser } from '@/lib/rbac';

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

  // 1. Super Admin Check: Immediate elevation, Dev-to-Prod clerkId healing & direct routing to /admin
  if (isSuperAdminEmail(primaryEmail)) {
    try {
      await resolveAndHealUser({
        clerkUserId: userId,
        email: primaryEmail,
        fullName,
        autoCreate: true,
      });
    } catch (err) {
      console.warn('[auth-callback] Super Admin bootstrap warning:', err);
    }

    redirect('/admin');
  }

  // 2. Regular User: Check Neon DB for existing user & onboarding status (with Dev-to-Prod healing)
  let dbUser = null;
  try {
    dbUser = await resolveAndHealUser({
      clerkUserId: userId,
      email: primaryEmail,
      fullName,
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
        isSuperAdmin: userRole === 'ADMIN',
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
