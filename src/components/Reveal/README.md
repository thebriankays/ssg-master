# Reveal Components

A collection of high-performance reveal animation components built with GSAP and React. These components provide various animation effects triggered by scroll or on mount.

## Components

### RevealText

Animates text with various splitting options (characters, words, lines) or block reveal.

```tsx
import { RevealText } from '@/components/Reveal'

<RevealText
  type="lines"
  stagger={0.1}
  from="bottom"
  duration={1}
>
  Your text content here
</RevealText>
```

**Props:**
- `type`: 'chars' | 'words' | 'lines' | 'block' (default: 'lines')
- `stagger`: Delay between animated elements (default: 0.1)
- `from`: Animation direction - 'bottom' | 'top' | 'left' | 'right' (default: 'bottom')
- `distance`: Distance to animate from (default: '100%')
- `opacity`: Animate opacity (default: true)
- `rotate`: Rotation angle (default: 0)
- `scale`: Scale factor (default: 1)

### RevealImage

Reveals images with various effects including scale, blur, and clip-path animations.

```tsx
import { RevealImage } from '@/components/Reveal'

<RevealImage
  src="/path/to/image.jpg"
  alt="Description"
  scale={1.2}
  blur={10}
  clipPath="horizontal"
  parallax={0.1}
/>
```

**Props:**
- All Next.js Image props
- `scale`: Initial scale (default: 1.2)
- `blur`: Initial blur in pixels (default: 10)
- `clipPath`: 'horizontal' | 'vertical' | 'diagonal' | 'circle' | 'none'
- `parallax`: Parallax movement factor (default: 0)

### RevealBox

A versatile wrapper component for animating any content with transform animations or mask reveals.

```tsx
import { RevealBox } from '@/components/Reveal'

<RevealBox
  from="center"
  scale={0.8}
  mask={true}
  maskDirection="horizontal"
>
  <YourContent />
</RevealBox>
```

**Props:**
- `from`: 'bottom' | 'top' | 'left' | 'right' | 'center'
- `distance`: Distance to animate from
- `scale`, `rotate`, `rotateX`, `rotateY`: Transform values
- `mask`: Enable mask reveal effect
- `maskDirection`: 'horizontal' | 'vertical' | 'diagonal'

### RevealTransform

Advanced 3D transform animations with parallax effects and filter animations.

```tsx
import { RevealTransform } from '@/components/Reveal'

<RevealTransform
  rotateX={45}
  rotateY={-30}
  translateZ={100}
  perspective={1000}
  blur={20}
  parallax={true}
  scrub={true}
>
  <YourContent />
</RevealTransform>
```

**Props:**
- `perspective`: CSS perspective value (default: 1000)
- `rotateX`, `rotateY`, `rotateZ`: 3D rotation values
- `translateX`, `translateY`, `translateZ`: Translation values
- `scale`, `scaleX`, `scaleY`, `scaleZ`: Scale values
- `blur`, `brightness`, `contrast`, `saturate`: Filter effects
- `parallax`: Enable parallax scrolling
- `scrub`: Tie animation directly to scroll progress

## Common Props

All components share these common props:

- `scrollTrigger`: Enable scroll-triggered animation (default: true)
- `start`: ScrollTrigger start position (default: 'top 80%')
- `end`: ScrollTrigger end position (default: 'bottom 20%')
- `duration`: Animation duration in seconds (default: 1-1.2)
- `delay`: Animation delay in seconds (default: 0)
- `ease`: GSAP easing function (default: 'power3.out')
- `once`: Animate only once (default: true)
- `markers`: Show ScrollTrigger markers for debugging

## Performance Considerations

1. **Text Splitting**: The RevealText component splits text into spans for animation. This is reverted after animation completes to maintain SEO and accessibility.

2. **Lazy Loading**: RevealImage uses Next.js Image component with lazy loading by default.

3. **Will-change**: Components use `will-change` CSS property for optimized animations.

4. **Timeline Management**: All animations are properly cleaned up on unmount to prevent memory leaks.

## Examples

### Hero Text Animation
```tsx
<RevealText
  as="h1"
  type="lines"
  stagger={0.1}
  from="bottom"
  distance="120%"
  duration={1.2}
  rotate={5}
>
  Welcome to Our Website
</RevealText>
```

### Image Gallery
```tsx
<div className="grid grid-cols-3 gap-4">
  {images.map((image, index) => (
    <RevealImage
      key={image.id}
      src={image.src}
      alt={image.alt}
      scale={1.1}
      clipPath="vertical"
      delay={index * 0.1}
    />
  ))}
</div>
```

### Card Reveal
```tsx
<RevealBox
  mask={true}
  maskDirection="diagonal"
  maskDuration={1}
>
  <Card>
    <CardContent />
  </Card>
</RevealBox>
```

### 3D Card Hover Effect
```tsx
<RevealTransform
  rotateX={20}
  rotateY={-20}
  perspective={1000}
  scrub={0.5}
  parallax={true}
>
  <Card3D />
</RevealTransform>
```