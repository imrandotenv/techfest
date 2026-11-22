import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { NotesVaultView } from '@/modules/notes';
import { NotesVaultSkeleton } from '@/components/ui/SkeletonLoaders';

export const metadata: Metadata = {
  title: 'MAKAUT Notes & Solved PYQ Vault | SETTech SETGOI',
  description:
    'Searchable MAKAUT lecture notes, syllabus modules, 10-year solved question papers, and lab manuals for Semesters 1 to 8 across CSE, ECE, EE, ME, and CE with faculty verification workflow.',
};

export default function NotesPage() {
  return (
    <Suspense fallback={<NotesVaultSkeleton />}>
      <NotesVaultView />
    </Suspense>
  );
}
