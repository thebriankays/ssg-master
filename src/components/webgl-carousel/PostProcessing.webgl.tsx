'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface PostProcessingProps {
  active?: boolean
  ior?: number
}

export const PostProcessing = forwardRef<{ thickness: number }, PostProcessingProps>(
  ({ active = true, ior = 0.9 }, ref) => {
    const { viewport } = useThree()
    const materialRef = useRef<any>(null)

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

    if (!active) return null

    return (
      <mesh position={[0, 0, 1]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <MeshTransmissionMaterial
          ref={materialRef}
          background={new THREE.Color('white')}
          transmission={0.7}
          roughness={0}
          thickness={0}
          chromaticAberration={0.06}
          anisotropy={0}
          ior={ior}
        />
      </mesh>
    )
  }
)