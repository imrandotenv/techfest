import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type UserRole = 'admin' | 'faculty' | 'student';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  faculty: 2,
  student: 1,
};

export const DEFAULT_SUPER_ADMIN_EMAILS = [
  'mail@ceimran.in',
  'mdimransps955@gmail.com',
  'principal@setgoi.ac.in',
  'admin@setgoi.ac.in',
];

export class RBACError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 403, code = 'FORBIDDEN') {
    super(message);
    this.name = 'RBACError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Normalizes any role input (including legacy 'college' or case variants) to standard UserRole.
 */
export function normalizeUserRole(roleInput?: string | null): UserRole {
  if (!roleInput) return 'student';
  const clean = roleInput.trim().toLowerCase();
  if (clean === 'admin' || clean === 'super_admin' || clean === 'superadmin') return 'admin';
  if (clean === 'faculty' || clean === 'college' || clean === 'professor' || clean === 'teacher') return 'faculty';
  return 'student';
}

/**
 * Parses and returns list of super-admin emails from process.env.SUPER_ADMIN_EMAILS
 */
export function getSuperAdminEmails(): string[] {
  const envEmails = process.env.SUPER_ADMIN_EMAILS;
  if (!envEmails) {
    return DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
  }

  const parsed = envEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0 && e.includes('@'));

  return parsed.length > 0 ? parsed : DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
}

/**
 * Checks if an email is in the super admin whitelist
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  const whitelist = getSuperAdminEmails();
  return whitelist.includes(clean);
}

/**
 * Checks if current role satisfies allowed roles, with admin satisfying all.
 */
export function hasRole(currentRole: UserRole, allowedRoles: UserRole | UserRole[]): boolean {
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (currentRole === 'admin') return true;
  if (allowed.includes(currentRole)) return true;

  const currentRank = ROLE_HIERARCHY[currentRole] ?? 1;
  const lowestRequiredRank = Math.min(...allowed.map((r) => ROLE_HIERARCHY[r] ?? 1));
  return currentRank >= lowestRequiredRank;
}

export interface AuthUserContext {
  userId: string | null;
  email: string | null;
  fullName: string | null;
  role: UserRole;
  isSuperAdmin: boolean;
  department?: string;
  studentId?: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

/**
 * Retrieves the full authenticated user context on the server.
 * Automatically checks and elevates SUPER_ADMIN_EMAILS to 'admin'.
 */
export async function getCurrentAuthUser(): Promise<AuthUserContext> {
  try {
    const { userId } = await auth();
    if (!userId) {
      // Check for development/QA preview cookie
      try {
        const cookieStore = await cookies();
        const previewRole = (cookieStore.get('settech_preview_role')?.value || cookieStore.get('sanakahub_preview_role')?.value) as UserRole | undefined;
        if (previewRole && (previewRole === 'admin' || previewRole === 'faculty' || previewRole === 'student')) {
          return {
            userId: `qa_${previewRole}_01`,
            email: previewRole === 'admin' ? 'mail@ceimran.in' : previewRole === 'faculty' ? 'hod.cse@setgoi.ac.in' : 'arjun.chatterjee@setgoi.ac.in',
            fullName: previewRole === 'admin' ? 'Super Admin Imran' : previewRole === 'faculty' ? 'Prof. Subhash Mukherjee (HOD)' : 'Arjun Chatterjee (CSE CR)',
            role: previewRole,
            isSuperAdmin: previewRole === 'admin',
            department: previewRole === 'admin' ? 'Super Admin Office' : previewRole === 'faculty' ? 'CSE Department' : 'B.Tech CSE Sem 5',
            studentId: 'SETGOI/2026/CSE/042',
            isAuthenticated: true,
          };
        }
      } catch {}

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

    const primaryEmailObj = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );
    const primaryEmail =
      primaryEmailObj?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || null;
    const fullName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'Campus Member';

    const metadata = (clerkUser.publicMetadata || {}) as {
      role?: string;
      isSuperAdmin?: boolean;
      department?: string;
      studentId?: string;
    };

    const isWhitelisted = isSuperAdminEmail(primaryEmail);
    const rawRole = metadata.role;
    let effectiveRole: UserRole = normalizeUserRole(rawRole);
    let isSuperAdmin = Boolean(metadata.isSuperAdmin) || isWhitelisted;

    // Automatic elevation for super admins or initial bootstrap
    const needsBootstrap = !rawRole;
    const needsElevation = isWhitelisted && effectiveRole !== 'admin';

    if (needsBootstrap || needsElevation) {
      effectiveRole = isWhitelisted ? 'admin' : (effectiveRole || 'student');
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
      } catch (err) {
        console.warn('[RBAC] Failed to bootstrap Clerk publicMetadata:', err);
      }
    }

    return {
      userId: clerkUser.id,
      email: primaryEmail,
      fullName,
      role: effectiveRole,
      isSuperAdmin,
      department: metadata.department,
      studentId: metadata.studentId,
      avatarUrl: clerkUser.imageUrl,
      isAuthenticated: true,
    };
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage')) {
      throw err;
    }
    console.error('[RBAC] Error resolving user context:', err);
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
 * Returns just the current role string ('admin' | 'faculty' | 'student' | null)
 */
export async function getCurrentRole(): Promise<UserRole | null> {
  const user = await getCurrentAuthUser();
  if (!user.isAuthenticated) return null;
  return user.role;
}

/**
 * Requires an authenticated user session. Redirects to sign-in or throws error.
 */
export async function requireAuth(redirectTo = '/sign-in'): Promise<AuthUserContext> {
  const user = await getCurrentAuthUser();
  if (!user.isAuthenticated || !user.userId) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Requires one of the specified roles. Redirects to /unauthorized or throws error if unauthorized.
 */
export async function requireRole(
  allowedRoles: UserRole[],
  options?: { redirectTo?: string; throwError?: boolean }
): Promise<AuthUserContext> {
  const user = await requireAuth(options?.redirectTo || '/sign-in');

  const isAllowed = hasRole(user.role, allowedRoles);
  if (!isAllowed) {
    if (options?.throwError) {
      throw new RBACError(
        `Access denied. Required roles: [${allowedRoles.join(', ')}]. Current role: ${user.role}.`,
        403,
        'INSUFFICIENT_PERMISSIONS'
      );
    }
    redirect(options?.redirectTo || '/unauthorized');
  }

  return user;
}
