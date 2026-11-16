import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    return NextResponse.json({
      success: true,
      message: `Download counter incremented for note ${id}.`,
      data: {
        id,
        downloadUrl: `/mock-files/note-${id}.pdf`,
        incrementedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
