'use client'

import { useRect } from 'hamo'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { WebGLTunnel } from '@/webgl/components/tunnel'

const WebGLBox = dynamic(() => import('./webgl').then(({ WebGLBox }) => WebGLBox), {
  ssr: false,
})

export function AnimatedBox({ className }: { className?: string }) {
  const [setRectRef, rect] = useRect()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <WebGLTunnel>
        <WebGLBox rect={rect} isHovered={isHovered} />
      </WebGLTunnel>
      <div
        ref={setRectRef}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
        }}
      />
    </>
  )
}