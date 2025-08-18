'use client'

import { View } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Heading } from '@/components/typography'

function TestCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta * 0.5
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  )
}

export default function CanvasTestPage() {
  const viewRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen p-8">
      <Heading level={1} className="mb-8">
        Canvas Test Page
      </Heading>
      
      <p className="mb-4">If the canvas is properly set up, you should see a rotating cube below:</p>
      
      <div 
        ref={viewRef} 
        className="w-full h-96 bg-gray-100 rounded-lg"
      >
        <View track={viewRef as any}>
          <ambientLight intensity={0.5} />
          <TestCube />
        </View>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="font-bold mb-2">Canvas Check:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Open browser DevTools</li>
          <li>Look for a canvas element with class "shared-canvas"</li>
          <li>Check if it has position: fixed and covers the viewport</li>
          <li>If you see a colorful cube above, the canvas is working!</li>
        </ul>
      </div>
    </div>
  )
}