import {
  MAKAUT_SYLLABUS,
  SyllabusBranch,
  normalizeSyllabusBranch,
} from '@/lib/makaut-syllabus';

export type BTechBranch = SyllabusBranch;

export interface SubjectItem {
  code: string;
  name: string;
  type: 'Theory' | 'Lab' | 'Sessional' | 'Elective' | 'Mandatory';
  credits: number;
  description?: string;
}

export interface BranchInfo {
  code: BTechBranch;
  name: string;
  fullTitle: string;
  hod: string;
  departmentOffice: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const BTECH_BRANCHES: Record<BTechBranch, BranchInfo> = {
  CSE: {
    code: 'CSE',
    name: 'Computer Science',
    fullTitle: 'Computer Science & Engineering',
    hod: 'Dr. P. Roy',
    departmentOffice: 'Aryabhatta Block • 3rd Floor',
    color: '#2563EB',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#2563EB]',
  },
  'CSE-AIML': {
    code: 'CSE-AIML',
    name: 'CSE (AI & ML)',
    fullTitle: 'CSE (Artificial Intelligence & Machine Learning)',
    hod: 'Dr. S. K. Mondal',
    departmentOffice: 'Aryabhatta Block • 3rd Floor East',
    color: '#6366F1',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
  'CSE-DS': {
    code: 'CSE-DS',
    name: 'CSE (Data Science)',
    fullTitle: 'CSE (Data Science)',
    hod: 'Dr. A. Ghosh',
    departmentOffice: 'Aryabhatta Block • 4th Floor',
    color: '#06B6D4',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
  },
  ECE: {
    code: 'ECE',
    name: 'Electronics & Comm.',
    fullTitle: 'Electronics & Communication Engineering',
    hod: 'Dr. S. Mukherjee',
    departmentOffice: 'Bhabha Block • 2nd Floor',
    color: '#10B981',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  EE: {
    code: 'EE',
    name: 'Electrical Engg.',
    fullTitle: 'Electrical Engineering',
    hod: 'Prof. A. Banerjee',
    departmentOffice: 'Tesla Block • Ground Floor',
    color: '#F59E0B',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  EEE: {
    code: 'EEE',
    name: 'Electrical & Electronics',
    fullTitle: 'Electrical & Electronics Engineering',
    hod: 'Prof. A. Banerjee',
    departmentOffice: 'Tesla Block • 1st Floor',
    color: '#F97316',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
  },
  ME: {
    code: 'ME',
    name: 'Mechanical Engg.',
    fullTitle: 'Mechanical Engineering',
    hod: 'Dr. K. Dasgupta',
    departmentOffice: 'Mechanical Workshop Complex',
    color: '#EC4899',
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-700',
  },
  CE: {
    code: 'CE',
    name: 'Civil Engg.',
    fullTitle: 'Civil Engineering',
    hod: 'Prof. R. Sengupta',
    departmentOffice: 'Visvesvaraya Block • 1st Floor',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
  },
};

function mapSubjectType(t: string): SubjectItem['type'] {
  if (t === 'LAB') return 'Lab';
  if (t === 'SESSIONAL') return 'Sessional';
  if (t === 'ELECTIVE') return 'Elective';
  if (t === 'MANDATORY') return 'Mandatory';
  return 'Theory';
}

export const MAKAUT_CURRICULUM: Record<BTechBranch, Record<number, SubjectItem[]>> = (
  Object.keys(MAKAUT_SYLLABUS) as BTechBranch[]
).reduce((acc, branch) => {
  acc[branch] = {};
  for (const semStr of Object.keys(MAKAUT_SYLLABUS[branch])) {
    const sem = Number(semStr);
    acc[branch][sem] = MAKAUT_SYLLABUS[branch][sem].map((s) => ({
      code: s.code,
      name: s.name,
      type: mapSubjectType(s.type),
      credits: s.credits,
    }));
  }
  return acc;
}, {} as Record<BTechBranch, Record<number, SubjectItem[]>>);

export function getSuggestedPassoutYear(currentSemester: number = 3): number {
  const currentYear = new Date().getFullYear();
  if (currentSemester <= 2) return currentYear + 3;
  if (currentSemester <= 4) return currentYear + 2;
  if (currentSemester <= 6) return currentYear + 1;
  return currentYear;
}

export function getSemesterSubjects(branch: string = 'CSE', semester: number = 3): SubjectItem[] {
  const normalizedBranch = normalizeSyllabusBranch(branch);
  const branchMap = MAKAUT_CURRICULUM[normalizedBranch] || MAKAUT_CURRICULUM.CSE;
  return branchMap[semester] || branchMap[3] || [];
}

export function getBranchDetails(branch: string = 'CSE'): BranchInfo {
  const normalized = normalizeSyllabusBranch(branch);
  return BTECH_BRANCHES[normalized] || BTECH_BRANCHES.CSE;
}
