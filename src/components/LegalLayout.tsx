'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, BookOpen, Cookie, AlertCircle, ArrowLeft, Mail, ExternalLink } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  badgeLabel?: string;
  badgeColor?: string;
  tldrItems?: string[];
  children: React.ReactNode;
}

const LEGAL_TABS = [
  { href: '/privacy', label: 'Privacy Policy', icon: ShieldCheck },
  { href: '/terms', label: 'Terms & Honor Code', icon: BookOpen },
  { href: '/cookies', label: 'Cookie & Storage', icon: Cookie },
  { href: '/disclaimer', label: 'Academic Disclaimer', icon: AlertCircle },
];

export function LegalLayout({
  title,
  subtitle,
  badgeLabel = 'POLICY GOVERNANCE',
  badgeColor = 'blue',
  tldrItems,
  children,
}: LegalLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F7F8FA] pt-24 md:pt-28 pb-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to SanakaHub</span>
          </Link>

          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span>VERSION {LEGAL_CONFIG.policyVersion}</span>
            <span>•</span>
            <span>UPDATED {LEGAL_CONFIG.lastUpdated.toUpperCase()}</span>
          </div>
        </div>

        {/* Unified Legal Header Strip */}
        <div className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-blue-50/80 text-blue-700 border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>{badgeLabel}</span>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-500">SETGOI B.TECH</span>
            </div>

            <span className="text-xs font-mono text-zinc-500">
              Jurisdiction: <span className="text-zinc-700 font-medium">India (DPDP Act 2023)</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-[-0.035em] text-[#09090B]">
              {title}
            </h1>
            <p className="text-sm text-[#52525B] leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="pt-2 flex flex-wrap gap-1.5 p-1 bg-zinc-100/80 rounded-xl border border-zinc-200/60">
            {LEGAL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* TL;DR Summary Card for Students */}
        {tldrItems && tldrItems.length > 0 && (
          <div className="sanaka-card rounded-2xl p-5 sm:p-6 border-l-4 border-l-blue-600 bg-blue-50/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                TL;DR For Students
              </span>
              <span className="text-xs text-zinc-500">Quick plain-English overview</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              {tldrItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Editorial Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Institutional Disclaimer & Grievance Contact */}
        <div className="sanaka-card rounded-2xl p-6 border-t border-zinc-200 bg-zinc-50/60 space-y-4 text-xs text-zinc-600 leading-relaxed">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold text-zinc-900">
                {LEGAL_CONFIG.scope}
              </p>
              <p className="text-zinc-500 text-[11px] mt-0.5">
                SanakaHub is maintained by student engineers to assist with study materials, attendance calculation, and MAKAUT exam preparation.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`mailto:${LEGAL_CONFIG.contactEmail}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors font-mono text-[11px]"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{LEGAL_CONFIG.contactEmail}</span>
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
            <span>{LEGAL_CONFIG.grievanceOfficer.title} • {LEGAL_CONFIG.grievanceOfficer.address}</span>
            <span>Policy v{LEGAL_CONFIG.policyVersion}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
