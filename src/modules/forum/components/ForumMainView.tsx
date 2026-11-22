'use client';

import React, { useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { ForumPost, CustomUserRole, ForumSortOption, ForumCategory, ForumStatusFilter } from '../types';
import { INITIAL_FORUM_DATA } from '../mock-data';
import { ForumHeader } from './ForumHeader';
import { ForumPostCard } from './ForumPostCard';
import { ForumPostDetail } from './ForumPostDetail';
import { CreatePostModal } from './CreatePostModal';
import { 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  X, 
  BookOpen, 
  Code2, 
  FlaskConical, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Circle, 
  Award,
  Filter
} from 'lucide-react';
import { getResolvedRole } from '@/lib/auth-client';
import { AuthPromptModal, AuthPromptReason } from '@/components/auth/AuthPromptModal';

interface ForumMainViewProps {
  initialPosts?: ForumPost[];
  initialPostId?: string;
}

const CATEGORIES = [
  { id: 'All', label: 'All Discussions', icon: MessageSquare },
  { id: 'Academics & Syllabus', label: 'Academics & Syllabus', icon: BookOpen },
  { id: 'Coding & DSA', label: 'Coding & DSA', icon: Code2 },
  { id: 'Labs & Viva', label: 'Labs & Viva', icon: FlaskConical },
  { id: 'Placements & Internships', label: 'Placements & Internships', icon: Briefcase },
  { id: 'Engineering Campus', label: 'Engineering Campus', icon: Building2 },
];

const STATUS_FILTERS: { id: ForumStatusFilter; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Statuses', icon: Filter },
  { id: 'open', label: 'Open', icon: Circle },
  { id: 'solved', label: 'Solved', icon: CheckCircle2 },
  { id: 'verified', label: 'Faculty Verified', icon: Award },
];

export function ForumMainView({
  initialPosts,
  initialPostId,
}: ForumMainViewProps) {
  const { user, isSignedIn } = useUser();

  const currentRole = getResolvedRole(user);
  const userName = user?.fullName || user?.firstName || 'SETGOI Student';
  const userDepartment =
    currentRole === 'college'
      ? 'SETGOI Faculty'
      : currentRole === 'admin'
      ? 'Platform Admin'
      : 'SETGOI Student';

  const [posts, setPosts] = useState<ForumPost[]>(() => {
    return initialPosts && initialPosts.length > 0
      ? initialPosts
      : JSON.parse(JSON.stringify(INITIAL_FORUM_DATA));
  });

  const [selectedPostId, setSelectedPostId] = useState<string | null>(
    initialPostId || null
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<ForumStatusFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<ForumSortOption>('recent');

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

    try {
      await fetch('/api/forum/upvote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
    } catch {
      // In-memory update already done
    }
  };

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
      // In-memory update already done
    }
  };

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
      // In-memory update already done
    }
  };

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
      // In-memory update already done
    }
  };

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
      // In-memory update already done
    }
  };

  // Filtered and Sorted Posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Category filter with alias normalizer
    if (selectedCategory !== 'All') {
      result = result.filter((p) => {
        if (selectedCategory === 'Academics & Syllabus') {
          return p.category === 'Academics & Syllabus' || p.category === 'Academic';
        }
        if (selectedCategory === 'Coding & DSA') {
          return p.category === 'Coding & DSA' || p.category === 'TechFest';
        }
        if (selectedCategory === 'Labs & Viva') {
          return p.category === 'Labs & Viva';
        }
        if (selectedCategory === 'Placements & Internships') {
          return p.category === 'Placements & Internships' || p.category === 'Placements';
        }
        if (selectedCategory === 'Engineering Campus') {
          return p.category === 'Engineering Campus' || p.category === 'Campus Life';
        }
        return p.category.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // Status filter
    if (selectedStatus === 'open') {
      result = result.filter((p) => p.replies.length === 0);
    } else if (selectedStatus === 'solved') {
      result = result.filter((p) => p.replies.length > 0);
    } else if (selectedStatus === 'verified') {
      result = result.filter((p) => p.hasOfficialAnswer || p.replies.some((r) => r.isOfficialAnswer));
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
  }, [posts, selectedCategory, selectedStatus, selectedTag, searchQuery, sortOption]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: posts.length,
      'Academics & Syllabus': 0,
      'Coding & DSA': 0,
      'Labs & Viva': 0,
      'Placements & Internships': 0,
      'Engineering Campus': 0,
    };
    posts.forEach((p) => {
      if (p.category === 'Academic' || p.category === 'Academics & Syllabus') {
        counts['Academics & Syllabus']++;
      } else if (p.category === 'TechFest' || p.category === 'Coding & DSA') {
        counts['Coding & DSA']++;
      } else if (p.category === 'Labs & Viva') {
        counts['Labs & Viva']++;
      } else if (p.category === 'Placements' || p.category === 'Placements & Internships') {
        counts['Placements & Internships']++;
      } else if (p.category === 'Engineering Campus' || p.category === 'Campus Life') {
        counts['Engineering Campus']++;
      }
    });
    return counts;
  }, [posts]);

  // Currently selected post
  const activePost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((p) => p.id === selectedPostId) || null;
  }, [posts, selectedPostId]);

  return (
    <div className="w-full space-y-6">
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

      {/* Render Post Detail OR 2-Column List View */}
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
        <div className="space-y-6">
          {/* Header */}
          <ForumHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onOpenCreateModal={handleOpenCreateModal}
            totalPosts={filteredPosts.length}
          />

          {/* 2-Column Engineering Layout: Sidebar (w-56) + Main Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Categories & Status Filter */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Category Nav Links */}
              <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-xs">
                <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  Categories
                </div>
                <nav className="space-y-1 mt-1">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    const count = categoryCounts[cat.id] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-sans font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-[#2563EB] font-semibold'
                            : 'text-zinc-700 hover:bg-zinc-100/70 hover:text-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#2563EB]' : 'text-zinc-400'}`} />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-blue-100 text-[#2563EB]' : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Status Filter */}
              <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-xs">
                <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  Discussion Status
                </div>
                <div className="space-y-1 mt-1">
                  {STATUS_FILTERS.map((status) => {
                    const Icon = status.icon;
                    const isSelected = selectedStatus === status.id;
                    return (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => setSelectedStatus(status.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-100 text-zinc-900 font-bold'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${
                          status.id === 'verified' ? 'text-purple-600' :
                          status.id === 'solved' ? 'text-emerald-600' :
                          status.id === 'open' ? 'text-zinc-400' : 'text-zinc-500'
                        }`} />
                        <span>{status.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Engineering Guidelines Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] font-sans text-blue-900 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 mb-1 font-mono text-xs text-[#2563EB]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Q&amp;A Hub</span>
                </div>
                <span>Faculty verified answers are marked with a purple award. Questions with code snippets get answered 3x faster by senior batchmates.</span>
              </div>
            </aside>

            {/* Right Main Feed: GitHub Discussions style */}
            <main className="lg:col-span-9 space-y-4">
              {/* Active Filter Pills Bar */}
              {(selectedTag || selectedStatus !== 'all' || selectedCategory !== 'All' || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  <span className="text-xs font-mono text-zinc-500">Active filters:</span>
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('All')} className="hover:text-red-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedStatus !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-zinc-100 text-zinc-800 border border-zinc-200 capitalize">
                      Status: {selectedStatus}
                      <button onClick={() => setSelectedStatus('all')} className="hover:text-red-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-50 text-[#2563EB] border border-blue-200">
                      #{selectedTag}
                      <button onClick={() => setSelectedTag(null)} className="hover:text-blue-900 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200">
                      Search: &ldquo;{searchQuery}&rdquo;
                      <button onClick={() => setSearchQuery('')} className="hover:text-amber-950 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedStatus('all');
                      setSelectedTag(null);
                      setSearchQuery('');
                    }}
                    className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 underline ml-2 cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Feed Container */}
              {filteredPosts.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center shadow-xs">
                  <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-zinc-900 font-display">
                    No discussions found
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto font-sans">
                    No threads match your active filters or keyword search. Reset your filters or start a new discussion.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedStatus('all');
                        setSelectedTag(null);
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors font-sans cursor-pointer border border-zinc-200"
                    >
                      Reset Filters
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenCreateModal}
                      className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#2563EB] text-white hover:bg-blue-700 transition-colors font-sans shadow-xs cursor-pointer"
                    >
                      Ask Question
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-zinc-200 rounded-xl shadow-xs divide-y divide-zinc-200 overflow-hidden">
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
            </main>
          </div>
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