'use client'

import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
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

  // Transform input images to carousel format
  const carouselImages = images?.map(img => ({
    image: img.src,
    title: img.title,
    description: img.description
  })) || defaultImages

  return (
    <div className="webgl-carousel" data-cursor="-drag" data-cursor-text="DRAG">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 30 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          preserveDrawingBuffer: true,
          premultipliedAlpha: false
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Suspense fallback={null}>
          <WebGLCarouselContent
            images={carouselImages}
            speed={speed}
            gap={gap}
            planeWidth={width}
            planeHeight={height}
            activePlane={activePlane}
            setActivePlane={setActivePlane}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
