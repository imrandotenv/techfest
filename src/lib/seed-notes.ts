import { prisma } from '@/lib/prisma';

let seedingPromise: Promise<void> | null = null;

/**
 * Idempotently seeds 4 authentic MAKAUT 3rd-semester Faculty Verified starter resources
 * if the Note table in Neon PostgreSQL is completely empty.
 */
export async function ensureStarterNotesSeeded(): Promise<void> {
  if (seedingPromise) return seedingPromise;

  seedingPromise = (async () => {
    try {
      const count = await prisma.note.count();
      if (count > 0) return;

      const facultyUser = await prisma.user.upsert({
        where: { email: 'hod.cse@setgoi.ac.in' },
        update: {},
        create: {
          clerkId: 'seed_faculty_setgoi_cse',
          email: 'hod.cse@setgoi.ac.in',
          fullName: 'Prof. Subhash Mukherjee (CSE Dept)',
          role: 'FACULTY',
          degree: 'B.Tech',
          branch: 'CSE',
          semester: 3,
          onboardingCompleted: true,
        },
      });

      await prisma.note.createMany({
        data: [
          {
            title: 'Data Structures & Algorithms — Complete Module 1–5 Lecture Notes',
            subjectCode: 'PCC-CS301',
            subjectName: 'Data Structure & Algorithms',
            branch: 'CSE',
            semester: 3,
            fileUrl: '/notes?read=PCC-CS301',
            fileKey: 'seed/pcc-cs301-dsa-notes.html',
            fileSize: 3240000,
            verified: true,
            uploaderId: facultyUser.id,
          },
          {
            title: 'Analog & Digital Electronics — Solved PYQ & K-Map Minimization Guide',
            subjectCode: 'ESC 301',
            subjectName: 'Analog and Digital Electronics',
            branch: 'CSE',
            semester: 3,
            fileUrl: '/notes?read=ESC-301',
            fileKey: 'seed/esc301-ade-pyq.html',
            fileSize: 2150000,
            verified: true,
            uploaderId: facultyUser.id,
          },
          {
            title: 'Computer Organisation — Booths Algorithm, ALU & Pipelining Notes',
            subjectCode: 'PCC-CS302',
            subjectName: 'Computer Organisation',
            branch: 'CSE',
            semester: 3,
            fileUrl: '/notes?read=PCC-CS302',
            fileKey: 'seed/pcc-cs302-co-notes.html',
            fileSize: 2890000,
            verified: true,
            uploaderId: facultyUser.id,
          },
          {
            title: 'Mathematics-III — Differential Calculus & Probability Solved PYQs',
            subjectCode: 'BSC 301',
            subjectName: 'Mathematics-III (Differential Calculus)',
            branch: 'CSE',
            semester: 3,
            fileUrl: '/notes?read=BSC-301',
            fileKey: 'seed/bsc301-math3-pyq.html',
            fileSize: 2480000,
            verified: true,
            uploaderId: facultyUser.id,
          },
        ],
      });
    } catch (err) {
      console.warn('[SeedNotes] Starter notes seed warning:', err);
    } finally {
      seedingPromise = null;
    }
  })();

  return seedingPromise;
}
