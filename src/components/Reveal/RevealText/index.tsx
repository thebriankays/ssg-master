'use client'

import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { useRect } from 'hamo'
import gsap from 'gsap'
import cn from 'clsx'
import SplitText, { SplitTextProps, SplitTextRef } from '~/components/SplitText'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { useGSAP } from '~/hooks/use-gsap'
import styles from './RevealText.module.scss'

export interface RevealTextProps extends Omit<SplitTextProps, 'willAppear'> {
  trigger?: boolean
  triggerStart?: string
  triggerEnd?: string
  triggerOnce?: boolean
  markers?: boolean
  scrub?: boolean | number
  pin?: boolean
  animateOnMount?: boolean
  containerClassName?: string
  onRevealStart?: () => void
  onRevealComplete?: () => void
  customAnimation?: (targets: HTMLElement[], timeline: gsap.core.Timeline) => void
}

export interface RevealTextRef extends SplitTextRef {
  reveal: () => void
  hide: () => void
  isRevealed: boolean
}

const RevealText = forwardRef<RevealTextRef, RevealTextProps>(({
  children,
  className,
  containerClassName,
  trigger = true,
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
  triggerOnce = true,
  markers = false,
  scrub = false,
  pin = false,
  animateOnMount = false,
  delay = 0,
  stagger = 0.02,
  duration = 0.8,
  ease = 'power3.out',
  animateFrom = { opacity: 0, y: 100, rotationX: -90 },
  animateTo = { opacity: 1, y: 0, rotationX: 0 },
  onRevealStart,
  onRevealComplete,
  onAnimationStart,
  onAnimationComplete,
  customAnimation,
  ...splitTextProps
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const splitTextRef = useRef<SplitTextRef>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const isRevealedRef = useRef(false)
  const hasTriggeredRef = useRef(false)

  const [rectRef, rect] = useRect()

  // Create reveal animation
  const createRevealAnimation = () => {
    if (!splitTextRef.current) return

    const timeline = gsap.timeline({
      paused: !animateOnMount,
      onStart: () => {
        onRevealStart?.()
        onAnimationStart?.()
      },
      onComplete: () => {
        isRevealedRef.current = true
        onRevealComplete?.()
        onAnimationComplete?.()
      }
    })

    const targets = splitTextRef.current.getWords()
    
    if (customAnimation) {
      customAnimation(targets, timeline)
    } else {
      // Set initial state
      gsap.set(targets, animateFrom)
      
      // Animate to final state
      timeline.to(targets, {
        ...animateTo,
        duration,
        ease,
        stagger: {
          each: stagger,
          from: 'start'
        }
      }, delay)
    }

    timelineRef.current = timeline
    return timeline
  }

  // Initialize animation
  useGSAP(() => {
    if (!trigger || animateOnMount) {
      createRevealAnimation()
    }
  }, [])

  // Handle scroll trigger
  useScrollTrigger({
    rect,
    start: triggerStart,
    end: triggerEnd,
    markers,
    disabled: !trigger || hasTriggeredRef.current,
    onEnter: () => {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = triggerOnce
        const timeline = timelineRef.current || createRevealAnimation()
        
        if (scrub !== false) {
          // Scrub animation - progress tied to scroll
          return
        } else {
          // Regular trigger animation
          timeline?.play()
        }
      }
    },
    onLeave: () => {
      if (!triggerOnce && !scrub) {
        timelineRef.current?.reverse()
      }
    },
    onProgress: ({ progress }) => {
      if (scrub !== false && timelineRef.current) {
        timelineRef.current.progress(progress)
      }
    }
  }, [trigger, triggerOnce, scrub])

  // Imperative API
  useImperativeHandle(ref, () => ({
    ...splitTextRef.current!,
    reveal: () => {
      const timeline = timelineRef.current || createRevealAnimation()
      timeline?.play()
    },
    hide: () => {
      timelineRef.current?.reverse()
    },
    get isRevealed() {
      return isRevealedRef.current
    }
  }))

  return (
    <div 
      ref={(el) => {
        containerRef.current = el
        rectRef(el)
      }}
      className={cn(styles.revealText, containerClassName)}
    >
      <SplitText
        ref={splitTextRef}
        className={cn(styles.revealText__content, className)}
        willAppear={false}
        {...splitTextProps}
      >
        {children}
      </SplitText>
    </div>
  )
})

RevealText.displayName = 'RevealText'

export default RevealText