import React, { useState } from 'react'
import { Scrollbar } from './index'
import './scrollbar.scss'

/**
 * Scrollbar Component Examples
 * Demonstrates various configurations and use cases
 */
export const ScrollbarExamples: React.FC = () => {
  const [theme, setTheme] = useState<'default' | 'minimal' | 'accent' | 'glass'>('default')
  const [alwaysVisible, setAlwaysVisible] = useState(false)
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical')

  return (
    <div className="scrollbar-examples">
      <h1>Scrollbar Component Examples</h1>
      
      {/* Controls */}
      <div className="controls" style={{ 
        position: 'fixed', 
        top: 20, 
        left: 20, 
        zIndex: 100,
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3>Controls</h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            Theme:
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as any)}
              style={{ marginLeft: '10px' }}
            >
              <option value="default">Default</option>
              <option value="minimal">Minimal</option>
              <option value="accent">Accent</option>
              <option value="glass">Glass</option>
            </select>
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={alwaysVisible}
              onChange={(e) => setAlwaysVisible(e.target.checked)}
            />
            Always Visible
          </label>
        </div>
        
        <div>
          <label>
            Orientation:
            <select 
              value={orientation} 
              onChange={(e) => setOrientation(e.target.value as any)}
              style={{ marginLeft: '10px' }}
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </label>
        </div>
      </div>

      {/* Example 1: Basic Scrollbar */}
      <section style={{ marginBottom: '100px', paddingTop: '150px' }}>
        <h2>Basic Scrollbar</h2>
        <p>Default configuration with auto-hide on hover</p>
        <div style={{ height: '200vh', background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)' }}>
          <p style={{ padding: '20px' }}>Scroll to see the custom scrollbar...</p>
        </div>
      </section>

      {/* Example 2: Themed Scrollbar */}
      <section className={`scrollbar-theme--${theme}`} style={{ marginBottom: '100px' }}>
        <h2>Themed Scrollbar ({theme})</h2>
        <p>Scrollbar with custom theme applied</p>
        <div style={{ 
          height: '150vh', 
          background: theme === 'glass' 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : 'linear-gradient(to bottom, #fafafa, #f0f0f0)' 
        }}>
          <p style={{ padding: '20px', color: theme === 'glass' ? 'white' : 'black' }}>
            This section uses the {theme} theme
          </p>
        </div>
      </section>

      {/* Example 3: Custom Styled Scrollbar */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Custom Styled Scrollbar</h2>
        <p>Scrollbar with custom colors and size</p>
        <div style={{ height: '120vh', background: 'linear-gradient(to bottom, #fff5f5, #fed7d7)' }}>
          <p style={{ padding: '20px' }}>Custom styled scrollbar with larger size</p>
        </div>
      </section>

      {/* Example 4: Horizontal Scrolling */}
      {orientation === 'horizontal' && (
        <section style={{ marginBottom: '100px' }}>
          <h2>Horizontal Scrollbar</h2>
          <div style={{ 
            width: '100%', 
            overflowX: 'auto', 
            overflowY: 'hidden',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ 
              width: '200vw', 
              height: '300px',
              background: 'linear-gradient(to right, #e0f2fe, #0891b2)',
              display: 'inline-block'
            }}>
              <p style={{ padding: '20px' }}>Scroll horizontally to see the custom scrollbar...</p>
            </div>
          </div>
        </section>
      )}

      {/* Example 5: Multiple Sections */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Long Content Example</h2>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ 
            height: '80vh', 
            marginBottom: '20px',
            background: `hsl(${i * 60}, 70%, 95%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: `hsl(${i * 60}, 70%, 30%)`
          }}>
            Section {i + 1}
          </div>
        ))}
      </section>

      {/* Apply the scrollbar */}
      <Scrollbar
        orientation={orientation}
        alwaysVisible={alwaysVisible}
        hoverable={!alwaysVisible}
        size={theme === 'minimal' ? 6 : 10}
        hideDelay={1500}
        trackStyle={
          theme === 'accent' 
            ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' }
            : undefined
        }
        thumbStyle={
          theme === 'accent'
            ? { backgroundColor: '#3b82f6' }
            : undefined
        }
      />
    </div>
  )
}

/**
 * Container Scrollbar Example
 * Shows scrollbar within a specific container
 */
export const ContainerScrollbarExample: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6'
    }}>
      <div style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '1200px',
          padding: '40px',
          background: 'linear-gradient(to bottom, #ffffff, #f9fafb)'
        }}>
          <h2>Scrollable Container</h2>
          <p>This is a container with its own scrollbar.</p>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ marginBottom: '20px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
        
        {/* Container-specific scrollbar would need additional setup with Lenis */}
        <div style={{
          position: 'absolute',
          right: '4px',
          top: '4px',
          bottom: '4px',
          width: '8px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '4px'
        }}>
          <div style={{
            width: '100%',
            height: '33%',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            cursor: 'grab'
          }} />
        </div>
      </div>
    </div>
  )
}

export default ScrollbarExamples