'use client'

import { useEffect, useRef, useState } from 'react'
import { useSheetContext } from '../index'
import type { ISheet, ISheetObject } from '@theatre/core'

// Support multiple function signatures
export function useTheatre(
  sheetOrKey: ISheet | string,
  objectKeyOrProps?: string | Record<string, any>,
  propsOrOptions?: Record<string, any> | {
    deps?: any[]
    reconfigure?: boolean
    onValuesChange?: (values: any) => void
  },
  maybeOptions?: {
    deps?: any[]
    reconfigure?: boolean
    onValuesChange?: (values: any) => void
  }
) {
  const { sheet: contextSheet } = useSheetContext()
  
  // Parse arguments based on overload
  let sheet: ISheet | null
  let objectKey: string
  let props: Record<string, any>
  let options: any
  
  if (typeof sheetOrKey === 'string') {
    // useTheatre(objectKey, props, options?)
    sheet = contextSheet
    objectKey = sheetOrKey
    props = objectKeyOrProps as Record<string, any>
    options = propsOrOptions || {}
  } else {
    // useTheatre(sheet, objectKey, props, options?)
    sheet = sheetOrKey
    objectKey = objectKeyOrProps as string
    props = propsOrOptions as Record<string, any>
    options = maybeOptions || {}
  }
  
  const [theatreObject, setTheatreObject] = useState<ISheetObject | null>(null)
  const [values, setValues] = useState(props)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!sheet) return

    // Create theatre object
    const obj = sheet.object(objectKey, props, {
      reconfigure: options?.reconfigure ?? true,
    })
    setTheatreObject(obj)

    // Subscribe to value changes
    unsubscribeRef.current = obj.onValuesChange((newValues) => {
      setValues(newValues)
      options?.onValuesChange?.(newValues)
    })

    return () => {
      unsubscribeRef.current?.()
    }
  }, [sheet, objectKey, ...(options?.deps || [])])

  return { theatreObject, values }
}