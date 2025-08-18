// components/GradientPresetSelector/GradientPresetSelector.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

// Define all gradient presets
const presets = [
  {
    name: 'Default',
    colors: ['#dca8d8', '#a3d3f9', '#fcd6d6', '#eae2ff'],
  },
  {
    name: 'Sunset',
    colors: ['#fc5c7d', '#6a82fb', '#fc5c7d', '#f7b733'],
  },
  {
    name: 'Tropical',
    colors: ['#98eabe', '#437add', '#bf45ee', '#f5f1e8'],
  },
  {
    name: 'Pastel',
    colors: ['#FFDDE1', '#EE9CA7', '#C9FFBF', '#FFAFBD'],
  },
  {
    name: 'Spring',
    colors: ['#FFD3B5', '#B3E0E3', '#D8A8E8', '#9DE0AD'],
  },
  {
    name: 'Tech',
    colors: ['#225ee1', '#28d7bf', '#ac53cf', '#e7a39c'],
  },
  {
    name: 'Candy',
    colors: ['#F098F3', '#fbe8d0', '#fcc3e6', '#72B8F9'],
  },
  {
    name: 'Vibrant',
    colors: ['#a960ee', '#ff333d', '#90e0ff', '#ffcb57'],
  },
  {
    name: 'Fusion',
    colors: ['#E1785D', '#A87CEF', '#5BC8E2', '#4447EC'],
  },
  {
    name: 'Modern',
    colors: ['#4a306d', '#fe5448', '#81d6e3', '#edcce4'],
  },
]

interface GradientPresetSelectorProps {
  path: string
}

const GradientPresetSelector: React.FC<GradientPresetSelectorProps> = ({ path }) => {
  const basePath = path.split('.').slice(0, -1).join('.')
  const [activePreset, setActivePreset] = useState<number | null>(null)

  // Get field references for all four colors
  const color1Field = useField<string>({ path: `${basePath}.color1` })
  const color2Field = useField<string>({ path: `${basePath}.color2` })
  const color3Field = useField<string>({ path: `${basePath}.color3` })
  const color4Field = useField<string>({ path: `${basePath}.color4` })

  // Check if current colors match any preset
  useEffect(() => {
    const currentColors = [
      color1Field.value || '',
      color2Field.value || '',
      color3Field.value || '',
      color4Field.value || '',
    ]

    // Find if current colors match any preset
    const matchingPresetIndex = presets.findIndex((preset) =>
      preset.colors.every(
        (color, index) => color.toLowerCase() === (currentColors[index] || '').toLowerCase(),
      ),
    )

    setActivePreset(matchingPresetIndex !== -1 ? matchingPresetIndex : null)
  }, [color1Field.value, color2Field.value, color3Field.value, color4Field.value])

  const applyPreset = (preset: (typeof presets)[0], index: number) => {
    // Apply the preset colors
    color1Field.setValue(preset.colors[0])
    color2Field.setValue(preset.colors[1])
    color3Field.setValue(preset.colors[2])
    color4Field.setValue(preset.colors[3])

    // Update active preset
    setActivePreset(index)
  }

  return (
    <div>
      <label className="field-label">Gradient Presets</label>
      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '14px',
            marginBottom: '8px',
          }}
        >
          {activePreset !== null && presets[activePreset]
            ? `Current: ${presets[activePreset].name}`
            : 'Custom gradient (no preset selected)'}
        </div>
      </div>

      <div
        className="gradient-presets-container"
        style={{
          marginTop: '10px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
        }}
      >
        {presets.map((preset, index) => (
          <div
            key={preset.name}
            role="button"
            tabIndex={0}
            onClick={() => applyPreset(preset, index)}
            onKeyDown={(e) => e.key === 'Enter' && applyPreset(preset, index)}
            style={{
              background: `linear-gradient(45deg, ${preset.colors.join(', ')})`,
              height: '80px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '8px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow:
                activePreset === index
                  ? '0 0 0 3px #0046ff, 0 4px 8px rgba(0,0,0,0.15)'
                  : '0 2px 4px rgba(0,0,0,0.1)',
              transform: activePreset === index ? 'scale(1.02)' : 'scale(1)',
            }}
            onMouseOver={(e) => {
              if (activePreset !== index) {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
              }
            }}
            onMouseOut={(e) => {
              if (activePreset !== index) {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              {preset.name}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        <p>Click any preset to automatically apply those colors to your gradient.</p>
        <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
          Remember to click "Save" at the bottom of the page to apply changes!
        </p>
      </div>
    </div>
  )
}

export default GradientPresetSelector