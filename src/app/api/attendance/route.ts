import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

async function resolveDbUser(clerkUserId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId: clerkUserId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const primaryEmail =
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
    clerkUser?.emailAddresses[0]?.emailAddress ||
    `${clerkUserId}@student.setgoi.ac.in`;
  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
    clerkUser?.username ||
    'SETGOI Scholar';

  return prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: { email: primaryEmail, fullName },
    create: {
      clerkId: clerkUserId,
      email: primaryEmail,
      fullName,
      role: 'STUDENT',
      degree: 'B.Tech',
      branch: 'CSE',
      semester: 3,
      onboardingCompleted: true,
    },
  });
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: true, authenticated: false, records: [] });
    }

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      return NextResponse.json({ success: true, authenticated: true, records: [] });
    }

    const records = await prisma.attendanceRecord.findMany({
      where: { userId: dbUser.id },
      orderBy: { subjectCode: 'asc' },
    });

    return NextResponse.json({ success: true, authenticated: true, records });
  } catch (err: any) {
    console.error('[Attendance GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load attendance' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Sign in to save attendance to Neon DB.' },
        { status: 401 }
      );
    }

    const dbUser = await resolveDbUser(userId);
    const body = await req.json().catch(() => ({}));
    const { branch = 'CSE', semester = 3, records = [] } = body;

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'Attendance records array is required.' }, { status: 400 });
    }

    let totalAttended = 0;
    let totalHeld = 0;

    for (const r of records) {
      const code = String(r.subjectCode || r.code || '').trim();
      const name = String(r.subjectName || r.name || code).trim();
      if (!code) continue;

      const attended = Math.max(0, parseInt(r.attended, 10) || 0);
      const total = Math.max(attended, parseInt(r.total, 10) || 0);
      totalAttended += attended;
      totalHeld += total;

      await prisma.attendanceRecord.upsert({
        where: {
          userId_subjectCode: {
            userId: dbUser.id,
            subjectCode: code,
          },
        },
        update: {
          subjectName: name,
          branch: String(branch || dbUser.branch || 'CSE'),
          semester: Number(semester) || dbUser.semester || 3,
          attended,
          total,
        },
        create: {
          userId: dbUser.id,
          subjectCode: code,
          subjectName: name,
          branch: String(branch || dbUser.branch || 'CSE'),
          semester: Number(semester) || dbUser.semester || 3,
          attended,
          total,
        },
      });
    }

    const attendancePct =
      totalHeld > 0 ? Number(((totalAttended / totalHeld) * 100).toFixed(1)) : 0;

    const existingStats =
      dbUser.academicStats && typeof dbUser.academicStats === 'object'
        ? (dbUser.academicStats as Record<string, any>)
        : {};

    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        academicStats: {
          ...existingStats,
          attendancePct,
          attendedClasses: totalAttended,
          totalClasses: totalHeld,
        },
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/student');

    return NextResponse.json({
      success: true,
      attendancePct,
      attendedClasses: totalAttended,
      totalClasses: totalHeld,
    });
  } catch (err: any) {
    console.error('[Attendance POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save attendance' }, { status: 500 });
  }
}
