# Core Components

Core components provide essential functionality for images and links, forming the foundation of the component system.

## Image Component

A performance-optimized image component with lazy loading, responsive sizing, and placeholder support.

### Import

```tsx
import { Image } from '@/components/Image'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | Image source URL |
| `alt` | `string` | required | Alternative text for accessibility |
| `width` | `number` | - | Image width |
| `height` | `number` | - | Image height |
| `lazy` | `boolean` | `true` | Enable lazy loading |
| `placeholder` | `'blur' \| 'empty'` | `'empty'` | Placeholder type while loading |
| `priority` | `boolean` | `false` | Load image with high priority |
| `className` | `string` | - | Additional CSS classes |
| `onLoad` | `() => void` | - | Callback when image loads |
| `onError` | `() => void` | - | Callback on load error |

### Usage Examples

#### Basic Usage
```tsx
<Image 
  src="/images/hero.jpg" 
  alt="Hero banner image"
  width={1200}
  height={600}
/>
```

#### With Lazy Loading and Blur Placeholder
```tsx
<Image 
  src="/images/product.jpg" 
  alt="Product showcase"
  placeholder="blur"
  lazy={true}
  className="rounded-lg shadow-md"
/>
```

#### Priority Loading for Above-the-Fold Images
```tsx
<Image 
  src="/images/logo.png" 
  alt="Company logo"
  priority={true}
  width={200}
  height={50}
/>
```

#### With Load Callbacks
```tsx
<Image 
  src="/images/gallery-item.jpg" 
  alt="Gallery item"
  onLoad={() => console.log('Image loaded')}
  onError={() => console.error('Failed to load image')}
/>
```

### Styling Customization

The Image component accepts className for styling:

```tsx
// With Tailwind CSS
<Image 
  src="/images/avatar.jpg" 
  alt="User avatar"
  className="w-12 h-12 rounded-full object-cover"
/>

// With custom CSS
<Image 
  src="/images/banner.jpg" 
  alt="Banner"
  className="hero-image"
/>
```

### Best Practices

1. **Always provide alt text**: Essential for accessibility and SEO
2. **Specify dimensions**: Prevents layout shift during loading
3. **Use priority for critical images**: Mark above-the-fold images as priority
4. **Optimize image files**: Use appropriate formats (WebP, AVIF) and sizes
5. **Implement error handling**: Provide fallback UI for failed loads

### Common Use Cases

#### Hero Images
```tsx
<div className="relative h-screen">
  <Image 
    src="/images/hero-bg.jpg" 
    alt="Hero background"
    className="absolute inset-0 w-full h-full object-cover"
    priority={true}
  />
</div>
```

#### Product Gallery
```tsx
<div className="grid grid-cols-3 gap-4">
  {products.map((product) => (
    <Image 
      key={product.id}
      src={product.image} 
      alt={product.name}
      className="aspect-square object-cover hover:scale-105 transition-transform"
    />
  ))}
</div>
```

## Link Component

An enhanced link component with built-in routing support and accessibility features.

### Import

```tsx
import { Link, CMSLink } from '@/components/Link'
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | required | Destination URL |
| `children` | `React.ReactNode` | required | Link content |
| `external` | `boolean` | `false` | Open in new tab/window |
| `prefetch` | `boolean` | `true` | Prefetch the linked page |
| `className` | `string` | - | Additional CSS classes |
| `activeClassName` | `string` | - | Class when link is active |
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `ariaLabel` | `string` | - | Accessibility label |

### Usage Examples

#### Basic Internal Link
```tsx
<Link href="/about">
  About Us
</Link>
```

#### External Link
```tsx
<Link 
  href="https://github.com" 
  external={true}
  ariaLabel="Visit our GitHub repository"
>
  GitHub
</Link>
```

#### With Active State
```tsx
<Link 
  href="/products"
  className="nav-link"
  activeClassName="nav-link-active"
>
  Products
</Link>
```

#### Button-styled Link
```tsx
<Link 
  href="/signup"
  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  Get Started
</Link>
```

### Styling Customization

```tsx
// Navigation link
<Link 
  href="/services"
  className="text-gray-700 hover:text-blue-600 transition-colors"
>
  Services
</Link>

// CTA button
<Link 
  href="/contact"
  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded"
>
  <span>Contact Us</span>
  <ArrowRight size={16} />
</Link>
```

### Best Practices

1. **Use semantic href values**: Ensure URLs are meaningful and SEO-friendly
2. **Add aria-label for icon-only links**: Improve accessibility
3. **Indicate external links**: Use visual cues for external destinations
4. **Prefetch strategically**: Disable prefetch for rarely visited pages
5. **Handle active states**: Provide visual feedback for current page

### Common Use Cases

#### Navigation Menu
```tsx
<nav>
  {navItems.map((item) => (
    <Link 
      key={item.path}
      href={item.path}
      className="nav-item"
      activeClassName="nav-item-active"
    >
      {item.label}
    </Link>
  ))}
</nav>
```

#### Social Links
```tsx
<div className="flex gap-4">
  <Link 
    href="https://twitter.com/yourhandle" 
    external={true}
    ariaLabel="Follow us on Twitter"
    className="social-link"
  >
    <TwitterIcon />
  </Link>
  <Link 
    href="https://linkedin.com/company/yourcompany" 
    external={true}
    ariaLabel="Connect on LinkedIn"
    className="social-link"
  >
    <LinkedInIcon />
  </Link>
</div>
```

#### Call-to-Action
```tsx
<Link 
  href="/pricing"
  className="cta-button"
  onClick={(e) => {
    // Track analytics event
    trackEvent('CTA_Click', { page: 'home' })
  }}
>
  View Pricing Plans
</Link>
```

## Performance Considerations

### Image Component
- Implements native lazy loading with IntersectionObserver fallback
- Supports modern image formats for optimal file sizes
- Prevents layout shift with proper dimension handling

### Link Component
- Uses client-side routing for instant navigation
- Implements prefetching for improved perceived performance
- Minimal JavaScript overhead

## Accessibility Features

Both components are built with accessibility in mind:

- **Image**: Required alt text, proper ARIA attributes
- **Link**: Keyboard navigation, focus indicators, screen reader support
- Both support standard ARIA properties for enhanced accessibility