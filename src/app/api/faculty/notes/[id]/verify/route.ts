import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser, syncAndGetCurrentUser, canFacultyAccessScope } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * PATCH /api/faculty/notes/[id]/verify
 * Strictly FACULTY or ADMIN only.
 * Toggles verification status of a note.
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required to verify notes.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const verified = body.verified !== undefined ? Boolean(body.verified) : true;

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    if (caller.role === 'faculty') {
      const syncedUser = await syncAndGetCurrentUser();
      if (!canFacultyAccessScope(syncedUser, note.branch, note.semester)) {
        return NextResponse.json(
          { error: `Forbidden: ${note.branch} Sem ${note.semester} is outside your assigned scope.` },
          { status: 403 }
        );
      }
    }

    const updated = await prisma.note.update({
      where: { id },
      data: {
        verified,
        isVerified: verified,
        verifiedBy: verified ? caller.fullName || caller.email || 'SETGOI Faculty' : null,
      },
      include: {
        uploader: { select: { fullName: true, email: true, branch: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: verified ? 'Note successfully verified and published.' : 'Note verification revoked.',
      note: updated,
    });
  } catch (err: any) {
    console.error('[Faculty Note Verify PATCH] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update note status' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/faculty/notes/[id]/verify
 * Strictly FACULTY or ADMIN only.
 * Deletes a rejected or spam note.
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required to delete notes.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    if (caller.role === 'faculty') {
      const syncedUser = await syncAndGetCurrentUser();
      if (!canFacultyAccessScope(syncedUser, note.branch, note.semester)) {
        return NextResponse.json(
          { error: `Forbidden: ${note.branch} Sem ${note.semester} is outside your assigned scope.` },
          { status: 403 }
        );
      }
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Note permanently removed from academic vault.',
    });
  } catch (err: any) {
    console.error('[Faculty Note Verify DELETE] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete note' },
      { status: 500 }
    );
  }
}
