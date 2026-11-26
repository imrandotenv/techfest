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
} from 'lucide-react';
import { SetTechLogo } from '@/components/SetTechLogo';

const BRANCHES = ['CSE', 'CSE-AIML', 'CSE-DS', 'ECE', 'EE', 'EEE', 'ME', 'CE'];

const PROOF_METRICS = [
  { value: '8 Branches', label: 'CSE, AIML, DS, ECE, EE, EEE, ME, CE' },
  { value: 'Sem 3–8', label: 'Complete MAKAUT CBCS Syllabus' },
  { value: '3 Workspaces', label: 'Student • Faculty • Admin RBAC' },
  { value: 'Zero Install', label: 'Instant Web & Mobile Access' },
];

function SetgoiCrestSvg() {
  return (
    <svg
      width="42"
      height="42"
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
      <path d="M22 10.5L29.5 14.2L22 17.8L14.5 14.2L22 10.5Z" fill="#2563EB" />
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

function FeatureCard({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-3 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 rounded">
            {num}
          </span>
        </div>
        <h3 className="text-[12px] font-display font-bold text-[#09090B] leading-snug tracking-tight">
          {title}
        </h3>
        <p className="text-[10.5px] font-sans text-[#52525B] leading-[1.42] mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default function PosterStudioPage() {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement | null>(null);

  const [format, setFormat] = useState<'a4' | 'social'>('a4');
  const [logoSrc, setLogoSrc] = useState<string>('');
  const [logoError, setLogoError] = useState<boolean>(true);

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
      {/* NON-PRINTABLE SINGLE-ROW CONTROL TOOLBAR */}
      <div className="print:hidden w-full max-w-[1080px] bg-white/95 backdrop-blur-md border border-[#E4E4E7] rounded-2xl px-3.5 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2 sticky top-4 z-40">
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
            <span>Landing Screenshot</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download High-Res PNG (300 DPI)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-3 py-1.5 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save A4 PDF</span>
          </button>
        </div>
      </div>

      {/* PRINT CSS */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background: #FAFAFA !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* =========================================================================
          FORMAT A: A4 EXHIBITION POSTER SHEET (794px × 1123px)
          ========================================================================= */}
      {format === 'a4' && (
        <div
          ref={posterRef}
          className="bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] print:border-0 shadow-[0_24px_60px_rgba(9,9,11,0.10)] print:shadow-none flex flex-col justify-between overflow-hidden relative"
          style={{
            width: '794px',
            height: '1123px',
            padding: '28px 30px 24px 30px',
          }}
        >
          {/* BAND 1 — Institutional Co-Branding Header */}
          <header className="flex items-center justify-between gap-4 pb-3 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-center p-1 shrink-0">
                {!logoError ? (
                  <img
                    src={logoSrc}
                    alt="SETGOI College Logo"
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <SetgoiCrestSvg />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-[13.5px] font-display font-bold text-[#09090B] leading-tight tracking-tight">
                  Sanaka Educational Trust&apos;s Group of Institutions (SETGOI)
                </h2>
                <p className="text-[10px] font-mono text-[#52525B] mt-0.5">
                  Malandighi, Durgapur • Affiliated to MAKAUT • Approved by AICTE
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <SetTechLogo variant="full" size={20} textClassName="text-sm font-bold" />
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 font-mono text-[9px] font-bold tracking-wider text-[#2563EB]">
                OFFICIAL B.TECH ACADEMIC PORTAL
              </span>
            </div>
          </header>

          {/* BAND 2 — Hero Title & 4-Column Institutional Proof Bar */}
          <section className="space-y-3 pt-2.5">
            <div className="text-center max-w-[680px] mx-auto space-y-1.5">
              <h1 className="text-[28px] font-display font-extrabold tracking-[-0.03em] leading-[1.08] text-[#09090B]">
                Your Entire B.Tech Semester, Organized in One Place.
              </h1>
              <p className="text-[12px] font-sans text-[#52525B] leading-[1.45]">
                A unified MAKAUT CBCS academic cockpit for verified study resources, AI Viva voice
                practice, attendance auditing, and faculty-verified campus updates.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PROOF_METRICS.map((m) => (
                <div
                  key={m.value}
                  className="bg-white border border-[#E4E4E7] rounded-xl px-2.5 py-2 text-center"
                >
                  <div className="text-[13px] font-display font-extrabold text-[#09090B]">
                    {m.value}
                  </div>
                  <div className="text-[9.5px] font-mono text-[#52525B] mt-0.5 leading-tight">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BAND 3 — 3-Column Centerpiece Showcase */}
          <section className="grid grid-cols-[1fr_1.45fr_1fr] gap-3 items-stretch my-2.5">
            {/* Left Column (Cards 01 & 02) */}
            <div className="flex flex-col gap-3">
              <FeatureCard
                num="01"
                title="MAKAUT Notes, PYQs & Labs"
                desc="Branch & semester-mapped module notes, solved 10-year PYQs, and step-by-step C/Python/Verilog lab manuals (PCC-CS301, ESC 301+)."
              />
              <FeatureCard
                num="02"
                title="AI Viva Voice Simulator"
                desc="Interactive technical viva examiner with Indian Neural Voice (English & Hindi), instant concept scoring, and zero-repeat questions."
              />
            </div>

            {/* Center Column (Focal Landing Page Showcase) */}
            <div className="flex flex-col justify-between bg-white border border-[#D4D4D8] rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(9,9,11,0.08)]">
              {/* macOS Browser Top Bar */}
              <div className="h-7 bg-[#F4F4F5] border-b border-[#E4E4E7] px-2.5 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-300" />
                  <span className="w-2 h-2 rounded-full bg-zinc-300" />
                  <span className="w-2 h-2 rounded-full bg-zinc-300" />
                </div>
                <div className="flex items-center gap-1 bg-white border border-[#E4E4E7] rounded px-2 py-0.5 text-[9px] font-mono text-[#09090B]">
                  <Lock className="w-2.5 h-2.5 text-emerald-600" />
                  <span>https://settech.ceimran.in</span>
                </div>
                <span className="text-[8.5px] font-mono font-bold text-[#2563EB] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                  MAKAUT CBCS
                </span>
              </div>

              {/* Clean Scrollbar-Free Preview Image */}
              <div className="relative flex-1 bg-[#FAFAFA] overflow-hidden">
                {!previewImgError ? (
                  <img
                    src={landingPreviewSrc}
                    alt="SETTech Live Student Cockpit Preview"
                    className="w-full h-full object-cover object-top"
                    onError={() => setPreviewImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <Sparkles className="w-6 h-6 text-[#2563EB] mb-1" />
                    <span className="text-xs font-bold text-[#09090B]">
                      SETTech Academic Portal
                    </span>
                  </div>
                )}
              </div>

              {/* Crisp Bottom Caption Bar */}
              <div className="bg-[#09090B] text-white px-3 py-1.5 text-center font-mono text-[9.5px] font-semibold tracking-tight shrink-0">
                Live Student Cockpit • Search Any Subject Code Instantly
              </div>
            </div>

            {/* Right Column (Cards 03 & 04) */}
            <div className="flex flex-col gap-3">
              <FeatureCard
                num="03"
                title="75% Attendance & SGPA Suite"
                desc="Real-time safe-bunk calculator synced to dashboard + 1-click MAKAUT 10-point CBCS SGPA/CGPA estimator."
              />
              <FeatureCard
                num="04"
                title="3D Campus & Faculty Forum"
                desc="Interactive 3D SETGOI campus block explorer + peer Q&A forum with top-pinned Verified Faculty Answers."
              />
            </div>
          </section>

          {/* BAND 4 — Secondary 2-Column Capabilities + All 8 Branches Strip */}
          <section className="space-y-2.5">
            <div className="grid grid-cols-2 gap-3">
              <FeatureCard
                num="05"
                title="Curated SWAYAM & NPTEL Video Hub"
                desc="Syllabus-aligned video playlists mapped directly to every MAKAUT theory paper for fast exam revision."
              />
              <FeatureCard
                num="06"
                title="Faculty-Verified Notices & Exam Alerts"
                desc="Branch- and semester-targeted CA schedules, lab viva notices, and priority updates published directly by SETGOI faculty."
              />
            </div>

            {/* Supported Branches Pill Bar */}
            <div className="bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2 flex items-center justify-between gap-2">
              <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-[#52525B] shrink-0">
                OFFERED B.TECH DISCIPLINES:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {BRANCHES.map((b) => (
                  <span
                    key={b}
                    className="px-2 py-0.5 rounded-md bg-[#FAFAFA] border border-[#E4E4E7] font-mono text-[10px] font-bold text-[#09090B]"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* BAND 5 — Bottom Scannable QR Dock & Institutional Footer */}
          <footer className="space-y-2 pt-2.5">
            <div className="bg-white border border-zinc-200 rounded-xl px-5 py-3.5 flex items-center justify-between gap-5">
              <div className="space-y-1.5">
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-widest text-[#2563EB] block">
                  EXPERIENCE SETTECH LIVE ON YOUR PHONE
                </span>
                <h3 className="text-[19px] font-display font-extrabold text-[#09090B] leading-tight tracking-tight">
                  Scan QR to Open the Portal
                </h3>
                <p className="text-[10.5px] font-mono text-[#52525B]">
                  1. Open Phone Camera &nbsp;→&nbsp; 2. Scan QR Code &nbsp;→&nbsp; 3. Sign in with Google
                </p>
                <div className="pt-0.5">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#09090B] text-white font-mono text-[11px] font-semibold">
                    https://settech.ceimran.in
                  </span>
                </div>
              </div>

              {/* QR Code with Viewfinder Corner Crop Marks */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative p-2.5 bg-white">
                  <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#09090B]" />
                  <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#09090B]" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#09090B]" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#09090B]" />
                  <QRCodeSVG
                    value="https://settech.ceimran.in"
                    size={104}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#09090B"
                  />
                </div>
                <span className="font-mono text-[9px] font-bold tracking-widest text-[#09090B] mt-1">
                  SCAN TO OPEN
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9.5px] font-mono text-[#52525B] px-1">
              <span>Sanaka Educational Trust&apos;s Group of Institutions • Malandighi, Durgapur</span>
              <span>Engineered by Dept. of CSE • Free for All SETGOI Students</span>
            </div>
          </footer>
        </div>
      )}

      {/* =========================================================================
          FORMAT B: WHATSAPP SHARE CARD (1080px × 1080px)
          ========================================================================= */}
      {format === 'social' && (
        <div
          ref={posterRef}
          className="bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] shadow-[0_24px_60px_rgba(9,9,11,0.10)] flex flex-col justify-between overflow-hidden"
          style={{
            width: '1080px',
            height: '1080px',
            padding: '44px 48px',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E4E4E7] flex items-center justify-center p-1.5">
                {!logoError ? (
                  <img
                    src={logoSrc}
                    alt="SETGOI College Logo"
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <SetgoiCrestSvg />
                )}
              </div>
              <div>
                <div className="text-lg font-display font-bold text-[#09090B]">
                  Sanaka Educational Trust&apos;s Group of Institutions (SETGOI)
                </div>
                <div className="text-xs font-mono text-[#52525B]">
                  Malandighi, Durgapur • Affiliated to MAKAUT • Approved by AICTE
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <SetTechLogo variant="full" size={26} textClassName="text-lg font-bold" />
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 font-mono text-[10px] font-bold text-[#2563EB]">
                OFFICIAL B.TECH ACADEMIC PORTAL
              </span>
            </div>
          </div>

          {/* Headline + 4-Metric Strip */}
          <div className="space-y-4">
            <h1 className="text-[42px] font-display font-extrabold tracking-tight leading-[1.08] text-[#09090B]">
              Your Entire B.Tech Semester, Organized in One Place.
            </h1>
            <div className="grid grid-cols-4 gap-3">
              {PROOF_METRICS.map((m) => (
                <div
                  key={m.value}
                  className="bg-white border border-[#E4E4E7] rounded-2xl p-3.5 text-center"
                >
                  <div className="text-lg font-display font-extrabold text-[#09090B]">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-mono text-[#52525B] mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Highlights + Browser Preview */}
          <div className="grid grid-cols-12 gap-5 items-stretch flex-1 my-5">
            <div className="col-span-5 flex flex-col justify-between gap-3">
              <FeatureCard
                num="01"
                title="MAKAUT Notes, PYQs & Labs"
                desc="Module notes, solved 10-year PYQs, and C/Python/Verilog lab manuals."
              />
              <FeatureCard
                num="02"
                title="AI Viva Voice Simulator"
                desc="Indian Neural Voice examiner (EN/HI) with zero-repeat questions."
              />
              <FeatureCard
                num="03"
                title="75% Attendance & SGPA Suite"
                desc="Safe-bunk calculator + MAKAUT 10-point CBCS SGPA/CGPA estimator."
              />
            </div>

            <div className="col-span-7 bg-white border border-[#D4D4D8] rounded-2xl overflow-hidden flex flex-col shadow-md">
              <div className="h-8 bg-[#F4F4F5] border-b border-[#E4E4E7] px-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                </div>
                <span className="text-[11px] font-mono text-[#09090B]">
                  https://settech.ceimran.in
                </span>
                <span className="text-[10px] font-mono font-bold text-[#2563EB]">MAKAUT</span>
              </div>
              <div className="flex-1 overflow-hidden bg-[#FAFAFA]">
                {!previewImgError && (
                  <img
                    src={landingPreviewSrc}
                    alt="SETTech Preview"
                    className="w-full h-full object-cover object-top"
                    onError={() => setPreviewImgError(true)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bottom QR Dock */}
          <div className="bg-white border border-zinc-200 rounded-2xl px-7 py-5 flex items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB] block">
                EXPERIENCE SETTECH LIVE ON YOUR PHONE
              </span>
              <h3 className="text-2xl font-display font-extrabold text-[#09090B]">
                Scan QR to Open the Portal
              </h3>
              <p className="text-xs font-mono text-[#52525B]">
                1. Open Phone Camera → 2. Scan QR Code → 3. Sign in with Google
              </p>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#09090B] text-white font-mono text-sm font-semibold">
                https://settech.ceimran.in
              </span>
            </div>
            <div className="flex flex-col items-center shrink-0">
              <QRCodeSVG
                value="https://settech.ceimran.in"
                size={120}
                level="H"
                bgColor="#FFFFFF"
                fgColor="#09090B"
              />
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#09090B] mt-1.5">
                SCAN TO OPEN
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
