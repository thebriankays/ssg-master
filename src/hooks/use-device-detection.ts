import { useMediaQuery } from 'hamo'

export function useDeviceDetection() {
  const breakpoint = 768 // Default desktop breakpoint

  const isMobile = useMediaQuery(`(max-width: ${breakpoint - 1}px)`)
  const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`)
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isWebGL = isDesktop && !isReducedMotion

  // Check for low power mode with fallback for unsupported browsers
  const isLowPowerMode = useMediaQuery(
    '(any-pointer: coarse) and (hover: none)'
  )

  return { isMobile, isDesktop, isReducedMotion, isWebGL, isLowPowerMode }
}
