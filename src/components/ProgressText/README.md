# ProgressText Component

A React component that reveals text word by word based on scroll progress. Each word animates individually as the user scrolls, creating an engaging reading experience.

## Features

- 🎯 **Scroll-triggered animations** - Words reveal based on scroll position
- ⚡ **Performance optimized** - Uses CSS transforms and opacity for smooth 60fps animations
- 🎨 **Customizable animations** - Multiple built-in animation styles
- 📱 **Responsive** - Works seamlessly across all device sizes
- ♿ **Accessible** - Respects prefers-reduced-motion settings
- 🔧 **Flexible API** - Extensive customization options
- 📊 **Progress tracking** - onChange callback for custom integrations

## Installation

```bash
npm install gsap
```

## Basic Usage

```tsx
import { ProgressText } from '@/components/animation/ProgressText'

function MyComponent() {
  return (
    <ProgressText>
      Your text content will reveal word by word as users scroll.
    </ProgressText>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | required | Text content to animate |
| `className` | `string` | `''` | Additional CSS classes |
| `start` | `string` | `'top bottom'` | ScrollTrigger start position |
| `end` | `string` | `'bottom top'` | ScrollTrigger end position |
| `onChange` | `(visibleWords: number, progress: number) => void` | - | Callback when visibility changes |
| `transitionDuration` | `number` | `600` | Animation duration in ms |
| `transitionDelay` | `number` | `50` | Delay between word animations in ms |
| `transitionEasing` | `string` | `'cubic-bezier(0.4, 0, 0.2, 1)'` | CSS easing function |
| `animateSpaces` | `boolean` | `false` | Whether to animate whitespace |
| `wordSeparator` | `RegExp` | `/\s+/` | Pattern to split words |
| `visibilityThreshold` | `number` | `0` | Progress offset (0-1) for word visibility |

## Animation Styles

Apply these CSS classes for different animation effects:

### Fade Up (Default)
```tsx
<ProgressText className="progress-text--fade-up">
  Words fade in from below
</ProgressText>
```

### Fade Down
```tsx
<ProgressText className="progress-text--fade-down">
  Words fade in from above
</ProgressText>
```

### Scale
```tsx
<ProgressText className="progress-text--scale progress-text--no-blur">
  Words scale up as they appear
</ProgressText>
```

### Rotate
```tsx
<ProgressText className="progress-text--rotate">
  Words rotate in with style
</ProgressText>
```

### Skew
```tsx
<ProgressText className="progress-text--skew">
  Words skew in dynamically
</ProgressText>
```

## Advanced Examples

### Custom Trigger Points

Control when the animation starts and ends:

```tsx
<ProgressText
  start="top center"    // Start when top hits center
  end="bottom center"   // End when bottom leaves center
>
  Precise control over animation timing
</ProgressText>
```

### Progress Tracking

Monitor animation progress for custom integrations:

```tsx
function MyComponent() {
  const [progress, setProgress] = useState(0)
  
  const handleChange = (visibleWords, progress) => {
    console.log(`${visibleWords} words visible, ${progress * 100}% complete`)
    setProgress(progress)
  }
  
  return (
    <ProgressText onChange={handleChange}>
      Track my animation progress
    </ProgressText>
  )
}
```

### Custom Timing

Fine-tune the animation feel:

```tsx
<ProgressText
  transitionDuration={800}
  transitionDelay={100}
  transitionEasing="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
>
  Bouncy animations with custom timing
</ProgressText>
```

### Performance Optimization

For long texts, use the optimize class:

```tsx
<ProgressText className="progress-text--optimize">
  Very long text content...
</ProgressText>
```

### Custom Word Splitting

Split by different patterns:

```tsx
<ProgressText wordSeparator={/[,.\s]+/}>
  Split,by,commas.and.periods.too
</ProgressText>
```

## CSS Customization

Override CSS custom properties for fine control:

```scss
.my-custom-progress-text {
  --word-opacity-hidden: 0.2;
  --word-opacity-visible: 1;
  --word-transform-hidden: translateY(40px) rotate(5deg);
  --word-transform-visible: translateY(0) rotate(0);
  --word-filter-hidden: blur(8px);
  --word-filter-visible: blur(0);
}
```

## Styling Individual Words

Access word data attributes for targeted styling:

```scss
.progress-text__word[data-word="important"] {
  color: #ff0000;
  font-weight: bold;
}

.progress-text__word[data-index="0"] {
  font-size: 1.5em; // Make first word larger
}
```

## Performance Tips

1. **Use the optimize class** for texts with 50+ words
2. **Limit concurrent animations** on the same page
3. **Consider using `visibilityThreshold`** to start animations earlier
4. **Reduce `transitionDelay`** for faster-paced animations
5. **Disable blur effects** on lower-end devices with `--no-blur`

## Accessibility

The component automatically:
- Respects `prefers-reduced-motion` settings
- Maintains semantic HTML structure
- Ensures text remains readable during animation

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14+
- Chrome Android 88+

## Common Patterns

### Hero Text
```tsx
<h1>
  <ProgressText 
    className="hero-text progress-text--scale"
    transitionDuration={1000}
    transitionDelay={100}
  >
    Welcome to our amazing website
  </ProgressText>
</h1>
```

### Article Introduction
```tsx
<ProgressText
  start="top 80%"
  end="top 20%"
  visibilityThreshold={0.2}
>
  {articleIntroText}
</ProgressText>
```

### Call to Action
```tsx
<ProgressText
  onChange={(words) => {
    if (words === totalWords) {
      showCTAButton()
    }
  }}
>
  Read this important message before continuing
</ProgressText>
```

## Troubleshooting

### Text not animating
- Ensure the text container has sufficient height for scrolling
- Check that GSAP and ScrollTrigger are properly imported
- Verify the component is receiving a string as children

### Choppy animations
- Apply the `progress-text--optimize` class
- Reduce the number of animated elements on the page
- Consider increasing `transitionDelay` to stagger animations more

### Words appearing too early/late
- Adjust the `start` and `end` props
- Use `visibilityThreshold` to offset the progress calculation
- Check parent container positioning