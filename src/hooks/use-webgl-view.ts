'use client'

import { useRef, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { useRect } from 'hamo'

/**
 * Hook for WebGL View components
 * Manages DOM-WebGL synchronization and provides utilities for View-based components
 */
export function useWebGLView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [setRectRef, rect] = useRect()
  const { size, viewport } = useThree()

  // Convert DOM coordinates to WebGL coordinates
  const domToWebGL = useCallback((x: number, y: number) => {
    const webglX = (x / size.width) * viewport.width - viewport.width / 2
    const webglY = -(y / size.height) * viewport.height + viewport.height / 2
    return { x: webglX, y: webglY }
  }, [size, viewport])

  // Check if element is in viewport
  const isInViewport = useCallback(() => {
    if (!rect) return false
    return (
      (rect.top ?? 0) < window.innerHeight &&
      (rect.bottom ?? 0) > 0 &&
      (rect.left ?? 0) < window.innerWidth &&
      (rect.right ?? 0) > 0
    )
  }, [rect])

  return {
    containerRef,
    setRectRef,
    rect,
    domToWebGL,
    isInViewport,
    viewport,
    size,
  }
}