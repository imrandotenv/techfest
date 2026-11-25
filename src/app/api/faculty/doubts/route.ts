import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/faculty/doubts
 * Faculty or Admin only: Returns student forum questions with official-answer status.
 */
export async function GET(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: Faculty or Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const branch = (searchParams.get('branch') || 'ALL').toUpperCase();
    const filter = searchParams.get('filter') || 'unanswered'; // 'unanswered' | 'all'

    const posts = await prisma.forumPost.findMany({
      where: {
        ...(branch !== 'ALL' ? { branch } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { fullName: true, email: true, branch: true, semester: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { fullName: true, role: true } },
          },
        },
      },
      take: 40,
    });

    const enriched = posts.map((p) => ({
      ...p,
      hasOfficialAnswer: p.replies.some((r) => r.isOfficialAnswer),
    }));

    const result =
      filter === 'unanswered'
        ? enriched.filter((p) => !p.hasOfficialAnswer)
        : enriched;

    return NextResponse.json({ success: true, doubts: result });
  } catch (err: any) {
    console.error('[Faculty Doubts GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load doubts' }, { status: 500 });
  }
}

/**
 * POST /api/faculty/doubts
 * Faculty or Admin only: Posts an Official Faculty Answer to a student forum thread.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || !caller.userId || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: Faculty or Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { postId, content } = body;

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: 'postId and answer content are required.' }, { status: 400 });
    }

    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: 'Forum thread not found.' }, { status: 404 });
    }

    const dbUser = await prisma.user.upsert({
      where: { clerkId: caller.userId },
      update: {
        fullName: caller.fullName || 'SETGOI Faculty',
        role: caller.role.toUpperCase(),
      },
      create: {
        clerkId: caller.userId,
        email: caller.email || `${caller.userId}@faculty.setgoi.ac.in`,
        fullName: caller.fullName || 'SETGOI Faculty',
        role: caller.role.toUpperCase(),
        degree: 'B.Tech',
        onboardingCompleted: true,
      },
    });

    const reply = await prisma.forumReply.create({
      data: {
        postId,
        content: content.trim(),
        authorId: dbUser.id,
        isOfficialAnswer: true,
      },
      include: {
        author: { select: { fullName: true, role: true } },
      },
    });

    await recordAuditLog({
      actorId: caller.userId,
      actor: caller.email || caller.fullName || 'Faculty',
      action: 'OFFICIAL_DOUBT_ANSWERED',
      target: post.title,
      details: `Posted Official Faculty Answer on thread ${post.id}`,
    });

    return NextResponse.json({ success: true, reply }, { status: 201 });
  } catch (err: any) {
    console.error('[Faculty Doubts POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to post official answer' }, { status: 500 });
  }
}
