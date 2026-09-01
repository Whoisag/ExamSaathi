import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    user = null
  }

  const pathname = request.nextUrl.pathname

  // If landing on root or login with an auth code, route directly through auth callback
  if (request.nextUrl.searchParams.has('code') && (pathname === '/' || pathname === '/login')) {
    const code = request.nextUrl.searchParams.get('code')!
    const next = request.nextUrl.searchParams.get('next') || '/my-dashboard'
    const callbackUrl = request.nextUrl.clone()
    callbackUrl.pathname = '/auth/callback'
    callbackUrl.searchParams.set('code', code)
    callbackUrl.searchParams.set('next', next)
    return NextResponse.redirect(callbackUrl)
  }

  // Protected routes: dashboard, analyzer, assistant, settings, exam
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/analyzer') ||
    pathname.startsWith('/analyze') ||
    pathname.startsWith('/assistant') ||
    pathname.startsWith('/my-dashboard') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/exam')

  // Check if mock user session exists in cookies as graceful fallback for local development
  const mockUserCookie = request.cookies.get('exam_saathi_user')

  if (!user && !mockUserCookie && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If already authenticated and trying to access login/signup, redirect to dashboard
  if ((user || mockUserCookie) && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/my-dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
