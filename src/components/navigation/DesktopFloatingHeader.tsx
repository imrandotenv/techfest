'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';

export function DesktopFloatingHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = (user?.publicMetadata?.role as string) || 'student';
  const hasConsoleAccess = role === 'college' || role === 'admin';
  const consoleHref = role === 'admin' ? '/dashboard/admin' : '/dashboard/college';

  const navLinks = [
    { href: '/notes', label: 'Notes' },
    { href: '/forum', label: 'Forum' },
    { href: '/campus', label: 'Campus' },
    { href: '/tools', label: 'Tools' },
  ];

  return (
    <header className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 items-center gap-8 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-zinc-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] pointer-events-auto">
      {/* Brand Mark */}
      <Link
        href="/"
        className="font-semibold text-zinc-950 tracking-tight text-sm hover:opacity-80 transition-opacity"
      >
        SanakaHub
      </Link>

      {/* Primary Links */}
      <nav className="flex items-center gap-6" aria-label="Desktop Navigation">
        {navLinks.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-medium transition-colors ${
                isActive
                  ? 'text-zinc-950 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-950'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions: Subtle Console (elevated role only) + Clerk Auth */}
      <div className="flex items-center gap-4">
        {hasConsoleAccess && (
          <Link
            href={consoleHref}
            className={`text-xs font-mono transition-colors ${
              pathname.startsWith('/dashboard')
                ? 'text-zinc-950 font-bold'
                : 'text-zinc-500 hover:text-zinc-950'
            }`}
          >
            Console
          </Link>
        )}

        {mounted ? (
          isLoaded ? (
            <>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-6 h-6 border border-zinc-200',
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#09090B] text-white hover:bg-zinc-800 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="px-3.5 py-1 rounded-full text-xs font-medium bg-[#09090B] text-white hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </Link>
          )
        ) : (
          <div className="w-14 h-6 rounded-full bg-zinc-100 animate-pulse" />
        )}
      </div>
    </header>
  );
}
