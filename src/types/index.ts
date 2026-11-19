export type CustomUserRole = 'student' | 'college' | 'admin';

export interface UserPublicMetadata {
  role?: CustomUserRole;
  studentId?: string;
  department?: string;
  isSuperAdmin?: boolean;
}

// ----------------------------------------------------
// CAMPUS DIRECTORY & INFRASTRUCTURE TYPES
// ----------------------------------------------------
export interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  hodEmail: string;
  description: string;
  intakeCapacity: number;
  locationBuilding: string;
  establishedYear: number;
}

export interface FacultyMember {
  id: string;
  fullName: string;
  departmentCode: string;
  designation: string;
  email: string;
  phone?: string;
  officeRoom: string;
  officeHours: string;
  researchInterests: string[];
}

export interface HostelInfo {
  id: string;
  name: string;
  gender: 'Boys' | 'Girls';
  wardenName: string;
  wardenContact: string;
  capacity: number;
  curfewTime: string;
  messTimings: {
    breakfast: string;
    lunch: string;
    snacks: string;
    dinner: string;
  };
  rules: string[];
}

export interface BusStop {
  stopName: string;
  timeMorning: string;
  timeEvening: string;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverContact: string;
  stops: BusStop[];
}

export interface EmergencyContact {
  id: string;
  service: string;
  department: string;
  phone: string;
  availableHours: string;
  location: string;
}

export interface CampusZone {
  id: string;
  name: string;
  tag: string;
  description: string;
  levels: number;
  departmentsHoused: string[];
  coordinates: { x: number; y: number; z: number };
}

// ----------------------------------------------------
// NOTES & MAKAUT PYQ VAULT TYPES
// ----------------------------------------------------
export type NoteCategory = 'LECTURE_NOTE' | 'MAKAUT_PYQ' | 'LAB_MANUAL' | 'SYLLABUS_COPY' | 'CHEAT_SHEET';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface NoteItem {
  id: string;
  title: string;
  subjectCode: string; // e.g., 'PCC-CS301'
  subjectName: string;
  departmentCode: string; // 'CSE', 'ECE', etc.
  semester: number; // 1 to 8
  category: NoteCategory;
  academicYear: string;
  fileUrl: string;
  fileSize: number; // in bytes
  downloadsCount: number;
  status: VerificationStatus;
  uploaderId: string;
  uploaderName: string;
  uploaderRole: CustomUserRole;
  verifiedById?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  createdAt: string;
}

// ----------------------------------------------------
// DISCUSSION FORUM TYPES
// ----------------------------------------------------
export type ForumCategory = 'Academic' | 'TechFest' | 'Campus Life' | 'Placements' | 'Hostel';

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: CustomUserRole;
  isOfficialAnswer: boolean;
  upvotesCount: number;
  parentId?: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  authorId: string;
  authorName: string;
  authorRole: CustomUserRole;
  isPinned: boolean;
  upvotesCount: number;
  replies: ForumReply[];
  createdAt: string;
}

// ----------------------------------------------------
// TOOLS & UTILITIES TYPES
// ----------------------------------------------------
export interface MAKAUTSemesterInput {
  id: string;
  semesterName: string;
  sgpa: number;
  credits: number;
}

export interface YGPACalculationResult {
  oddSemCreditIndex: number;
  evenSemCreditIndex: number;
  totalOddCredits: number;
  totalEvenCredits: number;
  ygpa: number;
  isHonorsPacing: boolean;
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  term: 'Odd Semester 2026–27' | 'Even Semester 2026–27' | 'Annual / MAR & MOOCs';
  startDate: string;
  endDate?: string;
  category: 'Class Test' | 'Examination' | 'Enrollment' | 'Academic' | 'Internship';
  isCrucial: boolean;
}

export interface TechFestEvent {
  id: string;
  title: string;
  category: 'technical' | 'cultural' | 'workshop';
  dateString: string;
  description: string;
  coordinators: string[];
  venue: string;
  registrationOpen: boolean;
}
