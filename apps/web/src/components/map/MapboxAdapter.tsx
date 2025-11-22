import { useRef, useEffect, useMemo, useState } from 'react'
import Map, { Marker, Source, Layer, NavigationControl, MapRef, Popup } from 'react-map-gl'
import { AnimatedMarker } from './AnimatedMarker'
import type { MapProps, MapViewport } from './types'
import 'mapbox-gl/dist/mapbox-gl.css'

// Default public token if none provided (this is a placeholder, user needs to provide their own)
const DEFAULT_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export function MapboxAdapter({
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
  const mapRef = useRef<MapRef>(null)
  const [viewState, setViewState] = useState({
    longitude: center.lng,
    latitude: center.lat,
    zoom: zoom
  })
  const [popupInfo, setPopupInfo] = useState<any>(null)

  // Update view state when props change (controlled mode)
  useEffect(() => {
    setViewState({
      longitude: center.lng,
      latitude: center.lat,
      zoom: zoom
    })
  }, [center.lat, center.lng, zoom])

  const handleMove = (evt: any) => {
    setViewState(evt.viewState)
    if (onViewportChange) {
      onViewportChange({
        center: {
          lat: evt.viewState.latitude,
          lng: evt.viewState.longitude,
        },
        zoom: evt.viewState.zoom,
      })
    }
  }

  // Convert polylines to GeoJSON features
  const polylineFeatures = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: polylines.map(line => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: line.positions.map(p => [p.lng, p.lat])
        },
        properties: {
          id: line.id,
          color: line.color || '#3b82f6',
          width: line.weight || 3,
          opacity: line.opacity || 1
        }
      }))
    }
  }, [polylines])

  if (!DEFAULT_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 p-4 text-center">
        <div>
          <h3 className="font-bold mb-2">Mapbox Token Missing</h3>
          <p>Please add VITE_MAPBOX_TOKEN to your .env file</p>
        </div>
      </div>
    )
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={handleMove}
      onClick={(e) => {
        onMapClick?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        setPopupInfo(null) // Close popup on map click
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={DEFAULT_TOKEN}
      minZoom={minZoom}
      maxZoom={maxZoom}
    >
      <NavigationControl position="top-right" />

      {/* Markers */}
      {markers.map((marker) => {
        return (
          <AnimatedMarker
            key={marker.id}
            longitude={marker.position.lng}
            latitude={marker.position.lat}
            duration={2000} // 2 seconds animation for smooth movement
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              marker.onClick?.()
              onMarkerClick?.(marker)
              if (marker.popup) {
                setPopupInfo(marker)
              }
            }}
          >
            {marker.component ? (
              marker.component
            ) : (
              // Fallback for Leaflet DivIcon or default marker
              marker.icon && (marker.icon as any).options?.html ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: (marker.icon as any).options.html }}
                  className={(marker.icon as any).options.className}
                />
              ) : (
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow" />
              )
            )}
          </AnimatedMarker>
        )
      })}

      {/* Popup */}
      {popupInfo && (
        <Popup
          anchor="bottom"
          longitude={popupInfo.position.lng}
          latitude={popupInfo.position.lat}
          onClose={() => setPopupInfo(null)}
          offset={60} // Adjusted to clear the vehicle marker (48px + padding)
          closeButton={false}
          closeOnClick={false}
          className="custom-mapbox-popup"
        >
          {popupInfo.popup}
        </Popup>
      )}

      {/* Polylines */}
      {polylines.length > 0 && (
        <Source type="geojson" data={polylineFeatures as any}>
          <Layer
            id="polylines"
            type="line"
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': ['get', 'color'],
              'line-width': ['get', 'width'],
              'line-opacity': ['get', 'opacity']
            }}
          />
        </Source>
      )}
    </Map>
  )
}
