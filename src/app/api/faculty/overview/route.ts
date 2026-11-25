import { NextResponse } from 'next/server';
import { getCurrentAuthUser, syncAndGetCurrentUser, canFacultyAccessScope } from '@/lib/rbac';
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

    const syncedUser = await syncAndGetCurrentUser();
    const isFacultyOnly = caller.role === 'faculty';

    const [
      rawNotesList,
      forumPosts,
      rawNotices,
    ] = await Promise.all([
      prisma.note.findMany({
        orderBy: [{ verified: 'asc' }, { createdAt: 'desc' }],
        include: {
          uploader: { select: { fullName: true, email: true, branch: true } },
        },
        take: 80,
      }),
      prisma.forumPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { fullName: true, email: true, branch: true } },
          replies: {
            select: { id: true, isOfficialAnswer: true },
          },
        },
        take: 60,
      }),
      prisma.notice.findMany({
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 30,
      }),
    ]);

    const pendingNotesList = isFacultyOnly
      ? rawNotesList.filter((n) => canFacultyAccessScope(syncedUser, n.branch, n.semester))
      : rawNotesList;
    const scopedPosts = isFacultyOnly
      ? forumPosts.filter((p) =>
          canFacultyAccessScope(syncedUser, p.branch || 'CSE', p.semester || 3)
        )
      : forumPosts;
    const activeNotices = isFacultyOnly
      ? rawNotices.filter(
          (n) =>
            n.targetBranch === 'ALL' ||
            canFacultyAccessScope(syncedUser, n.targetBranch, n.targetSemester || 3)
        )
      : rawNotices;

    const totalNotes = pendingNotesList.length;
    const verifiedNotes = pendingNotesList.filter((n) => n.verified).length;
    const pendingCount = pendingNotesList.filter((n) => !n.verified).length;
    const unansweredDoubtsCount = scopedPosts.filter(
      (p) => !p.replies.some((r) => r.isOfficialAnswer)
    ).length;

    return NextResponse.json({
      success: true,
      assignedScopes: Array.isArray(syncedUser?.assignedScopes) ? syncedUser.assignedScopes : [],
      kpis: {
        uploadedNotes: verifiedNotes,
        totalNotes,
        pendingSubmissions: pendingCount,
        unansweredDoubts: unansweredDoubtsCount,
        activeNotices: activeNotices.length,
      },
      notesQueue: pendingNotesList.slice(0, 40),
      notices: activeNotices.slice(0, 20),
    });
  } catch (err: any) {
    console.error('[Faculty Overview GET] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch faculty overview' },
      { status: 500 }
    );
  }
}
