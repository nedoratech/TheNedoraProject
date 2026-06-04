import { SECTION_BLOCK_MT, SECTION_HEADER_GRID, SECTION_PY } from '@/lib/sectionSpacing'
import ScrollReveal from './ScrollReveal'

export interface EngagementContent {
  label: string
  title: string
  description: string
  fixedBadge: string
  fixedTitle: string
  fixedBody: string
  fixedItems: string[]
  fixedCta: string
  timeBadge: string
  timeTitle: string
  timeBody: string
  timeItems: string[]
  timeCta: string
  noteBefore: string
  noteStrong: string
  noteAfter: string
}

export default function EngagementSection(props: EngagementContent) {
  const {
    label, title, description,
    fixedBadge, fixedTitle, fixedBody, fixedItems, fixedCta,
    timeBadge, timeTitle, timeBody, timeItems, timeCta,
    noteBefore, noteStrong, noteAfter,
  } = props

  return (
    <section className={`${SECTION_PY} bg-nd-grey-50 border-t border-nd-grey-100`} id="engagement">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-bright">
            {label}
          </div>
          <div className={`${SECTION_HEADER_GRID} mb-4`}>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.08] text-nd-black">{title}</h2>
            <p className="text-[0.95rem] text-nd-grey-600 leading-[1.75]">{description}</p>
          </div>
        </ScrollReveal>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${SECTION_BLOCK_MT} items-stretch`}>
          <ScrollReveal className="h-full">
            <div className="relative overflow-hidden border border-nd-grey-200 bg-nd-white p-7 sm:p-11 h-full w-full flex flex-col transition-all duration-200 hover:border-nd-accent-mid hover:shadow-[0_8px_40px_rgba(59,91,219,0.12)] group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,var(--color-nd-accent-light),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col flex-1 h-full w-full">
                <span className="self-start inline-flex text-[0.6rem] tracking-[0.18em] uppercase font-bold border-[1.5px] border-nd-accent-mid text-nd-accent px-2 py-0.5 mb-6">
                  {fixedBadge}
                </span>
                <h3 className="text-[1.5rem] font-bold tracking-[-0.025em] mb-4 text-nd-black">{fixedTitle}</h3>
                <p className="text-[0.88rem] text-nd-grey-600 leading-[1.75] mb-7">{fixedBody}</p>
                <ul className="flex flex-col gap-2.5 mb-9 flex-1">
                  {fixedItems.map((item) => (
                    <li key={item} className="text-[0.82rem] text-nd-grey-600 pl-4 relative before:content-['↗'] before:absolute before:left-0 before:text-nd-accent-mid before:text-[0.72rem]">
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-auto self-start inline-block text-[0.7rem] tracking-[0.14em] uppercase font-bold px-6 py-3 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright transition-colors duration-200">
                  {fixedCta}
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1} className="h-full">
            <div className="relative overflow-hidden border border-nd-grey-200 bg-nd-white p-7 sm:p-11 h-full w-full flex flex-col transition-all duration-200 hover:border-nd-accent-mid hover:shadow-[0_8px_40px_rgba(59,91,219,0.12)] group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,var(--color-nd-accent-light),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col flex-1 h-full w-full">
                <span className="self-start inline-flex text-[0.6rem] tracking-[0.18em] uppercase font-bold border-[1.5px] border-nd-accent-mid text-nd-accent px-2 py-0.5 mb-6">
                  {timeBadge}
                </span>
                <h3 className="text-[1.5rem] font-bold tracking-[-0.025em] mb-4 text-nd-black">{timeTitle}</h3>
                <p className="text-[0.88rem] text-nd-grey-600 leading-[1.75] mb-7">{timeBody}</p>
                <ul className="flex flex-col gap-2.5 mb-9 flex-1">
                  {timeItems.map((item) => (
                    <li key={item} className="text-[0.82rem] text-nd-grey-600 pl-4 relative before:content-['↗'] before:absolute before:left-0 before:text-nd-accent-mid before:text-[0.72rem]">
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-auto self-start inline-flex items-center gap-2 text-[0.7rem] tracking-[0.12em] uppercase font-bold text-nd-accent border-[1.5px] border-nd-accent px-6 py-3 hover:bg-nd-accent hover:text-nd-white transition-all duration-200">
                  {timeCta}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-6">
          <div className="border-l-[3px] border-nd-accent-mid bg-nd-accent-light px-6 sm:px-8 py-6 text-[0.88rem] text-nd-accent leading-[1.7]">
            {noteBefore}
            <strong className="text-nd-accent-dark">{noteStrong}</strong>
            {noteAfter}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
