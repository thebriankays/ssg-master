'use client'

import React, { useState } from 'react'
import { toast } from '@payloadcms/ui'
import { syncCurrencyExchangeRates } from '@/actions/syncCurrencyExchangeRates'
import './styles.scss'

export const CurrencyExchangeSyncButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSync = async () => {
    setIsLoading(true)
    
    try {
      const result = await syncCurrencyExchangeRates()
      
      if (result.success) {
        toast.success(result.message || 'Currency exchange rates sync queued successfully')
      } else {
        toast.error(result.error || 'Failed to sync currency exchange rates')
      }
    } catch (error) {
      console.error('Currency sync error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="currency-exchange-sync">
      <button
        type="button"
        className="currency-exchange-sync__button"
        onClick={handleSync}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="currency-exchange-sync__spinner" />
            Syncing...
          </>
        ) : (
          <>
            <svg
              className="currency-exchange-sync__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Sync Exchange Rates
          </>
        )}
      </button>
      <p className="currency-exchange-sync__info">
        Updates all currency exchange rates from Open Exchange Rates API
      </p>
    </div>
  )
}