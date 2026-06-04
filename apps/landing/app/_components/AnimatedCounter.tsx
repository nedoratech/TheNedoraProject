'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  target: number
  suffix?: string
  className?: string
}

export default function AnimatedCounter({ target, suffix = '', className = '' }: Props) {
  const [value, setValue] = useState(target)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true

        const duration = 1400
        const step = target / (duration / 16)
        let current = 0
        setValue(0)

        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          setValue(Math.round(current))
          if (current >= target) clearInterval(timer)
        }, 16)

        observer.unobserve(el)
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
