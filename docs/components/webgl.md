# WebGL Components

High-performance graphics components leveraging WebGL through a shared canvas architecture using React Three Fiber and drei's View component. All WebGL components share a single canvas for optimal performance and resource management.

## Shared Canvas Architecture

All WebGL components in this system utilize a shared canvas approach powered by drei's View component. This architecture provides:

- **Single WebGL Context**: One canvas serves all WebGL components, reducing memory overhead
- **Automatic Bounds Management**: Each component respects its container's bounds via drei's View
- **Optimal Performance**: Shared resources and single render loop
- **Easy Integration**: Components work seamlessly with regular React components

### How It Works

1. The `SharedCanvasProvider` creates a single Three.js canvas that covers the viewport
2. Each WebGL component uses the `useWebGLView` hook to create a View portal
3. The View component automatically manages camera, viewport, and scissor settings
4. Components render their 3D content within their DOM container bounds

### Usage

Wrap your app with the SharedCanvasProvider:

```tsx
import { SharedCanvasProvider } from '@/providers/SharedCanvasProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SharedCanvasProvider>
          {children}
        </SharedCanvasProvider>
      </body>
    </html>
  )
}
```

## AnimatedGradient Component

Creates dynamic, animated gradients using WebGL shaders for mesmerizing background effects.

### Import

```tsx
import { AnimatedGradient } from '@/components/animated-gradient'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `string[]` | `['#667eea', '#764ba2', '#f093fb']` | Array of color values |
| `speed` | `number` | `0.5` | Animation speed multiplier |
| `scale` | `number` | `1` | Gradient scale factor |
| `angle` | `number` | `0` | Initial rotation angle (degrees) |
| `blendMode` | `'normal' \| 'multiply' \| 'screen' \| 'overlay'` | `'normal'` | Blend mode |
| `opacity` | `number` | `1` | Overall opacity (0-1) |
| `animate` | `boolean` | `true` | Enable/disable animation |
| `className` | `string` | - | Additional CSS classes |
| `quality` | `'low' \| 'medium' \| 'high'` | `'medium'` | Render quality |
| `onLoad` | `() => void` | - | Callback when WebGL initializes |

### Usage Examples

#### Basic Animated Background
```tsx
<AnimatedGradient 
  colors={['#6366f1', '#8b5cf6', '#ec4899']}
  speed={0.3}
  className="fixed inset-0 -z-10"
/>
```

#### Hero Section Background
```tsx
<div className="relative min-h-screen">
  <AnimatedGradient 
    colors={['#0f172a', '#1e293b', '#334155']}
    speed={0.2}
    scale={1.5}
    opacity={0.8}
    className="absolute inset-0"
  />
  <div className="relative z-10 flex items-center justify-center h-screen">
    <h1 className="text-6xl font-bold text-white">
      Welcome to the Future
    </h1>
  </div>
</div>
```

#### Card Background Effect
```tsx
<div className="relative p-8 rounded-xl overflow-hidden">
  <AnimatedGradient 
    colors={['#fbbf24', '#f59e0b', '#f97316']}
    speed={0.8}
    scale={0.5}
    quality="high"
    className="absolute inset-0"
  />
  <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-lg">
    <h3>Premium Feature</h3>
    <p>Experience next-level performance</p>
  </div>
</div>
```

#### Interactive Color Transition
```tsx
const [colors, setColors] = useState(['#3b82f6', '#2563eb', '#1d4ed8'])
const [speed, setSpeed] = useState(0.5)

<div className="space-y-4">
  <AnimatedGradient 
    colors={colors}
    speed={speed}
    className="h-64 rounded-lg"
  />
  
  <div className="flex gap-4">
    <button onClick={() => setColors(['#ef4444', '#dc2626', '#b91c1c'])}>
      Red Theme
    </button>
    <button onClick={() => setColors(['#10b981', '#059669', '#047857'])}>
      Green Theme
    </button>
  </div>
  
  <input 
    type="range"
    min="0.1"
    max="2"
    step="0.1"
    value={speed}
    onChange={(e) => setSpeed(parseFloat(e.target.value))}
  />
