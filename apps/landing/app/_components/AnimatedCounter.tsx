'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  target: number
  suffix?: string
  className?: string
}

export default function AnimatedCounter({ target, suffix = '', className = '' }: Props) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1400
          const step = target / (duration / 16)
          let current = 0
          const timer = setInterval(() => {
            current = Math.min(current + step, target)
            setValue(Math.round(current))
            if (current >= target) clearInterval(timer)
          }, 16)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className={className}>
      {value}{suffix}
    </span>
  )
}
