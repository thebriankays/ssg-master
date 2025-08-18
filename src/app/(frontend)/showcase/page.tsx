'use client'

import { useRef } from 'react'
import { AnimatedBox } from '@/components/animated-box'
import { SplitText } from '@/components/split-text'
import { ProgressText } from '@/components/progress-text'
import { Marquee } from '@/components/marquee'
import { AnimatedGradient } from '@/components/animated-gradient'
import { Image as WebGLImage } from '@/webgl/components/image'

export default function ShowcasePage() {
  const splitTextRef = useRef<any>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Gradient */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatedGradient className="absolute inset-0" />
        <div className="relative z-10 text-center">
          <SplitText
            ref={splitTextRef}
            as="h1"
            className="text-6xl font-bold text-white mb-4"
            type="chars"
          >
            Welcome to WebGL Showcase
          </SplitText>
          <p className="text-xl text-white/80">
            Scroll down to see the animations in action
          </p>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-16 overflow-hidden">
        <Marquee speed={0.5} className="text-2xl font-medium">
          <span className="mx-8">React Three Fiber</span>
          <span className="mx-8">•</span>
          <span className="mx-8">GSAP</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Theatre.js</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Payload CMS</span>
          <span className="mx-8">•</span>
        </Marquee>
      </section>

      {/* Progress Text Section */}
      <section className="py-32 px-8 max-w-4xl mx-auto">
        <ProgressText
          className="text-4xl leading-relaxed font-light"
          start="top bottom"
          end="bottom top"
        >
          This text reveals itself as you scroll. Each word animates individually based on scroll progress, creating a smooth reading experience that guides the user through the content.
        </ProgressText>
      </section>

      {/* Interactive 3D Objects Grid */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Interactive 3D Objects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square">
              <AnimatedBox className="w-full h-full" />
            </div>
          ))}
        </div>
      </section>

      {/* WebGL Enhanced Images */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">WebGL Enhanced Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <WebGLImage
            src="/api/media/file/hero1a-jpg.jpg"
            alt="Enhanced image 1"
            width={800}
            height={600}
            className="rounded-lg overflow-hidden"
          />
          <WebGLImage
            src="/api/media/file/hero1a-jpg.jpg"
            alt="Enhanced image 2"
            width={800}
            height={600}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </section>

      {/* Footer with Animated Gradient */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <AnimatedGradient className="absolute inset-0" />
        <div className="relative z-10 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Built with Satūs Architecture</h3>
          <p className="text-lg">High-performance WebGL integration for Payload CMS</p>
        </div>
      </section>
    </div>
  )
}