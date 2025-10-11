import { create } from 'zustand'

type VehicleStatus = 'active' | 'idle' | 'parked' | 'maintenance' | 'offline'
type DateRange = { start: Date | null; end: Date | null }

interface FilterStore {
  // Vehicle filters
  vehicleStatus: VehicleStatus[]
  setVehicleStatus: (status: VehicleStatus[]) => void

  vehicleSearch: string
  setVehicleSearch: (search: string) => void

  // Driver filters
  driverSearch: string
  setDriverSearch: (search: string) => void

  // Date range filters
  dateRange: DateRange
  setDateRange: (range: DateRange) => void

  // Reset filters
  resetFilters: () => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  vehicleStatus: [],
  setVehicleStatus: (status) => set({ vehicleStatus: status }),

  vehicleSearch: '',
  setVehicleSearch: (search) => set({ vehicleSearch: search }),

  driverSearch: '',
  setDriverSearch: (search) => set({ driverSearch: search }),

  dateRange: { start: null, end: null },
  setDateRange: (range) => set({ dateRange: range }),

  resetFilters: () =>
    set({
      vehicleStatus: [],
      vehicleSearch: '',
      driverSearch: '',
      dateRange: { start: null, end: null },
    }),
}))
