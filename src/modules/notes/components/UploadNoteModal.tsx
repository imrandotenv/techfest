'use client';

import React, { useState, useEffect, useId } from 'react';
import { 
  X, 
  Upload, 
  AlertCircle, 
  GraduationCap,
  FileCheck2
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
  defaultBranch?: BranchCode;
  defaultSemester?: number;
}

export function UploadNoteModal({
  isOpen,
  onClose,
  onSubmit,
  currentRole,
  uploaderName,
  defaultBranch,
  defaultSemester,
}: UploadNoteModalProps) {
  const branchId = useId();
  const semesterId = useId();
  const subjectId = useId();
  const categoryId = useId();
  const titleId = useId();
  const yearId = useId();

  const [departmentCode, setDepartmentCode] = useState<BranchCode>(() => defaultBranch || 'CSE');
  const [semester, setSemester] = useState<number>(() => defaultSemester || 3);
  const [subjectCode, setSubjectCode] = useState<string>('PCC-CS301');
  const [subjectName, setSubjectName] = useState<string>('Data Structures & Algorithms');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<NoteCategory>('LECTURE_NOTE');
  const [academicYear, setAcademicYear] = useState<string>('2026-2027');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<number>(3450000);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Sync with default props whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const targetBranch = defaultBranch || 'CSE';
      const targetSem = defaultSemester || 3;
      setDepartmentCode(targetBranch);
      setSemester(targetSem);
      const firstMatching = MAKAUT_SUBJECTS.find(
        (s) => (s.branch === 'ALL' || s.branch === targetBranch) && s.semester === targetSem
      );
      if (firstMatching) {
        setSubjectCode(firstMatching.code);
        setSubjectName(firstMatching.name);
      }
    }
  }, [isOpen, defaultBranch, defaultSemester]);

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
      setFileObject(file);
      setSelectedFileName(file.name);
      setFileSize(file.size);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileObject(file);
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
      file: fileObject,
      fileSize,
      fileUrl: `/mock-files/${subjectCode.toLowerCase()}-${Date.now()}.pdf`,
    });

    onClose();
  };

  const isFacultyOrAdmin = currentRole === 'college' || currentRole === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70">
          <div>
            <h2 id="upload-modal-title" className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight font-display">
              Upload to MAKAUT Vault
            </h2>
            <p className="text-xs text-[#475569] mt-0.5">
              Submit lecture notes, solved PYQs, cheat sheets, or lab manuals
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          
          {/* Role Status Notice */}
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isFacultyOrAdmin
                ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}
          >
            {isFacultyOrAdmin ? (
              <GraduationCap className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <span className="font-semibold block font-sans">
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
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Department and Semester */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={branchId} className="block text-[#0F172A] font-medium mb-1 font-sans">
                Branch / Department:
              </label>
              <select
                id={branchId}
                value={departmentCode}
                onChange={(e) => handleDepartmentChange(e.target.value as BranchCode)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 shadow-2xs"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics &amp; Comm (ECE)</option>
                <option value="EE">Electrical (EE)</option>
                <option value="ME">Mechanical (ME)</option>
                <option value="CE">Civil (CE)</option>
              </select>
            </div>

            <div>
              <label htmlFor={semesterId} className="block text-[#0F172A] font-medium mb-1 font-sans">
                Semester:
              </label>
              <select
                id={semesterId}
                value={semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 shadow-2xs"
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
            <label htmlFor={subjectId} className="block text-[#0F172A] font-medium mb-1 font-sans">
              MAKAUT Subject Code &amp; Title:
            </label>
            <select
              id={subjectId}
              value={subjectCode}
              onChange={(e) => handleSubjectSelect(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 shadow-2xs"
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
            <label htmlFor={titleId} className="block text-[#0F172A] font-medium mb-1 font-sans">
              Resource Title:
            </label>
            <input
              id={titleId}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 1 to 5 Comprehensive Notes with Formula Sheet"
              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] placeholder:text-[#475569]/60 focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 transition-colors shadow-2xs"
              required
            />
          </div>

          {/* Category & Academic Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={categoryId} className="block text-[#0F172A] font-medium mb-1 font-sans">
                Resource Category:
              </label>
              <select
                id={categoryId}
                value={category}
                onChange={(e) => setCategory(e.target.value as NoteCategory)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 shadow-2xs"
              >
                <option value="LECTURE_NOTE">Lecture Notes</option>
                <option value="MAKAUT_PYQ">MAKAUT Solved PYQ</option>
                <option value="LAB_MANUAL">Lab Manual</option>
                <option value="CHEAT_SHEET">Cheat Sheet / Formula Guide</option>
                <option value="SYLLABUS_COPY">Syllabus Copy</option>
              </select>
            </div>

            <div>
              <label htmlFor={yearId} className="block text-[#0F172A] font-medium mb-1 font-sans">
                Academic Year:
              </label>
              <select
                id={yearId}
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#0F172A] focus:outline-hidden focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]/10 shadow-2xs"
              >
                <option value="2026-2027">2026-2027 (Current)</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>
          </div>

          {/* PDF File Dropzone */}
          <div>
            <span className="block text-[#0F172A] font-medium mb-1 font-sans">
              Document File (PDF / DOCX):
            </span>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all block text-center ${
                isDragging
                  ? 'border-[#0F172A] bg-slate-100'
                  : 'border-[#E2E8F0] hover:border-slate-400 bg-slate-50/60'
              }`}
            >
              {selectedFileName ? (
                <FileCheck2 className="w-7 h-7 text-emerald-600 mb-1.5" />
              ) : (
                <Upload className="w-7 h-7 text-[#475569] mb-1.5" />
              )}
              <span className="text-[#0F172A] font-medium block">
                {selectedFileName || 'Click to browse or drop PDF file here'}
              </span>
              <span className="text-[11px] text-[#475569] font-mono mt-0.5 block">
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
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition-colors font-medium text-xs font-sans cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm font-sans cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-white" />
              <span>{isFacultyOrAdmin ? 'Publish Resource' : 'Submit for Review'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
