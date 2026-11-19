'use client';

import React from 'react';
import { ForumPost } from '../types';
import { 
  MessageSquare, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Pin 
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
}: ForumPostCardProps) {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-50 text-[#2563EB] border-blue-200/60';
      case 'TechFest':
      case 'Coding & Tech':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'Campus Life':
      case 'Campus':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Placements':
        return 'bg-amber-50 text-amber-800 border-amber-200/60';
      case 'Hostel':
        return 'bg-rose-50 text-rose-700 border-rose-200/60';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200';
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
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article
      onClick={() => onSelect(post.id)}
      className="w-full bg-white border border-[#E4E4E7] hover:border-[#2563EB]/40 rounded-2xl p-4 sm:p-5 hover:shadow-xs transition-all group flex gap-3.5 sm:gap-4 items-start cursor-pointer"
    >
      {/* Left Column: Minimal Upvote Pill */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpvote(post.id);
        }}
        className={`w-11 sm:w-12 flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer shrink-0 font-mono ${
          post.userUpvoted
            ? 'bg-blue-50 text-[#2563EB] border-blue-300 shadow-2xs font-bold'
            : 'bg-zinc-50 text-[#09090B] border-[#E4E4E7] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50/40'
        }`}
        title="Upvote discussion"
      >
        <ChevronUp
          className={`w-4 h-4 transition-transform ${
            post.userUpvoted ? 'text-[#2563EB] stroke-[3]' : 'text-[#52525B]'
          }`}
        />
        <span className="text-xs sm:text-sm font-bold leading-none mt-1 text-[#09090B]">
          {post.upvotesCount}
        </span>
      </button>

      {/* Right Column: Clean Content */}
      <div className="flex-1 min-w-0">
        {/* Top Row: Max 2 small tags (1 Category pill + optional green Verified checkmark) + Date */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {post.isPinned && (
              <span className="text-[10px] font-mono inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                <Pin className="w-2.5 h-2.5 fill-amber-700" />
                <span>Pinned</span>
              </span>
            )}

            {/* Tag 1: Category Pill */}
            <span
              className={`text-[11px] font-mono inline-flex items-center px-2.5 py-0.5 rounded-full border font-medium ${getCategoryBadgeClass(
                post.category
              )}`}
            >
              {post.category}
            </span>

            {/* Tag 2: Optional Green Verified Checkmark */}
            {hasOfficial && (
              <span className="text-[11px] font-mono inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#52525B] font-mono shrink-0">
            <Clock className="w-3 h-3 text-[#52525B]/70" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Title & 1-Line Preview */}
        <div className="mb-3">
          <h2 className="text-base font-bold text-[#09090B] group-hover:text-[#2563EB] transition-colors leading-snug font-display line-clamp-1">
            {post.title}
          </h2>
          <p className="text-xs text-[#52525B] mt-1 line-clamp-1 leading-relaxed font-sans">
            {post.content}
          </p>
        </div>

        {/* Bottom Bar: Replies Count & Simple Author */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#E4E4E7] text-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#52525B]">
            <MessageSquare className="w-3.5 h-3.5 text-[#52525B]/70" />
            <span className="font-semibold text-[#09090B]">{repliesCount}</span>
            <span>{repliesCount === 1 ? 'reply' : 'replies'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#52525B]">
            <div className="w-4 h-4 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] font-mono text-[9px] font-bold">
              {post.authorName.charAt(0)}
            </div>
            <span className="font-medium text-[#09090B] font-sans truncate max-w-[140px]">
              {post.authorName}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
