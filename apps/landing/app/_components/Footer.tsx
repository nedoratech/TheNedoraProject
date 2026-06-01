import Link from 'next/link'

interface FooterCol {
  label: string
  links: { text: string; href: string; external?: boolean }[]
}

const columns: FooterCol[] = [
  {
    label: 'Company',
    links: [
      { text: 'Solutions', href: '#commitments' },
      { text: 'Why Nedora', href: '#why' },
      { text: 'Process', href: '#process' },
      { text: 'Engagement', href: '#engagement' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { text: 'Request an offer', href: '#contact' },
      { text: 'LinkedIn', href: 'https://linkedin.com/company/nedora-tech', external: true },
      { text: 'Privacy Policy', href: '/privacy' },
    ],
  },
  {
    label: 'Products',
    links: [
      { text: 'NedAI', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-nd-black text-nd-white border-t border-white/[0.06]">
      <div className="max-w-[1160px] mx-auto px-8">
        {/* Top */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-16 py-16 border-b border-white/[0.06]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-[0.9rem] font-bold tracking-[0.22em] uppercase mb-5">
              <span className="w-1.5 h-1.5 bg-nd-accent-bright rounded-full" />
              NEDORA
            </div>
            <p className="text-[0.82rem] text-white/40 leading-[1.75] max-w-[280px]">
              Nedora designs and delivers enterprise-grade applications and integrations for businesses that need software built with intent.
            </p>
          </div>

          {/* Nav columns */}
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
                    ) : (
                      <a href={link.href} className="text-[0.82rem] text-white/50 hover:text-nd-white transition-colors duration-200">
                        {link.text}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between py-6">
          <span className="text-[0.72rem] text-white/25 tracking-[0.05em]">
            © Nedora · {new Date().getFullYear()}. All rights reserved.
          </span>
          <div className="flex gap-1 text-[0.68rem] tracking-[0.1em] uppercase font-bold">
            <a href="/" className="text-nd-accent-bright">EN</a>
            <span className="text-white/10 mx-1">/</span>
            <a href="/ro" className="text-white/35 hover:text-white/70 transition-colors">RO</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
