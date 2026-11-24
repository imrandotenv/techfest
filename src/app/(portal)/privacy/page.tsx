import React from 'react';
import { Metadata } from 'next';
import { LegalLayout } from '@/components/LegalLayout';
import { LEGAL_CONFIG } from '@/config/legal';
import { Shield, Lock, Eye, Database, Cpu, UserCheck, AlertCircle, FileCheck, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Student Data Governance | SETTech',
  description:
    'Complete student privacy policy, DPDP Act 2023 compliance, Clerk authentication, AI viva voice processing, and third-party processor transparency for SETTech at SETGOI Durgapur.',
};

export default function PrivacyPage() {
  const tldr = [
    'Zero Selling of Student Data: We never sell, rent, or trade your personal or academic records to third-party ad networks or brokers.',
    'Local Calculations: SGPA, CGPA, and 75% attendance calculations execute entirely in your local browser engine.',
    'AI Viva Voice Privacy: Microphone input is processed locally via browser Speech APIs. Question queries are processed ephemerally by Groq & Gemini without retaining audio files.',
    'Clerk Authentication: Passwords and session secrets are cryptographically salted and hashed by Clerk enterprise infrastructure.',
    'DPDP Act 2023 Rights: You have full rights to request access, correction, or permanent deletion of your account and contributions at any time.',
  ];

  return (
    <LegalLayout
      title="Privacy Policy & Student Data Governance"
      subtitle="How SETTech protects student privacy, handles authentication, processes AI viva sessions, and complies with India's Digital Personal Data Protection (DPDP) Act, 2023."
      badgeLabel="DATA PRIVACY"
      tldrItems={tldr}
    >
      {/* 1. Introduction & Student Identity */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2>1. Introduction &amp; Commitment to Student Privacy</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          SETTech (<span className="font-mono text-zinc-800">settech.dev</span>) is an independent, engineer-first academic companion built exclusively for B.Tech engineering students, research scholars, and faculty at Sanaka Educational Trust&apos;s Group of Institutions (SETGOI), Durgapur.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          We operate under a strict principle of minimal data collection. We do not monetize student attention, run advertising networks, or deploy commercial tracking pixels. Any information collected is strictly necessary to authenticate your academic identity, facilitate peer discussions, provide AI oral viva evaluations, or access curated MAKAUT study vaults.
        </p>
      </section>

      {/* 2. What Information We Collect */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Database className="w-5 h-5 text-blue-600" />
          <h2>2. Categories of Information We Process</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-600">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
            <span className="font-bold text-zinc-900 block">A. Account &amp; Authentication Data</span>
            <p className="leading-relaxed">
              When you sign up via Clerk Auth, we collect your institutional or personal email address, full name, profile image (if provided), and role assignment (<code className="font-mono text-blue-700">student</code>, <code className="font-mono text-purple-700">faculty</code>, or <code className="font-mono text-rose-700">admin</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
            <span className="font-bold text-zinc-900 block">B. Client-Side Browser Storage</span>
            <p className="leading-relaxed">
              We store localized preferences such as cookie consent status, exam countdown target dates, and free viva attempt counters in your browser&apos;s <code className="font-mono text-zinc-800">localStorage</code>. This data never touches our server database.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
            <span className="font-bold text-zinc-900 block">C. Academic Contributions</span>
            <p className="leading-relaxed">
              When you upload syllabus summaries, lecture notes, or post queries in the Discussion Forum, your username, timestamp, and uploaded content are published to facilitate academic peer collaboration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
            <span className="font-bold text-zinc-900 block">D. Technical Telemetry</span>
            <p className="leading-relaxed">
              Basic HTTP request logs (IP addresses, device user-agents, request timestamps) are processed transiently at our cloud edge for DDoS mitigation, rate limiting, and server health.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI Viva Studio & Voice Processing */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <Cpu className="w-5 h-5 text-blue-600" />
          <h2>3. AI Viva Studio &amp; Voice Privacy</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          SETTech provides an interactive AI Viva Studio (<code className="font-mono text-zinc-800">/viva</code>) for B.Tech students practicing for university oral examinations.
        </p>

        <div className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
            <p>
              <strong className="text-zinc-900">Zero Audio Server Storage:</strong> Microphone voice input uses the client browser&apos;s native Web Speech API (<code className="font-mono text-xs">webkitSpeechRecognition</code>). Your spoken voice is converted to text on your local device. SETTech does NOT record, save, or store raw voice audio files on any server.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
            <p>
              <strong className="text-zinc-900">Ephemeral LLM Inference:</strong> The transcribed answer text is sent to <strong className="text-zinc-900">Groq Cloud API</strong> (running <code className="font-mono text-xs">llama-3.3-70b-versatile</code>) or <strong className="text-zinc-900">Google Gemini API</strong> (<code className="font-mono text-xs">gemini-2.5-flash</code>) strictly for real-time semantic evaluation. Queries are processed in-memory and are NOT used to train public machine learning models.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
            <p>
              <strong className="text-zinc-900">Local Viva Report Cards:</strong> Session scores, question counts, and emotional reactions are kept in client state memory and discarded when you navigate away or close the browser tab.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Active Third-Party Processors Table */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
            <Lock className="w-5 h-5 text-blue-600" />
            <h2>4. Third-Party Data Processors</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {LEGAL_CONFIG.processors.length} Active Processors
          </span>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed">
          We maintain transparent contractual or API-level data processing relationships with the following sub-processors to deliver core platform services:
        </p>

        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Processor</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Purpose</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3 text-right">Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans text-zinc-600">
              {LEGAL_CONFIG.processors.map((proc) => (
                <tr key={proc.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-zinc-900 font-mono">
                    {proc.name}
                    <span className="block text-[10px] text-zinc-400 font-sans">{proc.provider}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {proc.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-600 max-w-xs leading-relaxed">
                    {proc.purpose}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-500">
                    {proc.location}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={proc.privacyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-blue-600 hover:underline font-mono text-[11px]"
                    >
                      <span>Notice</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. User Rights Under India's DPDP Act, 2023 */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <h2>5. Student Rights Under the DPDP Act, 2023</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Under the Digital Personal Data Protection Act, 2023 of India, student users have complete control over their digital personal data (as Data Principals):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600">
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-1">
            <span className="font-semibold text-zinc-900 block">Right to Information &amp; Summary</span>
            <p>You may request a copy of the personal data held about your student account at any time.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-1">
            <span className="font-semibold text-zinc-900 block">Right to Correction &amp; Erasure</span>
            <p>You may request correction of inaccurate metadata or permanent deletion of your profile and uploaded notes.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-1">
            <span className="font-semibold text-zinc-900 block">Right to Grievance Redressal</span>
            <p>Any concerns regarding data handling will be resolved by our student administrative desk within 7 working days.</p>
          </div>
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white space-y-1">
            <span className="font-semibold text-zinc-900 block">Right to Nominate</span>
            <p>In accordance with Section 14 of the DPDP Act, you may designate another student or representative in the event of incapacity.</p>
          </div>
        </div>
      </section>

      {/* 6. Data Security & Storage Practices */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <FileCheck className="w-5 h-5 text-blue-600" />
          <h2>6. Data Security &amp; Encryption Standards</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          All client-to-server traffic is transmitted over <strong className="text-zinc-900">TLS 1.3 / HTTPS encryption</strong>. Authentication sessions utilize secure HTTP-only cookies where applicable with strict SameSite protection. Passwords are never seen, stored, or processed in plaintext by SETTech servers.
        </p>
      </section>

      {/* 7. Contact & Grievance Redressal */}
      <section className="sanaka-card rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5 text-zinc-950 font-display font-bold text-lg">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h2>7. Grievance Officer Contact</h2>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          For any questions regarding this Privacy Policy, your rights under the DPDP Act 2023, or to request deletion of your account and notes, please reach out to our desk:
        </p>
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono space-y-1 text-zinc-700">
          <div><strong className="text-zinc-900">Designation:</strong> {LEGAL_CONFIG.grievanceOfficer.title}</div>
          <div><strong className="text-zinc-900">Email:</strong> <a href={`mailto:${LEGAL_CONFIG.grievanceEmail}`} className="text-blue-600 hover:underline">{LEGAL_CONFIG.grievanceEmail}</a></div>
          <div><strong className="text-zinc-900">Desk Address:</strong> {LEGAL_CONFIG.grievanceOfficer.address}</div>
        </div>
      </section>
    </LegalLayout>
  );
}
