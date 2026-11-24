import { ReactNode } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { isSuperAdminEmail, normalizeUserRole } from '@/lib/rbac';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // 1. Check development preview cookie bypass
  try {
    const cookieStore = await cookies();
    const previewRole =
      cookieStore.get('settech_preview_role')?.value ||
      cookieStore.get('sanakahub_preview_role')?.value;
    if (previewRole === 'admin') {
      return <>{children}</>;
    }
  } catch {}

  // 2. Authentication check
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in?redirect_url=/admin');
  }

  const user = await currentUser();
  const primaryEmail =
    user?.emailAddresses.find((e) => e.id === user?.primaryEmailAddressId)?.emailAddress ||
    user?.emailAddresses[0]?.emailAddress;

  // 3. Super admins by email whitelist are always authorized
  if (isSuperAdminEmail(primaryEmail)) {
    return <>{children}</>;
  }

  // 4. Resolve effective role from Clerk and Neon DB
  const metadata = (user?.publicMetadata || {}) as { role?: string; isSuperAdmin?: boolean };
  if (metadata.isSuperAdmin || normalizeUserRole(metadata.role) === 'admin') {
    return <>{children}</>;
  }

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
  } catch (err) {
    console.warn('[admin/layout] Neon DB check note:', err);
  }

  const role = normalizeUserRole(dbUser?.role);
  if (role !== 'admin') {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
