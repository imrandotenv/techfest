import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { forumStore } from '@/modules/forum/forum-service';
import { ForumCategory, ForumSortOption } from '@/modules/forum/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = (searchParams.get('sort') as ForumSortOption) || 'recent';

    // 1. Fetch live from Neon Postgres
    let dbPosts: any[] = [];
    try {
      const records = await prisma.forumPost.findMany({
        where: {
          ...(category && category !== 'All' ? { category } : {}),
          ...(search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { content: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        include: {
          author: {
            select: { id: true, fullName: true, role: true, branch: true },
          },
          replies: {
            include: {
              author: {
                select: { id: true, fullName: true, role: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: sort === 'upvotes' ? { upvotes: 'desc' } : { createdAt: 'desc' },
      });

      dbPosts = records.map((p) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        category: p.category || 'Academic',
        tags: p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [],
        authorId: p.authorId,
        authorName: p.author?.fullName || 'SETGOI Student',
        authorRole: p.author?.role?.toLowerCase() || 'student',
        authorDepartment: p.author?.branch ? `B.Tech ${p.author.branch}` : 'SETGOI Campus',
        upvotesCount: p.upvotes,
        createdAt: p.createdAt.toISOString(),
        replies: p.replies.map((r) => ({
          id: r.id,
          postId: r.postId,
          content: r.content,
          authorId: r.authorId,
          authorName: r.author?.fullName || 'SETGOI Member',
          authorRole: r.author?.role?.toLowerCase() || 'student',
          isOfficialAnswer: r.isOfficialAnswer,
          upvotesCount: r.upvotes,
          parentId: r.parentId,
          createdAt: r.createdAt.toISOString(),
        })),
        repliesCount: p.replies.length,
      }));
    } catch (dbErr) {
      console.warn('[Forum API] Neon DB read note:', dbErr);
    }

    // Combine with in-memory seed posts
    const memoryPosts = forumStore.getPosts({ category, search, sort });
    const allPosts = [...dbPosts, ...memoryPosts.filter((mp) => !dbPosts.some((dp) => dp.id === mp.id))];

    return NextResponse.json({ success: true, posts: allPosts, total: allPosts.length });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { title, content, category, authorName, authorRole, authorDepartment, tags, branch, semester } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    let dbPost = null;
    let authorIdToUse = 'anon-user';

    if (userId) {
      try {
        const clerkUser = await currentUser();
        const primaryEmail =
          clerkUser?.emailAddresses.find((e) => e.id === clerkUser?.primaryEmailAddressId)?.emailAddress ||
          clerkUser?.emailAddresses[0]?.emailAddress ||
          `${userId}@student.setgoi.ac.in`;
        const fullName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || authorName || 'SETGOI Student';

        const dbUser = await prisma.user.upsert({
          where: { clerkId: userId },
          update: { email: primaryEmail, fullName },
          create: {
            clerkId: userId,
            email: primaryEmail,
            fullName,
            role: 'STUDENT',
            degree: 'B.Tech',
            branch: branch || 'CSE',
            semester: semester || 3,
            onboardingCompleted: true,
          },
        });

        authorIdToUse = dbUser.id;

        dbPost = await prisma.forumPost.create({
          data: {
            title: title.trim(),
            content: content.trim(),
            category: category.trim(),
            tags: Array.isArray(tags) ? tags.join(', ') : (tags || ''),
            branch: branch || dbUser.branch || undefined,
            semester: semester ? Number(semester) : dbUser.semester || undefined,
            authorId: dbUser.id,
          },
          include: {
            author: { select: { id: true, fullName: true, role: true, branch: true } },
          },
        });
      } catch (dbErr) {
        console.warn('[Forum API] Neon DB write note:', dbErr);
      }
    }

    // Also update in-memory store
    const memPost = forumStore.createPost({
      title,
      content,
      category: category as ForumCategory,
      authorId: authorIdToUse,
      authorName: authorName || 'SETGOI Student',
      authorRole: authorRole || 'student',
      authorDepartment: authorDepartment || 'SETGOI Campus',
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ success: true, post: dbPost || memPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create forum post' },
      { status: 500 }
    );
  }
}
