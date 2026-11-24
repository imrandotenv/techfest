import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/viva/sessions
 * Returns all past AI Viva sessions with their complete message transcripts for the authenticated student.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: true, sessions: [] });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ success: true, sessions: [] });
    }

    const sessions = await prisma.vivaSession.findMany({
      where: { userId: dbUser.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, sessions });
  } catch (err: any) {
    console.error('[Viva Sessions GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to fetch sessions' }, { status: 500 });
  }
}

/**
 * POST /api/viva/sessions
 * Saves or updates an active Viva session and its evaluated messages in Neon PostgreSQL.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required to save viva history' }, { status: 401 });
    }

    const body = await req.json();
    const {
      sessionId,
      subject = 'DSA',
      language = 'en',
      score = 0,
      totalQuestions = 0,
      weakTopics = '',
      messages = [],
    } = body;

    // 1. Ensure user exists in Neon Postgres
    const clerkUser = await currentUser();
    const primaryEmail =
      clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
      clerkUser?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || clerkUser?.username || 'SETGOI Scholar';

    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email: primaryEmail, fullName },
      create: {
        clerkId: userId,
        email: primaryEmail,
        fullName,
        role: 'STUDENT',
        degree: 'B.Tech',
        branch: 'CSE',
        semester: 3,
        onboardingCompleted: true,
      },
    });

    // 2. Upsert VivaSession
    let session = null;
    if (sessionId) {
      session = await prisma.vivaSession.findUnique({
        where: { id: sessionId },
      });
    }

    if (!session) {
      session = await prisma.vivaSession.create({
        data: {
          userId: dbUser.id,
          subject,
          language,
          score,
          totalQuestions,
          weakTopics: typeof weakTopics === 'object' ? JSON.stringify(weakTopics) : String(weakTopics),
        },
      });
    } else {
      session = await prisma.vivaSession.update({
        where: { id: session.id },
        data: {
          score,
          totalQuestions,
          weakTopics: typeof weakTopics === 'object' ? JSON.stringify(weakTopics) : String(weakTopics),
        },
      });
    }

    // 3. Insert any new messages if provided
    if (Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        if (!msg.content) continue;
        await prisma.vivaMessage.create({
          data: {
            sessionId: session.id,
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
            reaction: msg.reaction || null,
            explanation: msg.explanation || null,
            emotion: msg.emotion || 'idle',
            isCorrect: msg.isCorrect !== undefined ? msg.isCorrect : null,
            topicTag: msg.topicTag || null,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      session,
    });
  } catch (err: any) {
    console.error('[Viva Sessions POST] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to save session' }, { status: 500 });
  }
}
