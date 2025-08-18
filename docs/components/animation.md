# Animation Components

Animation components bring motion and interactivity to your interfaces with smooth, performant animations powered by GSAP.

## SplitText Component

Animates text by splitting it into individual characters, words, or lines with customizable entrance effects.

### Import

```tsx
import { SplitText } from '@/components/split-text'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string \| React.ReactNode` | required | Text content to animate |
| `type` | `'chars' \| 'words' \| 'lines'` | `'chars'` | How to split the text |
| `delay` | `number` | `0` | Animation start delay in seconds |
| `stagger` | `number` | `0.05` | Delay between each element |
| `duration` | `number` | `0.8` | Animation duration in seconds |
| `ease` | `string` | `'power2.out'` | GSAP easing function |
| `from` | `object` | `{ opacity: 0, y: 20 }` | Starting animation values |
| `to` | `object` | `{ opacity: 1, y: 0 }` | Ending animation values |
| `className` | `string` | - | Additional CSS classes |
| `onComplete` | `() => void` | - | Callback when animation completes |

### Usage Examples

#### Basic Character Animation
```tsx
<SplitText type="chars">
  Welcome to our website
</SplitText>
```

#### Word-by-Word Reveal
```tsx
<SplitText 
  type="words"
  stagger={0.1}
  duration={0.6}
  from={{ opacity: 0, y: 40 }}
>
  Discover amazing products and services
</SplitText>
```

#### Custom Easing and Timing
```tsx
<SplitText 
  type="lines"
  delay={0.5}
  stagger={0.2}
  duration={1}
  ease="power3.inOut"
  className="text-4xl font-bold"
>
  Innovation drives us forward.
  Excellence defines our work.
  Success follows dedication.
</SplitText>
```

#### With Rotation Effect
```tsx
<SplitText 
  type="chars"
  from={{ opacity: 0, rotateY: 90, scale: 0.5 }}
  to={{ opacity: 1, rotateY: 0, scale: 1 }}
  stagger={0.03}
  duration={0.5}
>
  ANIMATED
</SplitText>
```

### Styling Customization

```tsx
// Hero title animation
<SplitText 
  type="words"
  className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
>
  Next Generation Platform
</SplitText>

// Subtle paragraph animation
<SplitText 
  type="lines"
  className="text-lg text-gray-600 max-w-2xl mx-auto"
  from={{ opacity: 0, y: 10 }}
  duration={0.4}
>
  Build faster. Scale smarter. Deliver excellence.
</SplitText>
```

### Best Practices

1. **Choose appropriate split type**: Use 'chars' for short text, 'words' for sentences, 'lines' for paragraphs
2. **Keep animations subtle**: Avoid overwhelming users with excessive motion
3. **Consider performance**: Limit the number of animated elements on screen
4. **Test on mobile**: Ensure animations perform well on lower-powered devices
5. **Provide reduced motion support**: Respect user preferences for reduced animations

## Marquee Component

Creates an infinite scrolling effect for content, perfect for showcasing logos, testimonials, or announcements.

### Import

```tsx
import { Marquee } from '@/components/marquee'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Content to scroll |
| `speed` | `number` | `50` | Scroll speed (pixels per second) |
| `direction` | `'left' \| 'right' \| 'up' \| 'down'` | `'left'` | Scroll direction |
| `pauseOnHover` | `boolean` | `true` | Pause animation on hover |
| `gradient` | `boolean` | `true` | Add fade gradient at edges |
| `gap` | `number` | `0` | Gap between repeated content |
| `className` | `string` | - | Additional CSS classes |
| `duplicates` | `number` | `2` | Number of content duplicates |

### Usage Examples

#### Basic Logo Marquee
```tsx
<Marquee speed={30}>
  <div className="flex gap-8 items-center">
    <img src="/logo1.png" alt="Partner 1" className="h-12" />
    <img src="/logo2.png" alt="Partner 2" className="h-12" />
    <img src="/logo3.png" alt="Partner 3" className="h-12" />
  </div>
</Marquee>
```

#### Testimonial Carousel
```tsx
<Marquee 
  direction="left"
  speed={40}
  gap={32}
  className="py-8"
>
  {testimonials.map((testimonial) => (
    <div key={testimonial.id} className="w-96 p-6 bg-white rounded-lg shadow">
      <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
      <p className="font-semibold">{testimonial.author}</p>
    </div>
  ))}
</Marquee>
```

#### Vertical News Ticker
```tsx
<Marquee 
  direction="up"
  speed={25}
  gradient={false}
  className="h-64 overflow-hidden"
>
  {newsItems.map((item) => (
    <div key={item.id} className="py-4 border-b">
      <h4 className="font-semibold">{item.title}</h4>
      <p className="text-sm text-gray-500">{item.date}</p>
    </div>
  ))}
