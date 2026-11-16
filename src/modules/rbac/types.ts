export type CustomUserRole = 'student' | 'college' | 'admin';

export interface UserPublicMetadata {
  role?: CustomUserRole;
  studentId?: string;
  department?: string;
  isSuperAdmin?: boolean;
  promotedAt?: string;
}

export type RBACPermission =
  | 'notes:read'
  | 'notes:upload'
  | 'notes:verify'
  | 'notes:delete'
  | 'forum:read'
  | 'forum:post'
  | 'forum:reply'
  | 'forum:official_answer'
  | 'forum:pin'
  | 'campus:read'
  | 'campus:manage'
  | 'admin:users'
  | 'admin:telemetry'
  | 'admin:whitelist';

export interface CurrentAuthUser {
  userId: string | null;
  email: string | null;
  fullName: string | null;
  role: CustomUserRole;
  isSuperAdmin: boolean;
  department?: string;
  studentId?: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

export interface UserRoleRecord {
  id: string;
  email: string;
  fullName: string;
  role: CustomUserRole;
  isSuperAdmin: boolean;
  studentId?: string;
  department?: string;
  createdAt: string;
  lastActive?: string;
}

export interface RolePromotionResult {
  success: boolean;
  userId: string;
  previousRole?: CustomUserRole;
  newRole: CustomUserRole;
  isSuperAdmin: boolean;
  message: string;
}
