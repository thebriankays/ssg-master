import { useFrame, useThree } from '@react-three/fiber'
import { types } from '@theatre/core'
import { createContext, useContext, useMemo } from 'react'
import { useCurrentSheet } from '@/orchestra/theatre'
import { useTheatre } from '@/orchestra/theatre/hooks/use-theatre'
import { Flowmap } from '@/webgl/utils/flowmap'
import { Fluid } from '@/webgl/utils/fluid'

type FlowmapContextType = {
  fluid: Fluid
  flowmap: Flowmap
}

export const FlowmapContext = createContext<FlowmapContextType>({} as FlowmapContextType)

export function useFlowmap(type: 'fluid' | 'flowmap' = 'flowmap') {
  const { fluid, flowmap } = useContext(FlowmapContext)
  if (type === 'fluid') return fluid
  return flowmap
}

export function FlowmapProvider({ children }: { children: React.ReactNode }) {
  const gl = useThree((state) => state.gl)
  const fluid = useMemo(() => {
    const fluidInstance = new Fluid(gl, { size: 128 })
    // Much more subtle and faster dissipation
    fluidInstance.radius = 0.01 // Very small effect radius
    fluidInstance.curlStrength = 5 // Less swirl
    fluidInstance.densityDissipation = 0.92 // Faster fade
    fluidInstance.velocityDissipation = 0.95 // Much faster velocity fade
    fluidInstance.pressureDissipation = 0.8 // Faster pressure dissipation
    return fluidInstance
  }, [gl])
  const flowmap = useMemo(() => new Flowmap(gl, { size: 128 }), [gl])
  const sheet = useCurrentSheet()

  useTheatre(
    sheet!,
    'fluid simulation',
    {
      density: types.number(0.98, { range: [0, 1], nudgeMultiplier: 0.01 }),
      velocity: types.number(0.99, { range: [0, 1], nudgeMultiplier: 0.01 }),
      pressure: types.number(0.94, { range: [0, 1], nudgeMultiplier: 0.01 }),
      curl: types.number(10, { range: [0, 100], nudgeMultiplier: 1 }),
      radius: types.number(0.03, { range: [0, 1], nudgeMultiplier: 0.01 }),
    },
    {
      onValuesChange: ({
        density,
        velocity,
        pressure,
        curl,
        radius,
      }: {
        density: number
        velocity: number
        pressure: number
        curl: number
        radius: number
      }) => {
        fluid.curlStrength = curl
        fluid.densityDissipation = density
        fluid.velocityDissipation = velocity
        fluid.pressureDissipation = pressure
        fluid.radius = radius
      },
      deps: [fluid],
    },
  )

  useTheatre(
    sheet!,
    'flowmap',
    {
      falloff: types.number(0.2, { range: [0, 1], nudgeMultiplier: 0.01 }),
      dissipation: types.number(0.98, { range: [0, 1], nudgeMultiplier: 0.01 }),
    },
    {
      onValuesChange: ({ falloff, dissipation }: { falloff: number; dissipation: number }) => {
        flowmap.falloff = falloff
        flowmap.dissipation = dissipation
      },
      deps: [flowmap],
    },
  )

  useFrame(() => {
    fluid.update()
    flowmap.update()
  }, -10)

  return <FlowmapContext.Provider value={{ fluid, flowmap }}>{children}</FlowmapContext.Provider>
}
