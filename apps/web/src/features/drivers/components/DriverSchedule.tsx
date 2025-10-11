import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
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
  DialogTrigger,
} from '@fleet/ui-web'
import { Plus, Clock, Calendar as CalendarIcon } from 'lucide-react'

const scheduleSchema = z.object({
  driverId: z.string().min(1, 'Driver is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  shiftType: z.enum(['morning', 'afternoon', 'night', 'split']),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  route: z.string().optional(),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

const mockSchedule = [
  {
    id: 's1',
    driver: 'John Smith',
    vehicle: 'Truck-001',
    shift: 'morning',
    startTime: '06:00',
    endTime: '14:00',
    route: 'Chicago → Milwaukee',
    status: 'scheduled',
    date: '2024-01-15',
  },
  {
    id: 's2',
    driver: 'Sarah Johnson',
    vehicle: 'Van-002',
    shift: 'afternoon',
    startTime: '14:00',
    endTime: '22:00',
    route: 'Madison → Green Bay',
    status: 'in-progress',
    date: '2024-01-15',
  },
  {
    id: 's3',
    driver: 'Mike Davis',
    vehicle: 'Truck-003',
    shift: 'morning',
    startTime: '07:00',
    endTime: '15:00',
    route: 'Rockford → Springfield',
    status: 'scheduled',
    date: '2024-01-15',
  },
]

interface DriverScheduleProps {
  driverId?: string
}

export function DriverSchedule({ driverId }: DriverScheduleProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      driverId: driverId || '',
      vehicleId: '',
      shiftType: 'morning',
      startTime: '06:00',
      endTime: '14:00',
      route: '',
    },
  })

  const onSubmit = (data: ScheduleFormData) => {
    console.log('Schedule data:', data)
    setOpen(false)
    form.reset()
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      scheduled: { variant: 'default', label: 'Scheduled' },
      'in-progress': { variant: 'secondary', label: 'In Progress' },
      completed: { variant: 'secondary', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getShiftBadge = (shift: string) => {
    const colors: Record<string, string> = {
      morning: 'bg-yellow-100 text-yellow-800',
      afternoon: 'bg-blue-100 text-blue-800',
      night: 'bg-purple-100 text-purple-800',
      split: 'bg-gray-100 text-gray-800',
    }
    return (
      <Badge className={colors[shift] || colors.split}>
        {shift.charAt(0).toUpperCase() + shift.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Driver Schedule</h3>
          <p className="text-muted-foreground">Manage shift assignments and schedules</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Schedule</DialogTitle>
              <DialogDescription>Assign driver to vehicle and shift</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driverId">Driver</Label>
                <Select {...form.register('driverId')}>
                  <SelectTrigger id="driverId">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="d1">John Smith</SelectItem>
                    <SelectItem value="d2">Sarah Johnson</SelectItem>
                    <SelectItem value="d3">Mike Davis</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.driverId && (
                  <p className="text-sm text-red-600">{form.formState.errors.driverId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle</Label>
                <Select {...form.register('vehicleId')}>
                  <SelectTrigger id="vehicleId">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">Truck-001</SelectItem>
                    <SelectItem value="v2">Van-002</SelectItem>
                    <SelectItem value="v3">Truck-003</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.vehicleId && (
                  <p className="text-sm text-red-600">{form.formState.errors.vehicleId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shiftType">Shift Type</Label>
                <Select {...form.register('shiftType')}>
                  <SelectTrigger id="shiftType">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6AM - 2PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2PM - 10PM)</SelectItem>
                    <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                    <SelectItem value="split">Split Shift</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.shiftType && (
                  <p className="text-sm text-red-600">{form.formState.errors.shiftType.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" {...form.register('startTime')} />
                  {form.formState.errors.startTime && (
                    <p className="text-sm text-red-600">{form.formState.errors.startTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" {...form.register('endTime')} />
                  {form.formState.errors.endTime && (
                    <p className="text-sm text-red-600">{form.formState.errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route (Optional)</Label>
                <Input id="route" placeholder="Chicago → Milwaukee" {...form.register('route')} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Schedule</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar View */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose date to view schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Schedule Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSchedule.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div className="text-xs font-medium mt-1">{schedule.startTime}</div>
                      <div className="text-xs text-muted-foreground">to</div>
                      <div className="text-xs font-medium">{schedule.endTime}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{schedule.driver}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Badge variant="outline">{schedule.vehicle}</Badge>
                        {schedule.route && (
                          <>
                            <span>•</span>
                            <span>{schedule.route}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getShiftBadge(schedule.shift)}
                    {getStatusBadge(schedule.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Shift distribution across the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-7">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="rounded-lg border p-3 text-center">
                <div className="font-medium text-sm mb-2">{day}</div>
                <div className="text-2xl font-bold">{Math.floor(Math.random() * 5) + 3}</div>
                <div className="text-xs text-muted-foreground mt-1">shifts</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
