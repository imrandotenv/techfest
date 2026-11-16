import { CustomUserRole, ForumCategory } from '@/types';

export type { CustomUserRole, ForumCategory };

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: CustomUserRole;
  authorDepartment?: string;
  isOfficialAnswer: boolean;
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
  upvotesCount: number;
  userUpvoted?: boolean;
  replies: ForumReply[];
  tags?: string[];
  viewsCount?: number;
  hasOfficialAnswer?: boolean;
  createdAt: string;
}

export type ForumSortOption = 'upvotes' | 'recent' | 'official' | 'unanswered';

export interface ForumCategoryMeta {
  id: ForumCategory;
  label: string;
  description: string;
  badgeClass: string;
  iconName: string;
}

export const FORUM_CATEGORIES: ForumCategoryMeta[] = [
  {
    id: 'Academic',
    label: 'Academic & Exams',
    description: 'MAKAUT syllabus, CA1/CA2 tests, PCC/ESC course codes, grading, and faculty guidance.',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    iconName: 'GraduationCap',
  },
  {
    id: 'TechFest',
    label: 'TechFest 2026',
    description: 'Annual Innovation Hackathon, robotics tracks, gaming tournaments, rules, and team building.',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    iconName: 'Zap',
  },
  {
    id: 'Campus Life',
    label: 'Campus Life & Clubs',
    description: 'Central library, canteen updates, cultural clubs, bus schedules, sports, and student activities.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconName: 'Building2',
  },
  {
    id: 'Placements',
    label: 'Placements & T&P',
    description: 'TCS NQT, Cognizant, Wipro drives, mock GDs, internship NOCs, and off-campus referrals.',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconName: 'Briefcase',
  },
  {
    id: 'Hostel',
    label: 'Hostel & Wardens',
    description: 'Boys/Girls hostel curfew hours, Wi-Fi speed, mess committee menu, and warden queries.',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    iconName: 'Home',
  },
];
