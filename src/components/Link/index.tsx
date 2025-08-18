'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import React, {
  type AnchorHTMLAttributes,
  type MouseEvent,
  useEffect,
  useState,
} from 'react'

import type { Page, Post } from '@/payload-types'

// Type for CMS Link data structure
type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

// Type for general Link props
type CustomLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps | 'href'
> &
  NextLinkProps & {
    href?: string
    onClick?: (e: MouseEvent<HTMLElement>) => void
    scroll?: boolean
    prefetchStrategy?: 'auto' | 'always' | 'never'
  }

// Combined Link props
type LinkProps = CMSLinkType & CustomLinkProps

export const Link: React.FC<LinkProps> = (props) => {
  const {
    // CMS props
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    // Next.js Link props
    scroll = false,
    prefetchStrategy = 'auto',
    onClick,
    ...restProps
  } = props

  const pathname = usePathname()
  const [shouldPrefetch, setShouldPrefetch] = useState(false)
  const [isExternal, setIsExternal] = useState(false)

  // Generate href from CMS data
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url || props.href

  // Determine if link is active
  const isActive = pathname === href

  useEffect(() => {
    // Skip if no href
    if (!href) return

    // Check if external link
    try {
      const linkUrl = new URL(href, window.location.href)
      setIsExternal(linkUrl.host !== window.location.host)
    } catch {
      setIsExternal(false)
    }

    // Determine prefetch strategy
    if (prefetchStrategy === 'never') {
      setShouldPrefetch(false)
    } else if (prefetchStrategy === 'always') {
      setShouldPrefetch(true)
    } else {
      // Auto: Only prefetch on good connections
      const connection = (
        navigator as Navigator & {
          connection?: { effectiveType: string; saveData: boolean }
        }
      ).connection
      
      if (connection) {
        const { effectiveType, saveData } = connection
        setShouldPrefetch(effectiveType === '4g' && !saveData)
      } else {
        // Default to prefetching if API not available
        setShouldPrefetch(true)
      }
    }
  }, [href, prefetchStrategy])

  // If no href is provided but there's an onClick, render a button
  if (!href && onClick) {
    return (
      <button
        onClick={(e: MouseEvent<HTMLButtonElement>) => onClick(e)}
        type="button"
        className={className}
        {...(restProps as React.ComponentProps<'button'>)}
      >
        {label || children}
      </button>
    )
  }

  // If no href and no onClick, render a div
  if (!href) {
    return (
      <div className={className} {...(restProps as React.ComponentProps<'div'>)}>
        {label || children}
      </div>
    )
  }

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const content = label || children

  // For SSR, check if it's external based on the href pattern
  const isExternalSSR = href.startsWith('http://') || href.startsWith('https://')

  // Handle external links
  if (isExternalSSR || isExternal) {
    if (appearance === 'inline') {
      return (
        <a
          href={href}
          className={cn(className)}
          data-external
          onClick={onClick}
          {...newTabProps}
          {...restProps}
        >
          {content}
        </a>
      )
    }

    return (
      <Button asChild className={className} size={size} variant={appearance}>
        <a
          href={href}
          data-external
          onClick={onClick}
          {...newTabProps}
          {...restProps}
        >
          {content}
        </a>
      </Button>
    )
  }

  // Internal links
  if (appearance === 'inline') {
    return (
      <NextLink
        href={href}
        prefetch={shouldPrefetch}
        scroll={scroll}
        className={cn(className)}
        data-active={isActive || undefined}
        onClick={onClick}
        {...newTabProps}
        {...restProps}
      >
        {content}
      </NextLink>
    )
  }

  // Button-style links
  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <NextLink
        href={href}
        prefetch={shouldPrefetch}
        scroll={scroll}
        data-active={isActive || undefined}
        onClick={onClick}
        {...newTabProps}
        {...restProps}
      >
        {content}
      </NextLink>
    </Button>
  )
}

// Export the CMS-specific version for backward compatibility
export const CMSLink = Link