import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { recordAuditLog } from '@/lib/audit';

export const runtime = 'nodejs';

/**
 * GET /api/admin/directory
 * Returns CampusFacility entries (HODs, Departments, Helplines).
 */
export async function GET() {
  try {
    const facilities = await prisma.campusFacility.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ success: true, facilities });
  } catch (err: any) {
    console.error('[Admin Directory GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load directory' }, { status: 500 });
  }
}

/**
 * POST /api/admin/directory
 * Admin-only: Create or update a CampusFacility (HOD, block, helpline).
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { id, category = 'department', name, building, description, inCharge, contactPhone, contactEmail } = body;

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
    }

    let facility;
    if (id) {
      facility = await prisma.campusFacility.update({
        where: { id },
        data: {
          category,
          name: name.trim(),
          building: building?.trim() || null,
          description: description.trim(),
          inCharge: inCharge?.trim() || null,
          contactPhone: contactPhone?.trim() || null,
          contactEmail: contactEmail?.trim() || null,
        },
      });
    } else {
      facility = await prisma.campusFacility.create({
        data: {
          category,
          name: name.trim(),
          building: building?.trim() || null,
          description: description.trim(),
          inCharge: inCharge?.trim() || null,
          contactPhone: contactPhone?.trim() || null,
          contactEmail: contactEmail?.trim() || null,
        },
      });
    }

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      action: 'DIRECTORY_UPDATED',
      target: facility.name,
      details: `${id ? 'Updated' : 'Added'} ${facility.category} entry (${facility.inCharge || 'No HOD listed'})`,
    });

    return NextResponse.json({ success: true, facility });
  } catch (err: any) {
    console.error('[Admin Directory POST] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to save directory entry' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/directory
 * Admin-only: Delete a CampusFacility entry by ?id=...
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });

    const existing = await prisma.campusFacility.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });

    await prisma.campusFacility.delete({ where: { id } });

    await recordAuditLog({
      actorId: caller.userId || 'admin',
      actor: caller.email || caller.fullName || 'Super Admin',
      action: 'DIRECTORY_DELETED',
      target: existing.name,
      details: `Removed ${existing.category} entry from Campus Directory`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Admin Directory DELETE] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete entry' }, { status: 500 });
  }
}
