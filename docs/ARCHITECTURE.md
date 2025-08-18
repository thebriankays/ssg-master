# Architecture Overview

This document provides a comprehensive overview of the SSG project architecture, which combines Payload CMS 3, Next.js 15, and advanced WebGL capabilities through a sophisticated component system.

## Core Architecture Principles

1. **Shared Canvas Architecture**: Single WebGL context serving multiple components
2. **Component-First Design**: Everything is a reusable, composable component
3. **Performance by Default**: Optimized for 60fps on all devices
4. **SCSS with BEM**: No CSS modules, using SCSS files with BEM naming convention
5. **TypeScript Throughout**: Full type safety across the application

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Payload CMS 3                           │
│                  (Content Management)                        │
├─────────────────────────────────────────────────────────────┤
│                      Next.js 15                              │
│              (SSR, Routing, API Routes)                      │
├─────────────────────────────────────────────────────────────┤
│                   React 19 + TypeScript                      │
│                  (Component Layer)                           │
├─────────────────────────────────────────────────────────────┤
│    SharedCanvasProvider    │    Animation System            │
│    (drei View system)      │    (GSAP, Lenis, Tempus)      │
├─────────────────────────────────────────────────────────────┤
│                 Three.js + React Three Fiber                 │
│                    (3D Graphics Layer)                       │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── animation/              # GSAP, Lenis, Tempus integration
│   ├── gsap.ts            # GSAP configuration and plugins
│   ├── lenis.ts           # Smooth scroll setup
│   └── tempus.ts          # RAF management
│
├── app/                   # Next.js App Router
│   ├── (frontend)/        # Public-facing routes
│   ├── (payload)/         # CMS admin routes
│   ├── api/              # API endpoints
│   └── next/             # Next.js specific routes
│
├── blocks/               # Payload CMS content blocks
│   └── [block-name]/     # Individual block with schema
│
├── collections/          # Payload CMS collections
│   ├── Pages.ts         # Page collection
│   ├── Posts.ts         # Blog posts
│   ├── Media.ts         # Media library
│   └── Users.ts         # User management
│
├── components/           # React components
│   ├── animation/        # Animation components
│   │   ├── Marquee/     # Infinite scroll marquee
│   │   ├── SplitText/   # Text splitting for animations
│   │   └── ProgressText/ # Animated progress text
│   │
│   ├── layout/          # Layout components
│   │   ├── Accordion/   # Collapsible content
│   │   ├── Fold/        # Fold/reveal animations
│   │   └── Scrollbar/   # Custom scrollbar
│   │
│   ├── typography/      # Typography components
│   │   ├── Heading.tsx  # Heading component
│   │   └── Text.tsx     # Text component
│   │
│   ├── ui/              # shadcn/ui components
│   │
│   ├── Image/           # Optimized image component
│   ├── Link/            # Enhanced link component
│   └── [component]/     # Component with WebGL parts
│
├── docs/                # Architecture documentation
│   ├── components/      # Component documentation
│   ├── gsap/           # GSAP patterns and tips
│   ├── react-three-fiber/ # R3F documentation
│   └── webgl/          # WebGL system docs
│
├── hooks/               # Custom React hooks
│   ├── useGSAP.ts      # GSAP animation hooks
│   ├── useWebGLView.ts # WebGL View setup hook
│   └── [hook].ts       # Other custom hooks
│
├── libs/                # Utility libraries
│   ├── store.ts        # Zustand store utilities
│   ├── tempus-queue.ts # RAF queue management
│   ├── easings.ts      # Easing functions
│   └── utils.ts        # General utilities
│
├── providers/           # React context providers
│   ├── SharedCanvasProvider.tsx # WebGL canvas provider
│   ├── AnimationProvider.tsx    # Animation context
│   └── HeaderTheme/             # Header theme context
│
├── styles/              # SCSS architecture
│   ├── _variables.scss  # CSS variables
│   ├── _mixins.scss    # SCSS mixins
│   ├── _base.scss      # Base styles
│   └── app.scss        # Main stylesheet
│
├── types/               # TypeScript definitions
│   ├── three-examples.d.ts # Three.js examples types
│   └── [type].d.ts     # Other type definitions
│
├── utilities/           # Utility functions
│   └── ui.ts           # UI utilities (cn function)
│
└── webgl/              # WebGL systems
    ├── flowmap/        # Flowmap effects
    ├── postprocessing/ # Post-processing pipeline
    ├── preload/        # Asset preloading
    ├── raf/           # RAF management
    └── tunnel/        # Portal/tunnel system
