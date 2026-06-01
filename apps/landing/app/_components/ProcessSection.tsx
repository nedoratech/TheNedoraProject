import ScrollReveal from './ScrollReveal'

const steps = [
  {
    phase: 'Discover',
    title: 'Align before we build',
    body: 'We spend time understanding your workflows, constraints, and definition of success before a line of code is written.',
    items: ['Stakeholder interviews and workflow mapping', 'Systems inventory, risks, and dependencies'],
  },
  {
    phase: 'Design',
    title: 'A plan you can approve',
    body: 'Architecture decisions and integration design — documented in a written proposal your stakeholders can review and sign off on.',
    items: ['Architecture, integrations, and delivery model', 'Timeline, milestones, and written proposal'],
  },
  {
    phase: 'Build',
    title: 'Deliver, test, repeat',
    body: 'Short, predictable cycles. Your team sees and approves working software at every checkpoint — not six months in.',
    items: ['Short cycles with acceptance checkpoints', 'Tests, documentation, and operable environments'],
  },
  {
    phase: 'Deliver',
    title: 'Go-live and beyond',
    body: "Cutover isn't the finish line. We stay engaged for knowledge transfer, stability monitoring, and the roadmap of what comes next.",
    items: ['Cutover support and knowledge transfer', 'Runbooks and roadmap for what comes next'],
  },
]

export default function ProcessSection() {
  return (
    <section className="py-32 bg-nd-white border-t border-nd-grey-100" id="process">
      <div className="max-w-[1160px] mx-auto px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-bright">
            Process
          </div>
          <div className="grid grid-cols-2 gap-16 items-end">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.08]">
              Four phases from first conversation through launch.
            </h2>
            <p className="text-[0.95rem] text-nd-grey-600 leading-[1.75]">
              Clear milestones and shared documentation at every step. No verbal estimates, no surprise invoices.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-4 border-t border-nd-grey-100 mt-20">
          {steps.map((step, i) => (
            <ScrollReveal
              key={i}
              delay={i as 0 | 1 | 2 | 3}
              className={`pt-12 pb-10 relative overflow-hidden ${i < 3 ? 'pr-10 border-r border-nd-grey-100' : ''} ${i > 0 ? 'pl-10' : ''}`}
            >
              {/* Ghost number */}
              <span
                className="absolute -top-4 -right-4 text-[9rem] font-bold tracking-[-0.08em] text-nd-grey-100 leading-none pointer-events-none select-none"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative z-10">
                <div className="text-[0.62rem] tracking-[0.2em] uppercase font-bold text-nd-accent-mid mb-7">
                  {step.phase}
                </div>
                <h3 className="text-[1.1rem] font-bold tracking-[-0.015em] mb-3">{step.title}</h3>
                <p className="text-[0.85rem] text-nd-grey-600 leading-[1.75] mb-6">{step.body}</p>
                <ul className="flex flex-col gap-1.5">
                  {step.items.map((item, j) => (
                    <li key={j} className="text-[0.78rem] text-nd-grey-400 pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-nd-accent-mid before:text-[0.7rem]">
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
