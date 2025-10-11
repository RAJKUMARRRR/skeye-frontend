import { useMemo } from 'react'
import { MapPolygon, MapCircle, LatLng } from './types'

export interface Geofence {
  id: string
  name: string
  type: 'circle' | 'polygon'
  active: boolean
  // Circle geofence
  center?: LatLng
  radius?: number // in meters
  // Polygon geofence
  coordinates?: LatLng[]
  // Styling
  color?: string
  fillOpacity?: number
  strokeColor?: string
  strokeWeight?: number
}

interface GeofenceLayerProps {
  geofences: Geofence[]
  onGeofenceClick?: (geofence: Geofence) => void
}

export function useGeofenceLayer({ geofences, onGeofenceClick }: GeofenceLayerProps) {
  const { circles, polygons } = useMemo(() => {
    const circles: MapCircle[] = []
    const polygons: MapPolygon[] = []

    geofences
      .filter(g => g.active)
      .forEach((geofence) => {
        const defaultColor = geofence.color || '#3b82f6'
        const fillOpacity = geofence.fillOpacity || 0.15
        const strokeColor = geofence.strokeColor || defaultColor
        const strokeWeight = geofence.strokeWeight || 2

        if (geofence.type === 'circle' && geofence.center && geofence.radius) {
          circles.push({
            id: geofence.id,
            center: geofence.center,
            radius: geofence.radius,
            fillColor: defaultColor,
            fillOpacity,
            strokeColor,
            strokeWeight,
            onClick: () => onGeofenceClick?.(geofence),
          })
        } else if (geofence.type === 'polygon' && geofence.coordinates) {
          polygons.push({
            id: geofence.id,
            positions: geofence.coordinates,
            fillColor: defaultColor,
            fillOpacity,
            strokeColor,
            strokeWeight,
            onClick: () => onGeofenceClick?.(geofence),
          })
        }
      })

    return { circles, polygons }
  }, [geofences, onGeofenceClick])

  return { circles, polygons }
}

// Utility function to check if a point is inside a geofence
export function isPointInGeofence(point: LatLng, geofence: Geofence): boolean {
  if (geofence.type === 'circle' && geofence.center && geofence.radius) {
    return isPointInCircle(point, geofence.center, geofence.radius)
  } else if (geofence.type === 'polygon' && geofence.coordinates) {
    return isPointInPolygon(point, geofence.coordinates)
  }
  return false
}

// Haversine formula to calculate distance between two points
function getDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (point1.lat * Math.PI) / 180
  const φ2 = (point2.lat * Math.PI) / 180
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function isPointInCircle(point: LatLng, center: LatLng, radius: number): boolean {
  const distance = getDistance(point, center)
  return distance <= radius
}

// Ray casting algorithm for point in polygon
function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng
    const yi = polygon[i].lat
    const xj = polygon[j].lng
    const yj = polygon[j].lat

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }
  return inside
}
