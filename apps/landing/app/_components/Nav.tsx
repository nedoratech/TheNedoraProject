'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import NedoraLogo from './NedoraLogo'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [hash, setHash] = useState('')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const update = () => setHash(window.location.hash || '')
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const normalizedPathname = useMemo(() => {
    // Safety: if we ever get a localized pathname (e.g. "/ro/..."), strip it.
    // This prevents locale duplication like "/ro/ro".
    for (const l of routing.locales) {
      if (pathname === `/${l}`) return '/'
      if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1) || '/'
    }
    return pathname
  }, [pathname])

  const localeHref = useMemo(() => `${normalizedPathname}${hash}`, [normalizedPathname, hash])

  const switchLocale = (l: string) => {
    if (l === locale) return
    setMenuOpen(false)
    router.replace(localeHref, { locale: l })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100]">
      <div
        className="flex items-center justify-between px-5 sm:px-8 h-[var(--nd-nav-h)] border-b border-white/[0.06] transition-all duration-300"
        style={{ background: scrolled ? 'rgba(10,10,10,.95)' : 'rgba(10,10,10,.7)', backdropFilter: 'blur(20px) saturate(1.8)' }}
      >
        <NedoraLogo variant="light" priority />

        <ul className="hidden md:flex gap-8 text-[0.72rem] tracking-[0.1em] uppercase font-medium">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-white/50 hover:text-nd-white transition-colors duration-200">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          {locales.length > 1 && (
            <div className="hidden sm:flex gap-1 text-[0.68rem] tracking-[0.1em] uppercase font-bold">
              {locales.map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  {i > 0 && <span className="text-white/15">/</span>}
                  <button
                    type="button"
                    onClick={() => {
                      switchLocale(l)
                    }}
                    className={`cursor-pointer transition-colors duration-200 ${l === locale ? 'text-nd-accent-bright' : 'text-white/35 hover:text-white/70'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
          )}
          <a
            href="#contact"
            className="hidden sm:inline-flex text-[0.68rem] tracking-[0.14em] uppercase font-bold px-[1.4rem] py-[0.6rem] bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright hover:shadow-[0_0_24px_rgba(99,115,243,0.45)] transition-all duration-200"
          >
            {t('cta')}
          </a>

          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 border border-white/[0.12] text-white/70 hover:text-white hover:border-white/25 transition-colors duration-200"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="text-[0.9rem] tracking-[0.12em] font-bold">{menuOpen ? '×' : '≡'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-b border-white/[0.06]" style={{ background: 'rgba(10,10,10,.97)', backdropFilter: 'blur(20px) saturate(1.8)' }}>
          <div className="px-5 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[0.72rem] tracking-[0.12em] uppercase font-bold text-white/70 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {locales.length > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <div className="flex gap-1 text-[0.68rem] tracking-[0.1em] uppercase font-bold">
                  {locales.map((l, i) => (
                    <span key={l} className="flex items-center gap-1">
                      {i > 0 && <span className="text-white/15">/</span>}
                      <button
                        type="button"
                        onClick={() => {
                          switchLocale(l)
                        }}
                        className={`cursor-pointer transition-colors duration-200 ${l === locale ? 'text-nd-accent-bright' : 'text-white/35 hover:text-white/70'}`}
                      >
                        {l.toUpperCase()}
                      </button>
                    </span>
                  ))}
                </div>

                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-[0.68rem] tracking-[0.14em] uppercase font-bold px-5 py-3 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright transition-colors duration-200"
                >
                  {t('cta')}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
