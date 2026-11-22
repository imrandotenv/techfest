'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  MessageSquare,
  Calculator,
  Compass,
  FileCheck2,
  Bell,
  HelpCircle,
  Users,
  ShieldCheck,
  Building2,
  ExternalLink,
  Menu,
  X,
  Search,
  Upload,
  ChevronRight,
  ArrowUpRight,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { getResolvedRole, getDisplayRole } from '@/lib/auth-client';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { ExamCountdown } from '@/components/ExamCountdown';
import { SetTechLogo } from '@/components/SetTechLogo';

export interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  roleTitle?: string;
  currentRole?: 'admin' | 'faculty' | 'student';
  userName?: string;
  userEmail?: string;
  primaryAction?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'primary' | 'emerald' | 'purple';
  };
}

export function AppShell({
  children,
  breadcrumbs,
  roleTitle,
  currentRole,
  userName,
  userEmail,
  primaryAction,
}: AppShellProps) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const resolvedRole = currentRole
    ? (currentRole === 'faculty' ? 'college' : currentRole)
    : getResolvedRole(user);
  const roleDisplay = getDisplayRole(resolvedRole);

  const roleBadgeStyle =
    resolvedRole === 'admin'
      ? 'bg-purple-50 text-purple-700 border-purple-200'
      : resolvedRole === 'college'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-blue-50 text-[#2563EB] border-blue-200';

  const roleWorkspaceHref =
    resolvedRole === 'admin'
      ? '/admin'
      : resolvedRole === 'college'
      ? '/faculty'
      : '/student';

  const defaultBreadcrumbs = breadcrumbs || [
    { label: 'SETTech', href: '/' },
    { label: roleTitle || roleDisplay, href: roleWorkspaceHref },
    { label: 'Overview' },
  ];

  const defaultPrimaryAction = primaryAction || (
    resolvedRole === 'admin'
      ? { label: '+ Manage Users', href: '/admin#users', variant: 'purple' as const }
      : resolvedRole === 'college'
      ? { label: '+ Post Notice', href: '/faculty#notices', variant: 'emerald' as const }
      : { label: '+ Upload Note', href: '/notes?action=upload', variant: 'primary' as const }
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col md:flex-row antialiased text-[#09090B]">
      {/* =========================================================================
          1. DESKTOP COLLAPSIBLE SIDEBAR (w-60, sticky, border-r)
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-zinc-200/90 h-screen sticky top-0 shrink-0 z-40 select-none">
        {/* Brand Header & Role Badge */}
        <div className="h-14 px-4 border-b border-zinc-200/90 flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="flex items-center hover:opacity-85 transition-opacity"
            aria-label="SETTech Homepage"
          >
            <SetTechLogo variant="full" size={20} textClassName="text-sm font-bold" />
          </Link>

          <span
            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${roleBadgeStyle}`}
          >
            {roleDisplay}
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Group 1: Workspace Core */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2.5 mb-1.5">
              Workspace
            </div>

            <Link
              href={roleWorkspaceHref}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors ${
                pathname === roleWorkspaceHref
                  ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                <span>Overview</span>
              </div>
            </Link>

            <Link
              href="/viva"
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors ${
                pathname.startsWith('/viva')
                  ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>AI Viva Studio</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#2563EB]">
                VOICE
              </span>
            </Link>

            <Link
              href="/notes"
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors ${
                pathname.startsWith('/notes')
                  ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-500" />
                <span>Notes &amp; Lab Vault</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.2 rounded">
                MAKAUT
              </span>
            </Link>

            <Link
              href="/forum"
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors ${
                pathname.startsWith('/forum')
                  ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-500" />
                <span>Campus Forum</span>
              </div>
            </Link>

            <Link
              href="/tools"
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors ${
                pathname.startsWith('/tools')
                  ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-zinc-500" />
                <span>Student Utilities</span>
              </div>
            </Link>

            <Link
              href="/campus"
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-colors ${
                pathname.startsWith('/campus')
                  ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-zinc-500" />
                <span>3D Campus Map</span>
              </div>
            </Link>
          </div>

          {/* Group 2: Faculty Desk (Only Faculty & Admin) */}
          {(resolvedRole === 'college' || resolvedRole === 'admin') && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2.5 mb-1.5 flex items-center justify-between">
                <span>Faculty Desk</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>

              <Link
                href="/faculty#queue"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Verification Queue</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  3
                </span>
              </Link>

              <Link
                href="/notices"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-zinc-500" />
                  <span>Publish Notice</span>
                </div>
              </Link>

              <Link
                href="/forum?filter=unanswered"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  <span>Student Doubts</span>
                </div>
              </Link>
            </div>
          )}

          {/* Group 3: Super Admin Controls (Only Admin) */}
          {resolvedRole === 'admin' && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2.5 mb-1.5 flex items-center justify-between">
                <span>Administration</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>

              <Link
                href="/admin#users"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>User &amp; Role Manager</span>
                </div>
              </Link>

              <Link
                href="/campus?tab=directory"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-500" />
                  <span>Campus Directory</span>
                </div>
              </Link>

              <Link
                href="/admin#audit"
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>System Audit Logs</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Pinned Bottom User & Public Exit Strip */}
        <div className="p-3 border-t border-zinc-200/90 bg-zinc-50/60 space-y-2 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-7 h-7 border border-zinc-200',
                  userButtonPopoverCard: 'shadow-xl border border-zinc-200 rounded-xl',
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-zinc-900 truncate">
                {userName || user?.fullName || 'SETGOI Engineer'}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 truncate">
                {userEmail || user?.primaryEmailAddress?.emailAddress || 'student@setgoi.ac.in'}
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
          >
            <span>Return to Public Site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </Link>
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE SLIDE-OVER DRAWER (< 768px / md:hidden)
          ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <div className="relative z-10 w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="h-14 px-4 border-b border-zinc-200 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center"
                aria-label="SETTech Homepage"
              >
                <SetTechLogo variant="full" size={20} textClassName="text-sm font-bold" />
              </Link>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Nav Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-1">
                  Workspace
                </div>
                <Link
                  href={roleWorkspaceHref}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                    pathname === roleWorkspaceHref
                      ? 'bg-blue-50 text-[#2563EB] font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </Link>

                <Link
                  href="/viva"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <span>AI Viva Studio</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-[#2563EB] font-bold">
                    VOICE
                  </span>
                </Link>

                <Link
                  href="/notes"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Notes &amp; Lab Vault</span>
                </Link>

                <Link
                  href="/forum"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Campus Forum</span>
                </Link>

                <Link
                  href="/tools"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Student Utilities</span>
                </Link>

                <Link
                  href="/campus"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <Compass className="w-4 h-4" />
                  <span>3D Campus Map</span>
                </Link>
              </div>

              {(resolvedRole === 'college' || resolvedRole === 'admin') && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-1">
                    Faculty Desk
                  </div>
                  <Link
                    href="/faculty#queue"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>Verification Queue</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      3
                    </span>
                  </Link>
                  <Link
                    href="/notices"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Publish Notice</span>
                  </Link>
                </div>
              )}

              {resolvedRole === 'admin' && (
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-1">
                    Super Admin
                  </div>
                  <Link
                    href="/admin#users"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>User &amp; Role Manager</span>
                  </Link>
                  <Link
                    href="/admin#audit"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>System Audit Logs</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Bottom */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-2">
              <div className="flex items-center gap-2.5">
                <UserButton />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {userName || user?.fullName || 'SETGOI Engineer'}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    {roleDisplay}
                  </div>
                </div>
              </div>
              <Link
                href="/"
                className="w-full flex items-center justify-between text-xs font-mono text-zinc-500 pt-1"
              >
                <span>Return to Public Site</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN CANVAS & TOP UTILITY BAR
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Bar (h-14, sticky top-0, backdrop-blur) */}
        <header className="h-14 bg-white/85 backdrop-blur-md border-b border-zinc-200/90 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Mobile Hamburger + Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs font-mono truncate">
              {defaultBreadcrumbs.map((crumb, idx) => {
                const isLast = idx === defaultBreadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + idx}>
                    {idx > 0 && <span className="text-zinc-300">/</span>}
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="text-zinc-500 hover:text-zinc-900 transition-colors truncate"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-zinc-900 truncate">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right: MAKAUT Countdown + ⌘K Search + Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live MAKAUT Exam Countdown */}
            <div className="hidden lg:block">
              <ExamCountdown variant="pill" />
            </div>

            {/* ⌘K Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-600 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/70 transition-colors cursor-pointer"
              title="Quick Switcher (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline text-[11px] font-sans text-zinc-600">Search</span>
              <kbd className="text-[10px] bg-white border border-zinc-300 rounded px-1 text-zinc-500 font-mono shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Role Primary Action Button */}
            {defaultPrimaryAction && (
              <Link
                href={defaultPrimaryAction.href}
                className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold font-sans inline-flex items-center gap-1.5 shadow-2xs transition-all ${
                  defaultPrimaryAction.variant === 'purple'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : defaultPrimaryAction.variant === 'emerald'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-[#2563EB] text-white hover:bg-blue-700'
                }`}
              >
                <span>{defaultPrimaryAction.label}</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Body Canvas */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {children}
        </main>
      </div>

      {/* Global ⌘K Command Palette Dialog */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default AppShell;
