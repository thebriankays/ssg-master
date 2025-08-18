'use client'

import { useEffect, useRef, useCallback, RefObject } from 'react'
import gsap from 'gsap'

interface SplitTextOptions {
  type?: 'chars' | 'words' | 'lines'
  linesClass?: string
  wordsClass?: string
  charsClass?: string
  tag?: string
  absolute?: boolean
}

export function useSplitText(
  elementRef: RefObject<HTMLElement>,
  options: SplitTextOptions = {}
) {
  const {
    type = 'lines',
    linesClass = 'split-line',
    wordsClass = 'split-word',
    charsClass = 'split-char',
    tag = 'div',
    absolute = false,
  } = options
  
  const splitRef = useRef<any>(null)
  const originalHTMLRef = useRef<string>('')
  
  const split = useCallback(() => {
    if (!elementRef.current) return []
    
    // Store original HTML
    if (!originalHTMLRef.current) {
      originalHTMLRef.current = elementRef.current.innerHTML
    }
    
    // Kill existing split
    if (splitRef.current) {
      splitRef.current.revert()
    }
    
    // Create new split using GSAP's SplitText utility if available
    // Otherwise, use a simple implementation
    if (typeof window !== 'undefined' && (window as any).SplitText) {
      splitRef.current = new (window as any).SplitText(elementRef.current, {
        type,
        linesClass,
        wordsClass,
        charsClass,
        tag,
        absolute,
      })
      
      return splitRef.current[type]
    } else {
      // Simple fallback implementation
      const element = elementRef.current
      const text = element.textContent || ''
      
      if (type === 'chars') {
        element.innerHTML = text
          .split('')
          .map(char => `<span class="${charsClass}">${char}</span>`)
          .join('')
        return element.querySelectorAll(`.${charsClass}`)
      } else if (type === 'words') {
        element.innerHTML = text
          .split(' ')
          .map(word => `<span class="${wordsClass}">${word}</span>`)
          .join(' ')
        return element.querySelectorAll(`.${wordsClass}`)
      } else if (type === 'lines') {
        // For lines, we need to measure and wrap
        const words = text.split(' ')
        const lines: string[][] = []
        let currentLine: string[] = []
        
        const testElement = document.createElement('span')
        testElement.style.visibility = 'hidden'
        testElement.style.position = 'absolute'
        testElement.style.whiteSpace = 'nowrap'
        element.appendChild(testElement)
        
        const maxWidth = element.offsetWidth
        
        words.forEach(word => {
          currentLine.push(word)
          testElement.textContent = currentLine.join(' ')
          
          if (testElement.offsetWidth > maxWidth && currentLine.length > 1) {
            currentLine.pop()
            lines.push([...currentLine])
            currentLine = [word]
          }
        })
        
        if (currentLine.length > 0) {
          lines.push(currentLine)
        }
        
        testElement.remove()
        
        element.innerHTML = lines
          .map(line => `<${tag} class="${linesClass}">${line.join(' ')}</${tag}>`)
          .join('')
          
        return element.querySelectorAll(`.${linesClass}`)
      }
    }
    
    return []
  }, [elementRef, type, linesClass, wordsClass, charsClass, tag, absolute])
  
  const revert = useCallback(() => {
    if (splitRef.current && splitRef.current.revert) {
      splitRef.current.revert()
    } else if (elementRef.current && originalHTMLRef.current) {
      elementRef.current.innerHTML = originalHTMLRef.current
    }
  }, [elementRef])
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      revert()
    }
  }, [revert])
  
  return { split, revert }
}