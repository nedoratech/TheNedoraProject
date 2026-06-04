/**
 * Server-only Supabase clients (RSC, Server Actions, Route Handlers).
 */

import { createServerClient as _createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'
import type { Database } from './types'

type CookieToSet = { name: string; value: string; options: CookieOptions }

function jwtRole(key: string): string | null {
  try {
    const segment = key.split('.')[1]
    if (!segment) return null
    const payload = JSON.parse(Buffer.from(segment, 'base64url').toString()) as { role?: string }
    return payload.role ?? null
  } catch {
    return null
  }
}

function assertServiceRoleKey(): void {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (serviceKey && anonKey && serviceKey === anonKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is the same as NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Use the service_role secret from Supabase Dashboard → Project Settings → API (not the anon/public key).',
    )
  }

  const role = serviceKey ? jwtRole(serviceKey) : null
  if (role && role !== 'service_role') {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY has JWT role "${role}" but must be "service_role". ` +
        'Copy the service_role secret from Supabase Dashboard → Project Settings → API.',
    )
  }
}

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
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll called from a Server Component — safe to ignore
          }
        },
      },
    },
  )
}

export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — this client is server-only')
  }
  assertServiceRoleKey()
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
