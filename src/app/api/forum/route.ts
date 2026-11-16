import { NextRequest, NextResponse } from 'next/server';
import { forumStore } from '@/modules/forum/forum-service';
import { ForumCategory, ForumSortOption } from '@/modules/forum/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = (searchParams.get('sort') as ForumSortOption) || 'recent';

    const posts = forumStore.getPosts({ category, search, sort });
    return NextResponse.json({ success: true, posts, total: posts.length });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, authorId, authorName, authorRole, authorDepartment, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    const post = forumStore.createPost({
      title,
      content,
      category: category as ForumCategory,
      authorId: authorId || 'anon-user',
      authorName: authorName || 'SETGOI Student',
      authorRole: authorRole || 'student',
      authorDepartment: authorDepartment || 'SETGOI Campus',
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create forum post' },
      { status: 500 }
    );
  }
}
