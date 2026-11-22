import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AuthCallbackPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  const metadata = (user?.publicMetadata || {}) as {
    onboardingCompleted?: boolean;
    role?: string;
  };

  let onboardingCompleted = Boolean(metadata.onboardingCompleted);
  let userRole = (metadata.role || 'student').toLowerCase();

  // Database fallback check if Clerk session metadata has not synchronized yet
  if (!onboardingCompleted) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
      if (dbUser?.onboardingCompleted) {
        onboardingCompleted = true;
        if (dbUser.role) userRole = dbUser.role.toLowerCase();
      }
    } catch (e: any) {
      console.warn('[auth-callback] Neon DB fallback note:', e?.message || e);
    }
  }

  if (!onboardingCompleted) {
    redirect('/onboarding');
  }

  if (userRole === 'admin') redirect('/admin');
  if (userRole === 'faculty' || userRole === 'college') redirect('/faculty');
  redirect('/student');
}
