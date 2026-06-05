import ScrollReveal from './ScrollReveal'
import AnimatedCounter from './AnimatedCounter'

const METRICS = [
  { target: 85, suffix: '%', label: 'Reduction in avg. wait time', sub: 'Peak hours: from 8–12 min to under 2 min' },
  { target: 60, suffix: '%', label: 'Of calls handled automatically', sub: 'Routine booking, FAQ, reschedule, cancel' },
  { target: 100, suffix: '%', label: 'After-hours coverage', sub: 'From zero coverage to always-on' },
  { target: 140, suffix: '%+', label: 'ROI in Year 1 (conservative)', sub: 'Based on avoided headcount cost alone' },
]

const TABLE_ROWS = [
  { metric: 'Avg. wait time (peak hours)', before: '8–12 min', after: '< 2 min', delta: '−85%' },
  { metric: 'After-hours coverage', before: '0%', after: '100%', delta: '+100%' },
  { metric: 'Call abandonment rate', before: '10–15%', after: '~5%', delta: '−60%' },
  { metric: 'Staff on routine calls', before: '~60% of time', after: '~0% of time', delta: 'Fully freed' },
  { metric: 'Cost per 10k extra monthly calls', before: '2+ new hires', after: '$0 additional', delta: 'Scale freely' },
]

export default function RoiSection() {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#f7f5ff] border-t border-[rgba(124,58,237,0.1)]" id="roi">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
            The numbers
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b]">
              ROI that starts{' '}
              <em
                className="not-italic"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #e91e8c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                before month three.
              </em>
            </h2>
            <p className="text-[0.95rem] lg:text-[1rem] leading-[1.6] text-[#5a5780]">
              NedAI's business case is built on your existing operational cost — not projected
              revenue. Even on the most conservative assumptions, the numbers are unambiguous.
            </p>
          </div>
        </ScrollReveal>

        {/* Big metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-[rgba(124,58,237,0.12)] bg-white mt-10 sm:mt-12">
          {METRICS.map((m, i) => (
            <ScrollReveal
              key={m.label}
              delay={(i % 4) as 0 | 1 | 2 | 3}
              className={`py-8 px-6 sm:px-8 ${i < METRICS.length - 1 ? 'border-r border-[rgba(124,58,237,0.1)]' : ''}`}
            >
              <div className="text-[clamp(2rem,5vw,3.4rem)] font-bold tracking-[-0.05em] text-[#0d0d2b] leading-none mb-2">
                <AnimatedCounter
                  target={m.target}
                  suffix={m.suffix}
                  className="text-[#7c3aed]"
                />
              </div>
              <div className="text-[0.78rem] font-bold text-[#0d0d2b] leading-[1.25] mb-1.5">{m.label}</div>
              <div className="text-[0.68rem] text-[#9493b0] leading-[1.4]">{m.sub}</div>
            </ScrollReveal>
          ))}
        </div>

        {/* Comparison table */}
        <ScrollReveal className="mt-6">
          <div className="overflow-x-auto bg-white border border-[rgba(124,58,237,0.12)]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[rgba(124,58,237,0.1)] bg-[#f7f5ff]">
                  <th className="text-[0.62rem] tracking-[0.18em] uppercase font-bold text-[#9493b0] pb-4 pt-5 px-6 w-1/2">Metric</th>
                  <th className="text-[0.62rem] tracking-[0.18em] uppercase font-bold text-[#9493b0] pb-4 pt-5 px-4">Without NedAI</th>
                  <th className="text-[0.62rem] tracking-[0.18em] uppercase font-bold text-[#9493b0] pb-4 pt-5 px-4">With NedAI</th>
                  <th className="text-[0.62rem] tracking-[0.18em] uppercase font-bold text-[#7c3aed] pb-4 pt-5 px-6">Change</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr
                    key={row.metric}
                    className={`border-b ${i === TABLE_ROWS.length - 1 ? 'border-transparent' : 'border-[rgba(124,58,237,0.07)]'} hover:bg-[rgba(124,58,237,0.02)] transition-colors`}
                  >
                    <td className="text-[0.85rem] text-[#5a5780] py-4 px-6 leading-[1.4]">{row.metric}</td>
                    <td className="text-[0.85rem] text-[#9493b0] py-4 px-4">{row.before}</td>
                    <td className="text-[0.85rem] text-[#0d0d2b] font-bold py-4 px-4">{row.after}</td>
                    <td className="text-[0.85rem] font-bold py-4 px-6 text-[#7c3aed]">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[0.68rem] text-[#9493b0] mt-3 leading-[1.4]">
            Projections based on benchmarks from comparable call centre operations. Your actual results depend on current call volume, team size, and booking system. We model this together during your demo.
          </p>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal className="mt-8 sm:mt-10 p-8 sm:p-12 border border-[rgba(233,30,140,0.2)] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[1.1rem] font-bold text-[#0d0d2b] leading-[1.3] mb-2">
              Want a model built for your business?
            </p>
            <p className="text-[0.88rem] text-[#5a5780] leading-[1.6]">
              Book a demo and we'll run a custom ROI calculation based on your actual call volume and team size.
            </p>
          </div>
          <a
            href="#demo"
            className="shrink-0 text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-4 bg-[#e91e8c] text-white hover:bg-[#c2177a] hover:shadow-[0_4px_20px_rgba(233,30,140,0.3)] transition-all duration-200"
          >
            Get My ROI Model →
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
