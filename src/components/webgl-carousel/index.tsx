'use client'

import dynamic from 'next/dynamic'
import { WebGLMount } from '@/components/webgl/WebGLMount'
import './webgl-carousel.scss'
import { useRef, useState, useCallback } from 'react'

export interface CarouselImage {
  image: string
  title?: string
  description?: string
}

interface WebGLCarouselProps {
  images?: Array<{ src: string; alt?: string; title?: string; description?: string }>
  speed?: number
  gap?: number
  width?: number
  height?: number
  autoPlay?: boolean
  autoPlayInterval?: number
}

const defaultImages: CarouselImage[] = [
  { image: 'https://picsum.photos/800/1200?random=1', title: 'Image 1' },
  { image: 'https://picsum.photos/800/1200?random=2', title: 'Image 2' },
  { image: 'https://picsum.photos/800/1200?random=3', title: 'Image 3' },
  { image: 'https://picsum.photos/800/1200?random=4', title: 'Image 4' },
  { image: 'https://picsum.photos/800/1200?random=5', title: 'Image 5' },
  { image: 'https://picsum.photos/800/1200?random=6', title: 'Image 6' },
  { image: 'https://picsum.photos/800/1200?random=7', title: 'Image 7' },
]

const WebGLCarouselContent = dynamic(
  () =>
    import('./WebGLCarouselContent.webgl').then(({ WebGLCarouselContent }) => WebGLCarouselContent),
  { ssr: false },
)

export function WebGLCarousel({
  images,
  speed = 0.02,
  gap = 0.1,
  width = 1,
  height = 2.5,
  autoPlay = false,
  autoPlayInterval = 3000,
}: WebGLCarouselProps) {
  const [activePlane, setActivePlane] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startProgress = useRef(0)

  const carouselImages =
    images?.map((img) => ({ image: img.src, title: img.title, description: img.description })) ||
    defaultImages

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * 0.05
      setProgress((prev) => Math.max(0, Math.min(100, prev + delta)))
    },
    []
  )

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      isDragging.current = true
      startX.current = e.clientX
      startProgress.current = progress
      // Don't reset active plane on pointer down
    },
    [progress]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging.current) return
      const deltaX = (e.clientX - startX.current) / window.innerWidth
      const newProgress = startProgress.current - deltaX * 50
      setProgress(Math.max(0, Math.min(100, newProgress)))
    },
    []
  )

  const handlePointerUp = useCallback((e: PointerEvent) => {
    // Check if it was a click (no drag)
    if (Math.abs(e.clientX - startX.current) < 5) {
      if (activePlane !== null) {
        // If a plane is active, close it
        setActivePlane(null)
      } else {
        // Otherwise, activate the center plane
        const totalPlanes = carouselImages.length
        const clickedIndex = Math.round((progress / 100) * (totalPlanes - 1))
        setActivePlane(clickedIndex)
      }
    }
    isDragging.current = false
  }, [progress, carouselImages.length, activePlane])

  return (
    <WebGLMount
      className="webgl-carousel"
      style={{ width: '100vw', height: '100vh' }}
      interactive="dom"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      scaleMultiplier={1}
      data-cursor={activePlane === null ? '-drag' : ''}
      data-cursor-text={activePlane === null ? 'DRAG' : ''}
    >
      <WebGLCarouselContent
        images={carouselImages}
        speed={speed}
        gap={gap}
        planeWidth={width}
        planeHeight={height}
        activePlane={activePlane}
        setActivePlane={setActivePlane}
        progress={progress}
        setProgress={setProgress}
      />
    </WebGLMount>
  )
}
