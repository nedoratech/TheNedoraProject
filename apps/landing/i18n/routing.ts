import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ro'],
  defaultLocale: 'en',
  localePrefix: 'as-needed', // /en is omitted, /ro is prefixed
  localeDetection: true, // Accept-Language → en or ro
})
