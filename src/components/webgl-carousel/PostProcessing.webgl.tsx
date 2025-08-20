'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { Color } from 'three'

interface PostProcessingProps {
  ior?: number
}

export const PostProcessing = forwardRef<any, PostProcessingProps>((props, ref) => {
  const { ior = 0.9 } = props
  const { viewport } = useThree()
  const materialRef = useRef<any>(null)

  // Expose thickness setter to parent
  useImperativeHandle(ref, () => ({
    get thickness() {
      return materialRef.current?.thickness || 0
    },
    set thickness(value: number) {
      if (materialRef.current) {
        materialRef.current.thickness = value
      }
    },
  }))

  return (
    <mesh position={[0, 0, 1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <MeshTransmissionMaterial
        ref={materialRef}
        transmission={0.7}
        roughness={0}
        thickness={0}
        chromaticAberration={0.06}
        anisotropy={0}
        ior={ior}
        background={null} // Set background to null for transparency
        transparent={true} // Enable transparency
      />
    </mesh>
  )
})
PostProcessing.displayName = 'PostProcessing'
