import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@fleet/ui-web'
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Trash2,
  Check,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

const mockNotifications = [
  {
    id: 'n001',
    type: 'alert',
    category: 'maintenance',
    title: 'Maintenance Due',
    message: 'Vehicle Truck-001 is due for maintenance in 2 days',
    timestamp: '2025-10-10 09:30',
    read: false,
    priority: 'high',
    actionable: true,
  },
  {
    id: 'n002',
    type: 'warning',
    category: 'driver',
    title: 'Hours of Service Alert',
    message: 'Driver John Smith approaching maximum driving hours (30 min remaining)',
    timestamp: '2025-10-10 09:15',
    read: false,
    priority: 'critical',
    actionable: true,
  },
  {
    id: 'n003',
    type: 'success',
    category: 'route',
    title: 'Route Completed',
    message: 'Route Chicago to Milwaukee completed successfully',
    timestamp: '2025-10-10 08:45',
    read: true,
    priority: 'normal',
    actionable: false,
  },
  {
    id: 'n004',
    type: 'info',
    category: 'system',
    title: 'System Update',
    message: 'Fleet management system will be updated tonight at 11 PM',
    timestamp: '2025-10-10 08:00',
    read: true,
    priority: 'normal',
    actionable: false,
  },
  {
    id: 'n005',
    type: 'alert',
    category: 'fuel',
    title: 'High Fuel Consumption',
    message: 'Vehicle Van-002 showing 15% higher fuel consumption than average',
    timestamp: '2025-10-10 07:30',
    read: false,
    priority: 'high',
    actionable: true,
  },
  {
    id: 'n006',
    type: 'warning',
    category: 'compliance',
    title: 'Inspection Overdue',
    message: 'Vehicle Truck-003 inspection is 5 days overdue',
    timestamp: '2025-10-09 16:20',
    read: false,
    priority: 'critical',
    actionable: true,
  },
  {
    id: 'n007',
    type: 'info',
    category: 'driver',
    title: 'Driver Certification Expiring',
    message: 'Sarah Johnson CDL expires in 30 days',
    timestamp: '2025-10-09 14:15',
    read: true,
    priority: 'normal',
    actionable: true,
  },
  {
    id: 'n008',
    type: 'success',
    category: 'performance',
    title: 'Fleet Efficiency Goal Met',
    message: 'Monthly fleet efficiency target of 85% achieved',
    timestamp: '2025-10-09 10:00',
    read: true,
    priority: 'normal',
    actionable: false,
  },
]

export function NotificationCenter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState(mockNotifications)

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter
      const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'unread' && !notification.read) ||
        (activeTab === 'actionable' && notification.actionable)

      return matchesSearch && matchesCategory && matchesPriority && matchesTab
    })
  }, [notifications, searchTerm, categoryFilter, priorityFilter, activeTab])

  const unreadCount = notifications.filter((n) => !n.read).length
  const actionableCount = notifications.filter((n) => n.actionable && !n.read).length

  const getTypeIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      alert: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      warning: <AlertCircle className="h-5 w-5 text-red-600" />,
      info: <Info className="h-5 w-5 text-blue-600" />,
      success: <CheckCircle className="h-5 w-5 text-green-600" />,
    }
    return icons[type] || <Bell className="h-5 w-5 text-gray-600" />
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      critical: { variant: 'destructive', label: 'Critical' },
      high: { variant: 'default', label: 'High' },
      normal: { variant: 'secondary', label: 'Normal' },
    }
    const config = variants[priority] || { variant: 'secondary', label: priority }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getCategoryBadge = (category: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {category}
      </Badge>
    )
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const deleteAll = () => {
    setNotifications([])
  }

  const getTimeDifference = (timestamp: string) => {
    const now = new Date('2025-10-10 10:00')
    const notifTime = new Date(timestamp)
    const diffMs = now.getTime() - notifTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actionable</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionableCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Action required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter((n) => n.priority === 'critical' && !n.read).length}
            </div>
            <p className="text-xs text-red-600 mt-1">Urgent attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notification Center</CardTitle>
              <CardDescription>Manage and review all fleet notifications</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" onClick={deleteAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
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
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="route">Route</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="actionable">
                Actionable ({actionableCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-2 mt-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getPriorityBadge(notification.priority)}
                            {getCategoryBadge(notification.category)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {getTimeDifference(notification.timestamp)}
                          </div>
                          <div className="flex items-center gap-2">
                            {notification.actionable && (
                              <Button size="sm" variant="outline">
                                Take Action
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
