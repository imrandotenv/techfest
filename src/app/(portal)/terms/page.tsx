import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookCheck, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Scale, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Academic Honor Code | SanakaHub SETGOI',
  description:
    'Institutional terms of service, academic honor code, and content contribution guidelines for SanakaHub at SETGOI Durgapur.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-4 sm:pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to SanakaHub</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-3 pb-6 border-b border-[#E2E8F0]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold tracking-wider uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>Academic Honor Code</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#0F172A] tracking-tight">
            Terms of Service &amp; Community Guidelines
          </h1>

          <p className="text-xs sm:text-sm font-sans text-[#475569] leading-relaxed">
            Last Updated: November 2026 • Sanaka Educational Trust&apos;s Group of Institutions (SETGOI), Durgapur.
          </p>
        </div>

        {/* Terms Content Sections */}
        <div className="space-y-8 text-sm font-sans text-[#475569] leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <BookCheck className="w-4 h-4 text-[#2563EB]" />
              <h2>1. Educational Purpose &amp; Fair Use</h2>
            </div>
            <p>
              SanakaHub is provided exclusively to support the engineering education, academic study, and campus life of students, faculty, and researchers of SETGOI Durgapur. Notes, previous years&apos; question papers (PYQs), and laboratory manuals are distributed under fair-use educational principles.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2>2. Vault Upload &amp; Faculty Verification Protocol</h2>
            </div>
            <p>
              By uploading materials to the MAKAUT Notes Vault, you affirm that the content represents accurate syllabus material, authentic personal lecture notes, or public university examination papers. All submissions undergo algorithmic scanning and institutional faculty moderation before verified badges are awarded.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <h2>3. Discussion Forum &amp; Campus Conduct</h2>
            </div>
            <p>
              The SanakaHub Forum is an academic community. Users agree to engage with respect and professionalism. Defamation, hate speech, ragging facilitation, exam malpractice coordination, and unapproved commercial promotions are strictly prohibited and subject to institutional disciplinary action under SETGOI campus rules.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2>4. MAKAUT Grading Disclaimer</h2>
            </div>
            <p>
              The MAKAUT 10-point Credit Index and SGPA/CGPA Calculators are built in accordance with the official Maulana Abul Kalam Azad University of Technology credit grading schema. However, official grade cards issued directly by the University Controller of Examinations remain the final and definitive legal record.
            </p>
          </section>

        </div>

        {/* Contact Footer */}
        <div className="pt-6 border-t border-[#E2E8F0] text-xs font-mono text-[#475569] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>SanakaHub Academic Desk • SETGOI Durgapur, West Bengal 713212</span>
          <Link href="/privacy" className="text-[#2563EB] hover:underline font-semibold">
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
