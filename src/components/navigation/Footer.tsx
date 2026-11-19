'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // If inside authenticated admin/college dashboard layout with its own full-screen console layout, optionally keep clean or render
  const isDashboard = pathname.startsWith('/dashboard');
  if (isDashboard) {
    return null;
  }

  return (
    <footer className="w-full bg-white border-t border-[#E2E8F0] pt-14 pb-12 px-6 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-[#E2E8F0]">
          {/* Column 1: Brand & Status (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span className="font-display font-bold tracking-tight text-lg text-[#0F172A]">
                SanakaHub
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-[#475569] border border-[#E2E8F0]">
                SETGOI
              </span>
            </div>

            <p className="text-xs font-sans text-[#475569] max-w-sm leading-relaxed">
              Centralized student utility and academic vault for Sanaka Educational Trust&apos;s Group of Institutions (SETGOI) Durgapur, affiliated with MAKAUT.
            </p>

            {/* Live Campus Status Indicator */}
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
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#475569] font-bold">
              Academic Vault
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#475569]">
              <li>
                <Link href="/notes" className="hover:text-[#0F172A] transition-colors">
                  Lecture Notes & PYQs
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-[#0F172A] transition-colors">
                  Solved Past Papers
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-[#0F172A] transition-colors">
                  Lab Manuals & Code
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-[#0F172A] transition-colors">
                  MAKAUT 2026-27 Syllabus
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Campus Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#475569] font-bold">
              Campus Guide
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#475569]">
              <li>
                <Link href="/campus" className="hover:text-[#0F172A] transition-colors">
                  3D Spatial Visualizer
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-[#0F172A] transition-colors">
                  Department Directory
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-[#0F172A] transition-colors">
                  Bus & Transit Timings
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-[#0F172A] transition-colors">
                  Hostel & Cafeteria
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Student Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#475569] font-bold">
              Utilities & Portal
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#475569]">
              <li>
                <Link href="/tools" className="hover:text-[#0F172A] transition-colors">
                  MAKAUT SGPA Calculator
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-[#0F172A] transition-colors">
                  Student Q&A Forum
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-[#0F172A] transition-colors">
                  Academic Calendar
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-[#0F172A] transition-colors">
                  Priority Notice Board
                </Link>
              </li>
              <li>
                <Link href="/dashboard/college" className="hover:text-[#0F172A] transition-colors">
                  Faculty Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-[#0F172A] transition-colors">
                  Admin Approval Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#475569]">
          <div>
            <span>SanakaHub © 2026 — SETGOI Durgapur • Affiliated with MAKAUT</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#0F172A] font-medium">
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>Anti-Ragging Helpline: </span>
              <a href="tel:18001805522" className="font-bold text-[#0F172A] hover:underline">
                1800-180-5522
              </a>
            </span>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#0F172A] transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[#0F172A] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
