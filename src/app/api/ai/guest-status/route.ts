import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGuestAiStatus } from '@/lib/guestAiLimit';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { userId } = await auth().catch(() => ({ userId: null }));
  const status = getGuestAiStatus(req, userId);
  return NextResponse.json(status);
}
