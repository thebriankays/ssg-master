'use client'

import React, { useRef } from 'react'
import SplitText, { SplitTextRef } from './index'

export function SplitTextExamples() {
  const splitRef = useRef<SplitTextRef>(null)

  const handleReplay = () => {
    splitRef.current?.restart()
  }

  return (
    <div className="space-y-8 p-8">
      {/* Basic word split */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic Word Split</h3>
        <SplitText type="words" className="text-2xl">
          This text will be split by words and animated
        </SplitText>
      </div>

      {/* Character split with custom animation */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Character Split</h3>
        <SplitText
          type="chars"
          className="text-3xl font-bold"
          animateFrom={{ opacity: 0, y: 50, rotation: -10 }}
          animateTo={{ opacity: 1, y: 0, rotation: 0 }}
          stagger={0.03}
          duration={0.6}
        >
          Animated Characters
        </SplitText>
      </div>

      {/* Line split with mask */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Line Split with Mask</h3>
        <SplitText
          type="lines"
          mask={true}
          className="text-xl max-w-md"
          animateFrom={{ opacity: 0, y: '100%' }}
          animateTo={{ opacity: 1, y: '0%' }}
          stagger={0.1}
        >
          This is a longer text that will be split by lines. Each line will be
          animated separately with a mask effect for smooth reveal.
        </SplitText>
      </div>

      {/* Words and lines split */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Words & Lines Split</h3>
        <SplitText
          type="words,lines"
          className="text-xl max-w-lg"
          wordClassName="hover:text-blue-500 transition-colors"
          animateFrom={{ opacity: 0, x: -20 }}
          animateTo={{ opacity: 1, x: 0 }}
          stagger={0.02}
        >
          This text is split by both words and lines. Hover over words to see
          the interactive effect applied through custom classes.
        </SplitText>
      </div>

      {/* Controlled animation with ref */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Controlled Animation</h3>
        <SplitText
          ref={splitRef}
          type="chars,words"
          className="text-2xl font-medium"
          animateFrom={{ opacity: 0, scale: 0, rotation: 180 }}
          animateTo={{ opacity: 1, scale: 1, rotation: 0 }}
          stagger={0.02}
          duration={0.4}
          ease="back.out(1.7)"
        >
          Click replay to see magic!
        </SplitText>
        <button
          onClick={handleReplay}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Replay Animation
        </button>
      </div>

      {/* No animation example */}
      <div>
        <h3 className="text-lg font-semibold mb-2">No Animation (willAppear=false)</h3>
        <SplitText
          type="words"
          willAppear={false}
          className="text-xl"
          wordClassName="text-gray-700 hover:text-black"
        >
          This text is split but not animated on appear
        </SplitText>
      </div>

      {/* Custom tag example */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Custom Tag (h1)</h3>
        <SplitText
          tag={'h1' as keyof JSX.IntrinsicElements}
          type="words"
          className="text-4xl font-bold"
          animateFrom={{ opacity: 0, y: 30, skewY: 5 }}
          animateTo={{ opacity: 1, y: 0, skewY: 0 }}
          stagger={0.05}
          delay={0.2}
        >
          Heading Text Animation
        </SplitText>
      </div>

      {/* Callback example */}
      <div>
        <h3 className="text-lg font-semibold mb-2">With Callbacks</h3>
        <SplitText
          type="words"
          className="text-2xl"
          onAnimationStart={() => console.log('Animation started!')}
          onAnimationComplete={() => console.log('Animation completed!')}
        >
          Check console for callbacks
        </SplitText>
      </div>
    </div>
  )
}