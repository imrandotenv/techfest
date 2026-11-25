import { prisma } from '@/lib/prisma';

export interface AuditLogInput {
  actorId: string;
  actor: string;
  action: string;
  target: string;
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
        action: input.action,
        target: input.target,
        details: input.details,
      },
    });
  } catch (err) {
    console.warn('[AuditLog] Failed to persist audit entry:', err);
  }
}