```

## Key Systems

### 1. Shared Canvas Architecture

The WebGL system uses drei's View component to create a single shared canvas that all WebGL components render to:

- **SharedCanvasProvider**: Wraps the app and provides the canvas
- **useWebGLView**: Hook for creating View-compatible refs
- **View component**: Automatically manages viewport bounds

Benefits:
- Single WebGL context (better performance)
- Automatic bounds management
- Seamless DOM integration
- Responsive by default

### 2. Animation System

Three complementary systems work together:

- **GSAP**: Professional-grade animations and ScrollTrigger
- **Lenis**: Smooth scroll with customizable easing
- **Tempus**: Centralized RAF management with priorities

### 3. Component Architecture

Components follow a consistent pattern:

```
components/
└── MyComponent/
    ├── index.tsx          # Main component
    ├── MyComponent.webgl.tsx # WebGL parts (if any)
    ├── my-component.scss  # Styles (BEM naming)
    └── README.md         # Documentation
```

### 4. Interactive Cursor System (Cuberto Mouse Follower)

A custom cursor implementation providing rich interactive experiences:

- **Multiple States**: pointer, text, icon, media, and custom states
- **Sticky Effect**: Magnetic cursor attachment to elements
- **Media Previews**: Display images/videos in cursor on hover
- **Hardware Accelerated**: Smooth 60fps animations
- **Touch Aware**: Automatically disabled on touch devices

See [Cuberto Mouse Follower Documentation](./cuberto-mouse-follower.md) for implementation details.

### 5. Styling System

- **SCSS with BEM**: `.component__element--modifier`
- **Tailwind CSS**: Utility classes for rapid development
- **CSS Variables**: Dynamic theming support
- **No CSS Modules**: All styles use SCSS files

### 6. Type Safety

- Full TypeScript coverage
- Strict mode enabled
- Custom type definitions for libraries
- Payload CMS types auto-generated

## Data Flow

```
Payload CMS (PostgreSQL)
    ↓
Next.js API Routes
    ↓
React Server Components
    ↓
Client Components
    ↓
WebGL Components (via SharedCanvas)
```

## Performance Optimizations

### Rendering
- Shared WebGL context
- View-based culling
- Automatic LOD management
- Progressive enhancement

### Loading
- Component code splitting
- Asset preloading system
- Progressive texture loading
- GLTF model optimization

### Animation
- RAF-based animation loop
- Priority queue system
- Automatic pause on hidden
- Reduced motion support

### Memory
- Automatic cleanup on unmount
- Texture/geometry disposal
- Event listener management
- WebGL resource pooling

## Development Workflow

### Component Creation

1. Create component folder
2. Implement React component
3. Add WebGL parts (if needed)
4. Create SCSS file with BEM
5. Write documentation
6. Add to component index

### WebGL Component Pattern

```tsx
import { useWebGLView } from '@/hooks/useWebGLView'
import { View } from '@react-three/drei'

export function MyWebGLComponent({ className }) {
  const viewRef = useWebGLView<HTMLDivElement>()

  return (
    <div ref={viewRef} className={className}>
      <View track={viewRef as React.RefObject<HTMLElement>}>
        {/* 3D content here */}
      </View>
    </div>
  )
}
```

### Animation Pattern

```tsx
import { useGSAP } from '@/hooks/useGSAP'
import { useRef } from 'react'

export function AnimatedComponent() {
  const ref = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%'
      }
    })
  }, [])

  return <div ref={ref}>Animated Content</div>
}
```

## Deployment Considerations

### Environment Variables
- `DATABASE_URI`: PostgreSQL connection
- `PAYLOAD_SECRET`: Payload CMS secret
- `NEXT_PUBLIC_SERVER_URL`: Public URL

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- 60fps animations on mid-range devices

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with WebGL support

## Future Enhancements

1. **WebGPU Support**: Next-gen graphics API
2. **Worker-based Physics**: Offload to web workers
3. **AI-driven Animations**: ML-powered motion
4. **Advanced Shaders**: More visual effects
5. **VR/AR Support**: WebXR integration