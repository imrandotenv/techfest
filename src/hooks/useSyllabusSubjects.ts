'use client';

import { useState, useEffect } from 'react';
import {
  getSubjectsForBranchAndSemester,
  SubjectType,
  SubjectCategory,
} from '@/lib/makaut-syllabus';

export interface LiveSyllabusSubject {
  id?: string;
  code: string;
  name: string;
  credits: number;
  category: string;
  type: SubjectType;
}

/**
 * Hydrates branch & semester subjects from static MAKAUT_SYLLABUS immediately
 * and syncs live overrides/electives/visibility from Neon DB (/api/syllabus).
 */
export function useSyllabusSubjects(branch?: string | null, semester?: number | null) {
  const [subjects, setSubjects] = useState<LiveSyllabusSubject[]>(() =>
    getSubjectsForBranchAndSemester(branch, semester).map((s) => ({
      code: s.code,
      name: s.name,
      credits: s.credits,
      category: s.category as SubjectCategory,
      type: s.type,
    }))
  );

  useEffect(() => {
    const fallback = getSubjectsForBranchAndSemester(branch, semester).map((s) => ({
      code: s.code,
      name: s.name,
      credits: s.credits,
      category: s.category,
      type: s.type,
    }));
    setSubjects(fallback);

    if (!branch || !semester) return;

    let active = true;
    fetch(`/api/syllabus?branch=${encodeURIComponent(branch)}&semester=${semester}`)
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success && Array.isArray(json.subjects) && json.subjects.length > 0) {
          setSubjects(
            json.subjects.map((s: any) => ({
              id: s.id,
              code: s.code,
              name: s.name,
              credits: s.credits,
              category: s.category,
              type: (s.type || 'THEORY') as SubjectType,
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [branch, semester]);

  return subjects;
}
