import { NoteCategory, VerificationStatus } from '@/types';

export type BranchCode = 'CSE' | 'ECE' | 'EE' | 'ME' | 'CE' | 'IT' | 'AIML';

export interface MAKAUTSubject {
  code: string;
  name: string;
  branch: BranchCode | 'ALL';
  semester: number;
  credits: number;
  type: 'Theory' | 'Practical' | 'Sessional';
  syllabusCategory: 'PCC' | 'BSC' | 'ESC' | 'HSMC' | 'PEC' | 'OEC' | 'MC' | 'PROJ';
}

export interface NoteFilterState {
  searchQuery: string;
  branch: BranchCode | 'ALL';
  semester: number | 'ALL';
  category: NoteCategory | 'ALL';
  status: VerificationStatus | 'ALL';
}

export interface UploadNoteFormData {
  title: string;
  subjectCode: string;
  subjectName: string;
  departmentCode: BranchCode;
  semester: number;
  category: NoteCategory;
  academicYear: string;
  file?: File | null;
  fileUrl?: string;
  fileSize?: number;
}
