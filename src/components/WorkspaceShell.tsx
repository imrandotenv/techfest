'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Eye,
  RotateCcw,
  PlayCircle,
} from 'lucide-react';
import { getResolvedRole, getDisplayRole } from '@/lib/auth-client';
import { useRolePreview } from '@/context/RolePreviewContext';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { ExamCountdown } from '@/components/ExamCountdown';
import { SetTechLogo } from '@/components/SetTechLogo';
import { useAcademicProfile } from '@/hooks/useAcademicProfile';
import { EditAcademicProfileModal } from '@/components/EditAcademicProfileModal';

export interface WorkspaceShellProps {
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

export function WorkspaceShell({
  children,
  breadcrumbs,
  roleTitle,
  currentRole,
  userName,
  userEmail,
  primaryAction,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { profile, updateProfile } = useAcademicProfile();
  const { previewRole, setPreviewRole, resetToAdmin, isRealAdmin, isPreviewMode } = useRolePreview();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
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

  const baseRole = currentRole
    ? currentRole === 'faculty'
      ? 'college'
      : currentRole
    : getResolvedRole(user);

  const canPreviewRoles = isRealAdmin || baseRole === 'admin';
  const resolvedRole =
    canPreviewRoles && previewRole !== 'ADMIN'
      ? previewRole === 'FACULTY'
        ? 'college'
        : 'student'
      : baseRole;

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

  const isNavActive = (href: string) => {
    if (href === '/student' || href === '/faculty' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row antialiased text-[#09090B]">
      {/* =========================================================================
          1. DESKTOP MINIMALIST LEFT SIDEBAR (w-60 = 240px, sticky, border-r)
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[#E4E4E7] h-screen sticky top-0 shrink-0 z-40 select-none">
        {/* Brand Header & Role Badge */}
        <div className="h-[60px] px-4 border-b border-[#E4E4E7] flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="flex items-center hover:opacity-85 transition-opacity"
            aria-label="SETTech Homepage"
          >
            <SetTechLogo variant="full" size={20} textClassName="text-sm font-bold tracking-tight" />
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
              Workspace Core
            </div>

            <Link
              href={roleWorkspaceHref}
              className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                isNavActive(roleWorkspaceHref)
                  ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#2563EB] before:rounded-r-full'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                <span>Overview</span>
              </div>
            </Link>

            <Link
              href="/viva"
              className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                isNavActive('/viva')
                  ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#2563EB] before:rounded-r-full'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>AI Viva Studio</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#2563EB]">
                VOICE
              </span>
            </Link>

            <Link
              href="/lectures"
              className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                isNavActive('/lectures')
                  ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#2563EB] before:rounded-r-full'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <span>Course Lectures</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                NPTEL
              </span>
            </Link>

            <Link
              href="/notes"
              className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                isNavActive('/notes')
                  ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#2563EB] before:rounded-r-full'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-zinc-500" />
                <span>Notes &amp; Lab Vault</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.2 rounded">
                MAKAUT
              </span>
            </Link>

            <Link
              href="/forum"
              className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                isNavActive('/forum')
                  ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#2563EB] before:rounded-r-full'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-zinc-500" />
                <span>Campus Forum</span>
              </div>
            </Link>

            <Link
              href="/tools"
              className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                isNavActive('/tools')
                  ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#2563EB] before:rounded-r-full'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-4 h-4 text-zinc-500" />
                <span>Student Utilities</span>
              </div>
            </Link>

            <Link
              href="/campus"
              className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                isNavActive('/campus')
                  ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#2563EB] before:rounded-r-full'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
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
                className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                  pathname === '/faculty'
                    ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-emerald-600 before:rounded-r-full'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Verification Queue</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  3
                </span>
              </Link>

              <Link
                href="/notices"
                className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                  isNavActive('/notices')
                    ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-emerald-600 before:rounded-r-full'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-zinc-500" />
                  <span>Campus Notices</span>
                </div>
              </Link>

              <Link
                href="/forum?filter=unanswered"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
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
                className={`relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all ${
                  pathname === '/admin'
                    ? 'bg-[#F4F4F5] text-[#18181B] font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-purple-600 before:rounded-r-full'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>User &amp; Role Manager</span>
                </div>
              </Link>

              <Link
                href="/campus?tab=directory"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-zinc-500" />
                  <span>Campus Directory</span>
                </div>
              </Link>

              <Link
                href="/admin#audit"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>System Audit Logs</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Pinned Bottom User & Public Exit Strip */}
        <div className="p-3 border-t border-[#E4E4E7] bg-[#FAFAFA] space-y-2.5 shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-7 h-7 border border-zinc-200 rounded-full',
                  userButtonPopoverCard: 'shadow-xl border border-zinc-200 rounded-xl font-sans',
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#18181B] truncate">
                  {userName || user?.fullName || 'SETGOI Member'}
                </span>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${roleBadgeStyle}`}>
                  {roleDisplay}
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 truncate">
                {userEmail || user?.primaryEmailAddress?.emailAddress || 'member@setgoi.ac.in'}
              </div>
            </div>
          </div>

          {/* Student Academic Info Pill */}
          {resolvedRole === 'student' && (
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-[11px] font-mono">
              <span className="font-semibold text-[#2563EB]">
                {profile.branch} • Sem {profile.semester}
              </span>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="text-zinc-500 hover:text-zinc-900 underline text-[10px] cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}

          <Link
            href="/"
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
          >
            <span>← Back to Public Site</span>
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
            <div className="h-[60px] px-4 border-b border-[#E4E4E7] flex items-center justify-between">
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
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Nav Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-1">
                  Workspace
                </div>
                <Link
                  href={roleWorkspaceHref}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                    pathname === roleWorkspaceHref
                      ? 'bg-[#F4F4F5] text-[#18181B] font-bold'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                  <span>Overview</span>
                </Link>

                <Link
                  href="/viva"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <span>AI Viva Studio</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#2563EB]">
                    VOICE
                  </span>
                </Link>

                <Link
                  href="/lectures"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-2.5">
                    <PlayCircle className="w-4 h-4 text-emerald-600" />
                    <span>Course Lectures</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    NPTEL
                  </span>
                </Link>

                <Link
                  href="/notes"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-zinc-500" />
                    <span>Notes &amp; Lab Vault</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.2 rounded">
                    MAKAUT
                  </span>
                </Link>

                <Link
                  href="/forum"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <MessageSquare className="w-4 h-4 text-zinc-500" />
                  <span>Campus Forum</span>
                </Link>

                <Link
                  href="/tools"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <Calculator className="w-4 h-4 text-zinc-500" />
                  <span>Student Utilities</span>
                </Link>

                <Link
                  href="/campus"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <Compass className="w-4 h-4 text-zinc-500" />
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
                    <div className="flex items-center gap-2.5">
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    <Bell className="w-4 h-4 text-zinc-500" />
                    <span>Campus Notices</span>
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>User &amp; Role Manager</span>
                  </Link>
                  <Link
                    href="/admin#audit"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>System Audit Logs</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Bottom */}
            <div className="p-4 border-t border-[#E4E4E7] bg-zinc-50 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <UserButton />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {userName || user?.fullName || 'SETGOI Member'}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    {roleDisplay}
                  </div>
                </div>
              </div>

              {resolvedRole === 'student' && (
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-[11px] font-mono">
                  <span className="font-semibold text-[#2563EB]">
                    {profile.branch} • Sem {profile.semester}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setIsEditProfileOpen(true);
                    }}
                    className="text-zinc-500 hover:text-zinc-900 underline text-[10px] cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}

              <Link
                href="/"
                className="w-full flex items-center justify-between text-xs font-mono text-zinc-500 pt-1"
              >
                <span>← Back to Public Site</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN CANVAS & 60PX UNIFIED TOP UTILITY BAR
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Bar (h-[60px], sticky top-0, frosted glass bg-white/80) */}
        <header className="h-[60px] bg-white/80 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Mobile Hamburger + Breadcrumbs */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors"
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

          {/* Right: MAKAUT Countdown + ⌘K Search + Role Switcher (Admin) + UserButton */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live MAKAUT Exam Countdown */}
            <div className="hidden lg:block">
              <ExamCountdown variant="pill" />
            </div>

            {/* ⌘K Command Palette Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono text-zinc-600 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/70 transition-colors cursor-pointer"
              title="Quick Switcher (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline text-[11px] font-sans text-zinc-600">Search</span>
              <kbd className="text-[10px] bg-white border border-zinc-300 rounded px-1 text-zinc-500 font-mono shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Admin Role View Switcher Slot (Live Preview Mode) */}
            {canPreviewRoles && (
              <div
                className="hidden md:flex items-center gap-0.5 p-0.5 bg-zinc-100/90 border border-zinc-200 rounded-xl text-[11px] font-mono"
                role="group"
                aria-label="Admin Role View Switcher"
              >
                <button
                  type="button"
                  onClick={() => {
                    setPreviewRole('ADMIN');
                    if (pathname !== '/admin') router.push('/admin');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    previewRole === 'ADMIN'
                      ? 'bg-white text-purple-700 font-bold shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Admin View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRole('FACULTY')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    previewRole === 'FACULTY'
                      ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Faculty View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewRole('STUDENT')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    previewRole === 'STUDENT'
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Student View
                </button>
              </div>
            )}

            {/* Role Primary Action Button */}
            {defaultPrimaryAction && (
              <Link
                href={defaultPrimaryAction.href}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sans inline-flex items-center gap-1.5 shadow-2xs transition-all ${
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

            {/* Header UserButton for quick account controls */}
            <div className="pl-1 border-l border-zinc-200">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-7 h-7 border border-zinc-200 rounded-full',
                    userButtonPopoverCard: 'shadow-xl border border-zinc-200 rounded-xl font-sans',
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* High-Visibility Admin Preview Mode Banner */}
        {canPreviewRoles && isPreviewMode && (
          <div className="bg-amber-50 border-b border-amber-200/90 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-950">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-200/70 text-amber-800">
                <Eye className="w-3.5 h-3.5" />
              </span>
              <span>
                Viewing as <strong className="font-bold">{previewRole}</strong> (Admin Preview Mode) — Real permissions remain <strong className="font-bold text-purple-800">ADMIN</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile quick switch */}
              <div className="flex md:hidden items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewRole(previewRole === 'STUDENT' ? 'FACULTY' : 'STUDENT')}
                  className="px-2 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-mono text-amber-900"
                >
                  Switch to {previewRole === 'STUDENT' ? 'Faculty' : 'Student'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetToAdmin();
                  if (pathname !== '/admin') router.push('/admin');
                }}
                className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-sans font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Return to Admin View</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body Canvas with Alabaster background and mobile bottom clearance */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* =========================================================================
          4. MOBILE FLOATING BOTTOM THUMB-ZONE BAR (< 768px / md:hidden)
          ========================================================================= */}
      <nav
        aria-label="Mobile workspace navigation"
        className="fixed bottom-0 inset-x-0 h-14 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 z-40 px-3 flex md:hidden items-center justify-around shadow-lg"
      >
        <Link
          href={roleWorkspaceHref}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono ${
            isNavActive(roleWorkspaceHref) ? 'text-[#2563EB] font-bold' : 'text-zinc-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Desk</span>
        </Link>

        <Link
          href="/viva"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono ${
            isNavActive('/viva') ? 'text-[#2563EB] font-bold' : 'text-zinc-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Viva</span>
        </Link>

        <Link
          href="/notes"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono ${
            isNavActive('/notes') ? 'text-[#2563EB] font-bold' : 'text-zinc-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Notes</span>
        </Link>

        <Link
          href="/tools"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono ${
            isNavActive('/tools') ? 'text-[#2563EB] font-bold' : 'text-zinc-500'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Tools</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-900"
        >
          <Menu className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>

      {/* Global ⌘K Command Palette Dialog */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Edit Academic Profile Modal */}
      <EditAcademicProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </div>
  );
}

export default WorkspaceShell;
