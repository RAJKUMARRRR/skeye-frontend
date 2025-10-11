import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WidgetType =
  | 'kpi_total_vehicles'
  | 'kpi_active_trips'
  | 'kpi_total_alerts'
  | 'kpi_distance_today'
  | 'kpi_fuel_consumed'
  | 'fleet_status'
  | 'vehicle_utilization_chart'
  | 'alerts_chart'
  | 'trips_chart'
  | 'fuel_consumption_chart'
  | 'maintenance_chart'
  | 'driver_performance_chart'
  | 'recent_alerts_list'
  | 'recent_trips_list'

export interface DashboardWidget {
  id: string
  type: WidgetType
  position: { x: number; y: number }
  size: { width: number; height: number }
  visible: boolean
}

export interface DashboardLayout {
  id: string
  name: string
  widgets: DashboardWidget[]
}

interface DateRange {
  from: Date
  to: Date
}

interface DashboardStore {
  // Layouts
  layouts: DashboardLayout[]
  currentLayoutId: string

  // Date range filter
  dateRange: DateRange

  // Auto-refresh
  autoRefresh: boolean
  refreshInterval: number // in seconds

  // Comparison mode
  comparisonMode: boolean
  comparisonDateRange?: DateRange

  // Actions
  setCurrentLayout: (layoutId: string) => void
  addLayout: (layout: DashboardLayout) => void
  updateLayout: (layoutId: string, updates: Partial<DashboardLayout>) => void
  deleteLayout: (layoutId: string) => void

  updateWidget: (layoutId: string, widgetId: string, updates: Partial<DashboardWidget>) => void
  addWidget: (layoutId: string, widget: DashboardWidget) => void
  removeWidget: (layoutId: string, widgetId: string) => void
  toggleWidgetVisibility: (layoutId: string, widgetId: string) => void

  setDateRange: (dateRange: DateRange) => void
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void

  toggleComparisonMode: () => void
  setComparisonDateRange: (dateRange: DateRange | undefined) => void
}

const defaultLayout: DashboardLayout = {
  id: 'default',
  name: 'Default Dashboard',
  widgets: [
    {
      id: 'kpi-1',
      type: 'kpi_total_vehicles',
      position: { x: 0, y: 0 },
      size: { width: 3, height: 1 },
      visible: true,
    },
    {
      id: 'kpi-2',
      type: 'kpi_active_trips',
      position: { x: 3, y: 0 },
      size: { width: 3, height: 1 },
      visible: true,
    },
    {
      id: 'kpi-3',
      type: 'kpi_total_alerts',
      position: { x: 6, y: 0 },
      size: { width: 3, height: 1 },
      visible: true,
    },
    {
      id: 'kpi-4',
      type: 'kpi_distance_today',
      position: { x: 9, y: 0 },
      size: { width: 3, height: 1 },
      visible: true,
    },
    {
      id: 'fleet-status',
      type: 'fleet_status',
      position: { x: 0, y: 1 },
      size: { width: 12, height: 1 },
      visible: true,
    },
    {
      id: 'utilization-chart',
      type: 'vehicle_utilization_chart',
      position: { x: 0, y: 2 },
      size: { width: 6, height: 2 },
      visible: true,
    },
    {
      id: 'alerts-list',
      type: 'recent_alerts_list',
      position: { x: 6, y: 2 },
      size: { width: 6, height: 2 },
      visible: true,
    },
  ],
}

const today = new Date()
today.setHours(0, 0, 0, 0)
const endOfDay = new Date()
endOfDay.setHours(23, 59, 59, 999)

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      layouts: [defaultLayout],
      currentLayoutId: 'default',
      dateRange: { from: today, to: endOfDay },
      autoRefresh: false,
      refreshInterval: 30,
      comparisonMode: false,
      comparisonDateRange: undefined,

      setCurrentLayout: (layoutId) => set({ currentLayoutId: layoutId }),

      addLayout: (layout) =>
        set((state) => ({
          layouts: [...state.layouts, layout],
        })),

      updateLayout: (layoutId, updates) =>
        set((state) => ({
          layouts: state.layouts.map((layout) =>
            layout.id === layoutId ? { ...layout, ...updates } : layout
          ),
        })),

      deleteLayout: (layoutId) =>
        set((state) => ({
          layouts: state.layouts.filter((layout) => layout.id !== layoutId),
          currentLayoutId:
            state.currentLayoutId === layoutId ? 'default' : state.currentLayoutId,
        })),

      updateWidget: (layoutId, widgetId, updates) =>
        set((state) => ({
          layouts: state.layouts.map((layout) =>
            layout.id === layoutId
              ? {
                  ...layout,
                  widgets: layout.widgets.map((widget) =>
                    widget.id === widgetId ? { ...widget, ...updates } : widget
                  ),
                }
              : layout
          ),
        })),

      addWidget: (layoutId, widget) =>
        set((state) => ({
          layouts: state.layouts.map((layout) =>
            layout.id === layoutId
              ? { ...layout, widgets: [...layout.widgets, widget] }
              : layout
          ),
        })),

      removeWidget: (layoutId, widgetId) =>
        set((state) => ({
          layouts: state.layouts.map((layout) =>
            layout.id === layoutId
              ? {
                  ...layout,
                  widgets: layout.widgets.filter((widget) => widget.id !== widgetId),
                }
              : layout
          ),
        })),

      toggleWidgetVisibility: (layoutId, widgetId) =>
        set((state) => ({
          layouts: state.layouts.map((layout) =>
            layout.id === layoutId
              ? {
                  ...layout,
                  widgets: layout.widgets.map((widget) =>
                    widget.id === widgetId
                      ? { ...widget, visible: !widget.visible }
                      : widget
                  ),
                }
              : layout
          ),
        })),

      setDateRange: (dateRange) => set({ dateRange }),

      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

      setRefreshInterval: (interval) => set({ refreshInterval: interval }),

      toggleComparisonMode: () =>
        set((state) => ({ comparisonMode: !state.comparisonMode })),

      setComparisonDateRange: (dateRange) => set({ comparisonDateRange: dateRange }),
    }),
    {
      name: 'dashboard-storage',
    }
  )
)
