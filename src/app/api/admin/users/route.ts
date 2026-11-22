import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getCurrentAuthUser, normalizeUserRole, UserRole } from '@/lib/rbac';

export const runtime = 'nodejs';

/**
 * GET /api/admin/users
 * Strictly admin-only: Returns searchable list of users with current role & metadata.
 */
export async function GET() {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin clearance required.' },
        { status: 403 }
      );
    }

    const client = await clerkClient();
    const userListRes = await client.users.getUserList({ limit: 100 });

    const users = (userListRes.data || []).map((u) => {
      const primaryEmail =
        u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ||
        u.emailAddresses[0]?.emailAddress ||
        '';

      const metadata = (u.publicMetadata || {}) as { role?: string; department?: string; studentId?: string };
      const role = normalizeUserRole(metadata.role);

      return {
        id: u.id,
        fullName: [u.firstName, u.lastName].filter(Boolean).join(' ') || 'SETGOI Member',
        email: primaryEmail,
        role,
        department: metadata.department || 'B.Tech Core',
        studentId: metadata.studentId || '',
        imageUrl: u.imageUrl,
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ users, total: users.length });
  } catch (err: any) {
    console.error('[Admin Users API] GET Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch user list' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Strictly admin-only: Updates a user's role in Clerk publicMetadata.
 * Safety rule: Prevents an admin from accidentally demoting themselves.
 */
export async function PATCH(req: Request) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin clearance required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, role } = body as { userId: string; role: string };

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Both userId and role are required.' },
        { status: 400 }
      );
    }

    const targetRole: UserRole = normalizeUserRole(role);

    // Self-demotion prevention
    if (userId === caller.userId && targetRole !== 'admin') {
      return NextResponse.json(
        { error: 'Self-demotion prevented: You cannot revoke admin clearance from your own account.' },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const targetUser = await client.users.getUser(userId);

    const existingMetadata = (targetUser.publicMetadata || {}) as Record<string, any>;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...existingMetadata,
        role: targetRole,
        updatedAt: new Date().toISOString(),
        promotedBy: caller.email || caller.userId,
      },
    });

    return NextResponse.json({
      success: true,
      userId,
      role: targetRole,
      message: `User role successfully updated to ${targetRole}.`,
    });
  } catch (err: any) {
    console.error('[Admin Users API] PATCH Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}
