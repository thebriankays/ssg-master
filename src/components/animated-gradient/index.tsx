'use client'

import { useRect } from '@/hooks/use-rect'
import dynamic from 'next/dynamic'
import type { ComponentProps, CSSProperties } from 'react'
import { WebGLTunnel } from '@/webgl/components/tunnel'

const AnimatedGradientWebGL = dynamic(
  () => import('./AnimatedGradient.webgl').then(({ AnimatedGradientWebGL }) => AnimatedGradientWebGL),
  { ssr: false }
)

interface AnimatedGradientProps extends Omit<ComponentProps<typeof AnimatedGradientWebGL>, 'rect'> {
  className?: string
  style?: CSSProperties
  isGlobal?: boolean
}

export function AnimatedGradient({
  className,
  style,
  isGlobal = false,
  ...props
}: AnimatedGradientProps) {
  const [setRectRef, rect] = useRect()

  if (isGlobal) {
    return (
      <WebGLTunnel>
        <AnimatedGradientWebGL rect={null as any} isGlobal={true} {...props} />
      </WebGLTunnel>
    )
  }

  return (
    <div 
      ref={setRectRef} 
      className={className} 
      style={style}
    >
      <WebGLTunnel>
        <AnimatedGradientWebGL rect={rect} {...props} />
      </WebGLTunnel>
    </div>
  )
}

// Export the global background component
export function AnimatedGradientBackground() {
  return <AnimatedGradient isGlobal={true} />
}
