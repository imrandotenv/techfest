import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import {
  getCurrentAuthUser,
  normalizeUserRole,
  UserRole,
  assertNotMasterAdminTarget,
  MASTER_ADMIN_EMAIL,
  FacultyScope,
  RBACError,
} from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * PATCH /api/admin/users/[id]/role
 * Admin-only: Updates a user's role across both Neon PostgreSQL (prisma.user)
 * and Clerk (publicMetadata.role).
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin clearance required.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const rawRole = body.role || body.newRole;
    const rawDepartment = body.department;
    const rawAssignedScopes = body.assignedScopes;

    if (!id || (!rawRole && !rawDepartment && rawAssignedScopes === undefined)) {
      return NextResponse.json(
        { error: 'User id and role, department, or assignedScopes are required.' },
        { status: 400 }
      );
    }

    const callerIsMasterAdmin =
      (caller.email || '').trim().toLowerCase() === MASTER_ADMIN_EMAIL;

    const targetRoleLower: UserRole | null = rawRole ? normalizeUserRole(rawRole) : null;
    const targetRoleUpper = targetRoleLower ? targetRoleLower.toUpperCase() : null;
    const cleanDept =
      typeof rawDepartment === 'string' && rawDepartment.trim()
        ? rawDepartment.toUpperCase().trim()
        : undefined;

    const sanitizedScopes: FacultyScope[] | undefined = Array.isArray(rawAssignedScopes)
      ? rawAssignedScopes
          .filter(
            (s: any) =>
              s && typeof s.branch === 'string' && Array.isArray(s.semesters) && s.semesters.length > 0
          )
          .map((s: any) => ({
            branch: String(s.branch).toUpperCase().trim(),
            semesters: Array.from<number>(
              new Set(
                s.semesters
                  .map((n: any) => Number(n))
                  .filter((n: number) => Number.isInteger(n) && n >= 1 && n <= 8)
              )
            ).sort((a, b) => a - b),
            ...(Array.isArray(s.subjectCodes) && s.subjectCodes.length > 0
              ? {
                  subjectCodes: Array.from<string>(
                    new Set(
                      s.subjectCodes
                        .map((c: any) => String(c).toUpperCase().trim())
                        .filter(Boolean)
                    )
                  ),
                }
              : {}),
          }))
      : undefined;

    // Self-demotion safety check
    if (id === caller.userId && targetRoleLower && targetRoleLower !== 'admin') {
      return NextResponse.json(
        { error: 'Self-demotion prevented: You cannot revoke admin clearance from your own account.' },
        { status: 400 }
      );
    }

    // 1. Update Neon PostgreSQL (prisma.user)
    let updatedDbUser = null;
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ id }, { clerkId: id }],
        },
      });

      if (existingUser) {
        assertNotMasterAdminTarget(existingUser.email);

        // Only Master Admin may promote to ADMIN or demote an existing ADMIN
        const involvesAdminRole =
          targetRoleUpper === 'ADMIN' ||
          (existingUser.role.toUpperCase() === 'ADMIN' && targetRoleUpper && targetRoleUpper !== 'ADMIN');
        if (involvesAdminRole && !callerIsMasterAdmin) {
          return NextResponse.json(
            { error: 'Only the Master Admin can promote or demote ADMIN accounts.' },
            { status: 403 }
          );
        }

        updatedDbUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            ...(targetRoleUpper ? { role: targetRoleUpper, approvalStatus: 'APPROVED', requestedRole: null } : {}),
            ...(cleanDept ? { department: cleanDept, branch: existingUser.branch || cleanDept } : {}),
            ...(sanitizedScopes !== undefined ? { assignedScopes: sanitizedScopes as any } : {}),
            ...(targetRoleLower
              ? {
                  onboardingCompleted:
                    targetRoleLower === 'student' ? existingUser.onboardingCompleted : true,
                }
              : {}),
          },
        });
      }
    } catch (dbErr: any) {
      if (dbErr instanceof RBACError) {
        return NextResponse.json({ error: dbErr.message }, { status: dbErr.statusCode });
      }
      console.warn('[Admin Role API] Neon DB update warning:', dbErr?.message || dbErr);
    }

    // 2. Update Clerk publicMetadata
    let clerkUserId = id;
    if (updatedDbUser?.clerkId) {
      clerkUserId = updatedDbUser.clerkId;
    }

    try {
      const client = await clerkClient();
      const targetClerkUser = await client.users.getUser(clerkUserId);
      const existingMetadata = (targetClerkUser.publicMetadata || {}) as Record<string, any>;

      await client.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          ...existingMetadata,
          ...(targetRoleLower
            ? {
                role: targetRoleLower,
                isSuperAdmin: targetRoleLower === 'admin',
                onboardingCompleted:
                  targetRoleLower === 'student' ? existingMetadata.onboardingCompleted : true,
              }
            : {}),
          ...(cleanDept ? { department: cleanDept } : {}),
          updatedAt: new Date().toISOString(),
          promotedBy: caller.email || caller.userId,
        },
      });
    } catch (clerkErr: any) {
      console.warn('[Admin Role API] Clerk publicMetadata update warning:', clerkErr?.message || clerkErr);
    }

    const effectiveRoleLabel = targetRoleUpper || updatedDbUser?.role || 'UNCHANGED';
    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      actorEmail: caller.email || undefined,
      actorRole: 'ADMIN',
      action: 'ROLE_CHANGE',
      target: updatedDbUser?.email || clerkUserId,
      targetType: 'USER',
      targetLabel: updatedDbUser?.fullName || updatedDbUser?.email || clerkUserId,
      details: `Updated user to role=${effectiveRoleLabel}${cleanDept ? `, department=${cleanDept}` : ''} across Neon DB & Clerk`,
    });

    return NextResponse.json({
      success: true,
      userId: id,
      role: effectiveRoleLabel,
      department: cleanDept || updatedDbUser?.department || null,
      message: `User governance updated (${effectiveRoleLabel}${cleanDept ? ` • ${cleanDept}` : ''}).`,
    });
  } catch (err: any) {
    console.error('[Admin Role API] Unexpected failure:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}
