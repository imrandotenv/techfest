import React from 'react';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { GraduationCap, ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Sign In | SanakaHub - SETGOI Student & Faculty Portal',
  description: 'Sign in to access MAKAUT lecture notes, PYQs, SGPA calculators, campus transit schedules, and discussion forums.',
};

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
      <div className="w-full max-w-md mx-auto mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-mono text-zinc-600 mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SETGOI Durgapur • MAKAUT</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Welcome to SanakaHub
        </h1>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          Sign in with your student, faculty, or institutional account to access campus services.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full max-w-md',
              card: 'bg-white border border-zinc-200 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]',
              headerTitle: 'text-zinc-900 font-bold text-lg',
              headerSubtitle: 'text-zinc-500 text-xs',
              formButtonPrimary:
                'bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition-colors py-2.5',
              footerActionLink: 'text-zinc-900 hover:text-zinc-700 font-medium underline text-xs',
              formFieldInput:
                'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 text-xs rounded-lg',
              identityPreviewText: 'text-xs text-zinc-700 font-medium',
              identityPreviewEditButton: 'text-zinc-900 hover:text-zinc-700 text-xs font-medium',
            },
          }}
        />
      </div>

      <div className="mt-8 text-center text-xs text-zinc-400 font-mono flex items-center justify-center gap-4">
        <Link href="/" className="hover:text-zinc-700 transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-600" /> Clerk 3-Role RBAC
        </span>
      </div>
    </div>
  );
}
