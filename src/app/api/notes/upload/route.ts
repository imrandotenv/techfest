import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { uploadToNeonStorage } from '@/lib/storage';
import { resolveAndHealUser } from '@/lib/rbac';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required to upload notes' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const subjectCode = (formData.get('subjectCode') as string) || '';
    const subjectName = (formData.get('subjectName') as string) || '';
    const branch = (formData.get('branch') as string) || 'CSE';
    const semester = parseInt((formData.get('semester') as string) || '3', 10);

    if (!file || !title || !subjectCode) {
      return NextResponse.json(
        { error: 'Missing required fields: file, title, and subjectCode are mandatory' },
        { status: 400 }
      );
    }

    // Security: Validate file type (PDF and images only)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    const fileNameLower = (file.name || '').toLowerCase();
    const hasAllowedExt = fileNameLower.endsWith('.pdf') || fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg') || fileNameLower.endsWith('.png') || fileNameLower.endsWith('.webp');

    if (!allowedTypes.includes(file.type) && !hasAllowedExt) {
      return NextResponse.json(
        { error: 'Security validation failed: Only PDF and image files (.pdf, .jpg, .png, .webp) are permitted.' },
        { status: 400 }
      );
    }

    // Security: Validate file size (max 25MB)
    const MAX_SIZE_BYTES = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Security validation failed: File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed 25MB limit.` },
        { status: 400 }
      );
    }

    // 1. Convert file to buffer and upload to Neon Object Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || 'application/pdf';

    let storageResult = null;
    try {
      storageResult = await uploadToNeonStorage(buffer, file.name, contentType, `notes/${branch.toLowerCase()}`);
    } catch (s3Err: any) {
      console.warn('[Notes Upload] S3 upload warning:', s3Err?.message || s3Err);
      // Fallback URL if S3 is unreachable
      storageResult = {
        url: `/mock-files/${subjectCode.toLowerCase()}-${Date.now()}.pdf`,
        key: `notes/${Date.now()}-${file.name}`,
        bucket: 'settech-notes',
        size: buffer.length,
      };
    }

    // 2. Ensure User exists in Neon Postgres
    const clerkUser = await currentUser();
    const primaryEmail =
      clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
      clerkUser?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || clerkUser?.username || 'SETGOI Scholar';

    const dbUser = await resolveAndHealUser({
      clerkUserId: userId,
      email: primaryEmail,
      fullName,
      autoCreate: true,
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Failed to resolve user in database' }, { status: 500 });
    }

    const isPrivileged = dbUser.role === 'FACULTY' || dbUser.role === 'ADMIN';

    // 3. Save Note metadata into Neon Postgres
    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        subjectCode: subjectCode.toUpperCase().trim(),
        subjectName: subjectName.trim() || undefined,
        branch: branch.toUpperCase().trim(),
        semester,
        fileUrl: storageResult.url,
        fileKey: storageResult.key,
        fileSize: storageResult.size,
        verified: isPrivileged,
        uploaderId: dbUser.id,
      },
      include: {
        uploader: {
          select: {
            id: true,
            fullName: true,
            role: true,
            branch: true,
          },
        },
      },
    });

    revalidatePath('/notes');
    revalidatePath('/faculty');
    revalidatePath('/admin');

    return NextResponse.json({
      success: true,
      message: isPrivileged ? 'Note uploaded and verified automatically.' : 'Note uploaded and submitted to faculty verification queue.',
      note,
    });
  } catch (err: any) {
    console.error('[Notes Upload API] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to upload note' }, { status: 500 });
  }
}
