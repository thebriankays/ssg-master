'use client'

import { cn } from '@/utilities/ui'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import * as React from 'react'
import './radio.scss'

// Radio Item Component
export interface RadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioItemProps
>(({ className, label, description, size = 'md', id, ...props }, ref) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }
  
  const indicatorSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  }
  
  return (
    <div className={cn('radio-item', className)}>
      <RadioGroupPrimitive.Item
        ref={ref}
        id={radioId}
        className={cn(
          'radio-button',
          'aspect-square rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size]
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="radio-indicator flex items-center justify-center">
          <Circle className={cn('fill-current text-current', indicatorSizes[size])} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      
      {(label || description) && (
        <div className="radio-content">
          {label && (
            <label
              htmlFor={radioId}
              className="radio-label text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="radio-description text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

RadioItem.displayName = 'RadioItem'

// Radio Group Component
export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  label?: string
  description?: string
  error?: string
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'cards'
  className?: string
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      className,
      label,
      description,
      error,
      orientation = 'vertical',
      size = 'md',
      variant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <fieldset className={cn('radio-group', `radio-group--${variant}`, className)}>
        {(label || description) && (
          <div className="radio-group__header">
            {label && (
              <legend className="radio-group__label text-sm font-medium">
                {label}
              </legend>
            )}
            {description && (
              <p className="radio-group__description text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        
        <RadioGroupPrimitive.Root
          ref={ref}
          className={cn('radio-group__items', {
            'radio-group__items--horizontal': orientation === 'horizontal',
            'radio-group__items--vertical': orientation === 'vertical',
            'radio-group__items--cards': variant === 'cards',
          })}
          aria-describedby={error ? 'radio-group-error' : undefined}
          {...props}
        >
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === RadioItem) {
              return React.cloneElement(child as React.ReactElement<RadioItemProps>, {
                size,
              })
            }
            return child
          })}
        </RadioGroupPrimitive.Root>
        
        {error && (
          <p id="radio-group-error" className="radio-group__error text-sm text-destructive">
            {error}
          </p>
        )}
      </fieldset>
    )
  }
)

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

// Advanced Radio Card Component
export interface RadioCardProps extends RadioItemProps {
  icon?: React.ReactNode
  badge?: string
}

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioCardProps
>(({ className, label, description, icon, badge, ...props }, ref) => {
  return (
    <RadioItem
      ref={ref}
      className={cn('radio-card', className)}
      {...props}
    >
      <div className="radio-card__content">
        {icon && <div className="radio-card__icon">{icon}</div>}
        <div className="radio-card__text">
          <div className="radio-card__header">
            {label && <span className="radio-card__label">{label}</span>}
            {badge && <span className="radio-card__badge">{badge}</span>}
          </div>
          {description && (
            <p className="radio-card__description text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </RadioItem>
  )
})

RadioCard.displayName = 'RadioCard'

export { RadioGroup, RadioItem, RadioCard }