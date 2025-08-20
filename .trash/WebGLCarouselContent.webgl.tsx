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
import { useWebGLRect } from '@/hooks/use-webgl-rect'
import type { Rect } from 'hamo'

interface WebGLCarouselContentProps {
  rect?: Rect | null
  images: CarouselImage[]
  speed: number
  gap: number
  planeWidth: number
  planeHeight: number
  activePlane: number | null
  setActivePlane: (index: number | null) => void
  progress: number
  setProgress: (progress: number) => void
}

// Set GSAP defaults
gsap.defaults({
  duration: 2.5,
  ease: 'power3.out'
})

export function WebGLCarouselContent({
  rect,
  images,
  speed: speedProp,
  gap,
  planeWidth,
  planeHeight,
  activePlane,
  setActivePlane,
  progress,
  setProgress
}: WebGLCarouselContentProps) {
  const [root, setRoot] = useState<THREE.Group | null>(null)
  const postRef = useRef<any>(null)
  const prevActivePlane = usePrevious(activePlane)
  const carouselRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  
  // Internal state
  const progressRef = useRef(progress)
  const oldProgressRef = useRef(0)
  const speedRef = useRef(0)

  // Update progress ref when prop changes
  useEffect(() => {
    progressRef.current = progress
  }, [progress])

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

  // Position carousel based on DOM rect
  useWebGLRect(rect, ({ scale, position }) => {
    if (carouselRef.current && rect) {
      carouselRef.current.position.set(position.x, position.y, position.z)
      const carouselScale = Math.min(scale.x, scale.y) * 0.15
      carouselRef.current.scale.set(carouselScale, carouselScale, carouselScale)
      carouselRef.current.updateMatrix()
    }
  })

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

  // Click effect - sync progress when plane is clicked
  useEffect(() => {
    if (!$items.length) return
    if (activePlane !== null && prevActivePlane === null) {
      progressRef.current = (activePlane / ($items.length - 1)) * 100
    }
  }, [activePlane, $items, prevActivePlane])

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
    <group ref={carouselRef} matrixAutoUpdate={false}>
      {renderSlider()}
      <PostProcessing ref={postRef} />
    </group>
  )
}
