import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { forumStore } from '@/modules/forum/forum-service';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required to reply to forum posts' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      postId,
      content,
      authorName,
      authorRole,
      authorDepartment,
      isOfficialAnswer,
      parentId,
    } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: 'postId and content are required' },
        { status: 400 }
      );
    }

    let authorIdToUse = userId;
    let actualOfficialAnswer = false;

    try {
      const clerkUser = await currentUser();
      const primaryEmail =
        clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
        clerkUser?.emailAddresses[0]?.emailAddress ||
        `${userId}@student.setgoi.ac.in`;
      const fullName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || authorName || 'SETGOI Member';

      const dbUser = await prisma.user.upsert({
        where: { clerkId: userId },
        update: { email: primaryEmail, fullName },
        create: {
          clerkId: userId,
          email: primaryEmail,
          fullName,
          role: 'STUDENT',
          degree: 'B.Tech',
          branch: 'CSE',
          semester: 3,
          onboardingCompleted: true,
        },
      });

      authorIdToUse = dbUser.id;
      // Security: Only FACULTY or ADMIN can author an official answer
      const isPrivileged = dbUser.role === 'FACULTY' || dbUser.role === 'ADMIN';
      actualOfficialAnswer = isPrivileged && Boolean(isOfficialAnswer);

      // Check if post exists in DB
      const postExists = await prisma.forumPost.findUnique({
        where: { id: postId },
      });

      if (postExists) {
        await prisma.forumReply.create({
          data: {
            postId,
            content: content.trim(),
            authorId: dbUser.id,
            isOfficialAnswer: actualOfficialAnswer,
            parentId: parentId || null,
          },
        });
      }
    } catch (dbErr) {
      console.warn('[Forum Reply API] Neon DB write note:', dbErr);
    }

    const result = forumStore.createReply({
      postId,
      content,
      authorId: authorIdToUse,
      authorName: authorName || 'SETGOI Member',
      authorRole: actualOfficialAnswer ? 'faculty' : (authorRole || 'student'),
      authorDepartment: authorDepartment || 'SETGOI Campus',
      isOfficialAnswer: actualOfficialAnswer,
      parentId: parentId || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        reply: result.reply,
        post: result.post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating reply:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit reply' },
      { status: 500 }
    );
  }
}
