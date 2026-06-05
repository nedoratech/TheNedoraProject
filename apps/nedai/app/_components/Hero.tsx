import AnimatedCounter from './AnimatedCounter'

const STATS = [
  { target: 24, suffix: '/7', label: 'Always available' },
  { target: 60, suffix: '%', label: 'Calls automated' },
  { target: 90, suffix: ' days', label: 'To full activation' },
]

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-white pt-[var(--na-nav-h)] lg:min-h-[100svh]"
    >
      {/* Subtle background gradient blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
          top: '30%',
          right: '-10%',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 65%)',
          top: '10%',
          left: '-5%',
        }}
      />

      <div className="relative z-10 w-full max-w-[1160px] mx-auto px-5 sm:px-8 flex flex-col pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-14 lg:min-h-[calc(100svh-var(--na-nav-h))] lg:pb-16">
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#e91e8c] mb-8">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#e91e8c]"
              style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
            />
            AI Receptionist · Available 24/7
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.4rem,6vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[#0d0d2b] max-w-[900px] mb-7 sm:mb-8 normal-case">
            Your front desk,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #e91e8c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              never closed.
            </span>
          </h1>

          {/* Subheading + CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 md:gap-12 max-w-[900px] mb-8 sm:mb-10 items-end">
            <p className="text-[0.95rem] lg:text-[1rem] leading-[1.6] text-[#5a5780]">
              NedAI answers calls, books appointments, handles FAQs, and escalates complex
              cases to your team — in natural language, around the clock. Your staff focuses
              on what only humans can do.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#demo"
                className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.9rem] bg-[#e91e8c] text-white transition-all duration-200 hover:bg-[#c2177a] hover:shadow-[0_4px_24px_rgba(233,30,140,0.4)] hover:-translate-y-px"
              >
                Book a Demo
              </a>
              <a
                href="#how-it-works"
                className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.9rem] bg-transparent text-[#7c3aed] border border-[rgba(124,58,237,0.35)] transition-all duration-200 hover:bg-[rgba(124,58,237,0.06)] hover:border-[#7c3aed]"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 border-t border-[rgba(124,58,237,0.15)] pt-6 sm:pt-8 mt-5 sm:mt-6 max-w-[900px]">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center sm:text-left ${i < STATS.length - 1 ? 'border-r border-[rgba(124,58,237,0.12)] pr-4 sm:pr-12' : ''} ${i > 0 ? 'pl-4 sm:pl-12' : ''}`}
              >
                <div className="text-[clamp(1.9rem,7vw,3.4rem)] sm:text-[clamp(2.2rem,4.6vw,3.4rem)] font-bold tracking-[-0.05em] text-[#0d0d2b] leading-none">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    className="text-[#7c3aed]"
                  />
                </div>
                <div className="hidden sm:block text-[0.65rem] tracking-[0.14em] uppercase text-[#9493b0] mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-2 mt-8 sm:mt-10 lg:mt-auto pointer-events-none">
          <div
            className="w-px h-7 sm:h-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(124,58,237,.35), transparent)',
              animation: 'scrollPulse 1.8s ease-in-out infinite',
            }}
          />
          <span className="text-[0.55rem] tracking-[0.22em] uppercase text-[#9493b0]">scroll</span>
        </div>
      </div>
    </section>
  )
}
