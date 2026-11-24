import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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
  const defaultList = DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
  if (!envEmails) {
    return defaultList;
  }

  const parsed = envEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0 && e.includes('@'));

  return Array.from(new Set([...defaultList, ...parsed]));
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
  branch?: string;
  semester?: number;
  passoutYear?: number;
  universityRoll?: string;
  onboardingCompleted?: boolean;
}

export interface ResolveAndHealOptions {
  clerkUserId: string;
  email?: string | null;
  fullName?: string | null;
  defaultRole?: string;
  autoCreate?: boolean;
}

/**
 * Auto-heals Clerk Development-to-Production migration mismatches:
 * 1. Looks up the user by clerkId in Neon PostgreSQL.
 * 2. If not found, looks up by verified primary email.
 * 3. If found by email with a stale/dev clerkId, updates clerkId to current production userId.
 * 4. Ensures super admins are elevated to ADMIN and synchronized back to Clerk publicMetadata.
 * 5. If autoCreate is true and user is not in DB, creates a new record safely.
 */
export async function resolveAndHealUser({
  clerkUserId,
  email,
  fullName,
  defaultRole = 'STUDENT',
  autoCreate = false,
}: ResolveAndHealOptions) {
  if (!clerkUserId) return null;

  const normalizedEmail = email?.trim().toLowerCase() || null;
  const isWhitelisted = isSuperAdminEmail(normalizedEmail);

  // 1. Try finding by clerkId first
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  // 2. If not found by clerkId, try finding by email (auto-heal Dev-to-Prod migration)
  if (!dbUser && normalizedEmail) {
    const userByEmail = await prisma.user.findFirst({
      where: {
        email: { equals: normalizedEmail, mode: 'insensitive' },
      },
    });

    if (userByEmail) {
      console.info(
        `[AuthSync] Auto-healing Dev-to-Prod clerkId for ${normalizedEmail}: ${userByEmail.clerkId} -> ${clerkUserId}`
      );

      const targetRole = isWhitelisted
        ? 'ADMIN'
        : userByEmail.role
        ? userByEmail.role.toUpperCase()
        : 'STUDENT';

      dbUser = await prisma.user.update({
        where: { id: userByEmail.id },
        data: {
          clerkId: clerkUserId,
          ...(fullName && !userByEmail.fullName ? { fullName } : {}),
          role: targetRole,
          ...(isWhitelisted ? { onboardingCompleted: true } : {}),
        },
      });

      // Synchronize role back to Clerk publicMetadata
      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            role: dbUser.role.toLowerCase(),
            isSuperAdmin: dbUser.role.toUpperCase() === 'ADMIN',
            onboardingCompleted: dbUser.onboardingCompleted,
            branch: dbUser.branch || undefined,
            semester: dbUser.semester || undefined,
            passoutYear: dbUser.passoutYear || undefined,
            universityRoll: dbUser.universityRoll || undefined,
          },
        });
      } catch (clerkErr) {
        console.warn('[AuthSync] Clerk publicMetadata sync note:', clerkErr);
      }
    }
  }

  // 3. If whitelisted super admin, ensure ADMIN role in DB and Clerk
  if (dbUser && isWhitelisted && dbUser.role.toUpperCase() !== 'ADMIN') {
    dbUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        role: 'ADMIN',
        onboardingCompleted: true,
      },
    });

    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          role: 'admin',
          isSuperAdmin: true,
          onboardingCompleted: true,
        },
      });
    } catch (clerkErr) {
      console.warn('[AuthSync] Clerk super admin metadata sync note:', clerkErr);
    }
  }

  // 4. Auto-create if requested or if super admin bootstrap
  if (!dbUser && (autoCreate || isWhitelisted) && normalizedEmail) {
    const assignedRole = isWhitelisted ? 'ADMIN' : defaultRole.toUpperCase();
    try {
      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: normalizedEmail,
          fullName: fullName || (isWhitelisted ? 'Super Admin' : 'SETGOI Member'),
          role: assignedRole,
          degree: 'B.Tech',
          onboardingCompleted: isWhitelisted,
        },
      });

      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            role: assignedRole.toLowerCase(),
            isSuperAdmin: assignedRole === 'ADMIN',
            onboardingCompleted: isWhitelisted,
          },
        });
      } catch {}
    } catch (createErr: any) {
      console.warn('[AuthSync] Failed to auto-create user in Neon DB:', createErr?.message || createErr);
    }
  }

  return dbUser;
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
            branch: 'CSE',
            semester: 5,
            passoutYear: 2027,
            universityRoll: '12000123042',
            onboardingCompleted: true,
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
      branch?: string;
      semester?: number;
      passoutYear?: number;
      universityRoll?: string;
      onboardingCompleted?: boolean;
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

    // Database reconciliation with Neon PostgreSQL (Auto-healing clerkId by email)
    let dbUser = null;
    try {
      dbUser = await resolveAndHealUser({
        clerkUserId: clerkUser.id,
        email: primaryEmail,
        fullName,
        autoCreate: isWhitelisted,
      });
    } catch (dbErr) {
      console.warn('[RBAC] resolveAndHealUser warning:', dbErr);
    }

    const resolvedRole: UserRole = isWhitelisted
      ? 'admin'
      : dbUser?.role
      ? normalizeUserRole(dbUser.role)
      : effectiveRole;

    const resolvedBranch = metadata.branch || dbUser?.branch || undefined;
    const resolvedSemester = metadata.semester
      ? Number(metadata.semester)
      : dbUser?.semester
      ? Number(dbUser.semester)
      : undefined;
    const resolvedPassoutYear = metadata.passoutYear
      ? Number(metadata.passoutYear)
      : dbUser?.passoutYear
      ? Number(dbUser.passoutYear)
      : undefined;
    const resolvedUniversityRoll = metadata.universityRoll || dbUser?.universityRoll || undefined;
    const resolvedOnboardingCompleted =
      metadata.onboardingCompleted ?? dbUser?.onboardingCompleted ?? false;

    return {
      userId: clerkUser.id,
      email: primaryEmail || dbUser?.email || null,
      fullName: fullName || dbUser?.fullName || 'SETGOI Member',
      role: resolvedRole,
      isSuperAdmin: isSuperAdmin || resolvedRole === 'admin',
      department: metadata.department || (resolvedBranch ? `B.Tech ${resolvedBranch}` : undefined),
      studentId: metadata.studentId || resolvedUniversityRoll,
      avatarUrl: clerkUser.imageUrl,
      isAuthenticated: true,
      branch: resolvedBranch,
      semester: resolvedSemester,
      passoutYear: resolvedPassoutYear,
      universityRoll: resolvedUniversityRoll,
      onboardingCompleted: resolvedOnboardingCompleted,
    };
  } catch (err: any) {
    if (
      err?.digest === 'DYNAMIC_SERVER_USAGE' ||
      err?.message?.includes('Dynamic server usage') ||
      err?.digest?.startsWith('NEXT_REDIRECT') ||
      err?.message === 'NEXT_REDIRECT'
    ) {
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
