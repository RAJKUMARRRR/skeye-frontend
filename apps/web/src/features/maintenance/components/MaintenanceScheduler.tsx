import { useState } from 'react'
import {
  Card,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@fleet/ui-web'

interface MaintenanceSchedulerProps {
  vehicleId?: string
  onSave: (schedule: any) => void
  onCancel: () => void
}

export function MaintenanceScheduler({ vehicleId, onSave, onCancel }: MaintenanceSchedulerProps) {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleId || '')
  const [maintenanceType, setMaintenanceType] = useState('')
  const [scheduleBy, setScheduleBy] = useState<'date' | 'mileage' | 'both'>('both')
  const [dueDate, setDueDate] = useState('')
  const [dueMileage, setDueMileage] = useState('')
  const [reminderDays, setReminderDays] = useState('7')
  const [reminderMileage, setReminderMileage] = useState('500')
  const [notes, setNotes] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [recurringInterval, setRecurringInterval] = useState('6')
  const [recurringMileageInterval, setRecurringMileageInterval] = useState('10000')

  const handleSave = () => {
    if (!selectedVehicle || !maintenanceType) {
      alert('Please fill all required fields')
      return
    }

    if (scheduleBy === 'date' && !dueDate) {
      alert('Please specify a due date')
      return
    }

    if (scheduleBy === 'mileage' && !dueMileage) {
      alert('Please specify due mileage')
      return
    }

    if (scheduleBy === 'both' && (!dueDate || !dueMileage)) {
      alert('Please specify both due date and mileage')
      return
    }

    onSave({
      vehicleId: selectedVehicle,
      type: maintenanceType,
      scheduleBy,
      dueDate: scheduleBy !== 'mileage' ? dueDate : undefined,
      dueMileage: scheduleBy !== 'date' ? dueMileage : undefined,
      reminderDays: scheduleBy !== 'mileage' ? reminderDays : undefined,
      reminderMileage: scheduleBy !== 'date' ? reminderMileage : undefined,
      notes,
      recurring,
      recurringInterval: recurring ? recurringInterval : undefined,
      recurringMileageInterval: recurring ? recurringMileageInterval : undefined,
    })
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Schedule Maintenance</h3>
        <p className="text-sm text-gray-600 mt-1">
          Schedule preventive maintenance based on time or mileage
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Vehicle *</Label>
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">TN-01-AB-1234</SelectItem>
              <SelectItem value="2">TN-01-CD-5678</SelectItem>
              <SelectItem value="3">TN-01-EF-9012</SelectItem>
              <SelectItem value="4">TN-01-GH-3456</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Maintenance Type *</Label>
          <Select value={maintenanceType} onValueChange={setMaintenanceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oil_change">Oil Change</SelectItem>
              <SelectItem value="tire_rotation">Tire Rotation</SelectItem>
              <SelectItem value="brake_inspection">Brake Inspection</SelectItem>
              <SelectItem value="battery_check">Battery Check</SelectItem>
              <SelectItem value="air_filter">Air Filter Replacement</SelectItem>
              <SelectItem value="transmission">Transmission Service</SelectItem>
              <SelectItem value="annual_inspection">Annual Inspection</SelectItem>
              <SelectItem value="custom">Custom Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Schedule By *</Label>
          <RadioGroup value={scheduleBy} onValueChange={(v) => setScheduleBy(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="date" id="date" />
              <Label htmlFor="date">Date Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mileage" id="mileage" />
              <Label htmlFor="mileage">Mileage Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Both (whichever comes first)</Label>
            </div>
          </RadioGroup>
        </div>

        {(scheduleBy === 'date' || scheduleBy === 'both') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label>Reminder (days before)</Label>
              <Input
                type="number"
                value={reminderDays}
                onChange={(e) => setReminderDays(e.target.value)}
                min="1"
                max="30"
              />
              <p className="text-xs text-gray-600 mt-1">Alert {reminderDays} days before due</p>
            </div>
          </div>
        )}

        {(scheduleBy === 'mileage' || scheduleBy === 'both') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Mileage (km) *</Label>
              <Input
                type="number"
                value={dueMileage}
                onChange={(e) => setDueMileage(e.target.value)}
                min="0"
                step="100"
              />
            </div>
            <div>
              <Label>Reminder (km before)</Label>
              <Input
                type="number"
                value={reminderMileage}
                onChange={(e) => setReminderMileage(e.target.value)}
                min="0"
                step="100"
              />
              <p className="text-xs text-gray-600 mt-1">
                Alert {reminderMileage} km before due
              </p>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label>Recurring Maintenance</Label>
            <Button
              size="sm"
              variant={recurring ? 'default' : 'outline'}
              onClick={() => setRecurring(!recurring)}
            >
              {recurring ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          {recurring && (
            <div className="grid grid-cols-2 gap-4 pl-4">
              {(scheduleBy === 'date' || scheduleBy === 'both') && (
                <div>
                  <Label>Repeat Every (months)</Label>
                  <Input
                    type="number"
                    value={recurringInterval}
                    onChange={(e) => setRecurringInterval(e.target.value)}
                    min="1"
                    max="12"
                  />
                </div>
              )}
              {(scheduleBy === 'mileage' || scheduleBy === 'both') && (
                <div>
                  <Label>Repeat Every (km)</Label>
                  <Input
                    type="number"
                    value={recurringMileageInterval}
                    onChange={(e) => setRecurringMileageInterval(e.target.value)}
                    min="1000"
                    step="1000"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <Label>Notes (Optional)</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about this maintenance..."
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Schedule Maintenance
        </Button>
      </div>
    </Card>
  )
}
