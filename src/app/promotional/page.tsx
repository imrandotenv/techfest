'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Play,
  Pause,
  Repeat,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Lock,
  CheckCircle2,
  Mic,
  BookOpen,
  FlaskConical,
  Search,
  Award,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import { SetTechLogo } from '@/components/SetTechLogo';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const SCENES = [
  {
    id: 0,
    label: 'Hook',
    startSec: 0,
    endSec: 6,
    voiceover:
      'Stop digging through scattered WhatsApp notes and confusing MAKAUT syllabi. Meet SETTech, one unified B.Tech cockpit for SETGOI.',
  },
  {
    id: 1,
    label: '8 Branches',
    startSec: 6,
    endSec: 14,
    voiceover:
      'Search any subject code like PCC-CS301 instantly, across all eight SETGOI engineering branches from semester three to eight.',
  },
  {
    id: 2,
    label: 'Notes & Labs',
    startSec: 14,
    endSec: 22,
    voiceover:
      'Theory notes, solved ten-year PYQs, and step-by-step lab manuals live cleanly separated, verified, with zero broken links.',
  },
  {
    id: 3,
    label: 'AI Viva',
    startSec: 22,
    endSec: 30,
    voiceover:
      'Practice real technical vivas with our Indian Neural Voice examiner, live concept scoring, and zero-repeat questions.',
  },
  {
    id: 4,
    label: 'Cockpit & RBAC',
    startSec: 30,
    endSec: 38,
    voiceover:
      'Track your 75 percent attendance buffer, compute MAKAUT SGPA, and get faculty-verified answers and targeted notices.',
  },
  {
    id: 5,
    label: 'Launch',
    startSec: 38,
    endSec: 45,
    voiceover:
      'SETTech, built for SETGOI engineers. Scan the QR code to try it live on your phone.',
  },
];

const TOTAL_DURATION = 45;

const BRANCHES = ['CSE', 'CSE-AIML', 'CSE-DS', 'ECE', 'EE', 'EEE', 'ME', 'CE'];

