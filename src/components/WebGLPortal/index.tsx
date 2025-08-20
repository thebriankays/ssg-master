'use client'

import { PropsWithChildren } from 'react'
import { WebGLTunnel } from '@/webgl/components/tunnel'

/**
 * WebGLPortal Component
 * Wrapper for tunnel-rat to inject global effects into the shared canvas
 * Use this for backgrounds, gradients, fluid effects, and other global layers
 */
export function WebGLPortal({ children }: PropsWithChildren) {
  return <WebGLTunnel>{children}</WebGLTunnel>
}
