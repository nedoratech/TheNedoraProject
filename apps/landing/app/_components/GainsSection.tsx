import ScrollReveal from './ScrollReveal'

const gains = [
  {
    title: 'Operations you can rely on',
    body: 'Critical workflows run on one dependable system instead of a patchwork of spreadsheets and manual workarounds. Your teams stop reconciling data and start serving customers.',
  },
  {
    title: 'A connected view of the business',
    body: 'Finance, operations, and sales draw from the same source of truth. Leaders act on current numbers — not stale exports emailed out of three different tools at the end of the week.',
  },
  {
    title: 'Room to grow without rework',
    body: 'Your platform evolves with regulation, volume, and new ideas — through planned releases with a team that already knows your context.',
  },
]

export default function GainsSection() {
  return (
    <section className="py-0 bg-[#0d1b3e] text-nd-white" id="why">
      <div className="max-w-[1160px] mx-auto px-8">
        <div className="grid grid-cols-[5fr_7fr] items-stretch">
          {/* Left */}
          <ScrollReveal className="py-24 pr-16 border-r border-white/[0.08]">
            <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-[rgba(99,115,243,0.6)] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[rgba(99,115,243,0.6)]">
              What your business gains
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-[-0.04em] leading-[1.05] mb-8">
              Software that reduces <em className="not-italic text-nd-accent-bright">friction,</em> risk, and guesswork.
            </h2>
            <p className="text-[1rem] text-white/55 leading-[1.75] mb-12 max-w-[360px]">
              We shape every engagement around delivering clarity — not another tool to manage.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-[0.72rem] tracking-[0.14em] uppercase font-bold text-nd-accent-bright border-b border-[rgba(99,115,243,0.3)] pb-1 hover:border-nd-accent-bright transition-colors duration-200"
            >
              Start a conversation ↗
            </a>
          </ScrollReveal>

          {/* Right */}
          <div className="py-24 pl-16 flex flex-col gap-0">
            {gains.map((gain, i) => (
              <ScrollReveal
                key={i}
                delay={i as 0 | 1 | 2}
                className="py-8 border-b border-white/[0.07] last:border-none grid grid-cols-[auto_1fr] gap-6 items-start hover:pl-3 transition-all duration-200"
              >
                <div className="w-9 h-9 border border-[rgba(99,115,243,0.3)] flex items-center justify-center text-nd-accent-bright text-[0.85rem] shrink-0 mt-0.5">
                  ⬡
                </div>
                <div>
                  <div className="text-[1rem] font-bold mb-2">{gain.title}</div>
                  <p className="text-[0.86rem] text-white/55 leading-[1.75]">{gain.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
