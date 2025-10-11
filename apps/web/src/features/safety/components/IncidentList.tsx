import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@fleet/ui-web'
import {
  AlertTriangle,
  Search,
  Eye,
  FileText,
  TrendingDown,
  AlertCircle,
  Clock,
} from 'lucide-react'

const mockIncidents = [
  {
    id: 'inc001',
    title: 'Minor Collision at Intersection',
    type: 'accident',
    severity: 'medium',
    date: '2025-10-09',
    time: '14:30',
    location: 'Main St & Oak Ave, Chicago',
    vehicle: 'Truck-001',
    driver: 'John Smith',
    status: 'under_review',
    estimatedCost: 2500,
    injuries: false,
    policeReport: true,
    description: 'Minor rear-end collision at intersection. Both vehicles sustained minor damage.',
  },
  {
    id: 'inc002',
    title: 'Near Miss - Pedestrian',
    type: 'near_miss',
    severity: 'high',
    date: '2025-10-08',
    time: '09:15',
    location: 'Downtown Milwaukee',
    vehicle: 'Van-002',
    driver: 'Sarah Johnson',
    status: 'resolved',
    estimatedCost: 0,
    injuries: false,
    policeReport: false,
    description: 'Pedestrian stepped into crosswalk unexpectedly. Driver took evasive action.',
  },
  {
    id: 'inc003',
    title: 'Vehicle Damage - Parking Lot',
    type: 'vehicle_damage',
    severity: 'low',
    date: '2025-10-07',
    time: '11:45',
    location: 'Customer Site A, Rockford',
    vehicle: 'Truck-003',
    driver: 'Mike Davis',
    status: 'closed',
    estimatedCost: 800,
    injuries: false,
    policeReport: false,
    description: 'Scraped side mirror while maneuvering in tight parking lot.',
  },
  {
    id: 'inc004',
    title: 'Critical Accident - Highway',
    type: 'accident',
    severity: 'critical',
    date: '2025-10-06',
    time: '16:20',
    location: 'I-90 Exit 52',
    vehicle: 'Van-004',
    driver: 'Emily Brown',
    status: 'under_investigation',
    estimatedCost: 15000,
    injuries: true,
    policeReport: true,
    description: 'Multi-vehicle accident on highway. Driver sustained minor injuries. Vehicle totaled.',
  },
  {
    id: 'inc005',
    title: 'Speed Violation',
    type: 'violation',
    severity: 'low',
    date: '2025-10-05',
    time: '13:10',
    location: 'Highway 41, Green Bay',
    vehicle: 'Truck-005',
    driver: 'David Wilson',
    status: 'resolved',
    estimatedCost: 150,
    injuries: false,
    policeReport: false,
    description: 'Driver cited for exceeding speed limit by 15 mph.',
  },
]

export function IncidentList() {
  const [incidents, setIncidents] = useState(mockIncidents)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIncident, setSelectedIncident] = useState<typeof mockIncidents[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || incident.type === typeFilter
      const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter
      const matchesStatus = statusFilter === 'all' || incident.status === statusFilter

      return matchesSearch && matchesType && matchesSeverity && matchesStatus
    })
  }, [incidents, searchTerm, typeFilter, severityFilter, statusFilter])

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      low: { className: 'bg-green-100 text-green-800', label: 'Low' },
      medium: { className: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      high: { className: 'bg-orange-100 text-orange-800', label: 'High' },
      critical: { className: 'bg-red-100 text-red-800', label: 'Critical' },
    }
    const config = variants[severity] || variants.low
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      under_review: { className: 'bg-blue-100 text-blue-800', label: 'Under Review' },
      under_investigation: { className: 'bg-purple-100 text-purple-800', label: 'Investigating' },
      resolved: { className: 'bg-green-100 text-green-800', label: 'Resolved' },
      closed: { className: 'bg-gray-100 text-gray-800', label: 'Closed' },
    }
    const config = variants[status] || { className: 'bg-gray-100 text-gray-800', label: status }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, string> = {
      accident: 'Accident',
      near_miss: 'Near Miss',
      vehicle_damage: 'Vehicle Damage',
      property_damage: 'Property Damage',
      injury: 'Injury',
      violation: 'Violation',
      other: 'Other',
    }
    return <Badge variant="outline">{variants[type] || type}</Badge>
  }

  const handleViewDetails = (incident: typeof mockIncidents[0]) => {
    setSelectedIncident(incident)
    setIsDialogOpen(true)
  }

  const totalCost = incidents.reduce((sum, inc) => sum + inc.estimatedCost, 0)
  const criticalCount = incidents.filter((inc) => inc.severity === 'critical').length
  const underReviewCount = incidents.filter(
    (inc) => inc.status === 'under_review' || inc.status === 'under_investigation'
  ).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Costs</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total damages</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Incident Reports</CardTitle>
              <CardDescription>View and manage safety incidents</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="near_miss">Near Miss</SelectItem>
                <SelectItem value="vehicle_damage">Vehicle Damage</SelectItem>
                <SelectItem value="violation">Violation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="under_investigation">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Incidents Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No incidents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          {incident.severity === 'critical' && (
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium">{incident.title}</div>
                            <div className="text-sm text-muted-foreground">{incident.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(incident.type)}</TableCell>
                      <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                      <TableCell className="text-sm">
                        <div>{incident.date}</div>
                        <div className="text-muted-foreground">{incident.time}</div>
                      </TableCell>
                      <TableCell className="text-sm">{incident.vehicle}</TableCell>
                      <TableCell className="text-sm">{incident.driver}</TableCell>
                      <TableCell className="font-medium">
                        ${incident.estimatedCost.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(incident)}
                        >
                          <Eye className="h-4 w-4" />
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

      {/* View Incident Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
            <DialogDescription>
              Review complete incident information and documentation
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedIncident.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">ID: {selectedIncident.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(selectedIncident.severity)}
                  {getStatusBadge(selectedIncident.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Type</Label>
                    <div className="mt-1">{getTypeBadge(selectedIncident.type)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Date & Time</Label>
                    <div className="mt-1 font-medium">
                      {selectedIncident.date} at {selectedIncident.time}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Location</Label>
                    <div className="mt-1 font-medium">{selectedIncident.location}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Vehicle</Label>
                    <div className="mt-1 font-medium">{selectedIncident.vehicle}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Driver</Label>
                    <div className="mt-1 font-medium">{selectedIncident.driver}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Estimated Cost</Label>
                    <div className="mt-1 font-bold text-lg">
                      ${selectedIncident.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="mt-2 text-sm">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  {selectedIncident.injuries ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-green-600" />
                  )}
                  <span className="text-sm">
                    {selectedIncident.injuries ? 'Injuries Reported' : 'No Injuries'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedIncident.policeReport ? (
                    <FileText className="h-5 w-5 text-blue-600" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm">
                    {selectedIncident.policeReport ? 'Police Report Filed' : 'No Police Report'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button>Generate Report</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
