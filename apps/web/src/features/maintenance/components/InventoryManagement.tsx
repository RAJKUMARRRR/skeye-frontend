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
import { Package, Search, AlertTriangle, TrendingUp, DollarSign, Plus } from 'lucide-react'

const mockInventory = [
  {
    id: 'inv001',
    partNumber: 'OIL-5W30-5L',
    name: '5W-30 Motor Oil (5L)',
    category: 'fluids',
    quantity: 45,
    minQuantity: 20,
    unitCost: 28.50,
    location: 'Warehouse A - Shelf 3',
    supplier: 'AutoParts Inc.',
    lastRestocked: '2025-10-01',
  },
  {
    id: 'inv002',
    partNumber: 'BRAKE-PAD-F',
    name: 'Front Brake Pads Set',
    category: 'brakes',
    quantity: 8,
    minQuantity: 10,
    unitCost: 85.00,
    location: 'Warehouse A - Shelf 7',
    supplier: 'Brake Masters',
    lastRestocked: '2025-09-20',
  },
  {
    id: 'inv003',
    partNumber: 'TIRE-275-70R18',
    name: 'All-Season Tire 275/70R18',
    category: 'tires',
    quantity: 16,
    minQuantity: 12,
    unitCost: 185.00,
    location: 'Warehouse B - Bay 2',
    supplier: 'Tire World',
    lastRestocked: '2025-09-15',
  },
  {
    id: 'inv004',
    partNumber: 'FILTER-AIR-STD',
    name: 'Standard Air Filter',
    category: 'filters',
    quantity: 3,
    minQuantity: 15,
    unitCost: 22.50,
    location: 'Warehouse A - Shelf 5',
    supplier: 'FilterPro',
    lastRestocked: '2025-08-30',
  },
  {
    id: 'inv005',
    partNumber: 'BATTERY-12V-HD',
    name: 'Heavy Duty 12V Battery',
    category: 'electrical',
    quantity: 12,
    minQuantity: 8,
    unitCost: 195.00,
    location: 'Warehouse A - Shelf 10',
    supplier: 'PowerCell Co.',
    lastRestocked: '2025-10-05',
  },
]

export function InventoryManagement() {
  const [inventory, setInventory] = useState(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

      const isLowStock = item.quantity < item.minQuantity
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && isLowStock) ||
        (stockFilter === 'adequate' && !isLowStock)

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [inventory, searchTerm, categoryFilter, stockFilter])

  const lowStockCount = inventory.filter((item) => item.quantity < item.minQuantity).length
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0)

  const getStockBadge = (quantity: number, minQuantity: number) => {
    if (quantity < minQuantity) {
      return (
        <Badge variant="error" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>
      )
    }
    return <Badge variant="success">In Stock</Badge>
  }

  const getCategoryBadge = (category: string) => {
    const labels: Record<string, string> = {
      fluids: 'Fluids',
      brakes: 'Brakes',
      tires: 'Tires',
      filters: 'Filters',
      electrical: 'Electrical',
    }
    return <Badge variant="outline">{labels[category] || category}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">In stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique parts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Parts Inventory</CardTitle>
              <CardDescription>Track and manage spare parts and supplies</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Part
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parts..."
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
                <SelectItem value="fluids">Fluids</SelectItem>
                <SelectItem value="brakes">Brakes</SelectItem>
                <SelectItem value="tires">Tires</SelectItem>
                <SelectItem value="filters">Filters</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="adequate">Adequate Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Min. Qty</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.partNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(item.category)}</TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${item.quantity < item.minQuantity ? 'text-red-600' : ''}`}
                        >
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.minQuantity}
                      </TableCell>
                      <TableCell className="text-sm">${item.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">
                        ${(item.quantity * item.unitCost).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStockBadge(item.quantity, item.minQuantity)}</TableCell>
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
