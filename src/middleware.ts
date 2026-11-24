import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/dashboard/admin(.*)',
  '/api/admin(.*)',
]);

const isFacultyRoute = createRouteMatcher([
  '/faculty(.*)',
  '/dashboard/college(.*)',
  '/api/faculty(.*)',
  '/api/college(.*)',
]);

const isStudentRoute = createRouteMatcher([
  '/student(.*)',
]);

const isOnboardingRoute = createRouteMatcher([
  '/onboarding(.*)',
]);

const isDashboardRoute = createRouteMatcher([
  '/dashboard',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/auth-callback(.*)',
  '/viva(.*)',
  '/notes',
  '/campus',
  '/forum',
  '/tools',
  '/notices',
  '/calendar',
  '/privacy',
  '/terms',
  '/cookies',
  '/disclaimer',
  '/unauthorized',
  '/api/viva(.*)',
  '/api/transcribe(.*)',
  '/api/tts(.*)',
  '/api/ai(.*)',
  '/api/notes',
  '/api/forum',
  '/api/onboarding(.*)',
  '/api/profile(.*)',
  '/api/notices(.*)',
  '/api/webhooks(.*)',
]);

const hasResolvableClerk = 
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && 
  Boolean(process.env.CLERK_SECRET_KEY) && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('durgapur.dev');

const DEFAULT_SUPER_ADMIN_EMAILS = [
  'mail@ceimran.in',
  'mdimransps955@gmail.com',
  'principal@setgoi.ac.in',
  'admin@setgoi.ac.in',
];

function resolveRoleFromClaims(sessionClaims: any): 'admin' | 'faculty' | 'student' | null {
  if (!sessionClaims) return null;

  // Check all possible locations of role in Clerk claims (case-insensitive)
  const metadata = (
    sessionClaims?.metadata || 
    sessionClaims?.publicMetadata || 
    sessionClaims?.public_metadata || 
    sessionClaims?.user_metadata || 
    {}
  ) as { role?: string; isSuperAdmin?: boolean };

  const rawRole = (
    metadata.role || 
    sessionClaims?.role || 
    sessionClaims?.org_role || 
    ''
  ).toString().toUpperCase().trim();

  // Check email in session claims against super admin whitelist
  const userEmail = (
    sessionClaims?.email || 
    sessionClaims?.primary_email || 
    sessionClaims?.email_address || 
    sessionClaims?.emails?.[0] || 
    ''
  ).toString().toLowerCase().trim();

  const superAdminEnv = process.env.SUPER_ADMIN_EMAILS || '';
  const superAdminList = Array.from(new Set([
    ...DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.toLowerCase()),
    ...superAdminEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean),
  ]));

  if (userEmail && superAdminList.includes(userEmail)) {
    return 'admin';
  }

  if (rawRole === 'ADMIN' || rawRole === 'SUPERADMIN' || rawRole === 'SUPER_ADMIN' || metadata.isSuperAdmin) {
    return 'admin';
  }
  if (rawRole === 'FACULTY' || rawRole === 'COLLEGE' || rawRole === 'TEACHER' || rawRole === 'PROFESSOR') {
    return 'faculty';
  }
  if (rawRole === 'STUDENT') {
    return 'student';
  }

  return null;
}

const clerkHandler = clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const isApi = url.pathname.startsWith('/api');
  const isProd = process.env.NODE_ENV === 'production';
  // Security: In production, preview cookies are strictly ignored so auth cannot be bypassed
  const previewRole = isProd
    ? undefined
    : (req.cookies.get('settech_preview_role')?.value || req.cookies.get('sanakahub_preview_role')?.value);

  // 0. Check Onboarding Route
  if (isOnboardingRoute(req)) {
    if (previewRole) {
      return NextResponse.next();
    }

    const authObject = await auth();
    const { userId, sessionClaims, redirectToSignIn } = authObject;

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const role = resolveRoleFromClaims(sessionClaims);
    const metadata = (
      sessionClaims?.metadata || 
      sessionClaims?.publicMetadata || 
      sessionClaims?.public_metadata || 
      {}
    ) as { onboardingCompleted?: boolean };

    if (metadata.onboardingCompleted || role === 'admin') {
      return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/student', req.url));
    }
    return NextResponse.next();
  }

  // 1. Check Admin Routes
  if (isAdminRoute(req)) {
    if (previewRole) {
      if (previewRole !== 'admin') {
        if (isApi) return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      return NextResponse.next();
    }

    const authObject = await auth();
    const { userId, sessionClaims, redirectToSignIn } = authObject;

    if (!userId) {
      if (isApi) {
        return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
      }
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const role = resolveRoleFromClaims(sessionClaims);
    // Explicit student or faculty role is forbidden from admin routes
    if (role === 'student' || role === 'faculty') {
      if (isApi) {
        return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    // If role is 'admin' or null (unspecified in JWT session claims), allow request to reach
    // Server Component AdminLayout or API route handler, which resolves and heals user in Neon DB.
    return NextResponse.next();
  }

  // 2. Check Faculty Routes
  if (isFacultyRoute(req)) {
    if (previewRole) {
      if (previewRole !== 'faculty' && previewRole !== 'admin') {
        if (isApi) return NextResponse.json({ error: 'Forbidden: Faculty clearance required.' }, { status: 403 });
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      return NextResponse.next();
    }

    const authObject = await auth();
    const { userId, sessionClaims, redirectToSignIn } = authObject;

    if (!userId) {
      if (isApi) {
        return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
      }
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const role = resolveRoleFromClaims(sessionClaims);
    // Explicit student role is forbidden from faculty routes
    if (role === 'student') {
      if (isApi) {
        return NextResponse.json({ error: 'Forbidden: Faculty clearance required.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    return NextResponse.next();
  }

  // 3. Check Student Routes
  if (isStudentRoute(req)) {
    if (previewRole) {
      return NextResponse.next();
    }

    const authObject = await auth();
    const { userId, sessionClaims, redirectToSignIn } = authObject;

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const role = resolveRoleFromClaims(sessionClaims);
    const metadata = (
      sessionClaims?.metadata || 
      sessionClaims?.publicMetadata || 
      sessionClaims?.public_metadata || 
      {}
    ) as { onboardingCompleted?: boolean };

    if (role !== 'admin' && metadata.onboardingCompleted === false) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    return NextResponse.next();
  }

  // 4. Smart /dashboard Redirector
  if (isDashboardRoute(req)) {
    if (previewRole) {
      if (previewRole === 'admin') return NextResponse.redirect(new URL('/admin', req.url));
      if (previewRole === 'faculty') return NextResponse.redirect(new URL('/faculty', req.url));
      return NextResponse.redirect(new URL('/student', req.url));
    }

    const authObject = await auth();
    const { userId, redirectToSignIn } = authObject;

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    return NextResponse.redirect(new URL('/auth-callback', req.url));
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest, ev: any) {
  // If unresolvable Clerk dev domain, guard admin and faculty locally
  if (!hasResolvableClerk) {
    if (isAdminRoute(req) || isFacultyRoute(req)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    return NextResponse.next();
  }

  return clerkHandler(req, ev);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
