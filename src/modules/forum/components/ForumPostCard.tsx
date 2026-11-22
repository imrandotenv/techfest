'use client';

import React from 'react';
import { ForumPost } from '../types';
import { 
  MessageSquare, 
  ChevronUp, 
  CheckCircle2, 
  Circle,
  Pin,
  Award
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
  const hasOfficial = post.hasOfficialAnswer || post.replies?.some((r) => r.isOfficialAnswer);
  const repliesCount = post.replies?.length || 0;
  const isSolved = repliesCount > 0;

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

  // Canonical category label
  const categoryLabel = (() => {
    switch (post.category) {
      case 'Academic':
      case 'Academics & Syllabus':
        return 'Academics';
      case 'TechFest':
      case 'Coding & DSA':
        return 'Coding & DSA';
      case 'Labs & Viva':
        return 'Labs & Viva';
      case 'Placements':
      case 'Placements & Internships':
        return 'Placements';
      case 'Engineering Campus':
      case 'Campus Life':
        return 'Engineering Campus';
      default:
        return post.category;
    }
  })();

  return (
    <article
      onClick={() => onSelect(post.id)}
      className="group flex items-center justify-between gap-3 px-4 py-3 hover:bg-blue-50/30 transition-colors cursor-pointer select-none"
    >
      {/* Left Column: Upvote Pill + Status Icon + Title & Meta */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Upvote Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(post.id);
          }}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono font-medium border transition-colors shrink-0 ${
            post.userUpvoted
              ? 'bg-blue-50 text-[#2563EB] border-blue-300 font-bold'
              : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100'
          }`}
          title="Upvote discussion"
        >
          <ChevronUp
            className={`w-3.5 h-3.5 ${
              post.userUpvoted ? 'text-[#2563EB] stroke-[3]' : 'text-zinc-500'
            }`}
          />
          <span>{post.upvotesCount}</span>
        </button>

        {/* Status Icon */}
        <div className="shrink-0">
          {hasOfficial ? (
            <div title="Faculty Verified Answer">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
          ) : isSolved ? (
            <div title="Solved / Has Community Replies">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          ) : (
            <div title="Open Discussion">
              <Circle className="w-3.5 h-3.5 text-zinc-300" />
            </div>
          )}
        </div>

        {/* Title, Category & Author Meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {post.isPinned && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0 font-medium">
                <Pin className="w-2.5 h-2.5 fill-amber-700" />
                <span>PIN</span>
              </span>
            )}
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-[#2563EB] transition-colors truncate">
              {post.title}
            </h3>
            {/* Max 1 Category Pill */}
            <span className="hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/80 shrink-0">
              {categoryLabel}
            </span>
          </div>

          {/* Sub-meta: Author mono badge, date */}
          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-zinc-500">
            <span className="text-zinc-700 font-medium truncate max-w-[120px] sm:max-w-none">
              {post.authorName}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/70 text-[10px] font-mono shrink-0">
              {post.authorDepartment || 'SETGOI B.Tech'}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-400 shrink-0">{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Replies Count Pill */}
      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 shrink-0 pl-2">
        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
        <span className="font-semibold text-zinc-700">{repliesCount}</span>
      </div>
    </article>
  );
}