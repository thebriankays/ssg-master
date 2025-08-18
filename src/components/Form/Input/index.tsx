'use client'

import { cn } from '@/utilities/ui'
import * as React from 'react'
import { forwardRef, useState } from 'react'
import './input.scss'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'filled' | 'flushed' | 'unstyled'
  inputSize?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      variant = 'default',
      inputSize = 'md',
      isLoading,
      onClear,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    const sizeClasses = {
      sm: 'h-8 text-sm px-2',
      md: 'h-10 px-3',
      lg: 'h-12 text-lg px-4',
    }
    
    const variantClasses = {
      default: 'border border-border bg-background',
      filled: 'border-0 bg-muted',
      flushed: 'border-0 border-b rounded-none px-0',
      unstyled: 'border-0 bg-transparent px-0',
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }
    
    const showClearButton = onClear && hasValue && !disabled && !isLoading
    
    return (
      <div className={cn('input-wrapper', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'input-label',
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              {
                'text-destructive': error,
                'input-label--required': required,
              }
            )}
          >
            {label}
          </label>
        )}
        
        <div className={cn('input-container', { 'input-container--focused': isFocused })}>
          {icon && iconPosition === 'left' && (
            <div className="input-icon input-icon--left">{icon}</div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'input',
              'flex w-full rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              sizeClasses[inputSize],
              variantClasses[variant],
              {
                'pl-10': icon && iconPosition === 'left',
                'pr-10': icon && iconPosition === 'right' || showClearButton,
                'border-destructive': error,
              }
            )}
            disabled={disabled || isLoading}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          
          {showClearButton && (
            <button
              type="button"
              onClick={onClear}
              className="input-clear"
              aria-label="Clear input"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 1L1 13M1 1L13 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          
          {icon && iconPosition === 'right' && !showClearButton && (
            <div className="input-icon input-icon--right">{icon}</div>
          )}
          
          {isLoading && (
            <div className="input-loader">
              <div className="input-loader__spinner" />
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${inputId}-error`} className="input-error text-sm text-destructive">
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p id={`${inputId}-hint`} className="input-hint text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'