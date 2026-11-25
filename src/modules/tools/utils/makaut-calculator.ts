import {
  GradeDefinition,
  LetterGrade,
  SemesterDetail,
  SubjectEntry,
  CumulativeCalculationSummary
} from '../types';

export const MAKAUT_GRADE_SYSTEM: GradeDefinition[] = [
  { letter: 'O', points: 10, percentageRange: '90% – 100%', description: 'Outstanding' },
  { letter: 'E', points: 9, percentageRange: '80% – 89%', description: 'Excellent' },
  { letter: 'A', points: 8, percentageRange: '70% – 79%', description: 'Very Good' },
  { letter: 'B', points: 7, percentageRange: '60% – 69%', description: 'Good' },
  { letter: 'C', points: 6, percentageRange: '50% – 59%', description: 'Fair / Average' },
  { letter: 'D', points: 5, percentageRange: '40% – 49%', description: 'Pass' },
  { letter: 'F', points: 0, percentageRange: 'Below 40%', description: 'Fail' },
];

export function getGradePoints(grade: LetterGrade): number {
  const match = MAKAUT_GRADE_SYSTEM.find((g) => g.letter === grade);
  return match ? match.points : 0;
}

/**
 * Calculates SGPA from an array of subjects for a given semester
 */
export function calculateSubjectSGPA(subjects: SubjectEntry[]): {
  sgpa: number;
  totalCredits: number;
  creditIndex: number;
  percentage: number;
  hasBacklog: boolean;
} {
  if (!subjects.length) {
    return { sgpa: 0, totalCredits: 0, creditIndex: 0, percentage: 0, hasBacklog: false };
  }

  let totalCredits = 0;
  let creditIndex = 0;
  let hasBacklog = false;

  for (const subject of subjects) {
    const credits = Math.max(0, Number(subject.credits) || 0);
    // Non-credit mandatory courses (0 credits) are excluded from SGPA denominator
    if (credits <= 0) continue;
    const points = getGradePoints(subject.grade);
    if (subject.grade === 'F') {
      hasBacklog = true;
    }
    totalCredits += credits;
    creditIndex += credits * points;
  }

  const rawSgpa = totalCredits > 0 ? creditIndex / totalCredits : 0;
  const sgpa = Number(rawSgpa.toFixed(2));
  const percentage = calculatePercentageFromGpa(sgpa);

  return {
    sgpa,
    totalCredits,
    creditIndex: Number(creditIndex.toFixed(2)),
    percentage,
    hasBacklog,
  };
}

/**
 * Official MAKAUT Percentage formula: (GPA - 0.75) * 10
 */
export function calculatePercentageFromGpa(gpa: number): number {
  if (gpa <= 0.75) return 0;
  return Number(((gpa - 0.75) * 10).toFixed(2));
}

/**
 * Calculates YGPA for 2 consecutive semesters (Odd + Even)
 */
export function calculateYGPA(
  oddSem: SemesterDetail,
  evenSem: SemesterDetail
): {
  ygpa: number;
  totalCredits: number;
  totalCreditIndex: number;
  isHonoursPacing: boolean;
} {
  const oddCredits = Math.max(0, Number(oddSem.credits) || 0);
  const oddSgpa = Math.max(0, Number(oddSem.sgpa) || 0);
  const oddIndex = oddCredits * oddSgpa;

  const evenCredits = Math.max(0, Number(evenSem.credits) || 0);
  const evenSgpa = Math.max(0, Number(evenSem.sgpa) || 0);
  const evenIndex = evenCredits * evenSgpa;

  const totalCredits = oddCredits + evenCredits;
  const totalCreditIndex = oddIndex + evenIndex;

  const ygpa = totalCredits > 0 ? Number((totalCreditIndex / totalCredits).toFixed(2)) : 0;
  const isHonoursPacing = ygpa >= 7.5;

  return {
    ygpa,
    totalCredits,
    totalCreditIndex: Number(totalCreditIndex.toFixed(2)),
    isHonoursPacing,
  };
}

/**
 * Calculates Cumulative CGPA, Year-wise YGPA, and MAKAUT degree honors status
 */
