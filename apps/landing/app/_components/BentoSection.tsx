import ScrollReveal from './ScrollReveal'

const cells = [
  {
    num: '01', span: 'col-span-4', variant: 'bg-nd-white border-nd-grey-100',
    title: 'Your reality shapes every decision',
    body: 'We map your workflows before we open an IDE. Software that doesn\'t fit how your teams actually work quickly becomes expensive shelfware.',
  },
  {
    num: '02', span: 'col-span-2', variant: 'bg-nd-black text-nd-white border-nd-black',
    title: 'Built for production — not demos',
    body: 'Security, maintainability, and documentation ship with the product.',
  },
  {
    num: '03', span: 'col-span-2', variant: 'bg-nd-accent text-nd-white border-nd-accent',
    title: 'Scope & progress you can plan around',
    bigNum: true,
  },
  {
    num: '04', span: 'col-span-3', variant: 'bg-nd-white border-nd-grey-100',
    title: 'Deliberate speed — never reckless',
    body: 'We move with urgency, but not at the cost of architecture decisions your next five years depend on. Technical debt is a business problem.',
  },
  {
    num: '05', span: 'col-span-1', variant: 'bg-nd-grey-50 border-nd-grey-100',
    title: 'A partnership that outlasts go-live',
    body: 'The same team that built the system is still here when you need to evolve it.',
  },
  {
    num: '06', span: 'col-span-3', variant: 'bg-nd-white border-nd-grey-100',
    title: 'Software your team can own',
    body: 'No lock-in, no black boxes. Your engineers inherit clean, documented code they can understand, maintain, and extend.',
  },
  {
    num: 'quote', span: 'col-span-2', variant: 'bg-nd-black text-nd-white border-nd-black',
    title: '"We stand behind every one of these. Not as aspirations — as standards."',
    isQuote: true,
  },
  {
    num: '→', span: 'col-span-1', variant: 'bg-nd-accent-light border-nd-grey-100',
    title: 'Start a conversation ↗',
    isLink: true,
  },
] as const

export default function BentoSection() {
  return (
    <section className="py-32 bg-nd-grey-50 border-t border-nd-grey-100" id="commitments">
      <div className="max-w-[1160px] mx-auto px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-bright">
            Our commitments
          </div>
          <div className="grid grid-cols-2 gap-16 items-end mb-0">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.08]">
              Six commitments every engagement is built on.
            </h2>
            <p className="text-[0.95rem] text-nd-grey-600 leading-[1.75]">
              These aren't values on a wall. They're the standards we hold ourselves to on every project.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-6 gap-0.5 mt-16">
          {cells.map((cell, i) => {
            const delay = (i % 3) as 0 | 1 | 2
            const isLight = cell.variant.includes('text-nd-white') || cell.variant.includes('text-white')

            if (cell.isLink) {
              return (
                <ScrollReveal key={i} delay={delay} className={`${cell.span}`}>
                  <a
                    href="#contact"
                    className={`flex flex-col justify-between p-10 h-full border transition-all duration-200 hover:opacity-80 ${cell.variant}`}
                  >
                    <span className={`text-[0.65rem] tracking-[0.2em] font-bold text-nd-accent-mid`}>{cell.num}</span>
                    <span className="text-[0.75rem] font-bold tracking-[0.12em] uppercase text-nd-accent flex items-center gap-2">{cell.title}</span>
                  </a>
                </ScrollReveal>
              )
            }

            if (cell.isQuote) {
              return (
                <ScrollReveal key={i} delay={delay} className={`${cell.span}`}>
                  <div className={`flex flex-col justify-end p-10 h-full border ${cell.variant}`}>
                    <blockquote className="text-[1rem] font-bold leading-[1.5] text-white/85">{cell.title}</blockquote>
                    <div className="text-[0.68rem] text-white/30 tracking-[0.1em] uppercase mt-4">Nedora · 2026</div>
                  </div>
                </ScrollReveal>
              )
            }

            return (
              <ScrollReveal key={i} delay={delay} className={`${cell.span}`}>
                <div
                  className={`p-10 h-full border transition-all duration-200 hover:shadow-[0_0_0_3px_var(--color-nd-accent-light)] group ${cell.variant}`}
                  style={{ cursor: 'default' }}
                >
                  {cell.bigNum ? (
                    <div className="text-[clamp(3rem,6vw,5rem)] font-bold tracking-[-0.06em] leading-[0.9] text-nd-accent-bright mb-3">
                      {cell.num}
                    </div>
                  ) : (
                    <div className={`text-[0.65rem] tracking-[0.2em] font-bold mb-6 ${isLight ? 'text-nd-accent-bright' : 'text-nd-accent-mid'}`}>
                      {cell.num}
                    </div>
                  )}
                  <div className="text-[1.05rem] font-bold tracking-[-0.01em] leading-[1.3] mb-3">{cell.title}</div>
                  {'body' in cell && cell.body && (
                    <p className={`text-[0.86rem] leading-[1.75] ${isLight ? 'opacity-60' : 'text-nd-grey-600'}`}>{cell.body}</p>
                  )}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
