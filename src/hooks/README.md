# Custom React Hooks

This directory contains reusable React hooks and Payload CMS hooks that provide common functionality across the application. These hooks encapsulate complex logic and state management to simplify component implementation.

## Available Hooks

### React Hooks (UI/Animation/Performance)

- `use-device-detection.ts` - Detects device type, capabilities, and preferences
- `use-font-preload.ts` - Preloads fonts using FontFaceObserver to prevent FOUT
- `use-gsap.ts` - GSAP animations with automatic cleanup and context management
- `use-isomorphic-layout-effect.ts` - SSR-safe version of useLayoutEffect
- `use-performance.ts` - Tracks Core Web Vitals and performance metrics
- `use-prefetch.ts` - Prefetches routes when elements become visible
- `use-previous.ts` - Returns the previous value of a prop or state
- `use-rect.ts` - Tracks DOM element's bounding rectangle
- `use-scroll-progress.ts` - Tracks scroll progress of an element with GSAP
- `use-scroll-trigger.ts` - Advanced scroll-based triggers and animations
- `use-scroll-velocity.ts` - Tracks scroll velocity using Lenis smooth scroll
- `use-split-text.ts` - Splits text into lines, words, or characters for animation
- `use-texture.ts` - Loads textures for Three.js/React Three Fiber
- `use-transform.tsx` - Manages element transformations with provider pattern
- `use-viewport.ts` - Tracks viewport dimensions with debounced updates
- `use-webgl-rect.ts` - Syncs DOM element position with WebGL coordinates
- `use-webgl-sync.ts` - Comprehensive sync between HTML elements and WebGL
- `use-webgl-view.ts` - Utilities for WebGL View components

### Payload CMS Hooks (Backend/CMS)

- `formatSlug.ts` - Field hook for formatting URL slugs
- `populatePublishedAt.ts` - Collection hook to auto-populate publishedAt field
- `revalidateRedirects.ts` - Collection hook to revalidate redirect cache

## Detailed Usage

### useDeviceDetection

Detects device type and characteristics to adapt components for different devices.

```tsx
import { useDeviceDetection } from '@/hooks/use-device-detection'

function ResponsiveComponent() {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    isTouch,
    isWebGL,
    isLowPowerMode,
    isReducedMotion 
  } = useDeviceDetection()
  
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
      
      {isTouch ? (
        <TouchInteractions />
      ) : (
        <MouseInteractions />
      )}
      
      {!isReducedMotion && <AnimatedContent />}
    </div>
  )
}
```

### useFontPreload

Preloads fonts to prevent Flash of Unstyled Text (FOUT).

```tsx
import { useFontPreload } from '@/hooks/use-font-preload'

function App() {
  const fontsLoaded = useFontPreload(['GeistSans', 'GeistMono'], () => {
    console.log('Fonts loaded!')
  })
  
  return (
    <div className={fontsLoaded ? 'fonts-loaded' : 'fonts-loading'}>
      {/* Your content */}
    </div>
  )
}
```

### useGSAP

Provides GSAP context for animations with automatic cleanup.

```tsx
import { useGSAP } from '@/hooks/use-gsap'
import gsap from 'gsap'

function AnimatedComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    gsap.from('.box', {
      x: -100,
      opacity: 0,
      duration: 1,
      stagger: 0.1
    })
  }, { scope: containerRef })
  
  return (
    <div ref={containerRef}>
      <div className="box">Box 1</div>
      <div className="box">Box 2</div>
      <div className="box">Box 3</div>
    </div>
  )
}
```

### usePerformance

Automatically tracks and reports Core Web Vitals metrics to analytics services.

```tsx
import { usePerformance } from '@/hooks/use-performance'

// Add to your root layout or app component
function App() {
  usePerformance()
  return <>{/* Your app */}</>
}
```

### usePrefetch

Prefetches routes when elements become visible in the viewport.

```tsx
import { usePrefetch } from '@/hooks/use-prefetch'

function ProductCard({ href }: { href: string }) {
  const prefetchRef = usePrefetch(href)
  
  return (
    <div ref={prefetchRef}>
      <Link href={href}>View Product</Link>
    </div>
  )
}
```

### usePrevious

Stores and returns the previous value of a prop or state.

```tsx
import { usePrevious } from '@/hooks/use-previous'

function Counter({ count }: { count: number }) {
  const prevCount = usePrevious(count)
  
  return (
    <div>
      Current: {count}
      {prevCount !== undefined && (
        <div>Previous: {prevCount}</div>
      )}
      {prevCount !== undefined && count > prevCount && (
        <div>Increased!</div>
      )}
    </div>
  )
}
```

### useRect

Tracks DOM element's bounding rectangle.

