'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import './styles.scss'

export const FacebookConnect: React.FC = () => {
  const { value, setValue } = useField<any>({ path: 'socialMediaAccounts.facebook' })

  const handleConnect = () => {
    const redirectUri = `${window.location.origin}/api/social-media/oauth/facebook/callback`
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID || ''
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish',
      state: 'facebook_connect',
    })
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
    
    // Open OAuth popup
    const popup = window.open(authUrl, 'facebook_oauth', 'width=600,height=700')
    
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
        className="smc-connect-btn smc-facebook"
        onClick={handleConnect}
      >
        <span className="smc-icon">📘</span>
        Connect Facebook
      </button>
      <p className="smc-helper-text">
        This will also connect your Instagram Business account
      </p>
    </div>
  )
}

export default FacebookConnect