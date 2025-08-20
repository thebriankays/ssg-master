// components/GradientPresetSelector/GradientPresetSelector.tsx
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useField } from '@payloadcms/ui'
import dynamic from 'next/dynamic'

// Dynamically import the actual Whatamesh component
const WhatameshBackground = dynamic(
  () => import('@/components/whatamesh').then(mod => mod.WhatameshBackground),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
      }} />
    )
  }
)

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
    name: 'Pastel Blue',
    colors: ['#c3e4ff', '#6ec3f4', '#eae2ff', '#b9beff'],
  },
  {
    name: 'Vibrant Pink',
    colors: ['#ff0080', '#7928ca', '#ff4e00', '#ff0080'],
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
  const [isAnimating, setIsAnimating] = useState(true)
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null)

  // Get field references for all four colors
  const color1Field = useField<string>({ path: `${basePath}.color1` })
  const color2Field = useField<string>({ path: `${basePath}.color2` })
  const color3Field = useField<string>({ path: `${basePath}.color3` })
  const color4Field = useField<string>({ path: `${basePath}.color4` })

  const currentColors = [
    color1Field.value || '#c3e4ff',
    color2Field.value || '#6ec3f4',
    color3Field.value || '#eae2ff',
    color4Field.value || '#b9beff',
  ]

  // Check if current colors match any preset
  useEffect(() => {
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

  const handleColorChange = (index: number, color: string) => {
    switch(index) {
      case 0:
        color1Field.setValue(color)
        break
      case 1:
        color2Field.setValue(color)
        break
      case 2:
        color3Field.setValue(color)
        break
      case 3:
        color4Field.setValue(color)
        break
    }
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <label className="field-label" style={{ marginBottom: '16px', display: 'block', fontWeight: 600 }}>
        Gradient Configuration
      </label>
      
      {/* Preview Area - Using the REAL Whatamesh component */}
      <div style={{
        backgroundColor: '#000',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        {/* Real Whatamesh Preview */}
        <div style={{
          width: '100%',
          height: '300px',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}>
          <Suspense fallback={
            <div style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${currentColors.join(', ')})`,
              borderRadius: '8px',
            }} />
          }>
            <WhatameshBackground 
              colors={{
                color1: currentColors[0],
                color2: currentColors[1],
                color3: currentColors[2],
                color4: currentColors[3],
              }}
              speed={isAnimating ? 1 : 0}
              scale={1}
              amplitude={320}
            />
          </Suspense>
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'white',
            fontSize: '12px',
            fontFamily: 'monospace',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 10,
          }}>
            whatamesh
          </div>
        </div>

        {/* Color Swatches */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          {currentColors.map((color, index) => (
            <div key={index} style={{ textAlign: 'center', position: 'relative' }}>
              <div
                onClick={() => setShowColorPicker(showColorPicker === index ? null : index)}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              />
              <div style={{
                color: '#888',
                fontSize: '12px',
                marginTop: '8px',
                fontFamily: 'monospace',
              }}>
                {color}
              </div>
              
              {/* Color Picker Dropdown */}
              {showColorPicker === index && (
                <div style={{
                  position: 'absolute',
                  zIndex: 1000,
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    style={{
                      width: '200px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontFamily: 'monospace',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(null)}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      padding: '4px',
                      background: '#f0f0f0',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Animation Control */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsAnimating(!isAnimating)}
            style={{
              padding: '8px 24px',
              background: 'transparent',
              border: '1px solid #666',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#333'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {isAnimating ? 'pause' : 'play'} animation
          </button>
        </div>
      </div>

      {/* Preset Selection */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
          Preset Gradients
        </h4>
        
        <div
          className="gradient-presets-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
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
                background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
                height: '80px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '8px',
                transition: 'all 0.2s ease',
                boxShadow:
                  activePreset === index
                    ? '0 0 0 2px #fff, 0 0 0 4px #0046ff'
                    : '0 2px 8px rgba(0,0,0,0.2)',
                transform: activePreset === index ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseOver={(e) => {
                if (activePreset !== index) {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'
                }
              }}
              onMouseOut={(e) => {
                if (activePreset !== index) {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                {preset.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: 'rgba(0,70,255,0.05)',
          borderRadius: '8px',
          fontSize: '13px',
          borderLeft: '3px solid #0046ff',
        }}
      >
        <p><strong>Tips:</strong></p>
        <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
          <li>Click on any color swatch above to change individual colors</li>
          <li>Select a preset to quickly apply a pre-designed gradient</li>
          <li>The preview shows exactly how your gradient will look on the site</li>
          <li style={{ marginTop: '8px', fontWeight: 'bold' }}>
            Remember to save your changes at the bottom of the page!
          </li>
        </ul>
      </div>
    </div>
  )
}

export default GradientPresetSelector
