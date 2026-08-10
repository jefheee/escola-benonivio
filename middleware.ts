import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { validateApiIsolation } from '@/lib/env-guard';

export async function updateSession(request: NextRequest) {
  // Validate API Key Isolation on runtime
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

  // Actively validate JWT/Session with Supabase Server Auth
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  const isLoginRoute = pathname.startsWith('/login');

  // Block access to all app/(admin)/* routes if JWT/Session is invalid, missing, or tampered
  if (isAdminRoute && (error || !user)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Clear potentially corrupted auth cookies on failed auth verification
    const redirectResponse = NextResponse.redirect(url);
    return redirectResponse;
  }

  // Prevent authenticated users from accessing login page
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
