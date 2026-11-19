'use client';

import React from 'react';
import Link from 'next/link';
import { X, Lock, ArrowRight, ShieldCheck, FileUp, MessageSquare } from 'lucide-react';

export type AuthPromptReason = 'upload_notes' | 'verify_notes' | 'create_forum_post' | 'reply_forum';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: AuthPromptReason;
}

const REASON_CONFIGS: Record<
  AuthPromptReason,
  {
    icon: React.ElementType;
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    roleNote?: string;
  }
> = {
  upload_notes: {
    icon: FileUp,
    badge: 'Notes Vault Access',
    title: 'Sign In to Upload Lecture Notes & PYQs',
    description:
      'Join thousands of SETGOI students and faculty sharing verified syllabus notes, laboratory manuals, and solved MAKAUT past papers.',
    ctaText: 'Sign In to Upload',
    roleNote: 'All students & faculty can contribute. Files undergo verification.',
  },
  verify_notes: {
    icon: ShieldCheck,
    badge: 'Faculty & Admin Only',
    title: 'Faculty / Admin Verification Privileges Required',
    description:
      'Approving or rejecting pending syllabus uploads is restricted to SETGOI faculty members and institutional administrators.',
    ctaText: 'Sign In with Faculty Account',
    roleNote: 'Switch your role to Faculty or Admin in onboarding if you are an educator.',
  },
  create_forum_post: {
    icon: MessageSquare,
    badge: 'Campus Discussion Portal',
    title: 'Sign In to Start a Discussion',
    description:
      'Connect with peers and professors across SETGOI. Post academic queries, discuss TechFest hackathons, and exchange campus insights.',
    ctaText: 'Sign In to Start Post',
    roleNote: 'Authenticated posts display your verified student or faculty badge.',
  },
  reply_forum: {
    icon: MessageSquare,
    badge: 'Official Answer Desk',
    title: 'Sign In to Reply to this Discussion',
    description:
      'Contribute your solution or academic perspective to this discussion thread.',
    ctaText: 'Sign In to Reply',
    roleNote: 'Faculty responses receive an Official Faculty Solution highlight.',
  },
};

export function AuthPromptModal({ isOpen, onClose, reason }: AuthPromptModalProps) {
  if (!isOpen) return null;

  const config = REASON_CONFIGS[reason];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl p-6 sm:p-7 overflow-hidden space-y-5 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold tracking-wider">
            <Lock className="w-3 h-3" />
            <span>{config.badge}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            aria-label="Close auth dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
            <Icon className="w-6 h-6 text-[#2563EB]" />
          </div>

          <h3 className="text-lg font-bold text-[#0F172A] font-display tracking-tight">
            {config.title}
          </h3>

          <p className="text-xs text-[#475569] leading-relaxed font-sans">
            {config.description}
          </p>

          {config.roleNote && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-[11px] font-mono text-[#475569]">
              ℹ️ {config.roleNote}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-mono font-medium transition-colors shadow-2xs"
          >
            <span>{config.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-mono text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
