import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useLenis } from 'lenis/react'
import { cn } from '@/utilities/ui'
import './scrollbar.scss'

export interface ScrollbarProps {
  /**
   * Orientation of the scrollbar
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal'
  
  /**
   * Whether to show scrollbar only on hover
   * @default true
   */
  hoverable?: boolean
  
  /**
   * Whether the scrollbar is always visible
   * @default false
   */
  alwaysVisible?: boolean
  
  /**
   * Scrollbar size (width for vertical, height for horizontal)
   * @default 8
   */
  size?: number
  
  /**
   * Scrollbar track padding
   * @default 4
   */
  trackPadding?: number
  
  /**
   * Custom className for the scrollbar
   */
  className?: string
  
  /**
   * Whether to enable click to jump functionality
   * @default true
   */
  clickToJump?: boolean
  
  /**
   * Scrollbar z-index
   * @default 50
   */
  zIndex?: number
  
  /**
   * Custom styles for track
   */
  trackStyle?: React.CSSProperties
  
  /**
   * Custom styles for thumb
   */
  thumbStyle?: React.CSSProperties
  
  /**
   * Hide delay in milliseconds (when hoverable is true)
   * @default 1000
   */
  hideDelay?: number
}

export const Scrollbar: React.FC<ScrollbarProps> = ({
  orientation = 'vertical',
  hoverable = true,
  alwaysVisible = false,
  size = 8,
  trackPadding = 4,
  className,
  clickToJump = true,
  zIndex = 50,
  trackStyle,
  thumbStyle,
  hideDelay = 1000,
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [thumbSize, setThumbSize] = useState(0)
  const [thumbPosition, setThumbPosition] = useState(0)
  const [isVisible, setIsVisible] = useState(!hoverable || alwaysVisible)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const dragStartRef = useRef({ mousePos: 0, scrollPos: 0 })
  
  const isVertical = orientation === 'vertical'
  
  // Get Lenis instance
  const lenis = useLenis()
  
  // Update scrollbar on scroll
  const updateScrollbar = useCallback(() => {
    if (!trackRef.current || !thumbRef.current || !lenis) return
    
    const { scroll, limit } = lenis
    
    if (limit <= 0) {
      setIsVisible(false)
      return
    }
    
    const trackSize = isVertical 
      ? trackRef.current.clientHeight 
      : trackRef.current.clientWidth
    
    // Calculate thumb size based on viewport to content ratio
    const viewportSize = isVertical ? window.innerHeight : window.innerWidth
    const contentSize = viewportSize + limit
    const ratio = viewportSize / contentSize
    const calculatedThumbSize = Math.max(30, trackSize * ratio)
    
    // Calculate thumb position
    const scrollProgress = scroll / limit
    const maxThumbPosition = trackSize - calculatedThumbSize
    const calculatedThumbPosition = scrollProgress * maxThumbPosition
    
    setThumbSize(calculatedThumbSize)
    setThumbPosition(calculatedThumbPosition)
    
    // Show scrollbar when content is scrollable
    if (!alwaysVisible && hoverable) {
      setIsVisible(true)
      
      // Clear existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      
      // Set new timeout to hide scrollbar
      if (!isHovered && !isDragging) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false)
        }, hideDelay)
      }
    }
  }, [isVertical, lenis, lenis, hoverable, alwaysVisible, hideDelay, isHovered, isDragging])
  
  // Listen to Lenis scroll events
  // Subscribe to Lenis scroll events
  useLenis(updateScrollbar)
  
  // Update on resize
  useEffect(() => {
    const handleResize = () => updateScrollbar()
    window.addEventListener('resize', handleResize)
    
    // Initial update
    updateScrollbar()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [updateScrollbar])
  
  // Handle track click (jump to position)
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickToJump || !trackRef.current || !lenis || e.target === thumbRef.current) return
    
    const { limit } = lenis
    const rect = trackRef.current.getBoundingClientRect()
    
    const clickPosition = isVertical 
      ? e.clientY - rect.top
      : e.clientX - rect.left
    
    const trackSize = isVertical 
      ? trackRef.current.clientHeight 
      : trackRef.current.clientWidth
    
    const scrollProgress = clickPosition / trackSize
    const targetScroll = scrollProgress * limit
    
    lenis.scrollTo(targetScroll, {
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })
  }, [isVertical, lenis, lenis, clickToJump])
  
  // Handle thumb drag start
  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!lenis) return
    
    setIsDragging(true)
    dragStartRef.current = {
      mousePos: isVertical ? e.clientY : e.clientX,
      scrollPos: lenis.scroll
    }
    
    // Add mouse event listeners to document for drag
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }, [isVertical, lenis])
  
  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !trackRef.current) return
    
    if (!lenis) return
    
    const { limit } = lenis
    const currentMousePos = isVertical ? e.clientY : e.clientX
    const mouseDelta = currentMousePos - dragStartRef.current.mousePos
    
    const trackSize = isVertical 
      ? trackRef.current.clientHeight 
      : trackRef.current.clientWidth
    
    const scrollDelta = (mouseDelta / (trackSize - thumbSize)) * limit
    const targetScroll = dragStartRef.current.scrollPos + scrollDelta
    
    lenis.scrollTo(targetScroll, {
      immediate: true
    })
  }, [isDragging, isVertical, thumbSize, lenis])
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [handleDragMove])
  
  // Clean up drag listeners on unmount
  useEffect(() => {
    return () => {
      if (isDragging) {
        handleDragEnd()
      }
    }
  }, [isDragging, handleDragEnd])
  
  // Handle hover states
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    if (hoverable && !alwaysVisible) {
      setIsVisible(true)
    }
  }, [hoverable, alwaysVisible])
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (hoverable && !alwaysVisible && !isDragging) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, hideDelay)
    }
  }, [hoverable, alwaysVisible, isDragging, hideDelay])
  
  // Don't render if no Lenis instance
  if (!lenis) return null
  
  return (
    <div
      ref={trackRef}
      className={cn(
        'scrollbar',
        `scrollbar--${orientation}`,
        {
          'scrollbar--hoverable': hoverable && !alwaysVisible,
          'scrollbar--visible': isVisible || alwaysVisible,
          'scrollbar--dragging': isDragging,
        },
        className
      )}
      style={{
        [isVertical ? 'width' : 'height']: `${size}px`,
        padding: `${trackPadding}px`,
        zIndex,
        ...trackStyle,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTrackClick}
    >
      <div className="scrollbar__track">
        <div
          ref={thumbRef}
          className="scrollbar__thumb"
          style={{
            [isVertical ? 'height' : 'width']: `${thumbSize}px`,
            transform: isVertical 
              ? `translateY(${thumbPosition}px)` 
              : `translateX(${thumbPosition}px)`,
            ...thumbStyle,
          }}
          onMouseDown={handleDragStart}
        />
      </div>
    </div>
  )
}

export default Scrollbar