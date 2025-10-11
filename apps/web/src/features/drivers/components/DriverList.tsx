import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@fleet/ui-web'
import { Search, Plus, Phone, Mail, MapPin } from 'lucide-react'

// Mock driver data
const mockDrivers = [
  {
    id: 'd1',
    name: 'John Smith',
    email: 'john.smith@fleet.com',
    phone: '+1 (555) 123-4567',
    licenseNumber: 'DL-12345678',
    licenseExpiry: '2025-08-15',
    status: 'active',
    rating: 4.8,
    totalTrips: 1245,
    totalDistance: 48500,
    assignedVehicle: 'Truck-001',
    joinDate: '2020-03-15',
    location: 'Chicago, IL',
    safetyScore: 87,
  },
  {
    id: 'd2',
    name: 'Sarah Johnson',
    email: 'sarah.j@fleet.com',
    phone: '+1 (555) 234-5678',
    licenseNumber: 'DL-23456789',
    licenseExpiry: '2026-02-20',
    status: 'active',
    rating: 4.9,
    totalTrips: 1120,
    totalDistance: 42800,
    assignedVehicle: 'Van-002',
    joinDate: '2020-06-10',
    location: 'Milwaukee, WI',
    safetyScore: 92,
  },
  {
    id: 'd3',
    name: 'Mike Davis',
    email: 'mike.davis@fleet.com',
    phone: '+1 (555) 345-6789',
    licenseNumber: 'DL-34567890',
    licenseExpiry: '2024-12-05',
    status: 'on-trip',
    rating: 4.5,
    totalTrips: 1380,
    totalDistance: 52300,
    assignedVehicle: 'Truck-003',
    joinDate: '2019-11-22',
    location: 'Madison, WI',
    safetyScore: 78,
  },
  {
    id: 'd4',
    name: 'Emily Brown',
    email: 'emily.brown@fleet.com',
    phone: '+1 (555) 456-7890',
    licenseNumber: 'DL-45678901',
    licenseExpiry: '2027-04-18',
    status: 'active',
    rating: 4.95,
    totalTrips: 980,
    totalDistance: 38200,
    assignedVehicle: 'Sedan-003',
    joinDate: '2021-02-08',
    location: 'Green Bay, WI',
    safetyScore: 95,
  },
  {
    id: 'd5',
    name: 'David Wilson',
    email: 'david.w@fleet.com',
    phone: '+1 (555) 567-8901',
    licenseNumber: 'DL-56789012',
    licenseExpiry: '2025-11-30',
    status: 'off-duty',
    rating: 4.7,
    totalTrips: 1050,
    totalDistance: 41200,
    assignedVehicle: 'Van-005',
    joinDate: '2020-09-14',
    location: 'Rockford, IL',
    safetyScore: 85,
  },
]

interface DriverListProps {
  onDriverSelect?: (driverId: string) => void
  onAddDriver?: () => void
}

export function DriverList({ onDriverSelect, onAddDriver }: DriverListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const filteredAndSortedDrivers = useMemo(() => {
    let filtered = mockDrivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'trips':
          return b.totalTrips - a.totalTrips
        case 'safety':
          return b.safetyScore - a.safetyScore
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, statusFilter, sortBy])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      active: { variant: 'secondary', label: 'Active' },
      'on-trip': { variant: 'default', label: 'On Trip' },
      'off-duty': { variant: 'default', label: 'Off Duty' },
      suspended: { variant: 'destructive', label: 'Suspended' },
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getSafetyScoreBadge = (score: number) => {
    if (score >= 90) return <Badge variant="secondary">{score}</Badge>
    if (score >= 80) return <Badge variant="default">{score}</Badge>
    return <Badge variant="destructive">{score}</Badge>
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const summary = useMemo(() => {
    return {
      total: mockDrivers.length,
      active: mockDrivers.filter((d) => d.status === 'active').length,
      onTrip: mockDrivers.filter((d) => d.status === 'on-trip').length,
      avgRating: (mockDrivers.reduce((sum, d) => sum + d.rating, 0) / mockDrivers.length).toFixed(1),
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.onTrip}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgRating} ★</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Driver Directory</CardTitle>
              <CardDescription>Manage and monitor your driver fleet</CardDescription>
            </div>
            <Button onClick={onAddDriver}>
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-trip">On Trip</SelectItem>
                <SelectItem value="off-duty">Off Duty</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="trips">Total Trips</SelectItem>
                <SelectItem value="safety">Safety Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Driver Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Assigned Vehicle</TableHead>
                  <TableHead className="text-right">Trips</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                  <TableHead className="text-right">Safety</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedDrivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No drivers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedDrivers.map((driver) => (
                    <TableRow key={driver.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                            {getInitials(driver.name)}
                          </div>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {driver.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                            {driver.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                            {driver.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{driver.licenseNumber}</div>
                          <div className="text-xs text-muted-foreground">
                            Exp: {driver.licenseExpiry}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{driver.assignedVehicle}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <div className="font-medium">{driver.totalTrips.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {driver.totalDistance.toLocaleString()} km
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">{driver.rating} ★</div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getSafetyScoreBadge(driver.safetyScore)}
                      </TableCell>
                      <TableCell>{getStatusBadge(driver.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDriverSelect?.(driver.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
