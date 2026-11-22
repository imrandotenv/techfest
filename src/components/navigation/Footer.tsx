'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ArrowUpRight, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on auth, console dashboards, dedicated zero-scroll studios like /viva, and authenticated workspace routes
  if (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/faculty') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/viva')
  ) {
    return null;
  }

  return (
    <footer className="w-full bg-[#FAFAFA] border-t border-zinc-200 pt-14 pb-12 px-6 mt-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-zinc-200">
          {/* Column 1: Brand & Status (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
              <span className="font-display font-bold tracking-tight text-lg text-zinc-900">
                <span className="text-[#09090B]">SET</span>
                <span className="text-[#2563EB]">Tech</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-200/70 text-zinc-700 border border-zinc-300">
                B.Tech SETGOI
              </span>
            </div>

            <p className="text-xs font-sans text-zinc-600 max-w-sm leading-relaxed">
              Built by SETGOI B.Tech Engineers • Affiliated with Maulana Abul Kalam Azad University of Technology (MAKAUT).
            </p>

            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Malandighi, Durgapur, West Bengal 713212</span>
            </div>

            {/* Live Institutional System Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All campus engineering portals online</span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-zinc-600">
              <li>
                <Link href="/notes" className="hover:text-zinc-900 transition-colors">
                  Academic Vault (Notes & PYQs)
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-zinc-900 transition-colors">
                  Engineering Q&A Forum
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-zinc-900 transition-colors">
                  3D Campus & Lab Directory
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-zinc-900 transition-colors">
                  SGPA & 75% Attendance Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold">
              Official Portals
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-zinc-600">
              <li>
                <a
                  href="https://icampus.setgoi.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#2563EB] hover:underline font-medium"
                >
                  <span>SETGOI iCampus</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://makautexam.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <span>MAKAUT Exam Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://nptel.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <span>NPTEL / Swayam</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://makautwb.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors"
                >
                  <span>MAKAUT Official Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Engineering Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-bold">
              Engineering Support
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-zinc-600">
              <li>
                <Link href="/campus" className="hover:text-zinc-900 transition-colors">
                  B.Tech Principal & HODs
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-zinc-900 transition-colors">
                  Examination & Placement Cell
                </Link>
              </li>
              <li>
                <a
                  href="tel:18001805522"
                  className="inline-flex items-center gap-1 text-rose-600 hover:underline font-semibold font-mono"
                >
                  <span>Anti-Ragging: 1800-180-5522</span>
                </a>
              </li>
              <li>
                <Link href="/dashboard/college" className="hover:text-zinc-900 transition-colors text-purple-700">
                  Faculty & Admin Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            <span>SETTech © 2026 • Independent Student Initiative (SETGOI B.Tech • MAKAUT)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-600">
            <span className="flex items-center gap-1.5 text-zinc-900 font-medium">
              <Phone className="w-3.5 h-3.5 text-rose-500" />
              <span>Anti-Ragging: 1800-180-5522</span>
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
                  window.dispatchEvent(new CustomEvent('settech:open-cookie-settings'));
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
