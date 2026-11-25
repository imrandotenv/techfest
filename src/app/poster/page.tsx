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
  CheckCircle2,
  Mic,
  Compass,
} from 'lucide-react';
import { SetTechLogo } from '@/components/SetTechLogo';

function SetgoiCrestSvg() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SETGOI Institutional Crest"
    >
      <path
        d="M22 3L38 9V21.5C38 31.1 31.2 38.4 22 41C12.8 38.4 6 31.1 6 21.5V9L22 3Z"
        fill="#09090B"
      />
      <path
        d="M22 5.8L35.2 10.8V21.4C35.2 29.4 29.6 35.6 22 38C14.4 35.6 8.8 29.4 8.8 21.4V10.8L22 5.8Z"
        stroke="#2563EB"
        strokeWidth="1.4"
      />
      <path
        d="M22 10.5L29.5 14.2L22 17.8L14.5 14.2L22 10.5Z"
        fill="#2563EB"
      />
      <path
        d="M17.2 16.4V20.2C17.2 21.5 19.3 22.6 22 22.6C24.7 22.6 26.8 21.5 26.8 20.2V16.4"
        stroke="#FAFAFA"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <text
        x="22"
        y="31.5"
        textAnchor="middle"
        fill="#FAFAFA"
        fontSize="7.2"
        fontWeight="800"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        letterSpacing="0.8"
      >
        SETGOI
      </text>
    </svg>
  );
}

