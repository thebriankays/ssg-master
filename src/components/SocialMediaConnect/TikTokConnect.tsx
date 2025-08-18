'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import './styles.scss'

export const TikTokConnect: React.FC = () => {
  const { value, setValue } = useField<any>({ path: 'socialMediaAccounts.tiktok' })

  const handleConnect = () => {
    const redirectUri = `${window.location.origin}/api/social-media/oauth/tiktok/callback`
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || process.env.TIKTOK_CLIENT_KEY || ''
    
    const params = new URLSearchParams({
      client_key: clientKey,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'user.info.basic,video.publish,video.upload',
      state: 'tiktok_connect',
    })
    
    const authUrl = `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`
    
    // Open OAuth popup
    const popup = window.open(authUrl, 'tiktok_oauth', 'width=600,height=700')
    
    // Listen for OAuth callback
    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopup)
        // Reload to check for new tokens
        window.location.reload()
      }
    }, 1000)
  }

  return (
    <div className="smc-connect-field">
      <button
        type="button"
        className="smc-connect-btn smc-tiktok"
        onClick={handleConnect}
      >
        <span className="smc-icon">🎵</span>
        Connect TikTok
      </button>
      <p className="smc-helper-text">
        For video content only - videos must be hosted online
      </p>
    </div>
  )
}

export default TikTokConnect