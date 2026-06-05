interface Props {
  height?: number
  className?: string
}

/**
 * Inline SVG reproduction of the NedAI logo.
 * Purple waveform bars + magenta sparkles + "Ned" (navy) + "AI" (magenta).
 * Replace with <Image src="/nedai-logo.png"> once the asset is committed.
 */
export default function NedAILogoSVG({ height = 36, className = '' }: Props) {
  const aspectRatio = 480 / 130
  const width = Math.round(height * aspectRatio)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 130"
      width={width}
      height={height}
      className={className}
      aria-label="NedAI"
      role="img"
    >
      <defs>
        <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="barGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9b5cf6" />
          <stop offset="100%" stopColor="#3b0f8c" />
        </linearGradient>
      </defs>

      {/* ── Waveform icon ── */}
      {/* Dot left */}
      <circle cx="12" cy="75" r="6" fill="url(#barGrad)" opacity="0.7" />
      {/* Bar 1 short */}
      <rect x="26" y="55" width="14" height="40" rx="0" fill="url(#barGrad)" />
      {/* Bar 2 tall */}
      <rect x="48" y="22" width="14" height="86" rx="0" fill="url(#barGrad2)" />
      {/* Bar 3 medium */}
      <rect x="70" y="42" width="14" height="60" rx="0" fill="url(#barGrad)" />
      {/* Diamond centre */}
      <rect x="90" y="58" width="10" height="10" rx="0" fill="#e91e8c" transform="rotate(45 95 63)" />
      {/* Bar 4 tall */}
      <rect x="108" y="18" width="14" height="94" rx="0" fill="url(#barGrad2)" />
      {/* Bar 5 medium */}
      <rect x="130" y="40" width="14" height="58" rx="0" fill="url(#barGrad)" />
      {/* Dot right */}
      <circle cx="156" cy="65" r="6" fill="url(#barGrad)" opacity="0.7" />

      {/* ── Sparkle stars ── */}
      {/* Large sparkle top-right of icon */}
      <g transform="translate(148, 20)">
        <path d="M0,-9 L1.5,-1.5 L9,0 L1.5,1.5 L0,9 L-1.5,1.5 L-9,0 L-1.5,-1.5 Z" fill="#e91e8c" />
      </g>
      {/* Small sparkle */}
      <g transform="translate(130, 10)">
        <path d="M0,-5 L0.8,-0.8 L5,0 L0.8,0.8 L0,5 L-0.8,0.8 L-5,0 L-0.8,-0.8 Z" fill="#e91e8c" opacity="0.8" />
      </g>

      {/* ── Wordmark ── */}
      <text
        x="175"
        y="96"
        fontFamily="Futura, 'Century Gothic', 'Trebuchet MS', ui-sans-serif, sans-serif"
        fontWeight="700"
        fontSize="80"
        letterSpacing="-3"
      >
        <tspan fill="#1a1a40">Ned</tspan>
        <tspan fill="#e91e8c">AI</tspan>
      </text>
    </svg>
  )
}
