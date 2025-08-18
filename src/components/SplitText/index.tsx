'use client'

import React, { useRef, useEffect, useImperativeHandle, forwardRef, ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { splitText } from './split-text'
import cn from 'clsx'
import './split-text.scss'

export type SplitType = 'chars' | 'words' | 'lines' | 'words,lines' | 'chars,words' | 'chars,words,lines'

export interface SplitTextProps {
  children: ReactNode
  type?: SplitType
  className?: string
  willAppear?: boolean
  mask?: boolean
  tag?: keyof JSX.IntrinsicElements
  charClassName?: string
  wordClassName?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  duration?: number
  ease?: string
  animateFrom?: {
    opacity?: number
    y?: number | string
    x?: number | string
    scale?: number
    rotation?: number
    skewY?: number
  }
  animateTo?: {
    opacity?: number
    y?: number | string
    x?: number | string
    scale?: number
    rotation?: number
    skewY?: number
  }
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
}

export interface SplitTextRef {
  play: () => void
  pause: () => void
  reverse: () => void
  restart: () => void
  kill: () => void
  getChars: () => HTMLElement[]
  getWords: () => HTMLElement[]
  getLines: () => HTMLElement[]
  getTimeline: () => gsap.core.Timeline | null
}

const SplitText = forwardRef<SplitTextRef, SplitTextProps>(({
  children,
  type = 'words',
  className,
  willAppear = true,
  mask = false,
  tag: Tag = 'div',
  charClassName,
  wordClassName,
  lineClassName,
  delay = 0,
  stagger = 0.05,
  duration = 0.8,
  ease = 'power2.out',
  animateFrom = { opacity: 0, y: 20 },
  animateTo = { opacity: 1, y: 0 },
  onAnimationComplete,
  onAnimationStart,
}, ref) => {
  const containerRef = useRef<HTMLElement>(null)
  const splitRef = useRef<any>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const elementsRef = useRef<{
    chars: HTMLElement[]
    words: HTMLElement[]
    lines: HTMLElement[]
  }>({ chars: [], words: [], lines: [] })

  // Initialize split text
  useEffect(() => {
    if (!containerRef.current || typeof children !== 'string') return

    // Create split instance
    splitRef.current = splitText(containerRef.current, {
      type: type,
      linesClass: 'split-text__line',
      wordsClass: 'split-text__word',
      charsClass: 'split-text__char',
    })

    // Store references to elements
    elementsRef.current = {
      chars: splitRef.current.chars || [],
      words: splitRef.current.words || [],
      lines: splitRef.current.lines || [],
    }

    // Add custom classes
    if (charClassName) {
      elementsRef.current.chars.forEach(char => char.classList.add(charClassName))
    }
    if (wordClassName) {
      elementsRef.current.words.forEach(word => word.classList.add(wordClassName))
    }
    if (lineClassName) {
      elementsRef.current.lines.forEach(line => line.classList.add(lineClassName))
    }

    // Apply mask if needed
    if (mask && elementsRef.current.lines.length > 0) {
      elementsRef.current.lines.forEach(line => {
        line.style.overflow = 'hidden'
        line.style.display = 'block'
      })
    }

    return () => {
      if (splitRef.current) {
        splitRef.current.revert()
      }
    }
  }, [children, type, mask, charClassName, wordClassName, lineClassName])

  // Create animation
  useGSAP(() => {
    if (!splitRef.current || !willAppear) return

    // Determine what to animate based on type
    let targets: HTMLElement[] = []
    if (type.includes('chars')) {
      targets = elementsRef.current.chars
    } else if (type.includes('words')) {
      targets = elementsRef.current.words
    } else if (type.includes('lines')) {
      targets = elementsRef.current.lines
    }

    if (targets.length === 0) return

    // Create timeline
    timelineRef.current = gsap.timeline({
      delay,
      onStart: onAnimationStart,
      onComplete: onAnimationComplete,
    })

    // Set initial state
    gsap.set(targets, animateFrom)

    // Animate
    timelineRef.current.to(targets, {
      ...animateTo,
      duration,
      ease,
      stagger: {
        each: stagger,
        from: 'start',
      },
    })

    return () => {
      timelineRef.current?.kill()
    }
  }, [willAppear, type, delay, stagger, duration, ease])

  // Imperative API
  useImperativeHandle(ref, () => ({
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    reverse: () => timelineRef.current?.reverse(),
    restart: () => timelineRef.current?.restart(),
    kill: () => timelineRef.current?.kill(),
    getChars: () => elementsRef.current.chars,
    getWords: () => elementsRef.current.words,
    getLines: () => elementsRef.current.lines,
    getTimeline: () => timelineRef.current,
  }))

  const rootClassName = cn(
    'split-text',
    {
      'split-text--mask': mask,
      'split-text--will-appear': willAppear,
    },
    className
  )

  return React.createElement(
    Tag,
    { ref: containerRef as any, className: rootClassName },
    children
  )
})

SplitText.displayName = 'SplitText'

export default SplitText