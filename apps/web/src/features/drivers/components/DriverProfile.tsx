import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@fleet/ui-web'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Car,
  Clock,
  AlertTriangle,
  Edit,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Mock driver profile data
const mockDriver = {
  id: 'd1',
  name: 'John Smith',
  email: 'john.smith@fleet.com',
  phone: '+1 (555) 123-4567',
  licenseNumber: 'DL-12345678',
  licenseExpiry: '2025-08-15',
  licenseClass: 'Class A CDL',
  status: 'active',
  rating: 4.8,
  totalTrips: 1245,
  totalDistance: 48500,
  totalHours: 2850,
  assignedVehicle: 'Truck-001',
  joinDate: '2020-03-15',
  location: 'Chicago, IL',
  address: '123 Main Street, Chicago, IL 60601',
  emergencyContact: {
    name: 'Jane Smith',
    relation: 'Spouse',
    phone: '+1 (555) 123-4568',
  },
  certifications: [
    { name: 'Hazmat Certification', expiry: '2025-06-30', status: 'valid' },
    { name: 'Tanker Endorsement', expiry: '2025-08-15', status: 'valid' },
    { name: 'Doubles/Triples', expiry: '2024-12-31', status: 'expiring-soon' },
  ],
  safetyScore: 87,
  fuelEfficiency: 8.5,
  onTimePercentage: 95,
}

const monthlyPerformance = [
  { month: 'Jan', trips: 98, distance: 3850, safety: 85 },
  { month: 'Feb', trips: 105, distance: 4120, safety: 86 },
  { month: 'Mar', trips: 110, distance: 4280, safety: 87 },
  { month: 'Apr', trips: 102, distance: 3980, safety: 88 },
  { month: 'May', trips: 115, distance: 4450, safety: 87 },
  { month: 'Jun', trips: 108, distance: 4200, safety: 89 },
]

const recentTrips = [
  {
    id: 'T001',
    date: '2024-01-15',
    from: 'Chicago, IL',
    to: 'Milwaukee, WI',
    distance: 145,
    duration: 180,
    status: 'completed',
  },
  {
    id: 'T002',
    date: '2024-01-14',
    from: 'Milwaukee, WI',
    to: 'Madison, WI',
    distance: 128,
    duration: 165,
    status: 'completed',
  },
  {
    id: 'T003',
    date: '2024-01-13',
    from: 'Madison, WI',
    to: 'Green Bay, WI',
    distance: 185,
    duration: 210,
    status: 'completed',
  },
]

const violations = [
  {
    id: 'V001',
    date: '2024-01-10',
    type: 'Speeding',
    severity: 'medium',
    description: 'Exceeded speed limit by 12 mph',
    status: 'resolved',
  },
  {
    id: 'V002',
    date: '2023-12-15',
    type: 'Harsh Braking',
    severity: 'low',
    description: 'Sudden braking detected',
    status: 'resolved',
  },
]

interface DriverProfileProps {
  driverId?: string
  onEdit?: () => void
  onBack?: () => void
}

export function DriverProfile({ driverId, onEdit, onBack }: DriverProfileProps) {
  const [activeTab, setActiveTab] = useState('overview')

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

  const getCertificationBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      valid: { variant: 'secondary', label: 'Valid' },
      'expiring-soon': { variant: 'default', label: 'Expiring Soon' },
      expired: { variant: 'destructive', label: 'Expired' },
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl">
            {getInitials(mockDriver.name)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{mockDriver.name}</h2>
              {getStatusBadge(mockDriver.status)}
            </div>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {mockDriver.email}
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {mockDriver.phone}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {mockDriver.location}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDriver.totalTrips.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockDriver.totalDistance.toLocaleString()} km driven
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDriver.safetyScore}/100</div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Above average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDriver.rating} ★</div>
            <p className="text-xs text-muted-foreground mt-1">
              Customer feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDriver.onTimePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Delivery success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trips">Recent Trips</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-medium">{mockDriver.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{mockDriver.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{mockDriver.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right">{mockDriver.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Join Date</span>
                  <span className="font-medium">{mockDriver.joinDate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>License Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License Number</span>
                  <span className="font-medium">{mockDriver.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License Class</span>
                  <span className="font-medium">{mockDriver.licenseClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiry Date</span>
                  <span className="font-medium">{mockDriver.licenseExpiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Vehicle</span>
                  <Badge variant="outline">{mockDriver.assignedVehicle}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{mockDriver.emergencyContact.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relationship</span>
                <span className="font-medium">{mockDriver.emergencyContact.relation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{mockDriver.emergencyContact.phone}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Trend</CardTitle>
              <CardDescription>Trip volume and safety scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="trips" stroke="#0088FE" strokeWidth={2} name="Trips" />
                  <Line yAxisId="right" type="monotone" dataKey="safety" stroke="#22c55e" strokeWidth={2} name="Safety Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distance Traveled</CardTitle>
              <CardDescription>Monthly mileage breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="distance" fill="#3b82f6" name="Distance (km)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Trips Tab */}
        <TabsContent value="trips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trips</CardTitle>
              <CardDescription>Latest delivery history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trip ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead className="text-right">Distance</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTrips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">{trip.id}</TableCell>
                        <TableCell>{trip.date}</TableCell>
                        <TableCell>{trip.from}</TableCell>
                        <TableCell>{trip.to}</TableCell>
                        <TableCell className="text-right">{trip.distance} km</TableCell>
                        <TableCell className="text-right">{trip.duration} min</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety Violations</CardTitle>
              <CardDescription>Incident history and resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              {violations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No violations recorded
                </div>
              ) : (
                <div className="space-y-4">
                  {violations.map((violation) => (
                    <div key={violation.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{violation.type}</div>
                          <Badge variant={violation.severity === 'high' ? 'destructive' : 'default'}>
                            {violation.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {violation.description}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{violation.date}</span>
                          <Badge variant="secondary">{violation.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Endorsements</CardTitle>
              <CardDescription>Professional qualifications and licenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDriver.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Expires: {cert.expiry}
                        </div>
                      </div>
                    </div>
                    {getCertificationBadge(cert.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
