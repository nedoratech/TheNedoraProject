/**
 * @nedora/db/middleware
 * Supabase SSR client for use in Next.js middleware.
 * Refreshes the auth session and passes updated cookies to the response.
 *
 * Usage in apps/microcms/middleware.ts and apps/microcrm/middleware.ts:
 *
 *   import { createMiddlewareClient } from '@nedora/db/middleware'
 *
 *   export async function middleware(request: NextRequest) {
 *     const { supabase, response } = createMiddlewareClient(request)
 *     const { data: { session } } = await supabase.auth.getSession()
 *     if (!session) return NextResponse.redirect(new URL('/login', request.url))
 *     return response
 *   }
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'

export function createMiddlewareClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response: supabaseResponse }
}
