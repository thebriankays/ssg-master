'use client'

import { Whatamesh } from '@/components/whatamesh'
import { 
  globalBackgroundConfig, 
  backgroundPresets, 
  type BackgroundConfig 
} from '@/config/global-background'
import { useTheme } from '@/providers/Theme'
import { useEffect, useState } from 'react'
import './global-background.scss'

export function GlobalBackground() {
  const { theme } = useTheme()
  const [config, setConfig] = useState<BackgroundConfig | null>(null)
  
  useEffect(() => {
    const updateConfig = () => {
      if (!globalBackgroundConfig.enabled) {
        setConfig({ type: 'none' })
        return
      }
      
      // Use custom config if available
      if (globalBackgroundConfig.custom) {
        setConfig(globalBackgroundConfig.custom)
        return
      }
      
      // Use theme-based preset
      const isDark = theme === 'dark'
      const presetKey = isDark 
        ? globalBackgroundConfig.themeOverrides.dark 
        : globalBackgroundConfig.themeOverrides.light
      
      setConfig(backgroundPresets[presetKey])
    }
    
    // Initial config
    updateConfig()
    
    // Listen for background changes
    const handleBackgroundChange = () => {
      updateConfig()
    }
    
    window.addEventListener('backgroundChange', handleBackgroundChange)
    return () => {
      window.removeEventListener('backgroundChange', handleBackgroundChange)
    }
  }, [theme])
  
  useEffect(() => {
    if (config) {
      console.log('GlobalBackground updated with config:', config)
    }
  }, [config])
  
  if (!config || config.type === 'none') {
    return null
  }
  
  switch (config.type) {
    case 'whatamesh':
      return (
        <Whatamesh 
          isGlobal={true}
          colors={config.colors}
          darkenTop={config.settings.darkenTop}
          speed={config.settings.speed}
          scale={config.settings.scale}
          amplitude={config.settings.amplitude}
        />
      )
      
    case 'gradient':
      return (
        <div 
          className="global-background global-background--gradient"
          style={{
            background: `linear-gradient(${config.angle}deg, ${config.colors.join(', ')})`,
          }}
        />
      )
      
    case 'particles':
      // Placeholder for particle system
      return (
        <div className="global-background global-background--particles">
          {/* Particle system would go here */}
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: config.color,
            opacity: 0.1,
            pointerEvents: 'none'
          }} />
        </div>
      )
      
    default:
      return null
  }
}

// Export a hook to programmatically change backgrounds
export function useBackgroundControl() {
  const setBackground = (preset: keyof typeof backgroundPresets) => {
    globalBackgroundConfig.current = preset
    // Trigger re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('backgroundChange', { detail: preset }))
  }
  
  const setCustomBackground = (config: BackgroundConfig) => {
    globalBackgroundConfig.custom = config
    window.dispatchEvent(new CustomEvent('backgroundChange', { detail: 'custom' }))
  }
  
  const resetToPreset = () => {
    globalBackgroundConfig.custom = null
    window.dispatchEvent(new CustomEvent('backgroundChange', { detail: globalBackgroundConfig.current }))
  }
  
  return {
    setBackground,
    setCustomBackground,
    resetToPreset,
    presets: Object.keys(backgroundPresets) as (keyof typeof backgroundPresets)[],
    currentPreset: globalBackgroundConfig.current,
  }
}
