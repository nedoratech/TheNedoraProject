import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // Standalone marketing site: static per locale from messages/*.json; CRM/CMS not linked yet
  images: {
    unoptimized: true, // static-friendly; logos served from /public/svg
  },
}

export default withNextIntl(nextConfig)
