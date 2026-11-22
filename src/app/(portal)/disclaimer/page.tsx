import React from 'react';
import { Metadata } from 'next';
import { LegalLayout } from '@/components/LegalLayout';
import { LEGAL_CONFIG } from '@/config/legal';
import { AlertCircle, GraduationCap, ShieldAlert, FileText, CheckCircle2, ArrowUpRight, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Academic & Copyright Disclaimer | SETTech',
  description:
    'Institutional independence disclaimer, MAKAUT academic calculation notice, Fair Use educational copyright statement, and DMCA takedown protocol for SETTech.',
};

export default function DisclaimerPage() {
  const tldr = [
    'Independent Student Project: SETTech is a student-built engineering utility. It is not an official administrative service of SETGOI Durgapur or MAKAUT.',
    'Official University Authority: For official grade cards, exam fees, enrollment records, or admission notices, always refer to icampus.setgoi.ac.in and makautexam.net.',
    'Calculators Are Estimates: The SGPA/CGPA and attendance calculators adhere to MAKAUT regulations, but university Controller of Examinations records are legally binding.',
    'Educational Fair Use: Study materials and question papers are shared by students under Section 52 of the Indian Copyright Act, 1957 for personal educational use.',
    'Prompt Takedown Protocol: Copyright holders may request removal of any material; we review and process takedown notices within 48 to 72 hours.',
  ];

  return (
    <LegalLayout
      title="Academic & Copyright Disclaimer"
      subtitle="Important institutional boundaries, educational fair-use principles, university examination disclaimers, and content takedown protocols for SETTech."
      badgeLabel="DISCLAIMER"
      tldrItems={tldr}
    >
      {/* 1. Independent Student Initiative Notice */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h2>1. Institutional Independence Notice</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          SETTech (<span className="font-mono text-zinc-800">settech.dev</span>) is an independent open-access student utility conceived, engineered, and maintained by B.Tech engineering students at Sanaka Educational Trust&apos;s Group of Institutions (SETGOI), Durgapur.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          <strong className="text-zinc-900">SETTech is NOT an official administrative, managerial, or legal website of Sanaka Educational Trust (SETGOI) or Maulana Abul Kalam Azad University of Technology (MAKAUT).</strong> It is not financed, legally operated, or endorsed by the college governing body or university registrar.
        </p>
      </section>

      {/* 2. Official University Portals */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h2>2. Authoritative Institutional Records</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          For all legally binding collegiate procedures—including official semester grade sheets, mark verification, re-evaluation applications, fee receipts, registration certificates, and admit cards—students and faculty must access the official institutional portals:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://icampus.setgoi.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300 transition-all group"
          >
            <div className="flex items-center justify-between font-mono font-bold text-blue-700 mb-1">
              <span>SETGOI iCampus Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </div>
            <p className="text-zinc-600">Official college intranet for attendance records, institutional fees, and departmental notices.</p>
          </a>

          <a
            href="https://makautexam.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300 transition-all group"
          >
            <div className="flex items-center justify-between font-mono font-bold text-blue-700 mb-1">
              <span>MAKAUT Exam Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600" />
            </div>
            <p className="text-zinc-600">Official examination registration, university MAR/MOOCs submission, and published semester grade sheets.</p>
          </a>
        </div>
      </section>

      {/* 3. Academic Calculators & Estimations */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <h2>3. Academic Calculators Disclaimer</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          The MAKAUT 10-point Credit Index Calculator, SGPA / CGPA / YGPA tools, and 75% Attendance Planner on SETTech are engineered in accordance with published university curriculum rubrics.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          However, calculations generated by these tools are advisory estimates for student guidance. Official grade sheets and transcripts issued by the Controller of Examinations, MAKAUT remain the sole authoritative academic record.
        </p>
      </section>

      {/* 4. Copyright & Fair Use Doctrine */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2>4. Educational Fair Use &amp; Copyright Notice</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          All study materials, lecture summaries, lab manuals, and previous year examination questions archived in the Academic Vault (<code className="font-mono text-zinc-800">/notes</code>) are made available strictly for non-commercial educational review and private study under <strong className="text-zinc-900">Section 52(1)(a) &amp; Section 52(1)(h) of the Indian Copyright Act, 1957</strong> (Fair Dealing for educational instruction).
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          SETTech does not claim ownership of official MAKAUT examination syllabi, university logo marks, or course curriculum frameworks. All university names, departmental identifiers, and trademarks are the property of their respective holders.
        </p>
      </section>

      {/* 5. Copyright Takedown Procedure */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <ShieldAlert className="w-5 h-5 text-blue-600" />
          <h2>5. DMCA / Content Takedown Procedure</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          If you are a copyright owner, faculty member, or authorized legal representative and believe that any content shared on SETTech infringes upon your intellectual property rights, please notify us immediately. We maintain a proactive notice-and-takedown policy:
        </p>

        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
          <p className="font-semibold text-zinc-900">To submit a takedown request, send an email to <a href={`mailto:${LEGAL_CONFIG.contactEmail}`} className="text-blue-600 hover:underline font-mono">{LEGAL_CONFIG.contactEmail}</a> including:</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-600">
            <li>Identification of the copyrighted material claimed to have been infringed (title, subject code, or URL link).</li>
            <li>Proof of authorization or ownership of the copyrighted work.</li>
            <li>Contact details (name, departmental affiliation, official email).</li>
            <li>A statement that the notification is made in good faith.</li>
          </ul>
          <p className="text-zinc-500 pt-1 text-[11px]">
            Upon receipt of a valid notice, our student administrators will review and remove the flagged material within <strong>48 to 72 hours</strong>.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