```tsx
import { useRect } from '@/hooks/use-rect'

function MeasuredComponent() {
  const [setRectRef, rect] = useRect()
  
  return (
    <div ref={setRectRef}>
      {rect && (
        <div>
          Width: {rect.width}px
          Height: {rect.height}px
          Position: {rect.left}, {rect.top}
        </div>
      )}
    </div>
  )
}
```

### useScrollProgress

Tracks scroll progress of an element using GSAP ScrollTrigger.

```tsx
import { useScrollProgress } from '@/hooks/use-scroll-progress'

function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(ref, {
    start: 'top bottom',
    end: 'bottom top'
  })
  
  return (
    <div ref={ref}>
      <div style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}
```

### useScrollTrigger

Provides advanced scroll-based animation and trigger functionality.

```tsx
import { useRect } from '@/hooks/use-rect'
import { useScrollTrigger } from '@/hooks/use-scroll-trigger'

function ScrollAnimation() {
  const [setRectRef, rect] = useRect()

  useScrollTrigger({
    rect,
    start: 'bottom bottom', // Start when element's bottom reaches viewport bottom
    end: 'top top',         // End when element's top reaches viewport top
    markers: true,          // Show debug markers (development only)
    onProgress: ({ progress, isActive }) => {
      console.log('Progress:', progress)
      console.log('Is Active:', isActive)
    },
    onEnter: () => console.log('Entered viewport'),
    onLeave: () => console.log('Left viewport')
  })
  
  return (
    <div ref={setRectRef}>
      This element triggers animations based on scroll
    </div>
  )
}
```

### useScrollVelocity

Tracks scroll velocity using Lenis smooth scroll.

```tsx
import { useScrollVelocity } from '@/hooks/use-scroll-velocity'

function VelocityIndicator() {
  const velocity = useScrollVelocity({ smoothing: 0.1 })
  
  return (
    <div style={{ 
      transform: `scaleY(${1 + Math.abs(velocity) * 0.1})` 
    }}>
      Scroll velocity: {velocity.toFixed(2)}
    </div>
  )
}
```

### useSplitText

Splits text into lines, words, or characters for animation.

```tsx
import { useSplitText } from '@/hooks/use-split-text'
import { useGSAP } from '@/hooks/use-gsap'
import gsap from 'gsap'

function AnimatedText() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useSplitText(containerRef, {
    type: 'chars,words,lines',
    linesClass: 'split-line',
    wordsClass: 'split-word',
    charsClass: 'split-char'
  })
  
  useGSAP(() => {
    gsap.from('.split-char', {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.out'
    })
  }, { dependencies: [], scope: containerRef })
  
  return (
    <div ref={containerRef}>
      <h1>This text will be animated character by character</h1>
    </div>
  )
}
```

### useTexture

Loads textures for Three.js/React Three Fiber.

```tsx
import { useTexture } from '@/hooks/use-texture'

function TexturedMesh() {
  const texture = useTexture('/path/to/texture.jpg')
  
  if (!texture) return null
  
  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}

// Load multiple textures
function MultiTexturedMesh() {
  const [diffuse, normal, roughness] = useTexture([
    '/diffuse.jpg',
    '/normal.jpg',
    '/roughness.jpg'
  ])
  
  if (!diffuse || !normal || !roughness) return null
  
  return (
    <mesh>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial 
        map={diffuse}
        normalMap={normal}
        roughnessMap={roughness}
      />
    </mesh>
  )
}
```

### useTransform

Manages element transformations with provider pattern.

```tsx
import { TransformProvider, useTransform } from '@/hooks/use-transform'

function AnimatedElement() {
  const transformProviderRef = useRef<TransformRef>(null)

  // Set transform values imperatively
  useEffect(() => {
    transformProviderRef.current?.setTranslate({ x: 0, y: 100, z: 0 })
    transformProviderRef.current?.setScale({ x: 1.5, y: 1.5 })
  }, [])

  // Listen to transform changes
  useTransform(({ translate, rotate, scale, clip }) => {
    console.log('Transform updated:', { translate, rotate, scale, clip })
  }, [])

  return (
    <TransformProvider ref={transformProviderRef}>
      <div>
        <h1>Transformed Element</h1>
      </div>
    </TransformProvider>
  )
}
```

### useViewport

Tracks viewport dimensions with debounced resize handling.

```tsx
import { useViewport } from '@/hooks/use-viewport'

function ResponsiveComponent() {
  const { width, height, isMobile, isTablet, isDesktop } = useViewport()
  
  return (
    <div>
      <p>Viewport: {width} x {height}</p>
      {isMobile && <p>Mobile view</p>}
      {isTablet && <p>Tablet view</p>}
      {isDesktop && <p>Desktop view</p>}
    </div>
  )
}
```

### useWebGLRect

