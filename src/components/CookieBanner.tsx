'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie, X, Shield, Sliders, Check, ExternalLink } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';

export function CookieBanner() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasConsent, setHasConsent] = useState<boolean>(true); // default true to avoid flash
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allowFunctional, setAllowFunctional] = useState(true);

  // Initialize and check localStorage on client mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('settech_cookie_consent') || localStorage.getItem('sanakahub_cookie_consent');
    if (!stored) {
      setHasConsent(false);
    } else {
      setHasConsent(true);
      setAllowFunctional(stored === 'all');
    }

    // Listen for custom trigger from Footer or /cookies page
    const handleOpenSettings = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('settech:open-cookie-settings', handleOpenSettings);
    window.addEventListener('sanakahub:open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('settech:open-cookie-settings', handleOpenSettings);
      window.removeEventListener('sanakahub:open-cookie-settings', handleOpenSettings);
    };
  }, []);

  // Hide completely on auth routes
  if (!mounted) return null;
  if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }

  const saveConsent = (choice: 'all' | 'essential') => {
    localStorage.setItem('settech_cookie_consent', choice);
    setHasConsent(true);
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent('all');
  };

  const handleEssentialOnly = () => {
    saveConsent('essential');
  };

  const handleSavePreferences = () => {
    saveConsent(allowFunctional ? 'all' : 'essential');
  };

  return (
    <>
      {/* Floating Bottom Cookie Consent Banner */}
      {!hasConsent && !isModalOpen && (
        <aside
          role="region"
          aria-label="Cookie and Privacy Consent"
          className="fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:w-[410px] z-40 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-2xl shadow-xl shadow-zinc-950/5 p-4 sm:p-5 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                  <Cookie className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                    <span>Cookie &amp; Privacy Choices</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">SETTech • SETGOI B.Tech</p>
                </div>
              </div>

              <button
                onClick={handleEssentialOnly}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
                title="Dismiss and keep Essential Only"
                aria-label="Dismiss and keep Essential Only"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              We use strictly necessary session cookies for Clerk authentication and optional local storage for your exam countdown target and viva practice. We <strong className="text-zinc-900">never sell student data or track ads</strong>.
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1 border-t border-zinc-100">
              <Link href="/cookies" className="text-blue-600 hover:underline">
                View Cookie Policy →
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
              >
                Preferences
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleEssentialOnly}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200/70 text-zinc-700 transition-colors text-center border border-zinc-200"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 sanaka-btn-primary py-2 px-3 rounded-xl text-xs font-semibold text-center"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white border border-zinc-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="cookie-modal-title" className="text-base font-bold text-zinc-950 font-display">
                    Cookie &amp; Storage Preferences
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    Version {LEGAL_CONFIG.policyVersion} • DPDP Act 2023 Compliant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-zinc-900 text-xs">Strictly Necessary Cookies</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Always Active
                  </span>
                </div>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Required for core platform security, Clerk user login sessions (<code className="font-mono text-zinc-800">__session</code>, <code className="font-mono text-zinc-800">__client_uat</code>), and role authorization. These cannot be disabled.
                </p>
              </div>

              {/* Category 2: Functional & Local Preferences */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cookie className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-zinc-900 text-xs">Functional Local Storage</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowFunctional}
                      onChange={(e) => setAllowFunctional(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Stores local student convenience data in browser memory: MAKAUT exam countdown target date, AI viva free question counters, and role dashboard preference. Does not transmit personal browsing habits to servers.
                </p>
              </div>

              {/* Notice regarding Advertising */}
              <div className="p-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 text-zinc-500 text-[11px] flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Zero Advertising, Marketing, or Tracking Pixels exist on SETTech.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <Link
                href="/cookies"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-mono text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Full Cookies Policy</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="sanaka-btn-primary px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Save Choices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
