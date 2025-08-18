import React from 'react'
import { cn } from '@/utilities/ui'
import { ThemeManager } from './ThemeManager'
import './wrapper.scss'

export interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: 'light' | 'dark' | 'auto'
}

/**
 * Main application wrapper component
 * Provides consistent layout structure and theme management
 * This is a server component - theme handling is delegated to ThemeManager client component
 */
export function Wrapper({ 
  children, 
  className,
  theme = 'auto',
  ...props 
}: WrapperProps) {
  return (
    <>
      <ThemeManager theme={theme} />
      <div 
        className={cn('wrapper', className)} 
        {...props}
      >
        <main className="wrapper__main">
          {children}
        </main>
      </div>
    </>
  )
}