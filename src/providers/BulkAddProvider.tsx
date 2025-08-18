'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { Modal } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

import GoogleMapsLoader from '@/components/BulkAddButton/GoogleMapsLoader'
import BulkAddModal from '@/components/BulkAddButton/BulkAddModal'
import regionToContinentMap from '@/utilities/continentMap'
import { getByCountryName } from '@/libs/countries/countriesUtils'
import type { Destination } from '@/payload-types'
import { createDestinations } from '@/actions/createDestinations'

// Extend window to include Payload toast
declare global {
  interface Window {
    Payload?: {
      toast?: {
        success: (message: string) => void
        error: (message: string) => void
      }
    }
  }
}

type DestinationInput = Partial<Destination> & {
  _featuredImageId?: string
  _featuredVideoId?: string
}

type BulkAddContextShape = {
  isModalOpen: boolean
  isSubmitting: boolean
  errorMessage: string | null
  openModal: () => void
  closeModal: () => void
  clearError: () => void
  addBulkDestinations: (docs: DestinationInput[]) => Promise<void>
}

export const BulkAddContext = createContext<BulkAddContextShape>({
  isModalOpen: false,
  isSubmitting: false,
  errorMessage: null,
  openModal: () => {},
  closeModal: () => {},
  clearError: () => {},
  addBulkDestinations: async () => {},
})

const BulkAddProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  /* ---------- continent util (returns undefined if invalid) ------ */
  const safeContinent = (raw: string): Destination['continent'] | undefined =>
    [
      'Africa',
      'Asia',
      'Europe',
      'North America',
      'Oceania',
      'South America',
      'Antarctica',
    ].includes(raw)
      ? (raw as Destination['continent'])
      : undefined

  const getContinent = (country: string): Destination['continent'] | undefined => {
    const staticMatch = getByCountryName(country)
    const code = staticMatch?.code ?? ''
    const raw =
      regionToContinentMap[code] ??
      {
        USA: 'North America',
        UK: 'Europe',
        UAE: 'Asia',
      }[country] ??
      'Unknown'
    return safeContinent(raw)
  }

  /* ---------- modal helpers -------------------------------------- */
  const openModal = () => {
    console.log('Provider: openModal called')
    setIsModalOpen(true)
  }
  const closeModal = () => setIsModalOpen(false)
  const clearError = () => setErrorMessage(null)

  // Listen for global modal open events
  useEffect(() => {
    const handleGlobalOpen = () => {
      console.log('Provider: Received force-open-modal event')
      setIsModalOpen(true)
    }

    window.addEventListener('force-open-modal', handleGlobalOpen)
    return () => window.removeEventListener('force-open-modal', handleGlobalOpen)
  }, [])

  /* ---------- bulk create ---------------------------------------- */
  const addBulkDestinations = async (docs: DestinationInput[]) => {
    console.log('Starting addBulkDestinations with docs:', docs)
    setIsSubmitting(true)
    setErrorMessage(null)

    // normalise continent + minimal content
    const prepared = docs.map((d): DestinationInput => {
      const draft = { ...d }
      if (!draft.continent && draft.countryData?.label) {
        draft.continent = getContinent(draft.countryData.label)
      }
      if (!draft.content && draft.title) {
        draft.content = {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            direction: null,
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h2',
                format: '',
                indent: 0,
                direction: null,
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: draft.title,
                    detail: 0,
                    format: '',
                    mode: 'normal',
                    style: '',
                    version: 1,
                  },
                ],
              },
            ],
          },
        }
      }
      return draft
    })

    try {
      console.log('Calling createDestinations with prepared docs:', prepared)
      const result = await createDestinations(prepared)
      console.log('Result from createDestinations:', result)

      if (result && 'errors' in result && result.errors && result.errors.length) {
        let errorMsg = `Created ${result.created || 0} destinations; ${result.errors.length} failed.`
        // Add detailed error messages if available
        if (result.errors.length > 0) {
          const errorDetails: string = result.errors
            .map(
              (e: { title: string; error?: string }) => `${e.title}: ${e.error || 'Unknown error'}`,
            )
            .join('; ')
          errorMsg += ` Details: ${errorDetails}`
        }
        setErrorMessage(errorMsg)
        console.error('Errors during destination creation:', result.errors)
      } else {
        // Success - close modal immediately
        closeModal()

        // Show success message
        const successMsg = `Successfully created ${result.created || docs.length} destinations!`

        // Use Payload's toast notification if available
        if (window.Payload?.toast) {
          window.Payload.toast.success(successMsg)
        } else {
          alert(successMsg)
        }

        // Trigger a refresh of the list view after a short delay
        setTimeout(() => {
          // Use the appropriate Payload refresh method for the list view
          const refreshButton = document.querySelector(
            '.list-controls__refresh-button',
          ) as HTMLButtonElement
          if (refreshButton) {
            refreshButton.click()
          } else {
            // Use Next.js router refresh instead of window.location.reload()
            router.refresh()
          }
        }, 1000)
      }
    } catch (err) {
      console.error('Error in addBulkDestinations:', err)
      let errorMessage = 'Failed to create destinations'
      if (err instanceof Error) {
        errorMessage += `: ${err.message}`
      } else if (typeof err === 'string') {
        errorMessage += `: ${err}`
      } else {
        errorMessage += ': Unknown error'
      }
      setErrorMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ---------- context value -------------------------------------- */
  const ctx: BulkAddContextShape = {
    isModalOpen,
    isSubmitting,
    errorMessage,
    openModal,
    closeModal,
    clearError,
    addBulkDestinations,
  }

  return (
    <BulkAddContext.Provider value={ctx}>
      <GoogleMapsLoader />
      {/* Use Payload's Modal component like in the old site */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        className="bulk-add-modal"
        title="Bulk Add Destinations"
        slug="bulk-add-destinations-modal"
        style={{ display: isModalOpen ? 'block' : 'none', visibility: 'visible', zIndex: 200 }}
      >
        <BulkAddModal />
      </Modal>
      {children}
    </BulkAddContext.Provider>
  )
}

export const useBulkAdd = () => useContext(BulkAddContext)
export default BulkAddProvider
