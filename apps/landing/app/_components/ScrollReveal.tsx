'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: 0 | 1 | 2 | 3 | 4
  className?: string
}

const delayMap: Record<number, string> = {
  0: '',
  1: '[transition-delay:100ms]',
  2: '[transition-delay:200ms]',
  3: '[transition-delay:300ms]',
  4: '[transition-delay:400ms]',
}

export default function ScrollReveal({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0')
          el.classList.remove('opacity-0', 'translate-y-8')
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${delayMap[delay]} ${className}`}
    >
      {children}
    </div>
  )
}
