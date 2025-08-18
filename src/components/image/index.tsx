'use client'

import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { cn } from '@/utilities/ui'
import type { Media } from '@/payload-types'
import { forwardRef, useMemo, useState, useRef } from 'react'
import { View } from '@react-three/drei'
import dynamic from 'next/dynamic'
import './image.scss'

// Lazy load WebGL component for performance
const WebGLImageScene = dynamic(() => import('./WebGLImage').then(mod => ({ default: mod.WebGLImageScene })), {
  ssr: false,
  loading: () => <div className="image__webgl-placeholder" />
})

// Types
export interface ImageResource extends Media {
  url?: string
  alt?: string
  width?: number
  height?: number
}

export interface ImageSizes {
  mobile?: number | string
  desktop?: number | string
}

export interface WebGLEffects {
  enabled?: boolean
  parallax?: number
  blur?: number
  grayscale?: number
  brightness?: number
  contrast?: number
  tint?: string
  hover?: {
    scale?: number
    blur?: number
    grayscale?: number
  }
}

export interface ImageProps extends Omit<NextImageProps, 'src' | 'alt' | 'width' | 'height' | 'sizes'> {
  // Source can be Payload resource, URL, or imported image
  resource?: ImageResource | string | null
  src?: string | NextImageProps['src']
  alt?: string
  
  // Sizing
  width?: number
  height?: number
  sizes?: ImageSizes | string
  aspectRatio?: number
  
  // Classes
  className?: string
  imgClassName?: string
  pictureClassName?: string
  
  // Effects
  webgl?: WebGLEffects
  
  // Loading
  priority?: boolean
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty' | 'shimmer'
  blurDataURL?: string
  
  // Behavior
  draggable?: boolean
  onClick?: () => void
}

// Shimmer placeholder generator (from Satus)
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

// Helper to get image source from resource
function getImageSource(resource?: ImageResource | string | null, src?: string | NextImageProps['src']) {
  if (src) return src
  if (!resource) return null
  
  if (typeof resource === 'string') {
    return resource
  }
  
  // Handle Payload media resource
  if (resource.url) {
    return resource.url
  }
  
  if (resource.filename) {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${resource.filename}`
  }
  
  return null
}

// Generate sizes string from ImageSizes object
function generateSizes(sizes?: ImageSizes | string): string | undefined {
  if (!sizes) return undefined
  if (typeof sizes === 'string') return sizes
  
  const { mobile, desktop } = sizes
  const sizesArray: string[] = []
  
  if (mobile) {
    sizesArray.push(`(max-width: 768px) ${typeof mobile === 'number' ? `${mobile}px` : mobile}`)
  }
  
  if (desktop) {
    sizesArray.push(typeof desktop === 'number' ? `${desktop}px` : desktop)
  }
  
  return sizesArray.join(', ')
}

export const Image = forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      resource,
      src: propSrc,
      alt: propAlt,
      width: propWidth,
      height: propHeight,
      sizes,
      aspectRatio,
      className,
      imgClassName,
      pictureClassName,
      webgl,
      priority = false,
      loading = 'lazy',
      placeholder = 'blur',
      blurDataURL,
      draggable = false,
      onClick,
      fill,
      quality = 90,
      ...props
    },
    ref
  ) => {
    const viewRef = useRef<HTMLDivElement>(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    
    // Get image source and metadata
    const src = getImageSource(resource, propSrc)
    const alt = propAlt || (typeof resource === 'object' ? resource?.alt : '') || ''
    
    // Get dimensions
    let width = propWidth
    let height = propHeight
    
    if (typeof resource === 'object' && resource) {
      width = width || resource.width || undefined
      height = height || resource.height || undefined
    }
    
    // Calculate dimensions from aspect ratio if needed
    if (aspectRatio && width && !height) {
      height = Math.round(width / aspectRatio)
    } else if (aspectRatio && height && !width) {
      width = Math.round(height * aspectRatio)
    }
    
    // Generate placeholder
    const placeholderDataUrl = useMemo(() => {
      if (placeholder === 'empty' || !width || !height) return undefined
      if (blurDataURL) return blurDataURL
      if (placeholder === 'shimmer') {
        return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`
      }
      // For blur placeholder, use resource base64 if available
      if (typeof resource === 'object' && 'base64' in resource && resource.base64) {
        return resource.base64
      }
      return undefined
    }, [placeholder, width, height, blurDataURL, resource])
    
    // Generate sizes attribute
    const sizesAttr = generateSizes(sizes)
    
    if (!src) {
      return (
        <div 
          ref={ref}
          className={cn('image image--empty', className)}
          style={{ aspectRatio }}
        >
          <div className="image__placeholder">No image available</div>
        </div>
      )
    }
    
    // Render WebGL version if enabled
    if (webgl?.enabled && imageLoaded) {
      return (
        <div 
          ref={ref}
          className={cn('image image--webgl', className)}
          onClick={onClick}
        >
          <div ref={viewRef} className="image__webgl-container">
            <View track={viewRef as any}>
              <WebGLImageScene
                src={src as string}
                effects={webgl}
                width={width}
                height={height}
              />
            </View>
          </div>
          {/* Hidden image for SEO */}
          <NextImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="sr-only"
            priority={priority}
          />
        </div>
      )
    }
    
    // Regular image
    const imageProps: NextImageProps = {
      src,
      alt,
      quality,
      priority,
      loading,
      ...props,
    }
    
    if (fill) {
      imageProps.fill = true
      imageProps.sizes = sizesAttr || '100vw'
    } else {
      imageProps.width = width
      imageProps.height = height
      if (sizesAttr) imageProps.sizes = sizesAttr
    }
    
    if (placeholderDataUrl && placeholder === 'blur') {
      imageProps.placeholder = 'blur'
      imageProps.blurDataURL = placeholderDataUrl
    }
    
    return (
      <div 
        ref={ref}
        className={cn(
          'image',
          {
            'image--fill': fill,
            'image--loading': !imageLoaded,
          },
          className
        )}
        style={{ aspectRatio }}
        onClick={onClick}
      >
        <picture className={cn('image__picture', pictureClassName)}>
          <NextImage
            {...imageProps}
            className={cn('image__img', imgClassName)}
            draggable={draggable}
            onLoad={() => setImageLoaded(true)}
          />
        </picture>
      </div>
    )
  }
)

Image.displayName = 'Image'