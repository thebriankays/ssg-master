'use client'

import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { useGSAP } from '@/hooks/use-gsap'
import gsap from 'gsap'
import * as THREE from 'three'
import { Plane } from './Plane.webgl'
import type { CarouselImage } from './index'

interface CarouselItemProps {
  index: number
  width: number
  height: number
  setActivePlane: (index: number | null) => void
  activePlane: number | null
  item: CarouselImage
}

export function CarouselItem({
  index,
  width,
  height,
  setActivePlane,
  activePlane,
  item
}: CarouselItemProps) {
  const $root = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isCloseActive, setCloseActive] = useState(false)
  const { viewport } = useThree()
  const timeoutID = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (activePlane === index) {
      setIsActive(true)
      setCloseActive(true)
    } else {
      setIsActive(false)
    }
  }, [activePlane, index])

  // Animate position when active state changes
  useGSAP(() => {
    if (!$root.current) return
    
    gsap.to($root.current.position, {
      z: isActive ? 1 : -0.01,
      duration: 0.2,
      ease: 'power3.out',
      delay: isActive ? 0 : 2
    })
  }, [isActive])

  // Animate scale on hover
  useGSAP(() => {
    if (!$root.current) return
    
    gsap.to($root.current.scale, {
      x: hover ? 1.1 : 1,
      y: hover ? 1.1 : 1,
      duration: 0.2,
      ease: 'power3.out'
    })
  }, [hover])

  // Remove click handlers since we're using DOM forwarding

  return (
    <group 
      ref={$root}
    >
      <Plane
        width={width}
        height={height}
        texture={item.image}
        active={isActive}
      />

    </group>
  )
}
