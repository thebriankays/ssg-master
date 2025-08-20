// Global background configuration system
// Supports multiple background types and presets

export type BackgroundType = 'whatamesh' | 'particles' | 'gradient' | 'none'

export interface WhatameshConfig {
  type: 'whatamesh'
  colors: {
    color1: string
    color2: string
    color3: string
    color4: string
  }
  settings: {
    darkenTop: boolean
    speed: number      // 0.1 - 5
    scale: number      // 0.5 - 3
    amplitude: number  // 50 - 500
    rotation: number   // rotation in radians
  }
}

export interface ParticlesConfig {
  type: 'particles'
  count: number
  color: string
  speed: number
  size: number
}

export interface GradientConfig {
  type: 'gradient'
  colors: string[]
  angle: number
  animated: boolean
}

export interface NoneConfig {
  type: 'none'
}

export type BackgroundConfig = WhatameshConfig | ParticlesConfig | GradientConfig | NoneConfig

// Preset configurations
export const backgroundPresets = {
  // Original Whatamesh colors
  ocean: {
    type: 'whatamesh',
    colors: {
      color1: '#c3e4ff', // Light blue
      color2: '#6ec3f4', // Medium blue
      color3: '#eae2ff', // Light purple
      color4: '#b9beff', // Medium purple
    },
    settings: {
      darkenTop: true,
      speed: 0.8,
      scale: 1.5,
      amplitude: 320,
      rotation: 0,
    },
  } as WhatameshConfig,
  
  // Warm sunset colors
  sunset: {
    type: 'whatamesh',
    colors: {
      color1: '#ff9a9e',
      color2: '#fecfef',
      color3: '#fecfef',
      color4: '#a18cd1',
    },
    settings: {
      darkenTop: true,
      speed: 0.6,
      scale: 2,
      amplitude: 250,
      rotation: 0,
    },
  } as WhatameshConfig,
  
  // Green nature theme
  forest: {
    type: 'whatamesh',
    colors: {
      color1: '#84fab0',
      color2: '#8fd3f4',
      color3: '#a8e6cf',
      color4: '#7fcdbb',
    },
    settings: {
      darkenTop: false,
      speed: 0.4,
      scale: 2.5,
      amplitude: 200,
      rotation: 0,
    },
  } as WhatameshConfig,
  
  // Dark mode preset
  midnight: {
    type: 'whatamesh',
    colors: {
      color1: '#1a3d5c',
      color2: '#2c5f8d',
      color3: '#3d3d5c',
      color4: '#5c5c8d',
    },
    settings: {
      darkenTop: false,
      speed: 0.6,
      scale: 2,
      amplitude: 280,
      rotation: 0,
    },
  } as WhatameshConfig,
  
  // Minimal gradient
  minimal: {
    type: 'gradient',
    colors: ['#f5f7fa', '#c3cfe2'],
    angle: 135,
    animated: false,
  } as GradientConfig,
  
  // No background
  none: {
    type: 'none',
  } as NoneConfig,
}

// Global configuration with current preset
export const globalBackgroundConfig = {
  // Enable/disable the global background
  enabled: true,
  
  // Current preset or custom config
  current: 'ocean' as keyof typeof backgroundPresets,
  
  // Custom configuration (overrides preset if set)
  custom: null as BackgroundConfig | null,
  
  // Theme-based overrides
  themeOverrides: {
    dark: 'midnight' as keyof typeof backgroundPresets,
    light: 'ocean' as keyof typeof backgroundPresets,
  },
}

// Export a hook to use the config with theme awareness
export function useGlobalBackground() {
  // This would integrate with your theme system
  // For now, return the active configuration
  const config = globalBackgroundConfig
  
  if (!config.enabled) {
    return { type: 'none' } as NoneConfig
  }
  
  if (config.custom) {
    return config.custom
  }
  
  return backgroundPresets[config.current]
}
