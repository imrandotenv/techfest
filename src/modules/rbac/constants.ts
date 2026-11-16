import { CustomUserRole, RBACPermission } from './types';

export const DEFAULT_SUPER_ADMIN_EMAILS: string[] = [
  'mdimransps955@gmail.com',
  'principal@setgoi.ac.in',
  'admin@setgoi.ac.in',
];

export const ROLE_HIERARCHY: Record<CustomUserRole, number> = {
  admin: 3,
  college: 2,
  student: 1,
};

export const ROLE_PERMISSIONS: Record<CustomUserRole, RBACPermission[]> = {
  admin: [
    'notes:read',
    'notes:upload',
    'notes:verify',
    'notes:delete',
    'forum:read',
    'forum:post',
    'forum:reply',
    'forum:official_answer',
    'forum:pin',
    'campus:read',
    'campus:manage',
    'admin:users',
    'admin:telemetry',
    'admin:whitelist',
  ],
  college: [
    'notes:read',
    'notes:upload',
    'notes:verify',
    'forum:read',
    'forum:post',
    'forum:reply',
    'forum:official_answer',
    'campus:read',
  ],
  student: [
    'notes:read',
    'notes:upload',
    'forum:read',
    'forum:post',
    'forum:reply',
    'campus:read',
  ],
};

export const ROLE_CONFIG: Record<
  CustomUserRole,
  {
    label: string;
    description: string;
    badgeClass: string;
    icon: string;
  }
> = {
  admin: {
    label: 'Super Admin',
    description: 'Institution Director / Principal with full portal administrative authority',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: 'ShieldCheck',
  },
  college: {
    label: 'College Faculty',
    description: 'SETGOI Faculty / HOD with syllabus review & verification privileges',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: 'GraduationCap',
  },
  student: {
    label: 'Student',
    description: 'Enrolled SETGOI scholar with access to notes, PYQs, calculators & discussions',
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    icon: 'User',
  },
};
