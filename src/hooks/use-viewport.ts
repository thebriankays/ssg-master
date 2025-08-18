import { useState, useEffect } from 'react'
import { debounce } from '@/libs/utils'

interface ViewportDimensions {
  vw: number
  vh: number
  vwFixed: number
  vhFixed: number
}

/**
 * Hook to track viewport dimensions
 * Returns both current dimensions (updated on resize) and fixed dimensions (set once)
 * 
 * Note: Consider using the existing RealViewport component which provides
 * CSS custom properties for viewport dimensions instead
 */
export function useViewport(): ViewportDimensions {
  const [vw, setVW] = useState(0)
  const [vh, setVH] = useState(0)
  const [vwFixed, setVWFixed] = useState(0)
  const [vhFixed, setVHFixed] = useState(0)

  useEffect(() => {
    // Set initial dimensions
    const setInitialDimensions = () => {
      if (typeof window !== 'undefined') {
        setVW(window.innerWidth)
        setVH(window.innerHeight)
        setVWFixed(window.innerWidth)
        setVHFixed(window.innerHeight)
      }
    }

    setInitialDimensions()

    // Handle resize with debouncing
    const handleResize = debounce(() => {
      setVW(window.innerWidth)
      setVH(window.innerHeight)
    }, 100)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { vw, vh, vwFixed, vhFixed }
}