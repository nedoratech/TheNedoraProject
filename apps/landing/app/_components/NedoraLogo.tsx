import Image from 'next/image'
import { Link } from '@/i18n/navigation'

type Variant = 'light' | 'dark'

const src: Record<Variant, string> = {
  light: '/svg/nedora-white.png',
  dark: '/svg/nedora-black.png',
}

interface Props {
  variant?: Variant
  className?: string
  priority?: boolean
}

export default function NedoraLogo({ variant = 'light', className = '', priority = false }: Props) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Nedora">
      <Image
        src={src[variant]}
        alt="Nedora"
        width={120}
        height={28}
        priority={priority}
        className="h-7 w-auto"
      />
    </Link>
  )
}
