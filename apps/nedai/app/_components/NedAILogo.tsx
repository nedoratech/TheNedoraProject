import Image from 'next/image'

interface Props {
  className?: string
  height?: number
}

export default function NedAILogo({ className = '', height = 36 }: Props) {
  return (
    <a href="/" className={`inline-flex items-center ${className}`} aria-label="NedAI">
      <Image
        src="/nedai-logo.png"
        alt="NedAI"
        width={Math.round(height * (500 / 140))}
        height={height}
        priority
        className="w-auto"
        style={{ height }}
      />
    </a>
  )
}
