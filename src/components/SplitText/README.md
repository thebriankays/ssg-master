# SplitText Component

A powerful text animation component that splits text into characters, words, or lines for granular animation control using GSAP.

## Features

- Split text by characters, words, lines, or combinations
- Customizable animations with full GSAP support
- Mask option for smooth line reveals
- Imperative API for animation control
- TypeScript support with full type safety
- BEM-styled SCSS for easy customization
- Responsive and accessible

## Usage

```tsx
import { SplitText } from '@/components/animation'

// Basic usage
<SplitText type="words">
  Animate this text word by word
</SplitText>

// Character animation with custom effects
<SplitText
  type="chars"
  animateFrom={{ opacity: 0, y: 50, rotation: -10 }}
  animateTo={{ opacity: 1, y: 0, rotation: 0 }}
  stagger={0.03}
  duration={0.6}
>
  Animated Characters
</SplitText>

// Line animation with mask
<SplitText
  type="lines"
  mask={true}
  animateFrom={{ opacity: 0, y: '100%' }}
  animateTo={{ opacity: 1, y: '0%' }}
>
  Multiple lines of text
  will animate separately
</SplitText>

// Controlled animation
const splitRef = useRef<SplitTextRef>(null)

<SplitText ref={splitRef} type="words">
  Controlled text
</SplitText>

<button onClick={() => splitRef.current?.restart()}>
  Replay
</button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Text content to split and animate |
| `type` | `'chars' \| 'words' \| 'lines' \| 'words,lines' \| 'chars,words' \| 'chars,words,lines'` | `'words'` | How to split the text |
| `className` | `string` | - | CSS class for the container |
| `willAppear` | `boolean` | `true` | Whether to animate on mount |
| `mask` | `boolean` | `false` | Apply overflow hidden to lines |
| `tag` | `keyof JSX.IntrinsicElements` | `'div'` | HTML tag to render |
| `charClassName` | `string` | - | Class for each character |
| `wordClassName` | `string` | - | Class for each word |
| `lineClassName` | `string` | - | Class for each line |
| `delay` | `number` | `0` | Animation delay in seconds |
| `stagger` | `number` | `0.05` | Stagger between elements |
| `duration` | `number` | `0.8` | Animation duration |
| `ease` | `string` | `'power2.out'` | GSAP easing function |
| `animateFrom` | `object` | `{ opacity: 0, y: 20 }` | Initial animation state |
| `animateTo` | `object` | `{ opacity: 1, y: 0 }` | Final animation state |
| `onAnimationStart` | `() => void` | - | Callback when animation starts |
| `onAnimationComplete` | `() => void` | - | Callback when animation completes |

## Ref Methods

When using a ref, you get access to these methods:

- `play()` - Play the animation
- `pause()` - Pause the animation
- `reverse()` - Reverse the animation
- `restart()` - Restart from beginning
- `kill()` - Kill the animation
- `getChars()` - Get character elements
- `getWords()` - Get word elements
- `getLines()` - Get line elements
- `getTimeline()` - Get GSAP timeline

## Animation Properties

The `animateFrom` and `animateTo` props accept these properties:

- `opacity` - Element opacity (0-1)
- `y` - Vertical position (number or string with units)
- `x` - Horizontal position (number or string with units)
- `scale` - Scale transform (number)
- `rotation` - Rotation in degrees (number)
- `skewY` - Vertical skew (number)

## SCSS Customization

The component uses BEM naming convention. Key classes:

- `.split-text` - Root container
- `.split-text__line` - Each line element
- `.split-text__word` - Each word element
- `.split-text__char` - Each character element

Modifiers:
- `.split-text--mask` - When mask is enabled
- `.split-text--will-appear` - When animation is enabled

## Examples

See `SplitText.example.tsx` for comprehensive usage examples.