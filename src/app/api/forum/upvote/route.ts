import { NextRequest, NextResponse } from 'next/server';
import { forumStore } from '@/modules/forum/forum-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, replyId } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'postId is required' },
        { status: 400 }
      );
    }

    const result = forumStore.toggleUpvote(postId, replyId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error toggling upvote:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update upvote' },
      { status: 500 }
    );
  }
}
