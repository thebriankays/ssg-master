# Advanced WebGL Effects

This document covers the advanced WebGL effect systems available in the project.

## Flowmap Effects

Flowmap effects create fluid, organic animations using flow fields and displacement maps.

### Components

#### FlowmapMaterial

A custom shader material for creating flowmap effects:

```tsx
import { FlowmapMaterial } from '@/webgl/flowmap'

// In your R3F component
<mesh>
  <planeGeometry args={[2, 2]} />
  <flowmapMaterial
    uTexture={texture}
    uFlow={flowTexture}
    uFlowSpeed={0.5}
    uFlowIntensity={0.5}
  />
</mesh>
```

#### Flowmap Component

High-level component for flowmap effects:

```tsx
import { Flowmap } from '@/webgl/flowmap'

<Flowmap
  texture="/textures/water.jpg"
  flowTexture="/textures/flow.jpg"
  speed={0.3}
  intensity={0.8}
  scale={[10, 10]}
/>
```

#### FlowmapInteractive

Interactive flowmap that responds to mouse/touch:

```tsx
import { FlowmapInteractive } from '@/webgl/flowmap'

<FlowmapInteractive
  texture="/textures/abstract.jpg"
  size={512}
  falloff={0.3}
  alpha={0.3}
  dissipation={0.98}
/>
```

## Post-Processing Effects

The post-processing system provides various visual effects that can be applied to your 3D scenes.

### EffectComposer

Wrapper for Three.js EffectComposer with automatic setup:

```tsx
import { EffectComposer } from '@/webgl/postprocessing'
import { BloomEffect, ChromaticAberrationEffect } from '@/webgl/postprocessing/effects'

<EffectComposer>
  <BloomEffect
    intensity={1.5}
    luminanceThreshold={0.6}
    luminanceSmoothing={0.9}
  />
  <ChromaticAberrationEffect
    offset={[0.002, 0.002]}
  />
</EffectComposer>
```

### Available Effects

#### Bloom Effect

Creates a glow effect for bright areas:

```tsx
<BloomEffect
  intensity={1.5}
  luminanceThreshold={0.6}
  luminanceSmoothing={0.9}
  mipmapBlur
/>
```

#### Chromatic Aberration

Simulates lens chromatic aberration:

```tsx
<ChromaticAberrationEffect
  offset={[0.002, 0.002]}
  radialModulation
  modulationOffset={0.5}
/>
```

#### Noise Effect

Adds film grain or noise:

```tsx
<NoiseEffect
  opacity={0.05}
  speed={0.5}
/>
```

## Preload System

The preload system manages asset loading for optimal performance.

### PreloadManager

Centralized asset loading with progress tracking:

```tsx
import { PreloadManager } from '@/webgl/preload'

const preloader = new PreloadManager()

// Preload various asset types
await preloader.load([
  { url: '/models/hero.gltf', type: 'gltf' },
  { url: '/textures/environment.hdr', type: 'texture' },
  { url: '/sounds/ambient.mp3', type: 'audio' }
])

// Get loaded assets
const model = preloader.get('/models/hero.gltf')
```

### usePreload Hook

React hook for preloading assets:

```tsx
import { usePreload } from '@/webgl/preload'

function Scene() {
  const { progress, isLoading, assets } = usePreload([
    '/models/character.gltf',
    '/textures/skin.jpg'
  ])

  if (isLoading) {
    return <LoadingScreen progress={progress} />
  }

  // Use loaded assets
  const model = assets['/models/character.gltf']
}
```

### PreloadScreen Component

Ready-to-use loading screen:

```tsx
import { PreloadScreen } from '@/webgl/preload'

<PreloadScreen
  assets={['/model.gltf', '/texture.jpg']}
  onComplete={() => setLoaded(true)}
  loadingText="Loading experience..."
  showProgress
/>
```

## RAF Management

The RAF (requestAnimationFrame) system provides centralized animation loop management.

### RafManager

Manages all animation callbacks with priority system:

