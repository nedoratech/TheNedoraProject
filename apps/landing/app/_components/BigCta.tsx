import ScrollReveal from './ScrollReveal'

export default function BigCta() {
  return (
    <div className="relative bg-nd-black overflow-hidden py-32">
      {/* Glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,115,243,.15) 0%, transparent 60%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      <div className="relative z-10 max-w-[1160px] mx-auto px-8">
        <ScrollReveal className="text-center">
          <div className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-8">
            <span className="w-1 h-1 bg-nd-accent-bright rounded-full" />
            Next step
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.04em] leading-[1.0] text-nd-white mb-6 max-w-[700px] mx-auto">
            Let&apos;s make something <em className="not-italic text-nd-accent-bright">great</em> together.
          </h2>
          <p className="text-[1.05rem] text-white/50 leading-[1.7] max-w-[480px] mx-auto mb-12">
            If you&apos;re exploring what&apos;s possible — or already know what you need — we&apos;ll help you turn it into a plan your stakeholders can sign off on.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#contact" className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.85rem] bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright hover:shadow-[0_0_32px_rgba(99,115,243,0.5)] transition-all duration-200">
              Request an offer
            </a>
            <a href="#process" className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.85rem] bg-transparent text-white/70 border border-white/20 hover:bg-white/[0.06] hover:border-white/40 hover:text-nd-white transition-all duration-200">
              See how we work
            </a>
          </div>

          {/* Proof bar */}
          <div className="flex gap-10 justify-center mt-14 pt-12 border-t border-white/[0.07] flex-wrap">
            {[
              { val: 'Two business days', label: 'Typical response time' },
              { val: 'Written proposal', label: 'No verbal estimates' },
              { val: 'No lock-in', label: 'Clean handover always' },
              { val: 'Same team', label: 'Build through support' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-[0.85rem] font-bold text-nd-white">{item.val}</div>
                <div className="text-[0.62rem] tracking-[0.12em] uppercase text-white/35 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
