import { NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/admin/overview
 * Admin-only: Real KPI counts, recent audit logs, and DB/Clerk health status.
 */
export async function GET() {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin clearance required.' },
        { status: 403 }
      );
    }

    const [
      totalStudents,
      activeFaculty,
      totalAdmins,
      totalNotes,
      verifiedNotes,
      pendingNotes,
      totalForumPosts,
      totalNotices,
      recentAuditLogs,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'FACULTY' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.note.count(),
      prisma.note.count({ where: { verified: true } }),
      prisma.note.count({ where: { verified: false } }),
      prisma.forumPost.count(),
      prisma.notice.count(),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, fullName: true, email: true, role: true, branch: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      kpis: {
        totalStudents,
        activeFaculty,
        totalAdmins,
        totalNotes,
        verifiedNotes,
        pendingNotes,
        totalForumPosts,
        totalNotices,
      },
      recentAuditLogs,
      recentUsers,
      health: {
        neonDb: 'connected',
        clerkAuth: Boolean(process.env.CLERK_SECRET_KEY) ? 'connected' : 'degraded',
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[Admin Overview API] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to load admin overview' },
      { status: 500 }
    );
  }
}
