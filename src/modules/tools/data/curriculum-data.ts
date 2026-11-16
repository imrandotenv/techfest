import { SubjectEntry } from '../types';

export interface SemesterCurriculumPreset {
  semesterNumber: number;
  branch: string;
  defaultCredits: number;
  subjects: Omit<SubjectEntry, 'id' | 'grade'>[];
}

export const MAKAUT_SEMESTER_PRESETS: SemesterCurriculumPreset[] = [
  {
    semesterNumber: 1,
    branch: 'CSE',
    defaultCredits: 20.5,
    subjects: [
      { code: 'BS-PH101', name: 'Physics-I', credits: 4 },
      { code: 'BS-M101', name: 'Mathematics-IB', credits: 4 },
      { code: 'ES-EE101', name: 'Basic Electrical Engineering', credits: 4 },
      { code: 'BS-PH191', name: 'Physics-I Laboratory', credits: 1.5 },
      { code: 'ES-EE191', name: 'Basic Electrical Engg Laboratory', credits: 1 },
      { code: 'ES-ME192', name: 'Engineering Graphics & Design', credits: 3 },
      { code: 'HM-HU101', name: 'English', credits: 2 },
      { code: 'HM-HU191', name: 'Language Laboratory', credits: 1 },
    ],
  },
  {
    semesterNumber: 2,
    branch: 'CSE',
    defaultCredits: 20.5,
    subjects: [
      { code: 'BS-CH201', name: 'Chemistry-I', credits: 4 },
      { code: 'BS-M201', name: 'Mathematics-IIB', credits: 4 },
      { code: 'ES-CS201', name: 'Programming for Problem Solving (C)', credits: 3 },
      { code: 'BS-CH291', name: 'Chemistry-I Laboratory', credits: 1.5 },
      { code: 'ES-CS291', name: 'Programming for Problem Solving Lab', credits: 2 },
      { code: 'ES-ME291', name: 'Workshop / Manufacturing Practices', credits: 3 },
      { code: 'HM-HU201', name: 'Professional Communication', credits: 2 },
      { code: 'HM-HU291', name: 'Soft Skills Laboratory', credits: 1 },
    ],
  },
  {
    semesterNumber: 3,
    branch: 'CSE',
    defaultCredits: 22.0,
    subjects: [
      { code: 'PCC-CS301', name: 'Data Structures & Algorithms', credits: 4 },
      { code: 'ESC301', name: 'Digital System Design & Logic', credits: 3 },
      { code: 'BSC301', name: 'Mathematics-III (Differential Calculus)', credits: 3 },
      { code: 'HSMC301', name: 'Economics for Engineers', credits: 2 },
      { code: 'PCC-CS302', name: 'IT Workshop (Python & Linux Shell)', credits: 3 },
      { code: 'PCC-CS391', name: 'Data Structures Laboratory', credits: 2 },
      { code: 'ESC391', name: 'Digital System Design Laboratory', credits: 2 },
      { code: 'PCC-CS392', name: 'IT Workshop Laboratory', credits: 2 },
      { code: 'MC381', name: 'Constitution of India (Mandatory Non-Credit)', credits: 1 },
    ],
  },
  {
    semesterNumber: 4,
    branch: 'CSE',
    defaultCredits: 22.0,
    subjects: [
      { code: 'PCC-CS401', name: 'Discrete Mathematics', credits: 4 },
      { code: 'PCC-CS402', name: 'Computer Organization & Architecture', credits: 4 },
      { code: 'PCC-CS403', name: 'Formal Language & Automata Theory', credits: 3 },
      { code: 'PCC-CS404', name: 'Design & Analysis of Algorithms', credits: 4 },
      { code: 'HSMC401', name: 'Environmental Sciences', credits: 2 },
      { code: 'PCC-CS492', name: 'Computer Architecture Laboratory', credits: 2 },
      { code: 'PCC-CS494', name: 'Algorithms Laboratory', credits: 2 },
      { code: 'MC481', name: 'Essence of Indian Traditional Knowledge', credits: 1 },
    ],
  },
  {
    semesterNumber: 5,
    branch: 'CSE',
    defaultCredits: 21.5,
    subjects: [
      { code: 'PCC-CS501', name: 'Compiler Design', credits: 3 },
      { code: 'PCC-CS502', name: 'Operating Systems', credits: 4 },
      { code: 'PCC-CS503', name: 'Object Oriented Programming with Java', credits: 3 },
      { code: 'PEC-IT501', name: 'Professional Elective I (Cloud / Web Tech)', credits: 3 },
      { code: 'MC501', name: 'Constitution of India & Cyber Law', credits: 1.5 },
      { code: 'PCC-CS591', name: 'Compiler Design Laboratory', credits: 2 },
      { code: 'PCC-CS592', name: 'Operating Systems Laboratory', credits: 2 },
      { code: 'PCC-CS593', name: 'OOPs Java Laboratory', credits: 2 },
      { code: 'PROJ-CS501', name: 'Industrial Training / Internship-I', credits: 1 },
    ],
  },
  {
    semesterNumber: 6,
    branch: 'CSE',
    defaultCredits: 21.5,
    subjects: [
      { code: 'PCC-CS601', name: 'Computer Networks', credits: 4 },
      { code: 'PCC-CS602', name: 'Database Management Systems', credits: 4 },
      { code: 'PEC-CS601', name: 'Software Engineering & Agile', credits: 3 },
      { code: 'OEC-CS601', name: 'Open Elective I (Cybersecurity / IoT)', credits: 3 },
      { code: 'HSMC601', name: 'Principles of Management', credits: 2 },
      { code: 'PCC-CS691', name: 'Computer Networks Laboratory', credits: 2 },
      { code: 'PCC-CS692', name: 'DBMS Laboratory', credits: 2 },
      { code: 'PROJ-CS601', name: 'Minor Project-I', credits: 1.5 },
    ],
  },
  {
    semesterNumber: 7,
    branch: 'CSE',
    defaultCredits: 19.0,
    subjects: [
      { code: 'PEC-CS701', name: 'Artificial Intelligence & Machine Learning', credits: 3 },
      { code: 'PEC-CS702', name: 'Distributed Systems & Microservices', credits: 3 },
      { code: 'OEC-CS701', name: 'Open Elective II (Big Data Analytics)', credits: 3 },
      { code: 'PROJ-CS781', name: 'Major Project Phase-I', credits: 4 },
      { code: 'PROJ-CS782', name: 'Industrial Summer Internship Viva', credits: 2 },
      { code: 'PEC-CS791', name: 'AI & ML Laboratory', credits: 2 },
      { code: 'OEC-CS791', name: 'Big Data Tools Laboratory', credits: 2 },
    ],
  },
  {
    semesterNumber: 8,
    branch: 'CSE',
    defaultCredits: 16.0,
    subjects: [
      { code: 'PEC-CS801', name: 'Deep Learning & Natural Language Processing', credits: 3 },
      { code: 'OEC-CS801', name: 'Open Elective III (Blockchain Architecture)', credits: 3 },
      { code: 'PROJ-CS881', name: 'Major Project Phase-II & Defence Viva', credits: 8 },
      { code: 'PROJ-CS882', name: 'Comprehensive Grand Viva', credits: 2 },
    ],
  },
];