</Marquee>
```

### Styling Customization

```tsx
// Gradient edges marquee
<Marquee 
  gradient={true}
  className="relative before:absolute before:left-0 before:top-0 before:w-32 before:h-full before:bg-gradient-to-r before:from-white before:to-transparent before:z-10"
>
  {content}
</Marquee>

// Dark theme marquee
<Marquee 
  className="bg-gray-900 text-white py-4"
  speed={60}
>
  <span className="mx-8">Special Offer</span>
  <span className="mx-8">Limited Time</span>
  <span className="mx-8">50% Discount</span>
</Marquee>
```

### Best Practices

1. **Optimize content size**: Keep marquee content lightweight
2. **Consider accessibility**: Provide pause controls for users
3. **Use appropriate speed**: Too fast can be disorienting
4. **Duplicate content wisely**: Ensure seamless looping
5. **Test performance**: Monitor CPU usage with many marquees

## ProgressText Component

Displays animated text that reveals based on scroll progress or time.

### Import

```tsx
import { ProgressText } from '@/components/progress-text'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `string` | required | Text to animate |
| `progress` | `number` | - | Manual progress control (0-1) |
| `scrollTrigger` | `boolean` | `true` | Animate based on scroll |
| `duration` | `number` | `2` | Animation duration in seconds |
| `stagger` | `number` | `0.01` | Delay between characters |
| `className` | `string` | - | Additional CSS classes |
| `startTrigger` | `string` | `'top bottom'` | ScrollTrigger start position |
| `endTrigger` | `string` | `'bottom top'` | ScrollTrigger end position |
| `revealType` | `'opacity' \| 'clip' \| 'blur'` | `'opacity'` | Type of reveal effect |

### Usage Examples

#### Basic Scroll-Based Reveal
```tsx
<ProgressText scrollTrigger={true}>
  This text appears as you scroll down the page
</ProgressText>
```

#### Manual Progress Control
```tsx
const [progress, setProgress] = useState(0)

<ProgressText 
  progress={progress}
  scrollTrigger={false}
  revealType="clip"
>
  Loading your experience...
</ProgressText>

<button onClick={() => setProgress(p => Math.min(p + 0.1, 1))}>
  Increase Progress
</button>
```

#### Blur Reveal Effect
```tsx
<ProgressText 
  revealType="blur"
  duration={3}
  className="text-6xl font-bold text-center"
  startTrigger="top center"
>
  Unveiling Excellence
</ProgressText>
```

#### Multi-line Story Reveal
```tsx
<div className="space-y-8">
  <ProgressText startTrigger="top 80%">
    Our journey began with a simple idea.
  </ProgressText>
  
  <ProgressText startTrigger="top 80%">
    We transformed challenges into opportunities.
  </ProgressText>
  
  <ProgressText startTrigger="top 80%">
    Today, we lead the industry forward.
  </ProgressText>
</div>
```

### Styling Customization

```tsx
// Gradient text reveal
<ProgressText 
  className="text-7xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
  revealType="clip"
>
  INNOVATION
</ProgressText>

// Typewriter effect
<ProgressText 
  stagger={0.05}
  duration={4}
  className="font-mono text-green-400 bg-black p-4"
  revealType="opacity"
>
  > System initialized successfully...
</ProgressText>
```

### Best Practices

1. **Use scroll triggers wisely**: Don't overwhelm with too many animations
2. **Consider reading speed**: Ensure text is readable during animation
3. **Test on various devices**: Scroll behavior varies across devices
4. **Provide fallbacks**: Ensure content is accessible without JavaScript
5. **Optimize for performance**: Limit concurrent animations

### Common Use Cases

#### Hero Section
```tsx
<section className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <SplitText 
      type="words"
      className="text-6xl font-bold mb-4"
    >
      Welcome to the Future
    </SplitText>
    
    <ProgressText 
      className="text-xl text-gray-600"
      startTrigger="top 70%"
    >
      Scroll down to explore our revolutionary platform
    </ProgressText>
  </div>
</section>
```

#### Feature Showcase
```tsx
<div className="grid grid-cols-3 gap-8">
  {features.map((feature, index) => (
    <div key={feature.id}>
      <SplitText 
        type="chars"
        delay={index * 0.2}
        className="text-2xl font-semibold mb-2"
      >
        {feature.title}
      </SplitText>
      
      <ProgressText 
        className="text-gray-600"
        startTrigger="top 80%"
      >
        {feature.description}
      </ProgressText>
    </div>
  ))}
</div>
```

## Performance Considerations

- All animation components use GSAP for optimal performance
- Animations are GPU-accelerated where possible
- ScrollTrigger instances are automatically cleaned up
- Components implement proper lifecycle management

## Accessibility Features

- Respects `prefers-reduced-motion` user preference
- Provides pause controls where appropriate
- Ensures content remains accessible without animations
- Maintains proper focus management during animations