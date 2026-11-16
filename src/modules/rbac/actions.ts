'use server';

import { revalidatePath } from 'next/cache';
import { clerkClient } from '@clerk/nextjs/server';
import { CustomUserRole, RolePromotionResult, UserRoleRecord } from './types';
import { NoteItem, NoteCategory } from '@/types';
import { assertRoleGuard, requireAdmin, requireCollegeOrAdmin } from './guards';
import { isSuperAdminEmail, getSuperAdminEmails } from './whitelist';
import { prisma } from '@/lib/prisma';
import { INITIAL_NOTES, INITIAL_FORUM_POSTS } from '@/lib/seed-data';

// Persistent in-memory cache for development resilience
const devNotesStore = [...INITIAL_NOTES];
const devRepliesStore: Record<string, boolean> = {
  'reply-01': true,
  'reply-04': true,
};

/**
 * Super-admin mutation: promote, demote or assign user roles.
 * Protected by requireAdmin role guard.
 */
export async function updateUserRoleAction(params: {
  targetUserId: string;
  newRole: CustomUserRole;
}): Promise<RolePromotionResult> {
  const guard = await assertRoleGuard(['admin']);
  if (!guard.authorized) {
    return {
      success: false,
      userId: params.targetUserId,
      newRole: params.newRole,
      isSuperAdmin: false,
      message: guard.error,
    };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(params.targetUserId);
    const primaryEmail =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses[0]?.emailAddress;

    const isWhitelistMatch = isSuperAdminEmail(primaryEmail);
    const isSuperAdmin = params.newRole === 'admin' ? isWhitelistMatch || true : false;

    await client.users.updateUserMetadata(params.targetUserId, {
      publicMetadata: {
        ...(user.publicMetadata || {}),
        role: params.newRole,
        isSuperAdmin,
        updatedAt: new Date().toISOString(),
      },
    });

    try {
      if (primaryEmail) {
        await prisma.userProfile.upsert({
          where: { id: params.targetUserId },
          update: { role: params.newRole },
          create: {
            id: params.targetUserId,
            email: primaryEmail,
            fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Campus Member',
            role: params.newRole,
          },
        });
      }
    } catch {
      // Non-blocking fallback
    }

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/college');

    return {
      success: true,
      userId: params.targetUserId,
      newRole: params.newRole,
      isSuperAdmin,
      message: `User role successfully assigned to '${params.newRole}' by Super Admin.`,
    };
  } catch (error: any) {
    console.error('[RBAC Action] Error updating role:', error);
    return {
      success: false,
      userId: params.targetUserId,
      newRole: params.newRole,
      isSuperAdmin: false,
      message: error?.message || 'Failed to update user role in Clerk directory.',
    };
  }
}

/**
 * Server action to synchronize and upgrade the current session role
 * based on the SUPER_ADMIN_EMAILS whitelist.
 */
export async function syncCurrentUserRoleAction() {
  const guard = await assertRoleGuard(['student', 'college', 'admin']);
  if (!guard.authorized || !guard.user.userId || !guard.user.email) {
    return {
      success: false,
      role: 'student' as CustomUserRole,
      isSuperAdmin: false,
      message: 'No active session found to synchronize.',
    };
  }

  const isWhitelisted = isSuperAdminEmail(guard.user.email);
  if (isWhitelisted && guard.user.role !== 'admin') {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(guard.user.userId, {
        publicMetadata: {
          role: 'admin',
          isSuperAdmin: true,
          promotedAt: new Date().toISOString(),
        },
      });

      revalidatePath('/dashboard/admin');
      revalidatePath('/dashboard/college');

      return {
        success: true,
        role: 'admin' as CustomUserRole,
        isSuperAdmin: true,
        message: 'Your email is whitelisted as SETGOI Super Admin! Role promoted successfully.',
      };
    } catch (err: any) {
      return {
        success: false,
        role: guard.user.role,
        isSuperAdmin: guard.user.isSuperAdmin,
        message: err?.message || 'Could not upgrade Clerk metadata.',
      };
    }
  }

  return {
    success: true,
    role: guard.user.role,
    isSuperAdmin: guard.user.isSuperAdmin,
    message: isWhitelisted
      ? 'Already operating with full Super Admin clearance.'
      : 'Session verified. Standard student/college clearance active.',
  };
}

