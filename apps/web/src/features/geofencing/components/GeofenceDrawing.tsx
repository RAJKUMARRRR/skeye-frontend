import { useState } from 'react'
import { Card, Button, Input } from '@fleet/ui-web'
import { MapProvider, LatLng } from '../../../components/map'

type DrawMode = 'circle' | 'polygon' | null

interface GeofenceDrawingProps {
  onSave: (geofence: {
    name: string
    description?: string
    type: 'circle' | 'polygon'
    center?: LatLng
    radius?: number
    coordinates?: LatLng[]
    color: string
  }) => void
  onCancel: () => void
}

export function GeofenceDrawing({ onSave, onCancel }: GeofenceDrawingProps) {
  const [drawMode, setDrawMode] = useState<DrawMode>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [center, setCenter] = useState<LatLng>({ lat: 28.6139, lng: 77.2090 })
  const [radius, setRadius] = useState(1000)
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([])

  const handleMapClick = (latlng: LatLng) => {
    if (drawMode === 'polygon') {
      setPolygonPoints([...polygonPoints, latlng])
    } else if (drawMode === 'circle') {
      setCenter(latlng)
    }
  }

  const handleClearPoints = () => {
    setPolygonPoints([])
  }

  const handleUndoLastPoint = () => {
    setPolygonPoints(polygonPoints.slice(0, -1))
  }

  const handleSave = () => {
    if (!name) {
      alert('Please enter a geofence name')
      return
    }

    if (drawMode === 'circle') {
      onSave({
        name,
        description,
        type: 'circle',
        center,
        radius,
        color,
      })
    } else if (drawMode === 'polygon' && polygonPoints.length >= 3) {
      onSave({
        name,
        description,
        type: 'polygon',
        coordinates: polygonPoints,
        color,
      })
    } else {
      alert('Please complete drawing the geofence')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Drawing Tools */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Geofence Details</h3>

        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Downtown Area"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <label className="block text-sm font-medium mb-2">Draw Type</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={drawMode === 'circle' ? 'default' : 'outline'}
              onClick={() => setDrawMode('circle')}
            >
              🔵 Circle
            </Button>
            <Button
              variant={drawMode === 'polygon' ? 'default' : 'outline'}
              onClick={() => setDrawMode('polygon')}
            >
              ⬟ Polygon
            </Button>
          </div>
        </div>

        {drawMode === 'circle' && (
          <div>
            <label className="block text-sm font-medium mb-1">Radius (meters)</label>
            <Input
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              min="100"
              max="50000"
            />
          </div>
        )}

        {drawMode === 'polygon' && (
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Click on the map to add points. At least 3 points required.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Points added: {polygonPoints.length}
              </p>
            </div>
            {polygonPoints.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndoLastPoint}
                  className="flex-1"
                >
                  Undo Last
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPoints}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name || !drawMode}
            className="flex-1"
          >
            Save Geofence
          </Button>
        </div>
      </Card>

      {/* Map */}
      <Card className="md:col-span-2 h-[600px] overflow-hidden">
        <MapProvider
          center={center}
          zoom={12}
          onMapClick={handleMapClick}
          circles={
            drawMode === 'circle'
              ? [
                  {
                    id: 'preview',
                    center,
                    radius,
                    fillColor: color,
                    fillOpacity: 0.2,
                    strokeColor: color,
                    strokeWeight: 2,
                  },
                ]
              : []
          }
          polygons={
            drawMode === 'polygon' && polygonPoints.length >= 3
              ? [
                  {
                    id: 'preview',
                    positions: polygonPoints,
                    fillColor: color,
                    fillOpacity: 0.2,
                    strokeColor: color,
                    strokeWeight: 2,
                  },
                ]
              : []
          }
          markers={
            drawMode === 'polygon'
              ? polygonPoints.map((point, i) => ({
                  id: `point-${i}`,
                  position: point,
                  label: `${i + 1}`,
                }))
              : []
          }
        />
      </Card>
    </div>
  )
}
