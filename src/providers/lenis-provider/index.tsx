'use client'

import type { LenisOptions } from 'lenis'
import 'lenis/dist/lenis.css'
import type { LenisRef } from 'lenis/react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTempus } from 'tempus/react'

interface LenisProviderProps {
  children: ReactNode
  root?: boolean
  options?: LenisOptions
}

export function LenisProvider({ 
  children, 
  root = true,
  options = {} 
}: LenisProviderProps) {
  const lenisRef = useRef<LenisRef>(null)

  // Use Tempus for RAF management instead of Lenis's built-in RAF
  useTempus((time: number) => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.raf(time)
    }
  })

  return (
    <ReactLenis
      ref={lenisRef}
      root={root}
      options={{
        lerp: options?.lerp ?? 0.1,
        duration: options?.duration ?? 1.2,
        smoothWheel: options?.smoothWheel ?? true,
        touchMultiplier: options?.touchMultiplier ?? 2,
        infinite: options?.infinite ?? false,
        orientation: options?.orientation ?? 'vertical',
        gestureOrientation: options?.gestureOrientation ?? 'vertical',
        prevent: (node) => {
          // Prevent scroll on certain elements
          return node.tagName === 'TEXTAREA' || 
                 node.tagName === 'INPUT' ||
                 node.getAttribute('data-lenis-prevent') !== null
        },
        // eventsTarget removed to avoid circular reference
        autoRaf: false, // We're using Tempus for RAF
        ...options,
      }}
    >
      {children}
    </ReactLenis>
  )
}

// Export useLenis hook
export { useLenis }