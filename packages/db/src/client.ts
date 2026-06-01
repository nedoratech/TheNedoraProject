/**
 * @nedora/db — Supabase client factory
 *
 * Three clients for three contexts:
 *  1. createServerClient()  — Server Components, Server Actions, Route Handlers
 *                             Uses cookies for session — call inside async server context
 *  2. createServiceClient() — Privileged server-only mutations (CRM writes, admin)
 *                             Uses service_role key — NEVER import in client components
 *  3. createBrowserClient() — Client Components only (realtime, auth UI)
 */

import { createServerClient as _createServerClient, createBrowserClient as _createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

// ── Server client (cookie-aware, for RSC / Server Actions) ─────────────────
export async function createServerClient() {
  const cookieStore = await cookies()

  return _createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}

// ── Service client (server-only, privileged) ────────────────────────────────
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — this client is server-only')
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// ── Browser client (client components, realtime) ────────────────────────────
export function createBrowserClient() {
  return _createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
