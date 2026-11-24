'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { SetTechLogo } from '@/components/SetTechLogo';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on auth screens, onboarding, dedicated zero-scroll studios like /viva, and workspace cockpits
  if (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/auth-callback') ||
    pathname.startsWith('/faculty') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/viva')
  ) {
    return null;
  }

  return (
    <footer className="w-full bg-white border-t border-zinc-200/80 pt-12 pb-10 px-4 sm:px-6 mt-auto relative z-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-10 border-b border-zinc-100">
          {/* Left Brand Column (Compact, 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity" aria-label="SETTech Home">
              <SetTechLogo variant="full" size={22} textClassName="text-base font-bold" />
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Student-built academic platform for SETGOI (MAKAUT).
            </p>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Malandighi, Durgapur • WB 713212</span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-900">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>
                <Link href="/viva" className="hover:text-zinc-950 transition-colors">
                  AI Viva
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-zinc-950 transition-colors">
                  Notes Vault
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-zinc-950 transition-colors">
                  Campus Forum
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-zinc-950 transition-colors">
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-900">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>
                <a
                  href="https://icampus.setgoi.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-950 transition-colors"
                >
                  <span>SETGOI iCampus</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://makautexam.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-950 transition-colors"
                >
                  <span>MAKAUT Exam</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://nptel.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-950 transition-colors"
                >
                  <span>NPTEL / Swayam</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://makautwb.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-zinc-950 transition-colors"
                >
                  <span>MAKAUT Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Campus */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-900">
              Campus
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>
                <Link href="/campus" className="hover:text-zinc-950 transition-colors">
                  Campus Directory
                </Link>
              </li>
              <li>
                <Link href="/campus" className="hover:text-zinc-950 transition-colors">
                  Faculty &amp; Admin
                </Link>
              </li>
              <li>
                <a
                  href="tel:18001805522"
                  className="hover:text-zinc-950 transition-colors inline-block"
                >
                  Anti-Ragging: 1800-180-5522
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Legal Bar */}
        <div className="pt-6 mt-1 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© 2026 SETTech. Independent student initiative.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-zinc-900 transition-colors">
              Cookies
            </Link>
            <Link href="/disclaimer" className="hover:text-zinc-900 transition-colors">
              Disclaimer
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('settech:open-cookie-settings'));
                  window.dispatchEvent(new CustomEvent('sanakahub:open-cookie-settings'));
                }
              }}
              className="hover:text-zinc-900 transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
