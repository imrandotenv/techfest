import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, Cookie } from 'lucide-react';

export interface LegalSectionLink {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  activeRoute: '/privacy' | '/terms' | '/cookies';
  sections: LegalSectionLink[];
  children: React.ReactNode;
}

const LEGAL_NAV = [
  { href: '/privacy' as const, label: 'Privacy Policy', icon: ShieldCheck },
  { href: '/terms' as const, label: 'Terms of Use', icon: FileText },
  { href: '/cookies' as const, label: 'Cookie Policy', icon: Cookie },
];

export function LegalPageLayout({
  title,
  subtitle,
  activeRoute,
  sections,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-600 hover:text-[#09090B] bg-white border border-[#E4E4E7] px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to SETTech</span>
            </Link>

            <span className="px-3 py-1 rounded-full bg-white border border-[#E4E4E7] font-mono text-[11px] font-semibold text-zinc-600">
              LEGAL &amp; COMPLIANCE • EFFECTIVE NOVEMBER 25, 2026
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[#09090B]">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Quick Cross-Links */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {LEGAL_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                    isActive
                      ? 'bg-[#09090B] text-white border-[#09090B]'
                      : 'bg-white text-zinc-700 border-[#E4E4E7] hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Two-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sticky Section Index */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white border border-[#E4E4E7] rounded-2xl p-5 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              On This Page
            </p>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-[#09090B] hover:bg-[#FAFAFA] transition-colors"
                >
                  {sec.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-[#E4E4E7] text-[11px] text-zinc-500 space-y-1">
              <p className="font-semibold text-zinc-700">SETGOI Durgapur</p>
              <p>Malandighi, Durgapur, WB 713212</p>
              <p>
                Contact:{' '}
                <a href="mailto:mail@ceimran.in" className="text-blue-600 hover:underline">
                  mail@ceimran.in
                </a>
              </p>
            </div>
          </aside>

          {/* Right Paper Card */}
          <article className="lg:col-span-8 bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-10 space-y-8 text-sm text-zinc-700 leading-relaxed">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
}
