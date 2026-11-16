import {
  MAKAUTSemesterInput,
  YGPACalculationResult,
  AcademicCalendarEvent,
  TechFestEvent
} from '@/types';

export type {
  MAKAUTSemesterInput,
  YGPACalculationResult,
  AcademicCalendarEvent,
  TechFestEvent
};

export type LetterGrade = 'O' | 'E' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface GradeDefinition {
  letter: LetterGrade;
  points: number;
  percentageRange: string;
  description: string;
}

export interface SubjectEntry {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: LetterGrade;
}

export interface SemesterDetail {
  id: string;
  semesterNumber: number; // 1 to 8
  semesterName: string;
  credits: number;
  sgpa: number;
  subjects?: SubjectEntry[];
}

export interface CumulativeCalculationSummary {
  totalCredits: number;
  totalCreditIndex: number;
  cgpa: number;
  percentage: number;
  classification: string;
  isHonoursEligible: boolean;
  yearWiseYgpa: {
    year: number;
    yearLabel: string;
    oddSem: SemesterDetail;
    evenSem: SemesterDetail;
    ygpa: number;
    creditsYear: number;
    isHonoursPacing: boolean;
  }[];
}

// PDF Merger types
export interface PdfMergeFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  file: File;
  previewUrl?: string;
}

export interface PdfMergeResult {
  url: string;
  blob: Blob;
  fileName: string;
  totalPages: number;
  fileSizeBytes: number;
}

// TechFest Types
export interface TechFestRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  department: string;
  semester: string;
  rollNumber: string;
  teamName?: string;
  registeredAt: string;
}

// AI Companion Message Types
export interface CompanionMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
