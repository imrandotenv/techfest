import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NoteItem, CustomUserRole, NoteCategory, VerificationStatus } from '@/types';
import { prisma } from '@/lib/prisma';
import { resolveAndHealUser } from '@/lib/rbac';
import { ensureStarterNotesSeeded } from '@/lib/seed-notes';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get('branch');
  const semester = searchParams.get('semester');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const q = searchParams.get('q');

  try {
    // Seed 4 starter MAKAUT 3rd-sem verified notes if DB has 0 records
    await ensureStarterNotesSeeded();

    const records = await prisma.note.findMany({
      include: {
        uploader: {
          select: {
            id: true,
            clerkId: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let results: NoteItem[] = records.map((n) => {
      const rUpper = (n.uploader?.role || 'STUDENT').toUpperCase();
      const uploaderRole: CustomUserRole =
        rUpper === 'ADMIN' ? 'admin' : rUpper === 'FACULTY' ? 'college' : 'student';

      return {
        id: n.id,
        title: n.title,
        subjectCode: n.subjectCode,
        subjectName: n.subjectName || n.title,
        departmentCode: n.branch,
        semester: n.semester,
        category: ((n as any).category || 'LECTURE_NOTE') as NoteCategory,
        academicYear: '2026-2027',
        fileUrl: n.fileUrl,
        fileSize: n.fileSize || 0,
        content: (n as any).content || null,
        downloadsCount: 0,
        status: (n.verified ? 'approved' : 'pending') as VerificationStatus,
        uploaderId: n.uploader?.clerkId || n.uploaderId,
        uploaderName: n.uploader?.fullName || 'SETGOI Contributor',
        uploaderRole,
        createdAt: n.createdAt.toISOString(),
      };
    });

    if (branch && branch !== 'ALL') {
      results = results.filter((n) => n.departmentCode === branch || n.departmentCode === 'ALL');
    }

    if (semester && semester !== 'ALL') {
      results = results.filter((n) => n.semester === Number(semester));
    }

    if (category && category !== 'ALL') {
      results = results.filter((n) => n.category === category);
    }

    if (status && status !== 'ALL') {
      results = results.filter((n) => n.status === status);
    }

    if (q && q.trim()) {
      const query = q.toLowerCase().trim();
      results = results.filter(
        (n) =>
          n.subjectCode.toLowerCase().includes(query) ||
          n.title.toLowerCase().includes(query) ||
          n.subjectName.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err: any) {
    console.error('[Notes GET] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Sign in to submit study materials' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      title,
      subjectCode,
      subjectName,
      departmentCode,
      branch,
      semester,
      fileUrl,
      category,
    } = body;

    const targetBranch = (departmentCode || branch || 'CSE').toUpperCase().trim();
    const cleanTitle = String(title || '').trim();
    const cleanCode = String(subjectCode || '').toUpperCase().trim();
    const cleanUrl = String(fileUrl || '').trim();

    if (!cleanTitle || !cleanCode || !semester) {
      return NextResponse.json(
        { success: false, error: 'Title, MAKAUT subject code, and semester are mandatory' },
        { status: 400 }
      );
    }

    const clerkUser = await currentUser();
    const primaryEmail =
      clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
      clerkUser?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName =
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
      clerkUser?.username ||
      'SETGOI Scholar';

    const dbUser = await resolveAndHealUser({
      clerkUserId: userId,
      email: primaryEmail,
      fullName,
      autoCreate: true,
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to resolve user in database' },
        { status: 500 }
      );
    }

    const isPrivileged = dbUser.role === 'FACULTY' || dbUser.role === 'ADMIN';

    const created = await prisma.note.create({
      data: {
        title: cleanTitle,
        subjectCode: cleanCode,
        subjectName: subjectName ? String(subjectName).trim() : cleanTitle,
        branch: targetBranch,
        semester: Math.min(8, Math.max(1, Number(semester) || 3)),
        fileUrl: cleanUrl || 'https://makautexam.net/aicte_details/Syllabus/BTECH/CSE3.pdf',
        fileKey: `url/${cleanCode.toLowerCase()}-${Date.now()}`,
        fileSize: 0,
        verified: isPrivileged,
        uploaderId: dbUser.id,
      },
      include: {
        uploader: { select: { clerkId: true, fullName: true, role: true } },
      },
    });

    revalidatePath('/notes');
    revalidatePath('/faculty');
    revalidatePath('/admin');

    const uploaderRole: CustomUserRole =
      dbUser.role === 'ADMIN' ? 'admin' : dbUser.role === 'FACULTY' ? 'college' : 'student';

    const newNote: NoteItem = {
      id: created.id,
      title: created.title,
      subjectCode: created.subjectCode,
      subjectName: created.subjectName || created.title,
      departmentCode: created.branch,
      semester: created.semester,
      category: (category || 'LECTURE_NOTE') as NoteCategory,
      academicYear: '2026-2027',
      fileUrl: created.fileUrl,
      fileSize: created.fileSize || 0,
      downloadsCount: 0,
      status: created.verified ? 'approved' : 'pending',
      uploaderId: created.uploader?.clerkId || userId,
      uploaderName: created.uploader?.fullName || fullName,
      uploaderRole,
      createdAt: created.createdAt.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newNote,
        message: isPrivileged
          ? 'Note published as Faculty Verified in Neon DB.'
          : 'Note submitted to the Faculty Verification Queue.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Notes POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit note' },
      { status: 500 }
    );
  }
}
