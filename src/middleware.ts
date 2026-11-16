import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher([
  '/dashboard/admin(.*)',
  '/api/admin(.*)',
]);

const isCollegeRoute = createRouteMatcher([
  '/dashboard/college(.*)',
  '/api/college(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/campus(.*)',
  '/notes(.*)',
  '/forum(.*)',
  '/tools(.*)',
  '/unauthorized',
  '/api/ai(.*)',
  '/api/campus(.*)',
  '/api/forum(.*)',
  '/api/notes(.*)',
]);

const hasResolvableClerk = 
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && 
  Boolean(process.env.CLERK_SECRET_KEY) && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('durgapur.dev');

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) || isCollegeRoute(req)) {
    const authObject = await auth();
    const { userId, sessionClaims, redirectToSignIn } = authObject;

    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const metadata = (sessionClaims?.metadata || {}) as { role?: string };
    const role = metadata.role || (sessionClaims as any)?.role || 'student';

    if (isAdminRoute(req) && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (isCollegeRoute(req) && role !== 'college' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest, ev: any) {
  // If public route, immediately proceed with zero external network redirects
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If unresolvable Clerk dev domain, guard admin and college locally
  if (!hasResolvableClerk) {
    if (isAdminRoute(req) || isCollegeRoute(req)) {
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
