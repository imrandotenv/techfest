import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/faculty/viva-topics
 * Returns curated MAKAUT viva questions & key concepts per subject.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectCode = (searchParams.get('subjectCode') || '').trim();
    const branch = (searchParams.get('branch') || 'ALL').toUpperCase();

    const topics = await prisma.vivaCuratedTopic.findMany({
      where: {
        ...(subjectCode ? { subjectCode: { contains: subjectCode, mode: 'insensitive' } } : {}),
        ...(branch !== 'ALL' ? { branch } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 60,
    });

    return NextResponse.json({ success: true, topics });
  } catch (err: any) {
    console.error('[Faculty Viva Topics GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load viva topics' }, { status: 500 });
  }
}

/**
 * POST /api/faculty/viva-topics
 * Faculty or Admin only: Creates a curated viva topic & sample questions.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || !caller.userId || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: Faculty or Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { subjectCode, subjectName, branch = 'CSE', semester = 3, topicTitle, keyConcepts, sampleVivaQ } = body;

    if (!subjectCode || !subjectName || !topicTitle || !keyConcepts || !sampleVivaQ) {
      return NextResponse.json(
        { error: 'subjectCode, subjectName, topicTitle, keyConcepts, and sampleVivaQ are required.' },
        { status: 400 }
      );
    }

    const topic = await prisma.vivaCuratedTopic.create({
      data: {
        subjectCode: subjectCode.toUpperCase().trim(),
        subjectName: subjectName.trim(),
        branch: branch.toUpperCase().trim(),
        semester: Math.min(8, Math.max(1, Number(semester) || 3)),
        topicTitle: topicTitle.trim(),
        keyConcepts: keyConcepts.trim(),
        sampleVivaQ: sampleVivaQ.trim(),
        authorId: caller.userId,
        authorName: caller.fullName || caller.email || 'SETGOI Faculty',
      },
    });

    await recordAuditLog({
      actorId: caller.userId,
      actor: caller.email || caller.fullName || 'Faculty',
      action: 'VIVA_TOPIC_CURATED',
      target: `${topic.subjectCode}: ${topic.topicTitle}`,
      details: `Added curated AI Viva concepts for ${topic.branch} Sem ${topic.semester}`,
    });

    return NextResponse.json({ success: true, topic }, { status: 201 });
  } catch (err: any) {
    console.error('[Faculty Viva Topics POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save viva topic' }, { status: 500 });
  }
}

/**
 * DELETE /api/faculty/viva-topics?id=...
 * Faculty or Admin only: Removes a curated viva topic.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || !caller.userId || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: Faculty or Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    await prisma.vivaCuratedTopic.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Faculty Viva Topics DELETE] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete viva topic' }, { status: 500 });
  }
}
