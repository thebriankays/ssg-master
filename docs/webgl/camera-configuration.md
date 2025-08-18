# Camera Configuration in Views

The SharedCanvas architecture supports different camera configurations per View component. This allows each WebGL component to have its own camera setup while sharing the same WebGL context.

## Default Camera

The SharedCanvasProvider sets a default camera:
```tsx
camera={{ position: [0, 0, 5], fov: 50 }}
```

## Per-View Camera Configuration

Each View can override the default camera with its own configuration:

### Perspective Camera (Default)

```tsx
import { View } from '@react-three/drei'
import { useRef } from 'react'

export function MyComponent() {
  const viewRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={viewRef} className="my-component">
      <View 
        track={viewRef as any}
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0, 10]
        }}
      >
        {/* Your 3D content */}
      </View>
    </div>
  )
}
```

### Orthographic Camera

```tsx
import { View, OrthographicCamera } from '@react-three/drei'
import { useRef } from 'react'

export function OrthoComponent() {
  const viewRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={viewRef} className="ortho-component">
      <View track={viewRef as any}>
        <OrthographicCamera 
          makeDefault
          position={[0, 0, 10]}
          zoom={50}
          near={0.1}
          far={1000}
        />
        {/* Your 3D content */}
      </View>
    </div>
  )
}
```

### Custom Camera Controls

You can add camera controls per View:

```tsx
import { View, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

export function InteractiveComponent() {
  const viewRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={viewRef} className="interactive-component">
      <View track={viewRef as any}>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        {/* Your 3D content */}
      </View>
    </div>
  )
}
```

## Camera Animation

Animate cameras using Theatre.js or GSAP:

```tsx
import { View, PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import { useTheatre } from '@/orchestra/theatre'
import { types } from '@theatre/core'

export function AnimatedCameraComponent() {
  const viewRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  
  const { values } = useTheatre('camera', {
    positionX: types.number(0, { range: [-10, 10] }),
    positionY: types.number(0, { range: [-10, 10] }),
    positionZ: types.number(5, { range: [0, 20] }),
    fov: types.number(50, { range: [20, 120] })
  })

  return (
    <div ref={viewRef} className="animated-camera">
      <View track={viewRef as any}>
        <PerspectiveCamera 
          ref={cameraRef}
          makeDefault 
          position={[values.positionX, values.positionY, values.positionZ]}
          fov={values.fov}
        />
        {/* Your 3D content */}
      </View>
    </div>
  )
}
```

## Best Practices

1. **Use makeDefault**: Always use `makeDefault` prop on custom cameras to ensure they're used by the View
2. **Match aspect ratio**: Views automatically handle aspect ratio based on DOM bounds
3. **Optimize camera updates**: Avoid updating camera properties every frame unless necessary
4. **Consider FOV**: Different components may need different FOV values for optimal presentation
5. **Z-fighting**: Adjust near/far planes to prevent z-fighting issues

## Common Camera Configurations

### Product Showcase
```tsx
camera={{ fov: 35, position: [0, 0, 5] }}
```

### Wide Scene
```tsx
camera={{ fov: 75, position: [0, 5, 10] }}
```

### Isometric View
```tsx
<OrthographicCamera 
  makeDefault
  zoom={100}
  position={[10, 10, 10]}
/>
```

### First Person
```tsx
camera={{ fov: 60, position: [0, 1.6, 0] }}
```