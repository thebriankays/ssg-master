'use client'

import { useEffect, useState } from 'react'

export function useStudio() {
  const [studio, setStudio] = useState<any>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@theatre/studio').then((studioModule) => {
        const studioInstance = studioModule.default
        studioInstance.initialize()
        setStudio(studioInstance)
      })
    }
  }, [])

  return studio
}