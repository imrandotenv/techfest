import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildPrintableHtmlDocument } from '@/lib/study-document-content';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);

    let title = searchParams.get('title') || 'SETGOI MAKAUT Study Notes';
    let subjectCode = searchParams.get('code') || 'PCC-CS301';
    let subjectName = searchParams.get('subject') || 'MAKAUT Engineering Course';
    let branch = searchParams.get('branch') || 'CSE';
    let semester = Number(searchParams.get('semester')) || 3;
    let verified = true;
    let dbContent: string | null = null;

    const dbNote = await prisma.note.findUnique({ where: { id } }).catch(() => null);
    if (dbNote) {
      title = dbNote.title;
      subjectCode = dbNote.subjectCode;
      subjectName = dbNote.subjectName || dbNote.title;
      branch = dbNote.branch;
      semester = dbNote.semester;
      verified = dbNote.verified;
      dbContent = dbNote.content;
    }

    const html = buildPrintableHtmlDocument({
      title,
      subjectCode,
      subjectName,
      branch,
      semester,
      verified,
      markdownContent: dbContent,
    });

    const safeSlug = `${subjectCode}-${title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 72);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeSlug}.html"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Download failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    return NextResponse.json({
      success: true,
      message: `Download ready for note ${id}.`,
      data: {
        id,
        downloadUrl: `/api/notes/${encodeURIComponent(id)}/download`,
        incrementedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
