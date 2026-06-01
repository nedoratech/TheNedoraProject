import type { ReactNode } from 'react'

// Minimal root layout — locale-specific layout lives in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