</div>
```

### Styling Customization

```tsx
// Subtle background accent
<AnimatedGradient 
  colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.1)']}
  speed={0.2}
  className="absolute top-0 right-0 w-96 h-96 blur-3xl"
/>

// Vibrant overlay effect
<AnimatedGradient 
  colors={['#ff0080', '#7928ca', '#ff0080']}
  blendMode="overlay"
  opacity={0.6}
  className="absolute inset-0 mix-blend-overlay"
/>
```

### Best Practices

1. **Optimize for performance**: Use appropriate quality settings
2. **Consider battery life**: Disable animations on low battery
3. **Provide fallbacks**: Include CSS gradient fallback
4. **Test on various GPUs**: Ensure compatibility
5. **Respect reduced motion**: Disable for users who prefer it

## WebGLImage Component

Applies advanced image effects and transitions using WebGL shaders.

### Import

```tsx
import { WebGLImage } from '@/components/webgl-image'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | Image source URL |
| `alt` | `string` | required | Alternative text |
| `effect` | `'none' \| 'ripple' \| 'distortion' \| 'glitch' \| 'pixelate'` | `'none'` | Visual effect |
| `intensity` | `number` | `1` | Effect intensity (0-10) |
| `trigger` | `'hover' \| 'scroll' \| 'always'` | `'hover'` | Effect trigger |
| `transition` | `number` | `0.6` | Transition duration |
| `displacement` | `string` | - | Custom displacement map URL |
| `className` | `string` | - | Additional CSS classes |
| `onHover` | `() => void` | - | Hover callback |
| `onClick` | `() => void` | - | Click callback |

### Usage Examples

#### Basic Hover Effect
```tsx
<WebGLImage 
  src="/images/product.jpg"
  alt="Product showcase"
  effect="ripple"
  trigger="hover"
  className="w-full h-96 object-cover"
/>
```

#### Distortion Gallery
```tsx
<div className="grid grid-cols-3 gap-4">
  {images.map((image) => (
    <WebGLImage 
      key={image.id}
      src={image.src}
      alt={image.alt}
      effect="distortion"
      intensity={2}
      trigger="hover"
      className="aspect-square cursor-pointer"
      onClick={() => openLightbox(image)}
    />
  ))}
</div>
```

#### Glitch Effect on Scroll
```tsx
<WebGLImage 
  src="/images/hero-bg.jpg"
  alt="Hero background"
  effect="glitch"
  trigger="scroll"
  intensity={3}
  className="fixed inset-0 w-full h-full object-cover"
/>
```

#### Custom Displacement Map
```tsx
<WebGLImage 
  src="/images/portrait.jpg"
  alt="Team member"
  effect="distortion"
  displacement="/textures/fluid-displacement.jpg"
  intensity={5}
  transition={0.8}
  className="rounded-full w-64 h-64"
/>
```

### Advanced Usage

#### Sequential Image Transitions
```tsx
const [currentImage, setCurrentImage] = useState(0)
const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg']

<div className="relative h-screen">
  {images.map((src, index) => (
    <WebGLImage 
      key={src}
      src={src}
      alt={`Slide ${index + 1}`}
      effect="pixelate"
      intensity={currentImage === index ? 0 : 10}
      trigger="always"
      transition={1.2}
      className={`absolute inset-0 w-full h-full object-cover ${
        currentImage === index ? 'z-10' : 'z-0'
      }`}
    />
  ))}
  
  <button onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}>
    Next
  </button>
</div>
```

#### Interactive Product Showcase
```tsx
<div className="relative group">
  <WebGLImage 
    src="/products/shoe-1.jpg"
    alt="Product view 1"
    effect="ripple"
    intensity={1.5}
    trigger="hover"
    className="w-full"
  />
  
  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
    <h3 className="text-white text-2xl font-bold">Premium Sneaker</h3>
    <p className="text-white/80">$299</p>
  </div>
</div>
```

