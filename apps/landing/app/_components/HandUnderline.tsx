'use client'

import { useId, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/** Yellow paint-brush stroke under emphasis words */
export default function HandUnderline({ children }: Props) {
  const uid = useId().replace(/:/g, '')
  const brushFilterId = `brush-${uid}`
  const glowFilterId = `glow-${uid}`
  const gradientId = `shine-${uid}`

  const smearPath =
    'M 4 13.2 C 32 9.2, 68 10.2, 102 10.8 C 138 11.2, 168 9.8, 192 11 C 198 11.5, 198 13.8, 192 14.8 C 158 16.2, 108 15.6, 62 15.2 C 32 14.8, 12 14.2, 4 13.2 Z'

  return (
    <span className="relative inline-block whitespace-nowrap">
      <svg
        className="absolute left-[-10%] right-[-10%] -bottom-[0.18em] z-0 w-[120%] h-[0.42em] pointer-events-none overflow-visible"
        style={{
          filter:
            'drop-shadow(0 0 5px var(--nd-hand-underline-glow)) drop-shadow(0 0 12px var(--nd-hand-underline-glow))',
        }}
        viewBox="0 0 200 22"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--nd-hand-underline-shine)" />
            <stop offset="55%" stopColor="var(--nd-hand-underline)" />
            <stop offset="100%" stopColor="var(--nd-hand-underline)" />
          </linearGradient>

          <filter id={glowFilterId} x="-25%" y="-50%" width="150%" height="200%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={brushFilterId} x="-8%" y="-30%" width="116%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.65"
              numOctaves="3"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Soft glow layer */}
        <path d={smearPath} fill="var(--nd-hand-underline-shine)" opacity="0.72" filter={`url(#${glowFilterId})`} />

        {/* Paint smear */}
        <path d={smearPath} fill={`url(#${gradientId})`} opacity="1" filter={`url(#${brushFilterId})`} />

        {/* Bright bristle highlight */}
        <path
          d="M 10 11.2 C 55 9.8, 110 10, 178 11"
          fill="none"
          stroke="var(--nd-hand-underline-shine)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
      <span className="relative z-10 text-nd-accent-mid">{children}</span>
    </span>
  )
}
