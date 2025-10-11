import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { GeofenceManagement } from '../features/geofencing/components/GeofenceManagement'
import { GeofenceMap } from '../features/geofencing/components/GeofenceMap'

export function Geofencing() {
  const [activeTab, setActiveTab] = useState('map')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Geofencing</h2>
          <p className="text-gray-600">Monitor and manage geofenced areas</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="management">Geofence Management</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <GeofenceMap />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <GeofenceManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
