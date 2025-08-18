'use client'

import { useEffect, useRef, createContext, useContext } from 'react'
import MouseFollower from 'mouse-follower'
import gsap from 'gsap'
import './mouse-follower.scss'

// Register GSAP with MouseFollower
if (typeof window !== 'undefined') {
  MouseFollower.registerGSAP(gsap)
}

// Types
interface MouseFollowerInstance {
  show: () => void
  hide: () => void
  setText: (text: string) => void
  removeText: () => void
  setIcon: (icon: string) => void
  removeIcon: () => void
  setImg: (src: string) => void
  removeImg: () => void
  setVideo: (src: string) => void
  removeVideo: () => void
  addState: (state: string) => void
  removeState: (state: string) => void
  setStick: (element: HTMLElement) => void
  removeStick: () => void
  setSkewing: (value: number) => void
  removeSkewing: () => void
  destroy: () => void
}

interface MouseFollowerContextType {
  cursor: MouseFollowerInstance | null
}

// Context
const MouseFollowerContext = createContext<MouseFollowerContextType>({ cursor: null })

interface MouseFollowerProviderProps {
  children: React.ReactNode
  options?: Partial<{
    container: string | HTMLElement
    speed: number
    ease: string
    skewing: number
    skewingText: number
    skewingIcon: number
    skewingMedia: number
    stateDetection: Record<string, string> | false
    visible: boolean
    visibleOnState: boolean
    showTimeout: number
    hideOnLeave: boolean
    hideTimeout: number
  }>
}

/**
 * MouseFollowerProvider - Initializes the Cuberto mouse follower
 * Should be added at the root level of your app
 */
export function MouseFollowerProvider({ 
  children, 
  options = {} 
}: MouseFollowerProviderProps) {
  const cursorRef = useRef<any>(null)

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return

    // Initialize mouse follower
    cursorRef.current = new MouseFollower({
      speed: 0.3,
      ease: 'expo.out',
      skewing: 2,
      skewingText: 3,
      skewingIcon: 2,
      skewingMedia: 2,
      stateDetection: {
        '-pointer': 'a, button',
        '-hidden': 'iframe, video',
        '-text': '[data-cursor-text]',
        '-icon': '[data-cursor-icon]',
        '-stick': '[data-cursor-stick]',
      },
      ...options,
    })

    // Add global styles for cursor states
    document.documentElement.style.cursor = 'none'

    return () => {
      // Cleanup
      if (cursorRef.current) {
        cursorRef.current.destroy()
        cursorRef.current = null
      }
      document.documentElement.style.cursor = 'auto'
    }
  }, [])

  return (
    <MouseFollowerContext.Provider value={{ cursor: cursorRef.current }}>
      {children}
    </MouseFollowerContext.Provider>
  )
}

/**
 * Custom hook to control the mouse follower
 */
export function useMouseFollower() {
  const context = useContext(MouseFollowerContext)
  
  if (!context) {
    console.warn('useMouseFollower must be used within MouseFollowerProvider')
    return {
      show: () => {},
      hide: () => {},
      setText: () => {},
      removeText: () => {},
      setIcon: () => {},
      removeIcon: () => {},
      setImg: () => {},
      removeImg: () => {},
      setVideo: () => {},
      removeVideo: () => {},
      addState: () => {},
      removeState: () => {},
      setStick: () => {},
      removeStick: () => {},
      setSkewing: () => {},
      removeSkewing: () => {},
    }
  }

  return {
    show: () => context.cursor?.show(),
    hide: () => context.cursor?.hide(),
    setText: (text: string) => context.cursor?.setText(text),
    removeText: () => context.cursor?.removeText(),
    setIcon: (icon: string) => context.cursor?.setIcon(icon),
    removeIcon: () => context.cursor?.removeIcon(),
    setImg: (src: string) => context.cursor?.setImg(src),
    removeImg: () => context.cursor?.removeImg(),
    setVideo: (src: string) => context.cursor?.setVideo(src),
    removeVideo: () => context.cursor?.removeVideo(),
    addState: (state: string) => context.cursor?.addState(state),
    removeState: (state: string) => context.cursor?.removeState(state),
    setStick: (element: HTMLElement) => context.cursor?.setStick(element),
    removeStick: () => context.cursor?.removeStick(),
    setSkewing: (value: number) => context.cursor?.setSkewing(value),
    removeSkewing: () => context.cursor?.removeSkewing(),
  }
}