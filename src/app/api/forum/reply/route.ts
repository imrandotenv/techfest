import { NextRequest, NextResponse } from 'next/server';
import { forumStore } from '@/modules/forum/forum-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      postId,
      content,
      authorId,
      authorName,
      authorRole,
      authorDepartment,
      isOfficialAnswer,
      parentId,
    } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: 'postId and content are required' },
        { status: 400 }
      );
    }

    const result = forumStore.createReply({
      postId,
      content,
      authorId: authorId || 'anon-reply-user',
      authorName: authorName || 'SETGOI Member',
      authorRole: authorRole || 'student',
      authorDepartment,
      isOfficialAnswer: Boolean(isOfficialAnswer),
      parentId: parentId || null,
    });

    return NextResponse.json(
      {
        success: true,
        reply: result.reply,
        post: result.post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit reply' },
      { status: 500 }
    );
  }
}
