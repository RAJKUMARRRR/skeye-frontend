import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fleet/ui-web'
import { Save, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const workOrderSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  type: z.enum(['preventive', 'corrective', 'inspection']),
  priority: z.enum(['low', 'medium', 'high']),
  assignedTo: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  estimatedCost: z.number().min(0, 'Cost must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  parts: z.string().optional(),
})

type WorkOrderFormData = z.infer<typeof workOrderSchema>

const mockVehicles = [
  { id: 'v001', name: 'Truck-001' },
  { id: 'v002', name: 'Van-002' },
  { id: 'v003', name: 'Truck-003' },
  { id: 'v004', name: 'Van-004' },
]

const mockTechnicians = [
  { id: 't001', name: 'Mike Johnson' },
  { id: 't002', name: 'Sarah Martinez' },
  { id: 't003', name: 'Tom Anderson' },
]

export function WorkOrderForm() {
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      type: 'preventive',
      priority: 'medium',
    },
  })

  const onSubmit = (data: WorkOrderFormData) => {
    console.log('Work Order:', data)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      reset()
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Create Work Order</CardTitle>
            <CardDescription>Schedule new maintenance work</CardDescription>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Work order created successfully
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Work Order Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g., Oil Change & Filter Replacement"
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle</Label>
              <Select onValueChange={(value) => setValue('vehicleId', value)}>
                <SelectTrigger id="vehicleId">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && (
                <p className="text-sm text-red-600">{errors.vehicleId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Work Order Type</Label>
              <Select onValueChange={(value) => setValue('type', value as any)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                  <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setValue('priority', value as any)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To (Optional)</Label>
              <Select onValueChange={(value) => setValue('assignedTo', value)}>
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {mockTechnicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
              {errors.dueDate && <p className="text-sm text-red-600">{errors.dueDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                {...register('estimatedCost', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.estimatedCost && (
                <p className="text-sm text-red-600">{errors.estimatedCost.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detailed description of work to be performed..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parts">Parts Required (Optional)</Label>
            <Textarea
              id="parts"
              {...register('parts')}
              placeholder="List of parts needed for this work order..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Create Work Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
