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
} from '@fleet/ui-web'
import {
  FileText,
  Search,
  Download,
  Eye,
  Trash2,
  FileCheck,
  FolderOpen,
  Calendar,
  AlertTriangle,
} from 'lucide-react'

const mockDocuments = [
  {
    id: 'doc001',
    name: 'Vehicle Registration - Truck-001',
    type: 'registration',
    category: 'vehicle',
    fileName: 'registration_truck001.pdf',
    size: '2.4 MB',
    uploadDate: '2025-01-15',
    expiryDate: '2026-01-15',
    status: 'valid',
    uploadedBy: 'Admin',
  },
  {
    id: 'doc002',
    name: 'Insurance Policy - Fleet 2025',
    type: 'insurance',
    category: 'fleet',
    fileName: 'insurance_policy_2025.pdf',
    size: '5.1 MB',
    uploadDate: '2025-01-01',
    expiryDate: '2025-12-31',
    status: 'expiring_soon',
    uploadedBy: 'Admin',
  },
  {
    id: 'doc003',
    name: 'CDL License - John Smith',
    type: 'license',
    category: 'driver',
    fileName: 'cdl_john_smith.pdf',
    size: '1.2 MB',
    uploadDate: '2024-06-10',
    expiryDate: '2026-06-10',
    status: 'valid',
    uploadedBy: 'John Smith',
  },
  {
    id: 'doc004',
    name: 'Maintenance Invoice - Truck-003',
    type: 'invoice',
    category: 'maintenance',
    fileName: 'invoice_20250915.pdf',
    size: '890 KB',
    uploadDate: '2025-09-15',
    expiryDate: null,
    status: 'valid',
    uploadedBy: 'Service Center',
  },
  {
    id: 'doc005',
    name: 'Safety Inspection - Van-002',
    type: 'inspection',
    category: 'vehicle',
    fileName: 'inspection_van002.pdf',
    size: '3.2 MB',
    uploadDate: '2024-10-01',
    expiryDate: '2025-10-01',
    status: 'expired',
    uploadedBy: 'Admin',
  },
  {
    id: 'doc006',
    name: 'Route Manifest - Chicago',
    type: 'manifest',
    category: 'operations',
    fileName: 'manifest_chicago_20251009.pdf',
    size: '450 KB',
    uploadDate: '2025-10-09',
    expiryDate: null,
    status: 'valid',
    uploadedBy: 'Dispatcher',
  },
]

export function DocumentManager() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
      const matchesType = typeFilter === 'all' || doc.type === typeFilter
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter

      return matchesSearch && matchesCategory && matchesType && matchesStatus
    })
  }, [documents, searchTerm, categoryFilter, typeFilter, statusFilter])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string; icon: JSX.Element }> = {
      valid: {
        className: 'bg-green-100 text-green-800',
        label: 'Valid',
        icon: <FileCheck className="h-3 w-3" />,
      },
      expiring_soon: {
        className: 'bg-yellow-100 text-yellow-800',
        label: 'Expiring Soon',
        icon: <AlertTriangle className="h-3 w-3" />,
      },
      expired: {
        className: 'bg-red-100 text-red-800',
        label: 'Expired',
        icon: <AlertTriangle className="h-3 w-3" />,
      },
    }
    const config = variants[status] || variants.valid
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const labels: Record<string, string> = {
      vehicle: 'Vehicle',
      driver: 'Driver',
      fleet: 'Fleet',
      maintenance: 'Maintenance',
      operations: 'Operations',
    }
    return <Badge variant="outline">{labels[category] || category}</Badge>
  }

  const handleDelete = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId))
  }

  const validCount = documents.filter((d) => d.status === 'valid').length
  const expiringCount = documents.filter((d) => d.status === 'expiring_soon').length
  const expiredCount = documents.filter((d) => d.status === 'expired').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{validCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Up to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Action needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Urgent renewal</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Manage and organize fleet documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="fleet">Fleet</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="manifest">Manifest</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">{doc.fileName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(doc.category)}</TableCell>
                      <TableCell className="capitalize">{doc.type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-sm">{doc.size}</TableCell>
                      <TableCell className="text-sm">{doc.uploadDate}</TableCell>
                      <TableCell className="text-sm">
                        {doc.expiryDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {doc.expiryDate}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
