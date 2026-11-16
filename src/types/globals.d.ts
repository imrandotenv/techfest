export {};

export type CustomUserRole = 'student' | 'college' | 'admin';

export interface UserPublicMetadata {
  role?: CustomUserRole;
  studentId?: string;
  department?: string;
  isSuperAdmin?: boolean;
}

declare global {
  interface CustomJwtSessionClaims {
    metadata?: UserPublicMetadata;
  }
}
