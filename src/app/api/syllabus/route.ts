import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { ensureSyllabusSeeded } from '@/lib/seed-syllabus';
import { normalizeSyllabusBranch } from '@/lib/makaut-syllabus';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/syllabus?branch=CSE&semester=3&includeInactive=false
 * Returns database-backed MAKAUT syllabus subjects.
 */
export async function GET(req: NextRequest) {
  try {
    await ensureSyllabusSeeded();

    const { searchParams } = new URL(req.url);
    const branchParam = searchParams.get('branch');
    const semesterParam = searchParams.get('semester');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const normBranch =
      branchParam && branchParam !== 'ALL' ? normalizeSyllabusBranch(branchParam) : undefined;
    const semester =
      semesterParam && semesterParam !== 'ALL' ? Number(semesterParam) : undefined;

    const subjects = await prisma.syllabusSubject.findMany({
      where: {
        ...(normBranch ? { branch: normBranch } : {}),
        ...(semester && !Number.isNaN(semester) ? { semester } : {}),
        ...(!includeInactive ? { isActive: true } : {}),
      },
      orderBy: [{ semester: 'asc' }, { type: 'asc' }, { code: 'asc' }],
    });

    return NextResponse.json({ success: true, count: subjects.length, subjects });
  } catch (err: any) {
    console.error('[Syllabus GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load syllabus' }, { status: 500 });
  }
}

/**
 * POST /api/syllabus
 * Admin-only: Adds a new subject / elective / lab to the live MAKAUT syllabus table.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { code, name, branch = 'CSE', semester = 3, credits = 3, category = 'PCC', type = 'THEORY' } = body;

    if (!code?.trim() || !name?.trim()) {
      return NextResponse.json({ error: 'Paper code and subject name are required.' }, { status: 400 });
    }

    const normBranch = normalizeSyllabusBranch(branch);
    const normSem = Math.min(8, Math.max(1, Number(semester) || 3));
    const normCode = code.toUpperCase().trim();

    const subject = await prisma.syllabusSubject.upsert({
      where: {
        code_branch_semester: {
          code: normCode,
          branch: normBranch,
          semester: normSem,
        },
      },
      update: {
        name: name.trim(),
        credits: Number(credits) || 0,
        category: category.toUpperCase().trim(),
        type: type.toUpperCase().trim(),
        isActive: true,
      },
      create: {
        code: normCode,
        name: name.trim(),
        branch: normBranch,
        semester: normSem,
        credits: Number(credits) || 0,
        category: category.toUpperCase().trim(),
        type: type.toUpperCase().trim(),
        isActive: true,
      },
    });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      action: 'SYLLABUS_SUBJECT_SAVED',
      target: `${subject.code} (${subject.branch} Sem ${subject.semester})`,
      details: `Added/updated ${subject.type} subject "${subject.name}" (${subject.credits} cr)`,
    });

    revalidatePath('/notes');
    revalidatePath('/lectures');
    revalidatePath('/viva');

    return NextResponse.json({ success: true, subject }, { status: 201 });
  } catch (err: any) {
    console.error('[Syllabus POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save subject' }, { status: 500 });
  }
}

/**
 * PATCH /api/syllabus
 * Admin-only: Edit an existing subject or toggle isActive visibility.
 */
export async function PATCH(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { id, code, name, credits, category, type, isActive } = body;

    if (!id) return NextResponse.json({ error: 'Subject id is required.' }, { status: 400 });

    const updated = await prisma.syllabusSubject.update({
      where: { id },
      data: {
        ...(typeof code === 'string' && code.trim() ? { code: code.toUpperCase().trim() } : {}),
        ...(typeof name === 'string' && name.trim() ? { name: name.trim() } : {}),
        ...(credits !== undefined ? { credits: Number(credits) } : {}),
        ...(typeof category === 'string' ? { category: category.toUpperCase().trim() } : {}),
        ...(typeof type === 'string' ? { type: type.toUpperCase().trim() } : {}),
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
      },
    });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      action: 'SYLLABUS_SUBJECT_UPDATED',
      target: `${updated.code} (${updated.branch} Sem ${updated.semester})`,
      details: `Updated "${updated.name}" (active: ${updated.isActive}, type: ${updated.type})`,
    });

    revalidatePath('/notes');
    revalidatePath('/lectures');
    revalidatePath('/viva');

    return NextResponse.json({ success: true, subject: updated });
  } catch (err: any) {
    console.error('[Syllabus PATCH] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update subject' }, { status: 500 });
  }
}

/**
 * DELETE /api/syllabus?id=...
 * Admin-only: Permanently deletes a syllabus subject.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    const existing = await prisma.syllabusSubject.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Subject not found.' }, { status: 404 });

    await prisma.syllabusSubject.delete({ where: { id } });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      action: 'SYLLABUS_SUBJECT_DELETED',
      target: `${existing.code} (${existing.branch} Sem ${existing.semester})`,
      details: `Removed subject "${existing.name}" from syllabus`,
    });

    revalidatePath('/notes');
    revalidatePath('/lectures');
    revalidatePath('/viva');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Syllabus DELETE] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete subject' }, { status: 500 });
  }
}
