import type { LatLng } from './distance'

export interface LatLngBounds {
  north: number
  south: number
  east: number
  west: number
}

/**
 * Calculate bounds that contain all given points
 * @param points Array of coordinates
 * @returns Bounding box
 */
export function calculateBounds(points: LatLng[]): LatLngBounds | null {
  if (points.length === 0) return null

  let north = -90
  let south = 90
  let east = -180
  let west = 180

  for (const point of points) {
    north = Math.max(north, point.lat)
    south = Math.min(south, point.lat)
    east = Math.max(east, point.lng)
    west = Math.min(west, point.lng)
  }

  return { north, south, east, west }
}

/**
 * Check if a point is within bounds
 * @param point Coordinate to check
 * @param bounds Bounding box
 * @returns True if point is within bounds
 */
export function isPointInBounds(point: LatLng, bounds: LatLngBounds): boolean {
  return (
    point.lat >= bounds.south &&
    point.lat <= bounds.north &&
    point.lng >= bounds.west &&
    point.lng <= bounds.east
  )
}

/**
 * Extend bounds to include a new point
 * @param bounds Current bounds
 * @param point Point to include
 * @returns Extended bounds
 */
export function extendBounds(bounds: LatLngBounds, point: LatLng): LatLngBounds {
  return {
    north: Math.max(bounds.north, point.lat),
    south: Math.min(bounds.south, point.lat),
    east: Math.max(bounds.east, point.lng),
    west: Math.min(bounds.west, point.lng),
  }
}
