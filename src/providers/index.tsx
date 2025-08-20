'use client'

import React from 'react'
import { HeaderTheme, HeaderThemeProvider } from '@/providers/HeaderTheme'
import { ThemeProvider } from '@/providers/Theme'
import { WebGLLayout } from '@/components/webgl-layout'
import { ReactTempus } from '@/providers/tempus-provider'
import { LenisProvider } from '@/providers/lenis-provider'
import { MouseFollowerProvider } from '@/providers/MouseFollowerProvider'

export const Providers: React.FC<{
  children: React.ReactNode
  headerTheme?: HeaderTheme
}> = ({ children, headerTheme }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider headerTheme={headerTheme}>
        <ReactTempus />
        <LenisProvider>
          <MouseFollowerProvider>
            <WebGLLayout>
              <div style={{ position: 'relative', zIndex: 1, isolation: 'isolate' }}>
                {children}
              </div>
            </WebGLLayout>
          </MouseFollowerProvider>
        </LenisProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
