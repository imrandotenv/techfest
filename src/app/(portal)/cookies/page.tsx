'use client';

import React, { useState, useEffect } from 'react';
import { LegalLayout } from '@/components/LegalLayout';
import { LEGAL_CONFIG } from '@/config/legal';
import { Cookie, ShieldCheck, Sliders, RotateCcw, Check, Info, Laptop } from 'lucide-react';

export default function CookiesPage() {
  const [currentConsent, setCurrentConsent] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('settech_cookie_consent') || localStorage.getItem('sanakahub_cookie_consent');
      setCurrentConsent(stored);
    }
  }, []);

  const handleResetPreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('settech_cookie_consent');
      localStorage.removeItem('sanakahub_cookie_consent');
      setCurrentConsent(null);
      setResetMessage('Cookie preferences have been reset. Re-opening preferences banner...');
      // Dispatch custom event to tell CookieBanner to re-open
      window.dispatchEvent(new CustomEvent('settech:open-cookie-settings'));
      window.dispatchEvent(new CustomEvent('sanakahub:open-cookie-settings'));
      setTimeout(() => {
        setResetMessage(null);
      }, 4000);
    }
  };

  const handleOpenSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('settech:open-cookie-settings'));
      window.dispatchEvent(new CustomEvent('sanakahub:open-cookie-settings'));
    }
  };

  const tldr = [
    'No Advertising Cookies: SETTech uses zero ad trackers, commercial marketing pixels, or third-party behavioral cookies.',
    'Strictly Necessary: Session authentication cookies (__session, __client_uat) are required by Clerk to keep your login secure.',
    'Local Preferences: Features like the MAKAUT exam countdown and AI viva preview count store minimal state in localStorage on your device.',
    'Full User Control: You can review, modify, or completely reset your cookie choices at any time using the Reset button below.',
  ];

  return (
    <LegalLayout
      title="Cookie & Local Storage Policy"
      subtitle="Complete inventory of cookies, browser local storage keys, session markers, and student preference controls utilized by SETTech."
      badgeLabel="COOKIE TRANSPARENCY"
      tldrItems={tldr}
    >
      {/* 1. Overview */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Cookie className="w-5 h-5 text-blue-600" />
          <h2>1. What Are Cookies &amp; Local Storage?</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Cookies and HTML5 Local Storage are small text files or key-value pairs stored on your computer or mobile device when you browse SETTech. They allow the platform to remember your active sign-in session, prevent repeated logins across tabs, and store your semester examination target dates without burdening a remote database.
        </p>
      </section>

      {/* 2. Interactive Consent Status & Reset Action */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-5 border border-blue-200/80 bg-blue-50/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-zinc-950 font-display">
                Your Current Cookie Selection
              </h3>
            </div>
            <p className="text-xs text-zinc-600">
              Active status on this device:
              {currentConsent ? (
                <span className="ml-1.5 font-mono font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded uppercase text-[11px]">
                  {currentConsent === 'all' ? 'All Cookies & Storage Allowed' : 'Strictly Essential Only'}
                </span>
              ) : (
                <span className="ml-1.5 font-mono text-zinc-500 bg-zinc-200/60 px-2 py-0.5 rounded text-[11px]">
                  Default / Pending Preference Selection
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenSettings}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-xs"
            >
              Manage Preferences
            </button>
            <button
              onClick={handleResetPreferences}
              className="sanaka-btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Cookie Preferences</span>
            </button>
          </div>
        </div>

        {resetMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{resetMessage}</span>
          </div>
        )}
      </section>

      {/* 3. Comprehensive Inventory Table */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2>2. Active Cookies &amp; Storage Inventory</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {LEGAL_CONFIG.storageItems.length} Identified Keys
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Storage Key</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Provider</th>
                <th className="py-2.5 px-3">Purpose</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans text-zinc-600">
              {LEGAL_CONFIG.storageItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-zinc-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-500">
                    {item.type}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        item.category === 'strictly_necessary'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      }`}
                    >
                      {item.category === 'strictly_necessary' ? 'Strictly Necessary' : 'Functional'}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-zinc-700">
                    {item.provider}
                  </td>
                  <td className="py-3 px-3 text-zinc-600 max-w-xs leading-relaxed">
                    {item.purpose}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-500">
                    {item.duration}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        item.defaultStatus === 'Mandatory'
                          ? 'bg-zinc-100 text-zinc-800 font-semibold'
                          : 'text-zinc-500'
                      }`}
                    >
                      {item.defaultStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Browser Control Instructions */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Laptop className="w-5 h-5 text-blue-600" />
          <h2>3. Managing Cookies Directly In Your Browser</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Most modern web browsers allow you to manage or block cookies through their privacy settings. Please note that disabling Strictly Necessary session cookies will prevent login to student and faculty portals:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 font-sans">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <strong className="text-zinc-900 block font-sans">Google Chrome</strong>
            Settings → Privacy and security → Third-party cookies
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <strong className="text-zinc-900 block font-sans">Mozilla Firefox</strong>
            Settings → Privacy &amp; Security → Cookies and Site Data
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <strong className="text-zinc-900 block font-sans">Microsoft Edge</strong>
            Settings → Cookies and site permissions → Manage and delete cookies
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <strong className="text-zinc-900 block font-sans">Apple Safari</strong>
            Preferences / Settings → Privacy → Prevent cross-site tracking
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
