import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser, syncAndGetCurrentUser, canFacultyAccessScope } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/faculty/viva-questions
 * Faculty or Admin only: Returns faculty-seeded CustomVivaQuestion items plus live branch VivaSession insights.
 */
export async function GET(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const branch = (searchParams.get('branch') || 'ALL').toUpperCase();

    const syncedUser = caller.role === 'faculty' ? await syncAndGetCurrentUser() : null;

    const [rawQuestions, rawSessions] = await Promise.all([
      prisma.customVivaQuestion.findMany({
        where: branch !== 'ALL' ? { branch } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.vivaSession.findMany({
        where: branch !== 'ALL' ? { branch } : undefined,
        select: {
          id: true,
          subject: true,
          subjectCode: true,
          subjectName: true,
          branch: true,
          semester: true,
          score: true,
          totalQuestions: true,
          weakTopics: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 300,
      }),
    ]);

    const questions =
      caller.role === 'faculty'
        ? rawQuestions.filter((q) => canFacultyAccessScope(syncedUser, q.branch, q.semester))
        : rawQuestions;
    const sessions =
      caller.role === 'faculty'
        ? rawSessions.filter((s) =>
            canFacultyAccessScope(syncedUser, s.branch || 'CSE', s.semester || 3)
          )
        : rawSessions;

    // Aggregate weak topics & average accuracy per subject
    const weakTopicCounts = new Map<string, { topic: string; count: number; subjectCode: string }>();
    const subjectStatsMap = new Map<
      string,
      { subjectCode: string; subjectName: string; sessions: number; totalScore: number; totalQuestions: number }
    >();

    for (const s of sessions) {
      const code = s.subjectCode || s.subject || 'GENERAL';
      const name = s.subjectName || s.subject || code;
      const existing = subjectStatsMap.get(code) || {
        subjectCode: code,
        subjectName: name,
        sessions: 0,
        totalScore: 0,
        totalQuestions: 0,
      };
      existing.sessions += 1;
      existing.totalScore += s.score || 0;
      existing.totalQuestions += s.totalQuestions || 0;
      subjectStatsMap.set(code, existing);

      if (s.weakTopics) {
        const topics = s.weakTopics
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        for (const topic of topics) {
          const key = `${code}::${topic.toLowerCase()}`;
          const prev = weakTopicCounts.get(key) || { topic, count: 0, subjectCode: code };
          prev.count += 1;
          weakTopicCounts.set(key, prev);
        }
      }
    }

    const lowestScoringTopics = Array.from(weakTopicCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const subjectBreakdown = Array.from(subjectStatsMap.values())
      .map((item) => ({
        ...item,
        accuracyPercent:
          item.totalQuestions > 0 ? Math.round((item.totalScore / item.totalQuestions) * 100) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      questions,
      insights: {
        totalSessions: sessions.length,
        lowestScoringTopics,
        subjectBreakdown,
      },
    });
  } catch (err: any) {
    console.error('[Faculty Viva Questions GET] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to load viva question bank' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/faculty/viva-questions
 * Faculty or Admin only: Seeds a custom MAKAUT viva question for /api/viva to prioritize.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || !caller.userId || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      branch = 'CSE',
      semester = 3,
      subjectCode,
      question,
      expectedKeyPoints,
    } = body;

    if (!subjectCode?.trim() || !question?.trim() || !expectedKeyPoints?.trim()) {
      return NextResponse.json(
        { error: 'subjectCode, question, and expectedKeyPoints are required.' },
        { status: 400 }
      );
    }

    const targetBranch = String(branch).toUpperCase().trim();
    const targetSemester = Math.min(8, Math.max(1, Number(semester) || 3));
    if (caller.role === 'faculty') {
      const syncedUser = await syncAndGetCurrentUser();
      if (!canFacultyAccessScope(syncedUser, targetBranch, targetSemester)) {
        return NextResponse.json(
          { error: `Forbidden: ${targetBranch} Sem ${targetSemester} is outside your assigned scope.` },
          { status: 403 }
        );
      }
    }

    const createdBy = caller.fullName || caller.email || 'SETGOI Faculty';

    const record = await prisma.customVivaQuestion.create({
      data: {
        branch: String(branch).toUpperCase().trim(),
        semester: Math.min(8, Math.max(1, Number(semester) || 3)),
        subjectCode: String(subjectCode).toUpperCase().trim(),
        question: String(question).trim(),
        expectedKeyPoints: String(expectedKeyPoints).trim(),
        createdBy,
      },
    });

    await recordAuditLog({
      actorId: caller.userId,
      actor: caller.email || createdBy,
      action: 'CUSTOM_VIVA_QUESTION_ADDED',
      target: record.subjectCode,
      details: `Added custom MAKAUT viva question for ${record.branch} Sem ${record.semester}: ${record.question.slice(0, 80)}`,
    });

    return NextResponse.json({ success: true, question: record }, { status: 201 });
  } catch (err: any) {
    console.error('[Faculty Viva Questions POST] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to add custom viva question' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/faculty/viva-questions?id=...
 * Faculty or Admin only: Removes a custom viva question.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Question id is required.' }, { status: 400 });
    }

    const existing = await prisma.customVivaQuestion.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
    }
    if (caller.role === 'faculty') {
      const syncedUser = await syncAndGetCurrentUser();
      if (!canFacultyAccessScope(syncedUser, existing.branch, existing.semester)) {
        return NextResponse.json(
          { error: 'Forbidden: This question is outside your assigned scope.' },
          { status: 403 }
        );
      }
    }

    await prisma.customVivaQuestion.delete({ where: { id } });
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    console.error('[Faculty Viva Questions DELETE] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete custom viva question' },
      { status: 500 }
    );
  }
}
