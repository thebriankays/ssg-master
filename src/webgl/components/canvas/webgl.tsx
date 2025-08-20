'use client'

import { OrthographicCamera, View } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'
import * as THREE from 'three'
import { SheetProvider, useTheatreContext } from '@/orchestra/theatre'
import { FlowmapProvider } from '../flowmap'
import { PostProcessing } from '../postprocessing'
import { Preload } from '../preload'
import { RAF } from '../raf'
import { useCanvas } from './'
import './webgl.scss'

// Wrapper that only uses SheetProvider if Theatre is available
function ConditionalSheetProvider({ children, id }: { children: ReactNode; id: string }) {
  try {
    // Check if we're in a Theatre context
    const context = useTheatreContext()
    if (context && context.project) {
      return <SheetProvider id={id}>{children}</SheetProvider>
    }
  } catch (e) {
    // No Theatre context available
  }
  
  // Render children without SheetProvider if Theatre isn't available
  return <>{children}</>
}

type WebGLCanvasProps = React.HTMLAttributes<HTMLDivElement> & {
  render?: boolean
  postprocessing?: boolean
  className?: string
  style?: React.CSSProperties
}

export function WebGLCanvas({ render = true, postprocessing = false, className, style, ...props }: WebGLCanvasProps) {
  const { WebGLTunnel, DOMTunnel } = useCanvas()
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  return (
    <div className={`webgl ${className || ''}`} style={{ ...style }} {...props}>
      <Canvas
        gl={{
          precision: 'highp',
          powerPreference: 'high-performance',
          // Disable MSAA when DPR is high to avoid redundant work
          antialias: dpr < 2,
          alpha: true,
          preserveDrawingBuffer: true,
          premultipliedAlpha: false,
          ...(postprocessing && { stencil: false, depth: false }),
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0) // Set clear color to transparent
          gl.outputColorSpace = THREE.SRGBColorSpace // Ensure sRGB output
          gl.toneMapping = THREE.NoToneMapping // No tone mapping
        }}
        dpr={[1, 2]}
        orthographic
        camera={{ position: [0, 0, 5000], near: 0.001, far: 10000, zoom: 1 }}
        frameloop="never"
        linear
        flat
        style={{ 
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}  // Remove resize debounce
      >
        {/* <StateListener onChange={onChange} /> */}
        <ConditionalSheetProvider id="webgl">
          <OrthographicCamera
            makeDefault
            position={[0, 0, 5000]}
            near={0.001}
            far={10000}
            zoom={1}
          />
          <RAF render={render} />
          <FlowmapProvider>
            <Suspense>
              <WebGLTunnel.Out />
            </Suspense>
            {/* View.Port for drei View components (3D widgets) */}
            <View.Port />
            {postprocessing && <PostProcessing />}
          </FlowmapProvider>
          <Preload />
        </ConditionalSheetProvider>
      </Canvas>
      <DOMTunnel.Out />
    </div>
  )
}
