import { MAKAUT_SYLLABUS } from '@/lib/makaut-syllabus';
import { SubjectEntry } from '../types';

export interface SemesterCurriculumPreset {
  semesterNumber: number;
  branch: string;
  defaultCredits: number;
  subjects: Omit<SubjectEntry, 'id' | 'grade'>[];
}

export const MAKAUT_SEMESTER_PRESETS: SemesterCurriculumPreset[] = [1, 2, 3, 4, 5, 6, 7, 8].map(
  (semesterNumber) => {
    const subs = MAKAUT_SYLLABUS.CSE[semesterNumber] || [];
    const defaultCredits = subs.reduce((acc, s) => acc + (s.credits || 0), 0);
    return {
      semesterNumber,
      branch: 'CSE',
      defaultCredits,
      subjects: subs.map((s) => ({
        code: s.code,
        name: s.name,
        credits: s.credits,
      })),
    };
  }
);
