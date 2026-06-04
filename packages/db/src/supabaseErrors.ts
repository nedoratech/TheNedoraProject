/** Hint when CRM/auth fails due to misconfigured Supabase keys (e.g. anon key used as service role). */
export function getSupabaseConfigHint(err: unknown): string | null {
  if (isUserNotAllowed(err)) {
    return (
      'Supabase rejected the service key (User not allowed). ' +
      'Set SUPABASE_SERVICE_ROLE_KEY to the service_role secret from Dashboard → Project Settings → API — ' +
      'not the anon/public key.'
    )
  }

  if (err instanceof Error && err.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    return err.message
  }

  return null
}

/** User-facing hint when Supabase Auth/REST cannot be reached (e.g. local stack not running). */
export function getSupabaseConnectionHint(err: unknown): string | null {
  const codes = collectErrorCodes(err)
  if (!codes.has('ECONNREFUSED') && !isFetchFailed(err)) {
    return null
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const isLocal =
    url.includes('127.0.0.1') || url.includes('localhost') || url.includes('0.0.0.0')

  if (isLocal) {
    return (
      'Local Supabase is not reachable. Run `supabase start` in the repo root, ' +
      'or set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your hosted project.'
    )
  }

  return 'Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and network access.'
}

function isUserNotAllowed(err: unknown): boolean {
  if (!(err && typeof err === 'object')) return false
  const e = err as { message?: string; status?: number }
  return e.status === 403 || e.message === 'User not allowed'
}

function isFetchFailed(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message.toLowerCase()
  return msg.includes('fetch failed') || msg.includes('authretryablefetcherror')
}

function collectErrorCodes(err: unknown): Set<string> {
  const codes = new Set<string>()
  let current: unknown = err
  for (let depth = 0; depth < 6 && current; depth++) {
    if (current && typeof current === 'object' && 'code' in current) {
      const code = (current as { code: unknown }).code
      if (typeof code === 'string') codes.add(code)
    }
    if (current instanceof Error && 'cause' in current) {
      current = current.cause
    } else {
      break
    }
  }
  return codes
}
