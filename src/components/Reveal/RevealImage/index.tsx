'use client'

import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { useRect } from 'hamo'
import gsap from 'gsap'
import cn from 'clsx'
import Image, { ImageProps } from 'next/image'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { useGSAP } from '~/hooks/use-gsap'
import ConditionalWrapper from '~/components/ConditionalWrapper'
import styles from './RevealImage.module.scss'

export type RevealImageAnimation = 'fade' | 'scale' | 'clip' | 'slide' | 'parallax' | 'zoom' | 'custom'

export interface RevealImageProps extends Omit<ImageProps, 'onLoad'> {
  animation?: RevealImageAnimation
  direction?: 'up' | 'down' | 'left' | 'right'
  trigger?: boolean
  triggerStart?: string
  triggerEnd?: string
  triggerOnce?: boolean
  markers?: boolean
  scrub?: boolean | number
  pin?: boolean
  animateOnMount?: boolean
  containerClassName?: string
  overlayClassName?: string
  showOverlay?: boolean
  overlayColor?: string
  delay?: number
  duration?: number
  ease?: string
  scale?: number
  parallaxSpeed?: number
  onRevealStart?: () => void
  onRevealComplete?: () => void
  onImageLoad?: () => void
  customAnimation?: (element: HTMLElement, overlay: HTMLElement | null, timeline: gsap.core.Timeline) => void
}

export interface RevealImageRef {
  reveal: () => void
  hide: () => void
  isRevealed: boolean
  isLoaded: boolean
}

