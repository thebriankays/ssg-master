import React from 'react'
import { WebGLCarousel } from '@/components/webgl-carousel'
import type { WebGLCarouselBlock as WebGLCarouselBlockType } from '@/payload-types'

export const WebGLCarouselBlock: React.FC<WebGLCarouselBlockType> = ({ 
  images, 
  settings 
}) => {
  // Transform Payload media format to component format
  const carouselImages = images?.map(item => ({
    src: typeof item.image === 'object' && item.image?.url ? item.image.url : '',
    alt: typeof item.image === 'object' && item.image?.alt ? item.image.alt : '',
    title: item.title || undefined,
    description: item.description || undefined,
  })).filter(img => img.src) || []

  if (carouselImages.length === 0) {
    return (
      <div className="webgl-carousel-block webgl-carousel-block--empty">
        <p>No images available for carousel</p>
      </div>
    )
  }

  return (
    <div className="webgl-carousel-block">
      <WebGLCarousel
        images={carouselImages}
        speed={settings?.speed || 0.02}
        gap={settings?.gap || 0.1}
        width={settings?.planeWidth || 10}
        height={settings?.planeHeight || 15}
        autoPlay={settings?.autoPlay || false}
        autoPlayInterval={settings?.autoPlayInterval || 3000}
      />
    </div>
  )
}
