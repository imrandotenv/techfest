import type { Metadata } from 'next';
import { CampusDirectoryView } from '@/modules/campus';

export const metadata: Metadata = {
  title: 'Campus Directory & 3D Explorer | SanakaHub SETGOI',
  description:
    'Searchable SETGOI directory: academic departments, faculty office hours, hostels, bus schedules, 24/7 SOS contacts, and interactive 3D campus zone visualizer.',
};

export default function CampusPage() {
  return <CampusDirectoryView />;
}
