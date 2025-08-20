'use client'

import { useRect } from '@/hooks/use-rect'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import type { ComponentProps, CSSProperties } from 'react'
import { WebGLTunnel } from '@/webgl/components/tunnel'
import './whatamesh.scss'

const WebGLWhatamesh = dynamic(
  () => import('./Whatamesh.webgl').then(({ WhatameshWebGL }) => WhatameshWebGL),
  { ssr: false }
)

interface WhatameshProps extends Omit<ComponentProps<typeof WebGLWhatamesh>, 'rect'> {
  className?: string
  style?: CSSProperties
  isGlobal?: boolean
}

const toDOMRect = (
  rect: {
    width?: number
    height?: number
    top?: number
    left?: number
    right?: number
    bottom?: number
    x?: number
    y?: number
  } | null
): DOMRect => ({
  top: rect?.top ?? 0,
  right: rect?.right ?? 0,
  bottom: rect?.bottom ?? 0,
  left: rect?.left ?? 0,
  width: rect?.width ?? 0,
  height: rect?.height ?? 0,
  x: rect?.x ?? 0,
  y: rect?.y ?? 0,
  toJSON: () => ({
    top: rect?.top ?? 0,
    right: rect?.right ?? 0,
    bottom: rect?.bottom ?? 0,
    left: rect?.left ?? 0,
    width: rect?.width ?? 0,
    height: rect?.height ?? 0,
    x: rect?.x ?? 0,
    y: rect?.y ?? 0,
  }),
})

export function Whatamesh({
  className,
  style,
  isGlobal = false,
  ...props
}: WhatameshProps) {
  const [setRectRef, rect] = useRect()

  return (
    <div 
      ref={setRectRef} 
      className={className} 
      style={style}
    >
      <WebGLTunnel>
        <WebGLWhatamesh rect={toDOMRect(rect)} isGlobal={isGlobal} {...props} />
      </WebGLTunnel>
    </div>
  )
}

// Export the global background component
export function WhatameshBackground(props: Omit<ComponentProps<typeof WebGLWhatamesh>, 'rect' | 'isGlobal'>) {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  
  // For global background, create a fullscreen rect
  const fullscreenRect: DOMRect = {
    top: 0,
    right: dimensions.width,
    bottom: dimensions.height,
    left: 0,
    width: dimensions.width,
    height: dimensions.height,
    x: 0,
    y: 0,
    toJSON: () => ({
      top: 0,
      right: dimensions.width,
      bottom: dimensions.height,
      left: 0,
      width: dimensions.width,
      height: dimensions.height,
      x: 0,
      y: 0,
    }),
  }
  
  return (
    <WebGLTunnel>
      <WebGLWhatamesh 
        rect={fullscreenRect}
        isGlobal={true}
        {...props}
      />
    </WebGLTunnel>
  )
}