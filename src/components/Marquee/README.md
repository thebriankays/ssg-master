# Marquee Component

A high-performance, customizable marquee (infinite scroll) animation component built with React and TypeScript. Uses RequestAnimationFrame (RAF) for smooth 60fps animations and includes advanced features like scroll velocity integration.

## Features

- 🎯 **RAF-based animation** - Smooth 60fps performance using custom `useTempus` hook
- 🎨 **BEM-styled SCSS** - Clean, maintainable styling with BEM methodology
- 🚀 **Scroll velocity integration** - Speed adjusts based on page scroll speed
- ⏸️ **Pause on hover** - Optional interaction for better UX
- 🔄 **Bidirectional** - Support for normal and reversed scrolling
- 📏 **Flexible repeat count** - Control how many times content is duplicated
- 🎛️ **Speed control** - Precise pixels-per-second speed setting
- 📱 **Responsive** - Works across all device sizes
- ♿ **Accessible** - Respects prefers-reduced-motion

## Installation

The component is already part of the project. Import it from the animation components:

```tsx
import { Marquee } from '@/components/animation/Marquee'
```

## Basic Usage

```tsx
<Marquee speed={50}>
  <div>Your scrolling content here</div>
</Marquee>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The content to scroll |
| `speed` | `number` | `50` | Base scroll speed in pixels per second |
| `repeat` | `number` | `2` | Number of times to repeat content for seamless loop |
| `pauseOnHover` | `boolean` | `false` | Whether to pause animation on mouse hover |
| `reversed` | `boolean` | `false` | Reverse the scroll direction |
| `scrollVelocity` | `boolean` | `false` | Enable scroll velocity integration |
| `scrollVelocityMultiplier` | `number` | `1` | Multiplier for scroll velocity effect |
| `gap` | `number` | `0` | Gap between repeated items in pixels |
| `className` | `string` | `''` | Additional CSS classes |

## Examples

### Basic Text Marquee

```tsx
<Marquee speed={50}>
  <div style={{ display: 'flex', gap: '2rem' }}>
    <span>Breaking News</span>
    <span>•</span>
    <span>Latest Updates</span>
    <span>•</span>
  </div>
</Marquee>
```

### Logo/Image Carousel

```tsx
<Marquee 
  speed={30} 
  repeat={3} 
  gap={40}
  className="marquee--lg"
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
    <img src="/logo1.svg" alt="Partner 1" height="40" />
    <img src="/logo2.svg" alt="Partner 2" height="40" />
    <img src="/logo3.svg" alt="Partner 3" height="40" />
  </div>
</Marquee>
```

### Interactive with Pause on Hover

```tsx
<Marquee 
  speed={60} 
  pauseOnHover={true}
>
  <div>Hover to pause this scrolling text</div>
</Marquee>
```

### Scroll Velocity Integration

When enabled, the marquee speeds up as you scroll the page:

```tsx
<Marquee 
  speed={30} 
  scrollVelocity={true}
  scrollVelocityMultiplier={2}
>
  <div>This speeds up when you scroll!</div>
</Marquee>
```

### Reversed Direction

```tsx
<Marquee 
  speed={40} 
  reversed={true}
>
  <div>This scrolls from left to right</div>
</Marquee>
```

## Styling

The component uses BEM naming convention with the following structure:

```scss
.marquee              // Block: Main container
.marquee__inner       // Element: Inner scrolling container
.marquee__content     // Element: Content wrapper for each repeat
.marquee--paused      // Modifier: Paused state
.marquee--reversed    // Modifier: Reversed direction
```

### Size Variants

Pre-built size classes are available:

- `.marquee--sm` - Small (40px height)
- `.marquee--md` - Medium (60px height)
- `.marquee--lg` - Large (80px height)
- `.marquee--xl` - Extra large (100px height)

### Customization

```scss
// Remove edge masks
.marquee--no-mask

// Custom styling example
.my-custom-marquee {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  .marquee__content {
    font-weight: bold;
    text-transform: uppercase;
  }
}
```

## Advanced Usage

### Multiple Synchronized Marquees

```tsx
<div>
  <Marquee speed={30}>
    <div>Top marquee content</div>
  </Marquee>
  
  <Marquee speed={30} reversed={true}>
    <div>Bottom marquee scrolls opposite</div>
  </Marquee>
</div>
```

### Dynamic Content

The marquee automatically adjusts when content changes:

```tsx
const [items, setItems] = useState(['Item 1', 'Item 2'])

return (
  <Marquee speed={50} gap={20}>
    <div style={{ display: 'flex', gap: '20px' }}>
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  </Marquee>
)
```

## Performance Considerations

1. **RAF-based animation** - Uses `requestAnimationFrame` for optimal performance
2. **GPU acceleration** - Transforms are GPU-accelerated for smooth motion
3. **Automatic cleanup** - Properly cleans up animation frames on unmount
4. **Efficient re-renders** - Only updates when necessary

## Accessibility

- Respects `prefers-reduced-motion` media query
- Content remains readable when animation is disabled
- Hover interactions are keyboard accessible

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported (uses modern JavaScript features)

## Dependencies

The component relies on these custom hooks from the project:

- `useTempus` - RAF-based animation loop
- `useScrollVelocity` - Scroll velocity detection

## Tips

1. Keep content concise for better readability
2. Use appropriate speeds (30-80px/s works well for most cases)
3. Consider mobile users - test on various screen sizes
4. Use `gap` prop instead of CSS margins for consistent spacing
5. For images, ensure they're optimized and have consistent heights

## Troubleshooting

**Content appears cut off**
- Ensure the marquee container has proper width
- Check if parent elements have `overflow: hidden`

**Animation is choppy**
- Lower the speed value
- Reduce the amount of content
- Check for performance-heavy operations on the page

**Scroll velocity not working**
- Ensure `scrollVelocity` prop is set to `true`
- Check that the page has scrollable content
- Verify scroll events aren't being prevented