const RevealImage = forwardRef<RevealImageRef, RevealImageProps>(({
  animation = 'clip',
  direction = 'up',
  trigger = true,
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
  triggerOnce = true,
  markers = false,
  scrub = false,
  pin = false,
  animateOnMount = false,
  className,
  containerClassName,
  overlayClassName,
  showOverlay = true,
  overlayColor = '#000',
  delay = 0,
  duration = 1.2,
  ease = 'power3.inOut',
  scale = 1.2,
  parallaxSpeed = 0.5,
  onRevealStart,
  onRevealComplete,
  onImageLoad,
  customAnimation,
  alt,
  ...imageProps
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const isRevealedRef = useRef(false)
  const hasTriggeredRef = useRef(false)

  const [rectRef, rect] = useRect()

  // Get animation properties based on type and direction
  const getAnimationProps = () => {
    const props: any = {
      from: {},
      to: {},
      overlayFrom: {},
      overlayTo: {}
    }

    switch (animation) {
      case 'fade':
        props.from = { opacity: 0 }
        props.to = { opacity: 1 }
        break

      case 'scale':
        props.from = { scale: 0.8, opacity: 0 }
        props.to = { scale: 1, opacity: 1 }
        break

      case 'clip':
        if (direction === 'up' || direction === 'down') {
          props.from = { clipPath: direction === 'up' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)' }
          props.to = { clipPath: 'inset(0 0 0 0)' }
        } else {
          props.from = { clipPath: direction === 'left' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }
          props.to = { clipPath: 'inset(0 0 0 0)' }
        }
        break

      case 'slide':
        const slideOffset = '100%'
        props.from = {
          x: direction === 'left' ? slideOffset : direction === 'right' ? `-${slideOffset}` : 0,
          y: direction === 'up' ? slideOffset : direction === 'down' ? `-${slideOffset}` : 0,
        }
        props.to = { x: 0, y: 0 }
        break

      case 'zoom':
        props.from = { scale, opacity: 0 }
        props.to = { scale: 1, opacity: 1 }
        break

      case 'parallax':
        props.from = { y: 100 * parallaxSpeed }
        props.to = { y: -100 * parallaxSpeed }
        break
    }

    // Overlay animation
    if (showOverlay && animation !== 'custom') {
      const overlayDelay = duration * 0.3
      if (direction === 'up' || direction === 'down') {
        props.overlayFrom = { scaleY: 1 }
        props.overlayTo = { scaleY: 0, delay: overlayDelay }
      } else {
        props.overlayFrom = { scaleX: 1 }
        props.overlayTo = { scaleX: 0, delay: overlayDelay }
      }
    }

    return props
  }

  // Create reveal animation
  const createRevealAnimation = () => {
    if (!imageRef.current || !isLoaded) return

    const timeline = gsap.timeline({
      paused: !animateOnMount,
      delay,
      onStart: onRevealStart,
      onComplete: () => {
        isRevealedRef.current = true
        onRevealComplete?.()
      }
    })

    if (customAnimation) {
      customAnimation(imageRef.current, overlayRef.current, timeline)
    } else {
      const { from, to, overlayFrom, overlayTo } = getAnimationProps()

      // Set initial state
      if (Object.keys(from).length > 0) {
        gsap.set(imageRef.current, from)
      }
      if (overlayRef.current && Object.keys(overlayFrom).length > 0) {
        gsap.set(overlayRef.current, overlayFrom)
      }

      // Animate image
      if (Object.keys(to).length > 0) {
        timeline.to(imageRef.current, {
          ...to,
          duration,
          ease
        }, 0)
      }

      // Animate overlay
      if (overlayRef.current && Object.keys(overlayTo).length > 0) {
        timeline.to(overlayRef.current, {
          ...overlayTo,
          duration: duration * 0.7,
          ease
        }, 0)
      }
    }

    timelineRef.current = timeline
    return timeline
  }

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true)
    onImageLoad?.()
  }

  // Initialize animation when image loads
  useEffect(() => {
    if (isLoaded && (!trigger || animateOnMount)) {
      createRevealAnimation()
    }
  }, [isLoaded])

  // Handle scroll trigger
  useScrollTrigger({
    rect,
    start: triggerStart,
    end: triggerEnd,
    markers,
    disabled: !trigger || !isLoaded || hasTriggeredRef.current,
    onEnter: () => {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = triggerOnce
        const timeline = timelineRef.current || createRevealAnimation()
        
        if (scrub !== false && animation === 'parallax') {
          // Parallax is always scrubbed
          return
        } else if (scrub !== false) {
          // Scrub animation
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
      if (scrub !== false || animation === 'parallax') {
        if (animation === 'parallax' && imageRef.current) {
          const yValue = gsap.utils.mapRange(0, 1, 100 * parallaxSpeed, -100 * parallaxSpeed, progress)
          gsap.set(imageRef.current, { y: yValue })
        } else if (timelineRef.current) {
          timelineRef.current.progress(progress)
        }
      }
    }
  }, [trigger, triggerOnce, scrub, isLoaded, animation])

  // Imperative API
  useImperativeHandle(ref, () => ({
    reveal: () => {
      const timeline = timelineRef.current || createRevealAnimation()
      timeline?.play()
    },
    hide: () => {
      timelineRef.current?.reverse()
    },
    get isRevealed() {
      return isRevealedRef.current
    },
    get isLoaded() {
      return isLoaded
    }
  }))

  const containerClasses = cn(
    styles.revealImage,
    styles[`revealImage--${animation}`],
    styles[`revealImage--${direction}`],
    {
      [styles['revealImage--loaded']]: isLoaded,
      [styles['revealImage--revealing']]: !isRevealedRef.current,
      [styles['revealImage--revealed']]: isRevealedRef.current,
    },
    containerClassName
  )

  const overlayClasses = cn(
    styles.revealImage__overlay,
    overlayClassName
  )

  const imageClasses = cn(
    styles.revealImage__img,
    className
  )

  return (
    <div 
      ref={(el) => {
        containerRef.current = el
        rectRef(el)
      }}
      className={containerClasses}
    >
      <div ref={imageRef} className={styles.revealImage__wrapper}>
        <ConditionalWrapper
          condition={!!imageProps.fill}
          wrapper={(children) => <>{children}</>}
        >
          <Image
            {...imageProps}
            alt={alt}
            className={imageClasses}
            onLoad={handleImageLoad}
          />
        </ConditionalWrapper>
      </div>
      {showOverlay && animation !== 'fade' && (
        <div 
          ref={overlayRef}
          className={overlayClasses}
          style={{ backgroundColor: overlayColor }}
        />
      )}
    </div>
  )
})

RevealImage.displayName = 'RevealImage'

export default RevealImage