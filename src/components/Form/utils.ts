// Form utility functions and types

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s+()-]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Validates a URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Form validation error type
 */
export interface FormError {
  field: string
  message: string
}

/**
 * Form field validation rules
 */
export interface ValidationRule {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  validate?: (value: any) => boolean | string | Promise<boolean | string>
}

/**
 * Validates a value against validation rules
 */
export async function validateField(
  value: any,
  rules: ValidationRule
): Promise<string | undefined> {
  // Required validation
  if (rules.required) {
    const isEmpty = value === null || value === undefined || value === '' || 
                   (Array.isArray(value) && value.length === 0)
    
    if (isEmpty) {
      return typeof rules.required === 'string' 
        ? rules.required 
        : 'This field is required'
    }
  }
  
  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return undefined
  }
  
  // Min length validation
  if (rules.minLength) {
    const minLength = typeof rules.minLength === 'number' 
      ? rules.minLength 
      : rules.minLength.value
    const message = typeof rules.minLength === 'object' 
      ? rules.minLength.message 
      : `Must be at least ${minLength} characters`
    
    if (String(value).length < minLength) {
      return message
    }
  }
  
  // Max length validation
  if (rules.maxLength) {
    const maxLength = typeof rules.maxLength === 'number' 
      ? rules.maxLength 
      : rules.maxLength.value
    const message = typeof rules.maxLength === 'object' 
      ? rules.maxLength.message 
      : `Must be no more than ${maxLength} characters`
    
    if (String(value).length > maxLength) {
      return message
    }
  }
  
  // Pattern validation
  if (rules.pattern) {
    const pattern = rules.pattern instanceof RegExp 
      ? rules.pattern 
      : rules.pattern.value
    const message = rules.pattern instanceof RegExp 
      ? 'Invalid format' 
      : rules.pattern.message
    
    if (!pattern.test(String(value))) {
      return message
    }
  }
  
  // Custom validation
  if (rules.validate) {
    const result = await rules.validate(value)
    if (result !== true) {
      return result === false ? 'Invalid value' : result
    }
  }
  
  return undefined
}

/**
 * Formats form data for submission
 */
export function formatFormData(data: Record<string, any>): FormData {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, String(item)))
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value))
    }
  })
  
  return formData
}

/**
 * Debounce function for form inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}