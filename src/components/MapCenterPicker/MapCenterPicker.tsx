'use client'

import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

interface MapCenter {
  lat: number
  lng: number
  zoom: number
}

const MapCenterPicker: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })
  const [mapCenter, setMapCenter] = useState<MapCenter>(() => {
    if (value) {
      try {
        return JSON.parse(value)
      } catch {
        return { lat: 0, lng: 0, zoom: 10 }
      }
    }
    return { lat: 0, lng: 0, zoom: 10 }
  })

  const handleChange = (key: keyof MapCenter, newValue: number) => {
    const updated = { ...mapCenter, [key]: newValue }
    setMapCenter(updated)
    setValue(JSON.stringify(updated))
  }

  return (
    <div className="map-center-picker">
      <label className="field-label">{typeof field.label === 'string' ? field.label : 'Map Center'}</label>
      <div className="map-center-picker__controls">
        <div className="field">
          <label>Latitude</label>
          <input
            type="number"
            value={mapCenter.lat}
            onChange={(e) => handleChange('lat', parseFloat(e.target.value) || 0)}
            step="0.000001"
            min="-90"
            max="90"
          />
        </div>
        <div className="field">
          <label>Longitude</label>
          <input
            type="number"
            value={mapCenter.lng}
            onChange={(e) => handleChange('lng', parseFloat(e.target.value) || 0)}
            step="0.000001"
            min="-180"
            max="180"
          />
        </div>
        <div className="field">
          <label>Zoom</label>
          <input
            type="number"
            value={mapCenter.zoom}
            onChange={(e) => handleChange('zoom', parseInt(e.target.value) || 10)}
            step="1"
            min="1"
            max="20"
          />
        </div>
      </div>
    </div>
  )
}

export default MapCenterPicker