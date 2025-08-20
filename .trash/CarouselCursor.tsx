'use client'

import { useEffect, useRef } from 'react'
import './carousel-cursor.scss'

interface CarouselCursorProps {
  isActive?: boolean
}

export function CarouselCursor({ isActive = false }: CarouselCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const requestRef = useRef<number>()

  useEffect(() => {
    if (!cursorRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      
      // Show/hide cursor based on position
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
      }
    }

    const animate = () => {
      // Smooth lerp animation
      currentRef.current.x += (positionRef.current.x - currentRef.current.x) * 0.1
      currentRef.current.y += (positionRef.current.y - currentRef.current.y) * 0.1

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={cursorRef}
      className={`carousel-cursor ${isActive ? 'carousel-cursor--active' : ''}`}
      style={{ opacity: 0 }}
    >
      <div className="carousel-cursor__inner">
        <span className="carousel-cursor__text">DRAG</span>
      </div>
    </div>
  )
}
