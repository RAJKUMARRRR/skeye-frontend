import type { LatLng } from './distance'

export interface ClusterPoint extends LatLng {
  id: string
  properties?: Record<string, unknown>
}

export interface Cluster {
  id: string
  lat: number
  lng: number
  points: ClusterPoint[]
  count: number
}

export interface ClusterOptions {
  radius: number // Clustering radius in pixels
  maxZoom: number // Maximum zoom level for clustering
  minZoom: number // Minimum zoom level for clustering
  minPoints: number // Minimum points to form a cluster
}

const defaultOptions: ClusterOptions = {
  radius: 60,
  maxZoom: 16,
  minZoom: 0,
  minPoints: 2,
}

/**
 * Simple grid-based clustering algorithm
 * For production use, consider using supercluster library
 * @param points Array of points to cluster
 * @param zoom Current zoom level
 * @param options Clustering options
 * @returns Array of clusters and unclustered points
 */
export function clusterPoints(
  points: ClusterPoint[],
  zoom: number,
  options: Partial<ClusterOptions> = {}
): Array<Cluster | ClusterPoint> {
  const opts = { ...defaultOptions, ...options }

  // Don't cluster if zoom is too high
  if (zoom > opts.maxZoom) {
    return points
  }

  const clusters: Cluster[] = []
  const processed = new Set<string>()

  for (let i = 0; i < points.length; i++) {
    const point = points[i]!
    if (processed.has(point.id)) continue

    const nearby: ClusterPoint[] = [point]
    processed.add(point.id)

    // Find nearby points (simple distance-based)
    for (let j = i + 1; j < points.length; j++) {
      const other = points[j]!
      if (processed.has(other.id)) continue

      // Simplified distance check (not accounting for pixel radius)
      const distance = Math.sqrt(
        Math.pow(point.lat - other.lat, 2) + Math.pow(point.lng - other.lng, 2)
      )

      if (distance < opts.radius / 100000) {
        // Rough approximation
        nearby.push(other)
        processed.add(other.id)
      }
    }

    if (nearby.length >= opts.minPoints) {
      // Create cluster
      const avgLat = nearby.reduce((sum, p) => sum + p.lat, 0) / nearby.length
      const avgLng = nearby.reduce((sum, p) => sum + p.lng, 0) / nearby.length

      clusters.push({
        id: `cluster-${i}`,
        lat: avgLat,
        lng: avgLng,
        points: nearby,
        count: nearby.length,
      })
    } else {
      // Return as individual points
      nearby.forEach(p => clusters.push(p as unknown as Cluster))
    }
  }

  return clusters
}

/**
 * Check if a result is a cluster
 * @param item Cluster or point
 * @returns True if item is a cluster
 */
export function isCluster(item: Cluster | ClusterPoint): item is Cluster {
  return 'count' in item && 'points' in item
}
