'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { GraduationCap, ArrowLeft, Shield, ArrowRight, CheckCircle2, User, Building, ShieldAlert } from 'lucide-react';

export default function SignInPage() {
  const [emailInput, setEmailInput] = useState('');
  const [isSent, setIsSent] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#FAFAFA] to-white flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Focused Onboarding Card (7 cols on lg) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-zinc-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.06)] space-y-6">
            {/* Brand Header matching Hashnode */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-950">
                SanakaHub
              </span>
              <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-600 border border-zinc-200">
                SETGOI
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                Log in or sign up
              </h1>
              <p className="text-xs text-zinc-500">
                Access MAKAUT notes, 10-point SGPA tools, and campus utilities.
              </p>
            </div>

            {/* Clerk SignIn Component with Hashnode-style Appearance */}
            <div className="w-full">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none p-0 border-0 bg-transparent',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    formButtonPrimary:
                      'bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl py-3 transition-colors shadow-xs',
                    footerActionLink: 'text-blue-600 hover:underline font-medium text-xs',
                    formFieldInput:
                      'border-zinc-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs rounded-xl py-2.5 px-3',
                    socialButtonsBlockButton:
                      'border border-zinc-200 hover:bg-zinc-50 text-xs font-medium rounded-xl py-2.5 transition-colors',
                    dividerLine: 'bg-zinc-200',
                    dividerText: 'text-zinc-400 text-[11px] font-mono',
                  },
                }}
              />
            </div>

            {/* Quick 3-Role Access (Student | College | Admin) */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>QUICK 3-ROLE RBAC ACCESS</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Enabled
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/notes"
                  className="px-2 py-2 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-center transition-all group"
                >
                  <div className="text-[11px] font-semibold text-zinc-900 group-hover:text-blue-600">
                    Student
                  </div>
                  <div className="text-[9px] font-mono text-zinc-400">Notes Vault</div>
                </Link>

                <Link
                  href="/dashboard/college"
                  className="px-2 py-2 rounded-xl border border-zinc-200 hover:border-blue-300 hover:bg-blue-50/50 text-center transition-all group"
                >
                  <div className="text-[11px] font-semibold text-zinc-900 group-hover:text-blue-600">
                    Faculty
                  </div>
                  <div className="text-[9px] font-mono text-blue-600">Upload Notes</div>
                </Link>

                <Link
                  href="/dashboard/admin"
                  className="px-2 py-2 rounded-xl border border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50 text-center transition-all group"
                >
                  <div className="text-[11px] font-semibold text-zinc-900 group-hover:text-purple-600">
                    Admin
                  </div>
                  <div className="text-[9px] font-mono text-purple-600">Super Desk</div>
                </Link>
              </div>
            </div>

            {/* Terms Disclaimer */}
            <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
              By logging in or signing up using the options above, you agree to SanakaHub&apos;s{' '}
              <span className="underline cursor-pointer">Terms & Conditions</span> and{' '}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Right Column: Reference Endorsement & Navigation (5 cols on lg) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between py-6 space-y-12">
          {/* Top Right "Go back" link matching Hashnode */}
          <div className="flex justify-end">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go back to home</span>
            </Link>
          </div>

          {/* Testimonial Quote matching Hashnode reference */}
          <div className="space-y-6 max-w-sm">
            <blockquote className="text-base text-zinc-700 font-medium leading-relaxed italic">
              &ldquo;SanakaHub has transformed how our batch accesses MAKAUT PYQs and verifies semester notes. Zero noise, pure utility.&rdquo;
            </blockquote>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                LB
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-950">Liam Basil</div>
                <div className="text-xs text-zinc-500 font-mono">
                  CSE Class Representative • SETGOI
                </div>
              </div>
            </div>
          </div>

          {/* Accreditation Note */}
          <div className="text-xs font-mono text-zinc-400 space-y-1">
            <div>Sanaka Educational Trust&apos;s Group of Institutions</div>
            <div>Durgapur, West Bengal • Affiliated with MAKAUT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
