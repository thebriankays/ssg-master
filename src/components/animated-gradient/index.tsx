'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import type { ComponentProps, CSSProperties } from 'react'
import { View } from '@react-three/drei'

const WebGLAnimatedGradient = dynamic(
  () =>
    import('./webgl').then(
      ({ WebGLAnimatedGradient }) => WebGLAnimatedGradient
    ),
  {
    ssr: false,
  }
)

type AnimatedGradientProps = {
  className?: string
  style?: CSSProperties
} & ComponentProps<typeof WebGLAnimatedGradient>

export function AnimatedGradient({
  className,
  style,
  ...props
}: AnimatedGradientProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className={className} style={style}>
      <View track={ref as React.RefObject<HTMLElement>}>
        <WebGLAnimatedGradient {...props} />
      </View>
    </div>
  )
}
