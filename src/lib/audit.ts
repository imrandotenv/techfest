import { prisma } from '@/lib/prisma';

export interface AuditLogInput {
  actorId: string;
  actor: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  target: string;
  targetType?: string;
  targetLabel?: string;
  details: string;
}

/**
 * Safely persists an immutable audit log entry in Neon PostgreSQL.
 * Never throws so primary operations are not disrupted if logging fails.
 */
export async function recordAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        actor: input.actor,
        actorEmail: input.actorEmail || input.actor,
        actorRole: input.actorRole || 'ADMIN',
        action: input.action,
        target: input.target,
        targetType: input.targetType || 'SYSTEM',
        targetLabel: input.targetLabel || input.target,
        details: input.details,
      },
    });
  } catch (err) {
    console.warn('[AuditLog] Failed to persist audit entry:', err);
  }
}
