import React from 'react'
import { cn } from '@/utilities/ui'
import { WebGLCarousel, type CarouselImage } from '@/components/webgl-carousel'
import type { WebGLCarouselBlock as WebGLCarouselBlockProps } from '@/payload-types'

export const WebGLCarouselBlock: React.FC<WebGLCarouselBlockProps> = ({
  images,
  settings,
  appearance,
}) => {
  // Transform Payload media to carousel images
  const carouselImages: CarouselImage[] = images?.map((item) => {
    const media = typeof item.image === 'object' ? item.image : null
    const imageUrl = media?.url || ''
    
    return {
      src: imageUrl,
      alt: media?.alt || item.title || 'Carousel image',
      title: item.title || undefined,
      description: item.description || undefined,
    }
  }) || []

  // Build class names based on appearance settings
  const getHeightClass = () => {
    switch (appearance?.height) {
      case 'small':
        return 'h-[400px]'
      case 'large':
        return 'h-[800px]'
      case 'fullscreen':
        return 'webgl-carousel--fullscreen'
      case 'viewport':
        return 'h-screen'
      default:
        return 'h-[600px]'
    }
  }

  const getVariantClass = () => {
    switch (appearance?.variant) {
      case 'contained':
        return 'webgl-carousel--contained'
      case 'rounded':
        return 'webgl-carousel--rounded'
      case 'gradient':
        return 'webgl-carousel--with-gradient'
      default:
        return ''
    }
  }

  const className = cn(
    'webgl-carousel-block',
    getHeightClass(),
    getVariantClass(),
    'my-8'
  )

  // Don't render if no images
  if (!carouselImages.length) {
    return (
      <div className="webgl-carousel-block webgl-carousel-block--empty">
        <p className="text-center text-gray-500 py-8">
          No images added to carousel
        </p>
      </div>
    )
  }

  return (
    <section className="webgl-carousel-block-wrapper relative w-full">
      <WebGLCarousel
        images={carouselImages}
        className={className}
        autoPlay={settings?.autoPlay || false}
        autoPlayInterval={settings?.autoPlayInterval || 3000}
        speed={settings?.speed || 0.02}
        gap={settings?.gap || 0.1}
        width={settings?.planeWidth || 1}
        height={settings?.planeHeight || 2.5}
      />
    </section>
  )
}