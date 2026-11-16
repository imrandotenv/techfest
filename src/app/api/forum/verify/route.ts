import { NextRequest, NextResponse } from 'next/server';
import { forumStore } from '@/modules/forum/forum-service';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, replyId, verifierId, verifierName, verifierRole } = body;

    if (!postId || !replyId) {
      return NextResponse.json(
        { success: false, error: 'postId and replyId are required' },
        { status: 400 }
      );
    }

    if (!verifierRole || !['college', 'admin'].includes(verifierRole)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Restricted action: Only College Faculty or Admin accounts can mark or verify an Official Faculty Answer.',
        },
        { status: 403 }
      );
    }

    const result = forumStore.toggleOfficialAnswer(postId, replyId, {
      id: verifierId || 'verifier-user',
      name: verifierName || 'Faculty Verifier',
      role: verifierRole,
    });

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
