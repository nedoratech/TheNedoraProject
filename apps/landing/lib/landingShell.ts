import type { FooterContent } from '@/app/_components/Footer'

type FooterTranslator = (key: string, values?: { year: number }) => string

/** Shared footer copy for landing and legal pages. */
export function buildFooterContent(t: FooterTranslator, locale: string): FooterContent {
  return {
    tagline: t('tagline'),
    copyright: t('copyright', { year: new Date().getFullYear() }),
    columns: [
      {
        label: t('columns.company.label'),
        links: [
          { text: t('columns.company.links.solutions'), href: '/#commitments' },
          { text: t('columns.company.links.why'), href: '/#why' },
          { text: t('columns.company.links.process'), href: '/#process' },
          { text: t('columns.company.links.engagement'), href: '/#engagement' },
        ],
      },
      {
        label: t('columns.connect.label'),
        links: [
          { text: t('columns.connect.links.offer'), href: '/#contact-offer' },
          { text: t('columns.connect.links.linkedin'), href: 'https://linkedin.com/company/nedora-tech', external: true },
          { text: t('columns.connect.links.privacy'), href: '/privacy' },
        ],
      },
      {
        label: t('columns.products.label'),
        links: [{ text: t('columns.products.links.nedai'), href: '#' }],
      },
    ],
  }
}

export function buildHomeNavItems(t: (key: string) => string) {
  return [
    { label: t('services'), href: '#commitments' },
    { label: t('about'), href: '#why' },
    { label: t('contact'), href: '#contact' },
  ]
}

export function buildShellNavItems(t: (key: string) => string) {
  return [
    { label: t('services'), href: '/#commitments' },
    { label: t('about'), href: '/#why' },
    { label: t('contact'), href: '/#contact' },
  ]
}
