'use client'

import { useWebGLView } from '@/providers/shared-canvas-provider'
import { cn } from '@/utilities/ui'
import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect } from 'react'
import './webgl-carousel.scss'

const WebGLCarouselScene = dynamic(
  () => import('./WebGLCarousel.webgl').then(mod => mod.WebGLCarouselScene),
  { ssr: false }
)

export interface CarouselImage {
  src: string
  alt?: string
  title?: string
  description?: string
}

interface WebGLCarouselProps {
  images: CarouselImage[]
  className?: string
  speed?: number
  gap?: number
  width?: number
  height?: number
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function WebGLCarousel({ 
  images, 
  className,
  speed = 0.02,
  gap = 0.1,
  width = 1,
  height = 2.5,
  autoPlay = false,
  autoPlayInterval = 3000
}: WebGLCarouselProps) {
  const viewRef = useWebGLView()
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    if (autoPlay && activeIndex === null) {
      const interval = setInterval(() => {
        // Auto-play logic will be handled in WebGL component
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayInterval, activeIndex])

  return (
    <div 
      ref={viewRef} 
      className={cn('webgl-carousel', className)}
    >
      <Suspense 
        fallback={
          <div className="webgl-carousel__loader">
            <div className="webgl-carousel__loader-spinner" />
            <span className="webgl-carousel__loader-text">Loading carousel...</span>
          </div>
        }
      >
        <WebGLCarouselScene 
          viewRef={viewRef} 
          images={images}
          speed={speed}
          gap={gap}
          planeWidth={width}
          planeHeight={height}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onLoad={() => setIsLoading(false)}
        />
      </Suspense>

      {/* Info overlay */}
      {!isLoading && activeIndex !== null && images[activeIndex] && (
        <div className="webgl-carousel__info">
          {images[activeIndex].title && (
            <h3 className="webgl-carousel__title">{images[activeIndex].title}</h3>
          )}
          {images[activeIndex].description && (
            <p className="webgl-carousel__description">{images[activeIndex].description}</p>
          )}
        </div>
      )}

      {/* Navigation dots */}
      {!isLoading && images.length > 1 && (
        <div className="webgl-carousel__dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn('webgl-carousel__dot', {
                'webgl-carousel__dot--active': activeIndex === index
              })}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}