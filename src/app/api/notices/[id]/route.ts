import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser, syncAndGetCurrentUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * PATCH /api/notices/[id]
 * Strictly the notice's authorId or any ADMIN.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Notice not found.' }, { status: 404 });
    }

    const syncedUser = await syncAndGetCurrentUser();
    const isOwner = syncedUser && existing.authorId === syncedUser.id;
    if (caller.role !== 'admin' && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: Only the notice author or an Admin can edit this notice.' },
        { status: 403 }
      );
    }

    const updated = await prisma.notice.update({
      where: { id },
      data: {
        ...(typeof body.title === 'string' && body.title.trim() ? { title: body.title.trim() } : {}),
        ...(typeof body.content === 'string' && body.content.trim() ? { content: body.content.trim() } : {}),
        ...(typeof body.category === 'string' ? { category: body.category.toUpperCase().trim() } : {}),
        ...(typeof body.targetBranch === 'string' ? { targetBranch: body.targetBranch.toUpperCase().trim() } : {}),
        ...(typeof body.isPinned === 'boolean' ? { isPinned: body.isPinned } : {}),
      },
      include: {
        author: { select: { id: true, fullName: true, role: true } },
      },
    });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Faculty/Admin',
      action: 'NOTICE_UPDATED',
      target: updated.title,
      details: `Updated notice (${updated.category}, target: ${updated.targetBranch}, pinned: ${updated.isPinned})`,
    });

    return NextResponse.json({ success: true, notice: updated });
  } catch (err: any) {
    console.error('[Notice PATCH] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update notice' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notices/[id]
 * Strictly FACULTY or ADMIN only.
 * Removes an official notice.
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required to delete notices.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      return NextResponse.json({ error: 'Notice not found.' }, { status: 404 });
    }

    const syncedUser = await syncAndGetCurrentUser();
    const isOwner = syncedUser && notice.authorId === syncedUser.id;
    if (caller.role !== 'admin' && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: Only the notice author or an Admin can delete this notice.' },
        { status: 403 }
      );
    }

    await prisma.notice.delete({ where: { id } });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Faculty/Admin',
      action: 'NOTICE_DELETED',
      target: notice.title,
      details: `Deleted ${notice.category} notice`,
    });

    return NextResponse.json({
      success: true,
      message: 'Notice removed successfully.',
    });
  } catch (err: any) {
    console.error('[Notice DELETE] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete notice' },
      { status: 500 }
    );
  }
}
