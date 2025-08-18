'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import './styles.scss'

interface AccountStatusProps {
  field: {
    name: string
    label?: string
  }
  path: string
}

export const AccountStatus: React.FC<AccountStatusProps> = ({ field, path }) => {
  // Get the parent group data
  const parentPath = path.split('.').slice(0, -1).join('.')
  const { value } = useField({ path: parentPath })
  
  const platform = parentPath.split('.').pop() || ''
  const accountData = value as any
  
  if (!accountData?.accessToken) {
    return null
  }

  const handleDisconnect = async () => {
    if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      return
    }
    
    try {
      // In a real implementation, you would call an API to revoke the token
      // For now, we'll just reload to let the user update manually
      alert('Please manually clear the access token to disconnect.')
      window.location.reload()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  const getAccountInfo = () => {
    switch (platform) {
      case 'facebook':
        return accountData.pageName || 'Connected'
      case 'instagram':
        return accountData.username ? `@${accountData.username}` : 'Connected'
      case 'tiktok':
        return accountData.displayName || 'Connected'
      default:
        return 'Connected'
    }
  }

  const isTokenExpired = () => {
    if (!accountData.tokenExpiry) return false
    return new Date(accountData.tokenExpiry) < new Date()
  }

  return (
    <div className="smc-account-status">
      <div className="smc-status-info">
        <span className={`smc-status-indicator ${isTokenExpired() ? 'expired' : 'active'}`} />
        <span className="smc-account-name">{getAccountInfo()}</span>
        {isTokenExpired() && (
          <span className="smc-token-expired">Token expired - reconnect required</span>
        )}
      </div>
      <button
        type="button"
        className="smc-disconnect-btn"
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
    </div>
  )
}

export default AccountStatus