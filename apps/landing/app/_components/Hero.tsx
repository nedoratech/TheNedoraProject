import AnimatedCounter from './AnimatedCounter'

export interface HeroStat {
  target: number
  suffix: string
  label: string
}

export interface HeroHeadlinePart {
  text: string
  highlight?: boolean
}

export interface HeroContent {
  eyebrow: string
  headlineParts: HeroHeadlinePart[]
  subheading: string
  ctaPrimary: string
  ctaSecondary: string
  scrollLabel: string
  stats: HeroStat[]
}

function ScrollHint({ label }: { label: string }) {
  return (
    <>
      <div
        className="w-px h-7 sm:h-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,.3), transparent)',
          animation: 'scrollPulse 1.8s ease-in-out infinite',
        }}
      />
      <span className="text-[0.58rem] tracking-[0.22em] uppercase text-white/25">{label}</span>
    </>
  )
}

export default function Hero({
  eyebrow,
  headlineParts,
  subheading,
  ctaPrimary,
  ctaSecondary,
  scrollLabel,
  stats,
}: HeroContent) {
  return (
    <section
      className="relative overflow-hidden bg-[#0a0a0a] pt-[var(--nd-nav-h)] lg:min-h-[100svh]"
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(99,115,243,.12) 0%, transparent 65%)',
          top: '50%',
          left: '55%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1160px] mx-auto px-5 sm:px-8 flex flex-col pt-10 sm:pt-12 lg:pt-14 pb-12 sm:pb-14 lg:min-h-[calc(100svh-var(--nd-nav-h))] lg:pb-16">
        <div>
          <div className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-8">
            <span className="w-1 h-1 bg-nd-accent-bright rounded-full" />
            {eyebrow}
          </div>

          <h1 className="text-[clamp(2.4rem,6vw,6.2rem)] sm:text-[clamp(2.6rem,6.2vw,6.2rem)] font-bold leading-[0.98] tracking-[-0.04em] text-nd-white max-w-[900px] mb-7 sm:mb-8 normal-case">
            {headlineParts.map((part, i) => (
              <span
                key={i}
                className={part.highlight ? 'text-nd-hero-highlight' : undefined}
              >
                {part.text}
              </span>
            ))}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 md:gap-12 max-w-[900px] mb-8 sm:mb-10 items-end">
            <p className="text-[1rem] leading-[1.75] text-white/55">{subheading}</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#contact-offer"
                className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.85rem] bg-nd-accent-mid text-nd-white border-0 cursor-pointer transition-all duration-200 hover:bg-nd-accent-bright hover:shadow-[0_0_32px_rgba(99,115,243,0.5)] hover:-translate-y-px"
              >
                {ctaPrimary}
              </a>
              <a
                href="#process"
                className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.85rem] bg-transparent text-white/70 border border-white/20 cursor-pointer transition-all duration-200 hover:bg-white/[0.06] hover:border-white/40 hover:text-nd-white"
              >
                {ctaSecondary}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/[0.08] pt-6 sm:pt-8 mt-5 sm:mt-6 max-w-[900px]">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center sm:text-left ${i < stats.length - 1 ? 'border-r border-white/[0.08] pr-4 sm:pr-12' : ''} ${i > 0 ? 'pl-4 sm:pl-12' : ''}`}
              >
                <div className="text-[clamp(1.9rem,7vw,3.4rem)] sm:text-[clamp(2.2rem,4.6vw,3.4rem)] font-bold tracking-[-0.05em] text-nd-white leading-none">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} className="text-nd-accent-bright" />
                </div>
                <div className="hidden sm:block text-[0.68rem] tracking-[0.14em] uppercase text-white/40 mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mt-8 sm:mt-10 lg:mt-auto pointer-events-none">
          <ScrollHint label={scrollLabel} />
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:.3} 50%{opacity:.8} }
      `}</style>
    </section>
  )
}
