import React from 'react';
import { requireRole, syncAndGetCurrentUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { BTechBranch } from '@/config/curriculum';
import { AcademicStats } from '@/app/api/student/stats/route';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { AdminViewRouter } from './AdminViewRouter';
import { VerificationPendingScreen } from '@/components/PendingVerificationBanner';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Executive Admin Console | SETTech',
  description: 'SETGOI Super Admin Control Panel & Role Management.',
};

export default async function AdminPage() {
  const syncedUser = await syncAndGetCurrentUser();
  if (
    syncedUser &&
    syncedUser.approvalStatus === 'PENDING' &&
    syncedUser.requestedRole === 'ADMIN'
  ) {
    return (
      <VerificationPendingScreen
        requestedRole={syncedUser.requestedRole}
        department={syncedUser.department}
        designation={syncedUser.designation}
      />
    );
  }

  const user = await requireRole(['admin'], {
    redirectTo: '/sign-in?redirect_url=/admin',
  });

  const adminName = user.fullName || 'Super Admin';
  const adminEmail = user.email || 'admin@setgoi.ac.in';
  const branch = (user.branch?.toUpperCase() as BTechBranch) || 'CSE';
  const semester = Number(user.semester) || 3;
  const passoutYear = Number(user.passoutYear) || 2028;

  let stats: AcademicStats = {
    cgpa: 8.84,
    targetSgpa: 9.10,
    attendancePct: 81.4,
    attendedClasses: 48,
    totalClasses: 59,
  };
  let liveNotices: any[] = [];

  try {
    const [dbUser, notices] = await Promise.all([
      user.userId
        ? prisma.user.findUnique({
            where: { clerkId: user.userId },
            select: { academicStats: true },
          })
        : Promise.resolve(null),
      prisma.notice.findMany({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 4,
        include: { author: { select: { fullName: true, role: true } } },
      }),
    ]);
    if (dbUser?.academicStats) {
      stats = { ...stats, ...(dbUser.academicStats as unknown as AcademicStats) };
    }
    liveNotices = notices;
  } catch (err) {
    console.warn('[admin/page] DB preview fetch note:', err);
  }

  return (
    <WorkspaceShell
      breadcrumbs={[
        { label: 'SETTech', href: '/' },
        { label: 'Super Admin', href: '/admin' },
        { label: 'System Console' },
      ]}
      roleTitle="Super Admin"
      currentRole="admin"
      userName={adminName}
      userEmail={adminEmail}
      primaryAction={{
        label: '+ Manage Users',
        href: '/admin#users',
        variant: 'purple',
      }}
    >
      <AdminViewRouter
        currentAdminId={user.userId || ''}
        adminName={adminName}
        adminEmail={adminEmail}
        isMasterAdmin={
          Boolean(syncedUser?.isMasterAdmin) ||
          adminEmail.trim().toLowerCase() === 'mdimransps955@gmail.com'
        }
        studentPreviewProps={{
          studentName: adminName,
          branch,
          semester,
          passoutYear,
          universityRoll: user.universityRoll,
          stats,
          liveNotices,
        }}
      />
    </WorkspaceShell>
  );
}
