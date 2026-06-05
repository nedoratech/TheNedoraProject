import ScrollReveal from './ScrollReveal'

const STEPS = [
  {
    phase: 'Step 01',
    title: 'Customer calls your number',
    body: 'NedAI answers instantly — no hold music, no waiting. Your existing phone numbers stay the same; we add intelligent routing on top.',
    items: ['Zero wait time', 'Same phone number', 'Any SIP provider'],
  },
  {
    phase: 'Step 02',
    title: 'NedAI understands and acts',
    body: 'From a single natural sentence, NedAI identifies intent and handles the interaction end-to-end — booking, FAQ, reschedule, or cancel.',
    items: ['Natural language processing', 'Live system integration', 'Instant confirmation'],
  },
  {
    phase: 'Step 03',
    title: 'Complex calls go to your team',
    body: "When a call needs a human — clinical urgency, disputes, or a customer's explicit request — NedAI transfers immediately with full context.",
    items: ['No dead ends', 'Full conversation summary', 'Customer never repeats themselves'],
  },
  {
    phase: 'Step 04',
    title: 'You grow without limits',
    body: 'Volume doubles — your team stays focused. New locations come online with full support from day one. ROI compounds as you scale.',
    items: ['No linear headcount growth', 'Instant new location coverage', 'Real-time reporting'],
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#f7f5ff] border-t border-[rgba(124,58,237,0.1)]" id="how-it-works">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal>
          <div className="text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
            How it works
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-end">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b]">
              Live in 90 days.{' '}
              <em className="not-italic text-[#7c3aed]">No disruption</em> to your current setup.
            </h2>
            <p className="text-[0.95rem] lg:text-[1rem] leading-[1.6] text-[#5a5780]">
              NedAI is activated alongside your existing infrastructure. Your team doesn't change
              how they work — they just handle fewer routine calls and more meaningful ones.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[rgba(124,58,237,0.12)] mt-10 sm:mt-12">
          {STEPS.map((step, i) => (
            <ScrollReveal
              key={step.phase}
              delay={i as 0 | 1 | 2 | 3}
              className={`pt-8 sm:pt-10 pb-8 relative overflow-hidden ${
                i < 3 ? 'lg:pr-10 lg:border-r lg:border-[rgba(124,58,237,0.1)]' : ''
              } ${i > 0 ? 'lg:pl-10' : ''}`}
            >
              <span
                className="absolute -top-4 -right-4 text-[7rem] sm:text-[9rem] font-bold tracking-[-0.08em] leading-none pointer-events-none select-none"
                style={{ color: 'rgba(124,58,237,0.06)' }}
                aria-hidden
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative z-10">
                <div className="text-[0.62rem] lg:text-[0.72rem] tracking-[0.2em] uppercase font-bold text-[#9b5cf6] mb-7">
                  {step.phase}
                </div>
                <h3 className="text-[1.05rem] font-bold tracking-[-0.015em] mb-3 text-[#0d0d2b] leading-[1.25]">
                  {step.title}
                </h3>
                <p className="text-[0.85rem] leading-[1.6] text-[#5a5780] mb-6">
                  {step.body}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="text-[0.78rem] leading-[1.5] text-[#9493b0] pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-[#7c3aed] before:text-[0.7rem]"
                    >
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
