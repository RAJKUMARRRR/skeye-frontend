import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
  Label,
  Badge,
} from '@fleet/ui-web'

interface Alert {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  vehicleName: string
  message: string
  timestamp: string
}

interface AlertAcknowledgmentProps {
  alert: Alert | null
  isOpen: boolean
  onClose: () => void
  onAcknowledge: (alertId: string, notes: string, resolveImmediately: boolean) => void
}

export function AlertAcknowledgment({
  alert,
  isOpen,
  onClose,
  onAcknowledge,
}: AlertAcknowledgmentProps) {
  const [notes, setNotes] = useState('')
  const [resolveImmediately, setResolveImmediately] = useState(false)

  const handleAcknowledge = () => {
    if (!alert) return

    if (!notes.trim()) {
      alert('Please add acknowledgment notes')
      return
    }

    onAcknowledge(alert.id, notes, resolveImmediately)
    setNotes('')
    setResolveImmediately(false)
    onClose()
  }

  const handleCancel = () => {
    setNotes('')
    setResolveImmediately(false)
    onClose()
  }

  if (!alert) return null

  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-blue-100 text-blue-800 border-blue-300',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Acknowledge Alert</DialogTitle>
          <DialogDescription>
            Review the alert details and provide acknowledgment notes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert Details */}
          <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Alert Type:</span>
              <span className="font-medium">{alert.type}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Severity:</span>
              <Badge variant="outline" className={severityColors[alert.severity]}>
                {alert.severity}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Vehicle:</span>
              <span className="font-medium">{alert.vehicleName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Time:</span>
              <span className="text-sm">{new Date(alert.timestamp).toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t">
              <span className="font-semibold text-gray-700">Message:</span>
              <p className="mt-1 text-gray-900">{alert.message}</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Acknowledgment Notes *</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the action taken or reason for acknowledgment..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-gray-600 mt-1">
              Provide details about how this alert was handled or what steps were taken
            </p>
          </div>

          {/* Action Options */}
          <div className="space-y-2">
            <Label>Action</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setResolveImmediately(false)}
                className={`flex-1 p-3 border rounded-lg transition-colors ${
                  !resolveImmediately
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Acknowledge Only</div>
                <div className="text-xs text-gray-600 mt-1">
                  Mark as acknowledged, continue monitoring
                </div>
              </button>
              <button
                onClick={() => setResolveImmediately(true)}
                className={`flex-1 p-3 border rounded-lg transition-colors ${
                  resolveImmediately
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Acknowledge & Resolve</div>
                <div className="text-xs text-gray-600 mt-1">
                  Mark as resolved immediately
                </div>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAcknowledge}>
            {resolveImmediately ? 'Acknowledge & Resolve' : 'Acknowledge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