/**
 * College/Admin mutation: approve or reject note uploads.
 * Guarded by requireCollegeOrAdmin.
 */
export async function verifyNoteAction(params: {
  noteId: string;
  status: 'approved' | 'rejected';
}) {
  const guard = await assertRoleGuard(['college', 'admin']);
  if (!guard.authorized) {
    return {
      success: false,
      error: guard.error,
    };
  }

  const verifier = guard.user;
  const verifiedAt = new Date().toISOString();

  // Try DB first
  try {
    await prisma.noteItem.update({
      where: { id: params.noteId },
      data: {
        status: params.status,
        verifiedById: verifier.userId || 'faculty-verifier',
        verifiedAt: new Date(),
      },
    });
  } catch {
    // In-memory fallback
    const note = devNotesStore.find((n) => n.id === params.noteId);
    if (note) {
      note.status = params.status;
      note.verifiedById = verifier.userId || 'faculty-verifier';
      note.verifiedByName = verifier.fullName || 'Faculty Verifier';
      note.verifiedAt = verifiedAt;
    }
  }

  revalidatePath('/dashboard/college');
  revalidatePath('/notes');

  return {
    success: true,
    noteId: params.noteId,
    status: params.status,
    verifiedByName: verifier.fullName || 'Faculty Verifier',
    verifiedAt,
  };
}

/**
 * College/Admin mutation: mark or toggle an official faculty answer badge on forum replies.
 * Guarded by requireCollegeOrAdmin.
 */
export async function toggleOfficialAnswerAction(params: {
  replyId: string;
  isOfficial: boolean;
}) {
  const guard = await assertRoleGuard(['college', 'admin']);
  if (!guard.authorized) {
    return {
      success: false,
      error: guard.error,
    };
  }

  try {
    await prisma.forumReply.update({
      where: { id: params.replyId },
      data: {
        isOfficialAnswer: params.isOfficial,
      },
    });
  } catch {
    devRepliesStore[params.replyId] = params.isOfficial;
  }

  revalidatePath('/dashboard/college');
  revalidatePath('/forum');

  return {
    success: true,
    replyId: params.replyId,
    isOfficial: params.isOfficial,
  };
}

/**
 * Helper to get currently reviewable notes (pending first, plus approved).
 */
export async function getReviewableNotes() {
  try {
    const dbNotes = await prisma.noteItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: true,
        verifiedBy: true,
      },
    });
    if (dbNotes.length > 0) {
      return dbNotes.map((n) => ({
        id: n.id,
        title: n.title,
        subjectCode: n.subjectCode,
        subjectName: n.subjectName,
        departmentCode: n.department,
        semester: n.semester,
        category: n.category,
        academicYear: n.academicYear,
        fileUrl: n.fileUrl,
        fileSize: n.fileSize,
        downloadsCount: n.downloadsCount,
        status: n.status as 'pending' | 'approved' | 'rejected',
        uploaderId: n.uploaderId,
        uploaderName: n.uploader?.fullName || 'Student',
        uploaderRole: (n.uploader?.role || 'student') as CustomUserRole,
        verifiedById: n.verifiedById || undefined,
        verifiedByName: n.verifiedBy?.fullName || undefined,
        verifiedAt: n.verifiedAt?.toISOString(),
        createdAt: n.createdAt.toISOString(),
      }));
    }
  } catch {
    // Fallback to dev store
  }

  return devNotesStore;
}

/**
 * Retrieves institutional users for RBAC management.
 */
