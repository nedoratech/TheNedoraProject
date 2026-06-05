'use client'

import { useEffect, useState } from 'react'
import NedAILogoSVG from './NedAILogoSVG'

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'ROI', href: '#roi' },
  { label: 'Industries', href: '#industries' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[rgba(124,58,237,0.15)] shadow-[0_1px_20px_rgba(124,58,237,0.08)]'
          : 'bg-white border-b border-[rgba(124,58,237,0.1)]'
      }`}
      style={{ height: 'var(--na-nav-h)' }}
    >
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8 h-full flex items-center justify-between gap-6">
        <a href="/" aria-label="NedAI">
          <NedAILogoSVG height={30} />
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.7rem] tracking-[0.14em] uppercase font-bold text-[#5a5780] hover:text-[#7c3aed] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#demo"
          className="hidden md:inline-flex text-[0.7rem] tracking-[0.14em] uppercase font-bold px-6 py-[0.75rem] bg-[#e91e8c] text-white hover:bg-[#c2177a] hover:shadow-[0_4px_20px_rgba(233,30,140,0.35)] transition-all duration-200"
        >
          Book a Demo
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`block w-5 h-0.5 bg-[#0d0d2b] transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#0d0d2b] transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#0d0d2b] transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-[rgba(124,58,237,0.12)] px-5 py-6 flex flex-col gap-4 shadow-lg">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[0.75rem] tracking-[0.14em] uppercase font-bold text-[#3d3760] hover:text-[#7c3aed] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            onClick={() => setOpen(false)}
            className="mt-2 text-[0.75rem] tracking-[0.14em] uppercase font-bold px-6 py-3 bg-[#e91e8c] text-white text-center"
          >
            Book a Demo
          </a>
        </div>
      )}
    </header>
  )
}
