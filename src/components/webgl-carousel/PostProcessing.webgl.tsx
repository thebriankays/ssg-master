'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface PostProcessingProps {
  ior?: number
  backgroundColor?: string
}

export const PostProcessing = forwardRef<any, PostProcessingProps>((props, ref) => {
  const { ior = 0.9, backgroundColor = 'white' } = props
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
    }
  }))

  return (
    <mesh position={[0, 0, 1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <MeshTransmissionMaterial
        ref={materialRef}
        background={new THREE.Color(backgroundColor)}
        transmission={0.7}
        roughness={0}
        thickness={0}
        chromaticAberration={0.06}
        anisotropy={0}
        ior={ior}
      />
    </mesh>
  )
})

PostProcessing.displayName = 'PostProcessing'
