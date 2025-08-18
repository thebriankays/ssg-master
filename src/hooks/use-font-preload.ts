import { useEffect, useRef } from 'react'
import FontFaceObserver from 'fontfaceobserver'

interface UseFontPreloadOptions {
  fonts: string[]
  onReady?: () => void
}

/**
 * Hook to preload fonts using FontFaceObserver
 * Useful for preventing FOUT (Flash of Unstyled Text)
 */
export function useFontPreload({ fonts, onReady }: UseFontPreloadOptions) {
  const fontsToPreload = useRef<FontFaceObserver[]>([])
  const isLoaded = useRef(false)

  useEffect(() => {
    if (isLoaded.current || fonts.length === 0) return

    // Create font observers
    fonts.forEach((font) => {
      fontsToPreload.current.push(new FontFaceObserver(font))
    })

    // Load all fonts
    Promise.all(fontsToPreload.current.map((f) => f.load(null, 5000))) // 5s timeout
      .then(() => {
        isLoaded.current = true
        onReady?.()
      })
      .catch((err) => {
        console.warn('Font loading failed:', err)
        // Still call onReady to prevent blocking
        isLoaded.current = true
        onReady?.()
      })
  }, [fonts, onReady])

  return isLoaded.current
}