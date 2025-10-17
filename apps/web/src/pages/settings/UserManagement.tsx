import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Label,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Switch,
} from '@fleet/ui-web'
import { UserPlus, Mail, Shield, Edit2, Trash2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'manager' | 'dispatcher'
  status: 'active' | 'inactive'
  lastLogin: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@skeye.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@skeye.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-01-15 09:15',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@skeye.com',
    role: 'dispatcher',
    status: 'active',
    lastLogin: '2024-01-14 16:45',
  },
  {
    id: '4',
    name: 'Alice Johnson',
    email: 'alice@skeye.com',
    role: 'manager',
    status: 'inactive',
    lastLogin: '2024-01-10 11:20',
  },
]

const roleColors = {
  super_admin: 'destructive',
  admin: 'default',
  manager: 'secondary',
  dispatcher: 'outline',
} as const

const roleLabels = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  dispatcher: 'Dispatcher',
}

export function UserManagement() {
  const [users] = useState<User[]>(mockUsers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with specific role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Full Name</Label>
                <Input id="new-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email Address</Label>
                <Input id="new-email" type="email" placeholder="john@skeye.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select defaultValue="dispatcher">
                  <SelectTrigger id="new-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Temporary Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Send Welcome Email</Label>
                  <p className="text-xs text-muted-foreground">
                    Send login credentials via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length}
            </div>
            <p className="text-xs text-muted-foreground">Administrators</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === 'dispatcher').length}
            </div>
            <p className="text-xs text-muted-foreground">Dispatchers</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleColors[user.role]}>
                      <Shield className="h-3 w-3 mr-1" />
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Overview of what each role can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">Super Admin</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Full system access, can manage all users, settings, and data
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">Admin</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Manage vehicles, drivers, routes, and view all reports
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Manager</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  View dashboards, manage assignments, approve maintenance
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Dispatcher</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Assign routes, track vehicles, manage daily operations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
