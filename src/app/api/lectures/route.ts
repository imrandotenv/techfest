import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { ensureStarterLecturesSeeded } from '@/lib/seed-lectures';
import { normalizeSyllabusBranch } from '@/lib/makaut-syllabus';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/lectures
 * Returns official SWAYAM/NPTEL course lectures mapped by branch & semester.
 */
export async function GET(req: NextRequest) {
  try {
    await ensureStarterLecturesSeeded();

    const { searchParams } = new URL(req.url);
    const branchParam = searchParams.get('branch');
    const semesterParam = searchParams.get('semester');
    const subjectCode = searchParams.get('subjectCode');
    const q = (searchParams.get('q') || '').trim();

    const normBranch =
      branchParam && branchParam !== 'ALL' ? normalizeSyllabusBranch(branchParam) : undefined;
    const semester =
      semesterParam && semesterParam !== 'ALL' ? Number(semesterParam) : undefined;

    const lectures = await prisma.courseLecture.findMany({
      where: {
        ...(normBranch ? { branch: normBranch } : {}),
        ...(semester && !Number.isNaN(semester) ? { semester } : {}),
        ...(subjectCode ? { subjectCode: subjectCode.toUpperCase().trim() } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { subjectCode: { contains: q, mode: 'insensitive' } },
                { subjectName: { contains: q, mode: 'insensitive' } },
                { instructor: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ semester: 'asc' }, { subjectCode: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      count: lectures.length,
      lectures,
    });
  } catch (err: any) {
    console.error('[Lectures GET] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to load course lectures' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lectures
 * Strictly FACULTY or ADMIN only: Adds a curated SWAYAM / NPTEL / YouTube course lecture.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || !caller.userId || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required to publish course lectures.' },
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
      platform = 'NPTEL',
      courseUrl,
      instructor,
      institute,
      duration,
    } = body;

    if (!title?.trim() || !subjectCode?.trim() || !courseUrl?.trim()) {
      return NextResponse.json(
        { error: 'Title, MAKAUT Subject Code, and Course URL are required.' },
        { status: 400 }
      );
    }

    const lecture = await prisma.courseLecture.create({
      data: {
        title: title.trim(),
        subjectCode: subjectCode.toUpperCase().trim(),
        subjectName: (subjectName || subjectCode).trim(),
        branch: normalizeSyllabusBranch(branch),
        semester: Math.min(8, Math.max(1, Number(semester) || 3)),
        platform: platform.toUpperCase().trim(),
        courseUrl: courseUrl.trim(),
        instructor: instructor?.trim() || null,
        institute: institute?.trim() || null,
        duration: duration?.trim() || null,
        verified: true,
        createdById: caller.userId,
      },
    });

    await recordAuditLog({
      actorId: caller.userId,
      actor: caller.email || caller.fullName || 'Faculty/Admin',
      action: 'LECTURE_ADDED',
      target: `${lecture.subjectCode}: ${lecture.title}`,
      details: `Added ${lecture.platform} course lecture for ${lecture.branch} Sem ${lecture.semester}`,
    });

    revalidatePath('/lectures');

    return NextResponse.json({ success: true, lecture }, { status: 201 });
  } catch (err: any) {
    console.error('[Lectures POST] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to add course lecture' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/lectures?id=...
 * Strictly FACULTY or ADMIN only.
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
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    await prisma.courseLecture.delete({ where: { id } });
    revalidatePath('/lectures');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Lectures DELETE] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete course lecture' },
      { status: 500 }
    );
  }
}
