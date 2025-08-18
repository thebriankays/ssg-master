'use client'

import React, { useState, useEffect } from 'react'
import { Button, Form } from '@payloadcms/ui'
import { useBulkAdd } from '@/providers/BulkAddProvider'
import GooglePlacesField, { LocationDataValue } from '@/fields/GooglePlaces/GooglePlacesField'
import type { Destination } from '@/payload-types'
import { getByCountryName } from '@/libs/countries/countriesUtils'
import regionToContinentMap from '@/utilities/continentMap'
import './BulkAddModal.css'

// Define continent type from Destination
type AllowedContinent = Destination['continent']

const DEFAULT_CONTINENT_MAP = {
  Mexico: 'North America',
  USA: 'North America',
  'United States': 'North America',
  Canada: 'North America',
  'United Kingdom': 'Europe',
  UK: 'Europe',
  France: 'Europe',
  Germany: 'Europe',
  Spain: 'Europe',
  Italy: 'Europe',
  Russia: 'Europe',
  China: 'Asia',
  Japan: 'Asia',
  India: 'Asia',
  Australia: 'Oceania',
  'New Zealand': 'Oceania',
  Brazil: 'South America',
  Argentina: 'South America',
  Egypt: 'Africa',
  'South Africa': 'Africa',
  Nigeria: 'Africa',
  Kenya: 'Africa',
}

// Helper to determine continent from country
const getContinent = (country: string): AllowedContinent => {
  // First try to look up the country in our comprehensive database
  const countryData = getByCountryName(country)
  if (countryData) {
    // Use the continent mapping based on country code
    const continent = regionToContinentMap[countryData.code] as AllowedContinent
    if (continent) return continent
  }

  // Fallback to the simple mapping
  const map = DEFAULT_CONTINENT_MAP[country as keyof typeof DEFAULT_CONTINENT_MAP]
  if (map) return map as AllowedContinent

  // Default fallback
  return 'North America'
}

// Define the event interface for type safety
interface PayloadFieldUpdateEvent extends Event {
  detail?: {
    path: string
    value: unknown
  }
}

