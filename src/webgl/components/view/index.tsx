'use client'

import { View as DreiView, type ViewProps as DreiViewProps } from '@react-three/drei'
import { useRect } from 'hamo'
import { type PropsWithChildren, useEffect } from 'react'
import { useDeviceDetection } from '@/hooks/use-device-detection'
import { WebGLTunnel } from '../tunnel'

export type ViewProps = PropsWithChildren<{
  className?: string
  style?: React.CSSProperties
} & Omit<DreiViewProps, 'track'>>

/**
 * View component that bridges DOM and WebGL contexts
 * Can be used either with tunnel-rat (default) or drei View
 */
export function View({ 
  children, 
  className, 
  style,
  useDreiView = false,
  ...dreiProps 
}: ViewProps & { useDreiView?: boolean }) {
  const [setRectRef, rect] = useRect()
  const { isWebGL } = useDeviceDetection()

  // If using drei View mode
  if (useDreiView) {
    return (
      <DreiView track={setRectRef as any} {...dreiProps}>
        {children}
      </DreiView>
    )
  }

  // Default tunnel-rat mode
  return (
    <>
      <WebGLTunnel>{children}</WebGLTunnel>
      <div
        ref={setRectRef}
        className={className}
        style={{
          ...style,
          opacity: isWebGL ? 0 : 1,
        }}
      />
    </>
  )
}

/**
 * Container component for multiple views
 * Provides proper context for drei View system
 */
export function ViewContainer({ children, className, style }: PropsWithChildren<{
  className?: string
  style?: React.CSSProperties
}>) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}