'use client'

import { cn } from '@/utilities/ui'
import * as React from 'react'
import './form-field.scss'

export interface FormFieldProps {
  children: React.ReactNode
  label?: string
  description?: string
  error?: string | string[]
  required?: boolean
  className?: string
  htmlFor?: string
}

export function FormField({
  children,
  label,
  description,
  error,
  required,
  className,
  htmlFor,
}: FormFieldProps) {
  const errors = Array.isArray(error) ? error : error ? [error] : []
  const hasError = errors.length > 0
  
  return (
    <div
      className={cn(
        'form-field',
        {
          'form-field--error': hasError,
        },
        className
      )}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn('form-field__label', {
            'form-field__label--required': required,
          })}
        >
          {label}
        </label>
      )}
      
      {description && !hasError && (
        <p className="form-field__description">{description}</p>
      )}
      
      <div className="form-field__control">{children}</div>
      
      {errors.map((err, index) => (
        <p key={index} className="form-field__error" role="alert">
          {err}
        </p>
      ))}
    </div>
  )
}