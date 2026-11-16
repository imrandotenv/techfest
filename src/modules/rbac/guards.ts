import { redirect } from 'next/navigation';
import { CustomUserRole, CurrentAuthUser } from './types';
import { ROLE_HIERARCHY } from './constants';
import { getCurrentAuthUser } from './server-utils';

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
 * Checks if a given role satisfies the required roles or role hierarchy.
 * Admins satisfy all role checks. College satisfies college and student.
 */
export function hasRole(
  currentRole: CustomUserRole,
  allowedRoles: CustomUserRole | CustomUserRole[]
): boolean {
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Admin always has access to all roles
  if (currentRole === 'admin') return true;

  // Direct match
  if (allowed.includes(currentRole)) return true;

  // Hierarchy check
  const currentRank = ROLE_HIERARCHY[currentRole] ?? 0;
  const lowestAllowedRank = Math.min(
    ...allowed.map((role) => ROLE_HIERARCHY[role] ?? 99)
  );

  return currentRank >= lowestAllowedRank;
}

/**
 * Requires an authenticated user session. Redirects to sign-in or throws error.
 */
export async function requireAuth(redirectTo?: string): Promise<CurrentAuthUser> {
  const user = await getCurrentAuthUser();
  if (!user.isAuthenticated || !user.userId) {
    if (redirectTo) {
      redirect(redirectTo);
    }
    throw new RBACError('Authentication required to access this resource.', 401, 'UNAUTHORIZED');
  }
  return user;
}

/**
 * Ensures the authenticated user has one of the allowed roles.
 * If not, redirects to /unauthorized or throws RBACError.
 */
export async function requireRole(
  allowedRoles: CustomUserRole | CustomUserRole[],
  options?: { redirectTo?: string; throwError?: boolean }
): Promise<CurrentAuthUser> {
  const user = await requireAuth(options?.redirectTo || '/sign-in');

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const isAuthorized = hasRole(user.role, allowed);

  if (!isAuthorized) {
    if (options?.throwError) {
      throw new RBACError(
        `Access denied. Required role: [${allowed.join(', ')}]. Current role: ${user.role}.`,
        403,
        'INSUFFICIENT_PERMISSIONS'
      );
    }
    redirect(options?.redirectTo || '/unauthorized');
  }

  return user;
}

/**
 * Specific guard for Super Admin institutional routes and mutations.
 */
export async function requireAdmin(options?: { redirectTo?: string; throwError?: boolean }): Promise<CurrentAuthUser> {
  return requireRole(['admin'], options);
}

/**
 * Guard for College Faculty or Institution Administrator routes and review mutations.
 */
export async function requireCollegeOrAdmin(options?: { redirectTo?: string; throwError?: boolean }): Promise<CurrentAuthUser> {
  return requireRole(['college', 'admin'], options);
}

/**
 * Safe mutation assertion wrapper that returns a boolean and user rather than throwing/redirecting.
 * Ideal for Server Actions and API route handlers.
 */
export async function assertRoleGuard(
  allowedRoles: CustomUserRole | CustomUserRole[]
): Promise<
  | { authorized: true; user: CurrentAuthUser; error?: never }
  | { authorized: false; user: CurrentAuthUser; error: string; statusCode: number }
> {
  try {
    const user = await getCurrentAuthUser();
    if (!user.isAuthenticated) {
      return {
        authorized: false,
        user,
        error: 'Authentication required. Please sign in to perform this action.',
        statusCode: 401,
      };
    }

    if (!hasRole(user.role, allowedRoles)) {
      const allowedList = Array.isArray(allowedRoles) ? allowedRoles.join(', ') : allowedRoles;
      return {
        authorized: false,
        user,
        error: `Unauthorized mutation. This action requires role clearance: [${allowedList}]. Current: ${user.role}.`,
        statusCode: 403,
      };
    }

    return {
      authorized: true,
      user,
    };
  } catch (err: any) {
    return {
      authorized: false,
      user: {
        userId: null,
        email: null,
        fullName: null,
        role: 'student',
        isSuperAdmin: false,
        isAuthenticated: false,
      },
      error: err?.message || 'Unexpected authorization failure during role verification.',
      statusCode: 500,
    };
  }
}
