import { NextRequest, NextResponse } from 'next/server';
import { forumStore } from '@/modules/forum/forum-service';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    // Security: Strict RBAC check - only actual authenticated faculty or admin
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Restricted action: Only College Faculty or Admin accounts can mark or verify an Official Faculty Answer.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { postId, replyId } = body;

    if (!postId || !replyId) {
      return NextResponse.json(
        { success: false, error: 'postId and replyId are required' },
        { status: 400 }
      );
    }

    const result = forumStore.toggleOfficialAnswer(postId, replyId, {
      id: caller.userId || 'verifier-user',
      name: caller.fullName || 'SETGOI Faculty',
      role: caller.role === 'admin' ? 'admin' : 'college',
    });

    // Also update in Neon Postgres if record exists
    try {
      await prisma.forumReply.updateMany({
        where: { id: replyId },
        data: { isOfficialAnswer: result.reply.isOfficialAnswer },
      });
    } catch (dbErr) {
      console.warn('[Forum Verify API] Neon DB sync note:', dbErr);
    }

    return NextResponse.json({
      success: true,
      reply: result.reply,
      post: result.post,
      message: result.reply.isOfficialAnswer
        ? 'Answer successfully verified as Official Faculty Answer.'
        : 'Official verification removed.',
    });
  } catch (error: any) {
    console.error('Error verifying official answer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify answer' },
      { status: 500 }
    );
  }
}
