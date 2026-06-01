'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

interface NavItem {
  label: string
  href: string
}

interface Props {
  items: NavItem[]
  locales: string[]
}

export default function Nav({ items, locales }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      <div
        className="flex items-center justify-between px-8 py-[1.1rem] border-b border-white/[0.06] transition-all duration-300"
        style={{ background: scrolled ? 'rgba(10,10,10,.95)' : 'rgba(10,10,10,.7)', backdropFilter: 'blur(20px) saturate(1.8)' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[0.9rem] font-bold tracking-[0.22em] uppercase text-nd-white">
          <span className="w-1.5 h-1.5 bg-nd-accent-bright rounded-full" />
          NEDORA
        </Link>

        {/* Nav links */}
        <ul className="flex gap-8 text-[0.72rem] tracking-[0.1em] uppercase font-medium">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-white/50 hover:text-nd-white transition-colors duration-200">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: locale switcher + CTA */}
        <div className="flex items-center gap-5">
          {locales.length > 1 && (
            <div className="flex gap-1 text-[0.68rem] tracking-[0.1em] uppercase font-bold">
              {locales.map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  {i > 0 && <span className="text-white/15">/</span>}
                  <button
                    onClick={() => router.replace(pathname, { locale: l })}
                    className={`transition-colors duration-200 ${l === locale ? 'text-nd-accent-bright' : 'text-white/35 hover:text-white/70'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
          )}
          <a
            href="#contact"
            className="text-[0.68rem] tracking-[0.14em] uppercase font-bold px-[1.4rem] py-[0.6rem] bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright hover:shadow-[0_0_24px_rgba(99,115,243,0.45)] transition-all duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  )
}
