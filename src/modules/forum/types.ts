import { CustomUserRole } from '@/types';

export type { CustomUserRole };

export type ForumCategory =
  | 'Academics & Syllabus'
  | 'Coding & DSA'
  | 'Labs & Viva'
  | 'Placements & Internships'
  | 'Engineering Campus'
  | 'Academic'
  | 'TechFest'
  | 'Campus Life'
  | 'Placements';

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: CustomUserRole;
  authorDepartment?: string;
  isOfficialAnswer: boolean;
  isVerifiedFaculty?: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  upvotesCount: number;
  userUpvoted?: boolean;
  parentId?: string | null;
  createdAt: string;
  children?: ForumReply[];
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  authorId: string;
  authorName: string;
  authorRole: CustomUserRole;
  authorDepartment?: string;
  isPinned: boolean;
  isResolved?: boolean;
  upvotesCount: number;
  userUpvoted?: boolean;
  replies: ForumReply[];
  tags?: string[];
  viewsCount?: number;
  hasOfficialAnswer?: boolean;
  createdAt: string;
}

export type ForumSortOption = 'upvotes' | 'recent' | 'official' | 'unanswered';
export type ForumStatusFilter = 'all' | 'open' | 'solved' | 'verified';

export interface ForumCategoryMeta {
  id: ForumCategory;
  label: string;
  description: string;
  badgeClass: string;
  iconName: string;
}

export const FORUM_CATEGORIES: ForumCategoryMeta[] = [
  {
    id: 'Academics & Syllabus',
    label: 'Academics & Syllabus',
    description: 'MAKAUT curriculum, subject codes, semester exam questions, and study resources.',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    iconName: 'BookOpen',
  },
  {
    id: 'Coding & DSA',
    label: 'Coding & DSA',
    description: 'Data structures, algorithms, hackathon prep, LeetCode, and code debugging.',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    iconName: 'Code2',
  },
  {
    id: 'Labs & Viva',
    label: 'Labs & Viva',
    description: 'Hardware experiments, software lab assignments, viva voices, and project files.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconName: 'FlaskConical',
  },
  {
    id: 'Placements & Internships',
    label: 'Placements & Internships',
    description: 'T&P updates, campus interview experiences, off-campus drives, and resume reviews.',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconName: 'Briefcase',
  },
  {
    id: 'Engineering Campus',
    label: 'Engineering Campus',
    description: 'College shuttle routes, Central Library, B.Tech workshops, and campus facilities.',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    iconName: 'Building2',
  },
];