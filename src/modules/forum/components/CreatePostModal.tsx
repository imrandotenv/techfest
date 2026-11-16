'use client';

import React, { useState, useEffect } from 'react';
import { ForumCategory, FORUM_CATEGORIES, CustomUserRole } from '../types';
import { X, Plus, Sparkles, Tag, HelpCircle, Layers } from 'lucide-react';

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

export function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onSubmit,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumCategory>('Academic');
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
      .map((t) => t.trim())
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white border border-zinc-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Ask a Question
              </h2>
              <p className="text-xs text-zinc-500">
                Posting as <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 font-mono">
              Forum Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FORUM_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border text-left transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <div className="font-semibold">{cat.id}</div>
                  <div className={`text-[10px] truncate ${category === cat.id ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {cat.id === 'Academic' ? 'MAKAUT & Exams' : cat.id === 'TechFest' ? 'Hackathons' : cat.id === 'Placements' ? 'T&P Jobs' : cat.id === 'Campus Life' ? 'Transport/Clubs' : 'Wardens'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 font-mono">
              Question Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to prepare for PCC-CS301 CA2 data structures exam?"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
              required
            />
          </div>

          {/* Department / Subtitle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 font-mono">
              Department / Year / Designation
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. CSE • 3rd Sem or IT Faculty Mentor"
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
            />
          </div>

          {/* Detailed Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 font-mono">
              Detailed Question / Explanation *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide background, syllabus module or specific code doubt so professors and classmates can provide precise answers..."
              className="w-full p-3 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 font-mono">
              Subject Tags (Comma separated)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. PCC-CS301, CA2, Trees, Graph"
                className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
              />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-zinc-900 text-white rounded-md text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs"
            >
              Publish Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
