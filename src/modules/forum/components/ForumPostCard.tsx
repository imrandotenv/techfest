'use client';

import React from 'react';
import { ForumPost } from '../types';
import { 
  Pin, 
  MessageSquare, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  User, 
  Tag
} from 'lucide-react';

interface ForumPostCardProps {
  post: ForumPost;
  onSelect: (postId: string) => void;
  onUpvote: (postId: string) => void;
}

export function ForumPostCard({
  post,
  onSelect,
  onUpvote,
}: ForumPostCardProps) {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'TechFest':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Campus Life':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Placements':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hostel':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'college':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold">
            Faculty
          </span>
        );
      case 'admin':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-sky-50 text-sky-700 border-sky-300 font-semibold">
            Admin
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-zinc-100 text-zinc-600 border-zinc-200">
            Student
          </span>
        );
    }
  };

  const hasOfficial = post.hasOfficialAnswer || post.replies.some((r) => r.isOfficialAnswer);
  const repliesCount = post.replies.length;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className="w-full bg-white border border-zinc-200 rounded-lg p-5 hover:border-zinc-300 transition-all shadow-xs group">
      {/* Top Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {post.isPinned && (
            <span className="swiss-badge bg-amber-50 text-amber-800 border-amber-200">
              <Pin className="w-3 h-3 fill-amber-700" />
              <span>Pinned Announcement</span>
            </span>
          )}

          <span className={`swiss-badge border ${getCategoryBadgeClass(post.category)}`}>
            {post.category}
          </span>

          {hasOfficial && (
            <span className="swiss-badge bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Official Faculty Answer</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {/* Title & Preview */}
      <div className="mb-3">
        <h2
          onClick={() => onSelect(post.id)}
          className="text-base sm:text-lg font-semibold text-zinc-900 group-hover:text-sky-600 transition-colors cursor-pointer leading-snug"
        >
          {post.title}
        </h2>
        <p
          onClick={() => onSelect(post.id)}
          className="text-sm text-zinc-600 mt-1 line-clamp-2 cursor-pointer leading-relaxed"
        >
          {post.content}
        </p>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded"
            >
              <Tag className="w-2.5 h-2.5 text-zinc-400" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Bar: Upvote, Replies, and Author */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100">
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(post.id);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
              post.userUpvoted
                ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
            title="Upvote this discussion"
          >
            <ChevronUp className={`w-4 h-4 ${post.userUpvoted ? 'text-sky-600 font-bold' : 'text-zinc-500'}`} />
            <span>{post.upvotesCount}</span>
            <span className="hidden sm:inline text-zinc-500 font-normal">Upvotes</span>
          </button>

          {/* Reply Count Button */}
          <button
            type="button"
            onClick={() => onSelect(post.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
            <span>{repliesCount}</span>
            <span className="hidden sm:inline text-zinc-500 font-normal">
              {repliesCount === 1 ? 'Reply' : 'Replies'}
            </span>
          </button>
        </div>

        {/* Author Credit */}
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0 font-mono text-[10px] font-bold">
            {post.authorName.charAt(0)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-800">{post.authorName}</span>
            {getRoleBadge(post.authorRole)}
            {post.authorDepartment && (
              <span className="hidden md:inline text-[11px] text-zinc-400">
                • {post.authorDepartment}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
