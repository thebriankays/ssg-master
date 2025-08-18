import React, { useRef, useState, useEffect, ReactNode } from 'react'
import { useTempus, useScrollVelocity } from '@/hooks'
import './marquee.scss'

export interface MarqueeProps {
  children: ReactNode
  /** Number of times to repeat the content for seamless scrolling */
  repeat?: number
  /** Base speed in pixels per second */
  speed?: number
  /** Whether to pause on hover */
  pauseOnHover?: boolean
  /** Whether to reverse the direction */
  reversed?: boolean
  /** Whether to integrate with scroll velocity */
  scrollVelocity?: boolean
  /** Multiplier for scroll velocity effect */
  scrollVelocityMultiplier?: number
  /** Additional CSS class */
  className?: string
  /** Gap between repeated items in pixels */
  gap?: number
}

/**
 * Marquee - Infinite scrolling animation component
 * 
 * Features:
 * - Smooth RAF-based animation
 * - Scroll velocity integration
 * - Pause on hover
 * - Configurable speed and direction
 * - Seamless looping with repeat control
 */
export const Marquee: React.FC<MarqueeProps> = ({
  children,
  repeat = 2,
  speed = 50,
  pauseOnHover = false,
  reversed = false,
  scrollVelocity = false,
  scrollVelocityMultiplier = 1,
  className = '',
  gap = 0,
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [contentWidth, setContentWidth] = useState(0)
  const positionRef = useRef(0)
  const velocity = useScrollVelocity({ smoothing: 0.1 })

  // Calculate content width
  useEffect(() => {
    const updateContentWidth = () => {
      if (innerRef.current) {
        const firstChild = innerRef.current.children[0] as HTMLElement
        if (firstChild) {
          setContentWidth(firstChild.offsetWidth + gap)
        }
      }
    }

    updateContentWidth()
    window.addEventListener('resize', updateContentWidth)
    
    // Use ResizeObserver if available for more accurate updates
    if (typeof ResizeObserver !== 'undefined' && innerRef.current) {
      const resizeObserver = new ResizeObserver(updateContentWidth)
      resizeObserver.observe(innerRef.current)
      
      return () => {
        resizeObserver.disconnect()
        window.removeEventListener('resize', updateContentWidth)
      }
    }
    
    return () => {
      window.removeEventListener('resize', updateContentWidth)
    }
  }, [gap, children])

  // Animation loop
  useTempus((time: number) => {
    if (!innerRef.current || isPaused || contentWidth === 0) return

    // Calculate delta time (assuming 60fps as baseline)
    const deltaTime = 16.67 // ~60fps in ms

    // Calculate speed with optional scroll velocity
    let currentSpeed = speed
    if (scrollVelocity && velocity !== 0) {
      // Add scroll velocity to base speed
      const scrollEffect = velocity * scrollVelocityMultiplier
      currentSpeed = speed + Math.abs(scrollEffect)
      
      // Optionally reverse direction based on scroll direction
      if (velocity < 0 && !reversed) {
        currentSpeed = -currentSpeed
      } else if (velocity > 0 && reversed) {
        currentSpeed = -currentSpeed
      }
    }

    // Apply direction
    const finalSpeed = reversed ? -Math.abs(currentSpeed) : Math.abs(currentSpeed)
    
    // Update position
    positionRef.current += (finalSpeed * deltaTime) / 1000

    // Reset position for seamless loop
    if (positionRef.current > contentWidth) {
      positionRef.current -= contentWidth
    } else if (positionRef.current < -contentWidth) {
      positionRef.current += contentWidth
    }

    // Apply transform
    innerRef.current.style.transform = `translateX(${-positionRef.current}px)`
  })

  // Generate repeated content
  const repeatedContent = Array.from({ length: Math.max(2, repeat) }, (_, index) => (
    <div key={index} className="marquee__content" style={{ paddingRight: gap ? `${gap}px` : undefined }}>
      {children}
    </div>
  ))

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false)
    }
  }

  const marqueeClasses = [
    'marquee',
    isPaused && 'marquee--paused',
    reversed && 'marquee--reversed',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={marqueeRef}
      className={marqueeClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={innerRef} className="marquee__inner">
        {repeatedContent}
      </div>
    </div>
  )
}

export default Marquee