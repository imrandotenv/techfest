'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { ForumPost, CustomUserRole, ForumSortOption, ForumCategory } from '../types';
import { INITIAL_FORUM_DATA } from '../mock-data';
import { forumStore } from '../forum-service';
import { ForumHeader } from './ForumHeader';
import { ForumCategoryFilter } from './ForumCategoryFilter';
import { ForumPostCard } from './ForumPostCard';
import { ForumPostDetail } from './ForumPostDetail';
import { CreatePostModal } from './CreatePostModal';
import { MessageSquare, RefreshCw, AlertCircle, Sparkles, Tag, X } from 'lucide-react';
import { getResolvedRole } from '@/lib/auth-client';
import { AuthPromptModal, AuthPromptReason } from '@/components/auth/AuthPromptModal';

interface ForumMainViewProps {
  initialPosts?: ForumPost[];
  initialPostId?: string;
}

export function ForumMainView({
  initialPosts,
  initialPostId,
}: ForumMainViewProps) {
  const { user, isLoaded, isSignedIn } = useUser();

  // Active Role and User State derived directly from Clerk
  const currentRole = getResolvedRole(user);
  const userName = user?.fullName || user?.firstName || 'SETGOI Student';
  const userDepartment =
    currentRole === 'college'
      ? 'SETGOI Faculty'
      : currentRole === 'admin'
      ? 'Platform Admin'
      : 'SETGOI Student';

  // Posts State
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    return initialPosts && initialPosts.length > 0
      ? initialPosts
      : JSON.parse(JSON.stringify(INITIAL_FORUM_DATA));
  });

  // Selected Post for detailed view
  const [selectedPostId, setSelectedPostId] = useState<string | null>(
    initialPostId || null
  );

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<ForumSortOption>('recent');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState<AuthPromptReason | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleOpenCreateModal = () => {
    if (!isSignedIn) {
      setAuthPromptReason('create_forum_post');
      return;
    }
    setIsCreateModalOpen(true);
  };

  // Upvote Post
  const handleUpvotePost = async (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const currentlyUpvoted = Boolean(p.userUpvoted);
          return {
            ...p,
            userUpvoted: !currentlyUpvoted,
            upvotesCount: p.upvotesCount + (currentlyUpvoted ? -1 : 1),
          };
        }
        return p;
      })
    );

    // Call API in background
    try {
      await fetch('/api/forum/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
    } catch {
      // In-memory update was already made
    }
  };

  // Upvote Reply
  const handleUpvoteReply = async (postId: string, replyId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const updatedReplies = p.replies.map((r) => {
            if (r.id === replyId) {
              const currentlyUpvoted = Boolean(r.userUpvoted);
              return {
                ...r,
                userUpvoted: !currentlyUpvoted,
                upvotesCount: r.upvotesCount + (currentlyUpvoted ? -1 : 1),
              };
            }
            return r;
          });
          return { ...p, replies: updatedReplies };
        }
        return p;
      })
    );

    try {
      await fetch('/api/forum/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, replyId }),
      });
    } catch {
      // In-memory update was already made
    }
  };

  // Add Reply (Top-level or nested)
  const handleAddReply = async (data: {
    postId: string;
    content: string;
    parentId?: string | null;
    isOfficialAnswer?: boolean;
  }) => {
    if (!isSignedIn) {
      setAuthPromptReason('reply_forum');
      return;
    }
    const isOfficial = Boolean(data.isOfficialAnswer) && (currentRole === 'college' || currentRole === 'admin');
    
    const newReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId: data.postId,
      content: data.content,
      authorId: user?.id || `user-${currentRole}-local`,
      authorName: userName,
      authorRole: currentRole,
      authorDepartment: userDepartment,
      isOfficialAnswer: isOfficial,
      verifiedBy: isOfficial ? `${userName} (${currentRole === 'college' ? 'Faculty' : 'Admin'})` : undefined,
      verifiedAt: isOfficial ? new Date().toISOString() : undefined,
      upvotesCount: 0,
      userUpvoted: false,
      parentId: data.parentId || null,
      createdAt: new Date().toISOString(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === data.postId) {
          const updatedReplies = [...p.replies, newReply];
          return {
            ...p,
            replies: updatedReplies,
            hasOfficialAnswer: p.hasOfficialAnswer || isOfficial,
          };
        }
        return p;
      })
    );

    triggerToast(
      isOfficial
        ? 'Official Faculty Answer posted with verified badge!'
        : 'Reply posted to discussion thread.',
      'success'
    );

    try {
      await fetch('/api/forum/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: data.postId,
          content: data.content,
          authorId: user?.id || `user-${currentRole}-local`,
          authorName: userName,
          authorRole: currentRole,
          authorDepartment: userDepartment,
          isOfficialAnswer: isOfficial,
          parentId: data.parentId || null,
        }),
      });
    } catch {
      // in-memory state updated
    }
  };

  // Toggle Official Faculty Answer (RESTRICTED TO COLLEGE / ADMIN)
  const handleToggleOfficialAnswer = async (postId: string, replyId: string) => {
    if (currentRole !== 'college' && currentRole !== 'admin') {
      triggerToast(
        'Permission Denied: Only College Faculty or Admin accounts can verify Official Faculty Answers.',
        'error'
      );
      return;
    }

    let isNowOfficial = false;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const updatedReplies = p.replies.map((r) => {
            if (r.id === replyId) {
              const nextStatus = !r.isOfficialAnswer;
              isNowOfficial = nextStatus;
              return {
                ...r,
                isOfficialAnswer: nextStatus,
                verifiedBy: nextStatus ? `${userName} (${currentRole === 'college' ? 'Faculty' : 'Admin'})` : undefined,
                verifiedAt: nextStatus ? new Date().toISOString() : undefined,
              };
            }
            return r;
          });
          const hasAnyOfficial = updatedReplies.some((r) => r.isOfficialAnswer);
          return { ...p, replies: updatedReplies, hasOfficialAnswer: hasAnyOfficial };
        }
        return p;
      })
    );

    triggerToast(
      isNowOfficial
        ? 'Verified as Official Faculty Answer with badge!'
        : 'Official Faculty Answer verification removed.',
      'success'
    );

    try {
      await fetch('/api/forum/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          replyId,
          verifierId: user?.id || `verifier-${currentRole}`,
          verifierName: userName,
          verifierRole: currentRole,
        }),
      });
    } catch {
      // in-memory state updated
    }
  };

  // Create New Post
  const handleCreatePost = async (data: {
    title: string;
    content: string;
    category: ForumCategory;
    tags: string[];
    department: string;
  }) => {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: data.title,
      content: data.content,
      category: data.category,
      authorId: user?.id || `author-${Date.now()}`,
      authorName: userName,
      authorRole: currentRole,
      authorDepartment: data.department || userDepartment,
      isPinned: false,
      upvotesCount: 0,
      userUpvoted: false,
      replies: [],
      tags: data.tags,
      viewsCount: 1,
      hasOfficialAnswer: false,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setSelectedCategory('All');
    setSelectedPostId(newPost.id);
    triggerToast('New question published successfully!', 'success');

    try {
      await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          category: data.category,
          authorId: user?.id || `author-${Date.now()}`,
          authorName: userName,
          authorRole: currentRole,
          authorDepartment: data.department || userDepartment,
          tags: data.tags,
        }),
      });
    } catch {
      // in-memory state updated
    }
  };

  // Filtered and Sorted Posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Tag filter
    if (selectedTag) {
      const tagLower = selectedTag.toLowerCase().replace(/^#/, '');
      result = result.filter((p) =>
        p.tags?.some((t) => t.toLowerCase().replace(/^#/, '') === tagLower)
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
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
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortOption === 'upvotes') {
        return b.upvotesCount - a.upvotesCount;
      }
      if (sortOption === 'official') {
        const aOfficial = a.hasOfficialAnswer || a.replies.some((r) => r.isOfficialAnswer);
        const bOfficial = b.hasOfficialAnswer || b.replies.some((r) => r.isOfficialAnswer);
        if (aOfficial && !bOfficial) return -1;
        if (!aOfficial && bOfficial) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'unanswered') {
        return a.replies.length - b.replies.length;
      }
      // default: recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [posts, selectedCategory, selectedTag, searchQuery, sortOption]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Academic: 0,
      TechFest: 0,
      'Campus Life': 0,
      Placements: 0,
      Hostel: 0,
    };
    posts.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [posts]);

  // Extract all unique tags across all posts
  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      p.tags?.forEach((t) => {
        const clean = t.trim().replace(/^#/, '');
        if (clean) set.add(clean);
      });
    });
    return Array.from(set);
  }, [posts]);

  // Currently selected post
  const activePost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((p) => p.id === selectedPostId) || null;
  }, [posts, selectedPostId]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          className={`fixed bottom-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            feedbackToast.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-zinc-900 border-zinc-800 text-white'
          }`}
        >
          {feedbackToast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>{feedbackToast.message}</span>
        </div>
      )}


      {/* Render Post Detail OR List */}
      {activePost ? (
        <ForumPostDetail
          post={activePost}
          onBack={() => setSelectedPostId(null)}
          currentUser={{
            id: user?.id || `user-${currentRole}`,
            name: userName,
            role: currentRole,
            department: userDepartment,
          }}
          onUpvotePost={handleUpvotePost}
          onUpvoteReply={handleUpvoteReply}
          onAddReply={handleAddReply}
          onToggleOfficialAnswer={handleToggleOfficialAnswer}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Header */}
          <ForumHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onOpenCreateModal={handleOpenCreateModal}
            totalPosts={filteredPosts.length}
          />

          {/* Category Tabs Filter */}
          <ForumCategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />

          {/* Active Tag Filter Pill (if selected from card) */}
          {selectedTag && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#52525B]">Filtered by topic:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-blue-50 text-[#2563EB] border border-blue-200">
                #{selectedTag}
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="hover:text-blue-900 cursor-pointer ml-1"
                  title="Remove topic filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-[#E4E4E7] rounded-xl p-12 text-center shadow-xs">
              <MessageSquare className="w-10 h-10 text-[#52525B]/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#09090B] font-display">
                No discussion threads found
              </h3>
              <p className="text-xs text-[#52525B] mt-1 max-w-sm mx-auto font-sans">
                {searchQuery || selectedTag
                  ? `No questions matching your active filters. Try clearing the topic or searching another keyword.`
                  : `No threads in category "${selectedCategory}" yet. Be the first to start the discussion!`}
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                {(searchQuery || selectedTag) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTag(null);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-[#09090B] hover:bg-zinc-200 transition-colors font-sans cursor-pointer border border-[#E4E4E7]"
                  >
                    Reset Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#2563EB] text-white hover:bg-blue-700 transition-colors font-sans shadow-xs cursor-pointer"
                >
                  Ask a Question
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredPosts.map((post) => (
                <ForumPostCard
                  key={post.id}
                  post={post}
                  onSelect={(id) => setSelectedPostId(id)}
                  onUpvote={handleUpvotePost}
                  onSelectTag={(tag) => setSelectedTag(tag.replace(/^#/, ''))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Question Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={{
          id: user?.id || `user-${currentRole}`,
          name: userName,
          role: currentRole,
          department: userDepartment,
        }}
        onSubmit={handleCreatePost}
      />

      {/* Auth Guard Prompt Modal */}
      <AuthPromptModal
        isOpen={authPromptReason !== null}
        onClose={() => setAuthPromptReason(null)}
        reason={authPromptReason || 'create_forum_post'}
      />
    </div>
  );
}
