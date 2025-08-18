'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@/hooks/use-texture'
import * as THREE from 'three'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from 'gsap'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uProgress;
  uniform vec2 uZoomScale;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float angle = uProgress * 3.14159265 / 2.;
    float wave = cos(angle);
    float c = sin(length(uv - .5) * 15. + uProgress * 12.) * .5 + .5;
    pos.x *= mix(1., uZoomScale.x + wave * c, uProgress);
    pos.y *= mix(1., uZoomScale.y + wave * c, uProgress);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uZoomScale;
  uniform vec2 uImageRes;

  /*------------------------------
  Background Cover UV
  --------------------------------
  u = basic UV
  s = screensize
  i = image size
  ------------------------------*/
  vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
    float rs = s.x / s.y; // Aspect screen size
    float ri = i.x / i.y; // Aspect image size
    vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
    vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
    return u * s / st + o;
  }

  varying vec2 vUv;
  
  void main() {
    vec2 uv = CoverUV(vUv, uRes, uImageRes);
    vec3 tex = texture2D(uTex, uv).rgb;
    gl_FragColor = vec4( tex, 1.0 );
  }
`

interface PlaneProps {
  texture: string
  width: number
  height: number
  active: boolean
  onLoaded?: () => void
}

export function Plane({ texture, width, height, active, onLoaded }: PlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  const tex = useTexture(texture, (loadedTexture) => {
    if (onLoaded) onLoaded()
  }) as THREE.Texture | undefined

  const uniforms = useMemo(() => {
    if (!tex) {
      return {
        uProgress: { value: 0 },
        uZoomScale: { value: new THREE.Vector2(1, 1) },
        uTex: { value: null },
        uRes: { value: new THREE.Vector2(width, height) },
        uImageRes: { value: new THREE.Vector2(1, 1) }
      }
    }
    
    return {
      uProgress: { value: 0 },
      uZoomScale: { value: new THREE.Vector2(1, 1) },
      uTex: { value: tex },
      uRes: { value: new THREE.Vector2(width, height) },
      uImageRes: { 
        value: new THREE.Vector2(
          tex.image?.width || 1, 
          tex.image?.height || 1
        ) 
      }
    }
  }, [tex, width, height])

  useEffect(() => {
    if (!meshRef.current || !meshRef.current.material) return
    
    const material = meshRef.current.material as THREE.ShaderMaterial
    
    // Update zoom scale
    material.uniforms.uZoomScale.value.x = viewport.width / width
    material.uniforms.uZoomScale.value.y = viewport.height / height
  }, [viewport, width, height])

  // Animate on active change
  useGSAP(() => {
    if (!meshRef.current || !meshRef.current.material) return
    
    const material = meshRef.current.material as THREE.ShaderMaterial

    // Animate progress
    gsap.to(material.uniforms.uProgress, {
      value: active ? 1 : 0,
      duration: 2.5,
      ease: 'power3.out'
    })

    // Animate resolution
    gsap.to(material.uniforms.uRes.value, {
      x: active ? viewport.width : width,
      y: active ? viewport.height : height,
      duration: 2.5,
      ease: 'power3.out'
    })
  }, [active, viewport.width, viewport.height, width, height])

  // Don't render until texture is loaded
  if (!tex) {
    return null
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}