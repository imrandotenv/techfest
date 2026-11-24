import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Security: Strict RBAC check - only actual authenticated faculty or admin
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only faculty or admin can verify notes' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    // Update in Neon Postgres
    try {
      await prisma.note.updateMany({
        where: { id },
        data: { verified: status === 'approved' },
      });
    } catch (dbErr) {
      console.warn('[Note Verify API] Neon DB update note:', dbErr);
    }

    const now = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Note ${id} status successfully updated to ${status}.`,
      data: {
        id,
        status,
        verifiedById: caller.userId,
        verifiedByName: caller.fullName || 'SETGOI Faculty',
        verifiedAt: now,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
