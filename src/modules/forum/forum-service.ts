import { ForumPost, ForumReply, CustomUserRole, ForumCategory, ForumSortOption } from './types';
import { INITIAL_FORUM_DATA } from './mock-data';

// In-memory data store with fallback for development and client/server hybrid use
class ForumDataStore {
  private posts: ForumPost[] = [];

  constructor() {
    this.resetToInitial();
  }

  public resetToInitial(): void {
    // Deep copy initial data
    this.posts = JSON.parse(JSON.stringify(INITIAL_FORUM_DATA));
  }

  public getPosts(filters?: {
    category?: string;
    search?: string;
    sort?: ForumSortOption;
  }): ForumPost[] {
    let result = [...this.posts];

    // Filter by Category
    if (filters?.category && filters.category !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    // Filter by Search Query
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.replies.some((r) => r.content.toLowerCase().includes(q) || r.authorName.toLowerCase().includes(q))
      );
    }

    // Sort
    const sort = filters?.sort || 'recent';
    result.sort((a, b) => {
      // Pinned posts always stay on top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sort === 'upvotes') {
        return b.upvotesCount - a.upvotesCount;
      }
      if (sort === 'official') {
        const aOfficial = a.replies.some((r) => r.isOfficialAnswer);
        const bOfficial = b.replies.some((r) => r.isOfficialAnswer);
        if (aOfficial && !bOfficial) return -1;
        if (!aOfficial && bOfficial) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === 'unanswered') {
        const aAnswers = a.replies.length;
        const bAnswers = b.replies.length;
        return aAnswers - bAnswers;
      }
      // default: recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }

  public getPostById(id: string): ForumPost | undefined {
    return this.posts.find((p) => p.id === id);
  }

  public createPost(data: {
    title: string;
    content: string;
    category: ForumCategory;
    authorId: string;
    authorName: string;
    authorRole: CustomUserRole;
    authorDepartment?: string;
    tags?: string[];
  }): ForumPost {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: data.title.trim(),
      content: data.content.trim(),
      category: data.category,
      authorId: data.authorId,
      authorName: data.authorName,
      authorRole: data.authorRole,
      authorDepartment: data.authorDepartment || (data.authorRole === 'student' ? 'SETGOI Student' : 'SETGOI Faculty'),
      isPinned: false,
      upvotesCount: 0,
      userUpvoted: false,
      replies: [],
      tags: data.tags || [],
      viewsCount: 1,
      hasOfficialAnswer: false,
      createdAt: new Date().toISOString(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  public createReply(data: {
    postId: string;
    content: string;
    authorId: string;
    authorName: string;
    authorRole: CustomUserRole;
    authorDepartment?: string;
    isOfficialAnswer?: boolean;
    parentId?: string | null;
  }): { post: ForumPost; reply: ForumReply } {
    const post = this.posts.find((p) => p.id === data.postId);
    if (!post) {
      throw new Error(`Post with ID "${data.postId}" not found`);
    }

    // Role verification check: Only college or admin can create an Official Faculty Answer
    let isOfficial = Boolean(data.isOfficialAnswer);
    let verifiedBy: string | undefined = undefined;
    let verifiedAt: string | undefined = undefined;

    if (isOfficial) {
      if (!this.canVerifyAnswer(data.authorRole)) {
        // Fallback safety: do not permit student to mark official
        isOfficial = false;
      } else {
        verifiedBy = `${data.authorName} (${data.authorRole === 'college' ? 'Faculty' : 'Admin'})`;
        verifiedAt = new Date().toISOString();
      }
    }

    const newReply: ForumReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId: data.postId,
      content: data.content.trim(),
      authorId: data.authorId,
      authorName: data.authorName,
      authorRole: data.authorRole,
      authorDepartment: data.authorDepartment || (data.authorRole === 'student' ? 'Student' : 'Faculty'),
      isOfficialAnswer: isOfficial,
      verifiedBy,
      verifiedAt,
      upvotesCount: 0,
      userUpvoted: false,
      parentId: data.parentId || null,
      createdAt: new Date().toISOString(),
    };

    post.replies.push(newReply);
    if (isOfficial) {
      post.hasOfficialAnswer = true;
    }

    return { post, reply: newReply };
  }

  public toggleUpvote(
    postId: string,
    replyId?: string
  ): { upvoted: boolean; upvotesCount: number } {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    if (!replyId) {
      // Toggle post upvote
      const currentlyUpvoted = Boolean(post.userUpvoted);
      post.userUpvoted = !currentlyUpvoted;
      post.upvotesCount += currentlyUpvoted ? -1 : 1;
      return { upvoted: post.userUpvoted, upvotesCount: post.upvotesCount };
    } else {
      // Toggle reply upvote
      const reply = post.replies.find((r) => r.id === replyId);
      if (!reply) throw new Error('Reply not found');
      const currentlyUpvoted = Boolean(reply.userUpvoted);
      reply.userUpvoted = !currentlyUpvoted;
      reply.upvotesCount += currentlyUpvoted ? -1 : 1;
      return { upvoted: reply.userUpvoted, upvotesCount: reply.upvotesCount };
    }
  }

  public toggleOfficialAnswer(
    postId: string,
    replyId: string,
    verifier: {
      id: string;
      name: string;
      role: CustomUserRole;
    }
  ): { reply: ForumReply; post: ForumPost } {
    if (!this.canVerifyAnswer(verifier.role)) {
      throw new Error(
        'Unauthorized: Only College Faculty and Platform Administrators are authorized to verify Official Faculty Answers.'
      );
    }

    const post = this.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const reply = post.replies.find((r) => r.id === replyId);
    if (!reply) throw new Error('Reply not found');

    // Toggle status
    reply.isOfficialAnswer = !reply.isOfficialAnswer;
    if (reply.isOfficialAnswer) {
      reply.verifiedBy = `${verifier.name} (${verifier.role === 'college' ? 'Faculty' : 'Admin'})`;
      reply.verifiedAt = new Date().toISOString();
    } else {
      reply.verifiedBy = undefined;
      reply.verifiedAt = undefined;
    }

    // Update post level flag
    post.hasOfficialAnswer = post.replies.some((r) => r.isOfficialAnswer);

    return { reply, post };
  }

  public canVerifyAnswer(role: string | undefined): boolean {
    return role === 'college' || role === 'admin';
  }
}

// Singleton global instance for API routes and SSR
const globalForForum = global as unknown as { forumDataStore: ForumDataStore };
export const forumStore = globalForForum.forumDataStore || new ForumDataStore();
if (process.env.NODE_ENV !== 'production') globalForForum.forumDataStore = forumStore;

// Tree builder utility for rendering nested replies hierarchically
export function buildNestedReplyTree(flatReplies: ForumReply[]): ForumReply[] {
  const replyMap = new Map<string, ForumReply>();
  const rootReplies: ForumReply[] = [];

  // Clone objects to avoid mutation side effects
  flatReplies.forEach((r) => {
    replyMap.set(r.id, { ...r, children: [] });
  });

  // Wire children to parents
  flatReplies.forEach((r) => {
    const replyNode = replyMap.get(r.id)!;
    if (r.parentId && replyMap.has(r.parentId)) {
      const parentNode = replyMap.get(r.parentId)!;
      if (!parentNode.children) parentNode.children = [];
      parentNode.children.push(replyNode);
    } else {
      rootReplies.push(replyNode);
    }
  });

  // Sort root replies: Official Answers first, then by upvotes, then timestamp
  rootReplies.sort((a, b) => {
    if (a.isOfficialAnswer && !b.isOfficialAnswer) return -1;
    if (!a.isOfficialAnswer && b.isOfficialAnswer) return 1;
    return (b.upvotesCount || 0) - (a.upvotesCount || 0);
  });

  return rootReplies;
}
