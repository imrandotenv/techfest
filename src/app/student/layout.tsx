import { ReactNode } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isSuperAdminEmail } from '@/lib/rbac';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function StudentLayout({ children }: { children: ReactNode }) {
  // 1. Check development preview cookie bypass (strictly disabled in production)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const cookieStore = await cookies();
      const previewRole =
        cookieStore.get('settech_preview_role')?.value ||
        cookieStore.get('sanakahub_preview_role')?.value;
      if (previewRole) {
        return <>{children}</>;
      }
    } catch {}
  }

  // 2. Authentication check
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in?redirect_url=/student');
  }

  const user = await currentUser();
  const primaryEmail =
    user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
    user?.emailAddresses[0]?.emailAddress;

  // 3. Super admins are never blocked by onboarding
  if (isSuperAdminEmail(primaryEmail)) {
    return <>{children}</>;
  }

  // 4. Check Clerk metadata first
  const metadata = (user?.publicMetadata || {}) as {
    onboardingCompleted?: boolean;
    role?: string;
    branch?: string;
    semester?: number;
  };
  const isCompletedInClerk = Boolean(metadata.onboardingCompleted);

  // 5. Check Neon PostgreSQL
  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
  } catch (err) {
    console.warn('[student/layout] Neon DB check note:', err);
  }

  const isCompletedInDb = Boolean(dbUser?.onboardingCompleted);

  // If user completed onboarding in Clerk but record is missing in Neon DB, self-heal in background
  if (isCompletedInClerk && !dbUser) {
    try {
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: { onboardingCompleted: true },
        create: {
          clerkId: userId,
          email: primaryEmail || `${userId}@student.setgoi.ac.in`,
          fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'SETGOI Student',
          role: 'STUDENT',
          degree: 'B.Tech',
          branch: metadata.branch || 'CSE',
          semester: Number(metadata.semester) || 3,
          onboardingCompleted: true,
        },
      });
    } catch (healErr) {
      console.warn('[student/layout] Self-heal note:', healErr);
    }
  }

  // Only redirect to /onboarding if NEITHER Clerk NOR DB shows completion
  if (!isCompletedInClerk && !isCompletedInDb) {
    redirect('/onboarding');
  }

  return <>{children}</>;
}
