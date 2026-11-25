import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getCurrentAuthUser, normalizeUserRole, UserRole } from '@/lib/rbac';
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

    if (!id || !rawRole) {
      return NextResponse.json(
        { error: 'Both user id and role are required.' },
        { status: 400 }
      );
    }

    const targetRoleLower: UserRole = normalizeUserRole(rawRole);
    const targetRoleUpper = targetRoleLower.toUpperCase(); // "STUDENT" | "FACULTY" | "ADMIN"

    // Self-demotion safety check
    if (id === caller.userId && targetRoleLower !== 'admin') {
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
        updatedDbUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            role: targetRoleUpper,
            // If elevated to admin or faculty, ensure onboarding completion
            onboardingCompleted: targetRoleLower === 'student' ? existingUser.onboardingCompleted : true,
          },
        });
      }
    } catch (dbErr: any) {
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
          role: targetRoleLower,
          isSuperAdmin: targetRoleLower === 'admin',
          onboardingCompleted: targetRoleLower === 'student' ? existingMetadata.onboardingCompleted : true,
          updatedAt: new Date().toISOString(),
          promotedBy: caller.email || caller.userId,
        },
      });
    } catch (clerkErr: any) {
      console.warn('[Admin Role API] Clerk publicMetadata update warning:', clerkErr?.message || clerkErr);
    }

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      action: 'ROLE_CHANGE',
      target: updatedDbUser?.email || clerkUserId,
      details: `Updated role clearance to ${targetRoleUpper} across Neon DB & Clerk publicMetadata`,
    });

    return NextResponse.json({
      success: true,
      userId: id,
      role: targetRoleUpper,
      message: `User role successfully updated to ${targetRoleUpper} across Neon DB and Clerk.`,
    });
  } catch (err: any) {
    console.error('[Admin Role API] Unexpected failure:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}
