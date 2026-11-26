import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import {
  getCurrentAuthUser,
  MASTER_ADMIN_EMAIL,
  assertNotMasterAdminTarget,
  FacultyScope,
  RBACError,
} from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/admin/access-requests
 * Admin-only: Returns all users with approvalStatus === 'PENDING' awaiting Faculty or Admin approval.
 */
export async function GET() {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const requests = await prisma.user.findMany({
      where: { approvalStatus: 'PENDING' },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        clerkId: true,
        email: true,
        fullName: true,
        role: true,
        requestedRole: true,
        approvalStatus: true,
        employeeId: true,
        designation: true,
        department: true,
        requestedScopes: true,
        assignedScopes: true,
        onboardingNote: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (err: any) {
    console.error('[Admin Access Requests GET] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to load access requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/access-requests
 * Admin-only: Approve (with assignedScopes for Faculty) or Reject a pending Faculty/Admin request.
 * Only Master Admin may approve ADMIN requests.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId, action, assignedScopes } = body as {
      userId: string;
      action: 'APPROVE' | 'REJECT';
      assignedScopes?: FacultyScope[];
    };

    if (!userId || (action !== 'APPROVE' && action !== 'REJECT')) {
      return NextResponse.json(
        { error: 'userId and action ("APPROVE" | "REJECT") are required.' },
        { status: 400 }
      );
    }

    const target = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkId: userId }] },
    });
    if (!target) {
      return NextResponse.json({ error: 'User request not found.' }, { status: 404 });
    }

    assertNotMasterAdminTarget(target.email);

    const requestedUpper = (target.requestedRole || 'FACULTY').toUpperCase();
    const callerIsMasterAdmin =
      (caller.email || '').trim().toLowerCase() === MASTER_ADMIN_EMAIL;

    if (requestedUpper === 'ADMIN' && !callerIsMasterAdmin) {
      return NextResponse.json(
        { error: 'Only the Master Admin (mdimransps955@gmail.com) can approve or reject ADMIN requests.' },
        { status: 403 }
      );
    }

    const sanitizedScopes: FacultyScope[] = Array.isArray(assignedScopes)
      ? assignedScopes
          .filter(
            (s) =>
              s && typeof s.branch === 'string' && Array.isArray(s.semesters) && s.semesters.length > 0
          )
          .map((s) => ({
            branch: s.branch.toUpperCase().trim(),
            semesters: Array.from<number>(
              new Set(
                s.semesters
                  .map((n) => Number(n))
                  .filter((n) => Number.isInteger(n) && n >= 1 && n <= 8)
              )
            ).sort((a, b) => a - b),
            ...(Array.isArray(s.subjectCodes) && s.subjectCodes.length > 0
              ? {
                  subjectCodes: Array.from<string>(
                    new Set(
                      s.subjectCodes
                        .map((c) => String(c).toUpperCase().trim())
                        .filter(Boolean)
                    )
                  ),
                }
              : {}),
          }))
      : [];

    if (action === 'APPROVE' && requestedUpper === 'FACULTY' && sanitizedScopes.length === 0) {
      return NextResponse.json(
        { error: 'Please assign at least one Branch and Semester scope before approving Faculty.' },
        { status: 400 }
      );
    }

    const updatedUser =
      action === 'APPROVE'
        ? await prisma.user.update({
            where: { id: target.id },
            data: {
              role: requestedUpper,
              approvalStatus: 'APPROVED',
              requestedRole: null,
              onboardingCompleted: true,
              ...(requestedUpper === 'FACULTY'
                ? { assignedScopes: sanitizedScopes as any }
                : {}),
            },
          })
        : await prisma.user.update({
            where: { id: target.id },
            data: {
              role: 'STUDENT',
              approvalStatus: 'REJECTED',
              requestedRole: null,
              assignedScopes: [],
            },
          });

    try {
      const client = await clerkClient();
      const clerkTarget = await client.users.getUser(target.clerkId);
      const existingMeta = (clerkTarget.publicMetadata || {}) as Record<string, any>;
      await client.users.updateUserMetadata(target.clerkId, {
        publicMetadata: {
          ...existingMeta,
          role: updatedUser.role.toLowerCase(),
          isSuperAdmin: updatedUser.role === 'ADMIN',
          approvalStatus: updatedUser.approvalStatus,
          requestedRole: null,
          onboardingCompleted: true,
        },
      });
    } catch (clerkErr) {
      console.warn('[Access Requests POST] Clerk metadata sync note:', clerkErr);
    }

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      actorEmail: caller.email || undefined,
      actorRole: callerIsMasterAdmin ? 'MASTER_ADMIN' : 'ADMIN',
      action: action === 'APPROVE' ? 'ACCESS_REQUEST_APPROVED' : 'ACCESS_REQUEST_REJECTED',
      target: target.email,
      targetType: 'USER',
      targetLabel: target.fullName || target.email,
      details:
        action === 'APPROVE'
          ? `Approved ${requestedUpper} access for ${target.email}${
              sanitizedScopes.length > 0
                ? ` with scopes: ${sanitizedScopes
                    .map((s) => `${s.branch} (Sem ${s.semesters.join(',')})`)
                    .join('; ')}`
                : ''
            }`
          : `Rejected ${requestedUpper} request for ${target.email}`,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message:
        action === 'APPROVE'
          ? `${target.fullName || target.email} approved as ${requestedUpper}.`
          : `Request from ${target.fullName || target.email} rejected.`,
    });
  } catch (err: any) {
    if (err instanceof RBACError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('[Admin Access Requests POST] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process access request' },
      { status: 500 }
    );
  }
}
