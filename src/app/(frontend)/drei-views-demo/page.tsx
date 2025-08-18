'use client'

import { Canvas } from '@react-three/fiber'
import { View, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Rotating cube component
function RotatingCube({ color = '#ff0066' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5
    meshRef.current.rotation.y += delta * 0.5
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Floating sphere component
function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
  })
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshNormalMaterial />
    </mesh>
  )
}

// Torus knot component
function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.3
    meshRef.current.rotation.y += delta * 0.4
  })
  
  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshPhongMaterial color="#00ff88" />
    </mesh>
  )
}

export default function DreiViewsDemoPage() {
  const ref1 = useRef<HTMLDivElement>(null!)
  const ref2 = useRef<HTMLDivElement>(null!)
  const ref3 = useRef<HTMLDivElement>(null!)
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-16 px-8">
        <h1 className="text-4xl font-bold mb-8">Drei Views Demo</h1>
        <p className="text-lg mb-12">
          This demo shows how to use drei's View component to render multiple 3D scenes 
          that are positioned and sized according to DOM elements.
        </p>
        
        {/* DOM Elements that will contain the 3D views */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div 
            ref={ref1}
            className="bg-white rounded-lg shadow-lg p-8 aspect-square flex items-center justify-center"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Rotating Cube</h3>
              <p className="text-gray-600">Standard material with color</p>
            </div>
          </div>
          
          <div 
            ref={ref2}
            className="bg-white rounded-lg shadow-lg p-8 aspect-square flex items-center justify-center"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Floating Sphere</h3>
              <p className="text-gray-600">Normal material</p>
            </div>
          </div>
          
          <div 
            ref={ref3}
            className="bg-white rounded-lg shadow-lg p-8 aspect-square flex items-center justify-center"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Torus Knot</h3>
              <p className="text-gray-600">Phong material</p>
            </div>
          </div>
        </div>
        
        {/* Single Canvas that renders all views */}
        <div className="fixed inset-0 pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 5] }}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            
            {/* View 1: Rotating Cube */}
            <View track={ref1}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <RotatingCube color="#ff0066" />
            </View>
            
            {/* View 2: Floating Sphere */}
            <View track={ref2}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <FloatingSphere />
            </View>
            
            {/* View 3: Torus Knot */}
            <View track={ref3}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <TorusKnot />
            </View>
          </Canvas>
        </div>
        
        {/* Additional content */}
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-4">How it works</h2>
          <p className="mb-4">
            The drei View component allows you to render 3D content that tracks DOM elements. 
            Each View has its own camera and renders only the portion of the canvas that 
            corresponds to its tracked DOM element's position and size.
          </p>
          <p className="mb-4">
            This is perfect for:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Creating 3D UI elements that integrate with your layout</li>
            <li>Building product showcases with multiple 3D views</li>
            <li>Mixing 2D and 3D content seamlessly</li>
            <li>Creating responsive 3D components that adapt to layout changes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}