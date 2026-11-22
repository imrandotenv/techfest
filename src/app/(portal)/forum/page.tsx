import { Metadata } from 'next';
import { ForumMainView } from '@/modules/forum';
import { forumStore } from '@/modules/forum/forum-service';

export const metadata: Metadata = {
  title: 'Discussions & Academic Q&A | SETTech SETGOI',
  description: 'Categorized campus discussion board for SETGOI Durgapur: MAKAUT academic queries, TechFest 2026 tracks, placements, engineering lab updates, and verified Official Faculty Answers.',
};

interface ForumPageProps {
  searchParams?: Promise<{
    post?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialPostId = resolvedParams.post;
  const initialCategory = resolvedParams.category;
  const initialSearch = resolvedParams.search;

  // Retrieve initial posts from forumStore for instant server-rendered hydration
  const initialPosts = forumStore.getPosts({
    category: initialCategory,
    search: initialSearch,
  });

  return (
    <ForumMainView 
      initialPosts={initialPosts}
      initialPostId={initialPostId}
    />
  );
}
