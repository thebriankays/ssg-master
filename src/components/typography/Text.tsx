import React from 'react'
import './text.scss'

export type TextVariant = 'body-large' | 'body-base' | 'body-small' | 'label-large' | 'label-base' | 'label-small' | 'code-large' | 'code-base' | 'code-small'
export type TextAs = 'p' | 'span' | 'div' | 'label' | 'code' | 'pre'

interface TextProps {
  as?: TextAs
  variant?: TextVariant
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  weight?: 'thin' | 'extralight' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'
  align?: 'left' | 'center' | 'right' | 'justify'
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case'
  truncate?: boolean
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6
}

export const Text: React.FC<TextProps> = ({
  as = 'p',
  variant = 'body-base',
  children,
  className = '',
  style,
  weight,
  color = 'default',
  align,
  transform,
  truncate,
  lineClamp,
}) => {
  const Component = as
  
  const classes = [
    'text',
    variant,
    weight && `font-${weight}`,
    color !== 'default' && `text-${color}`,
    align && `text-${align}`,
    transform,
    truncate && 'truncate',
    lineClamp && `line-clamp-${lineClamp}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <Component className={classes} style={style}>
      {children}
    </Component>
  )
}