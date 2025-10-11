import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'
type MapProvider = 'google' | 'mapbox' | 'leaflet'

interface UIStore {
  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Map provider
  mapProvider: MapProvider
  setMapProvider: (provider: MapProvider) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      mapProvider: 'google',
      setMapProvider: (provider) => set({ mapProvider: provider }),
    }),
    {
      name: 'ui-store',
    }
  )
)
