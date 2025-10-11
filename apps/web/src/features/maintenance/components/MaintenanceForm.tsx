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
} from '@fleet/ui-web'

interface MaintenanceFormProps {
  vehicleId?: string
  onSave: (record: any) => void
  onCancel: () => void
}

export function MaintenanceForm({ vehicleId, onSave, onCancel }: MaintenanceFormProps) {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleId || '')
  const [maintenanceType, setMaintenanceType] = useState('')
  const [customType, setCustomType] = useState('')
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [odometer, setOdometer] = useState('')
  const [cost, setCost] = useState('')
  const [provider, setProvider] = useState('')
  const [providerContact, setProviderContact] = useState('')
  const [description, setDescription] = useState('')
  const [partsReplaced, setPartsReplaced] = useState('')
  const [laborHours, setLaborHours] = useState('')
  const [warranty, setWarranty] = useState('')
  const [nextDueDate, setNextDueDate] = useState('')
  const [nextDueMileage, setNextDueMileage] = useState('')
  const [receiptFiles, setReceiptFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReceiptFiles(Array.from(e.target.files))
    }
  }

  const handleSave = () => {
    if (!selectedVehicle || !maintenanceType || !completionDate || !odometer) {
      alert('Please fill all required fields')
      return
    }

    const type = maintenanceType === 'custom' ? customType : maintenanceType

    if (maintenanceType === 'custom' && !customType.trim()) {
      alert('Please specify custom maintenance type')
      return
    }

    onSave({
      vehicleId: selectedVehicle,
      type,
      completionDate,
      odometer: parseInt(odometer),
      cost: cost ? parseFloat(cost) : undefined,
      provider,
      providerContact,
      description,
      partsReplaced,
      laborHours: laborHours ? parseFloat(laborHours) : undefined,
      warranty,
      nextDueDate: nextDueDate || undefined,
      nextDueMileage: nextDueMileage ? parseInt(nextDueMileage) : undefined,
      receiptFiles,
    })
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Log Completed Maintenance</h3>
        <p className="text-sm text-gray-600 mt-1">
          Record maintenance work that has been completed
        </p>
      </div>

      <div className="space-y-4">
        {/* Vehicle Selection */}
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

        {/* Maintenance Type */}
        <div>
          <Label>Maintenance Type *</Label>
          <Select value={maintenanceType} onValueChange={setMaintenanceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oil_change">Oil Change</SelectItem>
              <SelectItem value="tire_rotation">Tire Rotation</SelectItem>
              <SelectItem value="brake_service">Brake Service</SelectItem>
              <SelectItem value="battery_replacement">Battery Replacement</SelectItem>
              <SelectItem value="air_filter">Air Filter Replacement</SelectItem>
              <SelectItem value="transmission">Transmission Service</SelectItem>
              <SelectItem value="tire_replacement">Tire Replacement</SelectItem>
              <SelectItem value="engine_repair">Engine Repair</SelectItem>
              <SelectItem value="inspection">Annual Inspection</SelectItem>
              <SelectItem value="custom">Custom Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {maintenanceType === 'custom' && (
          <div>
            <Label>Custom Type *</Label>
            <Input
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              placeholder="e.g., AC Repair, Window Replacement"
            />
          </div>
        )}

        {/* Date and Odometer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Completion Date *</Label>
            <Input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label>Odometer Reading (km) *</Label>
            <Input
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              placeholder="e.g., 15000"
              min="0"
            />
          </div>
        </div>

        {/* Cost and Provider */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Total Cost (₹)</Label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g., 2500"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label>Service Provider</Label>
            <Input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g., AutoCare Center"
            />
          </div>
        </div>

        {/* Provider Contact and Labor Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Provider Contact</Label>
            <Input
              value={providerContact}
              onChange={(e) => setProviderContact(e.target.value)}
              placeholder="Phone or email"
            />
          </div>
          <div>
            <Label>Labor Hours</Label>
            <Input
              type="number"
              value={laborHours}
              onChange={(e) => setLaborHours(e.target.value)}
              placeholder="e.g., 2.5"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of work performed..."
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Parts Replaced */}
        <div>
          <Label>Parts Replaced</Label>
          <textarea
            value={partsReplaced}
            onChange={(e) => setPartsReplaced(e.target.value)}
            placeholder="List of parts replaced (one per line)..."
            rows={2}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Warranty */}
        <div>
          <Label>Warranty Period</Label>
          <Input
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
            placeholder="e.g., 6 months / 10,000 km"
          />
        </div>

        {/* Next Due */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Next Service Due (Optional)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label>Due Mileage (km)</Label>
              <Input
                type="number"
                value={nextDueMileage}
                onChange={(e) => setNextDueMileage(e.target.value)}
                placeholder="e.g., 20000"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Receipt Upload */}
        <div>
          <Label>Receipts / Documents</Label>
          <Input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {receiptFiles.length > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {receiptFiles.length} file(s) selected
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Save Record
        </Button>
      </div>
    </Card>
  )
}
