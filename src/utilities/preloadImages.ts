// utils/preloadImages.ts
import { useEffect, useState } from 'react'

/**
 * Extracts all CSS background-image URLs from elements matching a selector.
 * @param selector - e.g. '.column__item-img'
 * @returns string[]
 */
export function getBackgroundImageUrls(selector: string): string[] {
  const urls: string[] = []
  if (typeof window === 'undefined') return urls // SSR guard
  document.querySelectorAll(selector).forEach((el) => {
    const style = window.getComputedStyle(el)
    const match = style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)
    if (match && match[1]) urls.push(match[1])
  })
  return urls
}

/**
 * React hook to preload image URLs.
 * @param urls - Array of image URLs to preload
 */
export function usePreloadImages(urls: string[]) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setLoaded(true)
      return
    }
    let isCanceled = false
    let loadedCount = 0

    const onLoad = () => {
      loadedCount += 1
      if (loadedCount === urls.length && !isCanceled) {
        setLoaded(true)
      }
    }

    const onError = (err: string | Event) => {
      if (!isCanceled) {
        const errorMessage =
          typeof err === 'string'
            ? err
            : `Failed to load image: ${(err.target as HTMLImageElement)?.src || 'unknown'}`
        setError(new Error(errorMessage))
      }
    }

    const images = urls.map((url) => {
      const img = new window.Image()
      img.onload = onLoad
      img.onerror = onError
      img.src = url
      return img
    })

    return () => {
      isCanceled = true
      images.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [urls])

  return { loaded, error }
}
