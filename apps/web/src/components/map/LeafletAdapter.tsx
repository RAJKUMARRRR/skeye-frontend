import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, useMap } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import type { MapProps, MapViewport } from './types'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue in Leaflet
// Use CDN URLs instead of importing images
if (Icon.Default.prototype._getIconUrl) {
  delete (Icon.Default.prototype as any)._getIconUrl
}

Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Component to handle viewport changes and map clicks
function ViewportHandler({ center, zoom, onViewportChange, onMapClick }: {
  center: LatLngExpression
  zoom: number
  onViewportChange?: (viewport: MapViewport) => void
  onMapClick?: (latlng: { lat: number; lng: number }) => void
}) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  useEffect(() => {
    if (!onViewportChange) return

    const handleMoveEnd = () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      onViewportChange({
        center: { lat: center.lat, lng: center.lng },
        zoom,
      })
    }

    map.on('moveend', handleMoveEnd)
    map.on('zoomend', handleMoveEnd)

    return () => {
      map.off('moveend', handleMoveEnd)
      map.off('zoomend', handleMoveEnd)
    }
  }, [map, onViewportChange])

  useEffect(() => {
    if (!onMapClick) return

    const handleClick = (e: any) => {
      onMapClick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    }

    map.on('click', handleClick)

    return () => {
      map.off('click', handleClick)
    }
  }, [map, onMapClick])

  return null
}

export function LeafletAdapter({
  center,
  zoom,
  markers = [],
  polylines = [],
  polygons = [],
  circles = [],
  onViewportChange,
  onMarkerClick,
  onMapClick,
  className,
  minZoom = 3,
  maxZoom = 18,
}: MapProps) {
  const centerLatLng: LatLngExpression = [center.lat, center.lng]

  return (
    <MapContainer
      center={centerLatLng}
      zoom={zoom}
      className={className}
      minZoom={minZoom}
      maxZoom={maxZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ViewportHandler
        center={centerLatLng}
        zoom={zoom}
        onViewportChange={onViewportChange}
        onMapClick={onMapClick}
      />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.position.lat, marker.position.lng]}
          eventHandlers={{
            click: () => {
              marker.onClick?.()
              onMarkerClick?.(marker)
            },
          }}
        >
          {marker.label && (
            <Popup>{marker.label}</Popup>
          )}
        </Marker>
      ))}

      {polylines.map((polyline) => (
        <Polyline
          key={polyline.id}
          positions={polyline.positions.map(pos => [pos.lat, pos.lng])}
          pathOptions={{
            color: polyline.color || '#3b82f6',
            weight: polyline.weight || 3,
            opacity: polyline.opacity || 1,
          }}
          eventHandlers={{
            click: () => polyline.onClick?.(),
          }}
        />
      ))}

      {polygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.positions.map(pos => [pos.lat, pos.lng])}
          pathOptions={{
            fillColor: polygon.fillColor || '#3b82f6',
            fillOpacity: polygon.fillOpacity || 0.2,
            color: polygon.strokeColor || '#3b82f6',
            weight: polygon.strokeWeight || 2,
          }}
          eventHandlers={{
            click: () => polygon.onClick?.(),
          }}
        />
      ))}

      {circles.map((circle) => (
        <Circle
          key={circle.id}
          center={[circle.center.lat, circle.center.lng]}
          radius={circle.radius}
          pathOptions={{
            fillColor: circle.fillColor || '#3b82f6',
            fillOpacity: circle.fillOpacity || 0.2,
            color: circle.strokeColor || '#3b82f6',
            weight: circle.strokeWeight || 2,
          }}
          eventHandlers={{
            click: () => circle.onClick?.(),
          }}
        />
      ))}
    </MapContainer>
  )
}
