import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  transpilePackages: ['@nedora/db'],
  // Standalone marketing site: pre-rendered per locale; CMS/CRM via server actions when deployed with Node
  images: {
    unoptimized: true, // static-friendly; logos served from /public/svg
  },
}

export default withNextIntl(nextConfig)
