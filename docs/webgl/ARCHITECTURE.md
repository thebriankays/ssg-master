# WebGL Architecture: Hybrid Shared Canvas

This document describes the correct WebGL architecture for the SSG project, using a single shared canvas with both tunnel-rat (for global effects) and drei View (for DOM-aligned 3D widgets).

## Core Concept

**One Canvas, Two Rendering Patterns:**
- **WebGLPortal (tunnel-rat)**: Global layers like backgrounds, gradients, fluid effects
- **WebGLView (drei View)**: Block-scoped 3D widgets aligned to DOM elements

## Architecture Diagram

```
[DOM App]
  └─ Components
      ├─ WebGLView (carousel) --> shared canvas (scissored viewport)
      ├─ WebGLView (product) --> shared canvas (scissored viewport)
      └─ WebGLPortal (fluid) --> shared canvas (global layer)

[Shared WebGL Canvas (fixed, fullscreen)]
  ├─ <View.Port />         // Renders all Views FIRST (clears their rectangles)
  ├─ <WebGLTunnel.Out />   // Global layers drawn AFTER (visible above clears)
  └─ <PostProcessing />    // Optional global effects over everything
```

## Critical Render Order

The order in `webgl/components/canvas/webgl.tsx` MUST be:

```tsx
<FlowmapProvider>
  {/* 1) Render Views first - they clear their scissor rects */}
  <View.Port />
  
  {/* 2) Then render tunneled global layers on top */}
  <Suspense>
    <WebGLTunnel.Out />
  </Suspense>
  
  {/* 3) Optional global post-processing over everything */}
  {postprocessing && <PostProcessing />}
</FlowmapProvider>
```

## Why The White Screen Happened

`<View>` clears its scissor rectangle. If you render tunnel content first, then Views, the View's clear operation wipes those pixels to transparent, which composites as white over your page background.

**Solution**: Render `<View.Port />` before `<WebGLTunnel.Out />` so global layers draw after the clears.

## When To Use Each Pattern

| Need | Use | Why |
|------|-----|-----|
| Global fluid/gradient/glow effects | `WebGLPortal` | Single persistent scene, no per-block overhead |
| Block-local 3D aligned to DOM | `WebGLView` | Isolated scissored viewport tied to DOM rect |
| Both on same page | Both | Works perfectly with correct render order |

## Canvas Configuration

```tsx
// webgl/components/canvas/webgl.tsx
<Canvas
  gl={{
    precision: 'highp',
    powerPreference: 'high-performance',
    antialias: dpr < 2,
    alpha: true,
    // DO NOT USE these - they cause compositing issues:
    // preserveDrawingBuffer: true,
    // premultipliedAlpha: false,
  }}
  onCreated={({ gl }) => {
    gl.setClearColor(0x000000, 0) // Transparent clear
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.NoToneMapping
  }}
  // ... rest of config
>
```

## Component Wrappers

### WebGLView (for widgets)

```tsx
// components/WebGLView/index.tsx
export const WebGLView = forwardRef<HTMLDivElement, ...>(
  ({ children, className, style, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    
    return (
      <>
        <div
          ref={(el) => {
            containerRef.current = el
            if (typeof ref === 'function') ref(el)
            else if (ref) ref.current = el
          }}
          className={className}
          style={style}
        />
        <View track={containerRef} {...props}>
          {children}
        </View>
      </>
    )
  }
)
```

### WebGLPortal (for global effects)

```tsx
// webgl/components/portal/index.tsx
export function WebGLPortal({ children }: PropsWithChildren) {
  const { WebGLTunnel } = useCanvas()
  const ContextBridge = useContextBridge(TransformContext)
  const uuid = useId()
  
  return (
    <WebGLTunnel.In>
      <ContextBridge key={uuid}>{children}</ContextBridge>
    </WebGLTunnel.In>
  )
}
```

## Rules For Success

### Global Rules
1. **One shared canvas** - Created once, fixed fullscreen position
2. **One `<View.Port />`** - Only one instance globally in the canvas
3. **Correct render order** - View.Port → WebGLTunnel.Out → PostProcessing
4. **Clean GL settings** - No preserveDrawingBuffer or premultipliedAlpha

### For Every View Widget
1. **Real DOM ref** - Must track a useRef element, not a callback
2. **Own camera** - Each View scene needs its own camera with makeDefault
3. **Non-zero dimensions** - Container must have actual width/height via CSS
4. **Event handling** - Use invisible event plane or enable pointer-events

### For Global Effects
1. **Use WebGLPortal only** - Don't mix View and Portal in same component
2. **Overlay materials** - Set depthWrite={false}, depthTest={false}, toneMapped={false}
3. **Draw order** - Renders after Views thanks to correct canvas order

## Example: Carousel Block

```tsx
export function WebGLCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePlane, setActivePlane] = useState(null)
  
  return (
    <>
      {/* DOM element that View will track */}
      <div 
        ref={containerRef}
        className="webgl-carousel"
        data-cursor={activePlane === null ? "-drag" : ""}
      />
      
      {/* View renders within the tracked DOM bounds */}
      <View track={containerRef}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />
        <CarouselContent {...props} />
      </View>
    </>
  )
}
```

## Example: Global Fluid Effect

```tsx
export function GlobalFluid() {
  return (
    <WebGLPortal>
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <fluidMaterial />
      </mesh>
    </WebGLPortal>
  )
}
```

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Canvas turns white | View clearing over tunnel content | Ensure View.Port renders before WebGLTunnel.Out |
| View not aligned to DOM | Wrong ref type | Use real DOM ref, not useRect callback |
| Widget unresponsive | No pointer events | Add invisible event plane or enable .interactive class |
| Z-fighting/occlusion | Depth buffer conflicts | Set depthWrite={false} on overlay materials |
| Compositing artifacts | Wrong GL flags | Remove preserveDrawingBuffer and premultipliedAlpha |

## Migration Checklist

- [ ] View.Port before WebGLTunnel.Out in canvas component
- [ ] Remove preserveDrawingBuffer and premultipliedAlpha from GL options
- [ ] All Views use track={containerRef} with real DOM refs
- [ ] Each View has its own camera with makeDefault
- [ ] Overlay materials have depthWrite={false}, depthTest={false}
- [ ] Split mixed components into WebGLView and WebGLPortal
- [ ] Only one View.Port instance globally
