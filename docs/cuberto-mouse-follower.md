# Cuberto Mouse Follower

The Cuberto Mouse Follower is a custom cursor implementation that provides interactive cursor effects throughout the application.

## Features

- **Multiple cursor states**: pointer, text, icon, media, and custom states
- **Sticky cursor effect**: Cursor can stick to elements
- **Text and icon display**: Show custom text or icons in the cursor
- **Media preview**: Display images or videos in the cursor on hover
- **Smooth animations**: Hardware-accelerated transitions
- **Touch device support**: Automatically hidden on touch devices
- **Accessibility**: Respects reduced motion preferences

## Basic Usage

The mouse follower is automatically initialized through the `MouseFollowerProvider` in the app providers. No additional setup is required.

### Using Data Attributes (Recommended)

```tsx
// Text cursor
<div data-cursor-text="View More">
  Hover to show text
</div>

// Icon cursor (requires SVG sprite)
<div data-cursor-icon="arrow-right">
  Hover to show icon
</div>

// Sticky cursor
<div data-cursor-stick>
  Cursor sticks to this element
</div>

// Image preview
<div data-cursor-img="/path/to/image.jpg">
  Hover to preview image
</div>

// Video preview
<div data-cursor-video="/path/to/video.mp4">
  Hover to preview video
</div>
```

### Using the Hook (Advanced)

```tsx
import { useMouseFollower } from '@/components/mouse-follower'

export function MyComponent() {
  const {
    setText,
    removeText,
    setIcon,
    removeIcon,
    addState,
    removeState,
    setStick,
    removeStick,
    setImg,
    removeImg,
    setVideo,
    removeVideo
  } = useMouseFollower()

  return (
    <div
      onMouseEnter={() => setText('Custom Text')}
      onMouseLeave={() => removeText()}
    >
      Hover for custom cursor
    </div>
  )
}
```

## Cursor States

### Built-in States

- **Default**: Standard circular cursor
- **Pointer** (`-pointer`): Shown on links and buttons
- **Text** (`-text`): Displays custom text
- **Icon** (`-icon`): Displays an icon
- **Media** (`-media`): Shows image/video preview
- **Hidden** (`-hidden`): Cursor is hidden
- **Active** (`-active`): When clicking

### Custom States

You can add custom states using the `addState` method:

```tsx
// Add custom state
addState('-inverse')  // Adds class 'mf-cursor -inverse'
addState('-large')    // Adds class 'mf-cursor -large'
addState('-opaque')   // Adds class 'mf-cursor -opaque'
```

## Styling

The mouse follower styles are defined in `src/components/mouse-follower/mouse-follower.scss`. You can customize the appearance by:

1. **Modifying existing states** in the SCSS file
2. **Adding new custom states**:

```scss
.mf-cursor {
  // Your custom state
  &.-custom {
    .mf-cursor-inner {
      width: 120px;
      height: 120px;
      background-color: rgba(255, 0, 0, 0.2);
    }
  }
}
```

## Advanced Features

### Sticky Cursor

The sticky cursor effect makes the cursor magnetically attach to elements:

```tsx
<div 
  data-cursor-stick
  data-cursor-stick-delta="0.5"  // Optional: control stick strength
>
  Magnetic button
</div>
```

### Programmatic Sticky

```tsx
const ref = useRef<HTMLElement>(null)
const { setStick, removeStick } = useMouseFollower()

// Set sticky
setStick(ref.current)

// Remove sticky
removeStick()
```

### Media Previews

For media previews, ensure your images and videos are accessible:

```tsx
// Image preview with custom size
<div 
  data-cursor-img="/image.jpg"
  onMouseEnter={() => addState('-large')}
  onMouseLeave={() => removeState('-large')}
>
  Hover for large image preview
</div>
```

## Performance Considerations

1. **Use data attributes** when possible - they're more performant than JavaScript event handlers
2. **Avoid excessive state changes** - Batch state updates when possible
3. **Media optimization** - Use optimized images for cursor previews
4. **Touch devices** - The cursor is automatically disabled on touch devices

## Accessibility

- The cursor respects `prefers-reduced-motion` settings
- Uses `pointer-events: none` to prevent interference with interactions
- Hidden from screen readers
- Maintains standard cursor functionality

## Demo

See a full demo of all cursor features at `/mouse-follower-demo`

## Troubleshooting

### Cursor not appearing
1. Check that `MouseFollowerProvider` is in your provider hierarchy
2. Verify you're not on a touch device
3. Check browser console for errors
4. Ensure CSS is properly imported

### Cursor states not working
1. Verify data attributes are spelled correctly
2. Check that the MouseFollower instance is initialized
3. For icons, ensure SVG sprite is available

### Performance issues
1. Reduce the number of sticky elements
2. Optimize media preview sizes
3. Use CSS transforms instead of position changes