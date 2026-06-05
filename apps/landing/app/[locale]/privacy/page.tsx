import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Nav from '../../_components/Nav'
import Footer from '../../_components/Footer'
import PrivacyPolicy, { type PrivacyPolicyContent } from '../../_components/PrivacyPolicy'
import { buildFooterContent, buildNavProductsMenu, buildShellNavItems } from '@/lib/landingShell'

export const dynamic = 'force-static'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'privacy' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'privacy' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const content: PrivacyPolicyContent = {
    label: t('label'),
    title: t('title'),
    updated: t('updated'),
    intro: t('intro'),
    sections: t.raw('sections') as PrivacyPolicyContent['sections'],
    contactTitle: t('contact.title'),
    contactBody: t('contact.body'),
    contactEmail: t('contact.email'),
    backLabel: t('back'),
  }

  return (
    <>
      <Nav
        items={buildShellNavItems((key) => tNav(key))}
        productsMenu={buildNavProductsMenu((key) => tNav(key))}
        locales={['en', 'ro']}
        contactHref="/#contact-offer"
        solid
      />
      <main className="bg-nd-white min-h-[calc(100vh-var(--nd-nav-h))] pt-[var(--nd-nav-h)]">
        <PrivacyPolicy {...content} />
      </main>
      <Footer {...buildFooterContent((key, values) => tFooter(key, values), locale)} locale={locale} />
    </>
  )
}
