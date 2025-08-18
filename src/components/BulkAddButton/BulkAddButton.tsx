'use client'
import React, { useEffect } from 'react'
import { Button } from '@payloadcms/ui'
import './BulkAddButton.css'

declare global {
  interface Window {
    openBulkAddModal?: boolean
  }
}

/**
 * Renders one small button in the collection list.
 * Clicking it just opens the BulkAdd modal.
 */
const BulkAddButton = () => {
  const handleClick = () => {
    console.log('BulkAddButton: Opening modal directly')

    // Primary method - global event
    window.dispatchEvent(new CustomEvent('force-open-modal'))

    // Secondary method - global variable (for ultimate fallback)
    if (typeof window !== 'undefined') {
      window.openBulkAddModal = true
    }
    
    // Direct DOM fix - only applied when button is clicked
    setTimeout(() => {
      const container = document.querySelector('.payload__modal-container')
      if (container instanceof HTMLElement) {
        container.style.visibility = 'visible'
        container.style.zIndex = '60'
      }
      
      const modal = document.getElementById('bulk-add-destinations-modal')
      if (modal instanceof HTMLElement) {
        modal.setAttribute('open', 'true') // Set the open attribute
        modal.style.visibility = 'visible'
        modal.style.display = 'block'
        modal.style.zIndex = '200'
      }
    }, 50)
  }

  return (
    <Button size="small" buttonStyle="primary" className="bulk-add-button" onClick={handleClick}>
      Bulk Add Destinations
    </Button>
  )
}

export default BulkAddButton