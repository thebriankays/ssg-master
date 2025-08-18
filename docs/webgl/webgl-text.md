# WebGL Text Component

The WebGL Text component provides SEO-friendly, responsive text rendering in WebGL with custom shader effects, while maintaining the underlying HTML structure for accessibility and search engines.

## Features

- **SEO & Accessibility**: Maintains HTML structure in DOM for screen readers and search engines
- **Responsive Design**: Automatically syncs with CSS styles and viewport changes
- **Custom Shaders**: Built-in effects (gradient, distortion, mask reveal) and support for custom shaders
- **Scroll Animations**: Integration with GSAP ScrollTrigger and Lenis smooth scroll
- **Font Support**: Automatic font weight mapping with Graphie font family
- **Performance**: Optimized rendering with visibility culling and frame-synced updates

## Basic Usage

```tsx
import { WebGLText, WebGLTextView } from '@/components/webgl-text'

// Basic WebGL text
<WebGLText as="h1" fontWeight={700}>
  Hello WebGL
</WebGLText>

// With View wrapper for easier integration
<WebGLTextView 
  as="h2"
  shader="gradient"
  maskReveal
  fontWeight={600}
>
  Gradient Text with Mask Reveal
</WebGLTextView>
```

## Props

### WebGLTextProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'p' \| 'span' \| 'div'` | `'div'` | HTML element type |
| `srOnly` | `boolean` | `false` | Screen reader only (hides HTML visually) |
| `animate` | `boolean` | `true` | Enable animations |
| `animationDelay` | `number` | `0` | Animation delay in seconds |
| `maskReveal` | `boolean` | `false` | Enable mask reveal animation |
| `scrollTrigger` | `boolean` | `true` | Enable scroll-triggered animations |
| `shader` | `'default' \| 'distort' \| 'gradient' \| 'custom'` | `'default'` | Shader type |
| `shaderProps` | `object` | `{}` | Custom shader uniforms |
| `fontWeight` | `100-900` | `400` | Font weight |

## Shader Types

### Default Shader
Basic text rendering with color support:
```tsx
<WebGLText shader="default" color="#ffffff">
  Default Text
</WebGLText>
```

### Gradient Shader
Linear gradient effect:
```tsx
<WebGLText 
  shader="gradient"
  shaderProps={{
    uColorStart: new THREE.Color('#ff0066'),
    uColorEnd: new THREE.Color('#00ff88'),
    uGradientDirection: 0, // 0=horizontal, 1=vertical, 2=diagonal
  }}
>
  Gradient Text
</WebGLText>
```

### Distortion Shader
Animated wave distortion:
```tsx
<WebGLText 
  shader="distort"
  shaderProps={{
    uDistortionAmount: 0.2,
    uDistortionFrequency: 2,
  }}
>
  Wavy Text
</WebGLText>
```

### Custom Shader
Use your own shader material:
```tsx
<WebGLText 
  shader="custom"
  shaderProps={{
    material: <customMaterial />
  }}
>
  Custom Shader Text
</WebGLText>
```

## Animations

### Mask Reveal
Text reveals from bottom to top with a mask effect:
```tsx
<WebGLText maskReveal animationDelay={0.2}>
  Revealing Text
</WebGLText>
```

### Scroll Trigger
Animations triggered when element enters viewport:
```tsx
<WebGLText scrollTrigger maskReveal>
  Scroll to Reveal
</WebGLText>
```

## Responsive Behavior

The component automatically:
- Syncs font size, letter spacing, and line height from CSS
- Updates position based on scroll
- Handles viewport resize
- Maintains 1:1 pixel mapping between screen and WebGL space

## Performance Considerations

- Text meshes are only rendered when visible in viewport
- Animations use GSAP for optimal performance
- Frame-synced updates with React Three Fiber
- Automatic cleanup on unmount

## Examples

### Hero Title
```tsx
<View className="hero">
  <WebGLText
    as="h1"
    className="hero-title"
    shader="gradient"
    maskReveal
    fontWeight={800}
    fontSize={120}
    textAlign="center"
  >
    WEBGL HERO
  </WebGLText>
</View>
```

### Body Text with Staggered Reveal
```tsx
{paragraphs.map((text, i) => (
  <WebGLTextView
    key={i}
    as="p"
    maskReveal
    animationDelay={i * 0.2}
    fontWeight={400}
    fontSize={18}
    lineHeight={1.6}
  >
    {text}
  </WebGLTextView>
))}
```

### Interactive Distortion
```tsx
<WebGLText
  shader="distort"
  shaderProps={{
    uDistortionAmount: mouseX * 0.001,
    uDistortionFrequency: 3,
  }}
>
  Move your mouse
</WebGLText>
```

## Architecture

The WebGL Text system consists of:

1. **HTML Sync**: Maintains HTML element for SEO/accessibility
2. **Dimension Sync**: `useWebGLSync` hook converts screen space to WebGL coordinates
3. **Shader System**: Modular shader materials with uniform management
4. **Animation System**: GSAP integration with scroll triggers
5. **View Integration**: Works seamlessly with drei's View component

## Font Management

Fonts are mapped by weight in the component:
- 100: Graphie_Thin.otf
- 200: Graphie_ExtraLight.otf
- 300: Graphie_Light.otf
- 400: Graphie.otf
- 500: Graphie_Book.otf
- 600: Graphie_SemiBold.otf
- 700: Graphie_Bold.otf
- 800: Graphie_ExtraBold.otf
- 900: Graphie_ExtraBold.otf

To use different fonts, update the `FONT_MAP` in the component.