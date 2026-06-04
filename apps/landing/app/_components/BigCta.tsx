import { SECTION_PY } from '@/lib/sectionSpacing'
import ScrollReveal from './ScrollReveal'

export interface BigCtaProof {
  val: string
  label: string
}

export interface BigCtaContent {
  label: string
  titleBefore: string
  titleAccent: string
  titleAfter: string
  description: string
  ctaPrimary: string
  ctaSecondary: string
  proof: BigCtaProof[]
}

export default function BigCta({
  label, titleBefore, titleAccent, titleAfter, description, ctaPrimary, ctaSecondary, proof,
}: BigCtaContent) {
  return (
    <div className={`relative bg-nd-black overflow-hidden ${SECTION_PY}`}>
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,115,243,.15) 0%, transparent 60%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      <div className="relative z-10 max-w-[1160px] mx-auto px-5 sm:px-8">
        <ScrollReveal className="text-center">
          <div className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-8">
            <span className="w-1 h-1 bg-nd-accent-bright rounded-full" />
            {label}
          </div>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[-0.04em] leading-[1.0] text-nd-white mb-6 max-w-[700px] mx-auto">
            {titleBefore}
            <em className="not-italic text-nd-accent-bright">{titleAccent}</em>
            {titleAfter}
          </h2>
          <p className="text-[1.05rem] text-white/50 leading-[1.7] max-w-[480px] mx-auto mb-12">{description}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#contact" className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.85rem] bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright hover:shadow-[0_0_32px_rgba(99,115,243,0.5)] transition-all duration-200">
              {ctaPrimary}
            </a>
            <a href="#process" className="text-[0.72rem] tracking-[0.14em] uppercase font-bold px-8 py-[0.85rem] bg-transparent text-white/70 border border-white/20 hover:bg-white/[0.06] hover:border-white/40 hover:text-nd-white transition-all duration-200">
              {ctaSecondary}
            </a>
          </div>

          <div className="flex gap-8 sm:gap-10 justify-center mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 lg:pt-10 border-t border-white/[0.07] flex-wrap">
            {proof.map((item) => (
              <div key={item.label} className="text-center">
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
