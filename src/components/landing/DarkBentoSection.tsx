'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Compass, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export function DarkBentoSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 w-full py-10 sm:py-14">
      {/* Contained Dark-Ink Showcase Card (24px radius, #0F172A surface) */}
      <div className="relative rounded-[24px] bg-[#0F172A] border border-slate-800 p-8 sm:p-12 text-white shadow-2xl overflow-hidden">
        {/* Cobalt Radial Glow Accent */}
        <div 
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_75%_at_50%_-15%,rgba(37,99,235,0.22),rgba(0,0,0,0))]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 w-full">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Do more with SanakaHub Tools</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-[1.14]">
              The AI-powered academic cockpit for every student.
            </h2>

            <p className="mt-3 text-slate-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              SanakaHub tools help students and faculty move faster through semesters with 100% MAKAUT precision.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-12">
            {/* Card 1: SGPA Calculator (6 cols) */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#1E293B]/70 p-6 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-bold text-white">MAKAUT SGPA Calculator</h3>
                      <p className="text-[11px] font-mono text-slate-400">10-Point Scale Multiplier</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                    Accurate
                  </span>
                </div>

                {/* Interactive Mock Preview */}
                <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Target SGPA</span>
                    <span className="text-base font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
                      8.92
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full w-[89%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Credits: 21.0</span>
                    <span>Grade: E (Outstanding)</span>
                  </div>
                </div>

                <p className="mt-3.5 text-xs text-slate-400 leading-relaxed font-sans">
                  Weight your marks according to official MAKAUT credits and calculate semester SGPA or cumulative YGPA with instant copyable audit reports.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/60">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 text-xs font-mono font-medium text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Calculate Your SGPA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: 3D Campus Spatial Map (6 cols) */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#1E293B]/70 p-6 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-bold text-white">SETGOI 3D Digital Twin</h3>
                      <p className="text-[11px] font-mono text-slate-400">Three.js WebGL Spatial Engine</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/80 text-blue-400 border border-blue-800/60">
                    Interactive
                  </span>
                </div>

                {/* Interactive Mock Preview */}
                <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-300 pb-1.5 border-b border-slate-800">
                    <span>Zone A • Academic Core</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 pb-1.5 border-b border-slate-800">
                    <span>Zone B • Portico &amp; Transit Bay</span>
                    <span className="text-blue-400">Buses Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Zone C • Sanaka Hospital &amp; Labs</span>
                    <span className="text-slate-400">24/7 SOS</span>
                  </div>
                </div>

                <p className="mt-3.5 text-xs text-slate-400 leading-relaxed font-sans">
                  Explore the entire Malandighi campus in full 3D. Locate faculty chambers, exam venues, hostel cafeterias, and bus routes in seconds.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-700/60">
                <Link
                  href="/campus"
                  className="inline-flex items-center gap-2 text-xs font-mono font-medium text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Launch 3D Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Student Forum (12 cols full width) */}
            <div className="lg:col-span-12 rounded-2xl border border-slate-800 bg-[#1E293B]/70 p-6 backdrop-blur-md hover:border-slate-700 transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-white">Student Forum &amp; Academic Q&amp;A</h3>
                    <p className="text-[11px] font-mono text-slate-400">Peer Discussions, Coding Queries &amp; Placement Insights</p>
                  </div>
                </div>

                <Link
                  href="/forum"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors border border-slate-700"
                >
                  <span>Join Student Forum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Thread Rows */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-900 font-bold">
                    PCC-CS301
                  </span>
                  <h4 className="text-xs font-sans font-semibold text-slate-200 line-clamp-2">
                    Best reference books for Graph Algorithms in MAKAUT Sem 3?
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400">14 replies • Verified Answer</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-400 border border-purple-900 font-bold">
                    T&amp;P Cell
                  </span>
                  <h4 className="text-xs font-sans font-semibold text-slate-200 line-clamp-2">
                    TCS Ninja &amp; Cognizant on-campus placement preparation guidelines
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400">38 replies • Senior Advice</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-900 font-bold">
                    Transit
                  </span>
                  <h4 className="text-xs font-sans font-semibold text-slate-200 line-clamp-2">
                    Updated Route 4 Bus Timings from Muchipara &amp; Durgapur Station
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400">8 replies • Official Notice</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Reasons to Choose SanakaHub */}
          <div className="mb-10 sm:mb-12">
            <h3 className="text-center text-lg sm:text-2xl font-display font-bold tracking-tight text-white mb-6">
              3 reasons to choose SanakaHub.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
                <h4 className="text-xs sm:text-sm font-sans font-semibold text-white">
                  No context switching — One platform for notes, tools &amp; campus
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Never jump between fragmented WhatsApp groups, slow university portals, and lost Google Drive links again.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
                <h4 className="text-xs sm:text-sm font-sans font-semibold text-white">
                  10-Point MAKAUT Precision — Tailored to university rules
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Every calculation and grade point is pre-configured to match the official MAKAUT credit-multiplier grading scale.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
                <h4 className="text-xs sm:text-sm font-sans font-semibold text-white">
                  Zero cost &amp; student-first — Built for SETGOI Durgapur
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Open, community-driven, and completely free of commercial paywalls or third-party ads.
                </p>
              </div>
            </div>
          </div>

          {/* Blue-Indigo Stats Highlight Bar */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 p-6 sm:p-10 text-center text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-blue-200">
                Campus Utility Benchmark
              </div>
              <div className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
                10,000+
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-sans font-medium">
                Verified Downloads &amp; Solved University Question Papers
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono">3.5k+</div>
                <div className="text-xs text-blue-100 mt-0.5">Lecture Handouts &amp; Lab Manuals</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono">100%</div>
                <div className="text-xs text-blue-100 mt-0.5">MAKAUT Syllabus Aligned</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono">5 Zones</div>
                <div className="text-xs text-blue-100 mt-0.5">Interactive 3D Campus Engine</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