```tsx
import { RafManager } from '@/webgl/raf'

const rafManager = RafManager.getInstance()

// Add animation callback
const id = rafManager.add(
  (time, deltaTime) => {
    // Animation logic
  },
  0, // priority (higher = earlier execution)
  'my-animation'
)

// Control animation
rafManager.pause(id)
rafManager.resume(id)
rafManager.remove(id)
```

### useRaf Hook

React hook for RAF animations:

```tsx
import { useRaf } from '@/webgl/raf'

function AnimatedComponent() {
  const meshRef = useRef()

  useRaf((time, deltaTime) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += deltaTime * 0.001
    }
  }, 0) // priority

  return <mesh ref={meshRef}>...</mesh>
}
```

### RafDebugger

Visual debugger for RAF performance:

```tsx
import { RafDebugger } from '@/webgl/raf'

// Show RAF performance stats
<RafDebugger position="top-right" />
```

## Portal/Tunnel System

The tunnel system allows rendering content in different parts of the React tree while maintaining Three.js context.

### TunnelProvider

Provides tunnel context:

```tsx
import { TunnelProvider } from '@/webgl/tunnel'

<TunnelProvider>
  <App />
</TunnelProvider>
```

### TunnelIn/TunnelOut

Create portals for 3D content:

```tsx
import { TunnelIn, TunnelOut } from '@/webgl/tunnel'

// Source (where content is defined)
<TunnelIn id="portal-content">
  <mesh>
    <sphereGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
</TunnelIn>

// Destination (where content appears)
<TunnelOut id="portal-content" />
```

### Portal Effect Component

Visual portal effect:

```tsx
import { Portal } from '@/webgl/tunnel'

<Portal
  position={[0, 0, 0]}
  scale={2}
  colorStart="#ff006e"
  colorEnd="#8338ec"
  noiseScale={2}
  speed={0.5}
/>
```

## Best Practices

### Performance

1. **Use LOD (Level of Detail)**: Reduce complexity for distant objects
2. **Batch similar objects**: Use instanced rendering for repeated elements
3. **Optimize textures**: Use compressed formats and appropriate resolutions
4. **Limit post-processing**: Each effect adds rendering overhead

### Memory Management

1. **Dispose unused resources**: Call `.dispose()` on geometries, materials, and textures
2. **Reuse materials**: Share materials between objects when possible
3. **Use texture atlases**: Combine multiple textures to reduce draw calls
4. **Monitor memory usage**: Use Chrome DevTools Memory profiler

### Mobile Optimization

1. **Reduce quality on mobile**: Lower resolution, fewer effects
2. **Use simpler shaders**: Avoid complex calculations in fragment shaders
3. **Limit particle counts**: Use fewer particles with larger sizes
4. **Test on real devices**: Performance varies significantly between devices

## Examples

### Water Effect with Flowmap

```tsx
function WaterSurface() {
  return (
    <FlowmapInteractive
      texture="/textures/water-normal.jpg"
      size={1024}
      falloff={0.2}
      alpha={0.3}
      dissipation={0.985}
      className="absolute inset-0"
    />
  )
}
```

### Cinematic Scene with Post-Processing

```tsx
function CinematicScene() {
  return (
    <>
      <Scene />
      <EffectComposer>
        <BloomEffect intensity={0.5} luminanceThreshold={0.8} />
        <ChromaticAberrationEffect offset={[0.001, 0.001]} />
        <NoiseEffect opacity={0.02} />
      </EffectComposer>
    </>
  )
}
```

### Loading Complex Assets

```tsx
function ComplexScene() {
  const { progress, isLoading } = usePreload([
    '/models/environment.gltf',
    '/models/character.gltf',
    '/textures/environment.hdr',
    '/sounds/ambient.mp3'
  ])

  if (isLoading) {
    return (
      <PreloadScreen
        progress={progress}
        loadingText="Preparing experience..."
      />
    )
  }

  return <GameWorld />
}
```