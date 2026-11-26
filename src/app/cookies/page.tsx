import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export const metadata = {
  title: 'Cookie Policy | SETTech',
  description:
    'Cookie and Browser Local Storage Policy for SETTech — zero third-party ad trackers.',
};

const SECTIONS = [
  { id: 'overview', label: '1. Zero Ad-Tracking Commitment' },
  { id: 'inventory', label: '2. Cookies & Local Storage Inventory' },
  { id: 'manage', label: '3. Managing & Clearing Storage' },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie &amp; Local Storage Policy"
      subtitle="SETTech uses strictly necessary authentication cookies and minimal local browser storage for academic preferences. We do not use third-party advertising cookies or cross-site behavioral trackers."
      activeRoute="/cookies"
      sections={SECTIONS}
    >
      <section id="overview" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">1. Zero Ad-Tracking Commitment</h2>
        <p>
          Every cookie and browser storage key used on{' '}
          <span className="font-mono text-xs">settech.ceimran.in</span> serves an essential
          security, authentication, or student-workspace preference purpose.
        </p>
      </section>

      <section id="inventory" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">
          2. Cookies &amp; Local Storage Inventory
        </h2>
        <div className="overflow-x-auto border border-[#E4E4E7] rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E4E4E7] font-mono uppercase text-[11px] text-zinc-500">
                <th className="py-3 px-4">Key / Cookie</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-[#09090B]">
                  __session / __client_uat
                </td>
                <td className="py-3 px-4">Clerk Authentication (Strictly Necessary)</td>
                <td className="py-3 px-4 text-zinc-600">
                  Maintains encrypted login sessions and Role-Based Access Control (RBAC) claims
                  across page loads.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-[#09090B]">
                  settech_guest_ai_count
                </td>
                <td className="py-3 px-4">HTTP-Only Functional Cookie</td>
                <td className="py-3 px-4 text-zinc-600">
                  Enforces the 2-response unauthenticated preview limit on AI Viva before
                  prompting Google/SETGOI sign-in.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-[#09090B]">
                  settech_attendance_draft
                </td>
                <td className="py-3 px-4">Browser localStorage (Functional)</td>
                <td className="py-3 px-4 text-zinc-600">
                  Saves guest attendance and SGPA calculator drafts locally on your device.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-[#09090B]">
                  settech_viva_voice / settech_viva_muted
                </td>
                <td className="py-3 px-4">Browser localStorage (Functional)</td>
                <td className="py-3 px-4 text-zinc-600">
                  Remembers your preferred Indian Neural TTS voice (English / Hinglish) and audio
                  mute toggle.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="manage" className="space-y-3 scroll-mt-24">
        <h2 className="text-lg font-bold text-[#09090B]">3. Managing &amp; Clearing Storage</h2>
        <p>
          You can clear cookies or browser{' '}
          <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">localStorage</code>{' '}
          at any time through your browser&apos;s Privacy &amp; Site Data settings. Please note that
          disabling strictly necessary Clerk session cookies will sign you out of authenticated
          workspaces.
        </p>
      </section>
    </LegalPageLayout>
  );
}
