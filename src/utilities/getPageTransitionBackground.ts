// utilities/getPageTransitionBackground.ts

import { getCachedGlobal } from './getGlobals'

const DEFAULT_GRADIENT = {
  color1: 'rgba(206, 190, 41, 0.8)',
  color2: 'rgba(155, 31, 80, 0.7)',
  color3: 'rgba(41, 137, 216, 0.9)',
  color4: 'rgba(137, 180, 255, 0.8)',
}

export interface TransitionBackgroundSettings {
  type: 'color' | 'gradient' | 'image'
  color?: string
  gradient?: {
    color1: string
    color2: string
    color3: string
    color4: string
  }
  imageUrl?: string
}

export interface SiteSettingsWithTransitionType {
  pageTransition?: {
    color?: string
    backgroundType?: 'color' | 'gradient' | 'image'
    backgroundImage?: {
      url: string
    }
    gradientSettings?: {
      color1?: string
      color2?: string
      color3?: string
      color4?: string
      usePreset?: boolean
    }
  }
}

/**
 * Gets the complete page transition background settings from site settings
 */
export async function getPageTransitionBackground(): Promise<TransitionBackgroundSettings> {
  try {
    const getSettings = getCachedGlobal('site-settings')
    const settings = (await getSettings()) as SiteSettingsWithTransitionType

    const { pageTransition } = settings || {}

    const type = pageTransition?.backgroundType || 'color'

    const result: TransitionBackgroundSettings = {
      type,
      gradient: DEFAULT_GRADIENT,
    }

    // If we have a color, set it (used for both 'color' type and as fallback)
    if (pageTransition?.color) {
      result.color = pageTransition.color
    }

    // Handle image background
    if (type === 'image' && pageTransition?.backgroundImage?.url) {
      result.imageUrl = pageTransition.backgroundImage.url
    }

    // Handle gradient background
    if (type === 'gradient' && pageTransition?.gradientSettings) {
      const { gradientSettings } = pageTransition

      // If using preset, we already have a default gradient
      if (!gradientSettings.usePreset) {
        // Use custom gradient settings
        result.gradient = {
          color1: gradientSettings.color1 || DEFAULT_GRADIENT.color1,
          color2: gradientSettings.color2 || DEFAULT_GRADIENT.color2,
          color3: gradientSettings.color3 || DEFAULT_GRADIENT.color3,
          color4: gradientSettings.color4 || DEFAULT_GRADIENT.color4,
        }
      }
    }

    return result
  } catch (error) {
    console.error('Error fetching page transition background:', error)
    return {
      type: 'gradient',
      gradient: DEFAULT_GRADIENT,
    }
  }
}
