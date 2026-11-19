'use client';

import React from 'react';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { RoleSelector } from '@/components/auth/RoleSelector';

export default function SignInPage() {
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
          <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-[0_20px_60px_rgba(15,23,42,0.06)] space-y-6">
            {/* Brand Header matching Hashnode */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[#0F172A]">
                SanakaHub
              </span>
              <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-[#475569] border border-[#E2E8F0]">
                SETGOI
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-display font-bold tracking-tight text-[#0F172A]">
                Log in or sign up
              </h1>
              <p className="text-xs font-sans text-[#475569]">
                Access MAKAUT notes, 10-point SGPA tools, and campus utilities.
              </p>
            </div>

            {/* Interactive Role Selector for Clerk Onboarding */}
            <RoleSelector />

            {/* Clerk SignIn Component with Clean Appearance */}
            <div className="w-full pt-1">
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none p-0 border-0 bg-transparent w-full',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    formButtonPrimary:
                      'bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl py-3 transition-colors shadow-2xs font-sans',
                    footerActionLink: 'text-[#2563EB] hover:underline font-medium text-xs font-sans',
                    formFieldInput:
                      'border-[#E2E8F0] focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] text-xs rounded-xl py-2.5 px-3 font-sans',
                    socialButtonsBlockButton:
                      'border border-[#E2E8F0] hover:bg-slate-50 text-xs font-medium rounded-xl py-2.5 transition-colors font-sans text-[#0F172A]',
                    dividerLine: 'bg-[#E2E8F0]',
                    dividerText: 'text-[#475569] text-[11px] font-mono',
                  },
                }}
              />
            </div>

            {/* Terms Disclaimer */}
            <p className="text-[11px] font-sans text-[#475569] text-center leading-relaxed pt-2 border-t border-[#E2E8F0]">
              By logging in or signing up using the options above, you agree to SanakaHub&apos;s{' '}
              <span className="underline cursor-pointer text-[#0F172A]">Terms &amp; Conditions</span> and{' '}
              <span className="underline cursor-pointer text-[#0F172A]">Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Right Column: Reference Endorsement & Navigation (5 cols on lg) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between py-6 space-y-12">
          {/* Top Right "Go back" link matching Hashnode */}
          <div className="flex justify-end">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go back to home</span>
            </Link>
          </div>

          {/* Testimonial Quote matching Hashnode reference */}
          <div className="space-y-6 max-w-sm">
            <blockquote className="text-base text-slate-800 font-sans font-medium leading-relaxed italic">
              &ldquo;SanakaHub has transformed how our batch accesses MAKAUT PYQs and verifies semester notes. Zero noise, pure utility.&rdquo;
            </blockquote>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                LB
              </div>
              <div>
                <div className="text-sm font-sans font-bold text-[#0F172A]">Liam Basil</div>
                <div className="text-xs text-[#475569] font-mono">
                  CSE Class Representative • SETGOI
                </div>
              </div>
            </div>
          </div>

          {/* Accreditation Note */}
          <div className="text-xs font-mono text-[#475569] space-y-1">
            <div>Sanaka Educational Trust&apos;s Group of Institutions</div>
            <div>Durgapur, West Bengal • Affiliated with MAKAUT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
