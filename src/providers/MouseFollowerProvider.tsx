'use client'

import { useEffect, useRef } from 'react'
import MouseFollower from 'mouse-follower'
import gsap from 'gsap'
import 'mouse-follower/dist/mouse-follower.min.css'
import './mouse-follower.scss'

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
      // Create cursor instance with all settings
      cursorInstance = new MouseFollower({
        container: document.body,
        className: 'mf-cursor',
        innerClassName: 'mf-cursor-inner',
        textClassName: 'mf-cursor-text',
        mediaClassName: 'mf-cursor-media',
        mediaBoxClassName: 'mf-cursor-media-box',
        iconSvgClassName: 'mf-svgsprite',
        iconSvgNamePrefix: '-',
        iconSvgSrc: '',
        dataAttr: 'cursor',
        hiddenState: '-hidden',
        textState: '-text',
        iconState: '-icon',
        activeState: '-active',
        mediaState: '-media',
        stateDetection: {
          '-pointer': 'a,button,.clickable,[data-cursor-pointer]',
          '-hidden': 'iframe,input,textarea,select,[data-cursor-hidden]',
          '-drag': '[data-cursor*="-drag"]',
        },
        visible: true,
        visibleOnState: false,
        speed: 0.55,
        ease: 'expo.out',
        overwrite: true,
        skewing: 0,
        skewingText: 0,
        skewingIcon: 0,
        skewingMedia: 0,
        skewingDelta: 0,
        skewingDeltaMax: 0,
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

// Export utility functions for cursor control
export const cursor = {
  show: () => cursorInstance?.show(),
  hide: () => cursorInstance?.hide(),
  setText: (text: string) => cursorInstance?.setText(text),
  removeText: () => cursorInstance?.removeText(),
  setIcon: (icon: string) => cursorInstance?.setIcon(icon),
  removeIcon: () => cursorInstance?.removeIcon(),
  setImg: (src: string) => cursorInstance?.setImg(src),
  removeImg: () => cursorInstance?.removeImg(),
  setVideo: (src: string) => cursorInstance?.setVideo(src),
  removeVideo: () => cursorInstance?.removeVideo(),
  addState: (state: string) => cursorInstance?.addState(state),
  removeState: (state: string) => cursorInstance?.removeState(state),
  toggleState: (state: string) => cursorInstance?.toggleState?.(state),
  setStick: (el: HTMLElement) => cursorInstance?.setStick(el),
  removeStick: () => cursorInstance?.removeStick(),
  setSkewing: (value: number) => cursorInstance?.setSkewing(value),
  removeSkewing: () => cursorInstance?.removeSkewing(),
  destroy: () => cursorInstance?.destroy(),
}

// Hook for using cursor in components
export function useMouseFollower() {
  return cursor
}
