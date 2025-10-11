import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@fleet/ui-web'
import { Download, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { exportToPDF } from '../../../lib/export/pdf-export'
import { exportToCSV, csvFormatters } from '../../../lib/export/csv-export'

const COLORS = ['#22c55e', '#eab308', '#ef4444']

// Mock compliance data
const mockComplianceData = [
  {
    id: 'c1',
    vehicleName: 'Truck-001',
    driverName: 'John Smith',
    violationType: 'Speeding',
    severity: 'medium',
    date: '2024-01-15',
    location: 'Highway 94',
    speed: 85,
    speedLimit: 70,
    status: 'resolved',
    notes: 'Warning issued',
  },
  {
    id: 'c2',
    vehicleName: 'Van-002',
    driverName: 'Sarah Johnson',
    violationType: 'HOS Violation',
    severity: 'high',
    date: '2024-01-14',
    location: 'Interstate 90',
    hoursWorked: 12.5,
    maxHours: 11,
    status: 'pending',
    notes: 'Exceeded daily driving limit',
  },
  {
    id: 'c3',
    vehicleName: 'Sedan-003',
    driverName: 'Mike Davis',
    violationType: 'Harsh Braking',
    severity: 'low',
    date: '2024-01-15',
    location: 'Main St',
    gForce: 0.45,
    status: 'resolved',
    notes: 'Driver counseled',
  },
  {
    id: 'c4',
    vehicleName: 'Truck-004',
    driverName: 'Emily Brown',
    violationType: 'Speeding',
    severity: 'high',
    date: '2024-01-13',
    location: 'Route 66',
    speed: 95,
    speedLimit: 70,
    status: 'escalated',
    notes: 'Excessive speeding - formal review',
  },
  {
    id: 'c5',
    vehicleName: 'Van-005',
    driverName: 'David Wilson',
    violationType: 'Geofence Violation',
    severity: 'medium',
    date: '2024-01-14',
    location: 'Downtown Area',
    status: 'pending',
    notes: 'Unauthorized zone entry',
  },
  {
    id: 'c6',
    vehicleName: 'Truck-001',
    driverName: 'John Smith',
    violationType: 'Idle Time',
    severity: 'low',
    date: '2024-01-12',
    location: 'Rest Stop A',
    idleTime: 65,
    maxIdle: 30,
    status: 'resolved',
    notes: 'Acceptable due to weather',
  },
]

// Safety scores by driver
const driverSafetyScores = [
  { name: 'John Smith', score: 87, violations: 2 },
  { name: 'Sarah Johnson', score: 78, violations: 1 },
  { name: 'Mike Davis', score: 92, violations: 1 },
  { name: 'Emily Brown', score: 75, violations: 1 },
  { name: 'David Wilson', score: 85, violations: 1 },
]

interface ComplianceReportProps {
  dateRange?: string
  vehicles?: string[]
  drivers?: string[]
}

export function ComplianceReport({ dateRange, vehicles, drivers }: ComplianceReportProps) {
  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalViolations = mockComplianceData.length
    const criticalViolations = mockComplianceData.filter(v => v.severity === 'high').length
    const resolvedViolations = mockComplianceData.filter(v => v.status === 'resolved').length
    const pendingViolations = mockComplianceData.filter(v => v.status === 'pending').length
    const complianceRate = ((resolvedViolations / totalViolations) * 100).toFixed(1)
    const avgSafetyScore = (driverSafetyScores.reduce((sum, d) => sum + d.score, 0) / driverSafetyScores.length).toFixed(1)

    return {
      totalViolations,
      criticalViolations,
      resolvedViolations,
      pendingViolations,
      complianceRate,
      avgSafetyScore,
    }
  }, [])

  // Violations by type
  const violationsByType = useMemo(() => {
    const typeMap = new Map<string, number>()
    mockComplianceData.forEach(v => {
      const current = typeMap.get(v.violationType) || 0
      typeMap.set(v.violationType, current + 1)
    })
    return Array.from(typeMap.entries()).map(([name, count]) => ({
      name,
      count,
    }))
  }, [])

  // Violations by severity
  const violationsBySeverity = useMemo(() => {
    const severityMap = new Map<string, number>()
    mockComplianceData.forEach(v => {
      const current = severityMap.get(v.severity) || 0
      severityMap.set(v.severity, current + 1)
    })
    return [
      { name: 'Low', value: severityMap.get('low') || 0, color: '#22c55e' },
      { name: 'Medium', value: severityMap.get('medium') || 0, color: '#eab308' },
      { name: 'High', value: severityMap.get('high') || 0, color: '#ef4444' },
    ]
  }, [])

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
    }
    return <Badge variant={variants[severity] || 'default'}>{severity.toUpperCase()}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      resolved: 'secondary',
      pending: 'default',
      escalated: 'destructive',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const handleExportPDF = () => {
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Driver', dataKey: 'driverName' },
      { header: 'Violation Type', dataKey: 'violationType' },
      { header: 'Severity', dataKey: 'severity' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Location', dataKey: 'location' },
    ]

    exportToPDF({
      title: 'Compliance Report',
      subtitle: dateRange || 'Last 30 Days',
      data: mockComplianceData,
      columns,
      fileName: 'compliance-report.pdf',
      orientation: 'landscape',
      includeTimestamp: true,
    })
  }

  const handleExportCSV = () => {
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Vehicle', dataKey: 'vehicleName' },
      { header: 'Driver', dataKey: 'driverName' },
      { header: 'Violation Type', dataKey: 'violationType' },
      { header: 'Severity', dataKey: 'severity' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Location', dataKey: 'location' },
      { header: 'Notes', dataKey: 'notes' },
    ]

    exportToCSV({
      data: mockComplianceData,
      columns,
      fileName: 'compliance-report.csv',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Compliance Report</h2>
          <p className="text-muted-foreground">{dateRange || 'Last 30 Days'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalViolations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.criticalViolations} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.complianceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.resolvedViolations} resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingViolations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgSafetyScore}/100</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fleet average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Violations by Type</CardTitle>
            <CardDescription>Distribution of violation types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={violationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Violations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Violations by Severity</CardTitle>
            <CardDescription>Breakdown by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationsBySeverity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {violationsBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Driver Safety Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Safety Scores</CardTitle>
          <CardDescription>Safety performance by driver</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={driverSafetyScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#22c55e" name="Safety Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Violation Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Violation Details</CardTitle>
          <CardDescription>Complete list of compliance violations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Violation Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockComplianceData.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell>{violation.date}</TableCell>
                    <TableCell>{violation.vehicleName}</TableCell>
                    <TableCell>{violation.driverName}</TableCell>
                    <TableCell>{violation.violationType}</TableCell>
                    <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                    <TableCell>{getStatusBadge(violation.status)}</TableCell>
                    <TableCell>{violation.location}</TableCell>
                    <TableCell className="max-w-xs truncate">{violation.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
