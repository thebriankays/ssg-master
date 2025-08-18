'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ThemeManagerProps {
  theme?: 'light' | 'dark' | 'auto'
}

export function ThemeManager({ theme = 'auto' }: ThemeManagerProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (theme !== 'auto') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme, pathname])

  return null
}