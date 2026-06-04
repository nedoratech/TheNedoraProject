import NedoraLogo from './NedoraLogo'
import { Link } from '@/i18n/navigation'

export interface FooterLink {
  text: string
  href: string
  external?: boolean
}

export interface FooterColumn {
  label: string
  links: FooterLink[]
}

export interface FooterContent {
  tagline: string
  copyright: string
  columns: FooterColumn[]
}

interface FooterProps extends FooterContent {
  locale: string
}

export default function Footer({ tagline, copyright, columns, locale }: FooterProps) {
  return (
    <footer className="bg-nd-black text-nd-white border-t border-white/[0.06]">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-16 py-14 sm:py-16 border-b border-white/[0.06]">
          <div>
            <NedoraLogo variant="light" className="mb-5" />
            <p className="text-[0.82rem] text-white/40 leading-[1.75] max-w-[280px]">{tagline}</p>
          </div>

          {columns.map((col) => (
            <div key={col.label}>
              <div className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-white/30 mb-5">{col.label}</div>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.text}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.82rem] text-white/50 hover:text-nd-white transition-colors duration-200"
                      >
                        {link.text}
                      </a>
                    ) : link.href.startsWith('#') ? (
                      <a href={link.href} className="text-[0.82rem] text-white/50 hover:text-nd-white transition-colors duration-200">
                        {link.text}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-[0.82rem] text-white/50 hover:text-nd-white transition-colors duration-200">
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
          <span className="text-[0.72rem] text-white/25 tracking-[0.05em]">{copyright}</span>
          <div className="flex gap-1 text-[0.68rem] tracking-[0.1em] uppercase font-bold">
            <Link href="/" locale="en" className={locale === 'en' ? 'text-nd-accent-bright' : 'text-white/35 hover:text-white/70 transition-colors'}>EN</Link>
            <span className="text-white/10 mx-1">/</span>
            <Link href="/" locale="ro" className={locale === 'ro' ? 'text-nd-accent-bright' : 'text-white/35 hover:text-white/70 transition-colors'}>RO</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
