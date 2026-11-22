'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Phone, Shield, ArrowUpRight } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 py-16 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-zinc-100">
          {/* Column 1: Brand & Status (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-tight text-lg text-zinc-950">
                SanakaHub
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-600 border border-zinc-200">
                SETGOI
              </span>
            </div>

            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              Centralized student utility and academic vault for Sanaka Educational Trust&apos;s Group of Institutions (SETGOI) Durgapur, affiliated with MAKAUT.
            </p>

            {/* Live Status Pill matching Hashnode */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All campus services are online</span>
            </div>
          </div>

          {/* Column 2: Academic Vault */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Academic Vault
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href="/notes" className="hover:text-zinc-950 transition-colors">
                  Lecture Notes & PYQs
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-zinc-950 transition-colors">
                  Solved Past Papers
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-zinc-950 transition-colors">
                  Lab Manuals & Code
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-zinc-950 transition-colors">
                  MAKAUT 2026-27 Syllabus
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Campus Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Campus Guide
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href="/campus" className="hover:text-zinc-950 transition-colors">
                  3D Spatial Visualizer
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-zinc-950 transition-colors">
                  Department Directory
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-zinc-950 transition-colors">
                  Bus & Transit Timings
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-zinc-950 transition-colors">
                  B.Tech Engineering Labs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Student Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Utilities & Portal
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href="/tools" className="hover:text-zinc-950 transition-colors">
                  MAKAUT SGPA Calculator
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-zinc-950 transition-colors">
                  Student Q&A Forum
                </Link>
              </li>
              <li>
                <Link href="/dashboard/college" className="hover:text-zinc-950 transition-colors">
                  Faculty Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-zinc-950 transition-colors">
                  Admin Approval Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            <span>SanakaHub © 2026 — Independent Student Portal • SETGOI B.Tech • MAKAUT</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-600">
            <span className="flex items-center gap-1.5 text-zinc-700">
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>Anti-Ragging: </span>
              <a href="tel:18001805522" className="font-semibold text-zinc-950 hover:underline">
                1800-180-5522
              </a>
            </span>
            <span className="text-zinc-300">|</span>
            <Link href="/privacy" className="hover:text-zinc-950 transition-colors">
              Privacy
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">
              Terms
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/cookies" className="hover:text-zinc-950 transition-colors">
              Cookies
            </Link>
            <span className="text-zinc-300">|</span>
            <Link href="/disclaimer" className="hover:text-zinc-950 transition-colors">
              Disclaimer
            </Link>
            <span className="text-zinc-300">|</span>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('sanakahub:open-cookie-settings'));
                }
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors underline underline-offset-2 cursor-pointer font-medium"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
