'use client'

import { WebGLTextView } from '@/components/webgl-text'
import { InViewTrigger } from '@/components/InViewTrigger'
import { RevealText } from '@/components/RevealText'
import { RevealImage } from '@/components/RevealImage'
import { RevealButton } from '@/components/RevealButton'
import { Button } from '@/components/ui/button'
import * as THREE from 'three'
import './page.scss'

export default function TextRevealDemoPage() {
  return (
    <div className="text-reveal-demo">
      {/* Hero Section with WebGL Text */}
      <section className="text-reveal-demo__hero">
        <InViewTrigger once={false}>
          <WebGLTextView
            as="h1"
            className="text-reveal-demo__hero-title"
            fontSize={120}
            fontWeight={700}
            maskReveal
            shader="gradient"
            shaderProps={{
              uColorStart: new THREE.Color('#ff0066'),
              uColorEnd: new THREE.Color('#00ff88'),
            }}
          >
            WebGL Text Demo
          </WebGLTextView>
        </InViewTrigger>
        
        <InViewTrigger offset="90%">
          <WebGLTextView
            as="p"
            className="text-reveal-demo__hero-subtitle"
            fontSize={24}
            fontWeight={400}
            animationDelay={0.3}
            maxWidth={800}
          >
            Combining responsive HTML text with WebGL rendering for stunning effects
          </WebGLTextView>
        </InViewTrigger>
      </section>

      {/* Reveal Text Examples */}
      <section className="text-reveal-demo__section">
        <InViewTrigger>
          <RevealText
            tag="h2"
            className="text-reveal-demo__section-title"
            value="Reveal Text Components"
            type="words"
            stagger={0.05}
          />
        </InViewTrigger>

        <InViewTrigger>
          <RevealText
            tag="p"
            className="text-reveal-demo__paragraph"
            value="This text reveals character by character with a smooth animation. It maintains semantic HTML structure while providing beautiful reveal effects."
            type="chars"
            stagger={0.02}
            lineHeight={1.6}
          />
        </InViewTrigger>

        <InViewTrigger>
          <RevealText
            tag="p"
            className="text-reveal-demo__paragraph"
            value="You can also reveal by words for a different effect. This is great for larger blocks of text where character animation might be too much."
            type="words"
            stagger={0.1}
            lineHeight={1.6}
            enterDelay={0.2}
          />
        </InViewTrigger>
      </section>

      {/* WebGL Text Variations */}
      <section className="text-reveal-demo__section">
        <InViewTrigger>
          <WebGLTextView
            as="h2"
            className="text-reveal-demo__section-title"
            fontSize={64}
            fontWeight={600}
            shader="distort"
            shaderProps={{
              uDistortionAmount: 0.05,
              uDistortionFrequency: 2,
            }}
          >
            Distortion Shader
          </WebGLTextView>
        </InViewTrigger>

        <div className="text-reveal-demo__grid">
          <InViewTrigger>
            <WebGLTextView
              as="h3"
              fontSize={36}
              fontWeight={500}
              maskReveal
              animationDelay={0.1}
            >
              Mask Reveal Effect
            </WebGLTextView>
          </InViewTrigger>

          <InViewTrigger>
            <WebGLTextView
              as="h3"
              fontSize={36}
              fontWeight={500}
              shader="gradient"
              shaderProps={{
                uColorStart: new THREE.Color('#00ffff'),
                uColorEnd: new THREE.Color('#ff00ff'),
                uGradientDirection: 1,
              }}
              animationDelay={0.2}
            >
              Vertical Gradient
            </WebGLTextView>
          </InViewTrigger>

          <InViewTrigger>
            <WebGLTextView
              as="h3"
              fontSize={36}
              fontWeight={500}
              color="#ffcc00"
              animationDelay={0.3}
            >
              Custom Color
            </WebGLTextView>
          </InViewTrigger>
        </div>
      </section>

      {/* Reveal Image Example */}
      <section className="text-reveal-demo__section">
        <InViewTrigger>
          <RevealText
            tag="h2"
            className="text-reveal-demo__section-title"
            value="Reveal Image Component"
            type="words"
            stagger={0.1}
          />
        </InViewTrigger>

        <div className="text-reveal-demo__image-grid">
          <InViewTrigger>
            <RevealImage
              className="text-reveal-demo__image"
              image="https://picsum.photos/600/400?random=1"
              label="Random image 1"
              delay={0.1}
            />
          </InViewTrigger>

          <InViewTrigger>
            <RevealImage
              className="text-reveal-demo__image"
              image="https://picsum.photos/600/400?random=2"
              label="Random image 2"
              delay={0.2}
            />
          </InViewTrigger>
        </div>
      </section>

      {/* Reveal Button Example */}
      <section className="text-reveal-demo__section">
        <InViewTrigger>
          <RevealText
            tag="h2"
            className="text-reveal-demo__section-title"
            value="Interactive Elements"
            type="words"
            stagger={0.1}
          />
        </InViewTrigger>

        <div className="text-reveal-demo__buttons">
          <InViewTrigger>
            <RevealButton delay={0.1}>
              <Button size="lg" variant="default">
                Primary Button
              </Button>
            </RevealButton>
          </InViewTrigger>

          <InViewTrigger>
            <RevealButton delay={0.2}>
              <Button size="lg" variant="outline">
                Outline Button
              </Button>
            </RevealButton>
          </InViewTrigger>

          <InViewTrigger>
            <RevealButton delay={0.3}>
              <Button size="lg" variant="ghost">
                Ghost Button
              </Button>
            </RevealButton>
          </InViewTrigger>
        </div>
      </section>

      {/* Combined Example */}
      <section className="text-reveal-demo__section text-reveal-demo__section--dark">
        <InViewTrigger>
          <WebGLTextView
            as="h2"
            className="text-reveal-demo__section-title"
            fontSize={72}
            fontWeight={700}
            maskReveal
            shader="gradient"
            shaderProps={{
              uColorStart: new THREE.Color('#ffffff'),
              uColorEnd: new THREE.Color('#888888'),
            }}
          >
            Bringing It All Together
          </WebGLTextView>
        </InViewTrigger>

        <InViewTrigger>
          <RevealText
            tag="p"
            className="text-reveal-demo__paragraph text-reveal-demo__paragraph--light"
            value="These components work seamlessly together to create engaging, accessible, and performant web experiences. The WebGL text maintains SEO-friendliness while providing stunning visual effects."
            type="words"
            stagger={0.05}
            lineHeight={1.8}
            enterDelay={0.3}
          />
        </InViewTrigger>

        <InViewTrigger>
          <RevealButton delay={0.5} className="text-reveal-demo__cta">
            <Button size="lg" variant="default" className="text-reveal-demo__cta-button">
              Start Building
            </Button>
          </RevealButton>
        </InViewTrigger>
      </section>
    </div>
  )
}