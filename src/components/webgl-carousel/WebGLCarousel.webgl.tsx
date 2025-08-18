'use client'

import { View } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useGSAP } from '@/hooks/use-gsap'
import { CarouselItem } from './CarouselItem.webgl'
import { PostProcessing } from './PostProcessing.webgl'
import { lerp, getPiramidalIndex } from './utils'
import type { CarouselImage } from './index'

interface WebGLCarouselSceneProps {
  viewRef: React.RefObject<HTMLElement>
  images: CarouselImage[]
  speed: number
  gap: number
  planeWidth: number
  planeHeight: number
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
  onLoad?: () => void
}

export function WebGLCarouselScene({ 
  viewRef, 
  images,
  speed,
  gap,
  planeWidth,
  planeHeight,
  activeIndex,
  setActiveIndex,
  onLoad
}: WebGLCarouselSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const postRef = useRef<any>(null)
  const progressRef = useRef(0)
  const startXRef = useRef(0)
  const isDownRef = useRef(false)
  const speedRef = useRef(0)
  const oldProgressRef = useRef(0)
  const { viewport } = useThree()
  
  const [prevActiveIndex, setPrevActiveIndex] = useState<number | null>(null)

  // Track loading
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const planeSettings = useMemo(() => ({
    width: planeWidth,
    height: planeHeight,
    gap: gap
  }), [planeWidth, planeHeight, gap])

  const speedWheel = speed
  const speedDrag = -0.3

  // Set GSAP defaults
  useEffect(() => {
    gsap.defaults({
      duration: 2.5,
      ease: 'power3.out'
    })
  }, [])

  // Handle image loaded
  const handleImageLoaded = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]))
  }

  // Call onLoad when all images are loaded
  useEffect(() => {
    if (loadedImages.size === images.length && onLoad) {
      onLoad()
    }
  }, [loadedImages.size, images.length, onLoad])

  // Store current animation state
  const activeIndexRef = useRef(0)
  
  // Display items with pyramidal positioning
  const displayItems = (item: THREE.Object3D, index: number, active: number) => {
    if (!groupRef.current) return
    
    const items = groupRef.current.children.filter(child => child.name.startsWith('carousel-item-'))
    const piramidalIndex = getPiramidalIndex(items, active)[index]
    
    gsap.to(item.position, {
      x: (index - active) * (planeSettings.width + planeSettings.gap),
      y: items.length * -0.1 + piramidalIndex * 0.1,
      duration: 2.5,
      ease: 'power3.out'
    })
  }

  // Animation frame
  useFrame(() => {
    if (!groupRef.current) return

    progressRef.current = Math.max(0, Math.min(progressRef.current, 100))
    
    const items = groupRef.current.children.filter(child => child.name.startsWith('carousel-item-'))
    const active = Math.floor((progressRef.current / 100) * (items.length - 1))
    
    items.forEach((item, index) => displayItems(item, index, active))
    
    speedRef.current = lerp(
      speedRef.current,
      Math.abs(oldProgressRef.current - progressRef.current),
      0.1
    )

    oldProgressRef.current = lerp(oldProgressRef.current, progressRef.current, 0.1)

    if (postRef.current) {
      postRef.current.thickness = speedRef.current
    }
  })

  // Handle wheel
  const handleWheel = (e: WheelEvent) => {
    if (activeIndex !== null) return
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    progressRef.current = progressRef.current + wheelProgress * speedWheel
  }

  // Handle pointer down
  const handlePointerDown = (e: THREE.Event) => {
    if (activeIndex !== null) return
    isDownRef.current = true
    // @ts-ignore - accessing pointer event
    const event = e.nativeEvent || e
    startXRef.current = event.clientX || (event.touches && event.touches[0].clientX) || 0
  }

  // Handle pointer up
  const handlePointerUp = () => {
    isDownRef.current = false
  }

  // Handle pointer move
  const handlePointerMove = (e: THREE.Event) => {
    if (activeIndex !== null || !isDownRef.current) return
    // @ts-ignore - accessing pointer event
    const event = e.nativeEvent || e
    const x = event.clientX || (event.touches && event.touches[0].clientX) || 0
    const mouseProgress = (x - startXRef.current) * speedDrag
    progressRef.current = progressRef.current + mouseProgress
    startXRef.current = x
  }

  // Update progress when activeIndex changes
  useEffect(() => {
    if (!groupRef.current) return
    
    const items = groupRef.current.children.filter(child => child.name.startsWith('carousel-item-'))
    
    if (activeIndex !== null && prevActiveIndex === null) {
      progressRef.current = (activeIndex / (items.length - 1)) * 100
    }
    
    setPrevActiveIndex(activeIndex)
  }, [activeIndex, prevActiveIndex])

  // Add wheel event listener to the DOM element
  useEffect(() => {
    const element = viewRef.current
    if (!element) return

    element.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      element.removeEventListener('wheel', handleWheel)
    }
  }, [viewRef, activeIndex])

  return (
    <View track={viewRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* Event plane */}
      <mesh
        position={[0, 0, -0.01]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Carousel items */}
      <group ref={groupRef}>
        {images.map((image, index) => (
          <CarouselItem
            key={`${image.src}-${index}`}
            name={`carousel-item-${index}`}
            index={index}
            image={image}
            width={planeSettings.width}
            height={planeSettings.height}
            setActiveIndex={setActiveIndex}
            activeIndex={activeIndex}
            onLoaded={() => handleImageLoaded(index)}
          />
        ))}
      </group>

      {/* Post-processing */}
      <PostProcessing ref={postRef} />
    </View>
  )
}