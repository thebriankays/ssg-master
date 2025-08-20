'use client'

import { useEffect, useRef } from 'react'
import MouseFollower from 'mouse-follower'
import gsap from 'gsap'

// Register GSAP with MouseFollower
if (typeof window !== 'undefined') {
  MouseFollower.registerGSAP(gsap)
}

interface MouseFollowerProviderProps {
  children: React.ReactNode
}

let cursorInstance: MouseFollower | null = null

export function MouseFollowerProvider({ children }: MouseFollowerProviderProps) {
  const isInitialized = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return

    try {
      // Create cursor instance
      cursorInstance = new MouseFollower({
        container: document.body,
        className: 'mf-cursor',
        innerClassName: 'mf-cursor-inner',
        textClassName: 'mf-cursor-text',
        mediaClassName: 'mf-cursor-media',
        mediaBoxClassName: 'mf-cursor-media-box',
        dataAttr: 'cursor',
        hiddenState: '-hidden',
        textState: '-text',
        iconState: '-icon',
        activeState: '-active',
        mediaState: '-media',
        stateDetection: {
          '-pointer': 'a,button,[data-cursor-pointer]',
          '-hidden': 'iframe,input,textarea,[data-cursor-hidden]',
          '-drag': '[data-cursor*="-drag"]',
        },
        visible: true,
        speed: 0.7,
        ease: 'expo.out',
        overwrite: true,
        skewing: 0, // No skewing for circular cursor
        skewingText: 0,
        skewingIcon: 0,
        skewingMedia: 2,
        skewingDelta: 0.001,
        skewingDeltaMax: 0.15,
        stickDelta: 0.15,
        showTimeout: 20,
        hideOnLeave: true,
        hideTimeout: 300,
      })
      
      isInitialized.current = true
    } catch (error) {
      console.error('Failed to initialize MouseFollower:', error)
    }

    return () => {
      if (cursorInstance) {
        cursorInstance.destroy()
        cursorInstance = null
        isInitialized.current = false
      }
    }
  }, [])

  return <>{children}</>
}
