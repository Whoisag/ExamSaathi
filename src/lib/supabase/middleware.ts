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

  // If already authenticated with active session and explicitly visiting login/signup, redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/my-dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

