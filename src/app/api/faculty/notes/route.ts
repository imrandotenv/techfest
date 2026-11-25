import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * POST /api/faculty/notes
 * Faculty or Admin only: Publishes an official Faculty Verified study material by URL.
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
      title,
      subjectCode,
      subjectName,
      branch = 'CSE',
      semester = 3,
      unitModule,
      fileUrl,
      category = 'LECTURE_NOTE',
      content,
    } = body;

    if (!title || !subjectCode || (!fileUrl?.trim() && !content?.trim())) {
      return NextResponse.json(
        { error: 'Title, MAKAUT Subject Code, and either formatted content or a resource URL are required.' },
        { status: 400 }
      );
    }

    const normalizedCategory = (() => {
      const c = String(category || 'LECTURE_NOTE').toUpperCase().trim();
      if (c === 'PYQ' || c === 'MAKAUT_PYQ') return 'MAKAUT_PYQ';
      if (c === 'LAB' || c === 'LAB_MANUAL') return 'LAB_MANUAL';
      return 'LECTURE_NOTE';
    })();

    const dbUser = await prisma.user.upsert({
      where: { clerkId: caller.userId },
      update: {
        fullName: caller.fullName || 'SETGOI Faculty',
        role: caller.role.toUpperCase(),
      },
      create: {
        clerkId: caller.userId,
        email: caller.email || `${caller.userId}@faculty.setgoi.ac.in`,
        fullName: caller.fullName || 'SETGOI Faculty',
        role: caller.role.toUpperCase(),
        degree: 'B.Tech',
        onboardingCompleted: true,
      },
    });

    const formattedTitle = unitModule ? `[${unitModule.trim()}] ${title.trim()}` : title.trim();
    const authorDisplayName = caller.fullName || dbUser.fullName || 'SETGOI Faculty';
    const cleanCode = subjectCode.toUpperCase().trim();

    const note = await prisma.note.create({
      data: {
        title: formattedTitle,
        subjectCode: cleanCode,
        subjectName: subjectName?.trim() || undefined,
        branch: branch.toUpperCase().trim(),
        semester: Math.min(8, Math.max(1, Number(semester) || 3)),
        category: normalizedCategory,
        content: content?.trim() || null,
        fileUrl: fileUrl?.trim() || `/notes?branch=${encodeURIComponent(branch.toUpperCase().trim())}&semester=${Number(semester) || 3}`,
        fileKey: `faculty-published/${cleanCode.toLowerCase()}-${Date.now()}`,
        fileSize: content ? Buffer.byteLength(content.trim(), 'utf8') : 0,
        verified: true,
        isVerified: true,
        authorName: authorDisplayName,
        authorRole: caller.role.toUpperCase(),
        verifiedBy: authorDisplayName,
        uploaderId: dbUser.id,
      },
      include: {
        uploader: { select: { fullName: true, email: true, branch: true } },
      },
    });

    await recordAuditLog({
      actorId: caller.userId,
      actor: caller.email || caller.fullName || 'Faculty',
      action: 'NOTE_VERIFIED',
      target: note.title,
      details: `Faculty published verified material (${note.subjectCode}, ${note.branch} Sem ${note.semester})`,
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (err: any) {
    console.error('[Faculty Notes POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to publish material' }, { status: 500 });
  }
}
