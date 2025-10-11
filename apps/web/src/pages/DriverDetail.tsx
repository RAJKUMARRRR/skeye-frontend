import { useParams, useNavigate } from 'react-router-dom'
import { useDriver } from '../hooks/useDrivers'
import { Card, Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { DriverScorecard } from '../features/drivers/components/DriverScorecard'
import { BehaviorEventLog } from '../features/drivers/components/BehaviorEventLog'

export function DriverDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: driver, isLoading } = useDriver(id!)

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading driver...</div>
  }

  if (!driver) {
    return <div className="p-6 text-gray-600">Driver not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/drivers')}>
            ← Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold">{driver.name}</h2>
            <p className="text-gray-600">{driver.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate(`/drivers/${id}/edit`)}>
          Edit Driver
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="behavior">Behavior Events</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Driver Information</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-gray-600 text-sm">Phone</dt>
                <dd className="font-medium">{driver.phone}</dd>
              </div>
              <div>
                <dt className="text-gray-600 text-sm">License Number</dt>
                <dd className="font-medium">{driver.licenseNumber}</dd>
              </div>
              <div>
                <dt className="text-gray-600 text-sm">License Expiry</dt>
                <dd className="font-medium">{new Date(driver.licenseExpiry).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-gray-600 text-sm">Status</dt>
                <dd className="font-medium">{driver.status}</dd>
              </div>
            </dl>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <DriverScorecard driverId={id!} />
        </TabsContent>

        <TabsContent value="trips">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Trip History</h3>
            <p className="text-gray-600">Trip history will be displayed here</p>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <BehaviorEventLog driverId={id!} />
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Documents</h3>
            <p className="text-gray-600">Driver documents will be displayed here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
