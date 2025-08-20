import { getSiteSettings } from '@/utilities/getSiteSettings'
import { GlobalBackgroundClient } from './GlobalBackgroundClient'

export async function GlobalBackgroundWrapper() {
  const siteSettings = await getSiteSettings()
  
  if (!siteSettings?.backgroundGradient) {
    return null
  }
  
  const { backgroundGradient } = siteSettings
  
  return (
    <GlobalBackgroundClient
      type={backgroundGradient.type || 'whatamesh'}
      colors={{
        color1: backgroundGradient.color1 || '#c3e4ff',
        color2: backgroundGradient.color2 || '#6ec3f4',
        color3: backgroundGradient.color3 || '#eae2ff',
        color4: backgroundGradient.color4 || '#b9beff',
      }}
      whatameshSettings={backgroundGradient.whatameshSettings}
    />
  )
}