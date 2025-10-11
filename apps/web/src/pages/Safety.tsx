import { useState } from 'react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { Plus } from 'lucide-react'
import { IncidentReport } from '../features/safety/components/IncidentReport'
import { IncidentList } from '../features/safety/components/IncidentList'

export function Safety() {
  const [activeTab, setActiveTab] = useState('incidents')
  const [showReportForm, setShowReportForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Safety Management</h2>
          <p className="text-gray-600">Track and manage safety incidents</p>
        </div>
        <Button onClick={() => setShowReportForm(!showReportForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showReportForm ? 'View Incidents' : 'Report Incident'}
        </Button>
      </div>

      {showReportForm ? (
        <IncidentReport />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="incidents">Incident Reports</TabsTrigger>
            <TabsTrigger value="analytics">Safety Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-6">
            <IncidentList />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Placeholder for future safety analytics */}
            <div className="text-center py-12 text-muted-foreground">
              Safety analytics coming soon
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
