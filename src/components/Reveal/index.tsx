'use client'

// Central export file for all Reveal components
export { default as RevealText } from './RevealText'
export type { RevealTextProps, RevealTextRef } from './RevealText'

export { default as RevealImage } from './RevealImage'
export type { RevealImageProps, RevealImageRef, RevealImageAnimation } from './RevealImage'

export { default as RevealButton } from './RevealButton'
export type { 
  RevealButtonProps, 
  RevealButtonRef, 
  RevealButtonAnimation,
  RevealButtonVariant,
  RevealButtonSize 
} from './RevealButton'

// Re-export utilities that might be useful
export { default as ConditionalWrapper } from '~/components/ConditionalWrapper'
export { default as SplitText } from '~/components/SplitText'
export type { SplitTextProps, SplitTextRef, SplitType } from '~/components/SplitText'

// Common types for all reveal components
export interface RevealBaseProps {
  trigger?: boolean
  triggerStart?: string
  triggerEnd?: string
  triggerOnce?: boolean
  markers?: boolean
  scrub?: boolean | number
  pin?: boolean
  animateOnMount?: boolean
  delay?: number
  duration?: number
  ease?: string
  onRevealStart?: () => void
  onRevealComplete?: () => void
}

// Preset animations configurations
export const RevealPresets = {
  text: {
    fadeUp: {
      animateFrom: { opacity: 0, y: 50 },
      animateTo: { opacity: 1, y: 0 },
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.02
    },
    slideIn: {
      animateFrom: { opacity: 0, x: -100 },
      animateTo: { opacity: 1, x: 0 },
      duration: 1,
      ease: 'power2.out',
      stagger: 0.03
    },
    rotateIn: {
      animateFrom: { opacity: 0, rotationX: -90, y: 50 },
      animateTo: { opacity: 1, rotationX: 0, y: 0 },
      duration: 1,
      ease: 'back.out(1.7)',
      stagger: 0.02
    },
    scaleIn: {
      animateFrom: { opacity: 0, scale: 0 },
      animateTo: { opacity: 1, scale: 1 },
      duration: 0.6,
      ease: 'back.out(1.7)',
      stagger: 0.02
    }
  },
  image: {
    fadeIn: {
      animation: 'fade' as const,
      duration: 1.2,
      ease: 'power2.inOut'
    },
    clipUp: {
      animation: 'clip' as const,
      direction: 'up' as const,
      duration: 1.2,
      ease: 'power3.inOut'
    },
    slideIn: {
      animation: 'slide' as const,
      direction: 'left' as const,
      duration: 1,
      ease: 'power2.out'
    },
    zoomIn: {
      animation: 'zoom' as const,
      scale: 1.2,
      duration: 1.5,
      ease: 'power2.out'
    },
    parallax: {
      animation: 'parallax' as const,
      parallaxSpeed: 0.3,
      scrub: true
    }
  },
  button: {
    scaleIn: {
      animation: 'scale' as const,
      duration: 0.6,
      ease: 'back.out(1.7)'
    },
    slideUp: {
      animation: 'slide' as const,
      direction: 'up' as const,
      duration: 0.8,
      ease: 'power3.out'
    },
    flipIn: {
      animation: 'flip' as const,
      direction: 'up' as const,
      duration: 0.8,
      ease: 'power2.out'
    },
    morphIn: {
      animation: 'morph' as const,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    },
    magnetic: {
      animation: 'magnetic' as const,
      magneticStrength: 0.3,
      duration: 0.6,
      ease: 'power2.out'
    }
  }
} as const

// Utility function to combine presets with custom props
export function withRevealPreset<T extends Record<string, any>>(
  preset: T,
  customProps?: Partial<T>
): T {
  return { ...preset, ...customProps }
}