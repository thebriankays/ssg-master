'use client'

import React from 'react'
import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

interface ConnectButtonProps {
  platform: 'facebook' | 'instagram' | 'tiktok'
  label: string
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ platform, label }) => {
  const router = useRouter()

  const handleConnect = () => {
    // Redirect to OAuth flow
    window.location.href = `/api/social-media/oauth/${platform}?action=connect`
  }

  return (
    <div className="field-type">
      <Button onClick={handleConnect} size="small">
        Connect {label}
      </Button>
      <p className="field-description">
        Click to connect your {label} account for automated posting
      </p>
    </div>
  )
}

export const FacebookConnect: React.FC = () => (
  <ConnectButton platform="facebook" label="Facebook Page" />
)

export const InstagramConnect: React.FC = () => (
  <ConnectButton platform="instagram" label="Instagram Business Account" />
)

export const TikTokConnect: React.FC = () => (
  <ConnectButton platform="tiktok" label="TikTok Account" />
)