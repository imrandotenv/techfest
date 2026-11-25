import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Restricted action: Only College Faculty or Admin accounts can verify Official Faculty Answers.',
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { replyId } = body;

    if (!replyId) {
      return NextResponse.json({ success: false, error: 'replyId is required' }, { status: 400 });
    }

    const existing = await prisma.forumReply.findUnique({ where: { id: replyId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Reply not found' }, { status: 404 });
    }

    const updated = await prisma.forumReply.update({
      where: { id: replyId },
      data: { isOfficialAnswer: !existing.isOfficialAnswer },
    });

    revalidatePath('/forum');

    return NextResponse.json({
      success: true,
      reply: updated,
      message: updated.isOfficialAnswer
        ? 'Answer successfully verified as Official Faculty Answer.'
        : 'Official verification removed.',
    });
  } catch (error: any) {
    console.error('[Forum Verify PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to verify answer' },
      { status: 500 }
    );
  }
}
