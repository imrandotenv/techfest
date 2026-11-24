import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

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

    await prisma.notice.delete({ where: { id } });

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
