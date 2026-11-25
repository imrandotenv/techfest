import { NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/faculty/overview
 * Faculty or Admin only: Returns real KPIs, pending note queue, and recent notices.
 */
export async function GET() {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required.' },
        { status: 403 }
      );
    }

    const [
      totalNotes,
      verifiedNotes,
      pendingNotesList,
      forumPosts,
      activeNotices,
    ] = await Promise.all([
      prisma.note.count(),
      prisma.note.count({ where: { verified: true } }),
      prisma.note.findMany({
        orderBy: [{ verified: 'asc' }, { createdAt: 'desc' }],
        include: {
          uploader: { select: { fullName: true, email: true, branch: true } },
        },
        take: 30,
      }),
      prisma.forumPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { fullName: true, email: true, branch: true } },
          replies: {
            select: { id: true, isOfficialAnswer: true },
          },
        },
        take: 30,
      }),
      prisma.notice.findMany({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 15,
      }),
    ]);

    const pendingCount = pendingNotesList.filter((n) => !n.verified).length;
    const unansweredDoubtsCount = forumPosts.filter(
      (p) => !p.replies.some((r) => r.isOfficialAnswer)
    ).length;

    return NextResponse.json({
      success: true,
      kpis: {
        uploadedNotes: verifiedNotes,
        totalNotes,
        pendingSubmissions: pendingCount,
        unansweredDoubts: unansweredDoubtsCount,
        activeNotices: activeNotices.length,
      },
      notesQueue: pendingNotesList,
      notices: activeNotices,
    });
  } catch (err: any) {
    console.error('[Faculty Overview GET] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch faculty overview' },
      { status: 500 }
    );
  }
}
