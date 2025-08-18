import { useRef, useMemo } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import * as THREE from 'three'
import { useLenis } from '@/providers/lenis-provider'

// Extend Three.js with post-processing components
extend({ EffectComposer, RenderPass, ShaderPass })

// Post-processing shaders
const postProcessingVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const postProcessingFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float uVelocity;
  uniform float uTime;
  
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate wave distortion based on velocity
    float waveAmplitude = uVelocity * 0.0009;
    float waveFrequency = 4.0 + uVelocity * 0.01;
    
    // Apply wave distortion to the UV coordinates
    vec2 waveUv = uv;
    waveUv.x += sin(uv.y * waveFrequency + uTime) * waveAmplitude;
    waveUv.y += sin(uv.x * waveFrequency * 5.0 + uTime * 0.8) * waveAmplitude;
    
    // Apply RGB shift to the wave-distorted coordinates
    float r = texture2D(tDiffuse, vec2(waveUv.x, waveUv.y + uVelocity * 0.0005)).r;
    vec2 gb = texture2D(tDiffuse, waveUv).gb;
    
    gl_FragColor = vec4(r, gb, 1.0);
  }
`

interface WebGLTextPostProcessingProps {
  enabled?: boolean
}

export function WebGLTextPostProcessing({ enabled = true }: WebGLTextPostProcessingProps) {
  const { gl, scene, camera, size } = useThree()
  const lenis = useLenis()
  
  const lerpedVelocity = useRef(0)
  const lerpFactor = 0.05
  
  // Create effect composer and passes
  const [composer, shaderPass] = useMemo(() => {
    const comp = new EffectComposer(gl)
    comp.setSize(size.width, size.height)
    comp.setPixelRatio(gl.getPixelRatio())
    
    // Render pass
    const renderPass = new RenderPass(scene, camera)
    comp.addPass(renderPass)
    
    // Custom shader pass
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uVelocity: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: postProcessingVertexShader,
      fragmentShader: postProcessingFragmentShader,
    })
    
    const pass = new ShaderPass(shaderMaterial)
    comp.addPass(pass)
    
    return [comp, pass]
  }, [gl, scene, camera, size.width, size.height])
  
  // Update on resize
  useFrame(() => {
    if (!enabled) return
    
    // Update lerped velocity for smoother effect
    const targetVelocity = lenis?.velocity || 0
    lerpedVelocity.current += (targetVelocity - lerpedVelocity.current) * lerpFactor
    
    // Update uniforms
    if (shaderPass.material) {
      shaderPass.material.uniforms.uVelocity.value = lerpedVelocity.current
      shaderPass.material.uniforms.uTime.value += 0.016
    }
    
    // Render with post-processing
    composer.render()
  }, 1) // Priority 1 to render after scene updates
  
  return null
}