export default function PosterStudioPage() {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  const [format, setFormat] = useState<'a4' | 'social'>('a4');
  const [logoSrc, setLogoSrc] = useState<string>('/setgoi-logo.png');
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
      const targetWidth = format === 'social' ? 1080 : 794;
      const targetHeight = format === 'social' ? 1080 : 1123;
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#FAFAFA',
        width: targetWidth,
        height: targetHeight,
      });
      const link = document.createElement('a');
      link.download =
        format === 'social'
          ? 'SETTech-SETGOI-WhatsApp-Card-1080x1080.png'
          : 'SETTech-SETGOI-A4-Poster-300DPI.png';
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
      <div className="print:hidden w-full max-w-[1080px] bg-white/90 backdrop-blur-md border border-[#E4E4E7] rounded-2xl px-3.5 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2 sticky top-4 z-40">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-[#09090B] font-display leading-tight">
              SETTech Poster Studio
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              {format === 'social' ? '1080 × 1080 • 1:1 Card' : '794 × 1123 • A4 Print'}
            </div>
          </div>

          {/* Format Switcher Segmented Toggle */}
          <div
            className="flex items-center gap-0.5 p-0.5 bg-zinc-100 border border-[#E4E4E7] rounded-xl text-[11px] font-mono ml-1"
            role="group"
            aria-label="Poster Format Switcher"
          >
            <button
              type="button"
              onClick={() => setFormat('a4')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                format === 'a4'
                  ? 'bg-white text-[#09090B] font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              A4 Print Poster
            </button>
            <button
              type="button"
              onClick={() => setFormat('social')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                format === 'social'
                  ? 'bg-white text-[#2563EB] font-bold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              WhatsApp Share Card
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleImageUpload(e, (url) => {
                setLogoSrc(url);
                setLogoError(false);
              })
            }
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E4E4E7] hover:bg-zinc-50 text-xs font-sans font-medium text-zinc-700 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ImagePlus className="w-3.5 h-3.5 text-zinc-500" />
            <span>College Logo</span>
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
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E4E4E7] hover:bg-zinc-50 text-xs font-sans font-medium text-zinc-700 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ImagePlus className="w-3.5 h-3.5 text-zinc-500" />
            <span>Screenshot</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-3 py-1.5 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print A4 PDF</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          EXACT A4 PROPORTION POSTER CANVAS (794px × 1123px)
          ========================================================================= */}
      <div className="overflow-x-auto max-w-full pb-8 print:pb-0 print:overflow-visible">
        <div
          ref={posterRef}
          className={`${
            format === 'social'
              ? 'w-[1080px] h-[1080px] p-11'
              : 'w-[794px] h-[1123px] p-10'
          } print:w-[210mm] print:h-[297mm] bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] print:border-0 shadow-2xl print:shadow-none relative overflow-hidden flex flex-col justify-between select-none`}
          style={{
            backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* -------------------------------------------------------------------
              SECTION 1: TOP INSTITUTIONAL CO-BRANDING HEADER
              ------------------------------------------------------------------- */}
          <header className="flex items-center justify-between gap-4 pb-5 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* SETGOI College Logo with Automatic SVG Crest Fallback */}
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                {!logoError && logoSrc ? (
                  <img
                    src={logoSrc}
                    alt="SETGOI Logo"
                    className="w-full h-full object-contain rounded-lg"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <SetgoiCrestSvg />
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
          <section className="text-center space-y-2 pt-1">
            <h1 className="text-[33px] font-display font-extrabold text-[#09090B] tracking-[-0.035em] leading-[1.1] max-w-[660px] mx-auto">
              <span className="block">Your Entire B.Tech Semester,</span>
              <span className="block text-[#2563EB]">Organized in One Place.</span>
            </h1>
            <p className="text-[13px] font-sans text-[#52525B] max-w-[600px] mx-auto leading-relaxed">
              Verified MAKAUT notes, PYQs, SWAYAM lectures, AI Viva prep &amp; 75% attendance tracking.
            </p>
          </section>

          {/* -------------------------------------------------------------------
              SECTION 3: CENTERPIECE SETTECH LANDING PAGE SHOWCASE
              ------------------------------------------------------------------- */}
          <section className="my-0.5">
            <div className="rounded-2xl border border-[#D4D4D8] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* macOS Browser Chrome */}
              <div className="h-8 px-4 bg-zinc-50 border-b border-[#E4E4E7] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                </div>

                <div className="px-4 py-0.5 rounded-lg bg-white border border-[#E4E4E7] text-[10.5px] font-mono text-zinc-600 flex items-center gap-1.5 shadow-2xs">
                  <Lock className="w-2.5 h-2.5 text-emerald-600" />
                  <span>https://settech.ceimran.in</span>
                </div>

                <div className="text-[10px] font-mono text-zinc-400">MAKAUT CBCS</div>
              </div>

              {/* Landing Page Screenshot OR Faithful High-Craft Architectural Composition */}
              <div
                className={`w-full ${
                  format === 'social' ? 'h-[365px]' : 'h-[410px] max-h-[455px]'
                } bg-[#FAFAFA] overflow-hidden relative`}
              >
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
          <footer className="space-y-3">
            <div className="bg-white border border-[#E4E4E7] rounded-2xl px-6 py-5 shadow-xs flex items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2563EB]">
                  FREE FOR ALL SETGOI B.TECH STUDENTS
                </div>
                <h2 className="text-[22px] font-display font-bold text-[#09090B] tracking-tight leading-tight">
                  Scan to Access SETTech Instantly
                </h2>
                <p className="text-[12.5px] font-sans text-[#52525B]">
                  Open Camera &rarr; Scan QR &rarr; Sign in with Google
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09090B] text-white font-mono text-xs font-semibold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    settech.ceimran.in
                  </span>
                </div>
              </div>

              {/* Sharp White QR Frame with Corner Viewfinder Marks */}
              <div className="flex flex-col items-center gap-2.5 shrink-0">
                <div className="relative p-3.5 bg-white border border-[#E4E4E7] rounded-xl shadow-2xs">
                  {/* Corner Viewfinder Accents */}
                  <span className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#09090B] rounded-tl" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-[#09090B] rounded-tr" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-[#09090B] rounded-bl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#09090B] rounded-br" />

                  <QRCodeSVG
                    value="https://settech.ceimran.in"
                    size={112}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#09090B"
                  />
                </div>
                <span className="text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#09090B]">
                  SCAN TO OPEN
                </span>
              </div>
            </div>

            {/* Sleek Bottom Micro-Footer Bar */}
            <div className="flex items-center justify-between px-1 pt-1 text-[10px] font-mono text-[#52525B]">
              <span>Sanaka Educational Trust&apos;s Group of Institutions • Malandighi, Durgapur</span>
              <span className="text-[#09090B] font-semibold">Built for SETGOI Engineers • Free Access</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
