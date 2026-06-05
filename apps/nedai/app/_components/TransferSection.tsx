import ScrollReveal from './ScrollReveal'

const TRANSFERS = [
  {
    scenario: 'Clinical urgency',
    caller: '"I\'ve been having chest pain since this morning and I need to see someone today."',
    nedai: 'Detects urgency signal. Instantly escalates to the duty nurse / triage line with a real-time flag: caller reports acute chest pain, onset this morning, requesting same-day appointment.',
    outcome: 'Transfer in under 3 seconds. Nurse picks up with full context — no re-explanation needed.',
    color: '#e91e8c',
    bgColor: 'rgba(233,30,140,0.05)',
  },
  {
    scenario: 'Billing dispute',
    caller: '"I got an invoice for a procedure I cancelled two weeks ago and I want this sorted out."',
    nedai: 'Recognises an administrative dispute outside its scope. Transfers to the billing department with: caller\'s name, account reference, and a summary of the complaint.',
    outcome: 'Billing team receives the case pre-briefed. No hold time, no cold handoff.',
    color: '#7c3aed',
    bgColor: 'rgba(124,58,237,0.04)',
  },
  {
    scenario: 'Explicit human request',
    caller: '"I\'d prefer to speak to a real person, please."',
    nedai: 'Acknowledges immediately — no friction, no persuasion loop. Queues the call to the next available agent with a note: caller preference for human interaction.',
    outcome: 'Customer feels heard. Trust maintained. Agent picks up knowing exactly what was requested.',
    color: '#9b5cf6',
    bgColor: 'rgba(155,92,246,0.04)',
  },
]

export default function TransferSection() {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-white border-t border-[rgba(124,58,237,0.1)]" id="transfers">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
            Smart escalation
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end mb-10 sm:mb-12">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b]">
              NedAI knows when to{' '}
              <em className="not-italic text-[#e91e8c]">hand over.</em>
            </h2>
            <p className="text-[0.95rem] lg:text-[1rem] leading-[1.6] text-[#5a5780]">
              NedAI is a tool that works alongside your team, not a replacement for them.
              Every transfer includes full context — your team never asks a caller to repeat themselves.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-0.5">
          {TRANSFERS.map((transfer, i) => (
            <ScrollReveal key={transfer.scenario} delay={(i % 3) as 0 | 1 | 2}>
              <div
                className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] border border-[rgba(124,58,237,0.12)] hover:border-[rgba(124,58,237,0.28)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.07)] transition-all duration-200"
                style={{ background: transfer.bgColor }}
              >
                {/* Scenario label */}
                <div className="p-6 sm:p-8 lg:border-r lg:border-[rgba(124,58,237,0.1)] flex flex-col justify-between gap-4 bg-white">
                  <div>
                    <div
                      className="inline-block text-[0.6rem] tracking-[0.2em] uppercase font-bold px-2.5 py-1 mb-4"
                      style={{ background: `${transfer.color}18`, color: transfer.color }}
                    >
                      {transfer.scenario}
                    </div>
                    <blockquote className="text-[0.9rem] leading-[1.6] text-[#3d3760] italic">
                      {transfer.caller}
                    </blockquote>
                  </div>
                </div>

                {/* NedAI response */}
                <div className="p-6 sm:p-8 lg:border-r lg:border-[rgba(124,58,237,0.1)] flex flex-col gap-3">
                  <div className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-[#9b5cf6]">
                    NedAI responds
                  </div>
                  <p className="text-[0.88rem] leading-[1.6] text-[#5a5780]">
                    {transfer.nedai}
                  </p>
                </div>

                {/* Outcome */}
                <div className="p-6 sm:p-8 flex flex-col justify-center gap-3 bg-white">
                  <div className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-[#9493b0]">
                    Outcome
                  </div>
                  <p className="text-[0.88rem] leading-[1.6] text-[#3d3760]">
                    {transfer.outcome}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-8 sm:mt-10">
          <p className="text-[0.82rem] leading-[1.6] text-[#9493b0] text-center max-w-[600px] mx-auto">
            NedAI is designed around one principle: your team should spend 100% of their time on
            interactions that genuinely require human judgement, empathy, and expertise.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
