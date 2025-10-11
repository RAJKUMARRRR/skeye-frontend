import { TileLayer, LayersControl } from 'react-leaflet'

export type MapLayerType = 'satellite' | 'terrain' | 'traffic' | 'dark' | 'light'

interface MapLayer {
  id: MapLayerType
  name: string
  url: string
  attribution: string
  maxZoom?: number
}

export const MAP_LAYERS: MapLayer[] = [
  {
    id: 'light',
    name: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  },
  {
    id: 'terrain',
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
]

export function MapLayersControl() {
  return (
    <LayersControl position="topright">
      {MAP_LAYERS.map((layer, index) => (
        <LayersControl.BaseLayer
          key={layer.id}
          name={layer.name}
          checked={index === 0}
        >
          <TileLayer
            url={layer.url}
            attribution={layer.attribution}
            maxZoom={layer.maxZoom}
          />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  )
}

// Traffic layer overlay (requires Google Maps API or similar)
export function TrafficLayer() {
  // TODO: Implement traffic layer when traffic data source is available
  return null
}

// Custom overlay layer component
interface CustomOverlayProps {
  name: string
  url: string
  attribution?: string
  opacity?: number
  zIndex?: number
}

export function CustomOverlay({ name, url, attribution, opacity = 1, zIndex = 10 }: CustomOverlayProps) {
  return (
    <LayersControl.Overlay name={name}>
      <TileLayer
        url={url}
        attribution={attribution}
        opacity={opacity}
        zIndex={zIndex}
      />
    </LayersControl.Overlay>
  )
}
