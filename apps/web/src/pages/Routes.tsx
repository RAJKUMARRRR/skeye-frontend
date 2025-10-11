import { useState } from 'react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { RouteOptimizer } from '../features/routes/components/RouteOptimizer'
import { RouteHistory } from '../features/routes/components/RouteHistory'
import { RouteMap } from '../features/routes/components/RouteMap'

export function Routes() {
  const [activeTab, setActiveTab] = useState('optimizer')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Routes</h2>
          <p className="text-gray-600">Optimize, track, and analyze delivery routes</p>
        </div>
        <Button>Create Route</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="optimizer">Route Optimizer</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="history">Route History</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer" className="space-y-6">
          <RouteOptimizer />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <RouteMap />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <RouteHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
