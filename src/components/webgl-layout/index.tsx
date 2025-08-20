'use client'

import { type PropsWithChildren } from 'react'
import { Canvas } from '@/webgl/components/canvas'
import { useStudio } from '@/orchestra/theatre/hooks/use-studio'
import { TheatreProjectProvider } from '@/orchestra/theatre'

type WebGLLayoutProps = PropsWithChildren<{
  className?: string
  enableTheatre?: boolean
}>

/**
 * Main WebGL layout wrapper that sets up:
 * - Canvas with tunnel system
 * - Theatre.js integration
 * - Performance monitoring
 */
export function WebGLLayout({ 
  children, 
  className,
  enableTheatre = process.env.NODE_ENV === 'development'
}: WebGLLayoutProps) {
  const studio = useStudio()

  const content = (
    <Canvas root force className={className} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      {children}
    </Canvas>
  )

  if (enableTheatre) {
    return (
      <TheatreProjectProvider studio={studio}>
        {content}
      </TheatreProjectProvider>
    )
  }

  return content
}