export function calculateCumulativeCGPA(semesters: SemesterDetail[]): CumulativeCalculationSummary {
  let totalCredits = 0;
  let totalCreditIndex = 0;

  for (const sem of semesters) {
    const credits = Math.max(0, Number(sem.credits) || 0);
    const sgpa = Math.max(0, Number(sem.sgpa) || 0);
    if (credits > 0 && sgpa > 0) {
      totalCredits += credits;
      totalCreditIndex += credits * sgpa;
    }
  }

  const rawCgpa = totalCredits > 0 ? totalCreditIndex / totalCredits : 0;
  const cgpa = Number(rawCgpa.toFixed(2));
  const percentage = calculatePercentageFromGpa(cgpa);

  let classification = 'Not Yet Graded';
  if (cgpa >= 7.5) {
    classification = '1st Class with Honours / Distinction';
  } else if (cgpa >= 6.5) {
    classification = '1st Class';
  } else if (cgpa >= 5.0) {
    classification = '2nd Class';
  } else if (cgpa > 0) {
    classification = 'Pass';
  }

  // Calculate year-wise pairs
  const yearWiseYgpa: CumulativeCalculationSummary['yearWiseYgpa'] = [];
  const years = [
    { year: 1, label: '1st Year (Sem 1 & 2)', oddNum: 1, evenNum: 2 },
    { year: 2, label: '2nd Year (Sem 3 & 4)', oddNum: 3, evenNum: 4 },
    { year: 3, label: '3rd Year (Sem 5 & 6)', oddNum: 5, evenNum: 6 },
    { year: 4, label: '4th Year (Sem 7 & 8)', oddNum: 7, evenNum: 8 },
  ];

  for (const y of years) {
    const odd = semesters.find((s) => s.semesterNumber === y.oddNum) || {
      id: `sem-${y.oddNum}`,
      semesterNumber: y.oddNum,
      semesterName: `Semester ${y.oddNum}`,
      credits: 0,
      sgpa: 0,
    };
    const even = semesters.find((s) => s.semesterNumber === y.evenNum) || {
      id: `sem-${y.evenNum}`,
      semesterNumber: y.evenNum,
      semesterName: `Semester ${y.evenNum}`,
      credits: 0,
      sgpa: 0,
    };

    const ygpaCalc = calculateYGPA(odd, even);
    yearWiseYgpa.push({
      year: y.year,
      yearLabel: y.label,
      oddSem: odd,
      evenSem: even,
      ygpa: ygpaCalc.ygpa,
      creditsYear: ygpaCalc.totalCredits,
      isHonoursPacing: ygpaCalc.isHonoursPacing,
    });
  }

  return {
    totalCredits,
    totalCreditIndex: Number(totalCreditIndex.toFixed(2)),
    cgpa,
    percentage,
    classification,
    isHonoursEligible: cgpa >= 7.5,
    yearWiseYgpa,
  };
}

/**
 * Standard MAKAUT B.Tech Credit Distribution Template
 */
export const DEFAULT_MAKAUT_SEMESTERS: SemesterDetail[] = [
  { id: 'sem-1', semesterNumber: 1, semesterName: 'Semester 1', credits: 20.5, sgpa: 8.5 },
  { id: 'sem-2', semesterNumber: 2, semesterName: 'Semester 2', credits: 20.5, sgpa: 8.6 },
  { id: 'sem-3', semesterNumber: 3, semesterName: 'Semester 3', credits: 22.0, sgpa: 8.2 },
  { id: 'sem-4', semesterNumber: 4, semesterName: 'Semester 4', credits: 22.0, sgpa: 8.4 },
  { id: 'sem-5', semesterNumber: 5, semesterName: 'Semester 5', credits: 21.5, sgpa: 0 },
  { id: 'sem-6', semesterNumber: 6, semesterName: 'Semester 6', credits: 21.5, sgpa: 0 },
  { id: 'sem-7', semesterNumber: 7, semesterName: 'Semester 7', credits: 19.0, sgpa: 0 },
  { id: 'sem-8', semesterNumber: 8, semesterName: 'Semester 8', credits: 16.0, sgpa: 0 },
];
