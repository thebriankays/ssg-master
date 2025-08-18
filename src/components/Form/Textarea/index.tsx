'use client'

import { cn } from '@/utilities/ui'
import * as React from 'react'
import { forwardRef, useState, useEffect, useRef } from 'react'
import './textarea.scss'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  variant?: 'default' | 'filled' | 'flushed' | 'unstyled'
  textareaSize?: 'sm' | 'md' | 'lg'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both' | 'auto'
  maxLength?: number
  showCount?: boolean
  autoHeight?: boolean
  minRows?: number
  maxRows?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      variant = 'default',
      textareaSize = 'md',
      resize = 'vertical',
      maxLength,
      showCount = false,
      autoHeight = false,
      minRows = 3,
      maxRows = 10,
      disabled,
      required,
      id,
      onChange,
      value,
      defaultValue,
      ...props
    },
    forwardedRef
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (forwardedRef as React.RefObject<HTMLTextAreaElement>) || internalRef
    
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    
    const sizeClasses = {
      sm: 'text-sm px-2 py-1.5',
      md: 'px-3 py-2',
      lg: 'text-lg px-4 py-3',
    }
    
    const variantClasses = {
      default: 'border border-border bg-background',
      filled: 'border-0 bg-muted',
      flushed: 'border-0 border-b rounded-none px-0',
      unstyled: 'border-0 bg-transparent px-0',
    }
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
      auto: 'resize-none',
    }
    
    // Update character count
    useEffect(() => {
      const currentValue = value || defaultValue || ''
      setCharCount(String(currentValue).length)
    }, [value, defaultValue])
    
    // Auto-resize functionality
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoHeight) return
      
      // Reset height to get accurate scrollHeight
      textarea.style.height = 'auto'
      
      // Calculate new height
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight)
      const minHeight = lineHeight * minRows
      const maxHeight = lineHeight * maxRows
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
      
      textarea.style.height = `${newHeight}px`
    }, [autoHeight, minRows, maxRows, textareaRef])
    
    useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      adjustHeight()
      onChange?.(e)
    }
    
    return (
      <div className={cn('textarea-wrapper', className)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'textarea-label',
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              {
                'text-destructive': error,
                'textarea-label--required': required,
              }
            )}
          >
            {label}
          </label>
        )}
        
        <div className={cn('textarea-container', { 'textarea-container--focused': isFocused })}>
          <textarea
            ref={textareaRef}
            id={textareaId}
            className={cn(
              'textarea',
              'flex w-full rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              sizeClasses[textareaSize],
              variantClasses[variant],
              resizeClasses[resize],
              {
                'border-destructive': error,
                'min-h-[80px]': !autoHeight,
              }
            )}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
            {...props}
          />
          
          {(showCount || maxLength) && (
            <div className="textarea-count">
              <span className={cn({ 'text-destructive': maxLength && charCount > maxLength })}>
                {charCount}
              </span>
              {maxLength && <span className="text-muted-foreground">/{maxLength}</span>}
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${textareaId}-error`} className="textarea-error text-sm text-destructive">
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="textarea-hint text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'