export default function PromotionalShowcasePage() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenSceneRef = useRef<number>(-1);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [elapsed, setElapsed] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [autoLoop, setAutoLoop] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const activeSceneIndex = Math.min(
    SCENES.length - 1,
    SCENES.findIndex((s) => elapsed >= s.startSec && elapsed < s.endSec) !== -1
      ? SCENES.findIndex((s) => elapsed >= s.startSec && elapsed < s.endSec)
      : SCENES.length - 1
  );

  const sceneLocalSec = Math.max(0, elapsed - SCENES[activeSceneIndex].startSec);

  // 60fps requestAnimationFrame timeline clock
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setElapsed((prev) => {
        const next = prev + dt;
        if (next >= TOTAL_DURATION) {
          if (autoLoop) return 0;
          setIsPlaying(false);
          return TOTAL_DURATION;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, autoLoop]);

  // Auto-hide controls after 3s of mouse inactivity
  const bumpControls = useCallback(() => {
    setControlsVisible(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    bumpControls();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [bumpControls]);

  // Optional AI Voiceover narration via /api/tts (en-IN-NeerjaExpressiveNeural)
  useEffect(() => {
    if (!voiceEnabled || !isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      lastSpokenSceneRef.current = -1;
      return;
    }

    if (lastSpokenSceneRef.current === activeSceneIndex) return;
    lastSpokenSceneRef.current = activeSceneIndex;

    const text = SCENES[activeSceneIndex].voiceover;
    let cancelled = false;

    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language: 'en',
        voiceGender: 'female',
      }),
    })
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (cancelled || !blob) return;
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play().catch(() => {});
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [activeSceneIndex, voiceEnabled, isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const jumpToScene = (idx: number) => {
    lastSpokenSceneRef.current = -1;
    setElapsed(SCENES[idx].startSec + 0.05);
    setIsPlaying(true);
    bumpControls();
  };

  return (
    <div
      ref={stageRef}
      onMouseMove={bumpControls}
      onClick={bumpControls}
      className="relative w-screen h-screen overflow-hidden bg-[#FAFAFA] text-[#09090B] select-none flex flex-col justify-center items-center"
    >
      {/* Subtle Architectural Dot Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#D4D4D8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Subtle Brand Pill */}
      <div
        className={`absolute top-5 left-6 right-6 z-30 flex items-center justify-between transition-opacity duration-500 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-[#E4E4E7] text-xs font-mono text-zinc-600 hover:text-[#09090B] shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portal</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E4E4E7] font-mono text-[11px] text-zinc-600 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          <span>SETTech Commercial Reel • {Math.floor(elapsed)}s / 45s</span>
        </div>
      </div>

      {/* =====================================================================
          MAIN WIDESCREEN STAGE (6 CHOREOGRAPHED SCENES)
         ===================================================================== */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-28 sm:pb-24 flex items-center justify-center min-h-[560px]">
        <AnimatePresence mode="wait">
          {/* SCENE 1 (0s–6s): Kinetic Hook & Brand Reveal */}
          {activeSceneIndex === 0 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="text-center space-y-6 max-w-4xl"
            >
              <div className="space-y-3">
                <div className="relative inline-block">
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="text-2xl sm:text-4xl font-display font-bold text-zinc-400"
                  >
                    Scattered WhatsApp notes.
                  </motion.p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.0, duration: 0.45, ease: EASE_OUT_EXPO }}
                    style={{ originX: 0 }}
                    className="absolute left-0 right-0 top-1/2 h-[3px] bg-[#2563EB]"
                  />
                </div>

                <br />

                <div className="relative inline-block">
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="text-2xl sm:text-4xl font-display font-bold text-zinc-400"
                  >
                    Confusing MAKAUT syllabus.
                  </motion.p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 2.0, duration: 0.45, ease: EASE_OUT_EXPO }}
                    style={{ originX: 0 }}
                    className="absolute left-0 right-0 top-1/2 h-[3px] bg-[#09090B]"
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 2.6, duration: 0.7, ease: EASE_OUT_EXPO }}
                className="space-y-5 pt-2"
              >
                <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-[#09090B] leading-tight">
                  One Unified B.Tech Cockpit.
                </h1>

                <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white border border-[#E4E4E7] rounded-2xl px-6 py-3.5 shadow-sm">
                  <SetTechLogo variant="full" size={26} textClassName="text-lg font-bold" />
                  <span className="text-zinc-300 font-mono">×</span>
                  <span className="text-sm font-display font-bold text-[#09090B]">SETGOI Durgapur</span>
                  <span className="px-3 py-1 rounded-full bg-[#09090B] text-white font-mono text-xs font-semibold">
                    https://settech.ceimran.in
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 2 (6s–14s): 3D Perspective Browser Showcase & All 8 SETGOI Branches */}
          {activeSceneIndex === 1 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="w-full space-y-6"
            >
              <div className="text-center space-y-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                  8 SETGOI B.Tech Branches • Sem 3–8 MAKAUT CBCS
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#09090B]">
                  Search Any Subject Code Instantly
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* 3D Perspective Browser Mockup */}
                <motion.div
                  initial={{ rotateX: 10, rotateY: -8, scale: 0.94, opacity: 0 }}
                  animate={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 1.0, ease: EASE_OUT_EXPO }}
                  style={{ perspective: 1200 }}
                  className="lg:col-span-8 bg-white border border-[#D4D4D8] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(9,9,11,0.10)]"
                >
                  <div className="h-9 bg-[#F4F4F5] border-b border-[#E4E4E7] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-[#E4E4E7] rounded-md px-3 py-0.5 text-[11px] font-mono text-[#09090B]">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>https://settech.ceimran.in</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#2563EB]">LIVE</span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4 bg-[#FAFAFA]">
                    <div className="flex items-center gap-2.5 bg-white border border-[#E4E4E7] rounded-xl px-4 py-3 shadow-2xs">
                      <Search className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <TypewriterText
                        text="PCC-CS301 Data Structure & Algorithms"
                        elapsedSec={sceneLocalSec}
                        charsPerSec={14}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 space-y-1">
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          THEORY • 3 CREDITS
                        </span>
                        <p className="text-xs font-bold text-[#09090B] pt-1">
                          PCC-CS301 • Module 1–4 Notes &amp; Solved PYQs
                        </p>
                      </div>
                      <div className="bg-white border border-[#E4E4E7] rounded-xl p-3.5 space-y-1">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          LAB • 2 CREDITS
                        </span>
                        <p className="text-xs font-bold text-[#09090B] pt-1">
                          PCC-CS391 • DSA Practical Manual &amp; Viva Bank
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Cascading 8 SETGOI Branch Pills */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                  {BRANCHES.map((branch, idx) => (
                    <motion.div
                      key={branch}
                      initial={{ opacity: 0, x: 20, scale: 0.92 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        delay: 0.6 + idx * 0.14,
                        duration: 0.45,
                        ease: EASE_OUT_EXPO,
                      }}
                      className="bg-white border border-[#E4E4E7] rounded-xl p-3 flex items-center justify-between shadow-2xs"
                    >
                      <span className="font-mono text-xs font-bold text-[#09090B]">{branch}</span>
                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        S3–S8
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SCENE 3 (14s–22s): Theory Notes, PYQs & Lab Manuals Motion */}
          {activeSceneIndex === 2 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="w-full space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified • Zero Broken Links</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#09090B]">
                  Cleanly Separated Theory, PYQs &amp; Lab Manuals
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Theory Notes & PYQs Card */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="bg-white border border-[#E4E4E7] rounded-2xl p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#09090B]">
                      <BookOpen className="w-4 h-4 text-[#2563EB]" />
                      Theory Notes &amp; PYQs
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200 font-bold">
                      PCC-CS301
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-2 text-xs text-zinc-700">
                    <p className="font-bold text-[#09090B]">
                      AVL Tree Rotations &amp; Asymptotic Complexity
                    </p>
                    <p className="font-mono text-[11px] text-zinc-500">
                      • In-App Study Reader Modal • Offline .HTML Export
                    </p>
                    <p className="font-mono text-[11px] text-emerald-700 font-semibold">
                      ✓ 10-Year Solved MAKAUT Questions Included
                    </p>
                  </div>
                </motion.div>

                {/* Lab Practicals & Viva Card */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.6, ease: EASE_OUT_EXPO }}
                  className="bg-white border border-[#E4E4E7] rounded-2xl p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#09090B]">
                      <FlaskConical className="w-4 h-4 text-emerald-600" />
                      Lab Practicals &amp; Viva
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      ESC 391 Lab
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-2 text-xs text-zinc-700">
                    <p className="font-bold text-[#09090B]">
                      Analog &amp; Digital Electronics Circuit Lab Manual
                    </p>
                    <p className="font-mono text-[11px] text-zinc-500">
                      • Circuit Schematics • C / Python / Verilog Listings
                    </p>
                    <p className="font-mono text-[11px] text-emerald-700 font-semibold">
                      ✓ External Viva Voce Q&amp;A Included
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SCENE 4 (22s–30s): AI Viva Voice Simulator */}
          {activeSceneIndex === 3 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="w-full max-w-3xl space-y-6 text-center"
            >
              {/* Animated Examiner Orb + Waveform */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-20 h-20 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.18)]">
                  <Mic className="w-8 h-8 text-[#2563EB]" />
                </div>

                {/* Live Equalizer Bars */}
                <div className="flex items-end justify-center gap-1 h-7">
                  {[0.4, 0.9, 0.6, 1.0, 0.75, 0.95, 0.5, 0.85, 0.45].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ scaleY: [0.35, h, 0.35] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.9,
                        delay: i * 0.08,
                        ease: 'easeInOut',
                      }}
                      className="w-1.5 h-6 rounded-full bg-[#2563EB] origin-bottom"
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-semibold text-[#2563EB]">
                  Neerja • Indian Neural Voice (English &amp; Hindi)
                </span>
              </div>

              {/* Typewriter Viva Turn */}
              <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 text-left space-y-4 shadow-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase text-zinc-500">
                    AI Examiner Question (PCC-CS301)
                  </span>
                  <p className="text-sm font-bold text-[#09090B] mt-0.5">
                    &ldquo;Why is a circular queue preferred over a linear array queue?&rdquo;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-xs font-mono text-zinc-800">
                  <TypewriterText
                    text="Student: It reuses freed front slots via modulo indexing (rear + 1) % N, avoiding false overflow in O(1) time."
                    elapsedSec={sceneLocalSec}
                    charsPerSec={28}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{
                    opacity: sceneLocalSec > 3.2 ? 1 : 0,
                    y: sceneLocalSec > 3.2 ? 0 : 12,
                    scale: sceneLocalSec > 3.2 ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">
                        Spot On • 94% Concept Accuracy
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        Zero-repeat syllabus rotation • Persisted to Neon DB
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* SCENE 5 (30s–38s): 75% Attendance, SGPA & Faculty Governance Bento */}
          {activeSceneIndex === 4 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="w-full space-y-6"
            >
              <div className="text-center space-y-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                  Academic Utilities &amp; Zero-Trust Governance
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#09090B]">
                  Attendance, SGPA &amp; Faculty-Verified Authority
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: 75% Attendance Gauge */}
                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="font-mono text-[11px] uppercase text-zinc-500 font-semibold">
                    75% Attendance Auditor
                  </span>
                  <div className="text-4xl font-display font-extrabold text-emerald-600 font-mono">
                    {Math.round(68 + Math.min(1, sceneLocalSec / 3.5) * 14)}%
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 font-mono text-xs font-bold text-emerald-800">
                    Safe Zone • +4 Classes Buffer
                  </span>
                </div>

                {/* Card 2: MAKAUT 10-Point SGPA Counter */}
                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="font-mono text-[11px] uppercase text-zinc-500 font-semibold">
                    MAKAUT 10-Point SGPA
                  </span>
                  <div className="text-4xl font-display font-extrabold text-[#09090B] font-mono">
                    {(7.2 + Math.min(1, sceneLocalSec / 3.5) * 1.74).toFixed(2)}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 font-mono text-xs font-bold text-[#2563EB]">
                    Credit-Indexed • Zero NaN
                  </span>
                </div>

                {/* Card 3: Live Role Switcher + Faculty Verified */}
                <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 flex flex-col justify-between space-y-3">
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] font-mono text-[10px]">
                    {['Student', 'Faculty', 'Admin'].map((r, idx) => {
                      const activeIdx = Math.min(2, Math.floor(sceneLocalSec / 2.2));
                      return (
                        <div
                          key={r}
                          className={`py-1.5 text-center rounded-lg font-semibold ${
                            activeIdx === idx ? 'bg-[#09090B] text-white' : 'text-zinc-500'
                          }`}
                        >
                          {r}
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-900">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verified Faculty Answer</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] flex items-center gap-2 text-xs font-mono text-zinc-700">
                      <Bell className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>Visible to: CSE • Sem 3</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCENE 6 (38s–45s): Authoritative Brand Finale (QR lives in permanent corner dock) */}
          {activeSceneIndex === 5 && (
            <motion.div
              key="scene-6"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
              className="bg-white border border-[#E4E4E7] rounded-3xl p-8 sm:p-12 shadow-[0_24px_60px_rgba(9,9,11,0.08)] max-w-3xl w-full text-center space-y-6"
            >
              <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7]">
                <SetTechLogo variant="full" size={26} textClassName="text-lg font-bold" />
                <span className="text-zinc-300 font-mono">×</span>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#09090B]">
                  SETGOI Durgapur
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                  Sanaka Educational Trust&apos;s Group of Institutions • Malandighi, Durgapur
                </p>
                <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-[#09090B] leading-[1.08]">
                  Your Entire B.Tech Semester, Organized in One Place.
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 font-mono text-[11px] font-bold text-[#2563EB]">
                  {BRANCHES.join(' • ')}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-[#09090B] text-white font-mono text-xs font-semibold">
                  https://settech.ceimran.in
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-zinc-600 pt-1">
                Point your phone camera at the QR code in the corner to explore live.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================================
          PERMANENT STATIC BOTTOM-RIGHT QR DOCK (NEVER ANIMATES OR UNMOUNTS)
         ===================================================================== */}
      <div className="fixed bottom-5 right-5 z-40 bg-white border border-zinc-200 rounded-2xl p-3 shadow-sm flex items-center gap-3">
        <div className="relative p-1.5 bg-white shrink-0">
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#09090B]" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#09090B]" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#09090B]" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#09090B]" />
          <QRCodeSVG
            value="https://settech.ceimran.in"
            size={84}
            level="H"
            fgColor="#09090B"
            bgColor="#FFFFFF"
          />
        </div>
        <div className="pr-1 space-y-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">
            LIVE PORTAL
          </p>
          <p className="font-display text-sm font-bold text-[#09090B] leading-tight">
            Scan to Open
          </p>
          <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 font-mono text-[10.5px] font-semibold text-[#09090B]">
            settech.ceimran.in
          </span>
        </div>
      </div>

      {/* =====================================================================
          AUTO-HIDING FLOATING STUDIO CONTROLS
         ===================================================================== */}
      <div
        className={`fixed bottom-36 sm:bottom-5 left-5 z-40 w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-280px)] max-w-2xl bg-white/90 backdrop-blur-md border border-[#E4E4E7] rounded-2xl px-4 py-2.5 shadow-lg transition-all duration-500 ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Play / Pause */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="w-8 h-8 rounded-xl bg-[#09090B] hover:bg-zinc-800 text-white flex items-center justify-center cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setAutoLoop((l) => !l)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-semibold inline-flex items-center gap-1 cursor-pointer ${
                autoLoop
                  ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                  : 'bg-white text-zinc-500 border-[#E4E4E7]'
              }`}
              title="Toggle Auto-Loop"
            >
              <Repeat className="w-3 h-3" />
              <span className="hidden sm:inline">Loop</span>
            </button>
          </div>

          {/* 6 Clickable Scene Progress Segments */}
          <div className="flex-1 grid grid-cols-6 gap-1.5 min-w-[180px]">
            {SCENES.map((scene, idx) => {
              const duration = scene.endSec - scene.startSec;
              const pct =
                elapsed >= scene.endSec
                  ? 100
                  : elapsed <= scene.startSec
                  ? 0
                  : ((elapsed - scene.startSec) / duration) * 100;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => jumpToScene(idx)}
                  className="group text-left space-y-1 cursor-pointer"
                >
                  <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] transition-none"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span
                    className={`block text-[9.5px] font-mono truncate ${
                      activeSceneIndex === idx ? 'text-[#09090B] font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {idx + 1}. {scene.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Voiceover & Fullscreen */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-semibold inline-flex items-center gap-1 cursor-pointer ${
                voiceEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-zinc-600 border-[#E4E4E7]'
              }`}
              title="Toggle AI Voiceover (en-IN-NeerjaExpressiveNeural)"
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Voice</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-xl border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center cursor-pointer"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypewriterText({
  text,
  elapsedSec,
  charsPerSec,
}: {
  text: string;
  elapsedSec: number;
  charsPerSec: number;
}) {
  const count = Math.min(text.length, Math.floor(elapsedSec * charsPerSec));
  return (
    <span className="font-mono text-xs sm:text-sm text-[#09090B]">
      {text.slice(0, count)}
      <span className="inline-block w-1.5 h-4 bg-[#2563EB] ml-0.5 align-middle animate-pulse" />
    </span>
  );
}
