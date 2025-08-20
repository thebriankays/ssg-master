# WebGL Patterns Guide

## When to Use Tunnel vs View

### Use WebGL Tunnel Pattern When:

1. **Screen-space shaders** - Effects that use `gl_FragCoord` and need to work in screen coordinates
2. **Global effects** - Background gradients, particle systems, or effects that span the entire viewport
3. **Fluid/flowmap integration** - Effects that need to interact with global fluid simulation
4. **Post-processing effects** - Effects that need access to the full framebuffer
5. **Shared uniforms** - When multiple effects need to share global uniforms like time, mouse position, etc.

**Example components:**
- Animated gradients (like Whatamesh)
- Fluid simulations
- Global particle systems
- Screen distortion effects
- Background animations

**Pattern:**
```tsx
import { useRect } from '@/hooks/use-rect'
import { WebGLTunnel } from '@/webgl/components/tunnel'
import { useWebGLRect } from '@/hooks/use-webgl-rect'

export function ScreenSpaceEffect() {
  const [setRectRef, rect] = useRect()

  return (
    <div ref={setRectRef}>
      <WebGLTunnel>
        <WebGLEffect rect={rect} />
      </WebGLTunnel>
    </div>
  )
}

// In the WebGL component:
function WebGLEffect({ rect }) {
  const meshRef = useRef()
  
  useWebGLRect(rect, ({ scale, position }) => {
    meshRef.current.position.copy(position)
    meshRef.current.scale.copy(scale)
  })

  return (
    <mesh ref={meshRef} matrixAutoUpdate={false}>
      <planeGeometry />
      <shaderMaterial fragmentShader={`
        void main() {
          vec2 screenUV = gl_FragCoord.xy / resolution;
          // ... screen-space calculations
        }
      `} />
    </mesh>
  )
}
```

### Use drei View Pattern When:

1. **3D objects with perspective** - Models, 3D text, or anything that needs proper 3D camera projection
2. **Self-contained scenes** - Components with their own camera, lights, and controls
3. **Interactive 3D widgets** - 3D carousels, product viewers, games
4. **Isolated render targets** - When you need a separate render pass or different camera settings
5. **Multiple viewports** - Split-screen effects or multiple camera angles

**Example components:**
- 3D model viewers
- Interactive 3D carousels
- 3D games or experiences
- Product configurators
- Data visualizations

**Pattern:**
```tsx
import { View } from '@react-three/drei'
import { useRef } from 'react'

export function ThreeDWidget() {
  const viewRef = useRef()

  return (
    <div ref={viewRef} className="3d-widget">
      <View track={viewRef}>
        <PerspectiveCamera makeDefault />
        <ambientLight />
        <Model />
        <OrbitControls />
      </View>
    </div>
  )
}
```

## Key Differences

### Tunnel Pattern
- Renders to the global canvas coordinate system
- No separate viewport or camera
- Uses screen-space coordinates (gl_FragCoord)
- Manual DOM→WebGL position mapping
- Better for 2D effects that need to align with DOM
- Shares post-processing and global effects

### View Pattern  
- Creates its own viewport with bounds
- Has its own camera and can use perspective
- Uses 3D world coordinates
- Automatic viewport tracking and clipping
- Better for true 3D content
- Isolated from other views

### WebGLMount Pattern (Recommended)
A simplified wrapper that combines DOM measurement with tunnel rendering:

```tsx
import { WebGLMount } from '@/components/webgl/WebGLMount'

export function MyWidget() {
  return (
    <WebGLMount
      className="my-widget"
      style={{ width: '100%', height: '400px' }}
      interactive="dom"
      onWheel={handleWheel}
      onPointerDown={handleDown}
    >
      <MyWebGLContent />
    </WebGLMount>
  )
}
```

Benefits:
- Automatic DOM→WebGL position sync
- Built-in event forwarding
- Consistent API across components
- No need to manually handle rect measurements

## Decision Guide

Ask yourself:

1. **Does it need perspective?** → Use View
2. **Is it a screen-space effect?** → Use Tunnel (via WebGLMount)
3. **Does it need its own camera?** → Use View
4. **Should it interact with global effects?** → Use Tunnel (via WebGLMount)
5. **Is it a self-contained 3D scene?** → Use View
6. **Does it use gl_FragCoord?** → Use Tunnel (via WebGLMount)

**For most DOM-aligned WebGL widgets**: Use WebGLMount wrapper with tunnel pattern

## Performance Considerations

- **Tunnel pattern** is more efficient for 2D effects as it doesn't create separate render passes
- **View pattern** has overhead of viewport calculations but provides better isolation
- Use **Tunnel** when you have many small effects that need to blend together
- Use **View** when you need render isolation or different camera settings per component