import { useMemo } from 'react'
import Supercluster from 'supercluster'
import type { MapMarker, MapBounds } from '../components/map/types'

export interface ClusterPoint {
  type: 'Feature'
  properties: {
    cluster?: boolean
    point_count?: number
    point_count_abbreviated?: string
    marker?: MapMarker
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

interface UseMapClusteringProps {
  markers: MapMarker[]
  bounds?: MapBounds
  zoom: number
  options?: {
    radius?: number
    maxZoom?: number
    minZoom?: number
    minPoints?: number
  }
}

export function useMapClustering({
  markers,
  bounds,
  zoom,
  options = {},
}: UseMapClusteringProps) {
  const {
    radius = 60,
    maxZoom = 16,
    minZoom = 0,
    minPoints = 2,
  } = options

  // Initialize supercluster
  const supercluster = useMemo(() => {
    const cluster = new Supercluster<MapMarker>({
      radius,
      maxZoom,
      minZoom,
      minPoints,
    })

    // Convert markers to GeoJSON points
    const points: ClusterPoint[] = markers.map((marker) => ({
      type: 'Feature',
      properties: {
        marker,
      },
      geometry: {
        type: 'Point',
        coordinates: [marker.position.lng, marker.position.lat],
      },
    }))

    cluster.load(points)
    return cluster
  }, [markers, radius, maxZoom, minZoom, minPoints])

  // Get clusters for current bounds and zoom
  const clusters = useMemo(() => {
    if (!bounds) {
      return []
    }

    return supercluster.getClusters(
      [bounds.southWest.lng, bounds.southWest.lat, bounds.northEast.lng, bounds.northEast.lat],
      Math.floor(zoom)
    )
  }, [supercluster, bounds, zoom])

  // Get cluster leaves (individual markers in a cluster)
  const getClusterLeaves = (clusterId: number, limit = 100, offset = 0) => {
    return supercluster.getLeaves(clusterId, limit, offset)
  }

  // Get cluster expansion zoom (zoom level to separate cluster)
  const getClusterExpansionZoom = (clusterId: number) => {
    return supercluster.getClusterExpansionZoom(clusterId)
  }

  return {
    clusters,
    getClusterLeaves,
    getClusterExpansionZoom,
  }
}
