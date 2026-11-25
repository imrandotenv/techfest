import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { resolveAndHealUser } from '@/lib/rbac';
import { ForumSortOption } from '@/modules/forum/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth().catch(() => ({ userId: null }));
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = (searchParams.get('sort') as ForumSortOption) || 'recent';

    const records = await prisma.forumPost.findMany({
      where: {
        ...(category && category !== 'All' ? { category } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { tags: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        author: {
          select: { id: true, clerkId: true, fullName: true, role: true, branch: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, clerkId: true, fullName: true, role: true, branch: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: sort === 'upvotes' ? { upvotes: 'desc' } : { createdAt: 'desc' },
    });

    // Load current user's vote IDs for accurate toggle state
    let votedPostIds = new Set<string>();
    let votedReplyIds = new Set<string>();
    if (userId) {
      const votes = await prisma.forumVote
        .findMany({ where: { userId } })
        .catch(() => []);
      votes.forEach((v) => {
        if (v.postId) votedPostIds.add(v.postId);
        if (v.replyId) votedReplyIds.add(v.replyId);
      });
    }

    const posts = records.map((p) => {
      const mappedReplies = p.replies
        .map((r) => {
          const rRole = (r.author?.role || 'STUDENT').toUpperCase();
          const roleLower = rRole === 'ADMIN' ? 'admin' : rRole === 'FACULTY' ? 'college' : 'student';
          const isVerified = r.isVerifiedFaculty || r.isOfficialAnswer || rRole === 'FACULTY' || rRole === 'ADMIN';
          return {
            id: r.id,
            postId: r.postId,
            content: r.content,
            authorId: r.author?.clerkId || r.authorId,
            authorName: r.facultyName || r.author?.fullName || 'SETGOI Member',
            authorRole: roleLower,
            authorDepartment: r.author?.branch ? `B.Tech ${r.author.branch}` : 'SETGOI Campus',
            isOfficialAnswer: isVerified,
            isVerifiedFaculty: r.isVerifiedFaculty || isVerified,
            verifiedBy: r.facultyName || (isVerified ? r.author?.fullName || 'SETGOI Faculty' : undefined),
            upvotesCount: r.upvotes,
            userUpvoted: votedReplyIds.has(r.id),
            parentId: r.parentId,
            createdAt: r.createdAt.toISOString(),
          };
        })
        .sort((a, b) => {
          // Pin Verified Faculty Answers at the top
          if (a.isOfficialAnswer && !b.isOfficialAnswer) return -1;
          if (!a.isOfficialAnswer && b.isOfficialAnswer) return 1;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

      const pRole = (p.author?.role || 'STUDENT').toUpperCase();
      const pRoleLower = pRole === 'ADMIN' ? 'admin' : pRole === 'FACULTY' ? 'college' : 'student';
      const hasOfficial = mappedReplies.some((r) => r.isOfficialAnswer);

      return {
        id: p.id,
        title: p.title,
        content: p.content,
        category: p.category || 'Academics & Syllabus',
        tags: p.tags ? p.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        authorId: p.author?.clerkId || p.authorId,
        authorName: p.author?.fullName || 'SETGOI Student',
        authorRole: pRoleLower,
        authorDepartment: p.author?.branch ? `B.Tech ${p.author.branch}` : 'SETGOI Campus',
        isPinned: false,
        isResolved: p.isResolved || hasOfficial,
        upvotesCount: p.upvotes,
        userUpvoted: votedPostIds.has(p.id),
        viewsCount: 1,
        hasOfficialAnswer: hasOfficial,
        createdAt: p.createdAt.toISOString(),
        replies: mappedReplies,
        repliesCount: mappedReplies.length,
      };
    });

    return NextResponse.json({ success: true, posts, total: posts.length });
  } catch (error: any) {
    console.error('[Forum GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required to create forum posts' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { title, content, category, tags, branch, semester } = body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and category are required' },
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
      'SETGOI Student';

    // Safely resolve or auto-heal user in Neon DB (prevents foreign key or unique email errors)
    const dbUser = await resolveAndHealUser({
      clerkUserId: userId,
      email: primaryEmail,
      fullName,
      autoCreate: true,
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to resolve user profile in database' },
        { status: 500 }
      );
    }

    const dbPost = await prisma.forumPost.create({
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
        author: { select: { id: true, clerkId: true, fullName: true, role: true, branch: true } },
      },
    });

    revalidatePath('/forum');

    const pRole = (dbPost.author?.role || 'STUDENT').toUpperCase();
    const pRoleLower = pRole === 'ADMIN' ? 'admin' : pRole === 'FACULTY' ? 'college' : 'student';

    const formattedPost = {
      id: dbPost.id,
      title: dbPost.title,
      content: dbPost.content,
      category: dbPost.category || category.trim(),
      tags: dbPost.tags ? dbPost.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      authorId: dbPost.author?.clerkId || userId,
      authorName: dbPost.author?.fullName || fullName,
      authorRole: pRoleLower,
      authorDepartment: dbPost.author?.branch ? `B.Tech ${dbPost.author.branch}` : 'SETGOI Campus',
      isPinned: false,
      upvotesCount: 0,
      userUpvoted: false,
      viewsCount: 1,
      hasOfficialAnswer: false,
      replies: [],
      createdAt: dbPost.createdAt.toISOString(),
    };

    return NextResponse.json({ success: true, post: formattedPost }, { status: 201 });
  } catch (error: any) {
    console.error('[Forum POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}
