import ScrollReveal from './ScrollReveal'

export default function EngagementSection() {
  return (
    <section className="py-32 bg-nd-grey-50 border-t border-nd-grey-100" id="engagement">
      <div className="max-w-[1160px] mx-auto px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-nd-accent-bright">
            Engagement models
          </div>
          <div className="grid grid-cols-2 gap-16 items-end mb-4">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.08]">
              Choose the model that matches your certainty of scope.
            </h2>
            <p className="text-[0.95rem] text-nd-grey-600 leading-[1.75]">
              Many clients begin with a time-based discovery to sharpen requirements, then move to fixed-scope delivery for the build.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-6 mt-16">
          {/* Fixed-scope card */}
          <ScrollReveal>
            <div className="relative overflow-hidden border border-nd-grey-200 bg-nd-white p-11 transition-all duration-200 hover:border-nd-accent-mid hover:shadow-[0_8px_40px_rgba(59,91,219,0.12)] group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,var(--color-nd-accent-light),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <span className="inline-flex text-[0.6rem] tracking-[0.18em] uppercase font-bold border-[1.5px] border-nd-accent-mid text-nd-accent px-2 py-0.5 mb-6">
                  Fixed-scope
                </span>
                <h3 className="text-[1.5rem] font-bold tracking-[-0.025em] mb-4">Fixed-Scope Delivery</h3>
                <p className="text-[0.88rem] text-nd-grey-600 leading-[1.75] mb-7">
                  Defined outcomes, timeline, and investment — upfront. Best when requirements are clear, or when you want a bounded MVP, a specific integration, or a clean migration.
                </p>
                <ul className="flex flex-col gap-2.5 mb-9">
                  {['Clear proposal with acceptance criteria', 'Milestone-based delivery and live demos', 'Formal change control when scope evolves'].map((item, i) => (
                    <li key={i} className="text-[0.82rem] text-nd-grey-600 pl-4 relative before:content-['↗'] before:absolute before:left-0 before:text-nd-accent-mid before:text-[0.72rem]">
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="inline-block text-[0.7rem] tracking-[0.14em] uppercase font-bold px-6 py-3 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright transition-colors duration-200">
                  Request a fixed-scope offer
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Time-based card */}
          <ScrollReveal delay={1}>
            <div className="relative overflow-hidden border border-nd-grey-200 bg-nd-white p-11 transition-all duration-200 hover:border-nd-accent-mid hover:shadow-[0_8px_40px_rgba(59,91,219,0.12)] group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,var(--color-nd-accent-light),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <span className="inline-flex text-[0.6rem] tracking-[0.18em] uppercase font-bold border-[1.5px] border-nd-accent-mid text-nd-accent px-2 py-0.5 mb-6">
                  Time-based
                </span>
                <h3 className="text-[1.5rem] font-bold tracking-[-0.025em] mb-4">Time-Based Engagement</h3>
                <p className="text-[0.88rem] text-nd-grey-600 leading-[1.75] mb-7">
                  Dedicated capacity by sprint — ideal for discovery, evolving backlogs, team augmentation, or long-term product evolution. You direct the work; we deliver with full transparency.
                </p>
                <ul className="flex flex-col gap-2.5 mb-9">
                  {['Flexible priorities as you learn', 'Transparent reporting on time and progress', 'Scale up or down as needs change'].map((item, i) => (
                    <li key={i} className="text-[0.82rem] text-nd-grey-600 pl-4 relative before:content-['↗'] before:absolute before:left-0 before:text-nd-accent-mid before:text-[0.72rem]">
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.12em] uppercase font-bold text-nd-accent border-[1.5px] border-nd-accent px-6 py-3 hover:bg-nd-accent hover:text-nd-white transition-all duration-200">
                  Discuss time-based work
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-6">
          <div className="border-l-[3px] border-nd-accent-mid bg-nd-accent-light px-8 py-6 text-[0.88rem] text-nd-accent leading-[1.7]">
            Not sure which model fits? <strong className="text-nd-accent-dark">Start with a discovery call</strong> — we'll help you choose the structure that gives you the most confidence at each stage.
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
