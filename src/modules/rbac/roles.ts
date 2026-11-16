import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { CustomUserRole } from '@/types';
import { prisma } from '@/lib/prisma';

export { type CustomUserRole };

export const DEFAULT_SUPER_ADMIN_EMAILS = [
  'mail@ceimran.in',
  'mdimransps955@gmail.com',
  'principal@setgoi.ac.in',
  'admin@setgoi.ac.in',
];

/**
 * Returns the sanitized list of super-admin email addresses configured in the environment.
 */
export function getSuperAdminEmails(): string[] {
  const envEmails = process.env.SUPER_ADMIN_EMAILS;
  if (!envEmails) {
    return DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
  }

  const parsed = envEmails
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0 && email.includes('@'));

  return parsed.length > 0 ? parsed : DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
}

/**
 * Checks whether an email matches the SUPER_ADMIN_EMAILS whitelist (case-insensitive).
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const whitelist = getSuperAdminEmails();
  return whitelist.includes(cleanEmail);
}

export interface UserRoleContext {
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

/**
 * Core RBAC bootstrap and identity resolution helper.
 * On first login:
 * - If user's email is in SUPER_ADMIN_EMAILS, assigns 'admin' role and isSuperAdmin: true.
 * - Otherwise, defaults to 'student' role.
 * Updates Clerk publicMetadata via Clerk Backend SDK and synchronizes local database profile.
 */
export async function getAuthUserContext(): Promise<UserRoleContext> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        userId: null,
        email: null,
        fullName: null,
        role: 'student',
        isSuperAdmin: false,
        isAuthenticated: false,
      };
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return {
        userId,
        email: null,
        fullName: null,
        role: 'student',
        isSuperAdmin: false,
        isAuthenticated: true,
      };
    }

    // Resolve primary email
    const primaryEmailObj = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );
    const primaryEmail =
      primaryEmailObj?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || null;
    const fullName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'Campus Member';

    const metadata = (clerkUser.publicMetadata || {}) as {
      role?: CustomUserRole;
      isSuperAdmin?: boolean;
      department?: string;
      studentId?: string;
    };

    const isWhitelisted = isSuperAdminEmail(primaryEmail);
    const currentRole = metadata.role;

    // Automatic First-Login Role Bootstrap & Super Admin Whitelist Promotion
    const needsBootstrap = !currentRole;
    const needsSuperAdminPromotion = isWhitelisted && (currentRole !== 'admin' || !metadata.isSuperAdmin);

    let effectiveRole: CustomUserRole = currentRole || 'student';
    let isSuperAdmin = Boolean(metadata.isSuperAdmin);

    if (needsBootstrap || needsSuperAdminPromotion) {
      effectiveRole = isWhitelisted ? 'admin' : (currentRole || 'student');
      isSuperAdmin = effectiveRole === 'admin';

      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkUser.id, {
          publicMetadata: {
            ...metadata,
            role: effectiveRole,
            isSuperAdmin,
            bootstrappedAt: new Date().toISOString(),
          },
        });
      } catch (clerkErr) {
        console.warn('[RBAC] Could not update Clerk publicMetadata:', clerkErr);
      }

      // Synchronize database profile if available
      try {
        if (primaryEmail) {
          await prisma.userProfile.upsert({
            where: { id: clerkUser.id },
            update: {
              email: primaryEmail,
              fullName,
              role: effectiveRole,
              avatarUrl: clerkUser.imageUrl,
            },
            create: {
              id: clerkUser.id,
              email: primaryEmail,
              fullName,
              role: effectiveRole,
              avatarUrl: clerkUser.imageUrl,
            },
          });
        }
      } catch (dbErr) {
        // Non-blocking fallback for local build / offline DB
      }
    }

    return {
      userId: clerkUser.id,
      email: primaryEmail,
      fullName,
      role: effectiveRole,
      isSuperAdmin: isSuperAdmin || isWhitelisted,
      department: metadata.department,
      studentId: metadata.studentId,
      avatarUrl: clerkUser.imageUrl,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('[RBAC] Error resolving user context:', error);
    return {
      userId: null,
      email: null,
      fullName: null,
      role: 'student',
      isSuperAdmin: false,
      isAuthenticated: false,
    };
  }
}

/**
 * Returns the current authenticated user's role ('student' | 'college' | 'admin').
 * Automatically triggers first-login role bootstrap if role metadata is absent.
 */
export async function getCurrentUserRole(): Promise<CustomUserRole> {
  const context = await getAuthUserContext();
  return context.role;
}

/**
 * Server-side guard to ensure the user has one of the allowed roles.
 * If unauthenticated, redirects to /sign-in.
 * If unauthorized, redirects to /unauthorized or throws error.
 * Admins satisfy all role checks.
 */
export async function requireRole(
  allowedRoles: CustomUserRole | CustomUserRole[],
  options?: { redirectTo?: string; throwError?: boolean }
): Promise<UserRoleContext> {
  const context = await getAuthUserContext();

  if (!context.isAuthenticated || !context.userId) {
    redirect('/sign-in');
  }

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Admin role satisfies all requirements
  const isAuthorized = context.role === 'admin' || allowed.includes(context.role);

  if (!isAuthorized) {
    if (options?.throwError) {
      throw new Error(
        `Forbidden: Access denied. Required role [${allowed.join(', ')}]. Current role: ${context.role}.`
      );
    }
    redirect(options?.redirectTo || '/unauthorized');
  }

  return context;
}

/**
 * Require 'admin' role for master administrative actions.
 */
export async function requireAdmin(options?: { redirectTo?: string; throwError?: boolean }) {
  return requireRole(['admin'], options);
}

/**
 * Require 'college' (faculty) or 'admin' role.
 */
export async function requireCollegeOrAdmin(options?: { redirectTo?: string; throwError?: boolean }) {
  return requireRole(['college', 'admin'], options);
}
