import { useEffect, useRef, useState, RefObject } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useLenis } from 'lenis/react'
import { debounce } from '@/libs/utils'

interface Bounds {
  x: number
  y: number
  width: number
  height: number
  top: number
  left: number
}

interface SyncedDimensions {
  bounds: Bounds
  scrollY: number
  fontSize: number
  letterSpacing: number
  lineHeight: number
  textAlign: CanvasTextAlign
  maxWidth: number
  visible: boolean
}

/**
 * Hook to sync HTML element dimensions with WebGL space
 * Converts screen pixels to WebGL units for 1:1 mapping
 */
export function useWebGLSync(
  elementRef: RefObject<HTMLElement>,
  enabled = true
) {
  const { viewport, camera } = useThree()
  const lenis = useLenis()
  const [dimensions, setDimensions] = useState<SyncedDimensions>({
    bounds: { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0 },
    scrollY: 0,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 1.2,
    textAlign: 'left',
    maxWidth: 0,
    visible: false
  })

  // Calculate WebGL position from screen coordinates
  const screenToWebGL = (screenX: number, screenY: number) => {
    // Convert screen space to normalized device coordinates (-1 to 1)
    const x = (screenX / window.innerWidth) * 2 - 1
    const y = -(screenY / window.innerHeight) * 2 + 1
    
    // Convert to world space based on camera distance
    const worldX = x * viewport.width / 2
    const worldY = y * viewport.height / 2
    
    return { x: worldX, y: worldY }
  }

  // Update dimensions from DOM element
  const updateDimensions = () => {
    if (!elementRef.current || !enabled) return

    const rect = elementRef.current.getBoundingClientRect()
    const computedStyle = window.getComputedStyle(elementRef.current)
    
    // Get scroll position
    const scrollY = lenis?.scroll || window.scrollY
    const absoluteTop = rect.top + scrollY
    
    // Convert pixel values
    const fontSize = parseFloat(computedStyle.fontSize)
    const letterSpacingPx = parseFloat(computedStyle.letterSpacing) || 0
    const lineHeightPx = parseFloat(computedStyle.lineHeight) || fontSize * 1.2
    
    // Convert screen position to WebGL coordinates
    const webglPos = screenToWebGL(rect.left + rect.width / 2, rect.top + rect.height / 2)
    
    setDimensions({
      bounds: {
        x: webglPos.x,
        y: webglPos.y,
        width: rect.width,
        height: rect.height,
        top: absoluteTop,
        left: rect.left
      },
      scrollY,
      fontSize,
      letterSpacing: letterSpacingPx / fontSize, // Convert to em
      lineHeight: lineHeightPx / fontSize, // Convert to em
      textAlign: computedStyle.textAlign as CanvasTextAlign,
      maxWidth: rect.width,
      visible: rect.bottom > 0 && rect.top < window.innerHeight
    })
  }

  // Initial measurement
  useEffect(() => {
    updateDimensions()
  }, [enabled])

  // Handle resize
  useEffect(() => {
    if (!enabled) return
    
    const debouncedUpdate = debounce(updateDimensions, 100)
    window.addEventListener('resize', debouncedUpdate)
    
    return () => window.removeEventListener('resize', debouncedUpdate)
  }, [enabled])

  // Update on scroll
  useFrame(() => {
    if (!enabled || !elementRef.current) return
    
    const rect = elementRef.current.getBoundingClientRect()
    const scrollY = lenis?.scroll || window.scrollY
    const absoluteTop = rect.top + scrollY
    
    // Update position based on scroll
    const webglPos = screenToWebGL(rect.left + rect.width / 2, rect.top + rect.height / 2)
    
    setDimensions(prev => ({
      ...prev,
      bounds: {
        ...prev.bounds,
        x: webglPos.x,
        y: webglPos.y,
        top: absoluteTop
      },
      scrollY,
      visible: rect.bottom > 0 && rect.top < window.innerHeight
    }))
  })

  return dimensions
}