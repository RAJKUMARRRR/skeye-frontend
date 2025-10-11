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
  Label,
} from '@fleet/ui-web'
import { Download, FileText, Loader2 } from 'lucide-react'

const onDemandReportSchema = z.object({
  reportId: z.string().min(1, 'Report template is required'),
  dateRange: z.enum(['today', 'yesterday', 'last-7-days', 'last-30-days', 'last-90-days', 'custom']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  vehicles: z.array(z.string()).optional(),
  drivers: z.array(z.string()).optional(),
  format: z.enum(['pdf', 'csv', 'both']),
})

type OnDemandReportForm = z.infer<typeof onDemandReportSchema>

interface OnDemandReportProps {
  reportTemplates?: Array<{ id: string; name: string; description: string }>
  onGenerate?: (report: OnDemandReportForm) => Promise<void>
  onCancel?: () => void
}

const defaultReportTemplates = [
  {
    id: 'trip-summary',
    name: 'Trip Summary Report',
    description: 'Detailed breakdown of all trips including distance, duration, and fuel consumption',
  },
  {
    id: 'cost-analysis',
    name: 'Cost Analysis Report',
    description: 'Complete cost breakdown including fuel, maintenance, and operational expenses',
  },
  {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Regulatory compliance tracking including HOS violations and safety metrics',
  },
  {
    id: 'driver-performance',
    name: 'Driver Performance Report',
    description: 'Driver behavior analysis including safety scores and efficiency metrics',
  },
  {
    id: 'utilization',
    name: 'Vehicle Utilization Report',
    description: 'Fleet utilization metrics and optimization recommendations',
  },
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'High-level overview of fleet operations with key performance indicators',
  },
]

const mockVehicles = [
  { id: 'v1', name: 'Truck-001' },
  { id: 'v2', name: 'Van-002' },
  { id: 'v3', name: 'Sedan-003' },
]

const mockDrivers = [
  { id: 'd1', name: 'John Smith' },
  { id: 'd2', name: 'Sarah Johnson' },
  { id: 'd3', name: 'Mike Davis' },
]

export function OnDemandReport({
  reportTemplates = defaultReportTemplates,
  onGenerate,
  onCancel
}: OnDemandReportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<typeof defaultReportTemplates[0] | null>(null)

  const form = useForm<OnDemandReportForm>({
    resolver: zodResolver(onDemandReportSchema),
    defaultValues: {
      reportId: '',
      dateRange: 'last-30-days',
      startDate: '',
      endDate: '',
      vehicles: [],
      drivers: [],
      format: 'pdf',
    },
  })

  const dateRange = form.watch('dateRange')
  const reportId = form.watch('reportId')

  const onSubmit = async (data: OnDemandReportForm) => {
    setIsGenerating(true)
    try {
      await onGenerate?.(data)
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Report generated:', data)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTemplateChange = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId)
    setSelectedTemplate(template || null)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>
              Generate a report instantly with your selected parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="reportId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Template</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleTemplateChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a report template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && (
                    <FormDescription>
                      {selectedTemplate.description}
                    </FormDescription>
                  )}
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

            {dateRange === 'custom' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Filter by Vehicles (Optional)
                </Label>
                <FormField
                  control={form.control}
                  name="vehicles"
                  render={() => (
                    <div className="grid gap-2 md:grid-cols-3">
                      {mockVehicles.map((vehicle) => (
                        <FormField
                          key={vehicle.id}
                          control={form.control}
                          name="vehicles"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={vehicle.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(vehicle.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), vehicle.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== vehicle.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {vehicle.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  )}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Leave empty to include all vehicles
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Filter by Drivers (Optional)
                </Label>
                <FormField
                  control={form.control}
                  name="drivers"
                  render={() => (
                    <div className="grid gap-2 md:grid-cols-3">
                      {mockDrivers.map((driver) => (
                        <FormField
                          key={driver.id}
                          control={form.control}
                          name="drivers"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={driver.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(driver.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), driver.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== driver.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {driver.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  )}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Leave empty to include all drivers
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">PDF only</SelectItem>
                      <SelectItem value="csv">CSV only</SelectItem>
                      <SelectItem value="both">Both PDF and CSV</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isGenerating}>
            Cancel
          </Button>
          <Button type="submit" disabled={isGenerating || !reportId}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
