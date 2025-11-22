import React, { useEffect, useRef, useState } from 'react'
import { Marker } from 'react-map-gl'

interface AnimatedMarkerProps {
  latitude: number
  longitude: number
  duration?: number // Animation duration in ms
  children: React.ReactNode
  onClick?: (e: any) => void
}

export const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({
  latitude,
  longitude,
  duration = 1000,
  children,
  onClick
}) => {
  const [position, setPosition] = useState({ lat: latitude, lng: longitude })
  const requestRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const startPosRef = useRef({ lat: latitude, lng: longitude })
  const targetPosRef = useRef({ lat: latitude, lng: longitude })

  // Update target position when props change
  useEffect(() => {
    // If target changed, start new animation
    if (latitude !== targetPosRef.current.lat || longitude !== targetPosRef.current.lng) {
      startPosRef.current = position
      targetPosRef.current = { lat: latitude, lng: longitude }
      startTimeRef.current = undefined
      
      // Cancel any existing animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      
      requestRef.current = requestAnimationFrame(animate)
    }
  }, [latitude, longitude])

  const animate = (time: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = time
    }

    const elapsed = time - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out cubic function for smoother movement
    const ease = 1 - Math.pow(1 - progress, 3)

    const currentLat = startPosRef.current.lat + (targetPosRef.current.lat - startPosRef.current.lat) * ease
    const currentLng = startPosRef.current.lng + (targetPosRef.current.lng - startPosRef.current.lng) * ease

    setPosition({ lat: currentLat, lng: currentLng })

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate)
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  return (
    <Marker
      latitude={position.lat}
      longitude={position.lng}
      onClick={onClick}
    >
      {children}
    </Marker>
  )
}
