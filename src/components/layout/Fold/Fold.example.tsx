'use client'

import React from 'react'
import Fold from './index'

export default function FoldExample() {
  return (
    <div style={{ minHeight: '300vh' }}>
      {/* Hero Fold - Top Type */}
      <Fold type="top" className="hero-fold">
        <div style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              Fold Component
            </h1>
            <p style={{ fontSize: '1.5rem', opacity: 0.9 }}>
              Scroll down to see the parallax and overlay effects
            </p>
          </div>
        </div>
      </Fold>

      {/* Content Section */}
      <div style={{
        padding: '4rem 2rem',
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
            Middle Content Section
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            This is a regular content section between two fold components. 
            The fold components create smooth transitions with parallax effects 
            and overlay fading as you scroll through the page.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Notice how the hero section above had a parallax effect and 
            darkened as you scrolled past it. The next section will have 
            a bottom fold effect that reveals content from below.
          </p>
        </div>
      </div>

      {/* Bottom Fold with Compound Components */}
      <Fold type="bottom" parallaxSpeed={0.3} overlayOpacity={0.7}>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}>
          <Fold.Header sticky className="fold-header-example">
            <h2 style={{ fontSize: '2rem', margin: 0 }}>Bottom Fold Section</h2>
          </Fold.Header>

          <Fold.Body className="fold-body-example">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                This uses compound components
              </h3>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                The Fold component includes Header, Body, and Footer sub-components 
                for better structure and flexibility. The header can be sticky, 
                and you can control the parallax speed and overlay opacity.
              </p>
              <ul style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                <li>Customizable parallax speed</li>
                <li>Adjustable overlay opacity</li>
                <li>Support for sticky headers and footers</li>
                <li>Smooth GPU-accelerated animations</li>
              </ul>
            </div>
          </Fold.Body>

          <Fold.Footer className="fold-footer-example">
            <button style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: 'white',
              color: '#f5576c',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Call to Action
            </button>
          </Fold.Footer>
        </div>
      </Fold>

      {/* Disabled Fold Example */}
      <div style={{ padding: '4rem 2rem', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Disabled Fold (No Effects)
        </h2>
      </div>

      <Fold disabled>
        <div style={{
          minHeight: '50vh',
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              This Fold is Disabled
            </h3>
            <p style={{ fontSize: '1.1rem' }}>
              No parallax or overlay effects - just regular content
            </p>
          </div>
        </div>
      </Fold>

      {/* Spacer for scrolling */}
      <div style={{ height: '100vh', padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center' }}>End of Demo</h2>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          Scroll back up to see the effects in reverse
        </p>
      </div>
    </div>
  )
}

// Example of using Fold with custom scroll progress animations
export function FoldWithCustomAnimations() {
  return (
    <Fold type="top" className="custom-fold">
      <style jsx>{`
        .custom-fold .animated-text {
          opacity: calc(1 - var(--fold-progress));
          transform: translateY(calc(var(--fold-progress) * -50px));
        }
        
        .custom-fold .side-element {
          transform: translateX(calc(var(--fold-progress) * 100px));
        }
      `}</style>
      
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        color: 'white',
        position: 'relative'
      }}>
        <h1 className="animated-text" style={{ fontSize: '3rem' }}>
          Custom Scroll Animations
        </h1>
        
        <div 
          className="side-element" 
          style={{
            position: 'absolute',
            left: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '2rem'
          }}
        >
          →
        </div>
      </div>
    </Fold>
  )
}