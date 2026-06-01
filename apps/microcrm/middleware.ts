import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@nedora/db/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = request.nextUrl.pathname === '/login'
  const isPublic = isLoginPage || request.nextUrl.pathname === '/'

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/'],
}
