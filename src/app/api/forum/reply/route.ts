import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { resolveAndHealUser } from '@/lib/rbac';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required to reply to forum posts' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { postId, content, parentId, isOfficialAnswer } = body;

    if (!postId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'postId and reply content are required' },
        { status: 400 }
      );
    }

    const clerkUser = await currentUser();
    const primaryEmail =
      clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
      clerkUser?.emailAddresses[0]?.emailAddress ||
      `${userId}@student.setgoi.ac.in`;
    const fullName =
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
      clerkUser?.username ||
      'SETGOI Member';

    const dbUser = await resolveAndHealUser({
      clerkUserId: userId,
      email: primaryEmail,
      fullName,
      autoCreate: true,
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to resolve user profile' },
        { status: 500 }
      );
    }

    const postExists = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!postExists) {
      return NextResponse.json({ success: false, error: 'Forum thread not found' }, { status: 404 });
    }

    // Automatically tag replies from FACULTY or ADMIN as Official Faculty Answer
    const isPrivileged = dbUser.role === 'FACULTY' || dbUser.role === 'ADMIN';
    const actualOfficialAnswer = isPrivileged || (isPrivileged && Boolean(isOfficialAnswer));

    const dbReply = await prisma.forumReply.create({
      data: {
        postId,
        content: content.trim(),
        authorId: dbUser.id,
        isOfficialAnswer: actualOfficialAnswer,
        parentId: parentId || null,
      },
      include: {
        author: { select: { id: true, clerkId: true, fullName: true, role: true, branch: true } },
      },
    });

    revalidatePath('/forum');

    const rRole = (dbReply.author?.role || 'STUDENT').toUpperCase();
    const roleLower = rRole === 'ADMIN' ? 'admin' : rRole === 'FACULTY' ? 'college' : 'student';

    return NextResponse.json(
      {
        success: true,
        reply: {
          id: dbReply.id,
          postId: dbReply.postId,
          content: dbReply.content,
          authorId: dbReply.author?.clerkId || userId,
          authorName: dbReply.author?.fullName || fullName,
          authorRole: roleLower,
          authorDepartment: dbReply.author?.branch ? `B.Tech ${dbReply.author.branch}` : 'SETGOI Campus',
          isOfficialAnswer: dbReply.isOfficialAnswer,
          verifiedBy: dbReply.isOfficialAnswer ? dbReply.author?.fullName || fullName : undefined,
          upvotesCount: 0,
          userUpvoted: false,
          parentId: dbReply.parentId,
          createdAt: dbReply.createdAt.toISOString(),
        },
        message: dbReply.isOfficialAnswer
          ? 'Official Faculty Answer posted!'
          : 'Reply posted successfully!',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[Forum Reply POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to post reply' },
      { status: 500 }
    );
  }
}
