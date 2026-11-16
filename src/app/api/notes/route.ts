import { NextRequest, NextResponse } from 'next/server';
import { COMPREHENSIVE_MOCK_NOTES } from '@/modules/notes/data/mock-notes';
import { NoteItem, CustomUserRole, NoteCategory, VerificationStatus } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get('branch');
  const semester = searchParams.get('semester');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const q = searchParams.get('q');

  let results: NoteItem[] = [...COMPREHENSIVE_MOCK_NOTES];

  if (branch && branch !== 'ALL') {
    results = results.filter((n) => n.departmentCode === branch);
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subjectCode,
      subjectName,
      departmentCode,
      semester,
      category,
      academicYear,
      uploaderId,
      uploaderName,
      uploaderRole,
    } = body;

    if (!title || !subjectCode || !departmentCode || !semester) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory fields' },
        { status: 400 }
      );
    }

    const role: CustomUserRole = uploaderRole || 'student';
    const isPrivileged = role === 'college' || role === 'admin';
    const now = new Date().toISOString();

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: String(title).trim(),
      subjectCode: String(subjectCode).toUpperCase().trim(),
      subjectName: String(subjectName || '').trim(),
      departmentCode: departmentCode,
      semester: Number(semester),
      category: (category as NoteCategory) || 'LECTURE_NOTE',
      academicYear: academicYear || '2026-2027',
      fileUrl: `/mock-files/${String(subjectCode).toLowerCase()}-resource.pdf`,
      fileSize: 3200000,
      downloadsCount: 0,
      status: (isPrivileged ? 'approved' : 'pending') as VerificationStatus,
      uploaderId: uploaderId || 'user-anon',
      uploaderName: uploaderName || 'Student Contributor',
      uploaderRole: role,
      verifiedById: isPrivileged ? uploaderId : undefined,
      verifiedByName: isPrivileged ? uploaderName : undefined,
      verifiedAt: isPrivileged ? now : undefined,
      createdAt: now,
    };

    return NextResponse.json({
      success: true,
      message: isPrivileged
        ? 'Note published with faculty verification.'
        : 'Note submitted to pending verification queue.',
      data: newNote,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
