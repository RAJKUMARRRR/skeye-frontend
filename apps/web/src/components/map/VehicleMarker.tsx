import { DivIcon } from 'leaflet'
import { renderToString } from 'react-dom/server'
import { Truck, Navigation, Battery, Gauge, Clock, MapPin } from 'lucide-react'

interface VehicleTelemetry {
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  timestamp: string
  battery?: number
  altitude?: number
}

interface VehicleMarkerData {
  name: string
  status: 'active' | 'inactive' | 'maintenance' | 'offline'
  device_type: string
  location?: VehicleTelemetry
}

export function createVehicleIcon(vehicle: VehicleMarkerData): DivIcon {
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

  const statusColor = statusColors[vehicle.status] || statusColors.offline

  // Create icon HTML
  const iconHtml = `
    <div class="vehicle-marker-wrapper">
      <div class="vehicle-marker" style="
        position: relative;
        transform: translate(-50%, -100%);
      ">
        <!-- Vehicle Icon -->
        <div style="
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 4px ${statusColor.ring};
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.2s ease;
          cursor: pointer;
        " class="vehicle-icon-container">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${statusColor.bg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>

          <!-- Status Indicator -->
          <div style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 16px;
            height: 16px;
            background: ${statusColor.bg};
            border: 3px solid white;
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
        </div>

        <!-- Hover Tooltip -->
        <div class="vehicle-tooltip" style="
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 12px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 16px;
          min-width: 280px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 1000;
        ">
          <!-- Arrow -->
          <div style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid white;
          "></div>

          <!-- Header -->
          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; font-size: 16px; color: #111827; margin-bottom: 4px;">
              ${vehicle.name}
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="
                display: inline-flex;
                align-items: center;
                padding: 2px 8px;
                background: ${statusColor.ring};
                color: ${statusColor.bg};
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                <span style="
                  width: 6px;
                  height: 6px;
                  background: ${statusColor.bg};
                  border-radius: 50%;
                  margin-right: 6px;
                "></span>
                ${statusColor.text}
              </span>
              <span style="font-size: 12px; color: #6b7280;">
                ${vehicle.device_type}
              </span>
            </div>
          </div>

          <!-- Telemetry Data -->
          ${vehicle.location ? `
            <div style="display: grid; gap: 8px;">
              <!-- Speed -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="
                  width: 32px;
                  height: 32px;
                  background: #eff6ff;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                    <path d="M4 12a8 8 0 0 1 16 0"/>
                    <path d="M12 12v6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 12px; color: #6b7280;">Speed</div>
                  <div style="font-size: 14px; font-weight: 600; color: #111827;">
                    ${vehicle.location.speed?.toFixed(1) || '0.0'} km/h
                  </div>
                </div>
              </div>

              <!-- Heading -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="
                  width: 32px;
                  height: 32px;
                  background: #f0fdf4;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 12px; color: #6b7280;">Heading</div>
                  <div style="font-size: 14px; font-weight: 600; color: #111827;">
                    ${vehicle.location.heading?.toFixed(0) || '0'}°
                  </div>
                </div>
              </div>

              ${vehicle.location.battery ? `
                <!-- Battery -->
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="
                    width: 32px;
                    height: 32px;
                    background: #fef3c7;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                      <rect x="2" y="7" width="16" height="10" rx="2" ry="2"/>
                      <line x1="22" y1="11" x2="22" y2="13"/>
                    </svg>
                  </div>
                  <div style="flex: 1;">
                    <div style="font-size: 12px; color: #6b7280;">Battery</div>
                    <div style="font-size: 14px; font-weight: 600; color: #111827;">
                      ${vehicle.location.battery.toFixed(0)}%
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Last Update -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="
                  width: 32px;
                  height: 32px;
                  background: #f3f4f6;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 12px; color: #6b7280;">Last Update</div>
                  <div style="font-size: 14px; font-weight: 600; color: #111827;">
                    ${new Date(vehicle.location.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <!-- Coordinates -->
              <div style="
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
              ">
                📍 ${vehicle.location.latitude.toFixed(6)}, ${vehicle.location.longitude.toFixed(6)}
              </div>
            </div>
          ` : `
            <div style="
              text-align: center;
              padding: 12px;
              color: #9ca3af;
              font-size: 14px;
            ">
              No telemetry data available
            </div>
          `}
        </div>
      </div>
    </div>

    <style>
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .vehicle-marker-wrapper:hover .vehicle-icon-container {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 0 0 4px ${statusColor.ring};
      }

      .vehicle-marker-wrapper:hover .vehicle-tooltip {
        opacity: 1;
        pointer-events: auto;
      }
    </style>
  `

  return new DivIcon({
    html: iconHtml,
    className: 'custom-vehicle-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  })
}
