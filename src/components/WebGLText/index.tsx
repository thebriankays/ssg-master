'use client'

import { useRef, useEffect, useState, type CSSProperties } from 'react'
import dynamic from 'next/dynamic'
import { View } from '@/providers/shared-canvas-provider'
import { cn } from '@/utilities/ui'
import { useScrollTrigger } from '@/hooks'
import { useRect } from 'hamo'
import { gsap } from 'gsap'
import './webgl-text.scss'

const WebGLTextMesh = dynamic(
  () => import('./webgl').then(({ WebGLTextMesh }) => WebGLTextMesh),
  { ssr: false }
)

export interface WebGLTextProps {
  children: string
  className?: string
  style?: CSSProperties
  
  // HTML element
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  
  // Animation
  animate?: boolean
  animationDelay?: number
  maskReveal?: boolean
  scrollTrigger?: boolean
  
  // Typography
  fontSize?: number
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'center' | 'right'
  
  // WebGL specific
  shader?: 'default' | 'distort' | 'gradient' | 'mask-reveal'
  color?: string
  gradientColors?: [string, string]
  distortionAmount?: number
  distortionSpeed?: number
}

export { WebGLTextPostProcessing } from './PostProcessing'

export function WebGLText({
  children,
  className,
  style,
  as: Tag = 'div',
  animate = true,
  animationDelay = 0,
  maskReveal = false,
  scrollTrigger: enableScrollTrigger = true,
  fontSize,
  fontWeight = 400,
  lineHeight = 1.2,
  letterSpacing = 0,
  textAlign = 'left',
  shader = 'default',
  color = '#ffffff',
  gradientColors = ['#ff0066', '#00ff88'],
  distortionAmount = 0.1,
  distortionSpeed = 1,
}: WebGLTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [setRectRef, rect] = useRect()
  const [isVisible, setIsVisible] = useState(!enableScrollTrigger)
  const [progress, setProgress] = useState(0)
  
  // Handle scroll-triggered animations
  useScrollTrigger({
    rect,
    start: 'top bottom',
    end: 'bottom top',
    disabled: !(animate && enableScrollTrigger),
    onEnter: () => {
      setIsVisible(true)
      if (maskReveal) {
        gsap.to({ value: 0 }, {
          value: 1,
          duration: 1.8,
          ease: 'power4.out',
          delay: animationDelay,
          onUpdate: function() {
            setProgress(this.targets()[0].value)
          }
        })
      }
    },
    onLeave: () => {
      setIsVisible(false)
      if (maskReveal) {
        gsap.to({ value: 1 }, {
          value: 0,
          duration: 1.2,
          ease: 'power4.in',
          onUpdate: function() {
            setProgress(this.targets()[0].value)
          }
        })
      }
    }
  })
  
  // Handle non-scroll triggered mask reveal
  useEffect(() => {
    if (!enableScrollTrigger && maskReveal && isVisible) {
      gsap.to({ value: 0 }, {
        value: 1,
        duration: 1.8,
        ease: 'power4.out',
        delay: animationDelay,
        onUpdate: function() {
          setProgress(this.targets()[0].value)
        }
      })
    }
  }, [enableScrollTrigger, maskReveal, isVisible, animationDelay])
  
  return (
    <div
      ref={containerRef}
      className={cn('webgl-text', className)}
      style={style}
    >
      {/* SEO-friendly HTML text */}
      <Tag
        ref={setRectRef as any}
        className={cn('webgl-text__html', {
          'webgl-text__html--hidden': isVisible,
        })}
        style={{
          fontSize,
          fontWeight,
          lineHeight,
          letterSpacing,
          textAlign,
        }}
      >
        {children}
      </Tag>
      
      {/* WebGL text overlay */}
      {typeof window !== 'undefined' && (
        <View
          track={containerRef as React.RefObject<HTMLElement>}
          className="webgl-text__canvas"
        >
          <WebGLTextMesh
            text={children}
            htmlElement={rect?.element || null}
            visible={isVisible}
            progress={progress}
            shader={shader}
            color={color}
            gradientColors={gradientColors}
            distortionAmount={distortionAmount}
            distortionSpeed={distortionSpeed}
            fontWeight={fontWeight}
          />
        </View>
      )}
    </div>
  )
}