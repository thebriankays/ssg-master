import React, { useState } from 'react'
import { ProgressText } from './index'
import './progress-text.scss'

export const ProgressTextExample: React.FC = () => {
  const [visibleWords, setVisibleWords] = useState(0)
  const [progress, setProgress] = useState(0)

  const handleChange = (words: number, prog: number) => {
    setVisibleWords(words)
    setProgress(prog)
  }

  return (
    <div style={{ padding: '50px', minHeight: '200vh' }}>
      <h1>ProgressText Component Examples</h1>
      
      {/* Example 1: Basic Usage */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Basic Usage</h2>
        <p>Scroll down to see the text reveal word by word.</p>
        <div style={{ margin: '50px 0', fontSize: '24px', lineHeight: '1.6' }}>
          <ProgressText>
            The quick brown fox jumps over the lazy dog. This text will reveal word by word as you scroll down the page.
          </ProgressText>
        </div>
      </section>

      {/* Example 2: Custom Animation Timing */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Custom Animation Timing</h2>
        <div style={{ margin: '50px 0', fontSize: '20px', lineHeight: '1.6' }}>
          <ProgressText
            transitionDuration={800}
            transitionDelay={100}
            transitionEasing="cubic-bezier(0.68, -0.55, 0.265, 1.55)"
          >
            This text has custom timing with a bouncy easing function and longer delays between each word animation.
          </ProgressText>
        </div>
      </section>

      {/* Example 3: Different Animation Styles */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Animation Variations</h2>
        
        <div style={{ margin: '50px 0' }}>
          <h3>Fade Up (Default)</h3>
          <div style={{ fontSize: '18px', marginBottom: '30px' }}>
            <ProgressText className="progress-text--fade-up">
              Words fade in from below with a smooth upward motion.
            </ProgressText>
          </div>

          <h3>Fade Down</h3>
          <div style={{ fontSize: '18px', marginBottom: '30px' }}>
            <ProgressText className="progress-text--fade-down">
              Words fade in from above with a downward motion.
            </ProgressText>
          </div>

          <h3>Scale Effect</h3>
          <div style={{ fontSize: '18px', marginBottom: '30px' }}>
            <ProgressText className="progress-text--scale progress-text--no-blur">
              Words scale up as they appear on screen.
            </ProgressText>
          </div>

          <h3>Rotate Effect</h3>
          <div style={{ fontSize: '18px', marginBottom: '30px' }}>
            <ProgressText className="progress-text--rotate">
              Words rotate in as they become visible.
            </ProgressText>
          </div>
        </div>
      </section>

      {/* Example 4: Custom Trigger Points */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Custom Trigger Points</h2>
        <div style={{ margin: '50px 0', fontSize: '18px' }}>
          <ProgressText
            start="top center"
            end="bottom center"
            transitionDuration={500}
          >
            This animation triggers when the text reaches the center of the viewport and completes when it leaves the center.
          </ProgressText>
        </div>
      </section>

      {/* Example 5: Progress Tracking */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Progress Tracking with Callback</h2>
        <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
          <p>Visible Words: {visibleWords}</p>
          <p>Progress: {(progress * 100).toFixed(1)}%</p>
        </div>
        <div style={{ fontSize: '20px' }}>
          <ProgressText onChange={handleChange}>
            Track the progress of this text animation. The callback provides real-time updates on visibility.
          </ProgressText>
        </div>
      </section>

      {/* Example 6: Long Text */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Long Text Example</h2>
        <div style={{ fontSize: '16px', lineHeight: '1.8', maxWidth: '800px' }}>
          <ProgressText
            className="progress-text--optimize"
            transitionDuration={400}
            transitionDelay={30}
            visibilityThreshold={0.1}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. This longer text demonstrates how the component handles performance optimization for larger amounts of content.
          </ProgressText>
        </div>
      </section>

      {/* Example 7: Custom Word Separator */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Custom Word Separator</h2>
        <div style={{ fontSize: '18px' }}>
          <ProgressText
            wordSeparator={/[,.\s]+/}
            transitionDelay={80}
          >
            This,text,uses,commas,as,separators. And.periods.too. Making each segment animate individually.
          </ProgressText>
        </div>
      </section>

      {/* Example 8: Animate Spaces */}
      <section style={{ marginBottom: '100px' }}>
        <h2>Animate Spaces</h2>
        <div style={{ fontSize: '20px', fontFamily: 'monospace' }}>
          <ProgressText
            animateSpaces={true}
            transitionDelay={40}
          >
            This   text   has   multiple   spaces   that   are   preserved   and   animated.
          </ProgressText>
        </div>
      </section>

      {/* Spacer for scrolling */}
      <div style={{ height: '100vh' }}></div>
    </div>
  )
}

export default ProgressTextExample