'use client'

import React, { forwardRef, useRef, useImperativeHandle, ButtonHTMLAttributes } from 'react'
import { useRect } from 'hamo'
import gsap from 'gsap'
import cn from 'clsx'
import Link from 'next/link'
import { useScrollTrigger } from '~/hooks/use-scroll-trigger'
import { useGSAP } from '~/hooks/use-gsap'
import ConditionalWrapper from '~/components/ConditionalWrapper'
import styles from './RevealButton.module.scss'

export type RevealButtonAnimation = 'fade' | 'scale' | 'slide' | 'flip' | 'morph' | 'magnetic' | 'custom'
export type RevealButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text'
export type RevealButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface RevealButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  external?: boolean
  variant?: RevealButtonVariant
  size?: RevealButtonSize
  animation?: RevealButtonAnimation
  direction?: 'up' | 'down' | 'left' | 'right'
  trigger?: boolean
  triggerStart?: string
  triggerEnd?: string
  triggerOnce?: boolean
  markers?: boolean
  animateOnMount?: boolean
  delay?: number
  duration?: number
  ease?: string
  magneticStrength?: number
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onRevealStart?: () => void
  onRevealComplete?: () => void
  customAnimation?: (element: HTMLElement, timeline: gsap.core.Timeline) => void
}

export interface RevealButtonRef {
  reveal: () => void
  hide: () => void
  isRevealed: boolean
  element: HTMLElement | null
}

const RevealButton = forwardRef<RevealButtonRef, RevealButtonProps>(({
  children,
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  animation = 'scale',
  direction = 'up',
  trigger = true,
  triggerStart = 'top 90%',
  triggerEnd = 'bottom 10%',
  triggerOnce = true,
  markers = false,
  animateOnMount = false,
  delay = 0,
  duration = 0.6,
  ease = 'back.out(1.7)',
  magneticStrength = 0.3,
  className,
  iconLeft,
  iconRight,
  onRevealStart,
  onRevealComplete,
  customAnimation,
  onClick,
  ...buttonProps
}, ref) => {
  const buttonRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const magneticRef = useRef<gsap.core.Tween | null>(null)
  const isRevealedRef = useRef(false)
  const hasTriggeredRef = useRef(false)

  const [rectRef, rect] = useRect()

  // Get animation properties
  const getAnimationProps = () => {
    const props: any = {
      from: {},
      to: {}
    }

    switch (animation) {
      case 'fade':
        props.from = { opacity: 0 }
        props.to = { opacity: 1 }
        break

      case 'scale':
        props.from = { scale: 0, opacity: 0 }
        props.to = { scale: 1, opacity: 1 }
        break

      case 'slide':
        const offset = 50
        props.from = {
          opacity: 0,
          x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
          y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
        }
        props.to = { opacity: 1, x: 0, y: 0 }
        break

      case 'flip':
        const rotationAxis = direction === 'left' || direction === 'right' ? 'Y' : 'X'
        props.from = { 
          opacity: 0, 
          [`rotation${rotationAxis}`]: direction === 'up' || direction === 'left' ? -90 : 90,
          transformPerspective: 600
        }
        props.to = { 
          opacity: 1, 
          [`rotation${rotationAxis}`]: 0,
          transformPerspective: 600
        }
        break

      case 'morph':
        props.from = { 
          scale: 0.8, 
          opacity: 0, 
          borderRadius: '50%' 
        }
        props.to = { 
          scale: 1, 
          opacity: 1, 
          borderRadius: 'var(--button-radius, 8px)' 
        }
        break
    }

    return props
  }

  // Create reveal animation
  const createRevealAnimation = () => {
    if (!buttonRef.current) return

    const timeline = gsap.timeline({
      paused: !animateOnMount,
      delay,
      onStart: onRevealStart,
      onComplete: () => {
        isRevealedRef.current = true
        onRevealComplete?.()
        
        // Enable magnetic effect after reveal
        if (animation === 'magnetic') {
          enableMagneticEffect()
        }
      }
    })

    if (customAnimation) {
      customAnimation(buttonRef.current, timeline)
    } else {
      const { from, to } = getAnimationProps()

      // Set initial state
      gsap.set(buttonRef.current, from)

      // Animate to final state
      timeline.to(buttonRef.current, {
        ...to,
        duration,
        ease
      })

      // Add inner content animation
      if (innerRef.current) {
        timeline.from(innerRef.current.children, {
          y: 20,
          opacity: 0,
          duration: duration * 0.6,
          stagger: 0.05,
          ease: 'power2.out'
        }, `-=${duration * 0.3}`)
      }
    }

    timelineRef.current = timeline
    return timeline
  }

  // Magnetic effect
  const enableMagneticEffect = () => {
    if (!buttonRef.current || animation !== 'magnetic') return

    const button = buttonRef.current
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      magneticRef.current = gsap.to(button, {
        x: x * magneticStrength,
        y: y * magneticStrength,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      magneticRef.current?.kill()
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)'
      })
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
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
        timeline?.play()
      }
    },
    onLeave: () => {
      if (!triggerOnce) {
        timelineRef.current?.reverse()
      }
    }
  }, [trigger, triggerOnce])

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
    get element() {
      return buttonRef.current
    }
  }))

  const classes = cn(
    styles.revealButton,
    styles[`revealButton--${variant}`],
    styles[`revealButton--${size}`],
    styles[`revealButton--${animation}`],
    {
      [styles['revealButton--revealed']]: isRevealedRef.current,
      [styles['revealButton--hasIconLeft']]: !!iconLeft,
      [styles['revealButton--hasIconRight']]: !!iconRight,
    },
    className
  )

  const content = (
    <div ref={innerRef} className={styles.revealButton__inner}>
      {iconLeft && <span className={styles.revealButton__iconLeft}>{iconLeft}</span>}
      <span className={styles.revealButton__text}>{children}</span>
      {iconRight && <span className={styles.revealButton__iconRight}>{iconRight}</span>}
    </div>
  )

  const buttonElement = (
    <button
      ref={(el) => {
        buttonRef.current = el
        rectRef(el)
      }}
      className={classes}
      onClick={onClick}
      {...buttonProps}
    >
      {content}
    </button>
  )

  return (
    <ConditionalWrapper
      condition={!!href}
      wrapper={(children) => (
        <Link 
          href={href!} 
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          ref={(el) => {
            buttonRef.current = el
            rectRef(el)
          }}
          className={classes}
        >
          {content}
        </Link>
      )}
    >
      {buttonElement}
    </ConditionalWrapper>
  )
})

RevealButton.displayName = 'RevealButton'

export default RevealButton