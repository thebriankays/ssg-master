'use client'

import { forwardRef } from 'react'
import { e } from '@theatre/r3f'
import { useTheatre } from './hooks/use-theatre'

// Extend the editable components from @theatre/r3f
export const editable = e

// Theatre Group component for 3D transformations
export const Group = forwardRef<any, any>(
  ({ theatreKey, children, ...props }, ref) => {
    const { values } = useTheatre(theatreKey, {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      ...props,
    })

    return (
      <group
        ref={ref}
        position={[values.position.x, values.position.y, values.position.z]}
        rotation={[values.rotation.x, values.rotation.y, values.rotation.z]}
        scale={[values.scale.x, values.scale.y, values.scale.z]}
      >
        {children}
      </group>
    )
  }
)

Group.displayName = 'TheatreGroup'