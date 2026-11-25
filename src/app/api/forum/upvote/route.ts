import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * POST /api/forum/upvote
 * Toggles upvote cleanly per authenticated user in Neon PostgreSQL (prevents duplicate votes).
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Sign in to upvote posts' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { postId, replyId } = body;

    if (!postId && !replyId) {
      return NextResponse.json(
        { success: false, error: 'postId or replyId is required' },
        { status: 400 }
      );
    }

    if (replyId) {
      const existingVote = await prisma.forumVote.findUnique({
        where: { userId_replyId: { userId, replyId } },
      });

      if (existingVote) {
        await prisma.$transaction([
          prisma.forumVote.delete({ where: { id: existingVote.id } }),
          prisma.forumReply.update({
            where: { id: replyId },
            data: { upvotes: { decrement: 1 } },
          }),
        ]);
        const updated = await prisma.forumReply.findUnique({ where: { id: replyId }, select: { upvotes: true } });
        revalidatePath('/forum');
        return NextResponse.json({ success: true, upvoted: false, upvotesCount: Math.max(0, updated?.upvotes || 0) });
      } else {
        await prisma.$transaction([
          prisma.forumVote.create({ data: { userId, replyId } }),
          prisma.forumReply.update({
            where: { id: replyId },
            data: { upvotes: { increment: 1 } },
          }),
        ]);
        const updated = await prisma.forumReply.findUnique({ where: { id: replyId }, select: { upvotes: true } });
        revalidatePath('/forum');
        return NextResponse.json({ success: true, upvoted: true, upvotesCount: updated?.upvotes || 1 });
      }
    }

    const existingPostVote = await prisma.forumVote.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingPostVote) {
      await prisma.$transaction([
        prisma.forumVote.delete({ where: { id: existingPostVote.id } }),
        prisma.forumPost.update({
          where: { id: postId },
          data: { upvotes: { decrement: 1 } },
        }),
      ]);
      const updated = await prisma.forumPost.findUnique({ where: { id: postId }, select: { upvotes: true } });
      revalidatePath('/forum');
      return NextResponse.json({ success: true, upvoted: false, upvotesCount: Math.max(0, updated?.upvotes || 0) });
    } else {
      await prisma.$transaction([
        prisma.forumVote.create({ data: { userId, postId } }),
        prisma.forumPost.update({
          where: { id: postId },
          data: { upvotes: { increment: 1 } },
        }),
      ]);
      const updated = await prisma.forumPost.findUnique({ where: { id: postId }, select: { upvotes: true } });
      revalidatePath('/forum');
      return NextResponse.json({ success: true, upvoted: true, upvotesCount: updated?.upvotes || 1 });
    }
  } catch (error: any) {
    console.error('[Forum Upvote POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update upvote' },
      { status: 500 }
    );
  }
}
