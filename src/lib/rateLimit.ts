import { prisma } from '@/lib/prisma';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
  retryAfterSeconds: number;
}

/**
 * Neon PostgreSQL-backed rate limiter for serverless Next.js routes.
 * Zero Redis required; works across all Vercel edge/serverless instances.
 */
export async function checkRateLimit(
  key: string,
  limit: number = 40,
  windowMs: number = 60 * 60 * 1000 // 1 hour default
): Promise<RateLimitResult> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    const existing = await prisma.rateLimit.findUnique({
      where: { key },
    });

    // If record doesn't exist or window has expired, reset window
    if (!existing || existing.resetAt <= now) {
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, resetAt },
        create: { key, count: 1, resetAt },
      });
      return {
        success: true,
        limit,
        remaining: Math.max(0, limit - 1),
        resetAt,
        retryAfterSeconds: 0,
      };
    }

    // If limit exceeded within active window
    if (existing.count >= limit) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((existing.resetAt.getTime() - now.getTime()) / 1000)
      );
      return {
        success: false,
        limit,
        remaining: 0,
        resetAt: existing.resetAt,
        retryAfterSeconds,
      };
    }

    // Increment count within active window
    const updated = await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - updated.count),
      resetAt: existing.resetAt,
      retryAfterSeconds: 0,
    };
  } catch (err) {
    console.warn('[RateLimit] Neon DB check note, failing open for resilience:', err);
    return {
      success: true,
      limit,
      remaining: limit,
      resetAt,
      retryAfterSeconds: 0,
    };
  }
}

/**
 * Extracts a consistent rate limit identifier from user ID or client IP header.
 */
export function getClientIdentifier(req: Request, userId?: string | null): string {
  if (userId) return `usr_${userId}`;
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anon_client';
  return `ip_${ip}`;
}
