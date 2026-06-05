import { SECTION_BLOCK_MT, SECTION_HEADER_GRID, SECTION_PY } from '@/lib/sectionSpacing'
import ScrollReveal from './ScrollReveal'

export interface BentoCell {
  num: string
  title: string
  body?: string
  bigNum?: boolean
}

export interface BentoContent {
  label: string
  title: string
  description: string
  quote: string
  quoteAttribution: string
  cta: string
  cells: BentoCell[]
}

/** lg grid is 12 cols (half-steps of the original 6-col layout: 1.5 → 3, 2 → 4, etc.) */
const cellLayout = [
  { lgCols: 8, variant: 'bg-nd-white border-nd-grey-100' },
  { lgCols: 4, variant: 'bg-nd-black text-nd-white border-nd-black' },
  { lgCols: 4, variant: 'bg-nd-accent text-nd-white border-nd-accent' },
  { lgCols: 5, variant: 'bg-nd-white border-nd-grey-100' },
  { lgCols: 3, variant: 'bg-nd-grey-50 border-nd-grey-100' },
  { lgCols: 4, variant: 'bg-nd-white border-nd-grey-100' },
] as const

const lgColSpanClass: Record<(typeof cellLayout)[number]['lgCols'], string> = {
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  8: 'lg:col-span-8',
}

export default function BentoSection({ label, title, description, quote, quoteAttribution, cta, cells }: BentoContent) {
  return (
    <section className={`${SECTION_PY} bg-nd-grey-50 border-t border-nd-grey-100`} id="commitments">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-bright">
            {label}
          </div>
          <div className={`${SECTION_HEADER_GRID} mb-0`}>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.08] text-nd-black">{title}</h2>
            <p className="text-[0.95rem] text-nd-grey-600 leading-[1.75]">{description}</p>
          </div>
        </ScrollReveal>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-0.5 ${SECTION_BLOCK_MT}`}>
          {cells.map((cell, i) => {
            const layout = cellLayout[i] ?? cellLayout[0]
            const delay = (i % 3) as 0 | 1 | 2
            const isLight = layout.variant.includes('text-nd-white')
            const spanClass =
              layout.lgCols >= 8
                ? `col-span-1 sm:col-span-2 ${lgColSpanClass[layout.lgCols]}`
                : `col-span-1 sm:col-span-1 ${lgColSpanClass[layout.lgCols]}`

            return (
              <ScrollReveal key={cell.num} delay={delay} className={spanClass}>
                <div
                  className={`p-7 sm:p-10 h-full border transition-all duration-200 hover:shadow-[0_0_0_3px_var(--color-nd-accent-light)] group ${layout.variant}`}
                >
                  {cell.bigNum ? (
                    <div className="text-[clamp(3rem,6vw,5rem)] font-bold tracking-[-0.06em] leading-[0.9] text-nd-accent-bright mb-3">
                      {cell.num}
                    </div>
                  ) : (
                    <div className={`text-[0.95rem] tracking-[0.2em] font-bold mb-6 ${isLight ? 'text-nd-accent-bright' : 'text-nd-accent-mid'}`}>
                      {cell.num}
                    </div>
                  )}
                  <div className={`text-[1.15rem] font-bold tracking-[-0.01em] leading-[1.35] mb-3 ${isLight ? 'text-nd-white' : 'text-nd-black'}`}>{cell.title}</div>
                  {cell.body && (
                    <p className={`text-[0.94rem] leading-[1.7] ${isLight ? 'text-white/70' : 'text-nd-grey-600'}`}>{cell.body}</p>
                  )}
                </div>
              </ScrollReveal>
            )
          })}

          <ScrollReveal delay={0} className="col-span-1 sm:col-span-2 lg:col-span-4">
            <div className="flex flex-col justify-end p-7 sm:p-10 h-full border bg-nd-black text-nd-white border-nd-black">
              <blockquote className="text-[1.1rem] font-bold leading-[1.5] text-white/85">{quote}</blockquote>
              <div className="text-[0.72rem] text-white/35 tracking-[0.1em] uppercase mt-4">{quoteAttribution}</div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1} className="col-span-1 sm:col-span-1 lg:col-span-4">
            <a
              href="#contact-offer"
              className="flex flex-col justify-between p-7 sm:p-10 h-full border bg-nd-accent-light border-nd-grey-100 transition-all duration-200 hover:opacity-80"
            >
              <span className="text-[0.65rem] tracking-[0.2em] font-bold text-nd-accent-mid">→</span>
              <span className="text-[0.82rem] font-bold tracking-[0.12em] uppercase text-nd-accent flex items-center gap-2">{cta}</span>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
