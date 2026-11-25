import React from 'react';
import { requireRole } from '@/lib/rbac';
import { BTechBranch } from '@/config/curriculum';
import { prisma } from '@/lib/prisma';
import { AcademicStats } from '@/app/api/student/stats/route';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { StudentCockpitView } from '@/components/StudentCockpitView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student Academic Workspace | SETTech',
  description: 'Centralized B.Tech student academic cockpit for SETGOI Durgapur.',
};

export default async function StudentWorkspacePage() {
  const user = await requireRole(['student', 'faculty', 'admin'], {
    redirectTo: '/sign-in?redirect_url=/student',
  });

  const studentName = user.fullName || 'SETGOI Engineer';
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
    if (user.userId) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.userId },
        select: { academicStats: true },
      });
      if (dbUser?.academicStats) {
        stats = { ...stats, ...(dbUser.academicStats as unknown as AcademicStats) };
      }
    }

    liveNotices = await prisma.notice.findMany({
      where: {
        OR: [{ targetBranch: 'ALL' }, { targetBranch: branch }],
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: 4,
      include: {
        author: { select: { fullName: true, role: true } },
      },
    });
  } catch (dbErr) {
    console.warn('[student/page] Neon read note:', dbErr);
  }

  return (
    <WorkspaceShell
      breadcrumbs={[
        { label: 'SETTech', href: '/' },
        { label: 'Student Workspace', href: '/student' },
        { label: 'Academic Cockpit' },
      ]}
      roleTitle="Student"
      currentRole="student"
      userName={studentName}
      userEmail={user.email || undefined}
      primaryAction={{
        label: '+ Upload Note',
        href: '/notes?action=upload',
        variant: 'primary',
      }}
    >
      <StudentCockpitView
        studentName={studentName}
        branch={branch}
        semester={semester}
        passoutYear={passoutYear}
        universityRoll={user.universityRoll}
        stats={stats}
        liveNotices={liveNotices}
      />
    </WorkspaceShell>
  );
}
