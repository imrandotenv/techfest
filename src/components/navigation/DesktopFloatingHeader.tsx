'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Menu, X, BookOpen, MessageSquare, Compass, Calculator, Home, Shield, Phone, ArrowRight, User } from 'lucide-react';
import { getResolvedRole, getDisplayRole, ROLE_CONFIGS } from '@/lib/auth-client';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export function DesktopFloatingHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const role = getResolvedRole(user);
  const displayRole = getDisplayRole(role);
  const roleBadgeClass = ROLE_CONFIGS[role]?.badgeClass || 'bg-slate-100 text-[#0F172A] border-[#E2E8F0]';
  const hasConsoleAccess = role === 'college' || role === 'admin';
  const consoleHref = role === 'admin' ? '/dashboard/admin' : '/dashboard/college';

  const navLinks: NavItem[] = [
    { href: '/notes', label: 'Notes', icon: BookOpen },
    { href: '/forum', label: 'Forum', icon: MessageSquare },
    { href: '/campus', label: 'Campus', icon: Compass },
    { href: '/tools', label: 'Tools', icon: Calculator },
  ];

  // Active label for mobile pill
  const activeNavItem = navLinks.find((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* Top Floating Pill Navbar (Responsive for Desktop & Mobile) */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="flex items-center justify-between gap-4 sm:gap-7 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/85 backdrop-blur-[12px] border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all">
          {/* Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-1.5 font-display font-bold text-sm tracking-tight text-[#0F172A] hover:opacity-80 transition-opacity shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>SanakaHub</span>
          </Link>

          {/* Active indicator badge on mobile */}
          {activeNavItem && (
            <span className="md:hidden text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-[#0F172A] border border-[#E2E8F0]">
              {activeNavItem.label}
            </span>
          )}

          {/* Desktop Primary Links with Active Route Highlighting */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Desktop Navigation">
            {navLinks.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-sans font-medium transition-all px-3 py-1.5 rounded-full ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-xs font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Console link + Clerk Auth + Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Elevated Console Link */}
            {hasConsoleAccess && (
              <Link
                href={consoleHref}
                className={`hidden sm:inline-flex text-[11px] font-mono transition-all px-2.5 py-1 rounded-full ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-purple-900 text-white font-bold'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                Console
              </Link>
            )}

            {/* Clerk User Button with Role Badge / Sign In Link */}
            {mounted ? (
              isLoaded ? (
                isSignedIn && user ? (
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold tracking-wider ${roleBadgeClass}`}>
                      {displayRole}
                    </span>
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'w-6 h-6 sm:w-7 sm:h-7 border border-[#E2E8F0]',
                        },
                      }}
                    />
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-sans font-medium bg-[#0F172A] text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    Sign In
                  </Link>
                )
              ) : (
                <Link
                  href="/sign-in"
                  className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-sans font-medium bg-[#0F172A] text-white hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Sign In
                </Link>
              )
            ) : (
              <div className="w-14 h-6 rounded-full bg-slate-100 animate-pulse" />
            )}

            {/* Mobile Drawer Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-full text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="relative z-10 w-full max-h-[85vh] overflow-y-auto bg-white border-t border-[#E2E8F0] rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-10"
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span className="font-display font-bold text-base text-[#0F172A]">
                  SanakaHub
                </span>
                <span className="text-[10px] font-mono text-[#475569] bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">
                  SETGOI
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#475569] hover:text-[#0F172A] transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile / Auth State in Mobile Drawer */}
            <div className="mb-5 p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center justify-between">
              {isLoaded && isSignedIn && user ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'w-7 h-7 border border-[#E2E8F0]',
                        },
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#0F172A] truncate">
                        {user.fullName || user.primaryEmailAddress?.emailAddress}
                      </div>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${roleBadgeClass}`}>
                        {displayRole}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-[#475569] font-sans">SanakaHub Account</span>
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-1 bg-[#0F172A] text-white text-xs font-medium rounded-full shadow-2xs hover:bg-slate-800 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="space-y-1 mb-6">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                  pathname === '/'
                    ? 'bg-[#0F172A] text-white font-semibold'
                    : 'text-[#0F172A] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className={`w-4 h-4 ${pathname === '/' ? 'text-white' : 'text-[#475569]'}`} />
                  <span className="text-sm font-medium">Home Portal</span>
                </div>
                <ArrowRight className={`w-4 h-4 ${pathname === '/' ? 'text-white' : 'text-slate-300'}`} />
              </Link>

              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#0F172A] text-white font-semibold'
                        : 'text-[#0F172A] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#475569]'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                  </Link>
                );
              })}

              {hasConsoleAccess && (
                <Link
                  href={consoleHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    pathname.startsWith('/dashboard')
                      ? 'bg-purple-900 text-white font-semibold'
                      : 'text-purple-900 bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-purple-700" />
                    <span className="text-sm font-medium">Institutional Console</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded">
                    {role}
                  </span>
                </Link>
              )}
            </div>

            {/* Helpline Footer info inside drawer */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2 text-xs font-mono text-[#475569]">
              <div className="flex items-center justify-between">
                <span>Anti-Ragging Helpline</span>
                <a href="tel:18001805522" className="text-[#0F172A] font-bold hover:underline">
                  1800-180-5522
                </a>
              </div>
              <div className="text-[11px] text-slate-400">
                SETGOI Durgapur • Affiliated with MAKAUT
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
