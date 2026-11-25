'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { SYLLABUS_BRANCHES, SyllabusBranch, SubjectType } from '@/lib/makaut-syllabus';

interface SyllabusRow {
  id: string;
  code: string;
  name: string;
  branch: string;
  semester: number;
  credits: number;
  category: string;
  type: SubjectType;
  isActive: boolean;
}

export function AdminSyllabusManager() {
  const [branch, setBranch] = useState<SyllabusBranch>('CSE');
  const [semester, setSemester] = useState<number>(3);
  const [subjects, setSubjects] = useState<SyllabusRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('3');
  const [category, setCategory] = useState('PCC');
  const [type, setType] = useState<SubjectType>('THEORY');

  const [toast, setToast] = useState<{ text: string; isError?: boolean } | null>(null);

  const showToast = (text: string, isError = false) => {
    setToast({ text, isError });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/syllabus?branch=${encodeURIComponent(branch)}&semester=${semester}&includeInactive=true`
      );
      if (res.ok) {
        const data = await res.json();
        setSubjects(data.subjects || []);
      }
    } finally {
      setLoading(false);
    }
  }, [branch, semester]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const resetForm = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setCredits('3');
    setCategory('PCC');
    setType('THEORY');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    setSaving(true);
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch('/api/syllabus', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          code,
          name,
          branch,
          semester,
          credits: parseFloat(credits) || 0,
          category,
          type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save subject');

      showToast(editingId ? 'Subject updated in live syllabus!' : 'Subject added to live syllabus!');
      resetForm();
      fetchSubjects();
    } catch (err: any) {
      showToast(err?.message || 'Error saving subject', true);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (row: SyllabusRow) => {
    try {
      const res = await fetch('/api/syllabus', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id, isActive: !row.isActive }),
      });
      if (res.ok) {
        showToast(row.isActive ? `Hidden ${row.code} from student pickers.` : `Activated ${row.code}.`);
        fetchSubjects();
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/syllabus?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Subject removed from syllabus.');
        fetchSubjects();
      }
    } catch {}
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            toast.isError
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {toast.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1">Branch:</span>
          {SYLLABUS_BRANCHES.map((b) => (
            <button
              key={b.code}
              type="button"
              onClick={() => {
                setBranch(b.code);
                resetForm();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border cursor-pointer ${
                branch === b.code
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {b.code}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1">Sem:</span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSemester(s);
                resetForm();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border cursor-pointer tabular-nums ${
                semester === s
                  ? 'bg-[#09090B] text-white border-[#09090B]'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Add / Edit Subject Form */}
        <div className="lg:col-span-4 bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-4 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-[#09090B] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span>{editingId ? 'Edit Paper / Elective' : 'Add Subject / Elective / Lab'}</span>
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1 cursor-pointer">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 mb-1">MAKAUT Paper Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PCC-CS391 or PEC-CS701E"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-500 mb-1">Subject Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Data Structure & Algorithms Lab"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as SubjectType)}
                  className="w-full px-2 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                >
                  <option value="THEORY">THEORY</option>
                  <option value="LAB">LAB</option>
                  <option value="SESSIONAL">SESSIONAL</option>
                  <option value="ELECTIVE">ELECTIVE</option>
                  <option value="MANDATORY">MANDATORY</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono"
                >
                  <option value="PCC">PCC</option>
                  <option value="ESC">ESC</option>
                  <option value="BS">BS</option>
                  <option value="HSMC">HSMC</option>
                  <option value="PEC">PEC</option>
                  <option value="OEC">OEC</option>
                  <option value="MC">MC</option>
                  <option value="PROJ">PROJ</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">Credits</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-zinc-50 border border-[#E4E4E7] text-xs font-mono tabular-nums"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : editingId ? 'Update Subject' : `Add to ${branch} Sem ${semester}`}</span>
            </button>
          </form>
        </div>

        {/* Live Subject Table */}
        <div className="lg:col-span-8 bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-sm font-bold text-[#09090B]">
                {branch} • Semester {semester} Syllabus ({subjects.length} papers)
              </h2>
              <p className="text-xs text-zinc-500">
                Live in Neon DB — edits update /notes, /lectures, and /viva immediately.
              </p>
            </div>
            <button onClick={fetchSubjects} className="p-1.5 rounded-lg border border-zinc-200 cursor-pointer">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[11px] font-mono text-zinc-500 uppercase">
                  <th className="py-2 px-2">Code</th>
                  <th className="py-2 px-2">Subject Title</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Credits</th>
                  <th className="py-2 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {subjects.map((sub) => (
                  <tr key={sub.id} className={!sub.isActive ? 'opacity-50 bg-zinc-50' : 'hover:bg-zinc-50/70'}>
                    <td className="py-2.5 px-2 font-mono font-bold text-[#2563EB] whitespace-nowrap">
                      {sub.code}
                    </td>
                    <td className="py-2.5 px-2 font-sans font-medium text-[#09090B]">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                          sub.type === 'LAB'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : sub.type === 'ELECTIVE'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-[#2563EB] border-blue-200'
                        }`}
                      >
                        {sub.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono tabular-nums text-zinc-600">
                      {sub.credits}
                    </td>
                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(sub)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                          title={sub.isActive ? 'Hide from students' : 'Show to students'}
                        >
                          {sub.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(sub.id);
                            setCode(sub.code);
                            setName(sub.name);
                            setCredits(String(sub.credits));
                            setCategory(sub.category);
                            setType(sub.type);
                          }}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 cursor-pointer"
                          title="Edit subject"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                          title="Delete subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
