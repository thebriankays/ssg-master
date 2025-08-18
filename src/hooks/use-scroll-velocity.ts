'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'

interface UseScrollVelocityOptions {
  smoothing?: number
}

export function useScrollVelocity({ smoothing = 0.1 }: UseScrollVelocityOptions = {}) {
  const [velocity, setVelocity] = useState(0)
  const smoothedVelocity = useRef(0)

  const lenis = useLenis((lenis) => {
    if (!lenis) return
    
    // Smooth the velocity
    smoothedVelocity.current += (lenis.velocity - smoothedVelocity.current) * smoothing
    setVelocity(smoothedVelocity.current)
  })

  useEffect(() => {
    return () => {
      smoothedVelocity.current = 0
      setVelocity(0)
    }
  }, [])

  return velocity
}