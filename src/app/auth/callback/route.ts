import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/my-dashboard'
  const errorDescription = searchParams.get('error_description')

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  let targetOrigin = origin
  if (!isLocalEnv && forwardedHost) {
    targetOrigin = `https://${forwardedHost}`
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hjzodxwjvmzzghinvvze.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${targetOrigin}${next}`)
      }
    } catch (err) {
      console.warn('Server exchange error, falling back to client-side PKCE bridge:', err)
    }

    // Client-side fallback bridge: guarantees PKCE exchange using browser localStorage verifier
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating ExamSaathi...</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <style>
    body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { border: 2px solid #FF4D00; padding: 32px 40px; background: #0a0a0a; text-align: center; box-shadow: 4px 4px 0px #FF4D00; }
    h2 { color: #FF4D00; margin: 0 0 12px; font-weight: 900; letter-spacing: 0.05em; }
    p { margin: 0; color: #888; font-size: 13px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <h2>EXAMSAATHI</h2>
    <p>VERIFYING SESSION & LAUNCHING DASHBOARD...</p>
  </div>
  <script>
    (async function() {
      try {
        const client = window.supabase.createClient("${supabaseUrl}", "${supabaseAnonKey}");
        const { data, error } = await client.auth.exchangeCodeForSession("${code}");
        if (data && data.session) {
          window.location.href = "${next}";
        } else {
          // If already authenticated or code was processed, navigate to dashboard
          window.location.href = "${next}";
        }
      } catch (e) {
        window.location.href = "${next}";
      }
    })();
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  return NextResponse.redirect(`${targetOrigin}/login?error=${encodeURIComponent(errorDescription || 'auth_callback_failed')}`)
}


