import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentAuthUser } from '@/lib/rbac';
import { OnboardingWizard } from './OnboardingWizard';

export const metadata = {
  title: 'B.Tech Onboarding | SETTech',
  description: 'Configure your MAKAUT B.Tech engineering department, semester, and personal academic workspace.',
};

export const dynamic = 'force-dynamic';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ preview?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isDevPreview = resolvedParams.preview === 'true';

  const user = await getCurrentAuthUser();

  // If not logged in and not previewing, redirect to sign-in
  if (!user.isAuthenticated && !isDevPreview) {
    redirect('/sign-in?redirect_url=/onboarding');
  }

  // If already marked completed in metadata or DB, and not in preview mode, redirect to student portal
  if (!isDevPreview && user.onboardingCompleted) {
    redirect('/student');
  }

  if (!isDevPreview && user.userId) {
    // Neon Postgres DB fallback verification
    try {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.userId },
      });
      if (dbUser?.onboardingCompleted) {
        redirect('/student');
      }
    } catch (err: any) {
      console.warn('[onboarding-page] DB check warning:', err?.message || err);
    }
  }

  const initialEmail = user.email || 'student@setgoi.ac.in';
  const initialName = user.fullName || 'B.Tech Scholar';

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#09090B] flex flex-col justify-between selection:bg-blue-100 selection:text-blue-700">
      <OnboardingWizard
        clerkId={user.userId || 'dev_preview_user'}
        initialEmail={initialEmail}
        initialName={initialName}
      />
    </main>
  );
}
