'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useWebGLRect } from '@/hooks/use-webgl-rect'
import { useFlowmap } from '@/webgl/components/flowmap'

interface WhatameshWebGLProps {
  rect: DOMRect
  colors?: {
    color1?: string
    color2?: string
    color3?: string
    color4?: string
  }
  darkenTop?: boolean
  speed?: number
  scale?: number
  amplitude?: number
  rotation?: number
  isGlobal?: boolean
  flowmap?: boolean
}

export function WhatameshWebGL({
  rect,
  colors = {
    color1: '#ff0080',
    color2: '#7928ca',
    color3: '#ff4e00',
    color4: '#ff0080',
  },
  darkenTop = false,
  speed = 1,
  scale = 1,
  amplitude = 320,
  rotation = 0,
  isGlobal = true,
  flowmap: hasFlowmap = false, // Disabled for now
}: WhatameshWebGLProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, size, camera } = useThree()
  const flowmap = useFlowmap('fluid')

  // Use WebGL rect for positioning if not global
  useWebGLRect(rect, ({ scale, position, isVisible }) => {
    if (!isGlobal && meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z)
      meshRef.current.scale.set(scale.x, scale.y, scale.z)
      meshRef.current.visible = isVisible
      meshRef.current.updateMatrix()
    }
  })

  // Convert hex colors to normalized RGB - matching original Whatamesh/Stripe implementation
  const normalizeColor = (hex: string) => {
    // Remove # if present and convert to integer
    const hexCode = parseInt(hex.replace('#', ''), 16)
    return [
      ((hexCode >> 16) & 255) / 255,
      ((hexCode >> 8) & 255) / 255,
      (255 & hexCode) / 255,
    ]
  }

  // Create shader material
  const material = useMemo(() => {
    const c1 = normalizeColor(colors.color1 || '#ff0080')
    const c2 = normalizeColor(colors.color2 || '#7928ca')
    const c3 = normalizeColor(colors.color3 || '#ff4e00')
    const c4 = normalizeColor(colors.color4 || '#ff0080')

    return new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_shadow_power: { value: viewport.width < 600 ? 5 : 6 },
        u_darkenTop: { value: darkenTop ? 1.0 : 0.0 },
        u_active_colors: { value: [1, 1, 1, 1] },
        u_resolution: {
          value: new THREE.Vector2(size.width || window.innerWidth || 1920, size.height || window.innerHeight || 1080),
        },
        u_flowmap: { value: hasFlowmap ? flowmap.uniform.value : null },
        u_hasFlowmap: { value: hasFlowmap ? 1.0 : 0.0 },
        u_global: {
          value: {
            noiseFreq: [0.00014 * scale, 0.00029 * scale],
            noiseSpeed: 0.000005 * speed,
          },
        },
        u_vertDeform: {
          value: {
            incline: Math.sin(0) / Math.cos(0),
            offsetTop: -0.5,
            offsetBottom: -0.5,
            noiseFreq: [3, 4],
            noiseAmp: amplitude,
            noiseSpeed: 10,
            noiseFlow: 3,
            noiseSeed: 5,
          },
        },
        u_baseColor: { value: c1 },
        u_waveLayers: {
          value: [
            {
              color: c2,
              noiseFreq: [2.333, 3.333],
              noiseSpeed: 11.3,
              noiseFlow: 6.8,
              noiseSeed: 15,
              noiseFloor: 0.1,
              noiseCeil: 0.7,
            },
            {
              color: c3,
              noiseFreq: [2.666, 3.666],
              noiseSpeed: 11.6,
              noiseFlow: 7.1,
              noiseSeed: 25,
              noiseFloor: 0.1,
              noiseCeil: 0.77,
            },
            {
              color: c4,
              noiseFreq: [3, 4],
              noiseSpeed: 11.9,
              noiseFlow: 7.4,
              noiseSeed: 35,
              noiseFloor: 0.1,
              noiseCeil: 0.84,
            },
          ],
        },
      },
      vertexShader: /* glsl */ `
        varying vec3 v_color;
        varying vec2 vUv;
        
        uniform float u_time;
        uniform vec4 u_active_colors;
        uniform vec3 u_baseColor;
        uniform vec2 u_resolution;
        
        struct Global {
          vec2 noiseFreq;
          float noiseSpeed;
        };
        
        struct VertDeform {
          float incline;
          float offsetTop;
          float offsetBottom;
          vec2 noiseFreq;
          float noiseAmp;
          float noiseSpeed;
          float noiseFlow;
          float noiseSeed;
        };
        
        struct WaveLayer {
          vec3 color;
          vec2 noiseFreq;
          float noiseSpeed;
          float noiseFlow;
          float noiseSeed;
          float noiseFloor;
          float noiseCeil;
        };
        
        uniform Global u_global;
        uniform VertDeform u_vertDeform;
        uniform WaveLayer u_waveLayers[3];
        
        // Simplex 3D Noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 0.142857142857;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }
        
        vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
          return (blend * opacity + base * (1.0 - opacity));
        }
        
        void main() {
          vUv = uv;
          float time = u_time * u_global.noiseSpeed;
          
          vec2 noiseCoord = u_resolution * uv * u_global.noiseFreq;
          vec2 st = 1. - uv.xy;
          
          // Tilting the plane
          float tilt = u_resolution.y / 2.0 * uv.y;
          float incline = u_resolution.x * uv.x / 2.0 * u_vertDeform.incline;
          float offset = u_resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);
          
          // Vertex noise
          float noise = snoise(vec3(
            noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
            noiseCoord.y * u_vertDeform.noiseFreq.y,
            time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
          )) * u_vertDeform.noiseAmp;
          
          // Fade noise to zero at edges
          noise *= 1.0 - pow(abs(uv.y - 0.5) * 2.0, 2.0);
          noise = max(0.0, noise);
          
          vec3 pos = vec3(
            position.x,
            position.y + tilt + incline + noise - offset,
            position.z
          );
          
          // Vertex color
          if (u_active_colors[0] == 1.) {
            v_color = u_baseColor;
          }
          
          for (int i = 0; i < 3; i++) {
            if (u_active_colors[i + 1] == 1.) {
              WaveLayer layer = u_waveLayers[i];
              
              float layerNoise = smoothstep(
                layer.noiseFloor,
                layer.noiseCeil,
                snoise(vec3(
                  noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
                  noiseCoord.y * layer.noiseFreq.y,
                  time * layer.noiseSpeed + layer.noiseSeed
                )) / 2.0 + 0.5
              );
              
              v_color = blendNormal(v_color, layer.color, pow(layerNoise, 2.));
            }
          }
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 v_color;
        uniform float u_darkenTop;
        uniform vec2 u_resolution;
        uniform float u_shadow_power;
        uniform sampler2D u_flowmap;
        uniform float u_hasFlowmap;
        
        void main() {
          vec3 color = v_color;
          
          // Apply flowmap distortion if enabled
          if (u_hasFlowmap > 0.5) {
            vec2 screenUV = gl_FragCoord.xy / u_resolution.xy;
            vec4 flow = texture2D(u_flowmap, screenUV);
            // Subtle color modulation based on flowmap
            color = mix(color, color * flow.rgb, 0.1);
          }
          
          if (u_darkenTop > 0.5) {
            vec2 st = gl_FragCoord.xy / u_resolution;
            color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
          }
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      transparent: false,
      depthWrite: false,
      depthTest: false,
      toneMapped: false, // Disable tone mapping to prevent color changes
    })
  }, [colors, darkenTop, speed, scale, viewport, flowmap, hasFlowmap])

  // Update uniforms on each frame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.u_time.value = clock.elapsedTime * 1253.106 // Match the original t value from Gradient.js
      
      // Update resolution to match actual viewport
      if (isGlobal) {
        material.uniforms.u_resolution.value.set(
          size.width,
          size.height
        )
      } else {
        material.uniforms.u_resolution.value.set(
          rect?.width || size.width,
          rect?.height || size.height
        )
      }
      
      material.uniforms.u_shadow_power.value = size.width < 600 ? 5 : 6
    }
  })

  // If global, render full viewport size at fixed position
  if (isGlobal) {
    // For global background, create a mesh that covers the entire viewport
    // Since we're using an orthographic camera, we need to match its view bounds
    const aspect = viewport.width / viewport.height
    
    return (
      <mesh
        ref={meshRef}
        rotation-z={rotation}
        position={[0, 0, -100]} // Behind other content
        renderOrder={-1000} // Render first
        frustumCulled={false} // Never cull
      >
        {/* Create a plane that matches the orthographic camera's view */}
        <planeGeometry args={[viewport.width * 1.1, viewport.height * 1.1, 32, 64]} />
        <primitive object={material} attach="material" />
      </mesh>
    )
  }

  // Otherwise render as a plane that will be positioned by useWebGLRect
  return (
    <mesh ref={meshRef} matrixAutoUpdate={false} rotation-z={rotation}>
      <planeGeometry args={[1, 1, Math.ceil(size.width * 0.06), Math.ceil(size.height * 0.16)]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
