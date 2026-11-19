import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Database, EyeOff, Server, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SanakaHub SETGOI',
  description:
    'Institutional privacy policy and data governance rules for SanakaHub, SETGOI Durgapur student portal and MAKAUT notes vault.',
};

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-blue-50 text-[#2563EB] border border-blue-200 font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Institutional Governance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#0F172A] tracking-tight">
            SanakaHub Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm font-sans text-[#475569] leading-relaxed">
            Effective Date: November 2026 • Governing Sanaka Educational Trust&apos;s Group of Institutions (SETGOI), Durgapur.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-sm font-sans text-[#475569] leading-relaxed">
          
          {/* Section 1 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <Lock className="w-4 h-4 text-[#2563EB]" />
              <h2>1. Zero Commercial Advertising &amp; No Data Monetization</h2>
            </div>
            <p>
              SanakaHub is an institutional academic portal built by SETGOI students and faculty. We do not display third-party advertisements, monetize student browsing habits, or sell academic records to commercial marketing agencies or data brokers.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <EyeOff className="w-4 h-4 text-[#2563EB]" />
              <h2>2. Client-Side Academic Calculators (SGPA / CGPA / YGPA)</h2>
            </div>
            <p>
              All academic grade computations performed using the MAKAUT 10-point Credit Index Calculator execute entirely within your client browser session. Your letter grades, theoretical credit distributions, and cumulative GPA records are never saved to backend tracking databases unless you explicitly request institutional audit export.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <Database className="w-4 h-4 text-[#2563EB]" />
              <h2>3. Academic Notes Vault &amp; User Submissions</h2>
            </div>
            <p>
              When contributing syllabus copies, handwritten lecture notes, laboratory manuals, or solved university question papers, your submitted name and departmental role (Student or Faculty) are indexed to facilitate academic peer review and faculty verification. Materials deemed proprietary or violating MAKAUT copyright will be removed upon verified request.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <Server className="w-4 h-4 text-[#2563EB]" />
              <h2>4. Authentication &amp; Institutional Session Security</h2>
            </div>
            <p>
              User authentication, identity provisioning, and password encryption are managed through enterprise-grade Clerk infrastructure using TLS 1.3 encryption. Passwords and credentials are never stored in plaintext on SanakaHub application servers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[#0F172A] font-display font-bold text-base">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              <h2>5. Confidential Campus Safety &amp; Helplines</h2>
            </div>
            <p>
              Inquiries, emergency helpline triggers, and reports directed through our campus safety portal (including Anti-Ragging and Women&apos;s Safety desks) are processed with strict institutional confidentiality directly to designated SETGOI administrative officers.
            </p>
          </section>

        </div>

        {/* Contact Footer */}
        <div className="pt-6 border-t border-[#E2E8F0] text-xs font-mono text-[#475569] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>SanakaHub Data Protection • SETGOI Durgapur, West Bengal 713212</span>
          <Link href="/terms" className="text-[#2563EB] hover:underline font-semibold">
            View Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
