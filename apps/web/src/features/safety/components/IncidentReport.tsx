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
  Badge,
  Checkbox,
} from '@fleet/ui-web'
import { AlertTriangle, Upload, Save, CheckCircle, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const incidentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  type: z.enum(['accident', 'near_miss', 'vehicle_damage', 'property_damage', 'injury', 'violation', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(5, 'Location is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  injuries: z.boolean(),
  injuryDetails: z.string().optional(),
  witnesses: z.string().optional(),
  policeReport: z.boolean(),
  policeReportNumber: z.string().optional(),
  estimatedCost: z.number().optional(),
})

type IncidentFormData = z.infer<typeof incidentSchema>

const mockVehicles = [
  { id: 'v001', name: 'Truck-001' },
  { id: 'v002', name: 'Van-002' },
  { id: 'v003', name: 'Truck-003' },
  { id: 'v004', name: 'Van-004' },
]

const mockDrivers = [
  { id: 'd001', name: 'John Smith' },
  { id: 'd002', name: 'Sarah Johnson' },
  { id: 'd003', name: 'Mike Davis' },
  { id: 'd004', name: 'Emily Brown' },
]

export function IncidentReport() {
  const [saved, setSaved] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      injuries: false,
      policeReport: false,
    },
  })

  const injuries = watch('injuries')
  const policeReport = watch('policeReport')

  const onSubmit = (data: IncidentFormData) => {
    console.log('Incident Report:', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleFileUpload = () => {
    // In production, this would handle actual file uploads
    setAttachments((prev) => [...prev, `photo-${prev.length + 1}.jpg`])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      low: { className: 'bg-green-100 text-green-800', label: 'Low' },
      medium: { className: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      high: { className: 'bg-orange-100 text-orange-800', label: 'High' },
      critical: { className: 'bg-red-100 text-red-800', label: 'Critical' },
    }
    return variants[severity] || variants.low
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report New Incident</CardTitle>
              <CardDescription>Document safety incidents and accidents</CardDescription>
            </div>
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Incident report saved successfully
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Incident Title</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Brief description of the incident"
                  />
                  {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Incident Type</Label>
                    <Select onValueChange={(value) => setValue('type', value as any)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="near_miss">Near Miss</SelectItem>
                        <SelectItem value="vehicle_damage">Vehicle Damage</SelectItem>
                        <SelectItem value="property_damage">Property Damage</SelectItem>
                        <SelectItem value="injury">Injury</SelectItem>
                        <SelectItem value="violation">Violation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select onValueChange={(value) => setValue('severity', value as any)}>
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.severity && (
                      <p className="text-sm text-red-600">{errors.severity.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" {...register('date')} />
                    {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" {...register('time')} />
                    {errors.time && <p className="text-sm text-red-600">{errors.time.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Street address or landmark"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle and Driver Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle & Driver</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label htmlFor="driverId">Driver</Label>
                    <Select onValueChange={(value) => setValue('driverId', value)}>
                      <SelectTrigger id="driverId">
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.driverId && (
                      <p className="text-sm text-red-600">{errors.driverId.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Provide a detailed description of what happened..."
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="injuries"
                      onCheckedChange={(checked) => setValue('injuries', checked as boolean)}
                    />
                    <Label htmlFor="injuries" className="font-normal">
                      Were there any injuries?
                    </Label>
                  </div>

                  {injuries && (
                    <div className="pl-6 space-y-2">
                      <Label htmlFor="injuryDetails">Injury Details</Label>
                      <Textarea
                        id="injuryDetails"
                        {...register('injuryDetails')}
                        placeholder="Describe the injuries sustained..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label htmlFor="witnesses">Witnesses</Label>
                  <Textarea
                    id="witnesses"
                    {...register('witnesses')}
                    placeholder="Names and contact information of witnesses (if any)"
                    rows={3}
                  />
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="policeReport"
                      onCheckedChange={(checked) => setValue('policeReport', checked as boolean)}
                    />
                    <Label htmlFor="policeReport" className="font-normal">
                      Was a police report filed?
                    </Label>
                  </div>

                  {policeReport && (
                    <div className="pl-6 space-y-2">
                      <Label htmlFor="policeReportNumber">Police Report Number</Label>
                      <Input
                        id="policeReportNumber"
                        {...register('policeReportNumber')}
                        placeholder="Report number"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-4">
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
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attachments</CardTitle>
                <CardDescription>Upload photos, documents, or other evidence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" variant="outline" onClick={handleFileUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Files
                </Button>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <span className="text-sm">{file}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