Syncs DOM element position with WebGL space coordinates.

```tsx
import { useWebGLRect } from '@/hooks/use-webgl-rect'
import { useRect } from '@/hooks/use-rect'

function WebGLElement() {
  const [setRectRef, rect] = useRect()
  
  useWebGLRect(rect, ({ position, scale, isVisible }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(position)
      meshRef.current.scale.copy(scale)
      meshRef.current.visible = isVisible
    }
  })
  
  return (
    <>
      <div ref={setRectRef} className="dom-element">
        DOM Element
      </div>
      <mesh ref={meshRef}>
        <planeGeometry />
        <meshBasicMaterial />
      </mesh>
    </>
  )
}
```

### useWebGLSync

Comprehensive synchronization between HTML elements and WebGL objects.

```tsx
import { useWebGLSync } from '@/hooks/use-webgl-sync'

function SyncedWebGLText() {
  const elementRef = useRef<HTMLDivElement>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  
  const sync = useWebGLSync(elementRef, meshRef, {
    syncPosition: true,
    syncScale: true,
    syncOpacity: true,
    syncFontProperties: true
  })
  
  return (
    <>
      <div ref={elementRef} style={{ fontSize: '48px', fontWeight: 'bold' }}>
        Synced Text
      </div>
      <mesh ref={meshRef}>
        <planeGeometry />
        <meshBasicMaterial />
      </mesh>
    </>
  )
}
```

### useWebGLView

Utilities for WebGL View components with DOM to WebGL conversions.

```tsx
import { useWebGLView } from '@/hooks/use-webgl-view'

function WebGLViewComponent() {
  const { domToWebGL, isInViewport } = useWebGLView()
  
  const handleClick = (event: MouseEvent) => {
    const webglCoords = domToWebGL(event.clientX, event.clientY)
    console.log('WebGL coordinates:', webglCoords)
  }
  
  return (
    <div onClick={handleClick}>
      Click to get WebGL coordinates
    </div>
  )
}
```

## Payload CMS Hooks

### formatSlug

Field hook for formatting URL slugs in Payload CMS.

```tsx
// In your Payload collection config
{
  name: 'slug',
  type: 'text',
  hooks: {
    beforeChange: [formatSlug('title')]
  }
}
```

### populatePublishedAt

Collection hook to auto-populate publishedAt field.

```tsx
// In your Payload collection config
{
  slug: 'posts',
  hooks: {
    beforeChange: [populatePublishedAt]
  },
  fields: [
    {
      name: 'publishedAt',
      type: 'date'
    }
  ]
}
```

### revalidateRedirects

Collection hook to revalidate redirect cache after changes.

```tsx
// In your Redirects collection config
{
  slug: 'redirects',
  hooks: {
    afterChange: [revalidateRedirects],
    afterDelete: [revalidateRedirects]
  }
}
```

## Integration with Other Libraries

These hooks are designed to work seamlessly with:

- **GSAP** - Professional animation library
- **Lenis** - Smooth scrolling library
- **Three.js/R3F** - 3D graphics and WebGL
- **Payload CMS** - Headless CMS
- **Next.js** - React framework
- **TypeScript** - Type safety

## Best Practices

1. **Performance**
   - Use memoization to prevent unnecessary recalculations
   - Implement cleanup functions to prevent memory leaks
   - Use `useCallback` and `useMemo` for optimization
   - Debounce expensive operations

2. **Reusability**
   - Keep hooks focused on a single responsibility
   - Use TypeScript for type safety
   - Provide sensible defaults
   - Document parameter options

3. **Debugging**
   - Include development-only debugging options
   - Provide clear error messages
   - Use descriptive variable names
   - Add console warnings for edge cases

4. **SSR Compatibility**
   - Use `useIsomorphicLayoutEffect` for layout effects
   - Check for `window` existence before using browser APIs
   - Provide SSR-safe fallbacks

## Usage

Import hooks directly from this directory:

```typescript
import { useDeviceDetection } from '@/hooks/use-device-detection'
import { useFontPreload } from '@/hooks/use-font-preload'
import { useGSAP } from '@/hooks/use-gsap'
import { usePerformance } from '@/hooks/use-performance'
import { usePrefetch } from '@/hooks/use-prefetch'
import { useScrollTrigger } from '@/hooks/use-scroll-trigger'
import { useTransform } from '@/hooks/use-transform'
// ... and more
```

## Contributing

When adding new hooks:

1. Follow the naming convention: `use-hook-name.ts`
2. Add TypeScript types for all parameters and return values
3. Include JSDoc comments explaining the hook's purpose
4. Add usage examples to this README
5. Ensure the hook is focused on a single responsibility
6. Test for memory leaks and performance issues
7. Consider SSR compatibility