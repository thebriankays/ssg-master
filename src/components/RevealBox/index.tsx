'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useScrollTrigger } from '@/hooks'
import { useRect } from 'hamo'
import gsap from 'gsap'
import { cn } from '@/utilities/ui'
import './reveal-box.scss'

export interface RevealBoxProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  
  // HTML element
  as?: keyof JSX.IntrinsicElements
  
  // Animation
  duration?: number
  delay?: number
  ease?: string
  
  // Reveal options
  from?: 'bottom' | 'top' | 'left' | 'right' | 'center'
  distance?: number | string
  opacity?: boolean
  scale?: number
  rotate?: number
  rotateX?: number
  rotateY?: number
  skewX?: number
  skewY?: number
  
  // Mask reveal
  mask?: boolean
  maskDirection?: 'horizontal' | 'vertical' | 'diagonal'
  maskDuration?: number
  
  // Scroll trigger
  scrollTrigger?: boolean
  start?: string
  end?: string
  markers?: boolean
  once?: boolean
}

export function RevealBox({
  children,
  className,
  style,
  as: Tag = 'div',
  duration = 1,
  delay = 0,
  ease = 'power3.out',
  from = 'bottom',
  distance = 50,
  opacity = true,
  scale = 1,
  rotate = 0,
  rotateX = 0,
  rotateY = 0,
  skewX = 0,
  skewY = 0,
  mask = false,
  maskDirection = 'horizontal',
  maskDuration = 0.8,
  scrollTrigger: enableScrollTrigger = true,
  start = 'top 80%',
  end = 'bottom 20%',
  markers = false,
  once = true,
}: RevealBoxProps) {
  const containerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const [setRectRef, rect] = useRect()
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const hasAnimated = useRef(false)
  
  // Get initial transform values
  const getInitialTransform = () => {
    const transform: any = {}
    
    if (from === 'bottom') transform.y = distance
    if (from === 'top') transform.y = typeof distance === 'number' ? -distance : `-${distance}`
    if (from === 'left') transform.x = typeof distance === 'number' ? -distance : `-${distance}`
    if (from === 'right') transform.x = distance
    if (from === 'center') {
      transform.scale = 0
      transform.transformOrigin = 'center center'
    }
    
    if (opacity) transform.opacity = 0
    if (scale !== 1 && from !== 'center') transform.scale = scale
    if (rotate) transform.rotation = rotate
    if (rotateX) transform.rotateX = rotateX
    if (rotateY) transform.rotateY = rotateY
    if (skewX) transform.skewX = skewX
    if (skewY) transform.skewY = skewY
    
    return transform
  }
  
  // Get mask transform values
  const getMaskTransform = (progress: number) => {
    switch (maskDirection) {
      case 'horizontal':
        return { scaleX: progress, transformOrigin: 'left center' }
      case 'vertical':
        return { scaleY: progress, transformOrigin: 'center top' }
      case 'diagonal':
        return { 
          scaleX: progress,
          scaleY: progress,
          transformOrigin: 'top left'
        }
      default:
        return {}
    }
  }
  
  // Create animation
  const createAnimation = () => {
    if (!containerRef.current || (once && hasAnimated.current)) return
    
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
    
    if (mask && maskRef.current) {
      // Mask reveal animation
      gsap.set(maskRef.current, getMaskTransform(0))
      
      tl.to(maskRef.current, {
        ...getMaskTransform(1),
        duration: maskDuration,
        ease,
      })
      
      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 0 })
        tl.to(contentRef.current, {
          opacity: 1,
          duration: 0.3,
        }, maskDuration * 0.5)
      }
    } else if (contentRef.current) {
      // Regular animation
      gsap.set(contentRef.current, getInitialTransform())
      
      tl.to(contentRef.current, {
        x: 0,
        y: 0,
        opacity: opacity ? 1 : undefined,
        scale: from === 'center' ? 1 : (scale !== 1 ? 1 : undefined),
        rotation: rotate ? 0 : undefined,
        rotateX: rotateX ? 0 : undefined,
        rotateY: rotateY ? 0 : undefined,
        skewX: skewX ? 0 : undefined,
        skewY: skewY ? 0 : undefined,
        duration,
        ease,
      })
    }
    
    animationRef.current = tl
    
    return tl
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
    },
    [duration, delay, ease, from, distance, opacity, scale, rotate, rotateX, rotateY, skewX, skewY, mask, maskDirection, maskDuration]
  )
  
  // Handle non-scroll triggered animation
  if (!enableScrollTrigger && containerRef.current) {
    createAnimation()
  }
  
  return (
    <Tag
      ref={(el) => {
        containerRef.current = el as HTMLElement
        setRectRef(el as HTMLElement)
      }}
      className={cn('reveal-box', { 'reveal-box--mask': mask }, className)}
      style={style}
    >
      {mask && (
        <div
          ref={maskRef}
          className="reveal-box__mask"
          aria-hidden="true"
        />
      )}
      <div
        ref={contentRef}
        className="reveal-box__content"
      >
        {children}
      </div>
    </Tag>
  )
}