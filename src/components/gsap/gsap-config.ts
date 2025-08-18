'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  
  // Default configuration
  gsap.defaults({ ease: 'none' })
  gsap.config({ nullTargetWarn: false })
  
  // ScrollTrigger defaults
  ScrollTrigger.defaults({
    markers: process.env.NODE_ENV === 'development',
  })
}

export { gsap, ScrollTrigger, SplitText }