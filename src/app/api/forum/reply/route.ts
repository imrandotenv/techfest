import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { forumStore } from '@/modules/forum/forum-service';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
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

    let authorIdToUse = 'anon-reply-user';

    if (userId) {
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
              isOfficialAnswer: Boolean(isOfficialAnswer),
              parentId: parentId || null,
            },
          });
        }
      } catch (dbErr) {
        console.warn('[Forum Reply API] Neon DB write note:', dbErr);
      }
    }

    const result = forumStore.createReply({
      postId,
      content,
      authorId: authorIdToUse,
      authorName: authorName || 'SETGOI Member',
      authorRole: authorRole || 'student',
      authorDepartment,
      isOfficialAnswer: Boolean(isOfficialAnswer),
      parentId: parentId || null,
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
