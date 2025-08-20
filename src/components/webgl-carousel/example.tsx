'use client'

import { WebGLCarousel } from './index'

// Example images for demonstration
const exampleImages = [
  {
    src: '/images/carousel/image-1.jpg',
    alt: 'First slide',
    title: 'Welcome to Our Gallery',
    description: 'Experience immersive 3D carousel animations'
  },
  {
    src: '/images/carousel/image-2.jpg',
    alt: 'Second slide',
    title: 'Beautiful Landscapes',
    description: 'Explore stunning natural vistas from around the world'
  },
  {
    src: '/images/carousel/image-3.jpg',
    alt: 'Third slide',
    title: 'Urban Architecture',
    description: 'Modern cityscapes and architectural marvels'
  },
  {
    src: '/images/carousel/image-4.jpg',
    alt: 'Fourth slide',
    title: 'Abstract Art',
    description: 'Contemporary digital art and creative expressions'
  },
  {
    src: '/images/carousel/image-5.jpg',
    alt: 'Fifth slide',
    title: 'Nature Photography',
    description: 'Capturing the beauty of the natural world'
  }
]

export function WebGLCarouselExample() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WebGLCarousel
        images={exampleImages}
        speed={0.02}
        gap={0.1}
        width={1}
        height={2.5}
        autoPlay={true}
        autoPlayInterval={4000}
        showDots={true}
        showInfo={true}
      />
    </div>
  )
}
