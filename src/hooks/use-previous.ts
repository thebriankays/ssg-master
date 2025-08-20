import { useEffect, useRef } from 'react'

/**
 * Hook to get the previous value of a prop or state
 * @param value The current value
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  
  useEffect(() => {
    ref.current = value
  }, [value])
  
  return ref.current
}
