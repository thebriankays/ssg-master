'use client'

import { Canvas } from '@react-three/fiber'
import { Preload, View } from '@react-three/drei'
import { type ReactNode, Suspense } from 'react'
import { FlowmapProvider } from './components/flowmap'
import { PostProcessing } from './components/postprocessing'
import { RAF } from './components/raf'
import { SheetProvider } from '@/orchestra/theatre'

interface SharedCanvasProps {
  children: ReactNode
  className?: string
  postprocessing?: boolean
}

/**
 * Shared Canvas Architecture
 * Single WebGL context that renders all View components throughout the app
 */
export function SharedCanvas({ 
  children, 
  className = 'shared-canvas',
  postprocessing = false 
}: SharedCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        // Performance optimizations
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: true,
        }}
        // Camera setup
        camera={{ 
          position: [0, 0, 5], 
          fov: 50,
          near: 0.1,
          far: 1000 
        }}
        // Drei View system requires specific settings
        shadows={false}
        dpr={[1, 2]}
        eventSource={document.documentElement}
        eventPrefix="client"
      >
        <SheetProvider id="webgl">
          {/* Animation frame management */}
          <RAF />
          
          {/* Flowmap effects provider */}
          <FlowmapProvider>
            {/* Post-processing effects */}
            {postprocessing && <PostProcessing />}
            
            {/* Global lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            {/* All View components will render here */}
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </FlowmapProvider>
          
          {/* Asset preloading */}
          <Preload all />
        </SheetProvider>
      </Canvas>
    </div>
  )
}