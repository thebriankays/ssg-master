import React, { useRef, useMemo, useCallback, useEffect } from 'react'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import './progress-text.scss'

export interface ProgressTextProps {
  /** Text content to animate */
  children: string
  /** Custom class name */
  className?: string
  /** Start trigger position (default: 'top bottom') */
  start?: string
  /** End trigger position (default: 'bottom top') */
  end?: string
  /** Callback when visibility changes for a word */
  onChange?: (visibleWords: number, progress: number) => void
  /** Custom transition duration in ms (default: 600) */
  transitionDuration?: number
  /** Custom transition delay between words in ms (default: 50) */
  transitionDelay?: number
  /** Custom transition easing (default: 'cubic-bezier(0.4, 0, 0.2, 1)') */
  transitionEasing?: string
  /** Whether to animate spaces (default: false) */
  animateSpaces?: boolean
  /** Custom word separator regex (default: /\s+/) */
  wordSeparator?: RegExp
  /** Threshold for word visibility (0-1, default: 0) */
  visibilityThreshold?: number
}

export const ProgressText: React.FC<ProgressTextProps> = ({
  children,
  className = '',
  start = 'top bottom',
  end = 'bottom top',
  onChange,
  transitionDuration = 600,
  transitionDelay = 50,
  transitionEasing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  animateSpaces = false,
  wordSeparator = /\s+/,
  visibilityThreshold = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(containerRef as React.RefObject<HTMLElement>, { start, end })
  const previousVisibleWords = useRef(0)

  // Split text into words
  const words = useMemo(() => {
    const splitWords = children.split(wordSeparator)
    if (!animateSpaces) {
      return splitWords.filter(word => word.length > 0)
    }
    
    // Include spaces if animateSpaces is true
    const wordsWithSpaces: string[] = []
    const parts = children.split(/(\s+)/)
    parts.forEach(part => {
      if (part.length > 0) {
        if (wordSeparator.test(part)) {
          // It's a space or separator
          wordsWithSpaces.push(part)
        } else {
          // It's a word
          wordsWithSpaces.push(part)
        }
      }
    })
    return wordsWithSpaces
  }, [children, wordSeparator, animateSpaces])

  // Calculate which words should be visible based on progress
  const visibleWords = useMemo(() => {
    const totalWords = words.length
    const visibleCount = Math.floor((progress + visibilityThreshold) * totalWords)
    return Math.min(visibleCount, totalWords)
  }, [progress, words.length, visibilityThreshold])

  // Call onChange when visible words change
  useEffect(() => {
    if (onChange && visibleWords !== previousVisibleWords.current) {
      onChange(visibleWords, progress)
      previousVisibleWords.current = visibleWords
    }
  }, [visibleWords, progress, onChange])

  // Memoize word rendering
  const renderWords = useCallback(() => {
    return words.map((word, index) => {
      const isVisible = index < visibleWords
      const delay = index * transitionDelay
      
      const style: React.CSSProperties = {
        '--transition-duration': `${transitionDuration}ms`,
        '--transition-delay': `${delay}ms`,
        '--transition-easing': transitionEasing,
      } as React.CSSProperties

      // Handle spaces
      if (animateSpaces && wordSeparator.test(word)) {
        return (
          <span
            key={`space-${index}`}
            className="progress-text__space"
            style={style}
          >
            {word}
          </span>
        )
      }

      return (
        <span
          key={`word-${index}`}
          className={`progress-text__word ${isVisible ? 'progress-text__word--visible' : ''}`}
          style={style}
          data-word={word}
          data-index={index}
        >
          {word}
        </span>
      )
    })
  }, [words, visibleWords, transitionDuration, transitionDelay, transitionEasing, animateSpaces, wordSeparator])

  return (
    <div ref={containerRef} className={`progress-text ${className}`}>
      {renderWords()}
    </div>
  )
}

export default ProgressText