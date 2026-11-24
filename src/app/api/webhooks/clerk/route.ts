import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * POST /api/webhooks/clerk
 * Svix-verified Clerk webhook sync endpoint.
 * Automatically synchronizes user updates and deletions into Neon PostgreSQL.
 */
export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  const rawBody = await req.text();

  let evt: any = null;

  if (WEBHOOK_SECRET) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing required Svix verification headers' },
        { status: 400 }
      );
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    try {
      evt = wh.verify(rawBody, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as any;
    } catch (err: any) {
      console.error('[Clerk Webhook] Signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }
  } else {
    console.warn('[Clerk Webhook] CLERK_WEBHOOK_SECRET not configured. Parsing payload without verification in development.');
    try {
      evt = JSON.parse(rawBody);
    } catch (parseErr) {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }
  }

  const eventType = evt.type;
  console.info(`[Clerk Webhook] Processing event: ${eventType} for ID: ${evt.data?.id}`);

  try {
    switch (eventType) {
      case 'user.created':
      case 'user.updated': {
        const { id, email_addresses, primary_email_address_id, first_name, last_name, username, public_metadata } = evt.data;
        const primaryEmail =
          email_addresses?.find((e: any) => e.id === primary_email_address_id)?.email_address ||
          email_addresses?.[0]?.email_address ||
          `${id}@student.setgoi.ac.in`;
        const fullName = [first_name, last_name].filter(Boolean).join(' ') || username || 'SETGOI Member';
        const role = (public_metadata?.role || 'STUDENT').toUpperCase();
        const branch = public_metadata?.branch || undefined;
        const semester = public_metadata?.semester ? Number(public_metadata.semester) : undefined;
        const passoutYear = public_metadata?.passoutYear ? Number(public_metadata.passoutYear) : undefined;
        const universityRoll = public_metadata?.universityRoll || undefined;
        const onboardingCompleted = Boolean(public_metadata?.onboardingCompleted);

        await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email: primaryEmail,
            fullName,
            role,
            ...(branch ? { branch } : {}),
            ...(semester !== undefined ? { semester } : {}),
            ...(passoutYear !== undefined ? { passoutYear } : {}),
            ...(universityRoll !== undefined ? { universityRoll } : {}),
            onboardingCompleted,
          },
          create: {
            clerkId: id,
            email: primaryEmail,
            fullName,
            role,
            degree: 'B.Tech',
            branch: branch || 'CSE',
            semester: semester || 3,
            passoutYear: passoutYear || new Date().getFullYear() + 2,
            universityRoll,
            onboardingCompleted,
          },
        });
        break;
      }

      case 'user.deleted': {
        const { id } = evt.data;
        if (id) {
          await prisma.user.deleteMany({
            where: { clerkId: id },
          });
          console.info(`[Clerk Webhook] Cleanly deleted Neon user record for clerkId: ${id}`);
        }
        break;
      }

      default:
        console.info(`[Clerk Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ success: true, event: eventType });
  } catch (err: any) {
    console.error(`[Clerk Webhook] Failed processing event ${eventType}:`, err);
    return NextResponse.json({ error: err?.message || 'Webhook processing failed' }, { status: 500 });
  }
}
