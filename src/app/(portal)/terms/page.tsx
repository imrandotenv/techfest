import React from 'react';
import { Metadata } from 'next';
import { LegalLayout } from '@/components/LegalLayout';
import { BookOpen, CheckCircle, ShieldAlert, Award, FileText, Ban, Users, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Academic Honor Code | SanakaHub',
  description:
    'Terms of service, student community guidelines, academic honor code, and vault contribution rules for SanakaHub at SETGOI Durgapur.',
};

export default function TermsPage() {
  const tldr = [
    'Purely Academic Use: SanakaHub is strictly dedicated to engineering study, syllabus guidance, and MAKAUT exam preparation.',
    'Zero Cheating / Live Exam Misconduct: Using the platform during active university examinations or soliciting live exam answers is strictly forbidden and results in immediate ban.',
    'Respect & Anti-Ragging: Defamation, harassment, hate speech, and ragging facilitation violate our terms and will be reported to SETGOI administration and law enforcement.',
    'Honor Code on Uploads: Only upload authentic personal lecture notes, faculty-approved summaries, or public syllabus/PYQ documents.',
    'Role Responsibilities: Student, Faculty, and Admin roles must adhere to their authorized scope. Impersonating faculty or tampering with role metadata is prohibited.',
  ];

  return (
    <LegalLayout
      title="Terms of Service & Academic Honor Code"
      subtitle="The community standards, contribution guidelines, and code of conduct governing all engineering students, faculty, and users of SanakaHub."
      badgeLabel="TERMS & CODE"
      tldrItems={tldr}
    >
      {/* 1. Acceptance of Terms */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2>1. Acceptance of Terms &amp; Scope</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          By accessing or using SanakaHub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, along with our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and <a href="/disclaimer" className="text-blue-600 hover:underline">Academic Disclaimer</a>.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          SanakaHub is an independent academic utility operated by student engineers of SETGOI Durgapur. If you do not agree to these terms, you must refrain from using the platform and its tools.
        </p>
      </section>

      {/* 2. Academic Honor Code & Zero Tolerance */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4 border-l-4 border-l-rose-600">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h2>2. Academic Honor Code &amp; Prohibited Conduct</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          SanakaHub exists to elevate the engineering caliber and peer collaboration of SETGOI students. We maintain zero tolerance for activities that compromise academic integrity or campus safety:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700">
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
            <span className="font-semibold text-rose-950 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              Live Examination Malpractice
            </span>
            <p className="text-zinc-600">
              Posting live university exam questions, soliciting answers during ongoing MAKAUT tests, or sharing unapproved practical test keys is strictly forbidden.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
            <span className="font-semibold text-rose-950 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              Ragging &amp; Campus Bullying
            </span>
            <p className="text-zinc-600">
              Any attempt to coordinate, facilitate, or promote ragging, harassment, or intimidation of junior students will be immediately escalated to the National Anti-Ragging Helpline (1800-180-5522) and SETGOI Proctorial Committee.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
            <span className="font-semibold text-rose-950 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              Commercial Advertising &amp; Spam
            </span>
            <p className="text-zinc-600">
              Unsolicited commercial advertisements, promotional referral links, paid assignment writing services, and irrelevant spam in the Q&amp;A forum are prohibited.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
            <span className="font-semibold text-rose-950 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              Platform Tampering
            </span>
            <p className="text-zinc-600">
              Automated scraping, denial-of-service probing, token spoofing, or attempting to bypass Clerk Role-Based Access Control (RBAC) checks will trigger IP-level blocks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Role-Based Permissions & Access */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Users className="w-5 h-5 text-blue-600" />
          <h2>3. Role-Based Access Control (RBAC) Rules</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          SanakaHub enforces strict Zero-Trust RBAC to protect institutional workflows:
        </p>

        <div className="space-y-3 text-xs sm:text-sm text-zinc-600">
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-100 text-blue-800 font-bold shrink-0">
              STUDENT
            </span>
            <p className="leading-relaxed">
              Standard access to Academic Notes Vault, AI Viva Studio practice rounds, Discussion Forum questions &amp; answers, SGPA/Attendance calculators, and Campus Lab directory.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-purple-50/40 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-100 text-purple-800 font-bold shrink-0">
              FACULTY
            </span>
            <p className="leading-relaxed">
              Authorized to verify peer notes in the Academic Vault, award &ldquo;Verified by Faculty&rdquo; badges, post official academic departmental notices, and moderate forum threads.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-rose-50/30 flex items-start gap-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-100 text-rose-800 font-bold shrink-0">
              ADMIN
            </span>
            <p className="leading-relaxed">
              System administration, user role assignment and revocation, content takedown audit oversight, and security rate-limiting control.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Vault Content & Copyright Rules */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Award className="w-5 h-5 text-blue-600" />
          <h2>4. Notes Vault Contribution &amp; Fair Use</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          When sharing study resources in the Academic Notes Vault (<code className="font-mono text-zinc-800">/notes</code>):
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 list-disc list-inside leading-relaxed">
          <li>You warrant that you own or have educational distribution rights to the lecture summaries, handwritten notebooks, and laboratory records you submit.</li>
          <li>All contributions are shared under the <strong>Fair Use Doctrine (Section 52 of the Indian Copyright Act, 1957)</strong> for non-commercial educational instruction.</li>
          <li>Commercial copyrighted publications, pirated full-length publisher textbooks, or proprietary question banks under commercial embargo must NOT be uploaded.</li>
        </ul>
      </section>

      {/* 5. Suspension & Termination */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Scale className="w-5 h-5 text-blue-600" />
          <h2>5. Moderation, Warning &amp; Termination</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          We reserve the right to remove any post, document, or viva interaction that violates these terms. Repeated or egregious infractions (such as ragging advocacy or exam malpractice) will result in immediate and permanent account termination, IP blocking, and referral to SETGOI college proctors.
        </p>
      </section>
    </LegalLayout>
  );
}
