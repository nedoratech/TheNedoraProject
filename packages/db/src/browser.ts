/**
 * Browser-only Supabase client (client components, realtime).
 * Do not import this from Server Components — use @nedora/db/client instead.
 */

import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createBrowserClient() {
  return _createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
