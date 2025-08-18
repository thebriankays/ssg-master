import { WebGLCarousel } from './index'

// Example usage of the WebGL Carousel component

const exampleImages = [
  {
    src: '/images/landscape-1.jpg',
    alt: 'Beautiful mountain landscape',
    title: 'Mountain Vista',
    description: 'Stunning views of the alpine peaks at sunrise'
  },
  {
    src: '/images/city-1.jpg',
    alt: 'Modern city skyline',
    title: 'Urban Dreams',
    description: 'The pulse of metropolitan life captured at twilight'
  },
  {
    src: '/images/ocean-1.jpg',
    alt: 'Peaceful ocean waves',
    title: 'Ocean Serenity',
    description: 'Where the sky meets the endless blue horizon'
  },
  {
    src: '/images/forest-1.jpg',
    alt: 'Dense forest path',
    title: 'Forest Trail',
    description: 'Journey through ancient woodlands and discover nature\'s secrets'
  }
]

export function WebGLCarouselExample() {
  return (
    <div className="my-carousel-container">
      {/* Basic usage */}
      <WebGLCarousel 
        images={exampleImages}
        className="h-[600px]"
      />

      {/* With auto-play */}
      <WebGLCarousel 
        images={exampleImages}
        className="h-[700px]"
        autoPlay
        autoPlayInterval={4000}
      />

      {/* Fullscreen hero */}
      <WebGLCarousel 
        images={exampleImages}
        className="webgl-carousel--fullscreen"
        speed={0.03}
        gap={0.15}
      />

      {/* Custom dimensions */}
      <WebGLCarousel 
        images={exampleImages}
        className="h-[500px] webgl-carousel--contained webgl-carousel--rounded"
        width={1.2}
        height={2}
        gap={0.2}
      />
    </div>
  )
}