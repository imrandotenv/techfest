import { NextResponse } from 'next/server';

export const GUEST_AI_COOKIE = 'settech_guest_ai_count';
export const MAX_GUEST_AI_RESPONSES = 2;
const GUEST_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface GuestIpRecord {
  count: number;
  resetAt: number;
}

const globalForGuestAi = globalThis as unknown as {
  __settechGuestAiIpMap?: Map<string, GuestIpRecord>;
};

function getIpMap(): Map<string, GuestIpRecord> {
  if (!globalForGuestAi.__settechGuestAiIpMap) {
    globalForGuestAi.__settechGuestAiIpMap = new Map<string, GuestIpRecord>();
  }
  return globalForGuestAi.__settechGuestAiIpMap;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown-guest-ip';
}

function parseCookieCount(cookieHeader: string | null): number {
  if (!cookieHeader) return 0;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split('=');
    if (rawName === GUEST_AI_COOKIE) {
      const val = parseInt(decodeURIComponent(rest.join('=')), 10);
      return Number.isFinite(val) && val > 0 ? val : 0;
    }
  }
  return 0;
}

export interface GuestAiStatus {
  allowed: boolean;
  isGuest: boolean;
  count: number;
  remaining: number;
  limit: number;
}

/**
 * Checks whether the caller is allowed to invoke an AI endpoint.
 * For unauthenticated guests, enforces a strict 2-response cap backed by
 * both an HTTP-only cookie and a server-side IP rate-limit map.
 */
export function getGuestAiStatus(req: Request, userId: string | null | undefined): GuestAiStatus {
  if (userId) {
    return {
      allowed: true,
      isGuest: false,
      count: 0,
      remaining: MAX_GUEST_AI_RESPONSES,
      limit: MAX_GUEST_AI_RESPONSES,
    };
  }

  const cookieCount = parseCookieCount(req.headers.get('cookie'));
  const ip = getClientIp(req);
  const ipMap = getIpMap();
  const now = Date.now();
  const existing = ipMap.get(ip);

  let ipCount = 0;
  if (existing) {
    if (now > existing.resetAt) {
      ipMap.delete(ip);
    } else {
      ipCount = existing.count;
    }
  }

  const count = Math.max(cookieCount, ipCount);
  const remaining = Math.max(0, MAX_GUEST_AI_RESPONSES - count);

  return {
    allowed: count < MAX_GUEST_AI_RESPONSES,
    isGuest: true,
    count,
    remaining,
    limit: MAX_GUEST_AI_RESPONSES,
  };
}

/**
 * Increments both the server-side IP map and builds the HTTP-only Set-Cookie header.
 */
export function recordGuestAiUsage(
  req: Request,
  currentCount: number
): { nextCount: number; remaining: number; setCookieHeader: string } {
  const nextCount = currentCount + 1;
  const remaining = Math.max(0, MAX_GUEST_AI_RESPONSES - nextCount);
  const ip = getClientIp(req);
  const ipMap = getIpMap();
  const now = Date.now();
  const existing = ipMap.get(ip);

  ipMap.set(ip, {
    count: nextCount,
    resetAt: existing && now <= existing.resetAt ? existing.resetAt : now + GUEST_WINDOW_MS,
  });

  const maxAgeSec = Math.floor(GUEST_WINDOW_MS / 1000);
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const setCookieHeader = `${GUEST_AI_COOKIE}=${nextCount}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secureFlag}`;

  return { nextCount, remaining, setCookieHeader };
}

export function guestLimitExceededResponse(): NextResponse {
  return NextResponse.json(
    {
      error: 'GUEST_LIMIT_REACHED',
      message: 'Sign in with your SETGOI / Google account to continue AI Viva and save your chat history.',
    },
    { status: 401 }
  );
}
