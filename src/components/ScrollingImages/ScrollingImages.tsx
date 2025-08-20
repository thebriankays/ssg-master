'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from '@/providers/lenis-provider'
import type { Media } from '@/payload-types'
import styles from './scrolling-images.module.scss'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export type ScrollingImagesVariant = '3d' | 'scaleXY' | 'scaleOpacity'

export interface ScrollingImagesProps {
  images: Array<{
    image: Media
    alt: string
  }>
  variant?: ScrollingImagesVariant
  columns?: number
  gap?: string
  imageHeight?: string
  infiniteScroll?: boolean
  className?: string
}

export const ScrollingImages: React.FC<ScrollingImagesProps> = ({
  images,
  variant = '3d',
  columns = 3,
  gap = '5vh',
  imageHeight = '100vh',
  infiniteScroll = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  // Helper function to get image URL
  const getImageUrl = (image: Media): string => {
    if (typeof image === 'string') return image
    if (image && typeof image === 'object' && 'url' in image) return image.url || ''
    return ''
  }

  // Update ScrollTrigger when Lenis scrolls
  useLenis(() => {
    ScrollTrigger.update()
  })

  useEffect(() => {
    if (!gridRef.current || images.length === 0) return

    console.log('Setting up ScrollingImages animations')

    const ctx = gsap.context(() => {
      // Store original item count before duplication
      const originalItemCount = images.length
      
      // Duplicate items for infinite scroll effect
      const repeatItems = () => {
        if (!gridRef.current) return
        const items = [...gridRef.current.children]
        const itemsToRepeat = Math.min(columns, items.length)
        
        for (let i = 0; i < itemsToRepeat; i++) {
          const cln = items[i].cloneNode(true)
          gridRef.current.appendChild(cln)
        }
      }

      // Only repeat items if we have enough for the effect
      if (images.length >= columns) {
        repeatItems()
      }

      // Get total number of items after duplication
      const totalItems = gridRef.current?.children.length || 0
      console.log(`Total items: ${totalItems}, Original: ${originalItemCount}, Columns: ${columns}`)

      // Animation setup based on variant
      if (variant === '3d') {
        setup3DAnimation(originalItemCount, totalItems)
      } else if (variant === 'scaleXY') {
        setupScaleXYAnimation(originalItemCount, totalItems)
      } else if (variant === 'scaleOpacity') {
        setupScaleOpacityAnimation(originalItemCount, totalItems)
      }

      function setup3DAnimation(originalCount: number, totalItems: number) {
        if (!gridRef.current) return

        // Animate ALL items
        const allItems = gridRef.current.querySelectorAll(`.${styles.gridItem}`)
        
        allItems.forEach((el, index) => {
          const htmlEl = el as HTMLElement
          
          // Determine position based on original layout
          const isFirst = index < columns
          const isLastOriginal = index >= originalCount - columns && index < originalCount
          const isDuplicated = index >= originalCount
          const isMiddle = !isFirst && !isLastOriginal && !isDuplicated

          if (htmlEl.parentNode) {
            gsap.set(htmlEl.parentNode, { perspective: 1000 })
          }

          if (isFirst || isDuplicated) {
            // First items and duplicated items animate the same way (exit to top)
            gsap.set(htmlEl, { transformOrigin: '0% 100%' })
            gsap.to(htmlEl, {
              ease: 'none',
              startAt: { scale: 1, rotationY: 0, rotationX: 0, filter: 'brightness(1)' },
              scale: 0,
              rotationY: 70,
              rotationX: 10,
              filter: 'brightness(3)',
              scrollTrigger: {
                trigger: htmlEl,
                start: 'top center',
                end: 'bottom top',
                scrub: true,
                onLeave: () => {
                  gsap.set(htmlEl, { scale: 1, rotationY: 0, rotationX: 0, filter: 'brightness(1)' })
                },
              },
            })
          } else if (isLastOriginal) {
            // Last original items (enter from bottom)
            gsap.set(htmlEl, { transformOrigin: '100% 0%', scale: 0 })
            gsap.to(htmlEl, {
              ease: 'none',
              startAt: { scale: 0, rotationY: 70, rotationX: 10, filter: 'brightness(3)' },
              scale: 1,
              rotationY: 0,
              rotationX: 0,
              filter: 'brightness(1)',
              scrollTrigger: {
                trigger: htmlEl,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                onLeaveBack: () => {
                  gsap.set(htmlEl, { scale: 1, rotationY: 0, rotationX: 0, filter: 'brightness(1)' })
                },
              },
            })
          } else if (isMiddle) {
            // Middle items
            // Entry animation
            gsap.timeline()
              .to(htmlEl, {
                scrollTrigger: {
                  trigger: htmlEl,
                  start: 'top bottom',
                  end: 'center center',
                  scrub: true,
                  onEnter: () => gsap.set(htmlEl, { transformOrigin: '100% 0%' }),
                  onEnterBack: () => gsap.set(htmlEl, { transformOrigin: '100% 0%' }),
                  onLeave: () => gsap.set(htmlEl, { transformOrigin: '0% 100%' }),
                  onLeaveBack: () => gsap.set(htmlEl, { transformOrigin: '0% 100%' }),
                },
                startAt: { scale: 0, rotationY: -70, rotationX: 10, filter: 'brightness(3)' },
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                filter: 'brightness(1)',
                ease: 'none',
              })

            // Exit animation
            gsap.timeline()
              .to(htmlEl, {
                scrollTrigger: {
                  trigger: htmlEl,
                  start: 'center center',
                  end: 'bottom top',
                  scrub: true,
                  onEnter: () => gsap.set(htmlEl, { transformOrigin: '0% 100%' }),
                  onEnterBack: () => gsap.set(htmlEl, { transformOrigin: '0% 100%' }),
                  onLeave: () => gsap.set(htmlEl, { transformOrigin: '100% 0%' }),
                  onLeaveBack: () => gsap.set(htmlEl, { transformOrigin: '100% 0%' }),
                },
                startAt: { scale: 1, rotationY: 0, rotationX: 0, filter: 'brightness(1)' },
                scale: 0,
                rotationY: 70,
                rotationX: 10,
                filter: 'brightness(3)',
                ease: 'none',
              })
          }
        })
      }

      function setupScaleXYAnimation(originalCount: number, totalItems: number) {
        if (!gridRef.current) return

        // Animate ALL items
        const allItems = gridRef.current.querySelectorAll(`.${styles.gridItem}`)
        
        allItems.forEach((el, index) => {
          const htmlEl = el as HTMLElement
          
          // Determine position based on original layout
          const isFirst = index < columns
          const isLastOriginal = index >= originalCount - columns && index < originalCount
          const isDuplicated = index >= originalCount
          const isMiddle = !isFirst && !isLastOriginal && !isDuplicated
          
          console.log(`Item ${index}: isFirst=${isFirst}, isLastOriginal=${isLastOriginal}, isDuplicated=${isDuplicated}, isMiddle=${isMiddle}`)

          if (isFirst || isDuplicated) {
            // First items and duplicated items (exit to top)
            console.log(`Setting up first/dup animation for item ${index}`)
            gsap.set(htmlEl, { 
              transformOrigin: '50% 100%',
              scaleY: 1,
              scaleX: 0.8
            })
            
            gsap.to(htmlEl, {
              ease: 'none',
              scaleY: 0,
              scaleX: 1,
              scrollTrigger: {
                trigger: htmlEl,
                start: 'top center',
                end: 'bottom top',
                scrub: true,
                markers: index === 0, // Show markers for first item
                onUpdate: (self) => {
                  if (index === 0 || index === 1 || index === 2) {
                    console.log(`First row item ${index} progress:`, self.progress.toFixed(3))
                  }
                },
                onLeave: () => {
                  gsap.set(htmlEl, { scaleY: 1, scaleX: 0.8 })
                },
                onEnterBack: () => {
                  gsap.set(htmlEl, { scaleY: 1, scaleX: 0.8 })
                }
              },
            })
          } else if (isLastOriginal) {
            // Last original items (enter from bottom)
            console.log(`Setting up last animation for item ${index}`)
            
            // Set initial state explicitly
            gsap.set(htmlEl, { 
              transformOrigin: '50% 0%', 
              scaleY: 0, 
              scaleX: 1 
            })
            
            const tween = gsap.to(htmlEl, {
              ease: 'none',
              scaleY: 1,
              scaleX: 0.8,
              scrollTrigger: {
                trigger: htmlEl,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                markers: index === 10, // Show markers for item 10
                onUpdate: (self) => {
                  console.log(`Last row item ${index} progress:`, self.progress.toFixed(3))
                },
                onStart: () => {
                  console.log(`Last row item ${index} animation started`)
                },
                onComplete: () => {
                  console.log(`Last row item ${index} animation completed`)
                },
                onLeaveBack: () => {
                  console.log(`Last row item ${index} left back`)
                  gsap.set(htmlEl, { scaleY: 0, scaleX: 1 })
                },
                onEnter: () => {
                  console.log(`Last row item ${index} entered`)
                  gsap.set(htmlEl, { scaleY: 0, scaleX: 1 })
                }
              },
            })
            
            // Log the actual tween values
            console.log(`Item ${index} tween created:`, {
              hasScrollTrigger: !!tween.scrollTrigger,
              vars: tween.vars
            })
            
          } else if (isMiddle) {
            // Middle items
            console.log(`Setting up middle animation for item ${index}`)
            
            // Entry animation - from bottom
            gsap.set(htmlEl, { transformOrigin: '50% 0%', scaleY: 0, scaleX: 1 })
            
            const tl1 = gsap.timeline({
              scrollTrigger: {
                trigger: htmlEl,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onUpdate: (self) => {
                  if (self.direction === 1) {
                    gsap.set(htmlEl, { transformOrigin: '50% 0%' })
                  } else {
                    gsap.set(htmlEl, { transformOrigin: '50% 100%' })
                  }
                }
              }
            })
            .fromTo(htmlEl, 
              { scaleY: 0, scaleX: 1 },
              { scaleY: 1, scaleX: 0.8, ease: 'none' }
            )

            // Exit animation - to top
            const tl2 = gsap.timeline({
              scrollTrigger: {
                trigger: htmlEl,
                start: 'center center',
                end: 'bottom top',
                scrub: true,
                onUpdate: (self) => {
                  if (self.direction === 1) {
                    gsap.set(htmlEl, { transformOrigin: '50% 100%' })
                  } else {
                    gsap.set(htmlEl, { transformOrigin: '50% 0%' })
                  }
                }
              }
            })
            .fromTo(htmlEl,
              { scaleY: 1, scaleX: 0.8 },
              { scaleY: 0, scaleX: 1, ease: 'none' }
            )
          }
        })
        
        // Check all elements have correct initial states
        console.log('Checking initial states:')
        allItems.forEach((el, index) => {
          const htmlEl = el as HTMLElement
          const computedStyle = window.getComputedStyle(htmlEl)
          const transform = computedStyle.transform
          console.log(`Item ${index} initial transform:`, transform)
        })
      }

      function setupScaleOpacityAnimation(originalCount: number, totalItems: number) {
        if (!gridRef.current) return

        // Animate ALL items
        const allItems = gridRef.current.querySelectorAll(`.${styles.gridItem}`)
        
        allItems.forEach((el, index) => {
          const htmlEl = el as HTMLElement
          
          // Determine position based on original layout
          const isFirst = index < columns
          const isLastOriginal = index >= originalCount - columns && index < originalCount
          const isDuplicated = index >= originalCount
          const isMiddle = !isFirst && !isLastOriginal && !isDuplicated

          if (isFirst || isDuplicated) {
            // First items and duplicated items (exit to top)
            gsap.set(htmlEl, { 
              transformOrigin: '50% 100%',
              scaleY: 1,
              opacity: 1
            })
            
            gsap.to(htmlEl, {
              ease: 'none',
              scaleY: 0,
              opacity: 0,
              scrollTrigger: {
                trigger: htmlEl,
                start: 'top center',
                end: 'bottom top',
                scrub: true,
                onLeave: () => {
                  gsap.set(htmlEl, { scaleY: 1, opacity: 1 })
                },
                onEnterBack: () => {
                  gsap.set(htmlEl, { scaleY: 1, opacity: 1 })
                }
              },
            })
          } else if (isLastOriginal) {
            // Last original items (enter from bottom)
            gsap.set(htmlEl, { 
              transformOrigin: '50% 0%', 
              scaleY: 0, 
              opacity: 0 
            })
            
            gsap.to(htmlEl, {
              ease: 'none',
              scaleY: 1,
              opacity: 1,
              scrollTrigger: {
                trigger: htmlEl,
                start: 'top bottom',
                end: 'center center',
                scrub: true,
                onLeaveBack: () => {
                  gsap.set(htmlEl, { scaleY: 0, opacity: 0 })
                },
                onEnter: () => {
                  gsap.set(htmlEl, { scaleY: 0, opacity: 0 })
                }
              },
            })
          } else if (isMiddle) {
            // Middle items
            // Entry animation
            gsap.timeline()
              .to(htmlEl, {
                ease: 'none',
                startAt: { scaleY: 0, opacity: 0 },
                scaleY: 1,
                opacity: 1,
                scrollTrigger: {
                  trigger: htmlEl,
                  start: 'top bottom',
                  end: 'center center',
                  scrub: true,
                  onEnter: () => gsap.set(htmlEl, { transformOrigin: '50% 0%' }),
                  onEnterBack: () => gsap.set(htmlEl, { transformOrigin: '50% 0%' }),
                  onLeave: () => gsap.set(htmlEl, { transformOrigin: '50% 100%' }),
                  onLeaveBack: () => gsap.set(htmlEl, { transformOrigin: '50% 100%' }),
                },
              })

            // Exit animation
            gsap.timeline()
              .to(htmlEl, {
                ease: 'none',
                startAt: { scaleY: 1, opacity: 1 },
                scaleY: 0,
                opacity: 0,
                scrollTrigger: {
                  trigger: htmlEl,
                  start: 'center center',
                  end: 'bottom top',
                  scrub: true,
                  onEnter: () => gsap.set(htmlEl, { transformOrigin: '50% 100%' }),
                  onEnterBack: () => gsap.set(htmlEl, { transformOrigin: '50% 100%' }),
                  onLeave: () => gsap.set(htmlEl, { transformOrigin: '50% 0%' }),
                  onLeaveBack: () => gsap.set(htmlEl, { transformOrigin: '50% 0%' }),
                },
              })
          }
        })
      }

      // Refresh ScrollTrigger after setup to ensure Lenis integration
      setTimeout(() => {
        ScrollTrigger.refresh()
        console.log('ScrollTrigger refreshed, total triggers:', ScrollTrigger.getAll().length)
      }, 100)
    }, containerRef)

    // Cleanup
    return () => {
      ctx.revert()
    }
  }, [images, variant, columns])

  // Refresh ScrollTrigger when Lenis instance changes
  useEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh()
    }
  }, [lenis])

  // Handle scroll trigger refresh on resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`${styles.scrollingImages} ${className} ${infiniteScroll ? styles.infiniteScroll : ''}`}
    >
      <div 
        ref={gridRef}
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap,
          ['--image-height' as any]: imageHeight,
        }}
      >
        {images.map((item, index) => {
          const imageUrl = getImageUrl(item.image)
          return (
            <div
              key={index}
              className={styles.gridItem}
              style={{
                backgroundImage: `url(${imageUrl})`,
              }}
              aria-label={item.alt}
            />
          )
        })}
      </div>
    </div>
  )
}
