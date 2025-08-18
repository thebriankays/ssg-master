'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import type { WebGLEffects } from './index'

// Custom shader material for image effects
const ImageEffectMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uParallax: 0.1,
    uBlur: 0,
    uGrayscale: 0,
    uBrightness: 1,
    uContrast: 1,
    uTint: new THREE.Color(1, 1, 1),
    uHover: 0,
    uHoverScale: 1.05,
    uHoverBlur: 0,
    uHoverGrayscale: 0,
  },
  // Vertex shader
  /*glsl*/ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uParallax;
    uniform float uHover;
    uniform float uHoverScale;
    
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      
      // Parallax effect
      vec2 parallax = (uMouse - 0.5) * uParallax;
      pos.x += parallax.x;
      pos.y += parallax.y;
      
      // Hover scale
      float scale = mix(1.0, uHoverScale, uHover);
      pos *= scale;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  /*glsl*/ `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uBlur;
    uniform float uGrayscale;
    uniform float uBrightness;
    uniform float uContrast;
    uniform vec3 uTint;
    uniform float uHover;
    uniform float uHoverBlur;
    uniform float uHoverGrayscale;
    
    varying vec2 vUv;
    
    vec4 blur(sampler2D image, vec2 uv, float amount) {
      vec4 color = vec4(0.0);
      float total = 0.0;
      
      for (float x = -4.0; x <= 4.0; x += 1.0) {
        for (float y = -4.0; y <= 4.0; y += 1.0) {
          vec2 offset = vec2(x, y) * amount * 0.001;
          float weight = 1.0 - length(offset) * 0.2;
          color += texture2D(image, uv + offset) * weight;
          total += weight;
        }
      }
      
      return color / total;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Apply blur
      float totalBlur = mix(uBlur, uHoverBlur, uHover);
      vec4 color = totalBlur > 0.0 ? blur(uTexture, uv, totalBlur) : texture2D(uTexture, uv);
      
      // Apply grayscale
      float totalGrayscale = mix(uGrayscale, uHoverGrayscale, uHover);
      if (totalGrayscale > 0.0) {
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color.rgb = mix(color.rgb, vec3(gray), totalGrayscale);
      }
      
      // Apply brightness and contrast
      color.rgb = (color.rgb - 0.5) * uContrast + 0.5;
      color.rgb *= uBrightness;
      
      // Apply tint
      color.rgb *= uTint;
      
      gl_FragColor = color;
    }
  `
)

extend({ ImageEffectMaterial })

// Add TypeScript declarations for the custom material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      imageEffectMaterial: any
    }
  }
}

interface WebGLImageSceneProps {
  src: string
  effects: WebGLEffects
  width?: number
  height?: number
}

export function WebGLImageScene({ src, effects, width = 1, height = 1 }: WebGLImageSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  const textureRef = useRef<THREE.Texture | null>(null)
  const { gl, size } = useThree()
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const targetHover = useRef(0)
  
  // Load texture
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(src, (texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.format = THREE.RGBAFormat
      textureRef.current = texture
      
      if (materialRef.current) {
        materialRef.current.uTexture = texture
        materialRef.current.needsUpdate = true
      }
    })
    
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [src])
  
  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX / size.width
      mouse.current.y = 1 - event.clientY / size.height
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [size])
  
  // Handle hover
  useEffect(() => {
    if (!meshRef.current) return
    
    const mesh = meshRef.current
    
    const handlePointerOver = () => {
      targetHover.current = 1
    }
    
    const handlePointerOut = () => {
      targetHover.current = 0
    }
    
    mesh.addEventListener('pointerover' as any, handlePointerOver)
    mesh.addEventListener('pointerout' as any, handlePointerOut)
    
    return () => {
      mesh.removeEventListener('pointerover' as any, handlePointerOver)
      mesh.removeEventListener('pointerout' as any, handlePointerOut)
    }
  }, [])
  
  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return
    
    // Update time
    materialRef.current.uTime = state.clock.elapsedTime
    
    // Smooth mouse movement
    materialRef.current.uMouse.x += (mouse.current.x - materialRef.current.uMouse.x) * 0.1
    materialRef.current.uMouse.y += (mouse.current.y - materialRef.current.uMouse.y) * 0.1
    
    // Smooth hover transition
    materialRef.current.uHover += (targetHover.current - materialRef.current.uHover) * 0.1
  })
  
  // Calculate aspect ratio
  const aspect = width / height
  
  return (
    <mesh ref={meshRef} scale={[aspect, 1, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <imageEffectMaterial
        ref={materialRef}
        uParallax={effects.parallax ?? 0.1}
        uBlur={effects.blur ?? 0}
        uGrayscale={effects.grayscale ?? 0}
        uBrightness={effects.brightness ?? 1}
        uContrast={effects.contrast ?? 1}
        uTint={effects.tint ? new THREE.Color(effects.tint) : new THREE.Color(1, 1, 1)}
        uHoverScale={effects.hover?.scale ?? 1.05}
        uHoverBlur={effects.hover?.blur ?? 0}
        uHoverGrayscale={effects.hover?.grayscale ?? 0}
      />
    </mesh>
  )
}