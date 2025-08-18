# Scrollbar Component

A custom scrollbar component that integrates with the Lenis smooth scroll system, providing a modern and customizable scrolling experience.

## Features

- **Smooth Scroll Integration**: Seamlessly works with Lenis smooth scrolling
- **Orientation Support**: Vertical and horizontal scrollbar options
- **Auto-hide Functionality**: Show on hover with customizable delay
- **Click to Jump**: Click anywhere on the track to jump to that position
- **Drag to Scroll**: Drag the thumb to scroll through content
- **Fully Customizable**: Size, colors, and behavior can be customized
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Supports reduced motion preferences
- **Theme Support**: Works with light/dark themes

## Usage

### Basic Usage

```tsx
import { Scrollbar } from '@/components/layout/Scrollbar'

function App() {
  return (
    <>
      {/* Your scrollable content */}
      <div className="content">
        {/* ... */}
      </div>
      
      {/* Add custom scrollbar */}
      <Scrollbar />
    </>
  )
}
```

### Horizontal Scrollbar

```tsx
<Scrollbar orientation="horizontal" />
```

### Always Visible Scrollbar

```tsx
<Scrollbar alwaysVisible={true} />
```

### Custom Styling

```tsx
<Scrollbar
  size={12}
  trackPadding={2}
  className="custom-scrollbar"
  trackStyle={{
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  }}
  thumbStyle={{
    backgroundColor: '#3b82f6'
  }}
/>
```

### With Custom Hide Delay

```tsx
<Scrollbar
  hoverable={true}
  hideDelay={2000} // Hide after 2 seconds
/>
```

### Disable Click to Jump

```tsx
<Scrollbar clickToJump={false} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Scrollbar orientation |
| `hoverable` | `boolean` | `true` | Show scrollbar only on hover |
| `alwaysVisible` | `boolean` | `false` | Always show the scrollbar |
| `size` | `number` | `8` | Scrollbar width (vertical) or height (horizontal) in pixels |
| `trackPadding` | `number` | `4` | Padding around the scrollbar track |
| `className` | `string` | - | Additional CSS class |
| `clickToJump` | `boolean` | `true` | Enable click on track to jump to position |
| `zIndex` | `number` | `50` | Z-index of the scrollbar |
| `trackStyle` | `React.CSSProperties` | - | Custom styles for the track |
| `thumbStyle` | `React.CSSProperties` | - | Custom styles for the thumb |
| `hideDelay` | `number` | `1000` | Delay before hiding (when hoverable) |

## Styling

The component uses BEM methodology for CSS classes:

- `.scrollbar` - Main container
- `.scrollbar__track` - Track element
- `.scrollbar__thumb` - Thumb (draggable) element
- `.scrollbar--vertical` - Vertical orientation modifier
- `.scrollbar--horizontal` - Horizontal orientation modifier
- `.scrollbar--hoverable` - Auto-hide modifier
- `.scrollbar--visible` - Visible state
- `.scrollbar--dragging` - Dragging state

### Custom Themes

Apply custom themes using the wrapper class:

```tsx
<div className="scrollbar-theme--minimal">
  <Scrollbar />
</div>
```

Available themes:
- `scrollbar-theme--minimal` - Minimal appearance
- `scrollbar-theme--accent` - Uses CSS variables for primary color
- `scrollbar-theme--glass` - Glassmorphism effect

### CSS Variables

The component respects these CSS variables:

```css
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
}
```

## Integration with Lenis

The scrollbar automatically integrates with the Lenis smooth scroll instance. Make sure Lenis is initialized before using the scrollbar:

```tsx
import { useLenis } from '@/hooks/useLenis'

function App() {
  // Initialize Lenis
  const lenis = useLenis({ root: true })
  
  return (
    <>
      <YourContent />
      <Scrollbar />
    </>
  )
}
```

## Examples

### Full Page Scrollbar

```tsx
function FullPageExample() {
  return (
    <div className="app">
      <header>...</header>
      <main>
        <section style={{ height: '200vh' }}>
          Long scrollable content
        </section>
      </main>
      <Scrollbar />
    </div>
  )
}
```

### Container Scrollbar

```tsx
function ContainerExample() {
  return (
    <div className="container" style={{ 
      height: '400px', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div className="content" style={{ height: '1000px' }}>
        Scrollable content
      </div>
      <Scrollbar />
    </div>
  )
}
```

### Dual Scrollbars

```tsx
function DualScrollbars() {
  return (
    <div className="dual-scroll-container">
      <div className="content">
        Wide and tall content
      </div>
      <Scrollbar orientation="vertical" />
      <Scrollbar orientation="horizontal" />
    </div>
  )
}
```

### With Animation

```tsx
function AnimatedScrollbar() {
  return (
    <>
      <YourContent />
      <Scrollbar
        className="animated-scrollbar"
        thumbStyle={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </>
  )
}
```

## Performance

- The component uses `requestAnimationFrame` through Lenis for smooth updates
- Thumb position calculations are optimized and cached
- Event listeners are properly cleaned up on unmount
- The scrollbar only renders when Lenis is available

## Accessibility

- Supports `prefers-reduced-motion` media query
- High contrast mode support
- Keyboard navigation works through native scroll (no custom keyboard handling needed)

## Browser Support

- Modern browsers with ES6+ support
- Requires `ResizeObserver` API
- Falls back gracefully on mobile devices