import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Custom hook for GSAP animations with automatic cleanup
 * Ensures animations are properly cleaned up on unmount or dependency changes
 * 
 * @param callback - Function containing GSAP animations
 * @param dependencies - Dependency array (like useEffect)
 * @returns Context object for storing references
 */
export function useGSAP<T extends gsap.Context = gsap.Context>(
  callback: (context: T) => void | (() => void),
  dependencies: React.DependencyList = []
) {
  const contextRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    // Create GSAP context for automatic cleanup
    const ctx = gsap.context(() => {
      const cleanup = callback(ctx as T)
      // If callback returns a cleanup function, store it
      if (cleanup && typeof cleanup === 'function') {
        ctx.add(cleanup)
      }
    }) as T

    contextRef.current = ctx

    // Cleanup on unmount or dependency change
    return () => {
      ctx.revert()
    }
  }, dependencies)

  return contextRef.current
}

export default useGSAP