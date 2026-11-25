import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/admin/audit
 * Admin-only: Searchable, timestamped System Audit Logs from Neon DB.
 */
export async function GET(req: NextRequest) {
  try {
    const caller = await getCurrentAuthUser();
    if (!caller.isAuthenticated || caller.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const action = (searchParams.get('action') || 'ALL').trim();

    const logs = await prisma.auditLog.findMany({
      where: {
        ...(action && action !== 'ALL' ? { action } : {}),
        ...(q
          ? {
              OR: [
                { actor: { contains: q, mode: 'insensitive' } },
                { target: { contains: q, mode: 'insensitive' } },
                { details: { contains: q, mode: 'insensitive' } },
                { action: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    console.error('[Admin Audit GET] Error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to load audit logs' }, { status: 500 });
  }
}
