import type { Metadata } from 'next';
import { LecturesView } from '@/components/LecturesView';

export const metadata: Metadata = {
  title: 'Course Lectures (SWAYAM & NPTEL) | SETTech SETGOI',
  description:
    'Official SWAYAM and NPTEL video courses mapped by branch and semester to the MAKAUT B.Tech engineering curriculum.',
};

export default function LecturesPage() {
  return <LecturesView />;
}
