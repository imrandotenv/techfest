import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/viva/sessions/[id]
 * Returns a single saved VivaSession and all its VivaMessages for the authenticated owner.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const session = await prisma.vivaSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Viva session not found' }, { status: 404 });
    }

    if (session.userId !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    console.error('[Viva Session Detail GET] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch viva session' },
      { status: 500 }
    );
  }
}
