import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except API routes, _next, and static assets
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
