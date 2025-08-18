'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
import type { Rect } from 'hamo'
import { useWebGLRect } from '@/hooks/use-webgl-rect'
import { useTheatre } from '@/orchestra/theatre/hooks/use-theatre'

type WebGLBoxProps = {
  rect: Rect
  isHovered: boolean
}

export function WebGLBox({ rect, isHovered }: WebGLBoxProps) {
  const meshRef = useRef<Mesh>(null!)

  // Theatre.js integration
  const { values } = useTheatre('box', {
    rotationSpeed: 0.01,
    scale: 1,
    color: '#ff0066',
  })

  // Sync with DOM position
  useWebGLRect(rect, ({ position, scale }) => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z)
      meshRef.current.scale.set(scale.x, scale.y, scale.z)
    }
  })

  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += values.rotationSpeed
      meshRef.current.rotation.y += values.rotationSpeed

      // Hover effect
      const targetScale = isHovered ? values.scale * 1.2 : values.scale
      meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1
      meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1
      meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * 0.1
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={values.color} />
    </mesh>
  )
}
