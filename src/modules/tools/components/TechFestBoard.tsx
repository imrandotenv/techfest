'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Download, 
  Share2, 
  Check, 
  QrCode,
  Flame,
  Award
} from 'lucide-react';
import { TECHFEST_EVENTS } from '@/lib/seed-data';
import { TechFestEvent } from '../types';

interface StoredPass {
  passId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  department: string;
  semester: string;
  rollNumber: string;
  teamName?: string;
  registeredAt: string;
}

export function TechFestBoard() {
  const [events, setEvents] = useState<TechFestEvent[]>(TECHFEST_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<TechFestEvent | null>(null);
  const [myPasses, setMyPasses] = useState<StoredPass[]>([]);
  const [viewingPass, setViewingPass] = useState<StoredPass | null>(null);
  const [showPassesDrawer, setShowPassesDrawer] = useState<boolean>(false);
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    phone: '',
    department: 'CSE',
    semester: '3rd Semester',
    rollNumber: '',
    teamName: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load registered passes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sanakahub_techfest_registrations');
      if (stored) {
        setMyPasses(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for TechFest passes');
    }
  }, []);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'all') return true;
    return ev.category === selectedCategory;
  });

  // Open registration modal
  const handleOpenRegister = (ev: TechFestEvent) => {
    setActiveModalEvent(ev);
    setFormErrors({});
  };

  // Form input change
  const handleInputChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Submit registration
  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalEvent) return;

    const errors: Record<string, string> = {};
    if (!formData.studentName.trim()) errors.studentName = 'Full name is required';
    if (!formData.studentEmail.trim()) {
      errors.studentEmail = 'Email address is required';
    } else if (!formData.studentEmail.includes('@')) {
      errors.studentEmail = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Contact number is required';
    }
    if (!formData.rollNumber.trim()) {
      errors.rollNumber = 'University Roll or Registration Number is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const passId = `SETGOI-TF26-${formData.department}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPass: StoredPass = {
      passId,
      eventId: activeModalEvent.id,
      eventTitle: activeModalEvent.title,
      eventDate: activeModalEvent.dateString,
      venue: activeModalEvent.venue,
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      phone: formData.phone,
      department: formData.department,
      semester: formData.semester,
      rollNumber: formData.rollNumber,
      teamName: formData.teamName || undefined,
      registeredAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    const updatedPasses = [newPass, ...myPasses];
    setMyPasses(updatedPasses);
    try {
      localStorage.setItem('sanakahub_techfest_registrations', JSON.stringify(updatedPasses));
    } catch (e) {
      console.warn('Unable to persist pass to localStorage');
    }

    setIsSubmitting(false);
    setActiveModalEvent(null);
    setViewingPass(newPass);
  };

  const copyPassId = (passId: string) => {
    navigator.clipboard.writeText(passId);
    setCopiedPassId(passId);
    setTimeout(() => setCopiedPassId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-sky-400 text-xs font-mono font-semibold border border-white/10 mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            SETGOI ANNUAL FESTIVAL 2026
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            TechFest & Cultural Fiesta 2026
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
            The flagship campus convention for engineering innovation, coding sprints, robotics arena, and multi-disciplinary cultural celebrations. Free entry for SETGOI students with registered digital pass.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPassesDrawer(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <Ticket className="w-4 h-4" />
              My Registered Passes ({myPasses.length})
            </button>
            <span className="text-xs text-zinc-400 font-mono">
              Venue: SETGOI Campus, Durgapur
            </span>
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setSelectedCategory('technical')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedCategory === 'technical'
                ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Technical & Hackathons
          </button>
          <button
            onClick={() => setSelectedCategory('cultural')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedCategory === 'cultural'
                ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Cultural & Music
          </button>
          <button
            onClick={() => setSelectedCategory('workshop')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              selectedCategory === 'workshop'
                ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Workshops & Bootcamps
          </button>
        </div>

        <button
          onClick={() => setShowPassesDrawer(true)}
          className="text-xs text-[#2563EB] hover:text-blue-700 font-semibold inline-flex items-center gap-1"
        >
          <Ticket className="w-3.5 h-3.5" />
          View Stored Passes ({myPasses.length})
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((ev) => {
          const isRegistered = myPasses.some((p) => p.eventId === ev.id);
          return (
            <div
              key={ev.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 flex flex-col justify-between shadow-sm hover:border-zinc-300 transition-all group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      ev.category === 'technical'
                        ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                        : ev.category === 'cultural'
                        ? 'bg-pink-50 text-pink-700 border border-pink-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ev.category}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    {ev.dateString}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-zinc-900 mt-3 group-hover:text-[#2563EB] transition-colors">
                  {ev.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-2 line-clamp-3 leading-relaxed">
                  {ev.description}
                </p>

                {/* Metadata */}
                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span className="truncate">{ev.coordinators.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                {isRegistered ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Registered Pass
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                    ● Registration Open
                  </span>
                )}

                <button
                  onClick={() => {
                    if (isRegistered) {
                      const pass = myPasses.find((p) => p.eventId === ev.id);
                      if (pass) setViewingPass(pass);
                    } else {
                      handleOpenRegister(ev);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                    isRegistered
                      ? 'border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                      : 'bg-[#2563EB] hover:bg-blue-700 text-white'
                  }`}
                >
                  {isRegistered ? 'View Pass Ticket' : 'Register Pass'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* REGISTRATION MODAL */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <p className="text-[11px] font-mono uppercase text-[#2563EB] font-bold">
                  TechFest 2026 Registration
                </p>
                <h3 className="text-base font-bold text-zinc-900 mt-0.5">
                  {activeModalEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRegistration} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Imran Ahmad"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                    formErrors.studentName
                      ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                      : 'border-zinc-200 focus:ring-sky-500'
                  }`}
                />
                {formErrors.studentName && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.studentName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    SETGOI / College Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="student@setgoi.ac.in"
                    value={formData.studentEmail}
                    onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      formErrors.studentEmail
                        ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                        : 'border-zinc-200 focus:ring-sky-500'
                    }`}
                  />
                  {formErrors.studentEmail && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.studentEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      formErrors.phone
                        ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                        : 'border-zinc-200 focus:ring-sky-500'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                  >
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="ECE">ECE (Electronics & Comm)</option>
                    <option value="EE">EE (Electrical Engg)</option>
                    <option value="ME">ME (Mechanical Engg)</option>
                    <option value="CE">CE (Civil Engg)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={`Semester ${s}`}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    University Roll / Reg No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12000123045"
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      formErrors.rollNumber
                        ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                        : 'border-zinc-200 focus:ring-sky-500'
                    }`}
                  />
                  {formErrors.rollNumber && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.rollNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1">
                    Team Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Binary Beasts"
                    value={formData.teamName}
                    onChange={(e) => handleInputChange('teamName', e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalEvent(null)}
                  className="px-3.5 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold transition-colors shadow-sm"
                >
                  Confirm & Issue Pass Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DIGITAL PASS TICKET MODAL */}
      {viewingPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Top Pass Header */}
            <div className="bg-zinc-900 text-white p-5 relative">
              <button
                onClick={() => setViewingPass(null)}
                className="absolute right-4 top-4 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center text-white font-mono font-bold text-xs">
                  SH
                </span>
                <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest">
                  Official SETGOI Event Pass
                </span>
              </div>

              <h3 className="text-lg font-extrabold tracking-tight mt-2 text-white">
                {viewingPass.eventTitle}
              </h3>

              <div className="mt-2 flex items-center justify-between text-xs font-mono text-sky-400">
                <span>Pass ID: {viewingPass.passId}</span>
                <button
                  onClick={() => copyPassId(viewingPass.passId)}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white"
                >
                  {copiedPassId === viewingPass.passId ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                  {copiedPassId === viewingPass.passId ? 'Copied' : 'Copy ID'}
                </button>
              </div>
            </div>

            {/* Pass Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-100">
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">Attendee Name</p>
                  <p className="font-bold text-zinc-900 mt-0.5">{viewingPass.studentName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">Department</p>
                  <p className="font-bold text-zinc-900 mt-0.5">
                    {viewingPass.department} ({viewingPass.semester})
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">Date & Schedule</p>
                  <p className="font-semibold text-zinc-800 mt-0.5">{viewingPass.eventDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase">Venue</p>
                  <p className="font-semibold text-zinc-800 mt-0.5 truncate">{viewingPass.venue}</p>
                </div>
              </div>

              {/* Barcode & Verification Stub */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    CONFIRMED ENTRANCE
                  </span>
                  <p className="text-[10px] font-mono text-zinc-500">
                    Roll: {viewingPass.rollNumber}
                  </p>
                  {viewingPass.teamName && (
                    <p className="text-[10px] font-mono text-sky-700 font-semibold">
                      Team: {viewingPass.teamName}
                    </p>
                  )}
                </div>

                <div className="w-14 h-14 bg-white border border-zinc-300 rounded flex flex-col items-center justify-center p-1 text-zinc-800">
                  <QrCode className="w-9 h-9" />
                  <span className="text-[8px] font-mono uppercase text-zinc-400">VERIFY</span>
                </div>
              </div>

              <p className="text-[10px] text-zinc-400 text-center">
                Present this digital pass or student ID card at the SETGOI Main Auditorium registration desk.
              </p>

              <button
                onClick={() => setViewingPass(null)}
                className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MY REGISTERED PASSES DRAWER / MODAL */}
      {showPassesDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-bold text-zinc-900">
                  My Registered TechFest Passes ({myPasses.length})
                </h3>
              </div>
              <button
                onClick={() => setShowPassesDrawer(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {myPasses.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  You haven't registered for any events yet. Click 'Register Pass' on any card to generate your ticket!
                </div>
              ) : (
                myPasses.map((p) => (
                  <div
                    key={p.passId}
                    className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-sky-700 font-bold bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                        {p.passId}
                      </span>
                      <h4 className="font-bold text-zinc-900 mt-1">{p.eventTitle}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                        {p.eventDate} • {p.venue}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowPassesDrawer(false);
                        setViewingPass(p);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors shrink-0"
                    >
                      View Ticket
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-zinc-100 text-right">
              <button
                onClick={() => setShowPassesDrawer(false)}
                className="px-4 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
