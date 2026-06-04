import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request)
  const rewrite = response.headers.get('x-middleware-rewrite')

  if (!rewrite) {
    return response
  }

  // Next.js 16 + localePrefix "as-needed": rewrite is paired with location: "/",
  // which browsers follow in a loop. Serve the rewrite via NextResponse.next().
  // See https://github.com/amannn/next-intl/issues/1962#issuecomment-3113413575
  const rewritePath = new URL(rewrite).pathname + new URL(rewrite).search
  const rewriteOnRequestHost = new URL(rewritePath, request.url).href

  const next = NextResponse.next({ request })

  for (const [key, value] of response.headers.entries()) {
    if (key === 'location') {
      continue
    }
    if (key === 'x-middleware-rewrite') {
      if (value === request.nextUrl.href) {
        continue
      }
      next.headers.set(key, rewriteOnRequestHost)
      continue
    }
    next.headers.set(key, value)
  }

  return next
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
