'use client'

import { View } from '@react-three/drei'
import { forwardRef, type ReactNode } from 'react'
import { useRect } from 'hamo'

interface WebGLViewProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  index?: number
  frames?: number
}

/**
 * WebGLView Component
 * Wrapper around drei's View that handles DOM tracking and styling
 */
export const WebGLView = forwardRef<HTMLDivElement, WebGLViewProps>(
  ({ children, className, style, index = 1, frames = Infinity }, ref) => {
    const [setRectRef, rect] = useRect()

    return (
      <>
        {/* DOM element that defines the bounds */}
        <div 
          ref={(el) => {
            setRectRef(el)
            if (ref) {
              if (typeof ref === 'function') ref(el)
              else ref.current = el
            }
          }}
          className={className}
          style={style}
        />
        
        {/* WebGL View that renders within those bounds */}
        <View track={setRectRef as any} index={index} frames={frames}>
          {children}
        </View>
      </>
    )
  }
)

WebGLView.displayName = 'WebGLView'