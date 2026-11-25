import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/events
 * Public: Returns live CampusEvent items for /tools TechFest & Campus Events tab and /admin.
 */
export async function GET() {
  try {
    const events = await prisma.campusEvent.findMany({
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });
    return NextResponse.json({ success: true, events });
  } catch (err: any) {
    console.error('[Events GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load events' }, { status: 500 });
  }
}

/**
 * POST /api/events
 * Admin-only: Publishes a TechFest / CampusEvent item.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      title,
      category = 'TECHFEST',
      dateLabel,
      venue,
      description,
      isFeatured = false,
    } = body;

    if (!title?.trim() || !dateLabel?.trim() || !venue?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Title, dateLabel, venue, and description are required.' },
        { status: 400 }
      );
    }

    const event = await prisma.campusEvent.create({
      data: {
        title: title.trim(),
        category: String(category).toUpperCase().trim(),
        dateLabel: dateLabel.trim(),
        venue: venue.trim(),
        description: description.trim(),
        isFeatured: Boolean(isFeatured),
      },
    });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      actorEmail: caller.email || undefined,
      actorRole: 'ADMIN',
      action: 'CAMPUS_EVENT_CREATED',
      target: event.title,
      targetType: 'CAMPUS_EVENT',
      targetLabel: event.title,
      details: `Published ${event.category} event (${event.dateLabel} @ ${event.venue})`,
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (err: any) {
    console.error('[Events POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create event' }, { status: 500 });
  }
}

/**
 * PATCH /api/events
 * Admin-only: Toggle featured status of a CampusEvent.
 */
export async function PATCH(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { id, isFeatured } = body;
    if (!id) return NextResponse.json({ error: 'Event id is required.' }, { status: 400 });

    const event = await prisma.campusEvent.update({
      where: { id },
      data: { isFeatured: Boolean(isFeatured) },
    });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      actorEmail: caller.email || undefined,
      actorRole: 'ADMIN',
      action: 'CAMPUS_EVENT_UPDATED',
      target: event.title,
      targetType: 'CAMPUS_EVENT',
      targetLabel: event.title,
      details: `${event.isFeatured ? 'Featured' : 'Unfeatured'} campus event`,
    });

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    console.error('[Events PATCH] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update event' }, { status: 500 });
  }
}

/**
 * DELETE /api/events?id=...
 * Admin-only: Deletes a CampusEvent.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Event id is required.' }, { status: 400 });

    const existing = await prisma.campusEvent.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });

    await prisma.campusEvent.delete({ where: { id } });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      actorEmail: caller.email || undefined,
      actorRole: 'ADMIN',
      action: 'CAMPUS_EVENT_DELETED',
      target: existing.title,
      targetType: 'CAMPUS_EVENT',
      targetLabel: existing.title,
      details: 'Deleted campus event',
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Events DELETE] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete event' }, { status: 500 });
  }
}
