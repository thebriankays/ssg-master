import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CanvasTexture, LinearFilter, type Mesh } from 'three'
import { useFlowmap } from '@/webgl/components/flowmap'
import { useWebGLRect } from '@/hooks/use-webgl-rect'
import { AnimatedGradientMaterial } from './material'

// @refresh reset

function useGradient(colors: string[]) {
  const [canvas] = useState(() => document.createElement('canvas'))
  const texture = useMemo(() => {
    const texture = new CanvasTexture(canvas)
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter

    return texture
  }, [canvas])

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)

    if (colors.length > 1) {
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color)
      })
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = colors[0]
    }

    ctx.fillRect(0, 0, canvas.width, canvas.height)

    texture.needsUpdate = true
  }, [colors, texture, canvas])

  return texture
}

interface AnimatedGradientWebGLProps {
  rect: DOMRect | null
  amplitude?: number
  frequency?: number
  colorAmplitude?: number
  colorFrequency?: number
  quantize?: number
  radial?: boolean
  flowmap?: boolean
  colors?: string[]
  speed?: number
  isGlobal?: boolean
}

export function AnimatedGradientWebGL({
  rect,
  amplitude = 0.5,
  frequency = 0.2,
  colorAmplitude = 0.5,
  colorFrequency = 0.2,
  quantize = 0,
  radial = false,
  flowmap: hasFlowmap = false, // Temporarily disabled
  colors = ['#1e293b', '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'],
  speed = 1,
  isGlobal = false,
}: AnimatedGradientWebGLProps) {
  const flowmap = useFlowmap('fluid')

  const [material] = useState(
    () =>
      new AnimatedGradientMaterial({
        amplitude,
        frequency,
        colorAmplitude,
        colorFrequency,
        quantize,
        radial,
        flowmap: hasFlowmap ? flowmap : undefined,
      }),
  )

  const gradientTexture = useGradient(colors)

  useEffect(() => {
    material.colorsTexture = gradientTexture
  }, [material, gradientTexture])

  useEffect(() => {
    material.quantize = quantize
  }, [material, quantize])

  useEffect(() => {
    material.colorFrequency = colorFrequency
  }, [material, colorFrequency])

  useEffect(() => {
    material.colorAmplitude = colorAmplitude
  }, [material, colorAmplitude])

  useEffect(() => {
    material.amplitude = amplitude
  }, [material, amplitude])

  useEffect(() => {
    material.frequency = frequency
  }, [material, frequency])

  // Use viewport for sizing when global
  const { width: windowWidth, height: windowHeight } = useThree((state) => state.size)
  
  useEffect(() => {
    material.resolution.set(windowWidth, windowHeight)
  }, [material, windowWidth, windowHeight])
  
  useEffect(() => {
    // For global background, use viewport aspect ratio
    if (isGlobal) {
      material.aspect.set(1, 1)
    } else if (rect) {
      const aspectX = rect.width > rect.height ? 1 : rect.width / rect.height
      const aspectY = rect.height > rect.width ? 1 : rect.height / rect.width
      material.aspect.set(aspectX, aspectY)
    }
  }, [material, isGlobal, rect])

  const viewport = useThree((state) => state.viewport)

  useEffect(() => {
    material.dpr = viewport.dpr
  }, [material, viewport])

  const meshRef = useRef<Mesh>(null!)

  // Only use rect positioning if not global
  if (!isGlobal && rect) {
    useWebGLRect(rect, ({ scale, position, rotation }: any) => {
      if (meshRef.current) {
        meshRef.current.position.set(position.x, position.y, position.z)
        meshRef.current.rotation.set(rotation.x, rotation.y, rotation.z)
        meshRef.current.scale.set(scale.x, scale.y, scale.z)
        meshRef.current.updateMatrix()
      }
    })
  }

  useFrame(({ clock }) => {
    material.time = clock.getElapsedTime() * speed * 0.05
  })

  // For global background, render full viewport
  if (isGlobal) {
    // Ensure scale values are valid
    const scaleX = Number.isFinite(viewport.width) && viewport.width > 0 ? viewport.width : 100
    const scaleY = Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : 100
    
    return (
      <mesh 
        ref={meshRef}
        position={[0, 0, -100]}
        scale={[scaleX, scaleY, 1]}
        renderOrder={-1}
      >
        <planeGeometry args={[1, 1, 1, 1]} />
        <primitive object={material} />
      </mesh>
    )
  }
  
  return (
    <mesh matrixAutoUpdate={false} ref={meshRef}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} />
    </mesh>
  )
}
