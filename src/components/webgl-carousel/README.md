# WebGL Carousel Component

A high-performance WebGL carousel component that replicates the codrops carousel effect using React Three Fiber and GSAP. Features smooth scrolling, interactive navigation, and beautiful transitions.

## Features

- 🎨 WebGL-powered smooth animations
- 🖱️ Mouse/touch drag support
- ⚡ Wheel scroll navigation
- 📱 Mobile-responsive
- 🎭 Post-processing effects
- 🔄 Auto-play support
- 🎯 Pyramidal stacking effect
- ⚡ Optimized for performance

## Usage

```tsx
import { WebGLCarousel } from '@/components/webgl-carousel'

const images = [
  {
    src: '/images/slide1.jpg',
    alt: 'Slide 1',
    title: 'Beautiful Landscape',
    description: 'A stunning view of nature'
  },
  {
    src: '/images/slide2.jpg',
    alt: 'Slide 2',
    title: 'Urban Architecture',
    description: 'Modern city design'
  }
]

export function MyComponent() {
  return (
    <WebGLCarousel 
      images={images}
      className="my-carousel"
      autoPlay
      autoPlayInterval={5000}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `CarouselImage[]` | required | Array of images with metadata |
| `className` | `string` | - | Additional CSS classes |
| `speed` | `number` | `0.02` | Scroll/wheel speed multiplier |
| `gap` | `number` | `0.1` | Gap between slides |
| `width` | `number` | `1` | Width of each slide plane |
| `height` | `number` | `2.5` | Height of each slide plane |
| `autoPlay` | `boolean` | `false` | Enable auto-play |
| `autoPlayInterval` | `number` | `3000` | Auto-play interval in ms |

## CarouselImage Type

```typescript
interface CarouselImage {
  src: string
  alt?: string
  title?: string
  description?: string
}
```

## Styling

The component uses SCSS with BEM naming convention. You can customize the appearance by:

1. Using CSS classes:
```scss
.my-carousel {
  height: 80vh;
  border-radius: 1rem;
}
```

2. Using built-in modifiers:
```tsx
<WebGLCarousel 
  className="webgl-carousel--fullscreen webgl-carousel--with-gradient"
  images={images}
/>
```

## Performance Considerations

- Images are lazy-loaded as textures
- Shared WebGL context via drei's View component
- Automatic cleanup on unmount
- Optimized shader calculations
- GPU-accelerated animations

## Examples

### Basic Carousel
```tsx
<WebGLCarousel images={images} />
```

### Fullscreen Hero
```tsx
<WebGLCarousel 
  images={heroImages}
  className="webgl-carousel--fullscreen"
  autoPlay
  autoPlayInterval={6000}
/>
```

### Product Showcase
```tsx
<WebGLCarousel 
  images={productImages}
  className="webgl-carousel--contained webgl-carousel--rounded"
  width={1.5}
  height={2}
  gap={0.2}
/>
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with WebGL support

## Dependencies

- React Three Fiber
- Three.js
- GSAP
- @react-three/drei