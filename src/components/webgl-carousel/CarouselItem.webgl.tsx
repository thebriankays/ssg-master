'use client'

import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
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

  useEffect(() => {
    if (!$root.current) return
    
    gsap.killTweensOf($root.current.position)
    gsap.to($root.current.position, {
      z: isActive ? 1 : -0.01,
      duration: 0.2,
      ease: 'power3.out',
      delay: isActive ? 0 : 2
    })
  }, [isActive])

  useEffect(() => {
    if (!$root.current) return
    
    gsap.killTweensOf($root.current.scale)
    gsap.to($root.current.scale, {
      x: hover ? 1.1 : 1,
      y: hover ? 1.1 : 1,
      duration: 0.2,
      ease: 'power3.out'
    })
  }, [hover])

  const handleClick = () => {
    if (!isActive) {
      setActivePlane(index)
    }
  }

  const handleClose = (e: any) => {
    e.stopPropagation()
    if (!isActive) return
    setActivePlane(null)
    setHover(false)
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setCloseActive(false)
    }, 1500)
  }

  return (
    <group 
      ref={$root}
      onClick={handleClick}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Plane
        width={width}
        height={height}
        texture={item.image}
        active={isActive}
      />

      {isCloseActive ? (
        <mesh position={[0, 0, 0.01]} onClick={handleClose}>
          <planeGeometry args={[width * 10, height * 10]} />
          <meshBasicMaterial transparent={true} opacity={0} />
        </mesh>
      ) : null}
    </group>
  )
}
