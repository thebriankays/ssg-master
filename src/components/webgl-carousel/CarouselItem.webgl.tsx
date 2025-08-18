'use client'

import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGSAP } from '@/hooks/use-gsap'
import { gsap } from 'gsap'
import { Plane } from './Plane.webgl'
import type { CarouselImage } from './index'

interface CarouselItemProps {
  index: number
  image: CarouselImage
  width: number
  height: number
  setActiveIndex: (index: number | null) => void
  activeIndex: number | null
  name: string
  onLoaded?: () => void
}

export function CarouselItem({
  index,
  image,
  width,
  height,
  setActiveIndex,
  activeIndex,
  name,
  onLoaded
}: CarouselItemProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isCloseActive, setCloseActive] = useState(false)
  const { viewport } = useThree()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activeIndex === index) {
      setIsActive(true)
      setCloseActive(true)
    } else {
      setIsActive(false)
    }
  }, [activeIndex, index])

  // Position animation
  useGSAP(() => {
    if (!groupRef.current) return
    
    gsap.killTweensOf(groupRef.current.position)
    gsap.to(groupRef.current.position, {
      z: isActive ? 0 : -0.01,
      duration: 0.2,
      ease: 'power3.out',
      delay: isActive ? 0 : 2
    })
  }, [isActive])

  // Hover effect
  useGSAP(() => {
    if (!groupRef.current) return
    
    const hoverScale = hover && !isActive ? 1.1 : 1
    gsap.to(groupRef.current.scale, {
      x: hoverScale,
      y: hoverScale,
      z: hoverScale,
      duration: 0.5,
      ease: 'power3.out'
    })
  }, [hover, isActive])

  const handleClick = (e: THREE.Event) => {
    // @ts-ignore - R3F event handling
    if (e.stopPropagation) e.stopPropagation()
    if (!isActive) {
      setActiveIndex(index)
    }
  }

  const handleClose = (e: THREE.Event) => {
    // @ts-ignore - R3F event handling
    if (e.stopPropagation) e.stopPropagation()
    if (!isActive) return
    
    setActiveIndex(null)
    setHover(false)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setCloseActive(false)
    }, 1500)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <group
      ref={groupRef}
      name={name}
      onClick={handleClick}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Plane
        width={width}
        height={height}
        texture={image.src}
        active={isActive}
        onLoaded={onLoaded}
      />

      {isCloseActive && (
        <mesh position={[0, 0, 0.01]} onClick={handleClose}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  )
}