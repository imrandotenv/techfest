import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/admin/moderation
 * Admin-only: Fetches real uploaded Notes & Forum Threads from Neon DB.
 */
export async function GET() {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const [notes, forumPosts] = await Promise.all([
      prisma.note.findMany({
        orderBy: [{ verified: 'asc' }, { createdAt: 'desc' }],
        include: {
          uploader: { select: { fullName: true, email: true, branch: true } },
        },
        take: 40,
      }),
      prisma.forumPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { fullName: true, email: true, role: true } },
          _count: { select: { replies: true } },
        },
        take: 40,
      }),
    ]);

    return NextResponse.json({ success: true, notes, forumPosts });
  } catch (err: any) {
    console.error('[Admin Moderation GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load moderation queue' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/moderation
 * Admin-only: Approve/verify or unverify a Note, or delete a Note / ForumPost.
 */
export async function PATCH(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { type, id, action } = body as {
      type: 'note' | 'forum';
      id: string;
      action: 'verify' | 'unverify' | 'delete';
    };

    if (!type || !id || !action) {
      return NextResponse.json({ error: 'type, id, and action are required.' }, { status: 400 });
    }

    if (type === 'note') {
      const note = await prisma.note.findUnique({ where: { id } });
      if (!note) return NextResponse.json({ error: 'Note not found.' }, { status: 404 });

      if (action === 'delete') {
        await prisma.note.delete({ where: { id } });
        await recordAuditLog({
          actorId: caller.userId || 'admin',
          actor: caller.email || caller.fullName || 'Super Admin',
          action: 'NOTE_DELETED',
          target: note.title,
          details: `Removed note (${note.subjectCode}) from vault`,
        });
        return NextResponse.json({ success: true, message: 'Note deleted from vault.' });
      }

      const verified = action === 'verify';
      const updated = await prisma.note.update({
        where: { id },
        data: { verified },
      });

      await recordAuditLog({
        actorId: caller.userId || 'admin',
        actor: caller.email || caller.fullName || 'Super Admin',
        action: verified ? 'NOTE_VERIFIED' : 'NOTE_UNVERIFIED',
        target: note.title,
        details: `${verified ? 'Approved' : 'Unverified'} ${note.subjectCode} (${note.branch} Sem ${note.semester})`,
      });

      return NextResponse.json({ success: true, note: updated });
    }

    if (type === 'forum') {
      const post = await prisma.forumPost.findUnique({ where: { id } });
      if (!post) return NextResponse.json({ error: 'Forum thread not found.' }, { status: 404 });

      if (action === 'delete') {
        await prisma.forumPost.delete({ where: { id } });
        await recordAuditLog({
          actorId: caller.userId || 'admin',
          actor: caller.email || caller.fullName || 'Super Admin',
          action: 'FORUM_MODERATED',
          target: post.title,
          details: 'Removed forum thread during moderation review',
        });
        return NextResponse.json({ success: true, message: 'Forum thread removed.' });
      }
    }

    return NextResponse.json({ error: 'Unsupported moderation action.' }, { status: 400 });
  } catch (err: any) {
    console.error('[Admin Moderation PATCH] Error:', err);
    return NextResponse.json({ error: err?.message || 'Moderation action failed' }, { status: 500 });
  }
}
