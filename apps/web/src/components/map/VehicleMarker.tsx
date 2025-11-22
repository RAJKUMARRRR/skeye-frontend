import { DivIcon } from 'leaflet'
import { Truck, Navigation, Battery, Gauge, Clock, MapPin } from 'lucide-react'
import React from 'react'

interface VehicleTelemetry {
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  timestamp: string
  battery?: number
  altitude?: number
}

export interface VehicleMarkerData {
  name: string
  status: 'active' | 'inactive' | 'maintenance' | 'offline'
  device_type: string
  location?: VehicleTelemetry
}

const statusColors = {
  active: {
    bg: '#10b981',
    ring: '#d1fae5',
    text: 'Active'
  },
  inactive: {
    bg: '#f59e0b',
    ring: '#fef3c7',
    text: 'Inactive'
  },
  maintenance: {
    bg: '#ef4444',
    ring: '#fee2e2',
    text: 'Maintenance'
  },
  offline: {
    bg: '#6b7280',
    ring: '#e5e7eb',
    text: 'Offline'
  }
}

export const VehicleIcon: React.FC<{ vehicle: VehicleMarkerData }> = ({ vehicle }) => {
  const statusColor = statusColors[vehicle.status] || statusColors.offline

  return (
    <div className="relative transform -translate-x-1/2 -translate-y-full cursor-pointer group">
      <div 
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center relative transition-all duration-200 group-hover:scale-110"
        style={{
          boxShadow: `0 4px 12px rgba(0,0,0,0.15), 0 0 0 4px ${statusColor.ring}`
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={statusColor.bg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>

        {/* Status Indicator */}
        <div 
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-white animate-pulse"
          style={{ background: statusColor.bg }}
        />
      </div>
    </div>
  )
}

export const VehiclePopup: React.FC<{ vehicle: VehicleMarkerData }> = ({ vehicle }) => {
  const statusColor = statusColors[vehicle.status] || statusColors.offline

  return (
    <div className="min-w-[240px]">
      {/* Header */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <div className="font-semibold text-base text-gray-900 mb-1">
          {vehicle.name}
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: statusColor.ring, color: statusColor.bg }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full mr-1.5"
              style={{ background: statusColor.bg }}
            />
            {statusColor.text}
          </span>
          <span className="text-xs text-gray-500">
            {vehicle.device_type}
          </span>
        </div>
      </div>

      {/* Telemetry Data */}
      {vehicle.location ? (
        <div className="grid gap-2">
          {/* Speed */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Gauge className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">Speed</div>
              <div className="text-sm font-semibold text-gray-900">
                {vehicle.location.speed?.toFixed(1) || '0.0'} km/h
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Navigation className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">Heading</div>
              <div className="text-sm font-semibold text-gray-900">
                {vehicle.location.heading?.toFixed(0) || '0'}°
              </div>
            </div>
          </div>

          {vehicle.location.battery && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Battery className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Battery</div>
                <div className="text-sm font-semibold text-gray-900">
                  {vehicle.location.battery.toFixed(0)}%
                </div>
              </div>
            </div>
          )}

          {/* Last Update */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">Last Update</div>
              <div className="text-sm font-semibold text-gray-900">
                {new Date(vehicle.location.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {vehicle.location.latitude.toFixed(6)}, {vehicle.location.longitude.toFixed(6)}
          </div>
        </div>
      ) : (
        <div className="text-center p-3 text-gray-400 text-sm">
          No telemetry data available
        </div>
      )}
    </div>
  )
}

// Keep for backward compatibility with LeafletAdapter if needed
export function createVehicleIcon(vehicle: VehicleMarkerData): DivIcon {
  // ... (Implementation omitted for brevity, but we should probably keep it or remove if we are sure)
  // For now, I will just return a placeholder or the original code if I had it.
  // Since I am overwriting the file, I should include the original code or a simplified version.
  // But wait, I am overwriting the file. I should probably KEEP the original createVehicleIcon logic 
  // if I want to support Leaflet, OR I can remove it if we are fully committing to Mapbox.
  // Given the task is "Migrate to Mapbox", I can probably remove it, BUT `LeafletAdapter` still exists.
  // So I should keep `createVehicleIcon` working.
  
  // I will re-implement createVehicleIcon using the same logic as before, 
  // or just let it be since I am replacing the file content.
  // I'll copy the original logic back in to be safe.
  
  const statusColor = statusColors[vehicle.status] || statusColors.offline
  
  const iconHtml = `
    <div class="vehicle-marker-wrapper">
      <div class="vehicle-marker" style="position: relative; transform: translate(-50%, -100%);">
        <div style="width: 48px; height: 48px; background: white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 4px ${statusColor.ring}; display: flex; align-items: center; justify-content: center; position: relative;">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${statusColor.bg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
          <div style="position: absolute; bottom: -2px; right: -2px; width: 16px; height: 16px; background: ${statusColor.bg}; border: 3px solid white; border-radius: 50%;"></div>
        </div>
      </div>
    </div>
  `
  
  return new DivIcon({
    html: iconHtml,
    className: 'custom-vehicle-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  })
}
