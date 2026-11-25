'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import {
  ArrowLeft,
  Download,
  Printer,
  ImagePlus,
  Lock,
  Sparkles,
  BookOpen,
  PlayCircle,
  Calculator,
  GraduationCap,
  CheckCircle2,
  Mic,
  Compass,
} from 'lucide-react';
import { SetTechLogo } from '@/components/SetTechLogo';

export default function PosterStudioPage() {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  const [collegeLogoSrc, setCollegeLogoSrc] = useState<string>('/setgoi-logo.png');
  const [logoError, setLogoError] = useState<boolean>(false);

  const [landingPreviewSrc, setLandingPreviewSrc] = useState<string>('/poster/landing-preview.png');
  const [previewImgError, setPreviewImgError] = useState<boolean>(false);

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPng = async () => {
    if (!posterRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#FAFAFA',
        width: 794,
        height: 1123,
      });
      const link = document.createElement('a');
      link.download = 'SETTech-SETGOI-A4-Poster-300DPI.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export poster PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-200/70 print:bg-[#FAFAFA] py-6 px-4 print:p-0 flex flex-col items-center gap-6 print:gap-0">
      {/* =========================================================================
          NON-PRINTABLE CONTROL TOOLBAR
          ========================================================================= */}
      <div className="print:hidden w-full max-w-[920px] bg-white/90 backdrop-blur-md border border-[#E4E4E7] rounded-2xl px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
          <div>
            <div className="text-xs font-bold text-[#09090B] font-display">
              SETTech A4 Poster Studio
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              794 × 1123px • Swiss Minimalist Print Sheet
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleImageUpload(e, (url) => {
                setCollegeLogoSrc(url);
                setLogoError(false);
              })
            }
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E4E4E7] hover:bg-zinc-50 text-xs font-sans font-medium text-zinc-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ImagePlus className="w-3.5 h-3.5 text-zinc-500" />
            <span>Upload College Logo</span>
          </button>

          <input
            ref={screenshotInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleImageUpload(e, (url) => {
                setLandingPreviewSrc(url);
                setPreviewImgError(false);
              })
            }
          />
          <button
            type="button"
            onClick={() => screenshotInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E4E4E7] hover:bg-zinc-50 text-xs font-sans font-medium text-zinc-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ImagePlus className="w-3.5 h-3.5 text-zinc-500" />
            <span>Upload Landing Screenshot</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download High-Res PNG (300 DPI)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-3.5 py-1.5 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save A4 PDF</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          EXACT A4 PROPORTION POSTER CANVAS (794px × 1123px)
          ========================================================================= */}
      <div className="overflow-x-auto max-w-full pb-8 print:pb-0 print:overflow-visible">
        <div
          ref={posterRef}
          className="w-[794px] h-[1123px] print:w-[210mm] print:h-[297mm] bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] print:border-0 shadow-2xl print:shadow-none relative overflow-hidden flex flex-col justify-between p-10 select-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* -------------------------------------------------------------------
              SECTION 1: TOP INSTITUTIONAL CO-BRANDING HEADER
              ------------------------------------------------------------------- */}
          <header className="flex items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* SETGOI College Logo with Automatic Fallback Emblem */}
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs flex items-center justify-center overflow-hidden shrink-0 p-1">
                {!logoError ? (
                  <img
                    src={collegeLogoSrc}
                    alt="SETGOI Logo"
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-[#09090B] text-white flex flex-col items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                    <span className="text-[7px] font-mono font-bold tracking-wider mt-0.5">SETGOI</span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-[13px] font-display font-bold text-[#09090B] tracking-tight leading-snug">
                  Sanaka Educational Trust&apos;s Group of Institutions (SETGOI)
                </div>
                <div className="text-[10.5px] font-mono text-[#52525B] mt-0.5">
                  Malandighi, Durgapur • Affiliated to MAKAUT • Approved by AICTE
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <SetTechLogo variant="full" size={22} textClassName="text-base font-bold" />
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-[9.5px] font-bold tracking-wider uppercase">
                OFFICIAL B.TECH PORTAL
              </span>
            </div>
          </header>

          {/* -------------------------------------------------------------------
              SECTION 2: CRISP MINIMAL HERO HEADLINE
              ------------------------------------------------------------------- */}
          <section className="text-center space-y-2.5 pt-2">
            <h1 className="text-[34px] font-display font-extrabold text-[#09090B] tracking-[-0.035em] leading-[1.08] max-w-[660px] mx-auto">
              Your Entire B.Tech Semester,{' '}
              <span className="text-[#2563EB]">Organized in One Place.</span>
            </h1>
            <p className="text-[13.5px] font-sans text-[#52525B] max-w-[600px] mx-auto leading-relaxed">
              Verified MAKAUT notes, PYQs, SWAYAM lectures, AI Viva prep &amp; 75% attendance tracking.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              SECTION 3: CENTERPIECE SETTECH LANDING PAGE SHOWCASE
              ------------------------------------------------------------------- */}
          <section className="my-1">
            <div className="rounded-2xl border border-[#D4D4D8] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* macOS Browser Chrome */}
              <div className="h-9 px-4 bg-zinc-50 border-b border-[#E4E4E7] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                </div>

                <div className="px-4 py-1 rounded-lg bg-white border border-[#E4E4E7] text-[10.5px] font-mono text-zinc-600 flex items-center gap-1.5 shadow-2xs">
                  <Lock className="w-2.5 h-2.5 text-emerald-600" />
                  <span>https://settech.ceimran.in</span>
                </div>

                <div className="text-[10px] font-mono text-zinc-400">MAKAUT CBCS</div>
              </div>

              {/* Landing Page Screenshot OR Faithful High-Craft Architectural Composition */}
              <div className="w-full h-[435px] bg-[#FAFAFA] overflow-hidden relative">
                {!previewImgError ? (
                  <img
                    src={landingPreviewSrc}
                    alt="SETTech Landing Page Preview"
                    className="w-full h-full object-cover object-top"
                    onError={() => setPreviewImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full p-5 flex flex-col justify-between bg-[#FAFAFA]">
                    {/* Miniature Floating Pill Navbar */}
                    <div className="mx-auto w-[92%] h-10 bg-white/95 border border-[#E4E4E7] rounded-full px-4 flex items-center justify-between shadow-xs">
                      <SetTechLogo variant="full" size={16} textClassName="text-xs font-bold" />
                      <div className="flex items-center gap-4 text-[10px] font-sans text-zinc-600 font-medium">
                        <span className="text-[#09090B] font-semibold">Home</span>
                        <span>AI Viva</span>
                        <span>Lectures</span>
                        <span>Notes</span>
                        <span>Forum</span>
                        <span>Tools</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#09090B] text-white text-[9.5px] font-semibold">
                        Open Cockpit
                      </span>
                    </div>

                    {/* Miniature Hero + Live Bento Workspace Preview */}
                    <div className="grid grid-cols-12 gap-4 items-center px-3 my-auto">
                      <div className="col-span-6 space-y-2.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-[9px] font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                          MAKAUT B.TECH ACADEMIC SUITE
                        </div>
                        <div className="text-[22px] font-display font-extrabold text-[#09090B] leading-[1.1] tracking-tight">
                          Engineering Cockpit for <span className="text-[#2563EB]">SETGOI</span> Scholars.
                        </div>
                        <p className="text-[10.5px] text-[#52525B] leading-relaxed">
                          Access verified lecture notes, NPTEL courses, voice AI viva practice, and instant 10-point SGPA &amp; 75% attendance forecasting.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-[10px] font-semibold">
                            Explore Notes Vault →
                          </span>
                          <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E4E7] text-[#09090B] text-[10px] font-semibold">
                            Launch AI Viva
                          </span>
                        </div>
                      </div>

                      {/* Right Mini Bento Cards */}
                      <div className="col-span-6 grid grid-cols-2 gap-2.5">
                        <div className="col-span-2 bg-white border border-[#E4E4E7] rounded-xl p-3 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] font-mono font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded">
                              PCC-CS301 • VERIFIED
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div className="text-[11px] font-bold text-[#09090B]">
                            Data Structures &amp; Algorithms Complete Notes
                          </div>
                          <div className="text-[9.5px] font-mono text-zinc-500">
                            CSE Semester 3 • Faculty Stamped PDF
                          </div>
                        </div>

                        <div className="bg-white border border-[#E4E4E7] rounded-xl p-3 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between text-[9.5px] font-mono text-zinc-500">
                            <span>ATTENDANCE</span>
                            <span className="text-emerald-700 font-bold">SAFE</span>
                          </div>
                          <div className="text-lg font-mono font-bold text-emerald-700 tabular-nums">
                            82.4%
                          </div>
                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="w-[82%] h-full bg-emerald-600 rounded-full" />
                          </div>
                        </div>

                        <div className="bg-white border border-[#E4E4E7] rounded-xl p-3 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between text-[9.5px] font-mono text-zinc-500">
                            <span>AI VIVA</span>
                            <Mic className="w-3 h-3 text-purple-600" />
                          </div>
                          <div className="text-lg font-mono font-bold text-[#09090B] tabular-nums">
                            8.5 / 10
                          </div>
                          <div className="text-[9px] font-mono text-purple-700">
                            Groq Whisper Voice
                          </div>
                        </div>

                        <div className="col-span-2 bg-white border border-[#E4E4E7] rounded-xl p-2.5 shadow-2xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span className="text-[10px] font-semibold text-[#09090B]">
                              SETGOI 3D Campus Guide &amp; HOD Directory
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400">24/7 SOS</span>
                        </div>
                      </div>
                    </div>

                    {/* Subtle Bottom Bar */}
                    <div className="flex items-center justify-between px-3 pt-2 border-t border-zinc-200/70 text-[9.5px] font-mono text-zinc-400">
                      <span>CSE • ECE • EE • ME • CE</span>
                      <span>SEMESTERS 1 TO 8 • MAKAUT AFFILIATED</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------------
              SECTION 4: COMPACT 4-COLUMN MICRO-FEATURE STRIP
              ------------------------------------------------------------------- */}
          <section className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#2563EB]">01</span>
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="text-[12px] font-display font-bold text-[#09090B] leading-tight">
                Verified Notes &amp; PYQs
              </div>
              <div className="text-[10px] font-sans text-[#52525B]">
                MAKAUT Branch &amp; Sem Mapped
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#2563EB]">02</span>
                <PlayCircle className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="text-[12px] font-display font-bold text-[#09090B] leading-tight">
                SWAYAM &amp; NPTEL
              </div>
              <div className="text-[10px] font-sans text-[#52525B]">
                Curated Video Lectures
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#2563EB]">03</span>
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="text-[12px] font-display font-bold text-[#09090B] leading-tight">
                AI Viva Simulator
              </div>
              <div className="text-[10px] font-sans text-[#52525B]">
                Lab &amp; Theory Exam Prep
              </div>
            </div>

            <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#2563EB]">04</span>
                <Calculator className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="text-[12px] font-display font-bold text-[#09090B] leading-tight">
                SGPA, 75% &amp; 3D Map
              </div>
              <div className="text-[10px] font-sans text-[#52525B]">
                Calculators &amp; Campus Guide
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------------
              SECTION 5: BOTTOM REAL QR SCAN DOCK
              ------------------------------------------------------------------- */}
          <footer className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-xs flex items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2563EB]">
                FREE FOR ALL SETGOI B.TECH STUDENTS
              </div>
              <h2 className="text-[22px] font-display font-bold text-[#09090B] tracking-tight leading-tight">
                Scan to Access SETTech Instantly
              </h2>
              <p className="text-[12.5px] font-sans text-[#52525B]">
                Open Camera &rarr; Scan QR &rarr; Sign in with Google
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09090B] text-white font-mono text-xs font-semibold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  settech.ceimran.in
                </span>
              </div>
            </div>

            {/* Sharp White QR Frame with Corner Viewfinder Marks */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="relative p-3 bg-white border border-[#E4E4E7] rounded-xl shadow-2xs">
                {/* Corner Viewfinder Accents */}
                <span className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#09090B] rounded-tl" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-[#09090B] rounded-tr" />
                <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-[#09090B] rounded-bl" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#09090B] rounded-br" />

                <QRCodeSVG
                  value="https://settech.ceimran.in"
                  size={116}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#09090B"
                />
              </div>
              <span className="text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#09090B]">
                SCAN TO OPEN
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
