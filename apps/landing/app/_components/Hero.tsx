import AnimatedCounter from './AnimatedCounter'

export interface HeroStat {
  target: number
  suffix: string
  label: string
}

export interface HeroContent {
  eyebrow: string
  headlineBefore: string
  headlineAccent: string
  headlineAfter: string
  subheading: string
  ctaPrimary: string
  ctaSecondary: string
  scrollLabel: string
  stats: HeroStat[]
}

export default function Hero({
  eyebrow,
  headlineBefore,
  headlineAccent,
  headlineAfter,
  subheading,
  ctaPrimary,
  ctaSecondary,
  scrollLabel,
  stats,
}: HeroContent) {
  return (
    <section
      className="relative overflow-x-hidden"
      style={{
        background: '#0a0a0a',
        minHeight: '100svh',
        paddingTop: 'var(--nd-nav-h)',
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(99,115,243,.12) 0%, transparent 65%)',
          top: '50%', left: '55%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <div
        className="relative z-10 w-full max-w-[1160px] mx-auto px-5 sm:px-8 flex flex-col pt-14 sm:pt-16"
        style={{ height: 'calc(100svh - var(--nd-nav-h))' }}
      >
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-8">
            <span className="w-1 h-1 bg-nd-accent-bright rounded-full" />
            {eyebrow}
          </div>

          <h1 className="text-[clamp(2.6rem,6.2vw,6.2rem)] font-bold leading-[0.98] tracking-[-0.04em] text-nd-white max-w-[900px] mb-8">
            {headlineAccent ? (
              <>
                {headlineBefore}
                <em className="not-italic text-nd-accent-bright">{headlineAccent}</em>
                {headlineAfter}
              </>
            ) : (
              headlineBefore
            )}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 max-w-[900px] mb-10 items-end">
            <p className="text-[1rem] leading-[1.75] text-white/55">{subheading}</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#contact"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 border-t border-white/[0.08] pt-8 mt-6 max-w-[900px]">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`sm:flex-1 ${i > 0 ? 'sm:pl-12' : ''} ${i < stats.length - 1 ? 'sm:pr-12 sm:border-r sm:border-white/[0.08]' : ''}`}
              >
                <div className="text-[clamp(2.2rem,4.6vw,3.4rem)] font-bold tracking-[-0.05em] text-nd-white leading-none">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} className="text-nd-accent-bright" />
                </div>
                <div className="text-[0.68rem] tracking-[0.14em] uppercase text-white/40 mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 pb-5 flex flex-col items-center gap-2 pointer-events-none">
          <div
            className="w-px h-10"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,.3), transparent)', animation: 'scrollPulse 1.8s ease-in-out infinite' }}
          />
          <span className="text-[0.58rem] tracking-[0.22em] uppercase text-white/25">{scrollLabel}</span>
        </div>
      </div>

      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:.3} 50%{opacity:.8} }
      `}</style>
    </section>
  )
}
