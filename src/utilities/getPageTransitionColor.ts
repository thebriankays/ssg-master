// utilities/getPageTransitionColor.ts

import { getCachedGlobal } from './getGlobals'

const DEFAULT_PAGE_TRANSITION_COLOR = '#000000'

export interface SiteSettingsWithTransitionType {
  pageTransition?: {
    color?: string
  }
}

/**
 * Gets the page transition color from site settings
 * Falls back to default if not set
 */
export async function getPageTransitionColor(): Promise<string> {
  try {
    // Get the site settings from the global
    const getSettings = getCachedGlobal('site-settings')
    const settings = (await getSettings()) as SiteSettingsWithTransitionType

    // Extract page transition color
    const { pageTransition } = settings || {}

    // If we have transition settings and a color is set, use it
    if (pageTransition?.color) {
      return pageTransition.color
    }

    // Fall back to default
    return DEFAULT_PAGE_TRANSITION_COLOR
  } catch (error) {
    console.error('Error fetching page transition color:', error)
    return DEFAULT_PAGE_TRANSITION_COLOR
  }
}

export { DEFAULT_PAGE_TRANSITION_COLOR }
