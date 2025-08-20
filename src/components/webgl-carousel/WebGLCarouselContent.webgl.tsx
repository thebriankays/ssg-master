'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { usePrevious } from '@/hooks/use-previous'
import gsap from 'gsap'
import * as THREE from 'three'
import { CarouselItem } from './CarouselItem.webgl'
import { PostProcessing } from './PostProcessing.webgl'
import { lerp, getPiramidalIndex } from './utils'
import type { CarouselImage } from './index'

interface WebGLCarouselContentProps {
  images: CarouselImage[]
  speed: number
  gap: number
  planeWidth: number
  planeHeight: number
  activePlane: number | null
  setActivePlane: (index: number | null) => void
}

// Set GSAP defaults
gsap.defaults({
  duration: 2.5,
  ease: 'power3.out'
})

export function WebGLCarouselContent({
  images,
  speed: speedProp,
  gap,
  planeWidth,
  planeHeight,
  activePlane,
  setActivePlane
}: WebGLCarouselContentProps) {
  const [root, setRoot] = useState<THREE.Group | null>(null)
  const postRef = useRef<any>(null)
  const prevActivePlane = usePrevious(activePlane)
  const { viewport } = useThree()
  
  // Internal state
  const progressRef = useRef(0)
  const startX = useRef(0)
  const isDown = useRef(false)
  const speedWheel = 0.02
  const speedDrag = -0.3
  const oldProgressRef = useRef(0)
  const speedRef = useRef(0)

  // Get items from root group
  const $items = useMemo(() => {
    if (root) return root.children
    return []
  }, [root])

  // Display items with pyramidal index
  const displayItems = (item: any, index: number, active: number) => {
    const piramidalIndex = getPiramidalIndex($items, active)[index]
    gsap.to(item.position, {
      x: (index - active) * (planeWidth + gap),
      y: $items.length * -0.1 + piramidalIndex * 0.1
    })
  }

  // RAF update
  useFrame(() => {
    if (!$items.length) return
    
    progressRef.current = Math.max(0, Math.min(progressRef.current, 100))
    
    const active = Math.floor((progressRef.current / 100) * ($items.length - 1))
    $items.forEach((item, index) => displayItems(item, index, active))
    
    speedRef.current = lerp(
      speedRef.current,
      Math.abs(oldProgressRef.current - progressRef.current),
      0.1
    )

    oldProgressRef.current = lerp(oldProgressRef.current, progressRef.current, 0.1)

    if (postRef.current && postRef.current.thickness !== undefined) {
      postRef.current.thickness = speedRef.current
    }
  })

  // Event handlers
  const handleWheel = (e: any) => {
    if (activePlane !== null) return
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    progressRef.current = progressRef.current + wheelProgress * speedWheel
  }

  const handleDown = (e: any) => {
    if (activePlane !== null) return
    isDown.current = true
    startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0
  }

  const handleUp = () => {
    isDown.current = false
  }

  const handleMove = (e: any) => {
    if (activePlane !== null || !isDown.current) return
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
    const mouseProgress = (x - startX.current) * speedDrag
    progressRef.current = progressRef.current + mouseProgress
    startX.current = x
  }

  // Click effect - sync progress when plane is clicked
  useEffect(() => {
    if (!$items.length) return
    if (activePlane !== null && prevActivePlane === null) {
      progressRef.current = (activePlane / ($items.length - 1)) * 100
    }
  }, [activePlane, $items, prevActivePlane])

  // Render plane events
  const renderPlaneEvents = () => {
    return (
      <mesh
        position={[0, 0, -0.01]}
        onWheel={handleWheel}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerMove={handleMove}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>
    )
  }

  // Render slider
  const renderSlider = () => {
    return (
      <group ref={setRoot}>
        {images.map((item, i) => (
          <CarouselItem
            width={planeWidth}
            height={planeHeight}
            setActivePlane={setActivePlane}
            activePlane={activePlane}
            key={item.image}
            item={item}
            index={i}
          />
        ))}
      </group>
    )
  }

  return (
    <group>
      {renderPlaneEvents()}
      {renderSlider()}
      <PostProcessing ref={postRef} />
    </group>
  )
}
