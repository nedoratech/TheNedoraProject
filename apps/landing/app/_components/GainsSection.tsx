import { LEADING_BODY, LEADING_HEADING, TEXT_16_DESKTOP, TEXT_BODY_DESKTOP } from '@/lib/sectionSpacing'
import ScrollReveal from './ScrollReveal'

export interface GainItem {
  title: string
  body: string
}

export interface GainsContent {
  label: string
  titleBefore: string
  titleAccent: string
  titleAfter: string
  description: string
  cta: string
  items: GainItem[]
}

export default function GainsSection({ label, titleBefore, titleAccent, titleAfter, description, cta, items }: GainsContent) {
  return (
    <section className="py-0 bg-[#0d1b3e] text-nd-white" id="why">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] items-stretch gap-y-0">
          <ScrollReveal className="pt-10 pb-5 sm:pt-12 sm:pb-6 lg:py-18 lg:pr-16 lg:border-r lg:border-white/[0.08]">
            <div className={`text-[0.65rem] ${TEXT_16_DESKTOP} tracking-[0.22em] uppercase font-bold text-[rgba(99,115,243,0.6)] mb-4 sm:mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[rgba(99,115,243,0.6)]`}>
              {label}
            </div>
            <h2 className={`text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.04em] ${LEADING_HEADING} mb-5 sm:mb-8`}>
              {titleBefore}
              <em className="not-italic text-nd-accent-bright">{titleAccent}</em>
              {titleAfter}
            </h2>
            <p className={`text-[0.95rem] ${TEXT_BODY_DESKTOP} text-white/55 ${LEADING_BODY} mb-6 sm:mb-12 max-w-[360px]`}>{description}</p>
            <a
              href="#contact-offer"
              className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.14em] uppercase font-bold text-nd-accent-bright border-b border-[rgba(99,115,243,0.3)] pb-1 hover:border-nd-accent-bright transition-colors duration-200"
            >
              {cta}
            </a>
          </ScrollReveal>

          <div className="pt-0 pb-10 sm:pt-0 sm:pb-12 lg:py-18 lg:pl-16 flex flex-col gap-0">
            {items.map((gain, i) => (
              <ScrollReveal
                key={gain.title}
                delay={i as 0 | 1 | 2}
                className="py-6 sm:py-8 border-b border-white/[0.07] last:border-none grid grid-cols-[auto_1fr] gap-5 sm:gap-6 items-start lg:hover:pl-3 transition-all duration-200"
              >
                <div className="w-9 h-9 border border-[rgba(99,115,243,0.3)] flex items-center justify-center text-nd-accent-bright text-[0.85rem] shrink-0 mt-0.5">
                  ⬡
                </div>
                <div>
                  <div className="text-[1rem] font-bold mb-2">{gain.title}</div>
                  <p className={`text-[0.86rem] ${TEXT_BODY_DESKTOP} text-white/55 ${LEADING_BODY}`}>{gain.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
