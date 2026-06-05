import type { Metadata } from 'next'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './globals.css'

// Prevent Font Awesome from injecting CSS on the client (we import it server-side above)
config.autoAddCss = false

export const metadata: Metadata = {
  title: 'NedAI — AI Receptionist for Modern Businesses',
  description:
    'NedAI handles appointment booking, answers FAQs, and transfers complex calls to your team — 24/7, in natural language. Cut wait times, never miss a call.',
  openGraph: {
    title: 'NedAI — AI Receptionist',
    description:
      'Your front desk, working around the clock. NedAI automates routine calls so your team can focus on what matters.',
    type: 'website',
    url: 'https://nedai.co',
  },
  metadataBase: new URL('https://nedai.co'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
