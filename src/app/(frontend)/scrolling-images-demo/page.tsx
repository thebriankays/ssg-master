'use client'

import React from 'react'
import { ScrollingImages } from '@/components/ScrollingImages'
import type { ScrollingImagesVariant } from '@/components/ScrollingImages'

// Demo images - replace with your actual media
const demoImages = [
  { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop', alt: 'Mountain landscape' },
  { image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&h=900&fit=crop', alt: 'Forest view' },
  { image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=900&fit=crop', alt: 'Forest path' },
  { image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=900&fit=crop', alt: 'Mountain valley' },
  { image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600&h=900&fit=crop', alt: 'Nature landscape' },
  { image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1600&h=900&fit=crop', alt: 'Forest trees' },
]

export default function ScrollingImagesDemo() {
  const [variant, setVariant] = React.useState<ScrollingImagesVariant>('3d')
  const [columns, setColumns] = React.useState(3)

  return (
    <div className="scrolling-images-demo">
      {/* Controls */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Scrolling Images Demo</h2>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
            Animation Variant:
          </label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as ScrollingImagesVariant)}
            style={{
              padding: '4px 8px',
              background: '#222',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <option value="3d">3D Rotation</option>
            <option value="scaleXY">Scale X & Y</option>
            <option value="scaleOpacity">Scale & Opacity</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
            Columns:
          </label>
          <select
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              background: '#222',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
            <option value={5}>5 Columns</option>
            <option value={6}>6 Columns</option>
          </select>
        </div>
        
        <div style={{ marginTop: '16px', fontSize: '12px', opacity: 0.7 }}>
          Scroll down to see the animation effect
        </div>
      </div>

      {/* Spacer for scrolling */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '48px', color: 'white' }}>Scroll Down ↓</h1>
      </div>

      {/* ScrollingImages Component */}
      <ScrollingImages
        key={`${variant}-${columns}`} // Force remount on change
        images={demoImages}
        variant={variant}
        columns={columns}
        gap="5vh"
      />

      {/* More content for scrolling */}
      <div style={{ height: '200vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '36px', color: 'white' }}>Keep Scrolling ↓</h2>
      </div>
    </div>
  )
}
