'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useScrollProgress } from '@/hooks/useScrollTrigger'
import './fold.scss'

export interface FoldProps {
  children: React.ReactNode
  className?: string
  type?: 'top' | 'bottom'
  disabled?: boolean
  parallax?: boolean
  parallaxSpeed?: number
  overlay?: boolean
  overlayOpacity?: number
  start?: string
  end?: string
  pinSpacing?: boolean
  markers?: boolean
}

const Fold: React.FC<FoldProps> = ({
  children,
  className = '',
  type = 'top',
  disabled = false,
  parallax = true,
  parallaxSpeed = 0.5,
  overlay = true,
  overlayOpacity = 0.6,
  start = 'top top',
  end = 'bottom top',
  pinSpacing = true,
  markers = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  // Get scroll progress using the custom hook
  const progress = useScrollProgress(
    containerRef as React.RefObject<HTMLElement>,
    {
      start,
      end,
      scrub: true,
      markers,
      pinSpacing,
    }
  )
  
  // Update isActive based on progress
  useEffect(() => {
    setIsActive(progress > 0 && progress < 1)
  }, [progress])

  // Apply parallax effect
  useEffect(() => {
    if (disabled || !parallax || !contentRef.current) return

    const content = contentRef.current
    const translateY = type === 'top' 
      ? progress * parallaxSpeed * 100 
      : -progress * parallaxSpeed * 100

    content.style.transform = `translateY(${translateY}%)`
  }, [progress, parallax, parallaxSpeed, type, disabled])

  // Apply overlay effect
  useEffect(() => {
    if (disabled || !overlay || !overlayRef.current) return

    const overlayElement = overlayRef.current
    const opacity = type === 'top'
      ? progress * overlayOpacity
      : (1 - progress) * overlayOpacity

    overlayElement.style.opacity = opacity.toString()
  }, [progress, overlay, overlayOpacity, type, disabled])

  // Set CSS custom properties for progress
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--fold-progress', progress.toString())
      containerRef.current.style.setProperty('--fold-progress-inverse', (1 - progress).toString())
    }
  }, [progress])

  const foldClasses = [
    'fold',
    `fold--${type}`,
    disabled && 'fold--disabled',
    isActive && 'fold--active',
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      ref={containerRef} 
      className={foldClasses}
      data-fold-type={type}
      data-fold-progress={progress.toFixed(2)}
    >
      <div ref={contentRef} className="fold__content">
        {children}
      </div>
      {overlay && !disabled && (
        <div ref={overlayRef} className="fold__overlay" aria-hidden="true" />
      )}
    </div>
  )
}

// Compound components for better composition
export interface FoldHeaderProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export const FoldHeader: React.FC<FoldHeaderProps> = ({
  children,
  className = '',
  sticky = true,
}) => {
  return (
    <div className={`fold__header ${sticky ? 'fold__header--sticky' : ''} ${className}`}>
      {children}
    </div>
  )
}

export interface FoldBodyProps {
  children: React.ReactNode
  className?: string
}

export const FoldBody: React.FC<FoldBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`fold__body ${className}`}>
      {children}
    </div>
  )
}

export interface FoldFooterProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export const FoldFooter: React.FC<FoldFooterProps> = ({
  children,
  className = '',
  sticky = false,
}) => {
  return (
    <div className={`fold__footer ${sticky ? 'fold__footer--sticky' : ''} ${className}`}>
      {children}
    </div>
  )
}

// Display names for debugging
Fold.displayName = 'Fold'
FoldHeader.displayName = 'FoldHeader'
FoldBody.displayName = 'FoldBody'
FoldFooter.displayName = 'FoldFooter'

// Export compound component
export default Object.assign(Fold, {
  Header: FoldHeader,
  Body: FoldBody,
  Footer: FoldFooter,
})