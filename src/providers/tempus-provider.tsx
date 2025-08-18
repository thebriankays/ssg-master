'use client'

import { useEffect } from 'react'
import { useTempus } from 'tempus/react'

/**
 * ReactTempus - Global RAF management component
 * Initializes the Tempus RAF loop for the entire application
 */
export function ReactTempus() {
  // Start the RAF loop
  useTempus(() => {
    // This ensures Tempus is running
  })

  return null
}

// Re-export for convenience
export { useTempus } from 'tempus/react'