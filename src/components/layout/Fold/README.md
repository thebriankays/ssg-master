# Fold Component

A sticky scroll component that creates parallax and overlay effects as content scrolls. Perfect for creating immersive hero sections, transitions between content sections, and engaging scroll experiences.

## Features

- **Sticky Scroll Effects**: Content sticks to viewport edges during scroll
- **Parallax Motion**: Optional parallax scrolling with customizable speed
- **Overlay Transitions**: Darkening overlay that fades in/out during scroll
- **Type Variants**: Support for both top and bottom fold behaviors
- **Performance Optimized**: Uses GPU acceleration and will-change for smooth animations
- **Accessibility**: Respects prefers-reduced-motion preference
- **Responsive**: Adapts to different screen sizes
- **Compound Components**: Includes Header, Body, and Footer sub-components

## Usage

### Basic Example

```tsx
import Fold from '@/components/layout/Fold'

function Hero() {
  return (
    <Fold type="top">
      <div className="fold-hero">
        <h1>Welcome to Our Site</h1>
        <p>Scroll down to see the fold effect in action</p>
      </div>
    </Fold>
  )
}
```

### With Compound Components

```tsx
import Fold from '@/components/layout/Fold'

function Section() {
  return (
    <Fold type="bottom" parallaxSpeed={0.3}>
      <Fold.Header sticky>
        <h2>Section Title</h2>
      </Fold.Header>
      
      <Fold.Body>
        <p>Your main content goes here...</p>
      </Fold.Body>
      
      <Fold.Footer>
        <button>Call to Action</button>
      </Fold.Footer>
    </Fold>
  )
}
```

### Disabled Effects

```tsx
<Fold disabled>
  <div>Content without any scroll effects</div>
</Fold>
```

### Custom Configuration

```tsx
<Fold
  type="top"
  parallax={true}
  parallaxSpeed={0.7}
  overlay={true}
  overlayOpacity={0.8}
  start="top center"
  end="bottom center"
  markers={false} // Set to true for debugging
>
  <div>Custom configured fold</div>
</Fold>
```

## Props

### Fold Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display inside the fold |
| `className` | `string` | `''` | Additional CSS classes |
| `type` | `'top' \| 'bottom'` | `'top'` | Fold direction behavior |
| `disabled` | `boolean` | `false` | Disable all scroll effects |
| `parallax` | `boolean` | `true` | Enable parallax scrolling |
| `parallaxSpeed` | `number` | `0.5` | Parallax movement speed (0-1) |
| `overlay` | `boolean` | `true` | Enable overlay fade effect |
| `overlayOpacity` | `number` | `0.6` | Maximum overlay opacity (0-1) |
| `start` | `string` | `'top top'` | ScrollTrigger start position |
| `end` | `string` | `'bottom top'` | ScrollTrigger end position |
| `pinSpacing` | `boolean` | `true` | Add spacing for pinned elements |
| `markers` | `boolean` | `false` | Show ScrollTrigger markers (debugging) |

### Compound Components

#### Fold.Header
- `children`: Content for the header
- `className`: Additional CSS classes
- `sticky`: Make header sticky (default: `true`)

#### Fold.Body
- `children`: Main content
- `className`: Additional CSS classes

#### Fold.Footer
- `children`: Footer content
- `className`: Additional CSS classes
- `sticky`: Make footer sticky (default: `false`)

## CSS Variables

The component exposes CSS custom properties that update with scroll progress:

- `--fold-progress`: Current scroll progress (0 to 1)
- `--fold-progress-inverse`: Inverse of progress (1 to 0)

Use these for custom animations:

```scss
.my-element {
  opacity: calc(var(--fold-progress) * 1);
  transform: translateX(calc(var(--fold-progress) * 100px));
}
```

## Styling

The component uses BEM methodology with these main classes:

- `.fold` - Main container
- `.fold__content` - Content wrapper
- `.fold__overlay` - Overlay element
- `.fold__header` - Header section
- `.fold__body` - Body section
- `.fold__footer` - Footer section

Modifiers:
- `.fold--top` - Top fold type
- `.fold--bottom` - Bottom fold type
- `.fold--disabled` - Disabled state
- `.fold--active` - Active during scroll

## Accessibility

- Overlay is marked with `aria-hidden="true"`
- Respects `prefers-reduced-motion` preference
- Semantic HTML structure maintained
- Keyboard navigation friendly

## Performance Tips

1. **Avoid Heavy Content**: Keep fold content lightweight for smooth scrolling
2. **Optimize Images**: Use properly sized and optimized images
3. **Limit Nesting**: Don't nest multiple Fold components
4. **Test on Mobile**: Always test performance on lower-end devices
5. **Use CSS Transforms**: Leverage the exposed CSS variables for custom effects

## Browser Support

- Modern browsers with ScrollTrigger support
- Graceful degradation when JavaScript is disabled
- Fallback for browsers without sticky positioning