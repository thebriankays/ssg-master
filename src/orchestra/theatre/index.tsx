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
    const proj = getProject(projectId)
    setProject(proj)
  }, [projectId])

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
  const { project } = useContext(TheatreContext)
  const [sheet, setSheet] = useState<ISheet | null>(null)

  useEffect(() => {
    if (!project) return
    const newSheet = project.sheet(id, instance)
    setSheet(newSheet)
  }, [project, id, instance])

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