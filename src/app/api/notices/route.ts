import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentAuthUser,
  syncAndGetCurrentUser,
  canFacultyAccessScope,
  FacultyScope,
} from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/notices
 * Role-scoped notice feed:
 * - ADMIN: all notices across SETGOI
 * - FACULTY: institutional "ALL" notices + notices matching their assignedScopes / subjectCodes
 * - STUDENT (or guest): notices where targetBranches includes "ALL" or user.branch, AND (targetSemesters is empty OR includes user.semester)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchParam = searchParams.get('branch')?.toUpperCase().trim();
    const categoryParam = searchParams.get('category')?.toUpperCase().trim();

    const caller = await getCurrentAuthUser().catch(() => null);
    const syncedUser = caller?.isAuthenticated ? await syncAndGetCurrentUser().catch(() => null) : null;

    const allNotices = await prisma.notice.findMany({
      where: {
        ...(categoryParam && categoryParam !== 'ALL' ? { category: categoryParam } : {}),
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: { id: true, fullName: true, role: true, branch: true, designation: true },
        },
      },
      take: 100,
    });

    const roleUpper = (syncedUser?.role || caller?.role || 'student').toUpperCase();

    let filtered = allNotices;

    if (roleUpper === 'ADMIN') {
      if (branchParam && branchParam !== 'ALL') {
        filtered = allNotices.filter((n) => {
          const branches = n.targetBranches?.length ? n.targetBranches : [n.targetBranch];
          return branches.includes('ALL') || branches.includes(branchParam);
        });
      }
    } else if (roleUpper === 'FACULTY') {
      const scopes = Array.isArray(syncedUser?.assignedScopes)
        ? (syncedUser.assignedScopes as unknown as FacultyScope[])
        : [];
      filtered = allNotices.filter((n) => {
        const branches = n.targetBranches?.length ? n.targetBranches : [n.targetBranch];
        if (branches.includes('ALL')) return true;
        const semesters = n.targetSemesters?.length
          ? n.targetSemesters
          : n.targetSemester
          ? [n.targetSemester]
          : [];
        return scopes.some((scope) => {
          const branchOk = branches.some(
            (b) => b.toUpperCase() === scope.branch.toUpperCase()
          );
          if (!branchOk) return false;
          const semOk =
            semesters.length === 0 ||
            semesters.some((sem) => scope.semesters.map(Number).includes(Number(sem)));
          if (!semOk) return false;
          if (
            n.subjectCode &&
            Array.isArray(scope.subjectCodes) &&
            scope.subjectCodes.length > 0
          ) {
            return scope.subjectCodes
              .map((c) => c.toUpperCase())
              .includes(n.subjectCode.toUpperCase());
          }
          return true;
        });
      });
    } else {
      // STUDENT or unauthenticated preview
      const studentBranch = (branchParam && branchParam !== 'ALL'
        ? branchParam
        : syncedUser?.branch || caller?.branch || ''
      )
        .toUpperCase()
        .trim();
      const studentSemester = Number(syncedUser?.semester || caller?.semester || 0);

      filtered = allNotices.filter((n) => {
        const branches = (n.targetBranches?.length ? n.targetBranches : [n.targetBranch]).map(
          (b) => b.toUpperCase()
        );
        const branchOk =
          branches.includes('ALL') ||
          !studentBranch ||
          branches.includes(studentBranch);
        if (!branchOk) return false;

        const semesters = n.targetSemesters?.length
          ? n.targetSemesters
          : n.targetSemester
          ? [n.targetSemester]
          : [];
        if (semesters.length === 0 || !studentSemester) return true;
        return semesters.map(Number).includes(studentSemester);
      });
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      notices: filtered.slice(0, 50),
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
 * For FACULTY, verifies every (branch, semester, subjectCode) target against canFacultyAccessScope().
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (
      !caller.isAuthenticated ||
      !caller.userId ||
      (caller.role !== 'faculty' && caller.role !== 'admin')
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Faculty or Admin clearance required to publish official notices.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      title,
      content,
      category = 'ACADEMIC',
      subjectCode,
      subjectName,
      targetBranch = 'ALL',
      targetBranches,
      targetSemester,
      targetSemesters,
      examDate,
      eventDate,
      isPinned = false,
    } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required to publish a notice.' },
        { status: 400 }
      );
    }

    const branchesArray: string[] =
      Array.isArray(targetBranches) && targetBranches.length > 0
        ? Array.from(new Set(targetBranches.map((b: any) => String(b).toUpperCase().trim())))
        : [String(targetBranch || 'ALL').toUpperCase().trim()];

    const semestersArray: number[] =
      Array.isArray(targetSemesters) && targetSemesters.length > 0
        ? Array.from<number>(
            new Set(
              targetSemesters
                .map((s: any) => Number(s))
                .filter((n: number) => Number.isInteger(n) && n >= 1 && n <= 8)
            )
          ).sort((a, b) => a - b)
        : targetSemester
        ? [Math.min(8, Math.max(1, Number(targetSemester)))]
        : [];

    const syncedUser = await syncAndGetCurrentUser();

    if (caller.role === 'faculty') {
      if (branchesArray.includes('ALL') || semestersArray.length === 0) {
        return NextResponse.json(
          {
            error:
              'Forbidden: Faculty must target specific assigned branches and semesters (cannot broadcast to ALL).',
          },
          { status: 403 }
        );
      }
      for (const b of branchesArray) {
        for (const s of semestersArray) {
          if (!canFacultyAccessScope(syncedUser, b, s, subjectCode || null)) {
            return NextResponse.json(
              {
                error: `Forbidden: ${b} Semester ${s}${
                  subjectCode ? ` (${subjectCode})` : ''
                } is outside your assigned teaching scope.`,
              },
              { status: 403 }
            );
          }
        }
      }
    }

    const dbUser =
      syncedUser ||
      (await prisma.user.upsert({
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
      }));

    const rawDate = eventDate || examDate;
    const parsedDate = rawDate ? new Date(rawDate) : null;
    const validDate = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: String(category).toUpperCase().trim(),
        subjectCode: subjectCode ? String(subjectCode).toUpperCase().trim() : null,
        subjectName: subjectName ? String(subjectName).trim() : null,
        targetBranch: branchesArray[0] || 'ALL',
        targetSemester: semestersArray[0] ?? null,
        targetBranches: branchesArray,
        targetSemesters: semestersArray,
        examDate: validDate,
        eventDate: validDate,
        isPinned: Boolean(isPinned),
        authorId: dbUser.id,
        authorName: dbUser.fullName || caller.fullName || 'SETGOI Faculty',
        authorRole: caller.role.toUpperCase(),
        authorDesignation: dbUser.designation || null,
      },
      include: {
        author: {
          select: { id: true, fullName: true, role: true, designation: true },
        },
      },
    });

    await recordAuditLog({
      actorId: caller.userId || 'faculty',
      actor: caller.email || caller.fullName || 'Faculty/Admin',
      actorEmail: caller.email || undefined,
      actorRole: caller.role.toUpperCase(),
      action: 'NOTICE_PUBLISHED',
      target: notice.title,
      targetType: 'NOTICE',
      targetLabel: notice.title,
      details: `Published ${notice.category} notice for ${branchesArray.join(', ')}${
        semestersArray.length ? ` (Sem ${semestersArray.join(', ')})` : ''
      }${notice.subjectCode ? ` [${notice.subjectCode}]` : ''}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Notice published successfully.',
        notice,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[Notices POST] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to publish notice' },
      { status: 500 }
    );
  }
}
