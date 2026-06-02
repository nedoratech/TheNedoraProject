import ScrollReveal from './ScrollReveal'

export interface ProcessStep {
  phase: string
  title: string
  body: string
  items: string[]
}

export interface ProcessContent {
  label: string
  title: string
  description: string
  steps: ProcessStep[]
}

export default function ProcessSection({ label, title, description, steps }: ProcessContent) {
  return (
    <section className="py-32 bg-nd-white border-t border-nd-grey-100" id="process">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-bright">
            {label}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-end">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.08]">{title}</h2>
            <p className="text-[0.95rem] text-nd-grey-600 leading-[1.75]">{description}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-nd-grey-100 mt-14 sm:mt-20">
          {steps.map((step, i) => (
            <ScrollReveal
              key={step.phase}
              delay={i as 0 | 1 | 2 | 3}
              className={`pt-10 sm:pt-12 pb-10 relative overflow-hidden ${
                i < 3 ? 'lg:pr-10 lg:border-r lg:border-nd-grey-100' : ''
              } ${i > 0 ? 'lg:pl-10' : ''}`}
            >
              <span
                className="absolute -top-4 -right-4 text-[7rem] sm:text-[9rem] font-bold tracking-[-0.08em] text-nd-grey-100 leading-none pointer-events-none select-none"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative z-10">
                <div className="text-[0.62rem] tracking-[0.2em] uppercase font-bold text-nd-accent-mid mb-7">{step.phase}</div>
                <h3 className="text-[1.1rem] font-bold tracking-[-0.015em] mb-3">{step.title}</h3>
                <p className="text-[0.85rem] text-nd-grey-600 leading-[1.75] mb-6">{step.body}</p>
                <ul className="flex flex-col gap-1.5">
                  {step.items.map((item) => (
                    <li key={item} className="text-[0.78rem] text-nd-grey-400 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-nd-accent-mid before:text-[0.7rem]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
