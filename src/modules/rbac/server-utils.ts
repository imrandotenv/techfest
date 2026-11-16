import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { CustomUserRole, CurrentAuthUser } from './types';
import { isSuperAdminEmail } from './whitelist';
import { prisma } from '@/lib/prisma';

/**
 * Resolves current user details from Clerk session and checks if promotion to super-admin
 * is required via the SUPER_ADMIN_EMAILS whitelist.
 */
export async function getCurrentAuthUser(): Promise<CurrentAuthUser> {
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
    const primaryEmail = primaryEmailObj?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress || null;
    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'Campus Member';

    // Check whitelist
    const isWhitelisted = isSuperAdminEmail(primaryEmail);

    // Current metadata
    const metadata = (clerkUser.publicMetadata || {}) as {
      role?: CustomUserRole;
      isSuperAdmin?: boolean;
      department?: string;
      studentId?: string;
    };

    let effectiveRole: CustomUserRole = metadata.role || 'student';
    let isSuperAdmin = Boolean(metadata.isSuperAdmin);

    // Automatic Super-Admin Promotion Logic:
    // If user's email matches the SUPER_ADMIN_EMAILS whitelist and they don't have admin role yet,
    // upgrade their Clerk public metadata and database profile immediately!
    if (isWhitelisted && (effectiveRole !== 'admin' || !isSuperAdmin)) {
      effectiveRole = 'admin';
      isSuperAdmin = true;

      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkUser.id, {
          publicMetadata: {
            ...metadata,
            role: 'admin',
            isSuperAdmin: true,
            promotedAt: new Date().toISOString(),
          },
        });
      } catch (clerkErr) {
        console.warn('[RBAC] Could not update Clerk publicMetadata for super-admin:', clerkErr);
      }

      // Synchronize with database UserProfile if available
      try {
        if (primaryEmail) {
          await prisma.userProfile.upsert({
            where: { id: clerkUser.id },
            update: {
              email: primaryEmail,
              fullName,
              role: 'admin',
              avatarUrl: clerkUser.imageUrl,
            },
            create: {
              id: clerkUser.id,
              email: primaryEmail,
              fullName,
              role: 'admin',
              avatarUrl: clerkUser.imageUrl,
            },
          });
        }
      } catch (dbErr) {
        // Fallback silently if DB connection is unavailable during dev
        console.warn('[RBAC] Database synchronization skipped (DB offline or local build)');
      }
    }

    return {
      userId: clerkUser.id,
      email: primaryEmail,
      fullName,
      role: effectiveRole,
      isSuperAdmin: isWhitelisted || isSuperAdmin,
      department: metadata.department,
      studentId: metadata.studentId,
      avatarUrl: clerkUser.imageUrl,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('[RBAC] Error retrieving current authenticated user:', error);
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
 * Directly promotes a user by ID to the target role in Clerk and DB.
 */
export async function setTargetUserRole(
  targetUserId: string,
  newRole: CustomUserRole,
  isSuperAdmin = false
) {
  const client = await clerkClient();
  const user = await client.users.getUser(targetUserId);
  const currentMeta = (user.publicMetadata || {}) as Record<string, unknown>;

  await client.users.updateUserMetadata(targetUserId, {
    publicMetadata: {
      ...currentMeta,
      role: newRole,
      isSuperAdmin: newRole === 'admin' ? isSuperAdmin : false,
      updatedAt: new Date().toISOString(),
    },
  });

  // DB Sync
  try {
    const primaryEmail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0]?.emailAddress;
    if (primaryEmail) {
      await prisma.userProfile.upsert({
        where: { id: targetUserId },
        update: {
          role: newRole,
        },
        create: {
          id: targetUserId,
          email: primaryEmail,
          fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Campus Member',
          role: newRole,
          avatarUrl: user.imageUrl,
        },
      });
    }
  } catch (dbErr) {
    console.warn('[RBAC] Database update fallback:', dbErr);
  }

  return { success: true, targetUserId, newRole };
}
