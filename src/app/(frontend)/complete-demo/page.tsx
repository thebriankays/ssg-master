'use client'

import { useRef } from 'react'
import { View } from '@/providers/shared-canvas-provider'
import { Marquee } from '@/components/marquee'
import { ProgressText } from '@/components/ProgressText'
import SplitText from '@/components/SplitText'
import { AnimatedGradient } from '@/components/animated-gradient'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Torus } from '@react-three/drei'

// WebGL component that rotates
function RotatingMesh({ children }: { children: React.ReactNode }) {
  const ref = useRef<any>(null)
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.5
      ref.current.rotation.y += delta * 0.5
    }
  })
  
  return <group ref={ref}>{children}</group>
}

export default function CompleteDemoPage() {
  const viewRef1 = useRef<HTMLDivElement>(null)
  const viewRef2 = useRef<HTMLDivElement>(null)
  const viewRef3 = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Gradient */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGradient className="absolute inset-0" />
        <div className="relative z-10 text-center text-white">
          <SplitText
            tag="h1"
            className="text-6xl font-bold mb-4"
            type="chars"
            stagger={0.02}
            animateFrom={{ opacity: 0, y: 40, rotation: -10 }}
            animateTo={{ opacity: 1, y: 0, rotation: 0 }}
          >
            Complete WebGL Architecture
          </SplitText>
          <p className="text-xl opacity-80">
            Scroll down to explore the integrated components
          </p>
        </div>
      </section>

      {/* Marquee Examples */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold mb-8">Marquee Components</h2>
          
          <div className="space-y-8">
            <Marquee speed={30} className="text-2xl font-medium">
              <span className="mx-8">React Three Fiber</span>
              <span className="mx-8">•</span>
              <span className="mx-8">GSAP Animation</span>
              <span className="mx-8">•</span>
              <span className="mx-8">Shared Canvas</span>
              <span className="mx-8">•</span>
              <span className="mx-8">Theatre.js</span>
              <span className="mx-8">•</span>
            </Marquee>
            
            <Marquee speed={50} reversed className="text-lg text-gray-600">
              <span className="mx-6">Smooth Scrolling with Lenis</span>
              <span className="mx-6">•</span>
              <span className="mx-6">WebGL Integration</span>
              <span className="mx-6">•</span>
              <span className="mx-6">Performance Optimized</span>
              <span className="mx-6">•</span>
            </Marquee>
          </div>
        </div>
      </section>

      {/* WebGL Views Section */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold mb-8">WebGL Views with drei</h2>
          <p className="text-lg mb-12">
            Each box below contains a separate WebGL scene rendered through the shared canvas
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* View 1 */}
            <div 
              ref={viewRef1}
              className="bg-white rounded-lg shadow-lg p-8 h-64 flex items-center justify-center"
            >
              <View track={viewRef1}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} />
                <RotatingMesh>
                  <Box args={[2, 2, 2]}>
                    <meshStandardMaterial color="#ff0066" />
                  </Box>
                </RotatingMesh>
              </View>
            </div>
            
            {/* View 2 */}
            <div 
              ref={viewRef2}
              className="bg-white rounded-lg shadow-lg p-8 h-64 flex items-center justify-center"
            >
              <View track={viewRef2}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} />
                <RotatingMesh>
                  <Sphere args={[1.5, 32, 32]}>
                    <meshNormalMaterial />
                  </Sphere>
                </RotatingMesh>
              </View>
            </div>
            
            {/* View 3 */}
            <div 
              ref={viewRef3}
              className="bg-white rounded-lg shadow-lg p-8 h-64 flex items-center justify-center"
            >
              <View track={viewRef3}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} />
                <RotatingMesh>
                  <Torus args={[1.5, 0.5, 16, 32]}>
                    <meshPhongMaterial color="#00ff88" />
                  </Torus>
                </RotatingMesh>
              </View>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Text Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-8 max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Progress Text Animation</h2>
          
          <ProgressText
            className="text-2xl leading-relaxed text-gray-700"
            start="top bottom"
            end="bottom top"
            transitionDuration={400}
            transitionDelay={30}
          >
            This text reveals itself progressively as you scroll. Each word animates individually 
            based on the scroll progress, creating a smooth and engaging reading experience. 
            The animation is powered by GSAP ScrollTrigger and integrates seamlessly with 
            the Lenis smooth scroll library. The timing and easing can be customized to match 
            your design requirements.
          </ProgressText>
        </div>
      </section>

      {/* Split Text Examples */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold mb-12">Split Text Animations</h2>
          
          <div className="space-y-16">
            <div>
              <h3 className="text-xl font-semibold mb-4">Character Animation</h3>
              <SplitText
                type="chars"
                className="text-4xl font-light"
                stagger={0.01}
                animateFrom={{ opacity: 0, y: 20 }}
              >
                Experience the power of character-based animations
              </SplitText>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Word Animation</h3>
              <SplitText
                type="words"
                className="text-3xl"
                stagger={0.05}
                animateFrom={{ opacity: 0, scale: 0.8 }}
                animateTo={{ opacity: 1, scale: 1 }}
              >
                Words can scale and fade in with custom timing
              </SplitText>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Built with the Satūs Architecture
          </h3>
          <p className="text-lg opacity-80">
            High-performance WebGL integration for modern web applications
          </p>
        </div>
      </footer>
    </div>
  )
}