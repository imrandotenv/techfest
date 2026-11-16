import { NextRequest, NextResponse } from 'next/server';
import { CustomUserRole } from '@/types';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, verifierName, verifierRole, verifierId } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    const role: CustomUserRole = verifierRole || 'college';
    if (role !== 'college' && role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only faculty or admin can verify notes' },
        { status: 403 }
      );
    }

    const now = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Note ${id} status successfully updated to ${status}.`,
      data: {
        id,
        status,
        verifiedById: verifierId || 'verifier-user',
        verifiedByName: verifierName || 'SETGOI Faculty',
        verifiedAt: now,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
