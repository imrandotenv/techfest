'use client';

import React, { useState } from 'react';
import { ForumPost, CustomUserRole, ForumReply } from '../types';
import { buildNestedReplyTree } from '../forum-service';
import { ForumReplyItem } from './ForumReplyItem';
import { 
  ArrowLeft, 
  ChevronUp, 
  MessageSquare, 
  CheckCircle2, 
  Share2, 
  Clock, 
  Send, 
  Tag, 
  ShieldCheck, 
  Pin,
  Sparkles,
  Award,
  Code2,
  Bold,
  List
} from 'lucide-react';
import { ForumMarkdownContent } from './ForumMarkdownContent';

interface ForumPostDetailProps {
  post: ForumPost;
  onBack: () => void;
  currentUser: {
    id: string;
    name: string;
    role: CustomUserRole;
    department?: string;
  };
  onUpvotePost: (postId: string) => void;
  onUpvoteReply: (postId: string, replyId: string) => void;
  onAddReply: (data: {
    postId: string;
    content: string;
    parentId?: string | null;
    isOfficialAnswer?: boolean;
  }) => void;
  onToggleOfficialAnswer: (postId: string, replyId: string) => void;
}

export function ForumPostDetail({
  post,
  onBack,
  currentUser,
  onUpvotePost,
  onUpvoteReply,
  onAddReply,
  onToggleOfficialAnswer,
}: ForumPostDetailProps) {
  const [newReplyContent, setNewReplyContent] = useState('');
  const [markOfficial, setMarkOfficial] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isFacultyOrAdmin = currentUser.role === 'college' || currentUser.role === 'admin';
  const nestedReplies = buildNestedReplyTree(post.replies || []);
  const officialReplies = (post.replies || []).filter((r) => r.isOfficialAnswer);

  const handleTopLevelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyContent.trim()) return;

    onAddReply({
      postId: post.id,
      content: newReplyContent.trim(),
      parentId: null,
      isOfficialAnswer: isFacultyOrAdmin && markOfficial,
    });

    setNewReplyContent('');
    setMarkOfficial(false);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-md transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Discussions</span>
        </button>
      </div>

      {/* Main Post Card */}
      <article className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-7 shadow-xs">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {post.isPinned && (
              <span className="swiss-badge bg-amber-50 text-amber-800 border-amber-200">
                <Pin className="w-3 h-3 fill-amber-700" />
                <span>Pinned Announcement</span>
              </span>
            )}
            <span className="swiss-badge bg-zinc-100 text-zinc-800 border-zinc-200">
              {post.category}
            </span>
            {post.hasOfficialAnswer && (
              <span className="swiss-badge bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Official Faculty Answer Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug tracking-tight mb-4">
          {post.title}
        </h1>

        {/* Author row */}
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-mono text-xs font-bold text-zinc-700">
            {post.authorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-zinc-900">
                {post.authorName}
              </span>
              {post.authorRole === 'college' ? (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold">
                  Faculty
                </span>
              ) : post.authorRole === 'admin' ? (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-sky-50 text-sky-800 border-sky-300 font-semibold">
                  Admin
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-zinc-100 text-zinc-600 border-zinc-200">
                  Student
                </span>
              )}
            </div>
            {post.authorDepartment && (
              <span className="text-xs text-zinc-500 font-mono">
                {post.authorDepartment}
              </span>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-6">
          <ForumMarkdownContent content={post.content} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded"
              >
                <Tag className="w-3 h-3 text-zinc-400" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpvotePost(post.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                post.userUpvoted
                  ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              <ChevronUp className={`w-4 h-4 ${post.userUpvoted ? 'text-sky-600 font-bold' : 'text-zinc-500'}`} />
              <span>{post.upvotesCount}</span>
              <span className="text-zinc-500 font-normal">Upvotes</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 font-medium">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span>{post.replies?.length || 0} Replies</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-zinc-500" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Discussion'}</span>
          </button>
        </div>
      </article>

      {/* Featured Official Faculty Answer Banner (If present) */}
      {officialReplies.length > 0 && (
        <section className="bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border-2 border-emerald-300 rounded-lg p-5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-3">
            <Award className="w-5 h-5 text-emerald-700" />
            <span>Official Faculty Answer Highlight ({officialReplies.length})</span>
          </div>

          <div className="space-y-3">
            {officialReplies.map((official) => (
              <div
                key={official.id}
                className="bg-white border border-emerald-200 rounded-md p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-950">
                      {official.authorName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-emerald-100 text-emerald-800 border-emerald-300 font-bold">
                      Verified Faculty
                    </span>
                    {official.authorDepartment && (
                      <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                        • {official.authorDepartment}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {formatDate(official.createdAt)}
                  </span>
                </div>
                <div className="text-sm">
                  <ForumMarkdownContent content={official.content} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Discussion & Nested Replies Section */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
              Discussion & Answers
            </h2>
            <span className="swiss-badge bg-zinc-100 text-zinc-700 border-zinc-200">
              {post.replies?.length || 0}
            </span>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Threaded Nested Replies
          </span>
        </div>

        {/* Top-Level Reply Composer */}
        <form onSubmit={handleTopLevelSubmit} className="mb-6 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-zinc-700 font-mono">
              Post response as <strong>{currentUser.name}</strong>:
            </label>
            {/* Quick Markdown Helpers */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setNewReplyContent((prev) => prev + '\n```c\n// Enter code\n```\n')}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                title="Insert code block"
              >
                <Code2 className="w-3 h-3 text-[#2563EB]" />
                <span>Code</span>
              </button>
              <button
                type="button"
                onClick={() => setNewReplyContent((prev) => prev + '**bold text**')}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                title="Insert bold text"
              >
                <Bold className="w-3 h-3 text-zinc-600" />
              </button>
              <button
                type="button"
                onClick={() => setNewReplyContent((prev) => prev + '\n- Item ')}
                className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                title="Insert bullet item"
              >
                <List className="w-3 h-3 text-zinc-600" />
              </button>
            </div>
          </div>
          <textarea
            rows={3}
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            placeholder="Share verified MAKAUT exam tips, code implementations (using ```), or solution..."
            className="w-full p-3 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            {isFacultyOrAdmin ? (
              <label className="flex items-center gap-2 text-xs font-semibold text-emerald-800 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <input
                  type="checkbox"
                  checked={markOfficial}
                  onChange={(e) => setMarkOfficial(e.target.checked)}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Attach "Official Faculty Answer" badge</span>
              </label>
            ) : (
              <div className="text-[11px] text-zinc-500 font-mono">
                Posting with Student permissions
              </div>
            )}

            <button
              type="submit"
              disabled={!newReplyContent.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white rounded-md text-xs font-medium hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Response</span>
            </button>
          </div>
        </form>

        {/* Nested Replies List */}
        {nestedReplies.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-lg border border-dashed border-zinc-200">
            <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-zinc-700">No responses yet</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Be the first to provide an answer or student insight on this question!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {nestedReplies.map((reply) => (
              <ForumReplyItem
                key={reply.id}
                reply={reply}
                postId={post.id}
                depth={0}
                currentUser={currentUser}
                onUpvoteReply={onUpvoteReply}
                onAddReply={onAddReply}
                onToggleOfficialAnswer={onToggleOfficialAnswer}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
