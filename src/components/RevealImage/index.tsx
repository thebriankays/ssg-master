'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { useScrollTrigger } from '@/hooks'
import { useRect } from 'hamo'
import gsap from 'gsap'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/utilities/ui'
import './reveal-image.scss'

export interface RevealImageProps extends Omit<ImageProps, 'onLoad'> {
  className?: string
  containerClassName?: string
  containerStyle?: CSSProperties
  
  // Animation
  duration?: number
  delay?: number
  ease?: string
  
  // Reveal options
  scale?: number
  opacity?: boolean
  blur?: number
  clipPath?: 'horizontal' | 'vertical' | 'diagonal' | 'circle' | 'none'
  parallax?: number
  
  // Scroll trigger
  scrollTrigger?: boolean
  start?: string
  end?: string
  markers?: boolean
  once?: boolean
  
  // Loading
  lazy?: boolean
  onLoad?: () => void
}

export function RevealImage({
  className,
  containerClassName,
  containerStyle,
  duration = 1.2,
  delay = 0,
  ease = 'power3.out',
  scale = 1.2,
  opacity = true,
  blur = 10,
  clipPath = 'none',
  parallax = 0,
  scrollTrigger: enableScrollTrigger = true,
  start = 'top 80%',
  end = 'bottom 20%',
  markers = false,
  once = true,
  lazy = true,
  onLoad,
  ...imageProps
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [setRectRef, rect] = useRect()
  const [isLoaded, setIsLoaded] = useState(false)
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const hasAnimated = useRef(false)
  
  // Get clip path value
  const getClipPath = (progress: number) => {
    switch (clipPath) {
      case 'horizontal':
        return `inset(0 ${100 - progress * 100}% 0 0)`
      case 'vertical':
        return `inset(${100 - progress * 100}% 0 0 0)`
      case 'diagonal':
        return `polygon(0 0, ${progress * 100}% 0, ${progress * 100}% 100%, 0 100%)`
      case 'circle':
        return `circle(${progress * 150}% at center)`
      default:
        return 'none'
    }
  }
  
  // Create animation
  const createAnimation = () => {
    if (!containerRef.current || !imageRef.current || !isLoaded) return
    if (once && hasAnimated.current) return
    
    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill()
    }
    
    // Create timeline
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        hasAnimated.current = true
      }
    })
    
    // Container animation
    if (clipPath !== 'none') {
      gsap.set(containerRef.current, { clipPath: getClipPath(0) })
      tl.to(containerRef.current, {
        clipPath: getClipPath(1),
        duration,
        ease,
      }, 0)
    }
    
    // Image animation
    const imageAnimation: gsap.TweenVars = {
      duration,
      ease,
    }
    
    if (scale !== 1) {
      gsap.set(imageRef.current, { scale })
      imageAnimation.scale = 1
    }
    
    if (opacity) {
      gsap.set(imageRef.current, { opacity: 0 })
      imageAnimation.opacity = 1
    }
    
    if (blur > 0) {
      gsap.set(imageRef.current, { filter: `blur(${blur}px)` })
      imageAnimation.filter = 'blur(0px)'
    }
    
    tl.to(imageRef.current, imageAnimation, 0)
    
    animationRef.current = tl
    
    return tl
  }
  
  // Handle parallax
  const handleParallax = (progress: number) => {
    if (parallax === 0 || !imageRef.current) return
    
    const offset = (progress - 0.5) * parallax * 100
    gsap.set(imageRef.current, {
      y: `${offset}%`,
    })
  }
  
  // Handle scroll trigger
  useScrollTrigger(
    {
      rect,
      start,
      end,
      markers,
      disabled: !enableScrollTrigger,
      onEnter: () => {
        createAnimation()
      },
      onLeave: () => {
        if (!once && animationRef.current) {
          animationRef.current.reverse()
        }
      },
      onProgress: ({ progress }) => {
        handleParallax(progress)
      },
    },
    [isLoaded, duration, delay, ease, scale, opacity, blur, clipPath, parallax]
  )
  
  // Handle non-scroll triggered animation
  if (!enableScrollTrigger && isLoaded) {
    createAnimation()
  }
  
  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }
  
  return (
    <div
      ref={(el) => {
        containerRef.current = el
        setRectRef(el)
      }}
      className={cn('reveal-image', containerClassName)}
      style={containerStyle}
    >
      <Image
        ref={imageRef as any}
        className={cn('reveal-image__img', className)}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleImageLoad}
        {...imageProps}
      />
    </div>
  )
}