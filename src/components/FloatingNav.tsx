'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Compass, 
  Calculator, 
  Search,
  Shield
} from 'lucide-react';
import { getResolvedRole, getDisplayRole, ROLE_CONFIGS } from '@/lib/auth-client';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { SetTechLogo } from '@/components/SetTechLogo';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/notes', label: 'Notes', icon: BookOpen },
  { href: '/forum', label: 'Forum', icon: MessageSquare },
  { href: '/campus', label: 'Campus', icon: Compass },
  { href: '/tools', label: 'Tools', icon: Calculator },
];

export function FloatingNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();

  // 60fps Smart Hide-on-Scroll Physics with 10px hysteresis anti-jitter threshold
  const { isVisible } = useScrollDirection({
    threshold: 10,
    topThreshold: 50,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut for Command Palette (Ctrl+K or ⌘K)
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

  // Hide floating navigation on auth screens and dedicated post-login app workspaces
  if (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/faculty') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard')
  ) {
    return null;
  }

  const role = getResolvedRole(user);
  const displayRole = getDisplayRole(role);
  const roleBadgeClass = ROLE_CONFIGS[role]?.badgeClass || 'bg-slate-100 text-[#0F172A] border-[#E2E8F0]';
  const roleDashboardHref = role === 'admin' ? '/admin' : role === 'college' ? '/faculty' : '/student';
  const roleDotColor = role === 'admin' ? 'bg-purple-500' : role === 'college' ? 'bg-emerald-500' : 'bg-[#2563EB]';

  return (
    <>
      {/* =========================================================================
          1. DESKTOP FLOATING PILL NAVBAR (>= 768px / md:block hidden)
          Fixed top-center, constrained width, 60fps hide-upwards on scroll down
          ========================================================================= */}
      <header
        className={`hidden md:block fixed top-4 left-1/2 z-50 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? '-translate-x-1/2 translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-x-1/2 -translate-y-[150%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-max max-w-4xl px-3 py-2 rounded-full bg-white/85 backdrop-blur-xl border border-zinc-200/90 shadow-[0_10px_30px_-5px_rgba(9,9,11,0.10)] flex items-center justify-between gap-5 lg:gap-7">
          {/* Brand Mark with Official Custom SVG Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-85 transition-opacity shrink-0 px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-full"
            aria-label="SETTech Homepage"
          >
            <SetTechLogo variant="full" size={20} textClassName="text-sm font-bold" />
          </Link>

          {/* Desktop Primary Route Links */}
          <nav className="flex items-center gap-1" aria-label="Main Navigation">
            {NAV_LINKS.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-xs font-sans transition-all px-3 py-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] font-medium shadow-2xs'
                      : 'text-zinc-600 hover:text-[#09090B] hover:bg-zinc-100/80 font-normal'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster: ⌘K Search + Console + Clerk Auth */}
          <div className="flex items-center gap-2.5">
            {/* Compact ⌘K Quick Search Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-zinc-600 bg-zinc-100/90 hover:bg-zinc-200/80 hover:text-zinc-950 border border-zinc-200/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              title="Quick Switcher (⌘K / Ctrl+K)"
              aria-label="Open command palette"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden lg:inline text-[11px] font-sans text-zinc-600">Search</span>
              <kbd className="text-[10px] bg-white border border-zinc-300 rounded px-1 text-zinc-500 font-mono shadow-2xs">⌘K</kbd>
            </button>

            {/* Clean Role-Aware Dashboard Link */}
            {mounted && isSignedIn && (
              <Link
                href={roleDashboardHref}
                className={`inline-flex items-center gap-1.5 text-xs font-sans transition-all px-3 py-1 rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  pathname === roleDashboardHref || pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/faculty') || pathname.startsWith('/student')
                    ? 'bg-zinc-900 text-white font-semibold border-zinc-900 shadow-2xs'
                    : 'text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border-zinc-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${roleDotColor}`} />
                <span>Dashboard</span>
              </Link>
            )}

            {/* Clerk Auth Integration */}
            {mounted ? (
              isLoaded ? (
                isSignedIn && user ? (
                  <div className="flex items-center gap-2">
                    {role !== 'student' && (
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold tracking-wider ${roleBadgeClass}`}>
                        {displayRole}
                      </span>
                    )}
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'w-7 h-7 border border-zinc-200',
                          userButtonPopoverCard: 'shadow-xl border border-zinc-200 rounded-xl',
                        },
                      }}
                    />
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-700 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    Sign In
                  </Link>
                )
              ) : (
                <div className="w-16 h-7 rounded-full bg-zinc-100 animate-pulse" />
              )
            ) : (
              <div className="w-16 h-7 rounded-full bg-zinc-100 animate-pulse" />
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE MINIMAL TOP BAR (< 768px / md:hidden)
          Only brand logo, ⌘K search trigger, and Clerk profile/sign-in
          ========================================================================= */}
      <header
        className={`md:hidden fixed top-3 left-1/2 z-40 w-[92%] max-w-md transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? '-translate-x-1/2 translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-x-1/2 -translate-y-[150%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-zinc-200/90 shadow-[0_4px_20px_-2px_rgba(9,9,11,0.06)] flex items-center justify-between">
          {/* Brand Mark with Official Custom SVG Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-full px-1"
            aria-label="SETTech Homepage"
          >
            <SetTechLogo variant="full" size={18} textClassName="text-sm font-bold" />
          </Link>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="p-1.5 rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              aria-label="Quick search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {mounted ? (
              isLoaded ? (
                isSignedIn && user ? (
                  <div className="flex items-center gap-1.5">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'w-6 h-6 border border-zinc-200',
                          userButtonPopoverCard: 'shadow-xl border border-zinc-200 rounded-xl',
                        },
                      }}
                    />
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-700 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    Sign In
                  </Link>
                )
              ) : (
                <div className="w-14 h-6 rounded-full bg-zinc-100 animate-pulse" />
              )
            ) : (
              <div className="w-14 h-6 rounded-full bg-zinc-100 animate-pulse" />
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          3. MOBILE BOTTOM THUMB DOCK (< 768px / md:hidden)
          Fixed in ergonomic thumb zone, safe-area compliant, 60fps hide-downwards
          Hidden on /viva studio to give 100% unobstructed thumb zone to chat input & mic
          ========================================================================= */}
      {!pathname.startsWith('/viva') && (
        <nav
          aria-label="Mobile Navigation"
          className={`md:hidden fixed left-1/2 z-50 w-[92%] max-w-md transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible
              ? '-translate-x-1/2 translate-y-0 opacity-100 pointer-events-auto'
              : '-translate-x-1/2 translate-y-[150%] opacity-0 pointer-events-none'
          }`}
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="w-full px-2 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-zinc-200/90 shadow-[0_10px_30px_-5px_rgba(9,9,11,0.12)] flex items-center justify-around">
            {NAV_LINKS.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center flex-1 min-w-[48px] min-h-[48px] py-1 px-1 rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isActive
                      ? 'text-[#2563EB]'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#2563EB]' : 'text-zinc-500'}`} />
                  <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-semibold text-[#2563EB]' : 'font-medium text-zinc-500'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-0.5" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Global ⌘K Command Palette Dialog */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}

export default FloatingNav;
