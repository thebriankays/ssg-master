import React from 'react'
import { Whatamesh } from '@/components/whatamesh'
import type { WhatameshBlock as WhatameshBlockType } from '@/payload-types'

export const WhatameshBlock: React.FC<WhatameshBlockType> = ({ 
  type,
  colors,
  settings,
  height
}) => {
  const isGlobal = type === 'global'
  
  return (
    <div 
      className={`whatamesh-block ${isGlobal ? 'whatamesh-block--global' : 'whatamesh-block--section'}`}
      style={!isGlobal ? { height: height || '100vh' } : undefined}
    >
      <Whatamesh
        colors={{
          color1: colors?.color1 || '#c3e4ff',
          color2: colors?.color2 || '#6ec3f4',
          color3: colors?.color3 || '#eae2ff',
          color4: colors?.color4 || '#b9beff',
        }}
        darkenTop={settings?.darkenTop || false}
        speed={settings?.speed || 1}
        scale={settings?.scale || 1}
        isGlobal={isGlobal}
      />
      
      {!isGlobal && (
        <div className="whatamesh-block__content">
          {/* Content can be overlaid on section backgrounds */}
        </div>
      )}
    </div>
  )
}
