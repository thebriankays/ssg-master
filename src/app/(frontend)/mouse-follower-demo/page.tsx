'use client'

import { useRef } from 'react'
import { useMouseFollower } from '@/components/mouse-follower'
import { Heading, Text } from '@/components/typography'

export default function MouseFollowerDemoPage() {
  const { setText, removeText, setIcon, removeIcon, addState, removeState, setStick, removeStick } = useMouseFollower()
  const stickRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen p-8">
      <Heading level={1} className="mb-8">
        Cuberto Mouse Follower Demo
      </Heading>
      
      <div className="space-y-16">
        {/* Basic hover states */}
        <section>
          <Heading level={2} className="mb-4">Basic States</Heading>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Hover me (pointer state)
            </button>
            
            <a href="#" className="px-6 py-3 bg-green-600 text-white rounded-lg inline-block hover:bg-green-700">
              Link with pointer state
            </a>
          </div>
        </section>

        {/* Text state */}
        <section>
          <Heading level={2} className="mb-4">Text State</Heading>
          <div className="flex flex-wrap gap-4">
            <div 
              data-cursor-text="View"
              className="px-8 py-4 bg-gray-200 rounded-lg cursor-pointer"
            >
              Hover for text (data attribute)
            </div>
            
            <div 
              onMouseEnter={() => setText('Custom Text')}
              onMouseLeave={() => removeText()}
              className="px-8 py-4 bg-gray-300 rounded-lg cursor-pointer"
            >
              Hover for custom text (JS)
            </div>
          </div>
        </section>

        {/* Icon state */}
        <section>
          <Heading level={2} className="mb-4">Icon State</Heading>
          <div className="flex flex-wrap gap-4">
            <div 
              data-cursor-icon="arrow-right"
              className="px-8 py-4 bg-purple-200 rounded-lg cursor-pointer"
            >
              Hover for icon (needs SVG sprite)
            </div>
            
            <div 
              onMouseEnter={() => setIcon('play')}
              onMouseLeave={() => removeIcon()}
              className="px-8 py-4 bg-purple-300 rounded-lg cursor-pointer"
            >
              Hover for play icon (JS)
            </div>
          </div>
        </section>

        {/* Custom states */}
        <section>
          <Heading level={2} className="mb-4">Custom States</Heading>
          <div className="flex flex-wrap gap-4">
            <div 
              onMouseEnter={() => addState('-inverse')}
              onMouseLeave={() => removeState('-inverse')}
              className="px-8 py-4 bg-black text-white rounded-lg cursor-pointer"
            >
              Hover for inverse state
            </div>
            
            <div 
              onMouseEnter={() => addState('-large')}
              onMouseLeave={() => removeState('-large')}
              className="px-8 py-4 bg-yellow-300 rounded-lg cursor-pointer"
            >
              Hover for large state
            </div>
          </div>
        </section>

        {/* Sticky effect */}
        <section>
          <Heading level={2} className="mb-4">Sticky Effect</Heading>
          <div className="relative h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div 
              ref={stickRef}
              data-cursor-stick
              className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
            >
              Sticky
            </div>
          </div>
        </section>

        {/* Media states */}
        <section>
          <Heading level={2} className="mb-4">Media States</Heading>
          <div className="grid grid-cols-2 gap-4">
            <div 
              data-cursor-img="/api/media/file/hero1a-jpg.jpg"
              className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <Text>Hover for image preview</Text>
            </div>
            
            <div 
              data-cursor-video="/path/to/video.mp4"
              className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <Text>Hover for video preview</Text>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="mt-16 p-8 bg-gray-50 rounded-lg">
          <Heading level={3} className="mb-4">How to use:</Heading>
          <ul className="space-y-2 list-disc list-inside">
            <li>The mouse follower is automatically initialized via the provider</li>
            <li>Use data attributes for simple interactions: data-cursor-text, data-cursor-icon, etc.</li>
            <li>Use the useMouseFollower hook for programmatic control</li>
            <li>Add custom CSS classes for different cursor states in mouse-follower.scss</li>
            <li>The cursor automatically hides on touch devices</li>
          </ul>
        </section>
      </div>
    </div>
  )
}