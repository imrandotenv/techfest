'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export function GradientCtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-6 w-full py-16">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#7B96FF] via-[#B4C5FF] to-[#F4F6FF] p-10 sm:p-16 text-center text-zinc-950 shadow-[0_20px_60px_rgba(123,150,255,0.18)] overflow-hidden">
        {/* Subtle Decorative Background Circles */}
        <div 
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/30 blur-2xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#7B96FF]/30 blur-2xl pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* Central Stylized Emblem matching Hashnode reference */}
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-blue-600 mb-6 border border-white/80">
            <GraduationCap className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-[-0.02em] text-[#0F172A] leading-[1.14]">
            Give your B.Tech journey a modern academic cockpit.
          </h2>

          <p className="mt-4 text-[#475569] font-sans text-sm sm:text-base max-w-lg leading-relaxed">
            Join thousands of SETGOI students accessing verified MAKAUT notes, solved past papers, and instant SGPA calculations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-sans font-semibold bg-[#0F172A] text-white hover:bg-slate-800 transition-all shadow-md hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Start in 30 seconds</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/notes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-sans font-medium bg-white/95 text-[#0F172A] hover:bg-white border border-[#E2E8F0] transition-all shadow-2xs"
            >
              <span>Explore Vault (No Login Required)</span>
            </Link>
          </div>

          <div className="mt-4 text-[11px] font-mono text-[#475569]">
            MAKAUT affiliated • 100% Free for SETGOI students
          </div>
        </div>
      </div>
    </section>
  );
}
