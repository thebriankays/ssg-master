'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useScrollTrigger } from '@/hooks'
import { useRect } from 'hamo'
import gsap from 'gsap'
import { cn } from '@/utilities/ui'
import './reveal-transform.scss'

export interface RevealTransformProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  
  // HTML element
  as?: keyof JSX.IntrinsicElements
  
  // Animation
  duration?: number
  delay?: number
  ease?: string
  
  // 3D Transform values
  perspective?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  translateX?: number | string
  translateY?: number | string
  translateZ?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  skewX?: number
  skewY?: number
  
  // Transform origin
  transformOrigin?: string
  
  // Advanced options
  opacity?: boolean
  blur?: number
  brightness?: number
  contrast?: number
  saturate?: number
  
  // Parallax effect
  parallax?: boolean
  parallaxSpeed?: number
  parallaxOffset?: number
  
  // Scroll trigger
  scrollTrigger?: boolean
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean
  markers?: boolean
  once?: boolean
}

export function RevealTransform({
  children,
  className,
  style,
  as: Tag = 'div',
  duration = 1.2,
  delay = 0,
  ease = 'power3.out',
  perspective = 1000,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  scale = 1,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
  skewX = 0,
  skewY = 0,
  transformOrigin = 'center center',
  opacity = true,
  blur = 0,
  brightness = 100,
  contrast = 100,
  saturate = 100,
  parallax = false,
  parallaxSpeed = 0.5,
  parallaxOffset = 100,
  scrollTrigger: enableScrollTrigger = true,
  start = 'top 80%',
  end = 'bottom 20%',
  scrub = false,
  pin = false,
  markers = false,
  once = true,
}: RevealTransformProps) {
  const containerRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [setRectRef, rect] = useRect()
  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null)
  const hasAnimated = useRef(false)
  
  // Build filter string
  const getFilterString = (progress: number) => {
    const filters = []
    
    if (blur > 0) {
      filters.push(`blur(${blur * (1 - progress)}px)`)
    }
    
    if (brightness !== 100) {
      const brightnessValue = 100 + (brightness - 100) * progress
      filters.push(`brightness(${brightnessValue}%)`)
    }
    
    if (contrast !== 100) {
      const contrastValue = 100 + (contrast - 100) * progress
      filters.push(`contrast(${contrastValue}%)`)
    }
    
    if (saturate !== 100) {
      const saturateValue = 100 + (saturate - 100) * progress
      filters.push(`saturate(${saturateValue}%)`)
    }
    
    return filters.length > 0 ? filters.join(' ') : 'none'
  }
  
  // Create reveal animation
  const createRevealAnimation = () => {
    if (!innerRef.current || (once && hasAnimated.current)) return
    
    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill()
    }
    
    // Set initial state
    const initialState: gsap.TweenVars = {
      rotateX,
      rotateY,
      rotateZ,
      x: translateX,
      y: translateY,
      z: translateZ,
      scale: scale !== 1 ? scale : undefined,
      scaleX: scaleX !== 1 ? scaleX : undefined,
      scaleY: scaleY !== 1 ? scaleY : undefined,
      scaleZ: scaleZ !== 1 ? scaleZ : undefined,
      skewX: skewX !== 0 ? skewX : undefined,
      skewY: skewY !== 0 ? skewY : undefined,
      transformOrigin,
      opacity: opacity ? 0 : 1,
      filter: getFilterString(0),
    }
    
    gsap.set(innerRef.current, initialState)
    
    // Create target state
    const targetState: gsap.TweenVars = {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      skewX: 0,
      skewY: 0,
      opacity: 1,
      filter: getFilterString(1),
      duration,
      delay,
      ease,
      onComplete: () => {
        hasAnimated.current = true
      }
    }
    
    const animation = gsap.to(innerRef.current, targetState)
    animationRef.current = animation
    
    return animation
  }
  
  // Create parallax animation
  const createParallaxAnimation = (progress: number) => {
    if (!innerRef.current || !parallax) return
    
    const offset = (progress - 0.5) * parallaxOffset * parallaxSpeed
    
    gsap.to(innerRef.current, {
      y: offset,
      duration: 0.1,
      ease: 'none',
      overwrite: 'auto',
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
        if (!scrub) {
          createRevealAnimation()
        }
      },
      onLeave: () => {
        if (!once && !scrub && animationRef.current) {
          animationRef.current.reverse()
        }
      },
      onProgress: ({ progress }) => {
        if (scrub && innerRef.current) {
          // Scrub animation
          const scrubProgress = gsap.utils.clamp(0, 1, progress)
          
          gsap.to(innerRef.current, {
            rotateX: rotateX * (1 - scrubProgress),
            rotateY: rotateY * (1 - scrubProgress),
            rotateZ: rotateZ * (1 - scrubProgress),
            x: translateX ? (typeof translateX === 'number' ? translateX : parseFloat(translateX)) * (1 - scrubProgress) : 0,
            y: translateY ? (typeof translateY === 'number' ? translateY : parseFloat(translateY)) * (1 - scrubProgress) : 0,
            z: translateZ * (1 - scrubProgress),
            scale: scale + (1 - scale) * scrubProgress,
            scaleX: scaleX + (1 - scaleX) * scrubProgress,
            scaleY: scaleY + (1 - scaleY) * scrubProgress,
            scaleZ: scaleZ + (1 - scaleZ) * scrubProgress,
            skewX: skewX * (1 - scrubProgress),
            skewY: skewY * (1 - scrubProgress),
            opacity: opacity ? scrubProgress : 1,
            filter: getFilterString(scrubProgress),
            duration: typeof scrub === 'number' ? scrub : 0.1,
            ease: 'none',
            overwrite: 'auto',
          })
        }
        
        // Parallax effect
        createParallaxAnimation(progress)
      },
    },
    [duration, delay, ease, rotateX, rotateY, rotateZ, translateX, translateY, translateZ, scale, scaleX, scaleY, scaleZ, skewX, skewY, opacity, blur, brightness, contrast, saturate, parallax, parallaxSpeed, parallaxOffset, scrub]
  )
  
  // Handle non-scroll triggered animation
  if (!enableScrollTrigger && innerRef.current) {
    createRevealAnimation()
  }
  
  return (
    <Tag
      ref={(el) => {
        containerRef.current = el as HTMLElement
        setRectRef(el as HTMLElement)
      }}
      className={cn('reveal-transform', className)}
      style={{
        ...style,
        perspective: `${perspective}px`,
      }}
    >
      <div
        ref={innerRef}
        className="reveal-transform__inner"
      >
        {children}
      </div>
    </Tag>
  )
}