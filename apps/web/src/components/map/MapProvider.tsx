import { LeafletAdapter } from './LeafletAdapter'
import { useUIStore } from '../../stores/uiStore'
import type { MapProps, MapAdapter } from './types'

// TODO: Implement GoogleMapAdapter when Google Maps API is configured
// TODO: Implement MapboxAdapter when Mapbox token is configured

const adapters: Record<string, MapAdapter> = {
  leaflet: {
    name: 'leaflet',
    component: LeafletAdapter,
  },
  // google: {
  //   name: 'google',
  //   component: GoogleMapAdapter,
  // },
  // mapbox: {
  //   name: 'mapbox',
  //   component: MapboxAdapter,
  // },
}

export function MapProvider(props: MapProps) {
  const { mapProvider } = useUIStore()

  const adapter = adapters[mapProvider]

  if (!adapter) {
    console.warn(`Map provider "${mapProvider}" not found, falling back to leaflet`)
    const fallback = adapters.leaflet
    const MapComponent = fallback.component
    return <MapComponent {...props} />
  }

  const MapComponent = adapter.component
  return <MapComponent {...props} />
}

// Re-export types for convenience
export type { MapProps, MapMarker, MapPolyline, MapPolygon, MapCircle, LatLng, MapViewport } from './types'
