import { getTranslations } from 'next-intl/server'
import Nav from '../_components/Nav'
import Hero from '../_components/Hero'
import MarqueeTrustBar from '../_components/MarqueeTrustBar'
import BentoSection from '../_components/BentoSection'
import GainsSection from '../_components/GainsSection'
import ProcessSection from '../_components/ProcessSection'
import EngagementSection from '../_components/EngagementSection'
import BigCta from '../_components/BigCta'
import ContactSection from '../_components/ContactSection'
import Footer from '../_components/Footer'

// CMS content fetching (gracefully degrades when CMS unavailable)
async function getCmsContent(locale: string) {
  try {
    const { getPageBlocks, getNavigation, getActiveLocales } = await import('@nedora/db/cms')
    const [blocks, navItems, activeLocales] = await Promise.all([
      getPageBlocks('home', locale),
      getNavigation('main', locale),
      getActiveLocales(),
    ])
    return { blocks, navItems, activeLocales }
  } catch {
    // CMS unavailable — fall through to static translations
    return { blocks: {}, navItems: [], activeLocales: [locale] }
  }
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  const tnav = await getTranslations({ locale, namespace: 'nav' })

  const { blocks, navItems, activeLocales } = await getCmsContent(locale)

  // Merge CMS blocks over static translations (CMS wins)
  const hero = {
    eyebrow:     (blocks as Record<string, string>)['hero.eyebrow']     ?? t('eyebrow'),
    heading:     (blocks as Record<string, string>)['hero.heading']     ?? t('heading'),
    subheading:  (blocks as Record<string, string>)['hero.subheading']  ?? t('subheading'),
    ctaPrimary:  (blocks as Record<string, string>)['hero.cta_primary'] ?? t('cta_primary'),
    ctaSecondary:(blocks as Record<string, string>)['hero.cta_secondary'] ?? t('cta_secondary'),
  }

  const defaultNavItems = [
    { label: tnav('services'), href: '#commitments' },
    { label: tnav('about'), href: '#why' },
    { label: tnav('contact'), href: '#contact' },
  ]

  const nav = navItems.length > 0
    ? navItems.map((n: { label: string; href: string }) => ({ label: n.label, href: n.href }))
    : defaultNavItems

  return (
    <>
      <Nav items={nav} locales={activeLocales} />
      <main>
        <Hero {...hero} />
        <MarqueeTrustBar />
        <BentoSection />
        <GainsSection />
        <ProcessSection />
        <EngagementSection />
        <BigCta />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