export async function getAdminDirectoryUsers(): Promise<UserRoleRecord[]> {
  const seedUsers: UserRoleRecord[] = [
    {
      id: 'usr-admin-01',
      email: 'mdimransps955@gmail.com',
      fullName: 'Imran Ahmad (Super Admin)',
      role: 'admin',
      isSuperAdmin: true,
      studentId: 'DIR-2026-001',
      department: 'SETGOI Directorate',
      createdAt: '2026-01-10T08:00:00Z',
      lastActive: 'Just now',
    },
    {
      id: 'usr-admin-02',
      email: 'principal@setgoi.ac.in',
      fullName: 'Prof. (Dr.) Sanaka Principal',
      role: 'admin',
      isSuperAdmin: true,
      studentId: 'PRIN-2026',
      department: 'Principal Office',
      createdAt: '2026-01-05T09:00:00Z',
      lastActive: 'Today at 10:15 AM',
    },
    {
      id: 'usr-faculty-01',
      email: 'sourav.sengupta@setgoi.ac.in',
      fullName: 'Dr. Sourav Sengupta',
      role: 'college',
      isSuperAdmin: false,
      studentId: 'FAC-CSE-01',
      department: 'CSE',
      createdAt: '2026-02-01T10:00:00Z',
      lastActive: 'Today at 02:40 PM',
    },
    {
      id: 'usr-faculty-02',
      email: 'debabrata.roy@setgoi.ac.in',
      fullName: 'Dr. Debabrata Roy',
      role: 'college',
      isSuperAdmin: false,
      studentId: 'FAC-ECE-02',
      department: 'ECE',
      createdAt: '2026-02-01T10:00:00Z',
      lastActive: 'Yesterday',
    },
    {
      id: 'usr-faculty-03',
      email: 'subhashish.ghosh@setgoi.ac.in',
      fullName: 'Dr. Subhashish Ghosh',
      role: 'college',
      isSuperAdmin: false,
      studentId: 'FAC-ME-03',
      department: 'ME',
      createdAt: '2026-02-03T11:00:00Z',
      lastActive: '3 days ago',
    },
    {
      id: 'usr-student-01',
      email: 'aniket.mukherjee@student.setgoi.ac.in',
      fullName: 'Aniket Mukherjee',
      role: 'student',
      isSuperAdmin: false,
      studentId: 'SH2026042',
      department: 'CSE',
      createdAt: '2026-08-01T11:00:00Z',
      lastActive: 'Today at 01:20 PM',
    },
    {
      id: 'usr-student-02',
      email: 'rohan.sharma@student.setgoi.ac.in',
      fullName: 'Rohan Sharma',
      role: 'student',
      isSuperAdmin: false,
      studentId: 'SH2026089',
      department: 'CSE',
      createdAt: '2026-08-02T12:00:00Z',
      lastActive: '10 mins ago',
    },
    {
      id: 'usr-student-03',
      email: 'priya.sen@student.setgoi.ac.in',
      fullName: 'Priya Sen',
      role: 'student',
      isSuperAdmin: false,
      studentId: 'SH2026115',
      department: 'ECE',
      createdAt: '2026-08-10T14:30:00Z',
      lastActive: 'Yesterday',
    },
  ];

  try {
    const dbUsers = await prisma.userProfile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    if (dbUsers.length > 0) {
      const mappedDbUsers: UserRoleRecord[] = dbUsers.map((u) => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role as CustomUserRole,
        isSuperAdmin: isSuperAdminEmail(u.email),
        studentId: u.studentId || undefined,
        department: u.department || undefined,
        createdAt: u.createdAt.toISOString(),
        lastActive: 'Online',
      }));

      const existingEmails = new Set(mappedDbUsers.map((u) => u.email.toLowerCase()));
      const unmergedSeeds = seedUsers.filter((s) => !existingEmails.has(s.email.toLowerCase()));
      return [...mappedDbUsers, ...unmergedSeeds];
    }
  } catch {
    // Non-blocking fallback
  }

  return seedUsers;
}

export interface CampusNotice {
  id: string;
  title: string;
  content: string;
  department: string;
  category: 'Examination' | 'Academic' | 'Hostel' | 'Transit' | 'Administration';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  postedById: string;
  postedByName: string;
  postedByRole: CustomUserRole;
  createdAt: string;
}

