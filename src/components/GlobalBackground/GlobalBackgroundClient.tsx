'use client'

import { WhatameshBackground } from '@/components/whatamesh'
import './global-background.scss'

interface GlobalBackgroundClientProps {
  type: 'whatamesh' | 'gradient' | 'none'
  colors: {
    color1?: string
    color2?: string
    color3?: string
    color4?: string
  }
  whatameshSettings?: {
    darkenTop?: boolean
    speed?: number
    scale?: number
    enableFluid?: boolean
  }
}

export function GlobalBackgroundClient({
  type,
  colors,
  whatameshSettings
}: GlobalBackgroundClientProps) {
  if (type === 'none') {
    return null
  }

  switch (type) {
    case 'whatamesh':
      return (
        <WhatameshBackground 
          colors={colors}
          darkenTop={whatameshSettings?.darkenTop}
          speed={whatameshSettings?.speed}
          scale={whatameshSettings?.scale}
          flowmap={whatameshSettings?.enableFluid}
        />
      )
      
    case 'gradient':
      const gradientColors = [
        colors.color1,
        colors.color2,
        colors.color3,
        colors.color4
      ].filter(Boolean)
      
      return (
        <div 
          className="global-background global-background--gradient"
          style={{
            background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
          }}
        />
      )
      
    default:
      return null
  }
}