# ScrollingImages Component & Block

A powerful GSAP-powered scrolling image gallery component with multiple animation variants, integrated with Payload CMS 3 and the Satus architecture.

## Features

- **3 Animation Variants**:
  - **3D Rotation**: Images rotate in 3D space with perspective effects
  - **Scale X & Y**: Images scale on both axes creating a squeeze effect
  - **Scale & Opacity**: Images scale vertically while fading in/out

- **Responsive Grid System**: 1-6 column layouts with automatic mobile adaptation
- **Infinite Scroll Support**: Seamlessly loops images when used with Lenis
- **Payload CMS Integration**: Full block configuration with visual editing
- **Performance Optimized**: Uses GSAP ScrollTrigger for smooth animations
- **Accessibility**: Supports alt text for all images

## Installation

The component is already integrated into the project. If you need to install dependencies:

```bash
# Optional: Install imagesloaded for better image loading detection
pnpm add imagesloaded
```

## Usage

### As a React Component

```tsx
import { ScrollingImages } from '@/components/ScrollingImages'

const images = [
  { image: '/path/to/image1.jpg', alt: 'Description 1' },
  { image: '/path/to/image2.jpg', alt: 'Description 2' },
  { image: '/path/to/image3.jpg', alt: 'Description 3' },
  // Add more images...
]

<ScrollingImages
  images={images}
  variant="3d"        // '3d' | 'scaleXY' | 'scaleOpacity'
  columns={3}         // 1-6 columns
  gap="5vh"           // Gap between images
  className="custom"  // Optional custom class
/>
```

### As a Payload CMS Block

The block is available in the Page editor under "Scrolling Images". Configure:

1. **Animation Variant**: Choose from 3D, Scale XY, or Scale Opacity
2. **Columns**: Set 1-6 columns (responsive, becomes 1 on mobile)
3. **Gap**: Space between images
4. **Image Groups**: Add images in groups of 3 for best effect
5. **Advanced Settings**: Image height, infinite scroll, custom CSS

## Animation Variants Explained

### 3D Rotation (`variant="3d"`)
- Images rotate in 3D space with perspective
- Brightness filter creates depth effect
- Most dramatic and eye-catching variant

### Scale X & Y (`variant="scaleXY"`)
- Images scale horizontally and vertically
- Creates a squeeze/stretch effect
- Smooth and modern appearance

### Scale & Opacity (`variant="scaleOpacity"`)
- Vertical scaling combined with opacity fade
- Most subtle variant
- Good for elegant, minimal designs

## How It Works

1. **Initial Load**: Images are loaded and the first group is duplicated to create the loop effect
2. **Scroll Detection**: GSAP ScrollTrigger monitors scroll position
3. **Animation Triggers**: Different animations trigger based on image position:
   - First images: Animate out when scrolling down
   - Last images: Animate in when scrolling up
   - Middle images: Complex bidirectional animations
4. **Infinite Loop**: With Lenis infinite scroll, creates seamless loop

## Configuration Options

### Block Configuration

```typescript
{
  variant: '3d' | 'scaleXY' | 'scaleOpacity'
  columns: '1' | '2' | '3' | '4' | '5' | '6'
  gap: '0' | '2vh' | '5vh' | '8vh' | '10vh'
  imageGroups: Array<{
    groupName?: string
    images: Array<{
      image: Media
      alt?: string
    }>
  }>
  settings?: {
    infiniteScroll?: boolean
    imageHeight?: '50vh' | '60vh' | '70vh' | '80vh' | '90vh' | '100vh' | '110vh' | '120vh'
    className?: string
  }
}
```

## Performance Considerations

- **Image Optimization**: Use optimized images (WebP format recommended)
- **Lazy Loading**: Images are loaded as they come into view
- **GPU Acceleration**: Animations use transform and opacity for best performance
- **Mobile**: Automatically reduces to 1 column on mobile devices

## Demo

Visit `/scrolling-images-demo` to see a live demo with controls to test different variants and configurations.

## Customization

### Custom Styles

Add custom styles via the `className` prop or in your global CSS:

```scss
.scrolling-images {
  // Custom wrapper styles
  
  .grid__item {
    // Custom image styles
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}
```

### Extending Animations

To add custom animation variants, modify the component:

1. Add new variant to `ScrollingImagesVariant` type
2. Create new animation setup function
3. Add case in the switch statement

## Troubleshooting

### Images Not Loading
- Check image URLs are correct
- Ensure Media collection is properly configured
- Verify image permissions

### Animations Not Working
- Check GSAP is properly initialized
- Verify ScrollTrigger is registered
- Check for console errors

### Performance Issues
- Reduce number of images
- Optimize image file sizes
- Reduce number of columns on mobile

## Integration with Satus Architecture

The component follows the Satus architecture pattern:

- **Component**: Located in `/src/components/ScrollingImages`
- **Block**: Configuration in `/src/blocks/ScrollingImagesBlock`
- **Styles**: SCSS modules for scoped styling
- **Provider Integration**: Uses LenisProvider for smooth scroll
- **GSAP Integration**: Follows project GSAP configuration

## Credits

Based on Codrops infinite loop scrolling examples with enhancements for:
- React/Next.js compatibility
- Payload CMS integration
- Multiple animation variants
- Responsive design
- Performance optimization
