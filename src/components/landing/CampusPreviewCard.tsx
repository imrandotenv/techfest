'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Calculator, Sparkles, Box } from 'lucide-react';

const TRENDING_SUBJECTS = [
  { code: 'PCC-CS301', title: 'Data Structures' },
  { code: 'ESC301', title: 'Digital Electronics' },
  { code: 'PCC-CS302', title: 'IT Workshop' },
];

export function CampusPreviewCard() {
  return (
    <div className="w-full bg-white/90 backdrop-blur-xl border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-4 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] hover:border-zinc-300 transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-xs font-mono font-medium text-zinc-600 uppercase tracking-wider">
            Campus Live Deck
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200/60">
          AUTUMN 2026
        </span>
      </div>

      {/* 3D Campus Map Teaser Tile */}
      <Link
        href="/campus"
        className="group relative block overflow-hidden rounded-xl border border-zinc-200/90 bg-gradient-to-br from-zinc-50 via-zinc-100/60 to-zinc-50 p-4 hover:border-zinc-400 hover:shadow-xs transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                Interactive 3D
              </span>
              <span className="text-[11px] font-mono text-zinc-400">WebGL</span>
            </div>
            <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
              SETGOI Spatial Map
            </h4>
            <p className="text-xs text-zinc-500">
              Academic blocks, lab wings, hostel routes & bus bays
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center text-zinc-700 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shrink-0">
            <Box className="w-4 h-4" />
          </div>
        </div>

        {/* Isometric Grid Graphic Preview */}
        <div className="mt-3 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs font-mono text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>5 Campus Zones Mapped</span>
          </div>
          <span className="inline-flex items-center gap-1 text-zinc-900 font-medium group-hover:translate-x-0.5 transition-transform">
            Launch 3D Explorer <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* SGPA Calculator Shortcut */}
      <Link
        href="/tools"
        className="group flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/60 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:text-zinc-950 transition-colors shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900">
              MAKAUT SGPA Calculator
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              10-point scale • Credit weighted • One-click export
            </div>
          </div>
        </div>
        <span className="text-xs font-mono font-medium text-zinc-500 group-hover:text-zinc-950 transition-colors">
          Open →
        </span>
      </Link>

      {/* Trending Subject Pills */}
      <div className="pt-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
          <span>Trending in Vault</span>
          <span className="text-[10px] text-zinc-400 font-sans">Sem 3 / CSE</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SUBJECTS.map((sub) => (
            <Link
              key={sub.code}
              href={`/notes?q=${encodeURIComponent(sub.code)}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 hover:border-zinc-300 text-xs text-zinc-700 hover:text-zinc-950 transition-all hover:-translate-y-0.5 hover:shadow-2xs"
            >
              <span className="font-mono font-semibold text-zinc-900">
                {sub.code}
              </span>
              <span className="text-zinc-400 font-light">•</span>
              <span className="text-zinc-500 text-[11px]">{sub.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
