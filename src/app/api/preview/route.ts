import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') || 'student';
  const redirectPath =
    searchParams.get('redirect') ||
    (role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student');

  const response = NextResponse.redirect(new URL(redirectPath, req.url));
  response.cookies.set('settech_preview_role', role, {
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'lax',
  });
  return response;
}
