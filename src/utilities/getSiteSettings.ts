// src/utilities/getSiteSettings.ts
// Temporary type until payload generates types
interface SiteSetting {
  id: string
  typography?: any
  whatamesh?: {
    gradientColors?: {
      color1?: string
      color2?: string
      color3?: string
      color4?: string
    }
  }
  [key: string]: any
}

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { unstable_cache } from 'next/cache'

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSetting | null> => {
    try {
      const payload = await getPayload({
        config: configPromise,
      })

      const siteSettings = await payload.findGlobal({
        slug: 'site-settings',
      })

      return siteSettings || null
    } catch (error) {
      console.error('Error fetching site settings:', error)
      return null
    }
  },
  ['site-settings'],
  {
    tags: ['site-settings'],
    revalidate: 3600, // Cache for 1 hour
  }
)

// Get only the typography settings
export const getTypographySettings = unstable_cache(
  async () => {
    try {
      const siteSettings = await getSiteSettings()
      return siteSettings?.typography || null
    } catch (error) {
      console.error('Error fetching typography settings:', error)
      return null
    }
  },
  ['typography-settings'],
  {
    tags: ['site-settings', 'typography'],
    revalidate: 3600,
  }
)

// Get used font IDs from site settings
export const getUsedFontIds = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const siteSettings = await getSiteSettings()
      const typography = siteSettings?.typography
      
      if (!typography) return []

      const fontIds: string[] = []
      
      // Extract font family names from typography settings
      if (typography.primaryHeadingFont) fontIds.push(typography.primaryHeadingFont)
      if (typography.secondaryHeadingFont) fontIds.push(typography.secondaryHeadingFont)
      if (typography.bodyFont) fontIds.push(typography.bodyFont)
      if (typography.navigationFont) fontIds.push(typography.navigationFont)
      if (typography.buttonFont) fontIds.push(typography.buttonFont)
      if (typography.quoteFont) fontIds.push(typography.quoteFont)
      if (typography.codeFont) fontIds.push(typography.codeFont)
      
      // Remove duplicates and filter out empty values
      return [...new Set(fontIds.filter(Boolean))]
    } catch (error) {
      console.error('Error getting used font IDs:', error)
      return []
    }
  },
  ['used-font-ids'],
  {
    tags: ['site-settings', 'typography', 'fonts'],
    revalidate: 3600,
  }
)