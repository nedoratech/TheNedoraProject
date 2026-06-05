'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  target: number
  suffix?: string
  prefix?: string
  className?: string
  duration?: number
}

export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  className = '',
  duration = 1800,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started.current) return
        started.current = true
        observer.unobserve(el)

        const start = performance.now()
        const step = (ts: number) => {
          const elapsed = ts - start
          const progress = Math.min(elapsed / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(ease * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      <span className={className}>{suffix}</span>
    </span>
  )
}