// The main modal component
const BulkAddModal = () => {
  const { isModalOpen, closeModal, isSubmitting, errorMessage, clearError, addBulkDestinations } =
    useBulkAdd()

  const [selectedPlaces, setSelectedPlaces] = useState<LocationDataValue[]>([])
  const [currentLocation, setCurrentLocation] = useState<LocationDataValue | null>(null)
  const [formKey, setFormKey] = useState(Date.now())
  const [showPlacesField, setShowPlacesField] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('BulkAddModal rendered, isModalOpen:', isModalOpen)

    // Only manipulate the DOM when the modal should actually be open
    if (isModalOpen) {
      setTimeout(() => {
        const modal = document.getElementById('bulk-add-destinations-modal')
        if (modal instanceof HTMLElement) {
          modal.setAttribute('open', 'true')
          modal.style.visibility = 'visible'
          modal.style.display = 'block'
        }
      }, 50)
    } else {
      // Make sure the modal is closed when isModalOpen is false
      setTimeout(() => {
        const modal = document.getElementById('bulk-add-destinations-modal')
        if (modal instanceof HTMLElement) {
          modal.removeAttribute('open')
          modal.style.visibility = 'hidden'
          modal.style.display = 'none'
        }
      }, 50)
    }
  }, [isModalOpen])

  // Delay showing the Places field to avoid Google Maps API conflicts
  useEffect(() => {
    if (isModalOpen) {
      // Short delay to ensure modal is fully mounted before showing Places field
      const timer = setTimeout(() => {
        setShowPlacesField(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setShowPlacesField(false)
    }
  }, [isModalOpen])

  // Listen for payload-field-update events from GooglePlacesField
  useEffect(() => {
    const handleFieldUpdate = (e: PayloadFieldUpdateEvent) => {
      if (e.detail?.path === 'locationData' && e.detail?.value) {
        console.log('Location field updated:', e.detail.value)

        // Stop event propagation to prevent any modal openings
        if (e.stopPropagation) {
          e.stopPropagation()
        }

        // Only update if the modal is actually open
        if (isModalOpen) {
          setCurrentLocation(e.detail.value as LocationDataValue)
        }
      }
    }

    window.addEventListener('payload-field-update', handleFieldUpdate as EventListener)

    return () => {
      window.removeEventListener('payload-field-update', handleFieldUpdate as EventListener)
    }
  }, [isModalOpen])

  const addDestination = () => {
    console.log('addDestination called, currentLocation:', currentLocation)

    if (currentLocation) {
      console.log('Adding destination to list:', currentLocation)
      setSelectedPlaces((prev) => {
        console.log('Previous selectedPlaces:', prev)
        return [...prev, currentLocation]
      })

      // Reset the form and location
      setFormKey(Date.now())
      setCurrentLocation(null)

      // Reset the GooglePlacesField
      try {
        // Prevent opening any modal with this event
        const resetEvent = new CustomEvent('payload-reset-field', {
          detail: { path: 'locationData' },
        })
        window.dispatchEvent(resetEvent)
        console.log('Reset event dispatched')
      } catch (e) {
        console.error('Error dispatching reset event:', e instanceof Error ? e.message : String(e))
      }
    } else {
      console.log('No current location to add')
    }
  }

  const removeDestination = (index: number) => {
    setSelectedPlaces((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (selectedPlaces.length === 0) {
      console.log('No places selected to submit')
      return
    }

    try {
      console.log('Formatting destinations for submission...')
      // Format destinations as expected by the provider
      const formattedDestinations = selectedPlaces.map((dest) => {
        const title = `${dest.city || 'Unknown'}, ${dest.country || 'Unknown'}`
        console.log('Formatting destination:', title)

        // Determine continent if not already set
        let continent = dest.continent as AllowedContinent
        if (!continent && dest.country) {
          continent = getContinent(dest.country)
          console.log(`Determined continent for ${dest.country}: ${continent}`)
        }

        // Build countryData from the Google Places data
        let countryData = undefined
        if (dest.tempCountryData) {
          const staticData = getByCountryName(
            dest.tempCountryData.countryName || dest.country || '',
          )
          if (staticData) {
            countryData = {
              label: staticData.label,
              code: staticData.code,
              capital: staticData.capital,
              region: staticData.region,
              currency: {
                code: staticData.currency.code,
                label: staticData.currency.label,
                symbol: staticData.currency.symbol || '',
              },
              language: {
                code: staticData.language.code || '',
                label: staticData.language.label,
                nativeName: staticData.language.nativeName,
              },
              flag: `/flags/${staticData.code.toLowerCase()}.svg`,
            }
          }
        }

        return {
          title,
          locationData: {
            address: dest.address,
            coordinates: dest.coordinates
              ? {
                  lat: dest.coordinates.lat,
                  lng: dest.coordinates.lng,
                }
              : undefined,
            placeID: dest.placeID,
            country: dest.country,
            continent: dest.continent,
            city: dest.city,
            // Include tempCountryData for the hook to process
            tempCountryData: dest.tempCountryData,
          },
          countryData: countryData,
          // Set continent explicitly
          continent: continent,
        }
      })

      console.log('Submitting destinations:', formattedDestinations)
      await addBulkDestinations(formattedDestinations)
      setSelectedPlaces([])
    } catch (error) {
      console.error('Error in handleSubmit:', error)
    }
  }

  return (
    <div className="bulk-add-modal__content">
      {errorMessage && (
        <div className="bulk-add-modal__error">
          <p>{errorMessage}</p>
          <Button size="small" buttonStyle="secondary" onClick={clearError}>
            Dismiss Error
          </Button>
        </div>
      )}

      <div className="bulk-add-modal__form">
        <h3>Add Destinations</h3>
        {showPlacesField ? (
          <Form
            key={formKey}
            initialState={{}}
            onSubmit={() => Promise.resolve({})}
            className="mini-form"
          >
            <GooglePlacesField path="locationData" label="Search for a location" required={false} />
          </Form>
        ) : (
          <div className="loading-placeholder">Loading Google Maps search...</div>
        )}

        <div className="button-wrapper">
          <Button
            buttonStyle="secondary"
            onClick={addDestination}
            disabled={!currentLocation}
            className="add-destination-button"
          >
            Add to List
          </Button>
        </div>
      </div>

      <div className="bulk-add-modal__selected">
        <h2>Selected Destinations ({selectedPlaces.length})</h2>
        {selectedPlaces.length === 0 ? (
          <p>No destinations added yet. Search for a location above to add to the list.</p>
        ) : (
          <ul className="destination-list">
            {selectedPlaces.map((dest, index) => (
              <li key={index} className="destination-item">
                <span>
                  {dest.city || (dest.address ? dest.address.split(',')[0] : 'Unknown')},{' '}
                  {dest.country || 'Unknown'}
                </span>
                <Button
                  size="small"
                  buttonStyle="icon-label"
                  onClick={() => removeDestination(index)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bulk-add-modal__footer">
        <div className="button-container">
          <Button size="medium" buttonStyle="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            size="medium"
            buttonStyle="primary"
            onClick={handleSubmit}
            disabled={selectedPlaces.length === 0 || isSubmitting}
          >
            {isSubmitting
              ? 'Adding Destinations...'
              : `Add ${selectedPlaces.length} Destination${selectedPlaces.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BulkAddModal
