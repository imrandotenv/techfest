import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Privacy Policy | SETTech',
  description:
    'Privacy Policy for SETTech (https://settech.ceimran.in), the B.Tech academic workspace for SETGOI Durgapur.',
};

const SECTIONS = [
  { id: 'collect', label: '1. Information We Collect' },
  { id: 'use', label: '2. How We Use Your Data' },
  { id: 'processors', label: '3. Infrastructure & Sub-Processors' },
  { id: 'retention', label: '4. Data Retention, Access & Deletion' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="This Privacy Policy explains how SETTech (https://settech.ceimran.in), built for students and faculty of Sanaka Educational Trust's Group of Institutions (SETGOI), Malandighi, Durgapur, collects, processes, and protects your academic and account information."
      activeRoute="/privacy"
      sections={SECTIONS}
    >
      <section id="collect" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">1. Information We Collect</h2>
        <p>
          We collect only the information necessary to provide an authenticated, syllabus-accurate
          B.Tech workspace for SETGOI students, faculty, and administrators:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Account Identity (via Google / Email OAuth):</strong> Full name, verified email
            address, and profile avatar synchronized through Clerk Authentication.
          </li>
          <li>
            <strong>Academic Profile Details:</strong> Your SETGOI B.Tech branch (CSE, CSE-AIML,
            CSE-DS, ECE, EE, EEE, ME, or CE), current semester (1–8), passout year, and optional
            MAKAUT university roll number.
          </li>
          <li>
            <strong>Faculty &amp; Admin Verification Metadata:</strong> Employee or office ID,
            academic designation, primary department, and Admin-assigned branch, semester, and
            subject scopes.
          </li>
          <li>
            <strong>User-Generated Academic Data:</strong> Subject-wise attendance logs (
            <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">AttendanceRecord</code>
            ), AI Viva practice sessions and transcripts (
            <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">VivaSession</code>{' '}
            &amp;{' '}
            <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">VivaMessage</code>),
            uploaded study notes, forum questions and replies, and faculty/admin notices.
          </li>
        </ul>
      </section>

      <section id="use" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">2. How We Use Your Data</h2>
        <p>Your information is used strictly to operate and improve your SETTech academic tools:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Personalizing MAKAUT Sem 3–8 syllabus modules, notes, solved PYQs, lab manuals, and
            SWAYAM/NPTEL lecture playlists for your branch and semester.
          </li>
          <li>
            Persisting your AI Viva practice history, scores, and weak-topic summaries so you can
            resume sessions across devices.
          </li>
          <li>
            Computing your 75% MAKAUT attendance buffer and credit-indexed SGPA/CGPA metrics.
          </li>
          <li>
            Delivering branch- and semester-targeted notices from verified SETGOI faculty and
            enforcing strict Role-Based Access Control (
            <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">STUDENT</code>,{' '}
            <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">FACULTY</code>,{' '}
            <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">ADMIN</code>).
          </li>
        </ul>
      </section>

      <section id="processors" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">3. Infrastructure &amp; Sub-Processors</h2>
        <p>
          SETTech does not sell or rent student or faculty data to advertisers. We rely on trusted
          cloud infrastructure providers solely to deliver platform functionality:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Clerk:</strong> Handles authentication, OAuth sign-in, session tokens, and
            role metadata security.
          </li>
          <li>
            <strong>Neon Serverless PostgreSQL:</strong> Stores encrypted relational academic
            records, syllabus metadata, attendance logs, notices, and viva transcripts.
          </li>
          <li>
            <strong>Vercel:</strong> Hosts the Next.js application and serverless API routes over
            TLS/HTTPS.
          </li>
          <li>
            <strong>Groq / Google Gemini &amp; Neural TTS:</strong> Processes real-time AI Viva
            prompts, answer evaluations, and Indian English / Hindi speech synthesis. Prompts are
            transmitted solely to generate immediate educational responses.
          </li>
        </ul>
      </section>

      <section id="retention" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">
          4. Data Retention, Access &amp; Deletion Rights
        </h2>
        <p>
          You retain full ownership of your academic profile and study contributions. You may update
          your branch, semester, or profile details inside the application at any time, or request
          complete deletion of your account and AI Viva chat history by emailing{' '}
          <a href="mailto:mail@ceimran.in" className="text-blue-600 font-medium hover:underline">
            mail@ceimran.in
          </a>
          . Verified deletion requests are processed within 7 business days.
        </p>
      </section>
    </LegalPageLayout>
  );
}
