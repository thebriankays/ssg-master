'use client'

import { View } from '@react-three/drei'
import { forwardRef, useRef, type ReactNode } from 'react'

interface WebGLViewProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  index?: number
  frames?: number
  'data-cursor'?: string
  'data-cursor-text'?: string
}

/**
 * WebGLView Component
 * Wrapper around drei's View that handles DOM tracking and styling
 */
export const WebGLView = forwardRef<HTMLDivElement, WebGLViewProps>(
  ({ children, className, style, index = 1, frames = Infinity, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
      <>
        {/* DOM element that defines the bounds */}
        <div 
          ref={(el) => {
            containerRef.current = el
            if (ref) {
              if (typeof ref === 'function') ref(el)
              else ref.current = el
            }
          }}
          className={className}
          style={style}
          data-cursor={props['data-cursor']}
          data-cursor-text={props['data-cursor-text']}
        />
        
        {/* WebGL View that renders within those bounds */}
        <View track={containerRef} index={index} frames={frames}>
          {children}
        </View>
      </>
    )
  }
)

WebGLView.displayName = 'WebGLView'
