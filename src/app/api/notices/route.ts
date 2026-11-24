import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/notices
 * Returns live official college notices filtered by target branch and category.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');
    const category = searchParams.get('category');

    const notices = await prisma.notice.findMany({
      where: {
        ...(branch && branch !== 'ALL'
          ? { OR: [{ targetBranch: 'ALL' }, { targetBranch: branch.toUpperCase() }] }
          : {}),
        ...(category && category !== 'ALL' ? { category: category.toUpperCase() } : {}),
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: { id: true, fullName: true, role: true, branch: true },
        },
      },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (err: any) {
    console.error('[Notices GET] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notices
 * Strictly FACULTY or ADMIN only.
 * Creates an official departmental or campus-wide notice.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || !caller.userId || (caller.role !== 'faculty' && caller.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required to publish official notices.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { title, content, category = 'ACADEMIC', targetBranch = 'ALL', isPinned = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required to publish a notice.' },
        { status: 400 }
      );
    }

    // Ensure User exists in Neon DB
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

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category.toUpperCase().trim(),
        targetBranch: targetBranch.toUpperCase().trim(),
        isPinned: Boolean(isPinned),
        authorId: dbUser.id,
      },
      include: {
        author: {
          select: { id: true, fullName: true, role: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notice published successfully.',
      notice,
    }, { status: 201 });
  } catch (err: any) {
    console.error('[Notices POST] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to publish notice' },
      { status: 500 }
    );
  }
}
