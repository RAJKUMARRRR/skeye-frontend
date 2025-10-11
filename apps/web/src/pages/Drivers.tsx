import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { DriverList } from '../features/drivers/components/DriverList'
import { DriverProfile } from '../features/drivers/components/DriverProfile'
import { DriverForm } from '../features/drivers/components/DriverForm'
import { DriverPerformance } from '../features/drivers/components/DriverPerformance'
import { DriverSchedule } from '../features/drivers/components/DriverSchedule'

export function Drivers() {
  const [view, setView] = useState<'list' | 'profile' | 'form'>('list')
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('list')

  const handleDriverSelect = (driverId: string) => {
    setSelectedDriverId(driverId)
    setView('profile')
  }

  const handleAddDriver = () => {
    setSelectedDriverId(null)
    setView('form')
  }

  const handleEditDriver = () => {
    setView('form')
  }

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data)
    setView('list')
  }

  const handleFormCancel = () => {
    setView('list')
    setSelectedDriverId(null)
  }

  const handleBackToList = () => {
    setView('list')
    setSelectedDriverId(null)
  }

  if (view === 'profile' && selectedDriverId) {
    return (
      <div className="p-6">
        <DriverProfile
          driverId={selectedDriverId}
          onEdit={handleEditDriver}
          onBack={handleBackToList}
        />
      </div>
    )
  }

  if (view === 'form') {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">
          {selectedDriverId ? 'Edit Driver' : 'Add New Driver'}
        </h2>
        <DriverForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Drivers</h1>
        <p className="text-muted-foreground">Manage your fleet drivers and schedules</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Driver Directory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <DriverList
            onDriverSelect={handleDriverSelect}
            onAddDriver={handleAddDriver}
          />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <DriverPerformance />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <DriverSchedule />
        </TabsContent>
      </Tabs>
    </div>
  )
}