### Styling Customization

```tsx
// Circular mask with distortion
<WebGLImage 
  src="/avatar.jpg"
  alt="User avatar"
  effect="distortion"
  className="w-32 h-32 rounded-full ring-4 ring-white shadow-xl"
/>

// Full-width banner with parallax
<WebGLImage 
  src="/banner.jpg"
  alt="Banner"
  effect="ripple"
  trigger="scroll"
  className="w-full h-[50vh] object-cover sticky top-0 -z-10"
/>
```

### Effect Types

#### Ripple Effect
Creates water-like ripples on interaction
```tsx
<WebGLImage effect="ripple" intensity={2} />
```

#### Distortion Effect
Warps the image based on displacement maps
```tsx
<WebGLImage effect="distortion" intensity={3} />
```

#### Glitch Effect
Digital glitch aesthetic with RGB shifts
```tsx
<WebGLImage effect="glitch" intensity={4} />
```

#### Pixelate Effect
Pixelation transition effect
```tsx
<WebGLImage effect="pixelate" intensity={8} />
```

### Best Practices

1. **Optimize image sizes**: Use appropriate resolutions
2. **Preload critical images**: Ensure smooth transitions
3. **Test performance impact**: Monitor FPS on various devices
4. **Provide fallbacks**: Ensure images display without WebGL
5. **Consider accessibility**: Ensure effects don't hinder usability

### Common Use Cases

#### Hero Image with Depth
```tsx
<section className="relative h-screen overflow-hidden">
  <WebGLImage 
    src="/hero-bg.jpg"
    alt="Hero background"
    effect="distortion"
    trigger="always"
    intensity={0.5}
    className="absolute inset-0 w-full h-full object-cover scale-110"
  />
  
  <div className="relative z-10 h-full flex items-center justify-center">
    <h1 className="text-6xl font-bold text-white text-center">
      Immersive Experiences
    </h1>
  </div>
</section>
```

#### Product Grid with Hover Effects
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  {products.map((product) => (
    <Link key={product.id} href={`/products/${product.id}`}>
      <div className="space-y-3">
        <WebGLImage 
          src={product.image}
          alt={product.name}
          effect="ripple"
          intensity={1.2}
          className="aspect-square object-cover rounded-lg"
        />
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
    </Link>
  ))}
</div>
```

## Performance Optimization

### WebGL Context Management
- Shared WebGL context across components
- Automatic context loss recovery
- Resource cleanup on unmount

### Texture Optimization
- Automatic texture compression
- Power-of-2 texture sizing
- Texture atlasing for multiple images

### Frame Rate Control
```tsx
// Limit animation frame rate for battery savings
<AnimatedGradient 
  colors={colors}
  speed={0.5}
  quality="low" // 30 FPS
/>

// High quality for desktop
<AnimatedGradient 
  colors={colors}
  speed={0.5}
  quality="high" // 60 FPS
/>
```

## Browser Support

WebGL components include automatic fallbacks:

```tsx
// Component automatically falls back to CSS
<AnimatedGradient 
  colors={['#3b82f6', '#8b5cf6']}
  fallback={
    <div className="bg-gradient-to-br from-blue-500 to-purple-600" />
  }
/>
```

## Accessibility Considerations

- All WebGL components respect `prefers-reduced-motion`
- Keyboard navigation preserved
- Screen reader announcements for interactive elements
- Proper contrast ratios maintained
- Focus indicators remain visible

## Debugging

Enable debug mode for performance metrics:

```tsx
<AnimatedGradient 
  colors={colors}
  debug={true} // Shows FPS counter
/>

<WebGLImage 
  src={src}
  alt={alt}
  debug={true} // Shows shader compilation info
/>
```