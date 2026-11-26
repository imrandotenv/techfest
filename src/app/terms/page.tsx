import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Terms of Use | SETTech',
  description:
    'Terms of Use for SETTech, the student-engineered MAKAUT B.Tech academic workspace for SETGOI Durgapur.',
};

const SECTIONS = [
  { id: 'purpose', label: '1. Academic Purpose & Disclaimer' },
  { id: 'roles', label: '2. Account Roles & Access Governance' },
  { id: 'conduct', label: '3. Acceptable Use & Content Integrity' },
  { id: 'viva', label: '4. AI Viva Simulator Disclaimer' },
];

export default function TermsOfUsePage() {
  return (
    <LegalPageLayout
      title="Terms of Use"
      subtitle="By accessing or using SETTech (https://settech.ceimran.in), you agree to comply with these Terms of Use governing academic resources, AI tools, and community forums for SETGOI Durgapur."
      activeRoute="/terms"
      sections={SECTIONS}
    >
      <section id="purpose" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">
          1. Academic Purpose &amp; Institutional Disclaimer
        </h2>
        <p>
          SETTech is a student-engineered academic productivity and learning suite built for
          B.Tech students and faculty of{' '}
          <strong>Sanaka Educational Trust&apos;s Group of Institutions (SETGOI)</strong>{' '}
          affiliated with{' '}
          <strong>Maulana Abul Kalam Azad University of Technology (MAKAUT)</strong>. While
          syllabus subjects, credits, and schedules are mapped to official MAKAUT R18/R20
          curricula, official university circulars, exam routines, and grade cards issued by
          MAKAUT (<span className="font-mono text-xs">makautexam.net</span>) and SETGOI
          administration remain authoritative.
        </p>
      </section>

      <section id="roles" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">
          2. Account Roles &amp; Access Governance
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Users must provide accurate branch/semester details or valid faculty/administrative
            credentials during onboarding.
          </li>
          <li>
            <strong>Faculty</strong> and <strong>Admin</strong> privileges are granted only after
            administrative verification and are strictly scoped to Admin-designated branches,
            semesters, and subject codes.
          </li>
          <li>
            Attempting to impersonate faculty or administrators, tamper with role metadata, or
            circumvent unauthenticated guest AI preview limits is strictly prohibited and may result
            in account suspension.
          </li>
        </ul>
      </section>

      <section id="conduct" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">
          3. Acceptable Use &amp; Content Integrity
        </h2>
        <p>
          All notes, solved PYQs, lab manuals, and forum discussions contributed to SETTech must
          uphold academic integrity:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Do not upload pirated commercial textbooks, spam, abusive language, or misleading
            examination notices.
          </li>
          <li>
            Authorized SETGOI Faculty and Admins reserve the right to verify, edit, pin, lock, or
            remove any uploaded study material, notice, or forum thread to maintain academic
            accuracy.
          </li>
        </ul>
      </section>

      <section id="viva" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">4. AI Viva Simulator Disclaimer</h2>
        <p>
          The AI Viva Studio and Indian Neural TTS voice examiner are educational practice aids
          designed to help students prepare for lab vivas and theory exams. AI-generated scores,
          hints, and evaluations are advisory only and do not constitute official internal CA marks
          or MAKAUT university examination assessments.
        </p>
      </section>
    </LegalPageLayout>
  );
}
