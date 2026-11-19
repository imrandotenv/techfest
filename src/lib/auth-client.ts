'use client';

import { CustomUserRole } from '@/types';

export type UserRoleType = 'student' | 'faculty' | 'admin';

export interface RoleConfig {
  key: CustomUserRole;
  displayLabel: string;
  badgeLabel: string;
  description: string;
  badgeClass: string;
}

export const ROLE_CONFIGS: Record<CustomUserRole, RoleConfig> = {
  student: {
    key: 'student',
    displayLabel: 'Student',
    badgeLabel: 'Student',
    description: 'Access verified MAKAUT lecture notes, solved PYQ downloads, and SGPA calculators.',
    badgeClass: 'bg-slate-100 text-[#0F172A] border-[#E2E8F0]',
  },
  college: {
    key: 'college',
    displayLabel: 'Faculty',
    badgeLabel: 'Faculty',
    description: 'Publish verified lecture notes, mark official forum solutions, and review student uploads.',
    badgeClass: 'bg-blue-50 text-[#2563EB] border-blue-200',
  },
  admin: {
    key: 'admin',
    displayLabel: 'Admin',
    badgeLabel: 'Super Admin',
    description: 'System health monitoring, user role promotion, and content moderation console.',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

/**
 * Normalizes any role string into our standard CustomUserRole
 */
export function normalizeRole(roleInput?: string | null): CustomUserRole {
  if (!roleInput) return 'student';
  const lower = roleInput.toLowerCase().trim();
  if (lower === 'admin') return 'admin';
  if (lower === 'faculty' || lower === 'college' || lower === 'teacher' || lower === 'professor') {
    return 'college';
  }
  return 'student';
}

/**
 * Resolves the effective role from a Clerk User object checking unsafeMetadata first, then publicMetadata
 */
export function getResolvedRole(user: any): CustomUserRole {
  if (!user) return 'student';
  const roleVal =
    user.unsafeMetadata?.role ||
    user.publicMetadata?.role ||
    (typeof window !== 'undefined' ? localStorage.getItem('sanakahub_preferred_role') : null);
  return normalizeRole(roleVal as string);
}

/**
 * Returns human-readable label for display in UI
 */
export function getDisplayRole(role: CustomUserRole | string): 'Student' | 'Faculty' | 'Admin' {
  const norm = normalizeRole(role);
  if (norm === 'admin') return 'Admin';
  if (norm === 'college') return 'Faculty';
  return 'Student';
}

/**
 * Updates Clerk unsafeMetadata.role on the active user object and persists to localStorage
 */
export async function setUserRole(user: any, targetRole: 'student' | 'faculty' | 'admin' | CustomUserRole): Promise<boolean> {
  const normalized = normalizeRole(targetRole);
  if (typeof window !== 'undefined') {
    localStorage.setItem('sanakahub_preferred_role', normalized);
  }

  if (!user) return true;

  try {
    if (typeof user.update === 'function') {
      await user.update({
        unsafeMetadata: {
          ...(user.unsafeMetadata || {}),
          role: normalized,
        },
      });
      return true;
    }
  } catch (err) {
    console.warn('[Clerk] Failed to update unsafeMetadata.role directly on user:', err);
  }
  return false;
}
