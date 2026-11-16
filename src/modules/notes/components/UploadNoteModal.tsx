'use client';

import React, { useState, useId } from 'react';
import { 
  X, 
  Upload, 
  AlertCircle, 
  GraduationCap 
} from 'lucide-react';
import { CustomUserRole, NoteCategory } from '@/types';
import { BranchCode, UploadNoteFormData } from '../types';
import { MAKAUT_SUBJECTS } from '../data/makaut-curriculum';

interface UploadNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadNoteFormData) => void;
  currentRole: CustomUserRole;
  uploaderName: string;
}

export function UploadNoteModal({
  isOpen,
  onClose,
  onSubmit,
  currentRole,
  uploaderName,
}: UploadNoteModalProps) {
  const branchId = useId();
  const semesterId = useId();
  const subjectId = useId();
  const categoryId = useId();
  const titleId = useId();
  const yearId = useId();

  const [departmentCode, setDepartmentCode] = useState<BranchCode>('CSE');
  const [semester, setSemester] = useState<number>(3);
  const [subjectCode, setSubjectCode] = useState<string>('PCC-CS301');
  const [subjectName, setSubjectName] = useState<string>('Data Structures & Algorithms');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<NoteCategory>('LECTURE_NOTE');
  const [academicYear, setAcademicYear] = useState<string>('2026-2027');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(3450000);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  // Filter subjects matching department and semester
  const availableSubjects = MAKAUT_SUBJECTS.filter(
    (s) =>
      (s.branch === 'ALL' || s.branch === departmentCode) &&
      s.semester === semester
  );

  const handleDepartmentChange = (dept: BranchCode) => {
    setDepartmentCode(dept);
    const firstMatching = MAKAUT_SUBJECTS.find(
      (s) => (s.branch === 'ALL' || s.branch === dept) && s.semester === semester
    );
    if (firstMatching) {
      setSubjectCode(firstMatching.code);
      setSubjectName(firstMatching.name);
    }
  };

  const handleSemesterChange = (sem: number) => {
    setSemester(sem);
    const firstMatching = MAKAUT_SUBJECTS.find(
      (s) => (s.branch === 'ALL' || s.branch === departmentCode) && s.semester === sem
    );
    if (firstMatching) {
      setSubjectCode(firstMatching.code);
      setSubjectName(firstMatching.name);
    }
  };

  const handleSubjectSelect = (code: string) => {
    setSubjectCode(code);
    const sub = availableSubjects.find((s) => s.code === code);
    if (sub) {
      setSubjectName(sub.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFileSize(file.size);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a descriptive title for this resource.');
      return;
    }
    if (!subjectCode.trim()) {
      setError('Please select or specify a MAKAUT subject code.');
      return;
    }

    onSubmit({
      title: title.trim(),
      subjectCode: subjectCode.trim(),
      subjectName: subjectName.trim(),
      departmentCode,
      semester,
      category,
      academicYear,
      fileSize,
      fileUrl: `/mock-files/${subjectCode.toLowerCase()}-${Date.now()}.pdf`,
    });

    onClose();
  };

  const isFacultyOrAdmin = currentRole === 'college' || currentRole === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Upload to MAKAUT Vault
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Submit lecture notes, solved PYQs, or lab manuals
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Role Status Notice */}
          <div
            className={`p-3 rounded-lg border flex items-start gap-2.5 ${
              isFacultyOrAdmin
                ? 'bg-sky-50/60 border-sky-200 text-sky-900'
                : 'bg-amber-50/60 border-amber-200 text-amber-900'
            }`}
          >
            {isFacultyOrAdmin ? (
              <GraduationCap className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <span className="font-semibold block">
                {isFacultyOrAdmin ? 'Faculty Direct Publication' : 'Student Submission Review'}
              </span>
              <p className="text-[11px] leading-relaxed">
                {isFacultyOrAdmin
                  ? `As verified ${currentRole === 'college' ? 'Faculty' : 'Admin'} (${uploaderName}), this resource will be immediately approved and signed.`
                  : 'Your resource will be placed in the pending queue and reviewed by SETGOI faculty before appearing publicly.'}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* Department and Semester */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={branchId} className="block text-zinc-700 font-medium mb-1">
                Branch / Department:
              </label>
              <select
                id={branchId}
                value={departmentCode}
                onChange={(e) => handleDepartmentChange(e.target.value as BranchCode)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md font-mono focus:outline-hidden focus:border-zinc-900"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics &amp; Comm (ECE)</option>
                <option value="EE">Electrical (EE)</option>
                <option value="ME">Mechanical (ME)</option>
                <option value="CE">Civil (CE)</option>
              </select>
            </div>

            <div>
              <label htmlFor={semesterId} className="block text-zinc-700 font-medium mb-1">
                Semester:
              </label>
              <select
                id={semesterId}
                value={semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md font-mono focus:outline-hidden focus:border-zinc-900"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Selector (Populated from MAKAUT curriculum) */}
          <div>
            <label htmlFor={subjectId} className="block text-zinc-700 font-medium mb-1">
              MAKAUT Subject Code &amp; Title:
            </label>
            <select
              id={subjectId}
              value={subjectCode}
              onChange={(e) => handleSubjectSelect(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md font-mono focus:outline-hidden focus:border-zinc-900"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor={titleId} className="block text-zinc-700 font-medium mb-1">
              Resource Title:
            </label>
            <input
              id={titleId}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 1 to 5 Comprehensive Notes with Formula Sheet"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md focus:outline-hidden focus:border-zinc-900 text-xs"
              required
            />
          </div>

          {/* Category & Academic Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={categoryId} className="block text-zinc-700 font-medium mb-1">
                Resource Category:
              </label>
              <select
                id={categoryId}
                value={category}
                onChange={(e) => setCategory(e.target.value as NoteCategory)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md font-mono focus:outline-hidden focus:border-zinc-900"
              >
                <option value="LECTURE_NOTE">Lecture Notes</option>
                <option value="MAKAUT_PYQ">MAKAUT Solved PYQ</option>
                <option value="LAB_MANUAL">Lab Manual</option>
                <option value="SYLLABUS_COPY">Syllabus Copy</option>
              </select>
            </div>

            <div>
              <label htmlFor={yearId} className="block text-zinc-700 font-medium mb-1">
                Academic Year:
              </label>
              <select
                id={yearId}
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md font-mono focus:outline-hidden focus:border-zinc-900"
              >
                <option value="2026-2027">2026-2027 (Current)</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>
          </div>

          {/* Simulated File Upload Zone */}
          <div>
            <span className="block text-zinc-700 font-medium mb-1">
              Document File (PDF / DOCX):
            </span>
            <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 bg-zinc-50/50 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors block">
              <Upload className="w-6 h-6 text-zinc-400 mb-1" />
              <span className="text-zinc-600 font-medium">
                {selectedFileName || 'Click to select or drop PDF file'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                Up to 25 MB • Encrypted SETGOI Vault Storage
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isFacultyOrAdmin ? 'Publish Resource' : 'Submit for Review'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
