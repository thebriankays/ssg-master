'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useScrollTrigger } from '@/hooks'
import { useRect } from 'hamo'
import { useSplitText } from '@/hooks/use-split-text'
import gsap from 'gsap'
import { cn } from '@/utilities/ui'
import './reveal-text.scss'

export interface RevealTextProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  
  // HTML element
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  
  // Animation
  type?: 'chars' | 'words' | 'lines' | 'block'
  stagger?: number
  duration?: number
  delay?: number
  ease?: string
  
  // Reveal options
  from?: 'bottom' | 'top' | 'left' | 'right'
  distance?: number | string
  opacity?: boolean
  rotate?: number
  scale?: number
  
  // Scroll trigger
  scrollTrigger?: boolean
  start?: string
  end?: string
  markers?: boolean
  once?: boolean
}

export function RevealText({
  children,
  className,
  style,
  as: Tag = 'div',
  type = 'lines',
  stagger = 0.1,
  duration = 1,
  delay = 0,
  ease = 'power3.out',
  from = 'bottom',
  distance = '100%',
  opacity = true,
  rotate = 0,
  scale = 1,
  scrollTrigger: enableScrollTrigger = true,
  start = 'top 80%',
  end = 'bottom 20%',
  markers = false,
  once = true,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [setRectRef, rect] = useRect()
  const animationRef = useRef<gsap.core.Timeline | null>(null)
  const hasAnimated = useRef(false)
  
  // Split text for animation
  const { split, revert } = useSplitText(containerRef, {
    type: type === 'block' ? 'lines' : type,
    linesClass: 'reveal-text__line',
    wordsClass: 'reveal-text__word',
    charsClass: 'reveal-text__char',
  })
  
  // Get initial transform values
  const getInitialTransform = () => {
    const transform: any = {}
    
    if (from === 'bottom') transform.y = distance
    if (from === 'top') transform.y = typeof distance === 'number' ? -distance : `-${distance}`
    if (from === 'left') transform.x = typeof distance === 'number' ? -distance : `-${distance}`
    if (from === 'right') transform.x = distance
    
    if (opacity) transform.opacity = 0
    if (rotate) transform.rotation = rotate
    if (scale !== 1) transform.scale = scale
    
    return transform
  }
  
  // Get target transform values
  const getTargetTransform = () => {
    const transform: any = {
      y: 0,
      x: 0,
      duration,
      ease,
      stagger: type === 'block' ? 0 : stagger,
    }
    
    if (opacity) transform.opacity = 1
    if (rotate) transform.rotation = 0
    if (scale !== 1) transform.scale = 1
    
    return transform
  }
  
  // Create animation
  const createAnimation = () => {
    if (!containerRef.current || (once && hasAnimated.current)) return
    
    const elements = split()
    if (!elements || elements.length === 0) return
    
    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill()
    }
    
    // Create timeline
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        hasAnimated.current = true
        if (type !== 'block') {
          // Revert split text after animation
          setTimeout(() => revert(), 100)
        }
      }
    })
    
    // Set initial state
    gsap.set(elements, getInitialTransform())
    
    // Animate to target state
    tl.to(elements, getTargetTransform())
    
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
    [children, type, stagger, duration, delay, ease, from, distance, opacity, rotate, scale]
  )
  
  // Handle non-scroll triggered animation
  if (!enableScrollTrigger && containerRef.current) {
    createAnimation()
  }
  
  return (
    <Tag
      ref={(el) => {
        containerRef.current = el
        setRectRef(el)
      }}
      className={cn('reveal-text', `reveal-text--${type}`, className)}
      style={style}
    >
      {children}
    </Tag>
  )
}