const devNoticesStore: CampusNotice[] = [
  {
    id: 'notice-01',
    title: 'MAKAUT Odd Semester 2026-27 Examination Form Fill-up',
    content: 'All B.Tech students (Semesters 3, 5, 7) must complete MAKAUT odd semester examination forms and fee clearance by Nov 20, 2026.',
    department: 'All Departments',
    category: 'Examination',
    priority: 'urgent',
    postedById: 'usr-admin-01',
    postedByName: 'SETGOI Examination Cell',
    postedByRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'notice-02',
    title: 'Department of CSE: PCC-CS301 Mid-Term Syllabus & Lab Schedule',
    content: 'Data Structures & Algorithms lab viva and component evaluation will commence on Monday in Lab 304. Verified lecture slides uploaded to Vault.',
    department: 'CSE',
    category: 'Academic',
    priority: 'high',
    postedById: 'usr-faculty-01',
    postedByName: 'Dr. Sourav Sengupta',
    postedByRole: 'college',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'notice-03',
    title: 'Campus Evening Transit Route Adjustment (Bus Route #3 & #5)',
    content: 'Evening departure from SETGOI Main Gate to Durgapur Railway Station is adjusted to 4:45 PM to facilitate post-lab departures.',
    department: 'Transport',
    category: 'Transit',
    priority: 'medium',
    postedById: 'usr-admin-02',
    postedByName: 'Campus Transport Desk',
    postedByRole: 'admin',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

/**
 * College/Admin mutation: Upload a note directly with pre-approved/verified status.
 * Guarded by requireCollegeOrAdmin.
 */
export async function uploadVerifiedNoteAction(params: {
  title: string;
  subjectCode: string;
  subjectName: string;
  departmentCode: string;
  semester: number;
  category: NoteCategory;
  academicYear: string;
  fileUrl?: string;
  fileSize?: number;
}) {
  const guard = await assertRoleGuard(['college', 'admin']);
  if (!guard.authorized) {
    return {
      success: false,
      error: guard.error,
    };
  }

  const verifier = guard.user;
  const newId = `note-v-${Date.now()}`;
  const now = new Date();

  const newNote: NoteItem = {
    id: newId,
    title: params.title,
    subjectCode: params.subjectCode,
    subjectName: params.subjectName,
    departmentCode: params.departmentCode,
    semester: params.semester,
    category: params.category,
    academicYear: params.academicYear,
    fileUrl: params.fileUrl || '/mock-files/faculty-verified.pdf',
    fileSize: params.fileSize || 1024 * 1024 * 2.5,
    downloadsCount: 0,
    status: 'approved',
    uploaderId: verifier.userId || 'faculty-uploader',
    uploaderName: verifier.fullName || 'SETGOI Faculty',
    uploaderRole: verifier.role,
    verifiedById: verifier.userId || 'faculty-verifier',
    verifiedByName: verifier.fullName || 'SETGOI Faculty',
    verifiedAt: now.toISOString(),
    createdAt: now.toISOString(),
  };

  try {
    await prisma.noteItem.create({
      data: {
        id: newId,
        title: params.title,
        subjectCode: params.subjectCode,
        subjectName: params.subjectName,
        department: params.departmentCode,
        semester: params.semester,
        category: params.category,
        academicYear: params.academicYear,
        fileUrl: newNote.fileUrl,
        fileSize: newNote.fileSize,
        status: 'approved',
        uploaderId: verifier.userId || 'faculty-uploader',
        verifiedById: verifier.userId || 'faculty-verifier',
        verifiedAt: now,
      },
    });
  } catch {
    devNotesStore.unshift(newNote);
  }

  revalidatePath('/dashboard/college');
  revalidatePath('/dashboard/admin');
  revalidatePath('/notes');

  return {
    success: true,
    note: newNote,
  };
}

/**
 * College/Admin mutation: Post an official notice to the institution board.
 * Guarded by requireCollegeOrAdmin.
 */
export async function postOfficialNoticeAction(params: {
  title: string;
  content: string;
  department: string;
  category: 'Examination' | 'Academic' | 'Hostel' | 'Transit' | 'Administration';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}) {
  const guard = await assertRoleGuard(['college', 'admin']);
  if (!guard.authorized) {
    return {
      success: false,
      error: guard.error,
    };
  }

  const notice: CampusNotice = {
    id: `notice-${Date.now()}`,
    title: params.title,
    content: params.content,
    department: params.department,
    category: params.category,
    priority: params.priority,
    postedById: guard.user.userId || 'faculty-author',
    postedByName: guard.user.fullName || 'SETGOI Faculty',
    postedByRole: guard.user.role,
    createdAt: new Date().toISOString(),
  };

  devNoticesStore.unshift(notice);

  revalidatePath('/dashboard/college');
  revalidatePath('/dashboard/admin');
  revalidatePath('/');
  revalidatePath('/campus');

  return {
    success: true,
    notice,
  };
}

/**
 * Retrieve official institution notices.
 */
export async function getOfficialNoticesAction(): Promise<CampusNotice[]> {
  return devNoticesStore;
}

