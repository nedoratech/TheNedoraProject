import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import ThemeProvider from './_components/ThemeProvider'
import './globals.css'

// Prevent FA from injecting its own <style> tag at runtime — we import the CSS above
config.autoAddCss = false

export const metadata: Metadata = {
  title: 'Nedora CRM',
  description: 'microCRM — lead, contact, and project request management',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nd-theme');if(!t)t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
