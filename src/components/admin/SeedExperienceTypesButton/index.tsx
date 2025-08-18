'use client'

import React, { useState } from 'react'
import { toast } from '@payloadcms/ui'
import type { AdminViewComponent } from 'payload'

const SeedExperienceTypesButton: AdminViewComponent = () => {
  const [loading, setLoading] = useState(false)

  const handleSeed = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seed-experience-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to seed experience types')
      }

      const result = await response.json()
      toast.success(`Successfully seeded ${result.count} experience types`)
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className="btn btn--style-primary"
      onClick={handleSeed}
      disabled={loading}
    >
      {loading ? 'Seeding...' : 'Seed Experience Types'}
    </button>
  )
}

export default SeedExperienceTypesButton