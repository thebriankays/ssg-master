'use client'

import React, { createContext, useContext, useRef, ReactNode, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { View, Preload } from '@react-three/drei'
import { ACESFilmicToneMapping, LinearSRGBColorSpace } from 'three'
import { Perf } from 'r3f-perf'

interface SharedCanvasContextType {
  isReady: boolean
  canvasRef: React.RefObject<HTMLDivElement>
}

const SharedCanvasContext = createContext<SharedCanvasContextType | null>(null)

export function useSharedCanvas() {
  const context = useContext(SharedCanvasContext)
  if (!context) {
    throw new Error('useSharedCanvas must be used within SharedCanvasProvider')
  }
  return context
}

interface SharedCanvasProviderProps {
  children: ReactNode
  className?: string
  gl?: any // WebGLRenderer props
}

export function SharedCanvasProvider({ 
  children, 
  className = '',
  gl = {}
}: SharedCanvasProviderProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = React.useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  return (
    <SharedCanvasContext.Provider value={{ isReady, canvasRef: canvasRef as React.RefObject<HTMLDivElement> }}>
      <div ref={canvasRef} className={`shared-canvas-provider ${className}`}>
        {/* Fixed canvas that covers the entire viewport */}
        <Canvas
          className="shared-canvas"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: -1
          }}
          eventSource={canvasRef as React.RefObject<HTMLElement>}
          eventPrefix="client"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: ACESFilmicToneMapping,
            outputColorSpace: LinearSRGBColorSpace,
            preserveDrawingBuffer: true,
            ...gl
          }}
          // Default camera can be overridden per View
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]} // Device pixel ratio clamped between 1 and 2
        >
          {/* Performance monitor in development */}
          {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
          
          {/* Preload all assets */}
          <Preload all />
          
          {/* Views will be rendered here with their own cameras */}
          <View.Port />
        </Canvas>
        
        {/* Content goes here */}
        {children}
      </div>
    </SharedCanvasContext.Provider>
  )
}

// Export View for use in components
export { View }

// Hook to create a ref for View component with proper typing
export function useWebGLView<T extends HTMLElement = HTMLDivElement>() {
  return useRef<T>(null)
}