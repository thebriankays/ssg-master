import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useViewport } from '@/hooks/use-viewport'
import { useLenis } from '@/providers/lenis-provider'

// Import shader files
import maskRevealVertexShader from './shaders/mask-reveal.vert'
import maskRevealFragmentShader from './shaders/mask-reveal.frag'
import distortVertexShader from './shaders/distort.vert'
import distortFragmentShader from './shaders/distort.frag'
import gradientVertexShader from './shaders/gradient.vert'
import gradientFragmentShader from './shaders/gradient.frag'

interface WebGLTextMeshProps {
  text: string
  htmlElement: HTMLElement | null
  visible: boolean
  progress: number
  shader: 'default' | 'distort' | 'gradient' | 'mask-reveal'
  color: string
  gradientColors: [string, string]
  distortionAmount: number
  distortionSpeed: number
  fontWeight: number
}

// Font weight to font file mapping
const FONT_MAP: Record<number, string> = {
  100: '/fonts/circular-std-font-family/CircularStd-Book.ttf',
  200: '/fonts/circular-std-font-family/CircularStd-Book.ttf',
  300: '/fonts/circular-std-font-family/CircularStd-Book.ttf',
  400: '/fonts/circular-std-font-family/CircularStd-Book.ttf',
  500: '/fonts/circular-std-font-family/CircularStd-Medium.ttf',
  600: '/fonts/circular-std-font-family/CircularStd-Medium.ttf',
  700: '/fonts/circular-std-font-family/CircularStd-Bold.ttf',
  800: '/fonts/circular-std-font-family/CircularStd-Bold.ttf',
  900: '/fonts/circular-std-font-family/CircularStd-Black.ttf',
}

export function WebGLTextMesh({
  text,
  htmlElement,
  visible,
  progress,
  shader,
  color,
  gradientColors,
  distortionAmount,
  distortionSpeed,
  fontWeight,
}: WebGLTextMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const { camera, size } = useThree()
  const viewport = useViewport()
  const lenis = useLenis()
  
  const [computedStyles, setComputedStyles] = useState({
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 1.2,
    textAlign: 'left' as CanvasTextAlign,
    maxWidth: 0,
    bounds: null as DOMRect | null,
  })

  // Update computed styles from HTML element
  useEffect(() => {
    if (!htmlElement) return

    const updateStyles = () => {
      const styles = window.getComputedStyle(htmlElement)
      const bounds = htmlElement.getBoundingClientRect()
      const fontSize = parseFloat(styles.fontSize)
      
      setComputedStyles({
        fontSize,
        letterSpacing: parseFloat(styles.letterSpacing) / fontSize, // Convert to em
        lineHeight: parseFloat(styles.lineHeight) / fontSize, // Convert to em
        textAlign: styles.textAlign as CanvasTextAlign,
        maxWidth: bounds.width,
        bounds,
      })
    }

    updateStyles()
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updateStyles)
    resizeObserver.observe(htmlElement)
    
    return () => resizeObserver.disconnect()
  }, [htmlElement])

  // Create custom shader material
  const material = useMemo(() => {
    let vertexShader = ''
    let fragmentShader = ''
    
    switch (shader) {
      case 'mask-reveal':
        vertexShader = maskRevealVertexShader
        fragmentShader = maskRevealFragmentShader
        break
      case 'distort':
        vertexShader = distortVertexShader
        fragmentShader = distortFragmentShader
        break
      case 'gradient':
        vertexShader = gradientVertexShader
        fragmentShader = gradientFragmentShader
        break
      default:
        // Default shader
        vertexShader = `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `
        fragmentShader = `
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            gl_FragColor = vec4(uColor, 1.0);
          }
        `
    }

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uHeight: { value: 0 },
        uVelocity: { value: 0 },
        uDistortionAmount: { value: distortionAmount },
        uDistortionSpeed: { value: distortionSpeed },
        uGradientColor1: { value: new THREE.Color(gradientColors[0]) },
        uGradientColor2: { value: new THREE.Color(gradientColors[1]) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    })

    materialRef.current = mat
    return mat
  }, [shader, color, gradientColors, distortionAmount, distortionSpeed])

  // Update material uniforms
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progress
      materialRef.current.uniforms.uHeight.value = computedStyles.bounds?.height || 0
    }
  }, [progress, computedStyles.bounds])

  // Convert pixel values to Three.js units
  const scaleFactor = 1 // Adjust this if needed to match your scene scale

  // Position syncing with HTML element
  useFrame(() => {
    if (!meshRef.current || !computedStyles.bounds || !visible) return

    const { bounds } = computedStyles
    
    // Get current scroll position
    const scrollY = lenis?.animatedScroll || 0
    
    // Calculate position to match HTML element
    // Account for viewport transformation
    const x = bounds.left - size.width / 2
    const y = -(bounds.top + scrollY) + size.height / 2 - bounds.height / 2
    
    meshRef.current.position.x = x
    meshRef.current.position.y = y
    meshRef.current.position.z = 0

    // Update time uniform for animations
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += 0.016
      materialRef.current.uniforms.uVelocity.value = lenis?.velocity || 0
    }
  })

  return (
    <Text
      ref={meshRef}
      text={text}
      font={FONT_MAP[fontWeight] || FONT_MAP[400]}
      fontSize={computedStyles.fontSize * scaleFactor}
      letterSpacing={computedStyles.letterSpacing}
      lineHeight={computedStyles.lineHeight}
      textAlign={computedStyles.textAlign}
      maxWidth={computedStyles.maxWidth * scaleFactor}
      anchorX="left"
      anchorY="middle"
      material={material}
      visible={visible}
    />
  )
}