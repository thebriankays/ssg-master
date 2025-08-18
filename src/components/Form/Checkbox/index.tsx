'use client'

import { cn } from '@/utilities/ui'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import * as React from 'react'
import './checkbox.scss'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
  error?: string
  indeterminate?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'circle'
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      label,
      description,
      error,
      indeterminate,
      size = 'md',
      variant = 'default',
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }
    
    const iconSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }
    
    return (
      <div className={cn('checkbox-wrapper', className)}>
        <div className="checkbox-container">
          <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            className={cn(
              'checkbox',
              'peer shrink-0 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              sizeClasses[size],
              {
                'rounded-full': variant === 'circle',
                'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground': true,
                'border-destructive': error,
              }
            )}
            disabled={disabled}
            checked={indeterminate ? 'indeterminate' : props.checked}
            {...props}
          >
            <CheckboxPrimitive.Indicator
              className={cn('checkbox-indicator', 'flex items-center justify-center text-current')}
            >
              {indeterminate ? (
                <Minus className={iconSizes[size]} />
              ) : (
                <Check className={iconSizes[size]} />
              )}
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          
          {(label || description) && (
            <div className="checkbox-content">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    'checkbox-label',
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    {
                      'text-destructive': error,
                    }
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="checkbox-description text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="checkbox-error text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = CheckboxPrimitive.Root.displayName

// Checkbox Group Component
export interface CheckboxGroupProps {
  label?: string
  description?: string
  error?: string
  orientation?: 'horizontal' | 'vertical'
  children: React.ReactNode
  className?: string
}

export function CheckboxGroup({
  label,
  description,
  error,
  orientation = 'vertical',
  children,
  className,
}: CheckboxGroupProps) {
  return (
    <fieldset className={cn('checkbox-group', className)}>
      {(label || description) && (
        <div className="checkbox-group__header">
          {label && (
            <legend className="checkbox-group__label text-sm font-medium">
              {label}
            </legend>
          )}
          {description && (
            <p className="checkbox-group__description text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div
        className={cn('checkbox-group__items', {
          'checkbox-group__items--horizontal': orientation === 'horizontal',
          'checkbox-group__items--vertical': orientation === 'vertical',
        })}
        role="group"
        aria-describedby={error ? 'checkbox-group-error' : undefined}
      >
        {children}
      </div>
      
      {error && (
        <p id="checkbox-group-error" className="checkbox-group__error text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export { Checkbox }