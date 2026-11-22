'use client';

import React, { useState, useEffect } from 'react';
import { ForumCategory, FORUM_CATEGORIES, CustomUserRole } from '../types';
import { X, Plus, Tag, Send, AlertCircle } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    role: CustomUserRole;
    department?: string;
  };
  onSubmit: (post: {
    title: string;
    content: string;
    category: ForumCategory;
    tags: string[];
    department: string;
  }) => void;
}

const SUGGESTED_TAGS = ['PCC-CS301', 'MAKAUT', 'TechFest2026', 'Placements', 'CA2', 'BTechLabs'];

export function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onSubmit,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumCategory>('Academics & Syllabus');
  const [department, setDepartment] = useState('CSE • 3rd Sem');
  const [tagInput, setTagInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 8) {
      setErrorMessage('Please provide a specific title (at least 8 characters).');
      return;
    }
    if (!content.trim() || content.trim().length < 15) {
      setErrorMessage('Please describe your question or topic in more detail (at least 15 characters).');
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      department: department.trim() || (currentUser.role === 'student' ? 'SETGOI Student' : 'SETGOI Faculty'),
    });

    // Reset
    setTitle('');
    setContent('');
    setCategory('Academic');
    setTagInput('');
    setErrorMessage(null);
    onClose();
  };

  const addSuggestedTag = (tag: string) => {
    const existing = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (!existing.includes(tag)) {
      setTagInput([...existing, tag].join(', '));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E2E8F0] animate-in slide-in-from-right duration-250 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 id="create-post-title" className="text-base sm:text-lg font-bold text-[#0F172A] font-display">
                Ask a Question
              </h2>
              <p className="text-xs text-[#475569] font-mono">
                Posting as <strong className="text-[#0F172A]">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Close composer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 font-sans">
              Forum Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FORUM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-2xs'
                      : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300 hover:text-[#0F172A]'
                  }`}
                >
                  <div className="font-semibold">{cat.id}</div>
                  <div className={`text-[10px] truncate ${category === cat.id ? 'text-slate-300' : 'text-[#475569]/70'}`}>
                    {cat.id === 'Academic' ? 'MAKAUT & Exams' : cat.id === 'TechFest' ? 'Hackathons' : cat.id === 'Placements' ? 'T&P Jobs' : cat.id === 'Campus Life' ? 'Transport/Clubs' : 'Wardens'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 font-sans">
              Question Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to prepare for PCC-CS301 CA2 data structures exam?"
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 transition-colors shadow-2xs font-sans"
              required
            />
          </div>

          {/* Department / Designation */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 font-sans">
              Department / Year / Designation
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. CSE • 3rd Sem or IT Faculty Mentor"
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 transition-colors shadow-2xs font-sans"
            />
          </div>

          {/* Detailed Question Content */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 font-sans">
              Detailed Question / Explanation <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide background, syllabus module or specific doubt so professors and classmates can provide precise answers..."
              className="w-full p-3 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 transition-colors shadow-2xs font-sans leading-relaxed"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#0F172A] font-sans">
                Subject Tags (Comma separated)
              </label>
              <span className="text-[11px] font-mono text-[#475569]/70">
                e.g. PCC-CS301, CA2
              </span>
            </div>
            <div className="relative">
              <Tag className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="PCC-CS301, CA2, Trees, Graph"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 transition-colors shadow-2xs font-sans"
              />
            </div>

            {/* Quick Tag Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] font-mono text-[#475569] uppercase">
                Suggest:
              </span>
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addSuggestedTag(tag)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[#475569] hover:text-[#0F172A] text-[11px] font-mono transition-colors cursor-pointer"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Drawer Footer */}
          <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#E4E4E7] text-[#52525B] hover:text-[#09090B] hover:bg-zinc-50 transition-colors text-xs font-medium cursor-pointer font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#2563EB] text-white hover:bg-blue-700 transition-colors text-xs font-medium inline-flex items-center gap-1.5 shadow-xs cursor-pointer font-sans"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
