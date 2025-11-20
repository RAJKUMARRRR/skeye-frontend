export type MapProvider = 'leaflet' | 'google' | 'mapbox'

export interface LatLng {
  lat: number
  lng: number
}

export interface MapBounds {
  northEast: LatLng
  southWest: LatLng
}

export interface MapMarker {
  id: string
  position: LatLng
  icon?: any // Support Leaflet Icon/DivIcon or string URL
  label?: string
  onClick?: () => void
  data?: Record<string, unknown>
}

export interface MapPolyline {
  id: string
  positions: LatLng[]
  color?: string
  weight?: number
  opacity?: number
  onClick?: () => void
}

export interface MapPolygon {
  id: string
  positions: LatLng[]
  fillColor?: string
  fillOpacity?: number
  strokeColor?: string
  strokeWeight?: number
  onClick?: () => void
}

export interface MapCircle {
  id: string
  center: LatLng
  radius: number // in meters
  fillColor?: string
  fillOpacity?: number
  strokeColor?: string
  strokeWeight?: number
  onClick?: () => void
}

export interface MapViewport {
  center: LatLng
  zoom: number
}

export interface MapProps {
  center: LatLng
  zoom: number
  markers?: MapMarker[]
  polylines?: MapPolyline[]
  polygons?: MapPolygon[]
  circles?: MapCircle[]
  onViewportChange?: (viewport: MapViewport) => void
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (latlng: LatLng) => void
  className?: string
  minZoom?: number
  maxZoom?: number
}

export interface MapAdapter {
  name: MapProvider
  component: React.ComponentType<MapProps>
}
