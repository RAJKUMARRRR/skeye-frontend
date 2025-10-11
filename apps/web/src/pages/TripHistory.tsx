import { useState } from 'react'
import { useTrips } from '../hooks/useTrips'
import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input } from '@fleet/ui-web'

export function TripHistory() {
  const { data: trips, isLoading } = useTrips()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading trips...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trip History</h2>
          <p className="text-gray-600">View and analyze historical trips</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            placeholder="Search by vehicle or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From date"
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To date"
          />
          <Button>Search</Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips && trips.length > 0 ? (
              trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>{trip.vehicleId}</TableCell>
                  <TableCell>{trip.driverId || 'N/A'}</TableCell>
                  <TableCell>{new Date(trip.startTime).toLocaleString()}</TableCell>
                  <TableCell>{trip.endTime ? new Date(trip.endTime).toLocaleString() : 'In Progress'}</TableCell>
                  <TableCell>{trip.distance ? `${trip.distance.toFixed(2)} km` : 'N/A'}</TableCell>
                  <TableCell>{trip.duration ? `${Math.round(trip.duration / 60)} min` : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No trips found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
