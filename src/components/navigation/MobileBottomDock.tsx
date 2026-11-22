'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  MoreHorizontal, 
  X, 
  ArrowRight, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  PhoneCall 
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { getResolvedRole, getDisplayRole, ROLE_CONFIGS } from '@/lib/auth-client';

export function MobileBottomDock() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = getResolvedRole(user);
  const displayRole = getDisplayRole(role);
  const roleBadgeClass = ROLE_CONFIGS[role]?.badgeClass || 'bg-slate-100 text-[#0F172A] border-[#E2E8F0]';
  const roleDashboardHref = role === 'admin' ? '/admin' : role === 'college' ? '/faculty' : '/student';
  const roleDashboardLabel = role === 'admin' ? 'Super Admin Console' : role === 'college' ? 'Faculty Academic Desk' : 'Student Academic Workspace';

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen]);

  const navItems = [
    { href: '/', label: 'Home', icon: Home, isActive: pathname === '/' },
    { href: '/notes', label: 'Notes', icon: FileText, isActive: pathname.startsWith('/notes') },
    { href: '/forum', label: 'Forum', icon: MessageSquare, isActive: pathname.startsWith('/forum') },
  ];

  return (
    <>
      {/* Slide-Up Drawer for Secondary Routes & Quick Utilities */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Drawer"
            className="relative z-10 w-full max-h-[80vh] overflow-y-auto bg-white border-t border-zinc-200 rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]"
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-5" />

            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <div>
                <span className="text-sm font-semibold text-zinc-950">
                  SanakaHub
                </span>
                <p className="text-xs text-zinc-500 font-mono">
                  SETGOI Durgapur • Directory
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary Routes */}
            <div className="space-y-1 mb-6">
              <Link
                href="/campus"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-zinc-500" />
                  <div>
                    <div className="text-sm font-medium text-zinc-900">Campus Directory</div>
                    <div className="text-xs text-zinc-500">Departments, faculty, bus routes</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </Link>

              <Link
                href="/tools"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="w-4 h-4 text-zinc-500" />
                  <div>
                    <div className="text-sm font-medium text-zinc-900">Academic Tools</div>
                    <div className="text-xs text-zinc-500">MAKAUT SGPA calculator and utilities</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </Link>

              {mounted && isSignedIn && (
                <Link
                  href={roleDashboardHref}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {roleDashboardLabel}
                      </div>
                      <div className="text-xs text-zinc-500">My Role Workspace</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </Link>
              )}
            </div>

            {/* Auth in Mobile Drawer */}
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[#475569]">Account</span>
              {mounted ? (
                isLoaded ? (
                  isSignedIn && user ? (
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${roleBadgeClass}`}>
                        {displayRole}
                      </span>
                      <UserButton
                        appearance={{
                          elements: {
                            userButtonAvatarBox: 'w-7 h-7 border border-[#E2E8F0]',
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setDrawerOpen(false)}
                      className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#0F172A] text-white hover:bg-slate-800 transition-colors shadow-2xs"
                    >
                      Sign In
                    </Link>
                  )
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setDrawerOpen(false)}
                    className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#0F172A] text-white hover:bg-slate-800 transition-colors shadow-2xs"
                  >
                    Sign In
                  </Link>
                )
              ) : null}
            </div>

            {/* Emergency Helpline */}
            <div className="pt-2 text-center">
              <a
                href="tel:18001805522"
                className="text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-zinc-400" />
                <span>Helpline: 1800-180-5522</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Dock (Mobile <768px) */}
      <div className="fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40 md:hidden pointer-events-auto pb-[env(safe-area-inset-bottom,0px)]">
        <nav
          aria-label="Mobile Bottom Navigation"
          className="rounded-full px-4 py-2 flex items-center justify-around bg-white/90 backdrop-blur-xl border border-zinc-200 shadow-lg"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
                  item.isActive
                    ? 'text-zinc-950 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* More (Drawer Trigger) */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            className="flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
          </button>
        </nav>
      </div>
    </>
  );
}
