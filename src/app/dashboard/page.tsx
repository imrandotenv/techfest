import { redirect } from 'next/navigation';
import { getCurrentAuthUser } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export default async function DashboardRedirectPage() {
  const user = await getCurrentAuthUser();

  if (!user.isAuthenticated || !user.userId) {
    redirect('/sign-in?redirect_url=/dashboard');
  }

  if (user.role === 'admin') {
    redirect('/admin');
  } else if (user.role === 'faculty') {
    redirect('/faculty');
  } else {
    redirect('/student');
  }
}
