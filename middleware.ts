import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { validateApiIsolation } from '@/lib/env-guard';
import { loginRateLimiter } from '@/lib/rate-limit';

export async function updateSession(request: NextRequest) {
  // 1. Validate API Key Isolation on runtime
  validateApiIsolation();

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname.startsWith('/login');
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  // 2. Layer-1 Rate Limiting for Auth Route
  if (isLoginRoute && request.method === 'POST') {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

    const check = loginRateLimiter.check(clientIp);
    if (!check.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Muitas tentativas. Bloqueado temporariamente por segurança.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(check.resetSeconds),
          },
        }
      );
    }
  }

  // 3. Actively validate JWT/Session with Supabase Server Auth
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 4. Block access to all app/(admin)/* routes if JWT/Session is invalid, missing, or tampered
  if (isAdminRoute && (error || !user)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const redirectResponse = NextResponse.redirect(url);
    return redirectResponse;
  }

  // 5. Prevent authenticated users from accessing login page
  if (isLoginRoute && user && !error) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, images, favicon, assets
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
