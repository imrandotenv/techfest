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
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-blue-50 text-[#2563EB] border-blue-300 font-semibold">
            Admin
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-slate-100 text-[#475569] border-[#E2E8F0]">
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
    <article className="w-full bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition-all group">
      {/* Top Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {post.isPinned && (
            <span className="text-xs font-mono inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <Pin className="w-3 h-3 fill-amber-700" />
              <span>Pinned Announcement</span>
            </span>
          )}

          <span className={`text-xs font-mono inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(post.category)}`}>
            {post.category}
          </span>

          {hasOfficial && (
            <span className="text-xs font-mono inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
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
      <div className="mb-3">
        <h2
          onClick={() => onSelect(post.id)}
          className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors cursor-pointer leading-snug font-display"
        >
          {post.title}
        </h2>
        <p
          onClick={() => onSelect(post.id)}
          className="text-sm text-[#475569] mt-1 line-clamp-2 cursor-pointer leading-relaxed font-sans"
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
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#475569] bg-slate-50 border border-[#E2E8F0] px-2 py-0.5 rounded"
            >
              <Tag className="w-2.5 h-2.5 text-[#475569]/60" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Bar: Upvote, Replies, and Author */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(post.id);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer font-sans ${
              post.userUpvoted
                ? 'bg-blue-50 text-[#2563EB] border-blue-300 font-semibold'
                : 'bg-slate-50 text-[#475569] border-[#E2E8F0] hover:bg-slate-100 hover:text-[#0F172A]'
            }`}
            title="Upvote this discussion"
          >
            <ChevronUp className={`w-4 h-4 ${post.userUpvoted ? 'text-[#2563EB] font-bold' : 'text-[#475569]'}`} />
            <span>{post.upvotesCount}</span>
            <span className="hidden sm:inline text-[#475569] font-normal">Upvotes</span>
          </button>

          {/* Reply Count Button */}
          <button
            type="button"
            onClick={() => onSelect(post.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#475569] bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 hover:text-[#0F172A] transition-colors cursor-pointer font-sans"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#475569]" />
            <span>{repliesCount}</span>
            <span className="hidden sm:inline text-[#475569] font-normal">
              {repliesCount === 1 ? 'Reply' : 'Replies'}
            </span>
          </button>
        </div>

        {/* Author Credit */}
        <div className="flex items-center gap-2 text-xs text-[#475569]">
          <div className="w-6 h-6 rounded-full bg-slate-100 border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shrink-0 font-mono text-[10px] font-bold">
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
    </article>
  );
}
