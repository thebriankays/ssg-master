'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import './accordion.scss'

// Context for Accordion
interface AccordionContextType {
  openItems: string[]
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

// Accordion Root Component
interface AccordionProps {
  children: React.ReactNode
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
  variant?: 'default' | 'bordered' | 'separated' | 'flush'
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  className = '',
  variant = 'default',
}) => {
  const isControlled = value !== undefined
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }
    return []
  })

  const actualOpenItems = isControlled
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : openItems

  const toggleItem = (itemValue: string) => {
    let newOpenItems: string[]

    if (type === 'single') {
      newOpenItems = actualOpenItems.includes(itemValue) ? [] : [itemValue]
    } else {
      newOpenItems = actualOpenItems.includes(itemValue)
        ? actualOpenItems.filter((item) => item !== itemValue)
        : [...actualOpenItems, itemValue]
    }

    if (!isControlled) {
      setOpenItems(newOpenItems)
    }

    if (onValueChange) {
      onValueChange(type === 'single' ? newOpenItems[0] || '' : newOpenItems)
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems: actualOpenItems, toggleItem, type }}>
      <div className={`accordion accordion--${variant} ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

// Accordion Item Component
interface AccordionItemProps {
  children: React.ReactNode
  value: string
  className?: string
  disabled?: boolean
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  value,
  className = '',
  disabled = false,
}) => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion')
  }

  const isOpen = context.openItems.includes(value)

  return (
    <div
      className={`accordion__item ${isOpen ? 'accordion__item--open' : ''} ${
        disabled ? 'accordion__item--disabled' : ''
      } ${className}`}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            isOpen,
            disabled,
          })
        }
        return child
      })}
    </div>
  )
}

// Accordion Trigger Component
interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  value?: string
  isOpen?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className = '',
  value,
  isOpen,
  disabled,
  icon,
  iconPosition = 'right',
}) => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('AccordionTrigger must be used within an Accordion')
  }

  const handleClick = () => {
    if (value && !disabled) {
      context.toggleItem(value)
    }
  }

  const iconElement = icon || (
    <ChevronDownIcon className="accordion__icon" aria-hidden="true" />
  )

  return (
    <button
      type="button"
      className={`accordion__trigger accordion__trigger--icon-${iconPosition} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {iconPosition === 'left' && iconElement}
      <span className="accordion__trigger-text">{children}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  )
}

// Accordion Content Component
interface AccordionContentProps {
  children: React.ReactNode
  className?: string
  value?: string
  isOpen?: boolean
  forceMount?: boolean
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
  isOpen = false,
  forceMount = false,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    if (isOpen) {
      // Opening animation
      setIsAnimating(true)
      const contentHeight = content.scrollHeight
      setHeight(contentHeight)

      const timer = setTimeout(() => {
        setHeight(undefined) // Allow content to be fully flexible after animation
        setIsAnimating(false)
      }, 300) // Match CSS transition duration

      return () => clearTimeout(timer)
    } else {
      // Closing animation
      setIsAnimating(true)
      const contentHeight = content.scrollHeight
      setHeight(contentHeight)

      // Force reflow
      content.getBoundingClientRect()

      // Start closing
      setHeight(0)

      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300) // Match CSS transition duration

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!forceMount && !isOpen && !isAnimating) {
    return null
  }

  return (
    <div
      className={`accordion__content-wrapper ${className}`}
      style={{
        height: height !== undefined ? `${height}px` : undefined,
      }}
      data-state={isOpen ? 'open' : 'closed'}
      aria-hidden={!isOpen}
    >
      <div ref={contentRef} className="accordion__content">
        {children}
      </div>
    </div>
  )
}

// Compound component exports
Accordion.displayName = 'Accordion'
AccordionItem.displayName = 'AccordionItem'
AccordionTrigger.displayName = 'AccordionTrigger'
AccordionContent.displayName = 'AccordionContent'

// Default export with compound components
export default Object.assign(Accordion, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})