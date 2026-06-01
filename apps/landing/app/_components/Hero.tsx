import AnimatedCounter from './AnimatedCounter'

interface Props {
  eyebrow: string
  heading: string
  subheading: string
  ctaPrimary: string
  ctaSecondary: string
}

export default function Hero({ eyebrow, heading, subheading, ctaPrimary, ctaSecondary }: Props) {
  // Split heading at "Scales" for accent colouring
  const headingParts = heading.split('Scales')
  const hasAccent = headingParts.length === 2

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Radial glow spotlight */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(99,115,243,.12) 0%, transparent 65%)',
          top: '50%', left: '55%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-[1160px] mx-auto px-8 pt-32 pb-24">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-8">
          <span className="w-1 h-1 bg-nd-accent-bright rounded-full" />
          {eyebrow}
        </div>

        {/* Heading */}
        <h1 className="text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.04em] text-nd-white max-w-[900px] mb-10">
          {hasAccent ? (
            <>
              {headingParts[0]}
              <em className="not-italic text-nd-accent-bright">Scales</em>
              {headingParts[1]}
            </>
          ) : heading}
        </h1>

        {/* Sub row */}
        <div className="grid grid-cols-2 gap-16 max-w-[900px] mb-14 items-end">
          <p className="text-[1.05rem] leading-[1.75] text-white/55">{subheading}</p>
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

        {/* Stats */}
        <div className="flex border-t border-white/[0.08] pt-12 mt-16 max-w-[900px]">
          {[
            { target: 12, suffix: '+', label: 'Enterprise clients served' },
            { target: 98, suffix: '%', label: 'On-time delivery rate' },
            { target: 5, suffix: '+', label: 'Years of enterprise delivery' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex-1 ${i > 0 ? 'pl-12' : ''} ${i < 2 ? 'pr-12 border-r border-white/[0.08]' : ''}`}
            >
              <div className="text-[clamp(2.5rem,5vw,3.8rem)] font-bold tracking-[-0.05em] text-nd-white leading-none">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} className="text-nd-accent-bright" />
              </div>
              <div className="text-[0.68rem] tracking-[0.14em] uppercase text-white/40 mt-2 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,.3), transparent)', animation: 'scrollPulse 1.8s ease-in-out infinite' }}
        />
        <span className="text-[0.58rem] tracking-[0.22em] uppercase text-white/25">Scroll</span>
      </div>

      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:.3} 50%{opacity:.8} }
      `}</style>
    </section>
  )
}
