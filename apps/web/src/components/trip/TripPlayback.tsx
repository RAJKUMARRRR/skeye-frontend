import { useState, useEffect, useCallback } from 'react'
import { MapProvider, MapPolyline, LatLng } from '../map'
import { Button, Card } from '@fleet/ui-web'

interface TripPlaybackProps {
  tripId: string
  route: LatLng[]
  className?: string
}

export function TripPlayback({ tripId, route, className }: TripPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speed, setSpeed] = useState(1) // 1x, 2x, 4x, 8x
  const [viewport, setViewport] = useState({
    center: route[0] || { lat: 0, lng: 0 },
    zoom: 14,
  })

  // Auto-advance playback
  useEffect(() => {
    if (!isPlaying || currentIndex >= route.length - 1) {
      if (currentIndex >= route.length - 1) {
        setIsPlaying(false)
      }
      return
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= route.length) {
          setIsPlaying(false)
          return prev
        }
        return next
      })
    }, 1000 / speed)

    return () => clearInterval(interval)
  }, [isPlaying, currentIndex, route.length, speed])

  // Update viewport to follow playback
  useEffect(() => {
    if (currentIndex < route.length) {
      setViewport((prev) => ({
        ...prev,
        center: route[currentIndex],
      }))
    }
  }, [currentIndex, route])

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }, [])

  const handleSpeedChange = useCallback(() => {
    setSpeed((prev) => {
      if (prev === 1) return 2
      if (prev === 2) return 4
      if (prev === 4) return 8
      return 1
    })
  }, [])

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setCurrentIndex(value)
    setIsPlaying(false)
  }, [])

  const polyline: MapPolyline = {
    id: `trip-${tripId}`,
    positions: route.slice(0, currentIndex + 1),
    color: '#3b82f6',
    weight: 4,
    opacity: 0.8,
  }

  const completedPolyline: MapPolyline = {
    id: `trip-${tripId}-completed`,
    positions: route,
    color: '#94a3b8',
    weight: 2,
    opacity: 0.3,
  }

  const progress = route.length > 0 ? (currentIndex / (route.length - 1)) * 100 : 0

  return (
    <Card className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Trip Playback</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleSpeedChange}>
              {speed}x
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handlePlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>

        <div className="h-96 rounded-lg overflow-hidden border border-gray-200">
          <MapProvider
            center={viewport.center}
            zoom={viewport.zoom}
            polylines={[completedPolyline, polyline]}
            markers={[
              {
                id: 'current-position',
                position: route[currentIndex] || route[0],
                label: 'Current Position',
              },
            ]}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Point {currentIndex + 1} of {route.length}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max={route.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </Card>
  )
}
