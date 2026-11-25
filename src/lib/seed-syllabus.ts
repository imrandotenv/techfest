import { prisma } from '@/lib/prisma';
import { MAKAUT_SYLLABUS, SyllabusBranch, resolveSubjectType } from '@/lib/makaut-syllabus';

let syllabusSeedPromise: Promise<void> | null = null;

/**
 * Idempotently seeds SyllabusSubject records from MAKAUT_SYLLABUS into Neon PostgreSQL
 * if the table is empty (using skipDuplicates so existing Admin overrides are preserved).
 */
export async function ensureSyllabusSeeded(): Promise<void> {
  if (syllabusSeedPromise) return syllabusSeedPromise;

  syllabusSeedPromise = (async () => {
    try {
      const count = await prisma.syllabusSubject.count();
      if (count > 0) return;

      const records: Array<{
        code: string;
        name: string;
        branch: string;
        semester: number;
        credits: number;
        category: string;
        type: string;
        isActive: boolean;
      }> = [];

      for (const branch of Object.keys(MAKAUT_SYLLABUS) as SyllabusBranch[]) {
        for (const semStr of Object.keys(MAKAUT_SYLLABUS[branch])) {
          const semester = Number(semStr);
          for (const sub of MAKAUT_SYLLABUS[branch][semester]) {
            records.push({
              code: sub.code.toUpperCase().trim(),
              name: sub.name.trim(),
              branch,
              semester,
              credits: sub.credits,
              category: sub.category,
              type: resolveSubjectType(sub),
              isActive: true,
            });
          }
        }
      }

      if (records.length > 0) {
        await prisma.syllabusSubject.createMany({
          data: records,
          skipDuplicates: true,
        });
      }
    } catch (err) {
      console.warn('[SeedSyllabus] Syllabus seed warning:', err);
    } finally {
      syllabusSeedPromise = null;
    }
  })();

  return syllabusSeedPromise;
}
