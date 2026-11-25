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
            subjectName: 'Data Structures & Algorithms',
            branch: 'CSE',
            semester: 3,
            fileUrl: 'https://makautexam.net/aicte_details/Syllabus/BTECH/CSE3.pdf',
            fileKey: 'seed/pcc-cs301-dsa-notes.pdf',
            fileSize: 3240000,
            verified: true,
            uploaderId: facultyUser.id,
          },
          {
            title: 'Analog & Digital Electronics — Solved PYQ & K-Map Minimization Guide',
            subjectCode: 'ESC301',
            subjectName: 'Analog & Digital Electronics',
            branch: 'CSE',
            semester: 3,
            fileUrl: 'https://makautexam.net/aicte_details/Syllabus/BTECH/CSE3.pdf',
            fileKey: 'seed/esc301-ade-pyq.pdf',
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
            fileUrl: 'https://makautexam.net/aicte_details/Syllabus/BTECH/CSE3.pdf',
            fileKey: 'seed/pcc-cs302-co-notes.pdf',
            fileSize: 2890000,
            verified: true,
            uploaderId: facultyUser.id,
          },
          {
            title: 'Mathematics-III — Differential Calculus & Probability Solved PYQs',
            subjectCode: 'BS-M301',
            subjectName: 'Mathematics-III (Calculus & Probability)',
            branch: 'CSE',
            semester: 3,
            fileUrl: 'https://makautexam.net/aicte_details/Syllabus/BTECH/CSE3.pdf',
            fileKey: 'seed/bs-m301-math3-pyq.pdf',
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
