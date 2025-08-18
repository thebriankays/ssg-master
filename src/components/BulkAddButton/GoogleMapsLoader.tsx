'use client'

import { useEffect, useState } from 'react'

// Extend Window interface to include googleMapsLoaded callback
declare global {
  interface Window {
    googleMapsLoaded?: () => void
  }
}

// Global flag to prevent multiple script loads
let isScriptLoaded = false
let isScriptLoading = false

// Global promise for coordinating loads
let loaderPromise: Promise<void> | null = null

export default function GoogleMapsLoader() {
  const [_isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // If Google Maps is already available, mark as loaded
    if (window.google?.maps?.places) {
      console.log('Google Maps API already loaded')
      setIsLoaded(true)
      isScriptLoaded = true
      return
    }

    // If we're already loading, just wait for that to finish
    if (isScriptLoading && loaderPromise) {
      loaderPromise.then(() => setIsLoaded(true))
      return
    }

    // Load the script if it hasn't been loaded yet
    if (!isScriptLoaded && !isScriptLoading) {
      isScriptLoading = true

      console.log('Adding Google Maps script to the document')
      
      // Create the loader promise
      loaderPromise = new Promise<void>((resolve) => {
        // Define the callback function
        window.googleMapsLoaded = () => {
          console.log('Google Maps API loaded successfully')
          isScriptLoaded = true
          isScriptLoading = false
          setIsLoaded(true)
          resolve()
        }

        // Create and add the script tag
        const script = document.createElement('script')
        script.id = 'google-maps-script'
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=googleMapsLoaded&loading=async`
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      })
    }

    // Cleanup is minimal since we're using global state
    return () => {
      // We don't remove the script or callback, as other components might be using it
    }
  }, [])

  return null // Don't render anything
}