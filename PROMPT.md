# Creating a New WebGL Component - Essential Prompt

## Quick Start Prompt

"I need to create a new WebGL component called [ComponentName] that [describe what it does]. Before starting, please read the following files to understand the architecture:

1. `/src/docs/ARCHITECTURE.md` - Overall system architecture
2. `/src/webgl/README.md` - WebGL shared canvas system
3. `/src/docs/components/webgl.md` - WebGL component patterns
4. `/src/docs/webgl/advanced-effects.md` - Advanced WebGL systems

Then examine these example components:
- `/src/webgl/components/RotatingCube.tsx` - Simple WebGL component
- `/src/webgl/components/ParticleField.tsx` - Particle system example
- `/src/components/animated-gradient/index.tsx` and `AnimatedGradient.webgl.tsx` - Component with WebGL parts

Please create the component following these requirements:
1. Use the shared canvas architecture with drei's View component 
2. Split React logic and WebGL logic into separate files
3. Use SCSS with BEM naming convention (NO CSS modules)
4. Include proper TypeScript types
5. Add loading states and error boundaries
6. Implement proper cleanup on unmount"

## Detailed Architecture Context

### 🏗️ Core Architecture Principles

This project uses a **shared WebGL canvas architecture** where:
- ONE canvas serves ALL WebGL components on the page
- Each component renders to its own View portal that respects DOM bounds
- Components are split between React logic and WebGL rendering
- SCSS with BEM naming (NO CSS modules ever)

### 📁 File Structure for New Components

```
src/components/[component-name]/
├── index.tsx                    # Main React component
├── [ComponentName].webgl.tsx    # WebGL/Three.js logic
├── [component-name].scss        # Styles using BEM
└── README.md                    # Component documentation
```

### 🔧 Required Imports and Patterns

```tsx
// In index.tsx
import { useWebGLView } from '@/hooks/useWebGLView'
import dynamic from 'next/dynamic'

// Lazy load WebGL parts
const ComponentWebGL = dynamic(
  () => import('./ComponentName.webgl').then(mod => mod.ComponentWebGL),
  { ssr: false }
)

// In ComponentName.webgl.tsx
import { View } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
```

### 📋 Component Template

```tsx
// index.tsx
'use client'

import { useWebGLView } from '@/hooks/useWebGLView'
import { cn } from '@/utilities/ui'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import './component-name.scss'

const ComponentWebGL = dynamic(
  () => import('./ComponentName.webgl').then(mod => mod.ComponentWebGL),
  { ssr: false }
)

interface ComponentNameProps {
  className?: string
  // Add other props
}

export function ComponentName({ className, ...props }: ComponentNameProps) {
  const viewRef = useWebGLView<HTMLDivElement>()

  return (
    <div ref={viewRef} className={cn('component-name', className)}>
      <Suspense fallback={<div className="component-name__loader">Loading...</div>}>
        <ComponentWebGL viewRef={viewRef} {...props} />
      </Suspense>
    </div>
  )
}
```

```tsx
// ComponentName.webgl.tsx
'use client'

import { View } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface ComponentWebGLProps {
  viewRef: React.RefObject<HTMLElement>
  // Mirror props from main component
}

export function ComponentWebGL({ viewRef, ...props }: ComponentWebGLProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <View track={viewRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff006e" />
      </mesh>
    </View>
  )
}
```

### 🎨 SCSS/BEM Template

```scss
// component-name.scss

.component-name {
  position: relative;
  width: 100%;
  height: 100%;
  
  // Elements
  &__loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.1);
  }
  
  &__content {
    position: relative;
    z-index: 1;
  }
  
  // Modifiers
  &--fullscreen {
    position: fixed;
    inset: 0;
  }
  
  &--interactive {
    cursor: pointer;
    
    &:hover {
      .component-name__mesh {
        transform: scale(1.1);
      }
    }
  }
}
```

### ⚡ Performance Considerations

1. **Use Suspense** for lazy loading WebGL components
2. **Implement LOD** (Level of Detail) for complex geometries
3. **Dispose resources** properly on unmount
4. **Use instancing** for repeated objects
5. **Optimize textures** (power of 2, compressed formats)
6. **Limit draw calls** by batching geometry

### 🔌 Available WebGL Systems

The project includes these advanced systems you can use:

1. **Flowmap Effects** (`/src/webgl/flowmap`)
   - FlowmapMaterial for fluid effects
   - FlowmapInteractive for mouse interaction

2. **Post-processing** (`/src/webgl/postprocessing`)
   - Bloom, ChromaticAberration, Noise effects
   - EffectComposer wrapper

3. **Preload System** (`/src/webgl/preload`)
   - Asset loading with progress
   - Texture, model, audio preloading

4. **RAF Manager** (`/src/webgl/raf`)
   - Centralized animation loop
   - Priority-based execution

5. **Portal System** (`/src/webgl/tunnel`)
   - Render content in different tree locations
   - Portal visual effects

### 🚀 Advanced Patterns

#### Using Shaders
```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const MyMaterial = shaderMaterial(
  { uTime: 0, uColor: new THREE.Color() },
  // vertex shader
  `...`,
  // fragment shader
  `...`
)

extend({ MyMaterial })
```

#### Interactive Components
```tsx
import { useGSAP } from '@/hooks/useGSAP'

// In component
useGSAP(() => {
  gsap.to(meshRef.current.rotation, {
    y: Math.PI * 2,
    duration: 2,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: viewRef.current,
      start: 'top 80%'
    }
  })
}, [])
```

### 📚 Essential Reading Order

1. **Architecture Overview**: `/src/docs/ARCHITECTURE.md`
2. **WebGL System**: `/src/webgl/README.md`
3. **Component Examples**:
   - `/src/webgl/components/RotatingCube.tsx`
   - `/src/components/animated-gradient/`
   - `/src/components/webgl-image/`
4. **Advanced Effects**: `/src/docs/webgl/advanced-effects.md`
5. **Performance Guide**: `/src/docs/react-three-fiber/performance-scaling.md`

### ✅ Checklist for New Components

- [ ] Component uses shared canvas via `useWebGLView` and `View`
- [ ] WebGL logic separated into `.webgl.tsx` file
- [ ] SCSS file with BEM naming (no CSS modules)
- [ ] Proper TypeScript types throughout
- [ ] Suspense boundary for lazy loading
- [ ] Resource cleanup on unmount
- [ ] Error boundary implementation
- [ ] Loading and error states
- [ ] Responsive to container size
- [ ] Performance optimized
- [ ] Documentation in README.md
- [ ] Example usage provided

### 🚫 Common Mistakes to Avoid

1. **DON'T** create your own Canvas - use the shared one
2. **DON'T** use CSS modules - only SCSS with BEM
3. **DON'T** forget cleanup in useEffect returns
4. **DON'T** render heavy computations every frame
5. **DON'T** ignore TypeScript errors
6. **DON'T** create components in the webgl folder - use components folder

### 💡 Pro Tips

1. **Start simple** - Get basic rendering working first
2. **Use Chrome DevTools** - Monitor performance and memory
3. **Test on mobile** - Performance varies greatly
4. **Batch operations** - Group similar draw calls
5. **Profile early** - Don't optimize prematurely
6. **Use examples** - Copy patterns from existing components

## Example Creation Prompt

"Create a WebGL component called 'GlowOrb' that displays a glowing sphere that pulses on hover and responds to mouse movement. It should support color customization, intensity control, and integrate with GSAP for smooth animations. Make sure to follow the shared canvas architecture and split the code properly between React and WebGL parts."