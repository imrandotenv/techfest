import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { NotesVaultView } from '@/modules/notes';

export const metadata: Metadata = {
  title: 'MAKAUT Notes & Solved PYQ Vault | SanakaHub SETGOI',
  description:
    'Searchable MAKAUT lecture notes, syllabus modules, 10-year solved question papers, and lab manuals for Semesters 1 to 8 across CSE, ECE, EE, ME, and CE with faculty verification workflow.',
};

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-[#475569] font-mono">
          Loading MAKAUT Notes Vault...
        </div>
      }
    >
      <NotesVaultView />
    </Suspense>
  );
}
