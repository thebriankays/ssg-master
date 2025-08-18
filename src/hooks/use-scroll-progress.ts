'use client'

import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface UseScrollProgressOptions {
  start?: string
  end?: string
}

export function useScrollProgress(
  ref: React.RefObject<HTMLElement>,
  options: UseScrollProgressOptions = {}
) {
  const { start = 'top bottom', end = 'bottom top' } = options
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      onUpdate: (self) => {
        setProgress(self.progress)
      },
    })

    return () => {
      trigger.kill()
    }
  }, [ref, start, end])

  return progress
}