import React from 'react';
import { requireRole } from '@/lib/rbac';
import { BTechBranch } from '@/config/curriculum';
import { prisma } from '@/lib/prisma';
import { AcademicStats } from '@/app/api/student/stats/route';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { StudentCockpitView } from '@/components/StudentCockpitView';
import { PendingVerificationBanner } from '@/components/PendingVerificationBanner';

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
  let pendingInfo: {
    approvalStatus: string;
    requestedRole: string | null;
    department: string | null;
    designation: string | null;
  } | null = null;

  try {
    if (user.userId) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.userId },
        select: {
          academicStats: true,
          approvalStatus: true,
          requestedRole: true,
          department: true,
          designation: true,
        },
      });
      if (dbUser?.academicStats) {
        stats = { ...stats, ...(dbUser.academicStats as unknown as AcademicStats) };
      }
      if (dbUser?.approvalStatus === 'PENDING') {
        pendingInfo = {
          approvalStatus: dbUser.approvalStatus,
          requestedRole: dbUser.requestedRole,
          department: dbUser.department,
          designation: dbUser.designation,
        };
      }
    }

    const allNotices = await prisma.notice.findMany({
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: 40,
      include: {
        author: { select: { fullName: true, role: true } },
      },
    });

    liveNotices = allNotices
      .filter((n) => {
        const branches = (n.targetBranches?.length ? n.targetBranches : [n.targetBranch]).map(
          (b) => b.toUpperCase()
        );
        const branchOk = branches.includes('ALL') || branches.includes(branch.toUpperCase());
        if (!branchOk) return false;
        const sems = n.targetSemesters?.length
          ? n.targetSemesters
          : n.targetSemester
          ? [n.targetSemester]
          : [];
        return sems.length === 0 || sems.map(Number).includes(semester);
      })
      .slice(0, 6);
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
      {pendingInfo && (
        <div className="mb-6">
          <PendingVerificationBanner
            requestedRole={pendingInfo.requestedRole}
            department={pendingInfo.department}
            designation={pendingInfo.designation}
          />
        </div>
      )}
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
