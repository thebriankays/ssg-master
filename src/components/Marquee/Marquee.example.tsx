import React from 'react'
import { Marquee } from './index'

/**
 * Marquee Component Examples
 * 
 * Demonstrates various use cases and configurations
 */

// Basic usage
export const BasicMarquee = () => (
  <Marquee speed={50}>
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem 0' }}>
      <span>Welcome to our website</span>
      <span>•</span>
      <span>Check out our latest products</span>
      <span>•</span>
      <span>Free shipping on orders over $50</span>
      <span>•</span>
    </div>
  </Marquee>
)

// With logos/images
export const LogoMarquee = () => (
  <Marquee 
    speed={30} 
    repeat={3} 
    gap={40}
    className="marquee--lg"
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
      <img src="/logo1.svg" alt="Partner 1" height="40" />
      <img src="/logo2.svg" alt="Partner 2" height="40" />
      <img src="/logo3.svg" alt="Partner 3" height="40" />
      <img src="/logo4.svg" alt="Partner 4" height="40" />
    </div>
  </Marquee>
)

// With pause on hover
export const InteractiveMarquee = () => (
  <Marquee 
    speed={60} 
    pauseOnHover={true}
    className="marquee--md"
  >
    <div style={{ display: 'flex', gap: '3rem' }}>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
        Latest News: Product Launch
      </a>
      <span>📰</span>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
        Special Offer: 20% Off
      </a>
      <span>🎉</span>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>
        New Feature Available
      </a>
      <span>🚀</span>
    </div>
  </Marquee>
)

// Reversed direction
export const ReversedMarquee = () => (
  <Marquee 
    speed={40} 
    reversed={true}
    className="marquee--sm"
  >
    <div style={{ display: 'flex', gap: '2rem' }}>
      {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'].map((tech, index) => (
        <span key={index} style={{ 
          padding: '0.5rem 1rem', 
          background: '#f0f0f0', 
          borderRadius: '20px' 
        }}>
          {tech}
        </span>
      ))}
    </div>
  </Marquee>
)

// With scroll velocity integration
export const ScrollVelocityMarquee = () => (
  <Marquee 
    speed={30} 
    scrollVelocity={true}
    scrollVelocityMultiplier={2}
    gap={20}
  >
    <div style={{ display: 'flex', gap: '20px', fontSize: '2rem', fontWeight: 'bold' }}>
      <span>SCROLL</span>
      <span>TO</span>
      <span>SPEED</span>
      <span>UP</span>
      <span>THE</span>
      <span>ANIMATION</span>
      <span>→</span>
    </div>
  </Marquee>
)

// Multiple marquees with different speeds
export const MultipleMarquees = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Marquee speed={30}>
      <div style={{ padding: '1rem 0' }}>Slow Speed (30px/s)</div>
    </Marquee>
    
    <Marquee speed={60} reversed={true}>
      <div style={{ padding: '1rem 0' }}>Medium Speed Reversed (60px/s)</div>
    </Marquee>
    
    <Marquee speed={100}>
      <div style={{ padding: '1rem 0' }}>Fast Speed (100px/s)</div>
    </Marquee>
  </div>
)

// Custom styled marquee
export const CustomStyledMarquee = () => (
  <div style={{ 
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 0',
    color: 'white'
  }}>
    <Marquee 
      speed={50} 
      className="marquee--no-mask"
      gap={60}
    >
      <div style={{ 
        display: 'flex', 
        gap: '60px', 
        alignItems: 'center',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        <span>Limited Time Offer</span>
        <span>✦</span>
        <span>Free Delivery</span>
        <span>✦</span>
        <span>24/7 Support</span>
        <span>✦</span>
      </div>
    </Marquee>
  </div>
)

// Complete demo page
export const MarqueeDemo = () => (
  <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <h1>Marquee Component Examples</h1>
    
    <section style={{ marginTop: '3rem' }}>
      <h2>Basic Marquee</h2>
      <BasicMarquee />
    </section>
    
    <section style={{ marginTop: '3rem' }}>
      <h2>Logo Marquee</h2>
      <LogoMarquee />
    </section>
    
    <section style={{ marginTop: '3rem' }}>
      <h2>Interactive (Pause on Hover)</h2>
      <InteractiveMarquee />
    </section>
    
    <section style={{ marginTop: '3rem' }}>
      <h2>Reversed Direction</h2>
      <ReversedMarquee />
    </section>
    
    <section style={{ marginTop: '3rem' }}>
      <h2>Scroll Velocity Integration</h2>
      <p>Scroll the page to see the marquee speed up!</p>
      <ScrollVelocityMarquee />
    </section>
    
    <section style={{ marginTop: '3rem' }}>
      <h2>Multiple Speeds</h2>
      <MultipleMarquees />
    </section>
    
    <section style={{ marginTop: '3rem' }}>
      <h2>Custom Styled</h2>
      <CustomStyledMarquee />
    </section>
  </div>
)

export default MarqueeDemo