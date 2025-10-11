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

const reportSchedulerSchema = z.object({
  reportId: z.string().min(1, 'Report template is required'),
  name: z.string().min(1, 'Schedule name is required'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  dayOfWeek: z.string().optional(),
  dayOfMonth: z.string().optional(),
  time: z.string().min(1, 'Time is required'),
  recipients: z.string().min(1, 'At least one recipient is required'),
  format: z.enum(['pdf', 'csv', 'both']),
  enabled: z.boolean().default(true),
})

type ReportSchedulerForm = z.infer<typeof reportSchedulerSchema>

interface ReportSchedulerProps {
  reportTemplates?: Array<{ id: string; name: string }>
  onSave?: (schedule: ReportSchedulerForm) => void
  onCancel?: () => void
}

const defaultReportTemplates = [
  { id: 'trip-summary', name: 'Trip Summary Report' },
  { id: 'cost-analysis', name: 'Cost Analysis Report' },
  { id: 'compliance', name: 'Compliance Report' },
  { id: 'driver-performance', name: 'Driver Performance Report' },
  { id: 'utilization', name: 'Vehicle Utilization Report' },
  { id: 'executive', name: 'Executive Summary' },
]

export function ReportScheduler({
  reportTemplates = defaultReportTemplates,
  onSave,
  onCancel
}: ReportSchedulerProps) {
  const form = useForm<ReportSchedulerForm>({
    resolver: zodResolver(reportSchedulerSchema),
    defaultValues: {
      reportId: '',
      name: '',
      frequency: 'weekly',
      dayOfWeek: '1',
      dayOfMonth: '1',
      time: '09:00',
      recipients: '',
      format: 'pdf',
      enabled: true,
    },
  })

  const frequency = form.watch('frequency')

  const onSubmit = (data: ReportSchedulerForm) => {
    console.log('Schedule configuration:', data)
    onSave?.(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Report</CardTitle>
            <CardDescription>
              Set up automated report generation and delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="reportId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly Fleet Report" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name to identify this schedule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {frequency === 'weekly' && (
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                        <SelectItem value="0">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(frequency === 'monthly' || frequency === 'quarterly') && (
              <FormField
                control={form.control}
                name="dayOfMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Reports generate on the {field.value}
                      {field.value === '1' ? 'st' : field.value === '2' ? 'nd' : field.value === '3' ? 'rd' : 'th'} of the month
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="recipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipients</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email1@example.com, email2@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated email addresses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Enable Schedule
                    </FormLabel>
                    <FormDescription>
                      Reports will be generated and sent automatically according to this schedule
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Schedule</Button>
        </div>
      </form>
    </Form>
  )
}
