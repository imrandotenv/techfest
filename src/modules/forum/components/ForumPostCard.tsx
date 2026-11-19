'use client';

import React from 'react';
import { ForumPost } from '../types';
import { 
  Pin, 
  MessageSquare, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Tag
} from 'lucide-react';

interface ForumPostCardProps {
  post: ForumPost;
  onSelect: (postId: string) => void;
  onUpvote: (postId: string) => void;
  onSelectTag?: (tag: string) => void;
}

export function ForumPostCard({
  post,
  onSelect,
  onUpvote,
  onSelectTag,
}: ForumPostCardProps) {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-50 text-[#2563EB] border-blue-200';
      case 'TechFest':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Campus Life':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Placements':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Hostel':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'college':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold">
            Faculty
          </span>
        );
      case 'admin':
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-blue-50 text-[#2563EB] border-blue-300 font-semibold">
            Admin
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-slate-100 text-[#475569] border-[#E2E8F0]">
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
    <article className="w-full bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 hover:border-slate-300 hover:shadow-xs transition-all group flex gap-3 sm:gap-4 items-start">
      {/* Aligned Left Column: Upvote Control Widget */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpvote(post.id);
        }}
        className={`w-11 sm:w-14 flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer shrink-0 font-mono ${
          post.userUpvoted
            ? 'bg-blue-50 text-[#2563EB] border-blue-300 shadow-2xs font-bold'
            : 'bg-slate-50/80 text-[#475569] border-[#E2E8F0] hover:bg-slate-100 hover:text-[#0F172A] hover:border-slate-300'
        }`}
        title="Upvote discussion"
      >
        <ChevronUp className={`w-4 h-4 transition-transform ${post.userUpvoted ? 'text-[#2563EB] stroke-[3]' : 'text-[#475569]'}`} />
        <span className="text-xs sm:text-sm font-bold leading-none mt-1 text-[#0F172A]">
          {post.upvotesCount}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-[#475569]/80 mt-0.5 hidden sm:block">
          votes
        </span>
      </button>

      {/* Right Column: Aligned Content Grid */}
      <div className="flex-1 min-w-0">
        
        {/* Top Badges Row: Category, Pinned, Official, and Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {post.isPinned && (
              <span className="text-[11px] font-mono inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                <Pin className="w-3 h-3 fill-amber-700" />
                <span>Pinned Announcement</span>
              </span>
            )}

            <span className={`text-[11px] font-mono inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-medium ${getCategoryBadgeClass(post.category)}`}>
              {post.category}
            </span>

            {hasOfficial && (
              <span className="text-[11px] font-mono inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Official Faculty Answer</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#475569]/70 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Title & Preview */}
        <div className="mb-2.5">
          <h2
            onClick={() => onSelect(post.id)}
            className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors cursor-pointer leading-snug font-display"
          >
            {post.title}
          </h2>
          <p
            onClick={() => onSelect(post.id)}
            className="text-xs sm:text-sm text-[#475569] mt-1 line-clamp-2 cursor-pointer leading-relaxed font-sans"
          >
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTag?.(tag);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#475569] bg-slate-50 hover:bg-slate-100 hover:text-[#0F172A] border border-[#E2E8F0] px-2 py-0.5 rounded cursor-pointer transition-colors"
                title={`Filter by tag: ${tag}`}
              >
                <Tag className="w-2.5 h-2.5 text-[#475569]/60" />
                <span>{tag.startsWith('#') ? tag : `#${tag}`}</span>
              </button>
            ))}
          </div>
        )}

        {/* Bottom Bar: Replies & Author Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => onSelect(post.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#475569] bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 hover:text-[#0F172A] transition-colors cursor-pointer font-sans w-fit"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#475569]" />
            <span className="font-semibold text-[#0F172A]">{repliesCount}</span>
            <span className="text-[#475569]">
              {repliesCount === 1 ? 'Reply' : 'Replies'}
            </span>
          </button>

          {/* Author Credit */}
          <div className="flex items-center gap-2 text-xs text-[#475569]">
            <div className="w-5 h-5 rounded-full bg-slate-100 border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shrink-0 font-mono text-[10px] font-bold">
              {post.authorName.charAt(0)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-[#0F172A] font-sans">{post.authorName}</span>
              {getRoleBadge(post.authorRole)}
              {post.authorDepartment && (
                <span className="hidden md:inline text-[11px] text-[#475569]/70 font-mono">
                  • {post.authorDepartment}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
