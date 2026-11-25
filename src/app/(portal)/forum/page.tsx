import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ForumMainView } from '@/modules/forum';
import { ForumPost, ForumCategory, CustomUserRole } from '@/modules/forum/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Discussions & Academic Q&A | SETTech SETGOI',
  description:
    'Categorized campus discussion board for SETGOI Durgapur: MAKAUT academic queries, TechFest 2026 tracks, placements, engineering lab updates, and verified Official Faculty Answers.',
};

interface ForumPageProps {
  searchParams?: Promise<{
    post?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialPostId = resolvedParams.post;
  const initialCategory = resolvedParams.category;
  const initialSearch = resolvedParams.search;

  const { userId } = await auth().catch(() => ({ userId: null }));

  let initialPosts: ForumPost[] = [];
  try {
    const records = await prisma.forumPost.findMany({
      where: {
        ...(initialCategory && initialCategory !== 'All' ? { category: initialCategory } : {}),
        ...(initialSearch
          ? {
              OR: [
                { title: { contains: initialSearch, mode: 'insensitive' } },
                { content: { contains: initialSearch, mode: 'insensitive' } },
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
      orderBy: { createdAt: 'desc' },
    });

    const votedPostIds = new Set<string>();
    const votedReplyIds = new Set<string>();
    if (userId) {
      const votes = await prisma.forumVote.findMany({ where: { userId } }).catch(() => []);
      votes.forEach((v) => {
        if (v.postId) votedPostIds.add(v.postId);
        if (v.replyId) votedReplyIds.add(v.replyId);
      });
    }

    initialPosts = records.map((p) => {
      const mappedReplies = p.replies.map((r) => {
        const rRole = (r.author?.role || 'STUDENT').toUpperCase();
        const roleLower: CustomUserRole =
          rRole === 'ADMIN' ? 'admin' : rRole === 'FACULTY' ? 'college' : 'student';
        return {
          id: r.id,
          postId: r.postId,
          content: r.content,
          authorId: r.author?.clerkId || r.authorId,
          authorName: r.author?.fullName || 'SETGOI Member',
          authorRole: roleLower,
          authorDepartment: r.author?.branch ? `B.Tech ${r.author.branch}` : 'SETGOI Campus',
          isOfficialAnswer: r.isOfficialAnswer || rRole === 'FACULTY' || rRole === 'ADMIN',
          upvotesCount: r.upvotes,
          userUpvoted: votedReplyIds.has(r.id),
          parentId: r.parentId,
          createdAt: r.createdAt.toISOString(),
        };
      });

      const pRole = (p.author?.role || 'STUDENT').toUpperCase();
      const pRoleLower: CustomUserRole =
        pRole === 'ADMIN' ? 'admin' : pRole === 'FACULTY' ? 'college' : 'student';

      return {
        id: p.id,
        title: p.title,
        content: p.content,
        category: (p.category || 'Academics & Syllabus') as ForumCategory,
        tags: p.tags ? p.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        authorId: p.author?.clerkId || p.authorId,
        authorName: p.author?.fullName || 'SETGOI Student',
        authorRole: pRoleLower,
        authorDepartment: p.author?.branch ? `B.Tech ${p.author.branch}` : 'SETGOI Campus',
        isPinned: false,
        upvotesCount: p.upvotes,
        userUpvoted: votedPostIds.has(p.id),
        viewsCount: 1,
        hasOfficialAnswer: mappedReplies.some((r) => r.isOfficialAnswer),
        replies: mappedReplies,
        createdAt: p.createdAt.toISOString(),
      };
    });
  } catch (err) {
    console.warn('[ForumPage] Neon DB read note:', err);
  }

  return <ForumMainView initialPosts={initialPosts} initialPostId={initialPostId} />;
}
