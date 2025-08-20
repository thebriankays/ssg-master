'use client'

import { useState, useRef } from 'react'
import { useRect } from '@/hooks/use-rect'
import dynamic from 'next/dynamic'
import { WebGLTunnel } from '@/webgl/components/tunnel'
import './webgl-carousel.scss'

const WebGLCarouselContent = dynamic(
  () => import('./WebGLCarouselContent.webgl').then(({ WebGLCarouselContent }) => WebGLCarouselContent),
  { ssr: false }
)

export interface CarouselImage {
  image: string
  title?: string
  description?: string
}

interface WebGLCarouselProps {
  images?: Array<{
    src: string
    alt?: string
    title?: string
    description?: string
  }>
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

export function WebGLCarousel({
  images,
  speed = 0.02,
  gap = 0.1,
  width = 1,
  height = 2.5,
  autoPlay = false,
  autoPlayInterval = 3000
}: WebGLCarouselProps) {
  const [activePlane, setActivePlane] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [setRectRef, rect] = useRect()
  const dragRef = useRef({ isDown: false, startX: 0, startProgress: 0 })

  // Transform input images to carousel format
  const carouselImages = images?.map(img => ({
    image: img.src,
    title: img.title,
    description: img.description
  })) || defaultImages

  // Handle wheel at DOM level
  const handleWheel = (e: React.WheelEvent) => {
    if (activePlane !== null) return
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    setProgress(prev => Math.max(0, Math.min(prev + wheelProgress * speed, 100)))
  }

  // Handle drag at DOM level
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activePlane !== null) return
    dragRef.current.isDown = true
    dragRef.current.startX = e.clientX
    dragRef.current.startProgress = progress
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDown || activePlane !== null) return
    const deltaX = e.clientX - dragRef.current.startX
    const newProgress = dragRef.current.startProgress + deltaX * -0.3
    setProgress(Math.max(0, Math.min(newProgress, 100)))
  }

  const handleMouseUp = () => {
    dragRef.current.isDown = false
  }

  const handleClick = (e: React.MouseEvent) => {
    const deltaX = Math.abs(dragRef.current.startX - e.clientX)
    if (deltaX > 5) return

    if (activePlane !== null) {
      setActivePlane(null)
      return
    }

    const activeIndex = Math.round((progress / 100) * (carouselImages.length - 1))
    setActivePlane(activeIndex)
  }

  return (
    <div 
      ref={setRectRef}
      className="webgl-carousel-container"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      <div 
        className="webgl-carousel-images"
        data-cursor="-drag" 
        data-cursor-text="DRAG"
      />
      <WebGLTunnel>
        <WebGLCarouselContent
          rect={rect}
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
      </WebGLTunnel>
    </div>
  )
}
