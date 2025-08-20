'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { gsap } from 'gsap'
import * as THREE from 'three'

interface PlaneProps {
  texture: string
  width: number
  height: number
  active: boolean
}

export function Plane({ texture, width, height, active, ...props }: PlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  const tex = useTexture(texture)

  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      
      // When using shared canvas with 0.15 scale, we need to compensate
      // The carousel group is scaled to 0.15, so to fill the viewport:
      // We need to scale up by 1/0.15 = 6.67
      const scaleCompensation = 6.67
      
      material.uniforms.uZoomScale.value.x = viewport.width / width * scaleCompensation
      material.uniforms.uZoomScale.value.y = viewport.height / height * scaleCompensation

      gsap.to(material.uniforms.uProgress, {
        value: active ? 1 : 0,
        duration: 2.5,
        ease: 'power3.out'
      })

      gsap.to(material.uniforms.uRes.value, {
        x: active ? viewport.width : width,
        y: active ? viewport.height : height,
        duration: 2.5,
        ease: 'power3.out'
      })
    }
  }, [viewport, active, width, height])

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uProgress: { value: 0 },
        uZoomScale: { value: { x: 1, y: 1 } },
        uTex: { value: tex },
        uRes: { value: { x: width, y: height } },
        uImageRes: {
          value: { x: tex.source.data.width, y: tex.source.data.height }
        }
      },
      vertexShader: /* glsl */ `
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
      `,
      fragmentShader: /* glsl */ `
      uniform sampler2D uTex;
      uniform vec2 uRes;
      uniform vec2 uImageRes;

      vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
        float rs = s.x / s.y;
        float ri = i.x / i.y;
        vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
        vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st;
        return u * s / st + o;
      }

      varying vec2 vUv;
        void main() {
          vec2 uv = CoverUV(vUv, uRes, uImageRes);
          vec3 tex = texture2D(uTex, uv).rgb;
          gl_FragColor = vec4( tex, 1.0 );
        }
      `
    }),
    [tex, width, height]
  )

  return (
    <mesh ref={meshRef} {...props}>
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  )
}
