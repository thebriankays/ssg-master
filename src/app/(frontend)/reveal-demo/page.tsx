'use client'

import { RevealText, RevealImage, RevealBox, RevealTransform } from '@/components/Reveal'
import { cn } from '@/utilities/ui'
import './reveal-demo.scss'

export default function RevealDemoPage() {
  return (
    <div className="reveal-demo">
      {/* Hero Section */}
      <section className="reveal-demo__hero">
        <RevealText
          as="h1"
          type="lines"
          className="reveal-demo__title"
          stagger={0.05}
          from="bottom"
          distance="150%"
          duration={1.2}
          rotate={3}
        >
          Reveal Components
          Showcase
        </RevealText>
        
        <RevealText
          as="p"
          type="words"
          className="reveal-demo__subtitle"
          stagger={0.02}
          from="bottom"
          distance="100%"
          delay={0.3}
        >
          High-performance scroll-triggered animations built with GSAP and React. 
          Scroll down to see various reveal effects in action.
        </RevealText>
      </section>

      {/* Text Animations */}
      <section className="reveal-demo__section">
        <RevealText
          as="h2"
          type="chars"
          className="reveal-demo__heading"
          stagger={0.03}
          from="left"
          distance="50px"
        >
          Text Animations
        </RevealText>
        
        <div className="reveal-demo__grid">
          <RevealBox className="reveal-demo__card">
            <RevealText type="lines" from="bottom">
              <h3>Line by Line</h3>
              <p>This text reveals line by line with a stagger effect. Perfect for paragraphs and body text.</p>
            </RevealText>
          </RevealBox>
          
          <RevealBox className="reveal-demo__card" delay={0.1}>
            <RevealText type="words" from="left" stagger={0.02}>
              <h3>Word by Word</h3>
              <p>Each word animates individually from the left. Great for headlines and important text.</p>
            </RevealText>
          </RevealBox>
          
          <RevealBox className="reveal-demo__card" delay={0.2}>
            <RevealText type="chars" from="bottom" stagger={0.01} rotate={5}>
              <h3>Character Animation</h3>
              <p>Individual character animation with rotation. Ideal for creative and playful effects.</p>
            </RevealText>
          </RevealBox>
        </div>
      </section>

      {/* Image Reveals */}
      <section className="reveal-demo__section">
        <RevealText
          as="h2"
          type="block"
          className="reveal-demo__heading"
        >
          Image Reveals
        </RevealText>
        
        <div className="reveal-demo__images">
          <RevealImage
            src="/img1_.jpg"
            alt="Demo Image 1"
            width={400}
            height={300}
            className="reveal-demo__image"
            scale={1.2}
            blur={20}
            clipPath="horizontal"
          />
          
          <RevealImage
            src="/img2_.jpg"
            alt="Demo Image 2"
            width={400}
            height={300}
            className="reveal-demo__image"
            scale={1.1}
            clipPath="vertical"
            delay={0.2}
          />
          
          <RevealImage
            src="/img3_.jpg"
            alt="Demo Image 3"
            width={400}
            height={300}
            className="reveal-demo__image"
            clipPath="circle"
            parallax={0.1}
            delay={0.4}
          />
        </div>
      </section>

      {/* Mask Reveals */}
      <section className="reveal-demo__section reveal-demo__section--dark">
        <RevealText
          as="h2"
          className="reveal-demo__heading"
          type="lines"
          from="top"
        >
          Mask Reveal Effects
        </RevealText>
        
        <div className="reveal-demo__grid">
          <RevealBox
            className="reveal-demo__card"
            mask={true}
            maskDirection="horizontal"
            maskDuration={1}
          >
            <h3>Horizontal Mask</h3>
            <p>Content revealed with a horizontal mask animation from left to right.</p>
          </RevealBox>
          
          <RevealBox
            className="reveal-demo__card"
            mask={true}
            maskDirection="vertical"
            maskDuration={1}
            delay={0.2}
          >
            <h3>Vertical Mask</h3>
            <p>Content revealed with a vertical mask animation from top to bottom.</p>
          </RevealBox>
          
          <RevealBox
            className="reveal-demo__card"
            mask={true}
            maskDirection="diagonal"
            maskDuration={1.2}
            delay={0.4}
          >
            <h3>Diagonal Mask</h3>
            <p>Content revealed with a diagonal mask animation for a unique effect.</p>
          </RevealBox>
        </div>
      </section>

      {/* 3D Transforms */}
      <section className="reveal-demo__section">
        <RevealText
          as="h2"
          className="reveal-demo__heading"
          type="lines"
        >
          3D Transform Effects
        </RevealText>
        
        <div className="reveal-demo__transforms">
          <RevealTransform
            className="reveal-demo__transform-card"
            rotateX={45}
            rotateY={-30}
            translateZ={100}
            perspective={1000}
            blur={10}
          >
            <div className="reveal-demo__3d-content">
              <h3>3D Rotation</h3>
              <p>Complex 3D transforms with perspective</p>
            </div>
          </RevealTransform>
          
          <RevealTransform
            className="reveal-demo__transform-card"
            scale={0.5}
            rotateZ={180}
            opacity={true}
            brightness={150}
            delay={0.2}
          >
            <div className="reveal-demo__3d-content">
              <h3>Scale & Rotate</h3>
              <p>Combined scale and rotation effects</p>
            </div>
          </RevealTransform>
          
          <RevealTransform
            className="reveal-demo__transform-card"
            translateY={100}
            skewX={20}
            blur={20}
            saturate={0}
            delay={0.4}
          >
            <div className="reveal-demo__3d-content">
              <h3>Skew & Filters</h3>
              <p>Transform with filter effects</p>
            </div>
          </RevealTransform>
        </div>
      </section>

      {/* Parallax Section */}
      <section className="reveal-demo__section reveal-demo__section--parallax">
        <RevealTransform
          parallax={true}
          parallaxSpeed={0.5}
          parallaxOffset={150}
          scrub={true}
        >
          <RevealText
            as="h2"
            className="reveal-demo__heading"
            type="lines"
            from="bottom"
          >
            Parallax Scrolling
          </RevealText>
        </RevealTransform>
        
        <div className="reveal-demo__parallax-layers">
          <RevealTransform
            className="reveal-demo__parallax-layer"
            parallax={true}
            parallaxSpeed={0.3}
            scrub={true}
          >
            <RevealImage
              src="/img4_.jpg"
              alt="Background Layer"
              width={800}
              height={600}
              className="reveal-demo__parallax-image"
            />
          </RevealTransform>
          
          <RevealTransform
            className="reveal-demo__parallax-layer"
            parallax={true}
            parallaxSpeed={0.6}
            scrub={true}
          >
            <RevealBox
              className="reveal-demo__parallax-content"
              from="center"
              scale={0.8}
            >
              <h3>Layered Parallax</h3>
              <p>Multiple layers moving at different speeds create depth</p>
            </RevealBox>
          </RevealTransform>
        </div>
      </section>

      {/* Scrub Animation */}
      <section className="reveal-demo__section">
        <RevealText
          as="h2"
          className="reveal-demo__heading"
          type="lines"
        >
          Scrub Animations
        </RevealText>
        
        <RevealTransform
          className="reveal-demo__scrub-container"
          rotateY={360}
          translateX="100%"
          scale={0.5}
          scrub={true}
          start="top bottom"
          end="bottom top"
        >
          <div className="reveal-demo__scrub-box">
            <p>This element rotates and scales based on scroll position</p>
          </div>
        </RevealTransform>
      </section>

      {/* Combined Effects */}
      <section className="reveal-demo__section reveal-demo__section--combined">
        <RevealText
          as="h2"
          className="reveal-demo__heading"
          type="chars"
          stagger={0.02}
          from="bottom"
          rotate={2}
        >
          Combined Effects
        </RevealText>
        
        <RevealTransform
          rotateX={20}
          perspective={1000}
          parallax={true}
          parallaxSpeed={0.3}
        >
          <RevealBox
            className="reveal-demo__combined-card"
            from="bottom"
            distance={100}
            scale={0.9}
          >
            <RevealImage
              src="/img5_.jpg"
              alt="Combined Effect"
              width={600}
              height={400}
              className="reveal-demo__combined-image"
              scale={1.1}
              blur={5}
              clipPath="diagonal"
            />
            
            <div className="reveal-demo__combined-content">
              <RevealText
                as="h3"
                type="words"
                from="left"
                delay={0.5}
              >
                Multiple Reveal Effects
              </RevealText>
              
              <RevealText
                as="p"
                type="lines"
                from="bottom"
                delay={0.7}
              >
                Combining different reveal components creates rich, layered animations 
                that bring your content to life.
              </RevealText>
            </div>
          </RevealBox>
        </RevealTransform>
      </section>
    </div>
  )
}