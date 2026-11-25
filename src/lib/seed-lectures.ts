import { prisma } from '@/lib/prisma';
import { MAKAUT_SYLLABUS, SyllabusBranch } from '@/lib/makaut-syllabus';

let lectureSeedPromise: Promise<void> | null = null;

/**
 * Idempotently seeds official SWAYAM / NPTEL course lectures from MAKAUT_SYLLABUS
 * if the CourseLecture table in Neon PostgreSQL is currently empty.
 */
export async function ensureStarterLecturesSeeded(): Promise<void> {
  if (lectureSeedPromise) return lectureSeedPromise;

  lectureSeedPromise = (async () => {
    try {
      const count = await prisma.courseLecture.count();
      if (count > 0) return;

      const records: Array<{
        title: string;
        subjectCode: string;
        subjectName: string;
        branch: string;
        semester: number;
        platform: string;
        courseUrl: string;
        instructor: string;
        institute: string;
        duration: string;
        verified: boolean;
      }> = [];

      for (const branch of Object.keys(MAKAUT_SYLLABUS) as SyllabusBranch[]) {
        for (const semStr of Object.keys(MAKAUT_SYLLABUS[branch])) {
          const semester = Number(semStr);
          for (const subject of MAKAUT_SYLLABUS[branch][semester]) {
            for (const course of subject.swayamCourses) {
              records.push({
                title: course.title,
                subjectCode: subject.code,
                subjectName: subject.name,
                branch,
                semester,
                platform: course.platform,
                courseUrl: course.url,
                instructor: course.instructor,
                institute: course.institute,
                duration: course.duration,
                verified: true,
              });
            }
          }
        }
      }

      if (records.length > 0) {
        await prisma.courseLecture.createMany({ data: records });
      }
    } catch (err) {
      console.warn('[SeedLectures] Starter lectures seed warning:', err);
    } finally {
      lectureSeedPromise = null;
    }
  })();

  return lectureSeedPromise;
}
