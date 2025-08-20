'use client'
import { useRef, useMemo } from 'react'
import { WebGLTunnel } from '@/webgl/components/tunnel'
import { useRect } from 'hamo'
import { useWebGLRect } from '@/hooks/use-webgl-rect'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Rect } from 'hamo'

type WebGLMountProps = {
  className?: string
  style?: React.CSSProperties
  interactive?: 'dom' | 'none'
  onWheel?: (e: WheelEvent) => void
  onPointerDown?: (e: PointerEvent) => void
  onPointerMove?: (e: PointerEvent) => void
  onPointerUp?: (e: PointerEvent) => void
  children: React.ReactNode
  scaleMultiplier?: number
  [key: string]: any // Allow data attributes and other props
}

// Inner component that runs inside the Canvas context
function WebGLMountContent({ rect, children, scaleMultiplier = 1 }: { rect: Rect | null; children: React.ReactNode; scaleMultiplier?: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  const { viewport } = useThree()

  // This hook uses useThree internally, so it must be inside Canvas
  useWebGLRect(rect, ({ position, scale, isVisible }) => {
    if (!groupRef.current) return
    groupRef.current.position.copy(position)
    
    // Calculate proper scale based on viewport
    // The orthographic camera is at zoom 1 with dimensions matching viewport
    // So we need to scale content appropriately
    const baseScale = Math.min(viewport.width, viewport.height) * 0.1 * scaleMultiplier
    groupRef.current.scale.set(baseScale, baseScale, baseScale)
    groupRef.current.visible = isVisible
    groupRef.current.updateMatrix()
  })

  return (
    <group ref={groupRef} matrixAutoUpdate={false}>
      {children}
    </group>
  )
}

/** DOM element -> tunneled <group> positioned in shared canvas */
export function WebGLMount({
  className,
  style,
  interactive = 'dom',
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  children,
  scaleMultiplier = 1,
  ...rest
}: WebGLMountProps) {
  const [setRectRef, rect] = useRect()

  // Wrap DOM handlers (optional)
  const domProps = useMemo(() => {
    if (interactive !== 'dom') return {}
    return {
      onWheel: (e: React.WheelEvent) => onWheel?.(e.nativeEvent),
      onPointerDown: (e: React.PointerEvent) => onPointerDown?.(e.nativeEvent),
      onPointerMove: (e: React.PointerEvent) => onPointerMove?.(e.nativeEvent),
      onPointerUp: (e: React.PointerEvent) => onPointerUp?.(e.nativeEvent),
      onPointerCancel: (e: React.PointerEvent) => onPointerUp?.(e.nativeEvent),
      onPointerLeave: (e: React.PointerEvent) => onPointerUp?.(e.nativeEvent),
    }
  }, [interactive, onWheel, onPointerDown, onPointerMove, onPointerUp])

  return (
    <>
      <div ref={setRectRef} className={className} style={style} {...domProps} {...rest} />
      <WebGLTunnel>
        <WebGLMountContent rect={rect} scaleMultiplier={scaleMultiplier}>
          {children}
        </WebGLMountContent>
      </WebGLTunnel>
    </>
  )
}