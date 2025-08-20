'use client'

import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'

interface PostProcessingProps {}

export const PostProcessing = forwardRef<any, PostProcessingProps>((props, ref) => {
  const materialRef = useRef<any>(null)
  const meshRef = useRef<any>(null)
  const { viewport } = useThree()
  
  // Expose thickness control to parent
  useImperativeHandle(ref, () => ({
    set thickness(value: number) {
      if (materialRef.current) {
        materialRef.current.thickness = value
      }
    },
    get thickness() {
      return materialRef.current?.thickness || 0
    }
  }))

  // Animate IOR for subtle effect
  let ior = 1.0
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    ior = 1.0 + Math.sin(time * 0.5) * 0.05
    if (materialRef.current) {
      materialRef.current.ior = ior
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <MeshTransmissionMaterial
        ref={materialRef}
        transmission={0.7}
        roughness={0}
        thickness={0}
        chromaticAberration={0.06}
        anisotropy={0}
        ior={ior}
        background={null}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  )
})

PostProcessing.displayName = 'PostProcessing'
