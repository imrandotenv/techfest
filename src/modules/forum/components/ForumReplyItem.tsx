'use client';

import React, { useState } from 'react';
import { ForumReply, CustomUserRole } from '../types';
import { 
  CheckCircle2, 
  ChevronUp, 
  CornerDownRight, 
  ShieldCheck, 
  Send, 
  Clock, 
  User, 
  Award, 
  AlertCircle 
} from 'lucide-react';
import { ForumMarkdownContent } from './ForumMarkdownContent';

interface ForumReplyItemProps {
  reply: ForumReply;
  postId: string;
  depth?: number;
  currentUser: {
    id: string;
    name: string;
    role: CustomUserRole;
    department?: string;
  };
  onUpvoteReply: (postId: string, replyId: string) => void;
  onAddReply: (data: {
    postId: string;
    content: string;
    parentId: string;
    isOfficialAnswer?: boolean;
  }) => void;
  onToggleOfficialAnswer: (postId: string, replyId: string) => void;
}

export function ForumReplyItem({
  reply,
  postId,
  depth = 0,
  currentUser,
  onUpvoteReply,
  onAddReply,
  onToggleOfficialAnswer,
}: ForumReplyItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [markAsOfficial, setMarkAsOfficial] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const isFacultyOrAdmin = currentUser.role === 'college' || currentUser.role === 'admin';
  const hasChildren = reply.children && reply.children.length > 0;

  const handleVerifyClick = () => {
    if (!isFacultyOrAdmin) {
      setPermissionError('Only SETGOI Faculty or Admin roles are permitted to verify Official Faculty Answers.');
      setTimeout(() => setPermissionError(null), 4000);
      return;
    }
    setPermissionError(null);
    onToggleOfficialAnswer(postId, reply.id);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    onAddReply({
      postId,
      content: replyContent.trim(),
      parentId: reply.id,
      isOfficialAnswer: isFacultyOrAdmin && markAsOfficial,
    });

    setReplyContent('');
    setMarkAsOfficial(false);
    setIsReplying(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`relative ${depth > 0 ? 'mt-3 pl-3 sm:pl-5 border-l-2 border-zinc-200' : 'mt-4'}`}>
      <div
        className={`rounded-lg p-4 border transition-all ${
          reply.isOfficialAnswer
            ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200 shadow-xs'
            : 'bg-white border-zinc-200 shadow-xs'
        }`}
      >
        {/* Official Faculty Verification Banner */}
        {reply.isOfficialAnswer && (
          <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-md bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold">Verified Faculty Answer</span>
              {reply.verifiedBy && (
                <span className="text-emerald-800 font-normal">
                  • Pinned by {reply.verifiedBy}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top: Author, Role & Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border ${
                reply.authorRole === 'college'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : reply.authorRole === 'admin'
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
            >
              {reply.authorName.charAt(0)}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-zinc-900">
                {reply.authorName}
              </span>

              {reply.authorRole === 'college' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold">
                  Faculty
                </span>
              )}
              {reply.authorRole === 'admin' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-sky-50 text-sky-800 border-sky-300 font-semibold">
                  Admin
                </span>
              )}
              {reply.authorRole === 'student' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-zinc-100 text-zinc-600 border-zinc-200">
                  Student
                </span>
              )}

              {reply.authorDepartment && (
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  • {reply.authorDepartment}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
            <Clock className="w-3 h-3" />
            <span>{formatDate(reply.createdAt)}</span>
          </div>
        </div>

        {/* Reply Body Content */}
        <div className="mb-3">
          <ForumMarkdownContent content={reply.content} />
        </div>

        {/* Permission warning alert if student tries to verify */}
        {permissionError && (
          <div className="mb-3 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{permissionError}</span>
          </div>
        )}

        {/* Footer Actions: Upvote, Reply toggle, Official Answer Verification button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            {/* Upvote Button */}
            <button
              type="button"
              onClick={() => onUpvoteReply(postId, reply.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-medium transition-colors cursor-pointer ${
                reply.userUpvoted
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              <ChevronUp className={`w-3.5 h-3.5 ${reply.userUpvoted ? 'text-sky-600 font-bold' : 'text-zinc-500'}`} />
              <span>{reply.upvotesCount}</span>
            </button>

            {/* Nested Reply Trigger */}
            <button
              type="button"
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-zinc-500" />
              <span>{isReplying ? 'Cancel' : 'Reply'}</span>
            </button>
          </div>

          {/* Official Verification Toggle (Faculty & Admin privileged) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleVerifyClick}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                reply.isOfficialAnswer
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200/70'
                  : isFacultyOrAdmin
                  ? 'bg-white text-zinc-700 border-zinc-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50'
                  : 'bg-zinc-50 text-zinc-400 border-zinc-200 hover:border-zinc-300'
              }`}
              title={
                isFacultyOrAdmin
                  ? reply.isOfficialAnswer
                    ? 'Click to remove official verification'
                    : 'Verify as Official Faculty Answer'
                  : 'Requires College Faculty or Admin role to verify answers'
              }
            >
              <Award className={`w-3.5 h-3.5 ${reply.isOfficialAnswer ? 'text-emerald-700' : 'text-zinc-400'}`} />
              <span>
                {reply.isOfficialAnswer
                  ? 'Verified Faculty Answer'
                  : isFacultyOrAdmin
                  ? 'Mark as Official'
                  : 'Faculty Verification'}
              </span>
            </button>
          </div>
        </div>

        {/* Inline Nested Reply Form */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3 pt-3 border-t border-zinc-200/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1.5 font-mono">
              <CornerDownRight className="w-3 h-3" />
              <span>Replying to <strong>{reply.authorName}</strong> as <strong>{currentUser.name}</strong>:</span>
            </div>
            <textarea
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your constructive response or follow-up doubt..."
              className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white transition-all"
              autoFocus
            />

            <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
              {isFacultyOrAdmin ? (
                <label className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={markAsOfficial}
                    onChange={(e) => setMarkAsOfficial(e.target.checked)}
                    className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mark as Official Faculty Answer</span>
                </label>
              ) : (
                <span className="text-[11px] text-zinc-400 font-mono">
                  Posting as Student
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-2.5 py-1 text-xs text-zinc-600 hover:text-zinc-900 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white rounded text-xs font-medium hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Recursive Children Replies */}
      {hasChildren && (
        <div className="space-y-2">
          {reply.children!.map((childReply) => (
            <ForumReplyItem
              key={childReply.id}
              reply={childReply}
              postId={postId}
              depth={depth + 1}
              currentUser={currentUser}
              onUpvoteReply={onUpvoteReply}
              onAddReply={onAddReply}
              onToggleOfficialAnswer={onToggleOfficialAnswer}
            />
          ))}
        </div>
      )}
    </div>
  );
}
