'use client'

import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from 'react'
import { getProject, type IProject } from '@theatre/core'
import type { ISheet } from '@theatre/core'

// Theatre Context Types
interface TheatreContextType {
  project: IProject | null
  studio: any | null
}

interface SheetContextType {
  sheet: ISheet | null
}

// Theatre Context
const TheatreContext = createContext<TheatreContextType>({
  project: null,
  studio: null,
})

// Sheet Context
const SheetContext = createContext<SheetContextType>({
  sheet: null,
})

// Theatre Project Provider
export function TheatreProjectProvider({
  children,
  projectId = 'default',
  studio,
}: {
  children: ReactNode
  projectId?: string
  studio?: any
}) {
  const [project, setProject] = useState<IProject | null>(null)

  useEffect(() => {
    try {
      // Only create project if studio is available or if we have state
      if (studio || process.env.NODE_ENV === 'production') {
        const proj = getProject(projectId, {
          // Provide empty state to avoid the error
          state: {}
        })
        setProject(proj)
      }
    } catch (error) {
      console.debug('Theatre project creation skipped:', error)
      setProject(null)
    }
  }, [projectId, studio])

  return (
    <TheatreContext.Provider value={{ project, studio }}>
      {children}
    </TheatreContext.Provider>
  )
}

// Sheet Provider
export function SheetProvider({
  children,
  id,
  instance,
}: {
  children: ReactNode
  id: string
  instance?: string
}) {
  const context = useContext(TheatreContext)
  const [sheet, setSheet] = useState<ISheet | null>(null)

  useEffect(() => {
    // Only create sheet if we have a valid Theatre context with a project
    if (!context || !context.project) return
    
    try {
      const newSheet = context.project.sheet(id, instance)
      setSheet(newSheet)
    } catch (error) {
      // Silently handle Theatre errors when studio is not loaded
      console.debug('Theatre sheet creation skipped:', error)
    }
  }, [context, id, instance])

  return (
    <SheetContext.Provider value={{ sheet }}>
      {children}
    </SheetContext.Provider>
  )
}

// Hooks
export function useTheatreContext() {
  return useContext(TheatreContext)
}

export function useSheetContext() {
  return useContext(SheetContext)
}

export function useCurrentSheet() {
  const { sheet } = useSheetContext()
  return sheet
}