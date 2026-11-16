'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // The landing page '/' has its own dedicated Section 3 footer
  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="w-full border-t border-zinc-200 bg-[#FAFAFA] py-8 px-6 pb-24 md:pb-8 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <span>SanakaHub • SETGOI</span>
        <span>
          Anti-Ragging & Medical Helpline:{' '}
          <a
            href="tel:18001805522"
            className="text-zinc-700 hover:text-zinc-950 font-medium"
          >
            1800-180-5522
          </a>
        </span>
      </div>
    </footer>
  );
}
