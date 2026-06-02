import { getTranslations } from 'next-intl/server'
import Nav from '../_components/Nav'
import Hero, { type HeroContent, type HeroStat } from '../_components/Hero'
import BentoSection, { type BentoCell, type BentoContent } from '../_components/BentoSection'
import GainsSection, { type GainsContent } from '../_components/GainsSection'
import ProcessSection, { type ProcessContent } from '../_components/ProcessSection'
import EngagementSection, { type EngagementContent } from '../_components/EngagementSection'
import BigCta, { type BigCtaContent } from '../_components/BigCta'
import ContactSection, { type ContactInfoContent } from '../_components/ContactSection'
import Footer, { type FooterContent } from '../_components/Footer'

// Static phase — content comes entirely from messages/en.json and messages/ro.json.
// CMS overlay will be wired back in once microCMS is set up.
export const dynamic = 'force-static'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const tHero = await getTranslations({ locale, namespace: 'hero' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tBento = await getTranslations({ locale, namespace: 'bento' })
  const tGains = await getTranslations({ locale, namespace: 'gains' })
  const tProcess = await getTranslations({ locale, namespace: 'process' })
  const tEngagement = await getTranslations({ locale, namespace: 'engagement' })
  const tBigCta = await getTranslations({ locale, namespace: 'bigCta' })
  const tContact = await getTranslations({ locale, namespace: 'contact' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const hero: HeroContent = {
    eyebrow:        tHero('eyebrow'),
    headlineBefore: tHero('headline_before'),
    headlineAccent: tHero('headline_accent'),
    headlineAfter:  tHero('headline_after'),
    subheading:     tHero('subheading'),
    ctaPrimary:     tHero('cta_primary'),
    ctaSecondary:   tHero('cta_secondary'),
    scrollLabel:    tHero('scroll'),
    stats:          tHero.raw('stats') as HeroStat[],
  }

  const nav = [
    { label: tNav('services'), href: '#commitments' },
    { label: tNav('about'), href: '#why' },
    { label: tNav('contact'), href: '#contact' },
  ]

  const bento: BentoContent = {
    label: tBento('label'),
    title: tBento('title'),
    description: tBento('description'),
    quote: tBento('quote'),
    quoteAttribution: tBento('quote_attribution'),
    cta: tBento('cta'),
    cells: tBento.raw('cells') as BentoCell[],
  }

  const gains: GainsContent = {
    label: tGains('label'),
    titleBefore: tGains('title_before'),
    titleAccent: tGains('title_accent'),
    titleAfter: tGains('title_after'),
    description: tGains('description'),
    cta: tGains('cta'),
    items: tGains.raw('items') as GainsContent['items'],
  }

  const process: ProcessContent = {
    label: tProcess('label'),
    title: tProcess('title'),
    description: tProcess('description'),
    steps: tProcess.raw('steps') as ProcessContent['steps'],
  }

  const engagement: EngagementContent = {
    label: tEngagement('label'),
    title: tEngagement('title'),
    description: tEngagement('description'),
    fixedBadge: tEngagement('fixed_badge'),
    fixedTitle: tEngagement('fixed_title'),
    fixedBody: tEngagement('fixed_body'),
    fixedItems: tEngagement.raw('fixed_items') as string[],
    fixedCta: tEngagement('fixed_cta'),
    timeBadge: tEngagement('time_badge'),
    timeTitle: tEngagement('time_title'),
    timeBody: tEngagement('time_body'),
    timeItems: tEngagement.raw('time_items') as string[],
    timeCta: tEngagement('time_cta'),
    noteBefore: tEngagement('note_before'),
    noteStrong: tEngagement('note_strong'),
    noteAfter: tEngagement('note_after'),
  }

  const bigCta: BigCtaContent = {
    label: tBigCta('label'),
    titleBefore: tBigCta('title_before'),
    titleAccent: tBigCta('title_accent'),
    titleAfter: tBigCta('title_after'),
    description: tBigCta('description'),
    ctaPrimary: tBigCta('cta_primary'),
    ctaSecondary: tBigCta('cta_secondary'),
    proof: tBigCta.raw('proof') as BigCtaContent['proof'],
  }

  const contact: ContactInfoContent = {
    label: tContact('label'),
    heading: tContact('heading'),
    description: tContact('description'),
    locationTitle: tContact('location_title'),
    locationValue: tContact('location_value'),
    linkedinTitle: tContact('linkedin_title'),
    linkedinValue: tContact('linkedin_value'),
    responseTitle: tContact('response_title'),
    responseValue: tContact('response_value'),
  }

  const footer: FooterContent = {
    tagline: tFooter('tagline'),
    copyright: tFooter('copyright', { year: new Date().getFullYear() }),
    columns: [
      {
        label: tFooter('columns.company.label'),
        links: [
          { text: tFooter('columns.company.links.solutions'), href: '#commitments' },
          { text: tFooter('columns.company.links.why'), href: '#why' },
          { text: tFooter('columns.company.links.process'), href: '#process' },
          { text: tFooter('columns.company.links.engagement'), href: '#engagement' },
        ],
      },
      {
        label: tFooter('columns.connect.label'),
        links: [
          { text: tFooter('columns.connect.links.offer'), href: '#contact' },
          { text: tFooter('columns.connect.links.linkedin'), href: 'https://linkedin.com/company/nedora-tech', external: true },
          { text: tFooter('columns.connect.links.privacy'), href: '/privacy' },
        ],
      },
      {
        label: tFooter('columns.products.label'),
        links: [{ text: tFooter('columns.products.links.nedai'), href: '#' }],
      },
    ],
  }

  return (
    <>
      <Nav items={nav} locales={['en', 'ro']} />
      <main>
        <Hero {...hero} />
        <BentoSection {...bento} />
        <GainsSection {...gains} />
        <ProcessSection {...process} />
        <EngagementSection {...engagement} />
        <BigCta {...bigCta} />
        <ContactSection {...contact} />
      </main>
      <Footer {...footer} />
    </>
  )
}
