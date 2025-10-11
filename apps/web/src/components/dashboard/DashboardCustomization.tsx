import { useState } from 'react'
import { useDashboardStore, WidgetType } from '../../stores/dashboardStore'
import { Button, Card } from '@fleet/ui-web'

const AVAILABLE_WIDGETS: Array<{ type: WidgetType; label: string; category: string }> = [
  { type: 'kpi_total_vehicles', label: 'Total Vehicles KPI', category: 'KPIs' },
  { type: 'kpi_active_trips', label: 'Active Trips KPI', category: 'KPIs' },
  { type: 'kpi_total_alerts', label: 'Total Alerts KPI', category: 'KPIs' },
  { type: 'kpi_distance_today', label: 'Distance Today KPI', category: 'KPIs' },
  { type: 'kpi_fuel_consumed', label: 'Fuel Consumed KPI', category: 'KPIs' },
  { type: 'fleet_status', label: 'Fleet Status Overview', category: 'Status' },
  { type: 'vehicle_utilization_chart', label: 'Vehicle Utilization Chart', category: 'Charts' },
  { type: 'alerts_chart', label: 'Alerts Chart', category: 'Charts' },
  { type: 'trips_chart', label: 'Trips Chart', category: 'Charts' },
  { type: 'fuel_consumption_chart', label: 'Fuel Consumption Chart', category: 'Charts' },
  { type: 'maintenance_chart', label: 'Maintenance Chart', category: 'Charts' },
  { type: 'driver_performance_chart', label: 'Driver Performance Chart', category: 'Charts' },
  { type: 'recent_alerts_list', label: 'Recent Alerts List', category: 'Lists' },
  { type: 'recent_trips_list', label: 'Recent Trips List', category: 'Lists' },
]

interface DashboardCustomizationProps {
  onClose: () => void
}

export function DashboardCustomization({ onClose }: DashboardCustomizationProps) {
  const { layouts, currentLayoutId, addWidget, toggleWidgetVisibility } = useDashboardStore()
  const currentLayout = layouts.find(l => l.id === currentLayoutId)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(AVAILABLE_WIDGETS.map(w => w.category)))]

  const filteredWidgets =
    selectedCategory === 'All'
      ? AVAILABLE_WIDGETS
      : AVAILABLE_WIDGETS.filter(w => w.category === selectedCategory)

  const handleAddWidget = (widgetType: WidgetType) => {
    if (!currentLayout) return

    const existingWidget = currentLayout.widgets.find(w => w.type === widgetType)
    if (existingWidget) {
      // If widget exists, make it visible
      toggleWidgetVisibility(currentLayoutId, existingWidget.id)
    } else {
      // Add new widget
      const newWidget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
        position: { x: 0, y: currentLayout.widgets.length },
        size: { width: 6, height: 2 },
        visible: true,
      }
      addWidget(currentLayoutId, newWidget)
    }
  }

  const isWidgetActive = (widgetType: WidgetType) => {
    return currentLayout?.widgets.some(w => w.type === widgetType && w.visible)
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customize Dashboard</h2>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map(category => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Current Layout Widgets */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Active Widgets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentLayout?.widgets
            .filter(w => w.visible)
            .map(widget => {
              const widgetInfo = AVAILABLE_WIDGETS.find(w => w.type === widget.type)
              return (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-green-50"
                >
                  <span className="font-medium">{widgetInfo?.label || widget.type}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleWidgetVisibility(currentLayoutId, widget.id)}
                  >
                    Hide
                  </Button>
                </div>
              )
            })}
        </div>
      </div>

      {/* Available Widgets */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Available Widgets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredWidgets.map(widget => {
            const isActive = isWidgetActive(widget.type)
            return (
              <div
                key={widget.type}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  isActive
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-medium">{widget.label}</div>
                  <div className="text-xs text-gray-500">{widget.category}</div>
                </div>
                <Button
                  size="sm"
                  variant={isActive ? 'outline' : 'default'}
                  onClick={() => handleAddWidget(widget.type)}
                >
                  {isActive ? 'Active' : 'Add'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
