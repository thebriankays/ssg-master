'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { RealViewport } from '@/components/real-viewport'
import { GSAP } from '@/components/gsap'
import { ScrollTrigger } from '@/components/gsap/scroll-trigger'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { ReactTempus } from '@/providers/tempus-provider'
import { TheatreProjectProvider } from '@/providers/theatre-providers'
import { useStudio } from '@/orchestra/theatre/hooks/use-studio'
import { LenisProvider } from '@/providers/lenis-provider'
import { MouseFollowerProvider } from '@/providers/mouse-follower'

// Dynamic imports for client-side only components
const SharedCanvasProvider = dynamic(
  () => import('@/providers/shared-canvas-provider').then(mod => mod.SharedCanvasProvider),
  { ssr: false }
)

const Orchestra = dynamic(() => import('@/orchestra').then(({ Orchestra }) => Orchestra), {
  ssr: false,
})

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const studio = useStudio()

  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <MouseFollowerProvider>
          <LenisProvider>
            <TheatreProjectProvider studio={studio}>
              <SharedCanvasProvider>
                <RealViewport />
                <GSAP />
                <ScrollTrigger />
                <ReactTempus />
                {children}
                <PerformanceMonitor />
                {process.env.NODE_ENV === 'development' && <Orchestra />}
              </SharedCanvasProvider>
            </TheatreProjectProvider>
          </LenisProvider>
        </MouseFollowerProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
