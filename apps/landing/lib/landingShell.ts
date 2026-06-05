import type { FooterContent } from '@/app/_components/Footer'
import {
  getNedaiProductUrl,
  isExternalNavUrl,
  isNavSolutionsEnabled,
} from '@/lib/featureFlags'

type FooterTranslator = (key: string, values?: { year: number }) => string

export const NEDAI_LOGO_SRC = '/img/nedai-logo.png'

export interface NavProductTheme {
  /** Primary brand color — hover border, arrow, name accent. */
  accent: string
  /** Subtle hover background tint. */
  accentSoft: string
  /** Default product name color. */
  name: string
}

export interface NavProductItem {
  label: string
  description: string
  mobileDescription: string
  href: string
  external?: boolean
  logoSrc: string
  theme: NavProductTheme
}

export interface NavProductsMenu {
  label: string
  productsColumnLabel: string
  items: NavProductItem[]
}

export function buildNavProductsMenu(t: (key: string) => string): NavProductsMenu | null {
  if (!isNavSolutionsEnabled()) return null

  const href = getNedaiProductUrl()

  return {
    label: t('solutions.label'),
    productsColumnLabel: t('solutions.products_column'),
    items: [
      {
        label: t('solutions.items.nedai.label'),
        description: t('solutions.items.nedai.description'),
        mobileDescription: t('solutions.items.nedai.mobile_description'),
        href,
        external: isExternalNavUrl(href),
        logoSrc: NEDAI_LOGO_SRC,
        theme: {
          accent: '#e91e8c',
          accentSoft: 'rgba(233, 30, 140, 0.07)',
          name: '#1a1a40',
        },
      },
    ],
  }
}

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
      ...(isNavSolutionsEnabled()
        ? [
            {
              label: t('columns.products.label'),
              links: [
                {
                  text: t('columns.products.links.nedai'),
                  href: getNedaiProductUrl(),
                  external: isExternalNavUrl(getNedaiProductUrl()),
                },
              ],
            },
          ]
        : []),
    ],
  }
}

export function buildHomeNavItems(t: (key: string) => string) {
  return [
    { label: t('services'), href: '#commitments' },
    { label: t('about'), href: '#why' },
    { label: t('contact'), href: '#contact-message' },
  ]
}

export function buildShellNavItems(t: (key: string) => string) {
  return [
    { label: t('services'), href: '/#commitments' },
    { label: t('about'), href: '/#why' },
    { label: t('contact'), href: '/#contact-message' },
  ]
}
