import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@fleet/ui-web'

const reportBuilderSchema = z.object({
  name: z.string().min(1, 'Report name is required'),
  description: z.string().optional(),
  category: z.enum(['operations', 'financial', 'compliance', 'performance', 'custom']),
  dateRange: z.enum(['today', 'yesterday', 'last-7-days', 'last-30-days', 'last-90-days', 'custom']),
  metrics: z.array(z.string()).min(1, 'Select at least one metric'),
  dimensions: z.array(z.string()).min(1, 'Select at least one dimension'),
  visualizations: z.array(z.string()).min(1, 'Select at least one visualization'),
  filters: z.object({
    vehicles: z.array(z.string()).optional(),
    drivers: z.array(z.string()).optional(),
    regions: z.array(z.string()).optional(),
  }).optional(),
})

type ReportBuilderForm = z.infer<typeof reportBuilderSchema>

const availableMetrics = [
  { id: 'distance', name: 'Total Distance', category: 'operations' },
  { id: 'duration', name: 'Total Duration', category: 'operations' },
  { id: 'fuel-consumed', name: 'Fuel Consumed', category: 'operations' },
  { id: 'fuel-cost', name: 'Fuel Cost', category: 'financial' },
  { id: 'maintenance-cost', name: 'Maintenance Cost', category: 'financial' },
  { id: 'total-cost', name: 'Total Cost', category: 'financial' },
  { id: 'trips', name: 'Number of Trips', category: 'operations' },
  { id: 'idle-time', name: 'Idle Time', category: 'performance' },
  { id: 'speeding-events', name: 'Speeding Events', category: 'compliance' },
  { id: 'harsh-braking', name: 'Harsh Braking Events', category: 'compliance' },
  { id: 'utilization', name: 'Vehicle Utilization', category: 'performance' },
  { id: 'efficiency', name: 'Fuel Efficiency', category: 'performance' },
]

const availableDimensions = [
  { id: 'vehicle', name: 'By Vehicle' },
  { id: 'driver', name: 'By Driver' },
  { id: 'region', name: 'By Region' },
  { id: 'time', name: 'By Time Period' },
  { id: 'vehicle-type', name: 'By Vehicle Type' },
  { id: 'department', name: 'By Department' },
]

const availableVisualizations = [
  { id: 'table', name: 'Data Table', description: 'Detailed tabular view' },
  { id: 'bar-chart', name: 'Bar Chart', description: 'Compare values across categories' },
  { id: 'line-chart', name: 'Line Chart', description: 'Show trends over time' },
  { id: 'pie-chart', name: 'Pie Chart', description: 'Show proportions' },
  { id: 'area-chart', name: 'Area Chart', description: 'Cumulative trends' },
  { id: 'summary-cards', name: 'Summary Cards', description: 'Key metrics at a glance' },
]

interface ReportBuilderProps {
  onSave?: (report: ReportBuilderForm) => void
  onCancel?: () => void
}

export function ReportBuilder({ onSave, onCancel }: ReportBuilderProps) {
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<string>('all')

  const form = useForm<ReportBuilderForm>({
    resolver: zodResolver(reportBuilderSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'custom',
      dateRange: 'last-30-days',
      metrics: [],
      dimensions: [],
      visualizations: ['table'],
      filters: {
        vehicles: [],
        drivers: [],
        regions: [],
      },
    },
  })

  const onSubmit = (data: ReportBuilderForm) => {
    console.log('Report configuration:', data)
    onSave?.(data)
  }

  const filteredMetrics = selectedMetricCategory === 'all'
    ? availableMetrics
    : availableMetrics.filter(m => m.category === selectedMetricCategory)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>
              Build a custom report by selecting metrics, dimensions, and visualizations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Monthly Fleet Summary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={selectedMetricCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetricCategory('all')}
                  >
                    All
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMetricCategory === 'operations' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetricCategory('operations')}
                  >
                    Operations
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMetricCategory === 'financial' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetricCategory('financial')}
                  >
                    Financial
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMetricCategory === 'compliance' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetricCategory('compliance')}
                  >
                    Compliance
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMetricCategory === 'performance' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMetricCategory('performance')}
                  >
                    Performance
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="metrics"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Metrics</FormLabel>
                      <FormDescription>
                        Choose the data points you want to include in your report
                      </FormDescription>
                      <div className="grid gap-3 md:grid-cols-2">
                        {filteredMetrics.map((metric) => (
                          <FormField
                            key={metric.id}
                            control={form.control}
                            name="metrics"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={metric.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(metric.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, metric.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== metric.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {metric.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="dimensions" className="space-y-4">
                <FormField
                  control={form.control}
                  name="dimensions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Dimensions</FormLabel>
                      <FormDescription>
                        Choose how you want to group and analyze your data
                      </FormDescription>
                      <div className="grid gap-3 md:grid-cols-2">
                        {availableDimensions.map((dimension) => (
                          <FormField
                            key={dimension.id}
                            control={form.control}
                            name="dimensions"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={dimension.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(dimension.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, dimension.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== dimension.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {dimension.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="visualizations" className="space-y-4">
                <FormField
                  control={form.control}
                  name="visualizations"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Visualizations</FormLabel>
                      <FormDescription>
                        Choose how you want to display your data
                      </FormDescription>
                      <div className="grid gap-3 md:grid-cols-2">
                        {availableVisualizations.map((viz) => (
                          <FormField
                            key={viz.id}
                            control={form.control}
                            name="visualizations"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={viz.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(viz.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, viz.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== viz.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal">
                                      {viz.name}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      {viz.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Report Template</Button>
        </div>
      </form>
    </Form>
  )
}
