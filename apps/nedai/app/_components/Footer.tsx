import Image from 'next/image'
import NedAILogoSVG from './NedAILogoSVG'

const LINKS = [
  { label: 'Product', items: [
    { text: 'How It Works', href: '#how-it-works' },
    { text: 'Capabilities', href: '#capabilities' },
    { text: 'Smart Transfers', href: '#transfers' },
    { text: 'ROI Calculator', href: '#roi' },
  ]},
  { label: 'Company', items: [
    { text: 'Industries', href: '#industries' },
    { text: 'Book a Demo', href: '#demo' },
    { text: 'Newsletter', href: '#newsletter' },
    { text: 'Privacy Policy', href: '/privacy' },
  ]},
  { label: 'Legal', items: [
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Unsubscribe', href: '/unsubscribe' },
    { text: 'GDPR', href: '/privacy#data-rights' },
    { text: 'Contact', href: 'mailto:hello@nedai.co' },
  ]},
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0d0d2b] text-white border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-16 py-14 sm:py-16 border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <NedAILogoSVG height={28} className="mb-5 opacity-90" />
            <p className="text-[rgba(250,250,250,0.4)] leading-[1.6] max-w-[280px] text-[0.88rem]">
              AI receptionist for modern businesses. Answers calls, books appointments, and transfers complex cases — 24/7.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-[0.62rem] tracking-[0.1em] uppercase text-[rgba(250,250,250,0.2)]">by</span>
              <a href="https://nedora.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center opacity-35 hover:opacity-70 transition-opacity duration-200">
                <Image
                  src="/nedora-logo-white.png"
                  alt="Nedora"
                  width={80}
                  height={20}
                  className="h-5 w-auto"
                />
              </a>
            </div>
          </div>

          {LINKS.map((col) => (
            <div key={col.label}>
              <div className="tracking-[0.2em] uppercase font-bold text-[rgba(250,250,250,0.2)] text-[0.62rem] mb-5">
                {col.label}
              </div>
              <ul className="flex flex-col gap-3">
                {col.items.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-[rgba(250,250,250,0.45)] hover:text-white transition-colors duration-200 text-[0.88rem]"
                      {...(link.href.startsWith('http') || link.href.startsWith('mailto')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6">
          <span className="text-[rgba(250,250,250,0.2)] tracking-[0.05em] text-[0.75rem]">
            © {year} Nedora SRL. All rights reserved. NedAI is a product by Nedora.
          </span>
          <div className="flex items-center gap-4 text-[0.72rem] tracking-[0.1em]">
            <a href="https://nedora.co" target="_blank" rel="noopener noreferrer" className="text-[rgba(250,250,250,0.2)] hover:text-[rgba(250,250,250,0.6)] transition-colors uppercase font-bold">
              nedora.co
            </a>
            <span className="text-[rgba(250,250,250,0.1)]">·</span>
            <a href="mailto:hello@nedai.co" className="text-[rgba(250,250,250,0.2)] hover:text-[rgba(250,250,250,0.6)] transition-colors">
              hello@nedai.co
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
