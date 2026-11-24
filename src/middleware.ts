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
]);

const hasResolvableClerk = 
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && 
  Boolean(process.env.CLERK_SECRET_KEY) && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('durgapur.dev');

function resolveRoleFromClaims(sessionClaims: any): 'admin' | 'faculty' | 'student' {
  if (!sessionClaims) return 'student';
  const metadata = (sessionClaims?.metadata || sessionClaims?.publicMetadata || {}) as { role?: string };
  const rawRole = (metadata.role || sessionClaims?.role || '').toString().toLowerCase().trim();

  // Check email in session claims against super admin whitelist
  const userEmail = (sessionClaims?.email || sessionClaims?.primary_email || '').toString().toLowerCase().trim();
  const superAdminEnv = process.env.SUPER_ADMIN_EMAILS || '';
  if (userEmail && superAdminEnv) {
    const list = superAdminEnv.split(',').map((e) => e.trim().toLowerCase());
    if (list.includes(userEmail)) {
      return 'admin';
    }
  }

  if (rawRole === 'admin' || rawRole === 'superadmin') return 'admin';
  if (rawRole === 'faculty' || rawRole === 'college' || rawRole === 'teacher' || rawRole === 'professor') return 'faculty';
  return 'student';
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

    const metadata = (sessionClaims?.metadata || sessionClaims?.publicMetadata || {}) as { onboardingCompleted?: boolean };
    if (metadata.onboardingCompleted) {
      return NextResponse.redirect(new URL('/student', req.url));
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
    if (role !== 'admin') {
      if (isApi) {
        return NextResponse.json({ error: 'Forbidden: Admin clearance required.' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
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
    if (role !== 'faculty' && role !== 'admin') {
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
    const metadata = (sessionClaims?.metadata || sessionClaims?.publicMetadata || {}) as { onboardingCompleted?: boolean };
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
