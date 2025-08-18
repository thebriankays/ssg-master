'use client'

import React from 'react'
import { CurrencyExchangeSyncButton } from '../CurrencyExchangeSync'
import './styles.scss'

const CurrencyAdmin: React.FC = () => {
  return (
    <div className="currency-admin">
      <h3 className="currency-admin__title">Currency Management</h3>
      <div className="currency-admin__section">
        <CurrencyExchangeSyncButton />
      </div>
      <div className="currency-admin__notice">
        <p>
          <strong>Note:</strong> To enable automatic currency exchange rate updates, please add your Open Exchange Rates API key to the environment variables:
        </p>
        <code className="currency-admin__code">
          OPEN_EXCHANGE_RATES_API_KEY=your_api_key_here
        </code>
        <p>
          Get your free API key from{' '}
          <a href="https://openexchangerates.org/signup/free" target="_blank" rel="noopener noreferrer">
            Open Exchange Rates
          </a>
          . The free plan includes 1,000 requests per month.
        </p>
      </div>
    </div>
  )
}

export { CurrencyAdmin }