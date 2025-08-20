'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { WebGLView } from '@/components/WebGLView'
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

  // Transform input images to carousel format
  const carouselImages = images?.map(img => ({
    image: img.src,
    title: img.title,
    description: img.description
  })) || defaultImages

  return (
    <WebGLView
      className="webgl-carousel"
      style={{ width: '100vw', height: '100vh' }}
      data-cursor={activePlane === null ? "-drag" : ""}
      data-cursor-text={activePlane === null ? "DRAG" : ""}
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
    </WebGLView>
  )
}
