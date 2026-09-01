import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/my-dashboard'

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  let targetOrigin = origin
  if (!isLocalEnv && forwardedHost) {
    targetOrigin = `https://${forwardedHost}`
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${targetOrigin}${next}`)
    }
  }

  // Return the user to an error page or login with instructions
  return NextResponse.redirect(`${targetOrigin}/login?error=auth_callback_failed`)
}

