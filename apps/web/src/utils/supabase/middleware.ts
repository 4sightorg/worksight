import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Allow all requests when forced offline mode is enabled
  const isForcedOffline = process.env.NEXT_PUBLIC_IS_OFFLINE === 'true';
  if (isForcedOffline) {
    return NextResponse.next({ request });
  }

  // Also allow through when a client-set cookie indicates offline session
  const hasOfflineSession = request.cookies.get('ws_offline_session')?.value === '1';

  // Check if target path requires authentication
  const pathname = request.nextUrl.pathname;
  const isProtectedPath =
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/survey') ||
    pathname.startsWith('/wellness-survey');

  // Check if Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // If Supabase is not configured, protect routes based on offline session cookie
    if (isProtectedPath && !hasOfflineSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next({
      request,
    });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
  });

  // DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !hasOfflineSession && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
