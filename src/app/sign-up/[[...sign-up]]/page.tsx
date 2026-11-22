'use client';

import React from 'react';
import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { ArrowLeft, BookCheck, Calculator, MessageSquareCode, ExternalLink, ShieldCheck } from 'lucide-react';
import { SetTechLogo } from '@/components/SetTechLogo';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-12 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Left Column: Form & Back Navigation */}
      <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-screen">
        {/* Top Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to SETTech</span>
          </Link>
        </div>

        {/* Center: Clerk Card Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {/* Brand Header */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <SetTechLogo variant="full" size={26} textClassName="text-xl font-bold" subtitle="SETGOI Durgapur" showSubtitle />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-zinc-900">
              Create Engineering Account
            </h1>
            <p className="text-xs text-zinc-600 font-sans">
              Join your B.Tech peers at SETGOI for MAKAUT notes, calculators, and verified solutions.
            </p>
          </div>

          {/* Clerk SignUp Component */}
          <div className="w-full bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none p-0 border-0 bg-transparent w-full',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  formButtonPrimary:
                    'bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium rounded-lg py-2.5 transition-colors shadow-2xs font-sans',
                  footerActionLink: 'text-[#2563EB] hover:underline font-medium text-xs font-sans',
                  formFieldInput:
                    'border-zinc-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-xs rounded-lg py-2.5 px-3 font-sans',
                  socialButtonsBlockButton:
                    'border border-zinc-200 hover:bg-zinc-50 text-xs font-medium rounded-lg py-2.5 transition-colors font-sans text-zinc-800',
                  dividerLine: 'bg-zinc-200',
                  dividerText: 'text-zinc-500 text-[11px] font-mono',
                },
              }}
            />
          </div>

          {/* Institutional note */}
          <p className="mt-4 text-center text-[11px] font-mono text-zinc-400">
            Sanaka Educational Trust&apos;s Group of Institutions • Affiliated to MAKAUT
          </p>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center pt-4">
          <p className="text-[11px] text-zinc-500">
            By registering, you agree to SETTech&apos;s{' '}
            <Link href="/terms" className="underline hover:text-zinc-900">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="underline hover:text-zinc-900">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Right Column: SETGOI Engineering Branding & Quick Info */}
      <div 
        className="hidden lg:flex lg:col-span-6 xl:col-span-5 bg-[#F4F6FF] border-l border-zinc-200 flex-col justify-between p-8 xl:p-12 relative overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        {/* Top Identity Block */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-[#2563EB] text-[11px] font-mono font-medium border border-blue-200/60 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Official B.Tech Academic Suite</span>
          </div>
          <h2 className="text-xl font-display font-bold text-zinc-900 tracking-tight">
            Sanaka Educational Trust&apos;s Group of Institutions
          </h2>
          <p className="text-xs font-mono text-zinc-600 mt-1">
            Malandighi, Durgapur, WB 713212 • Approved by AICTE
          </p>
        </div>

        {/* Middle Feature Bullets */}
        <div className="space-y-4 my-8">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
              <BookCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 font-sans">Verified MAKAUT Vault</div>
              <div className="text-[11px] text-zinc-600 font-sans mt-0.5 leading-relaxed">
                Direct links to NPTEL lectures, GeeksforGeeks modules, syllabus PDFs, and verified past year questions.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 font-sans">Academic Utilities &amp; 75% Tracker</div>
              <div className="text-[11px] text-zinc-600 font-sans mt-0.5 leading-relaxed">
                MAKAUT 10-point SGPA/CGPA grade calculation alongside mandatory 75% class attendance &amp; safe bunk analysis.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 font-sans">Engineer-to-Engineer Discussions</div>
              <div className="text-[11px] text-zinc-600 font-sans mt-0.5 leading-relaxed">
                Ask doubts, share code snippets with syntax highlighting, and get official verified solutions from faculty.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Access: iCampus College ERP */}
        <div className="p-4 rounded-xl bg-white border border-zinc-200 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-semibold text-zinc-900 font-sans">SETGOI iCampus Portal</div>
            <div className="text-[11px] text-zinc-500 font-sans">Official institutional ERP &amp; attendance desk</div>
          </div>
          <a
            href="https://icampus.setgoi.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[#2563EB] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <span>Launch</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}