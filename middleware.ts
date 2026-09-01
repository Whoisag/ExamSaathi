import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/analyze/:path*',
    '/analyzer/:path*',
    '/assistant/:path*',
    '/my-dashboard/:path*',
    '/exam/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
  ],
}

