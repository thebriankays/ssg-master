import React from 'react'
import './heading.scss'

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type HeadingVariant = 'display-large' | 'display-medium' | 'display-small' | HeadingLevel

interface HeadingProps {
  as?: HeadingLevel
  variant?: HeadingVariant
  children: React.ReactNode
  className?: string
  id?: string
  style?: React.CSSProperties
}

export const Heading: React.FC<HeadingProps> = ({
  as = 'h2',
  variant,
  children,
  className = '',
  id,
  style,
}) => {
  const Component = as
  const variantClass = variant || as
  const classes = `heading ${variantClass} ${className}`.trim()

  return (
    <Component id={id} className={classes} style={style}>
      {children}
    </Component>
  )
}