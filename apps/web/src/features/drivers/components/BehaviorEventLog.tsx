import { useState } from 'react'
import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@fleet/ui-web'

interface BehaviorEvent {
  id: string
  type: 'harsh_braking' | 'rapid_acceleration' | 'speeding' | 'excessive_idling'
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  location: string
  speed?: number
  details?: string
}

interface BehaviorEventLogProps {
  driverId: string
}

const mockEvents: BehaviorEvent[] = [
  {
    id: '1',
    type: 'harsh_braking',
    severity: 'high',
    timestamp: new Date().toISOString(),
    location: '123 Main St, City',
    speed: 65,
  },
  {
    id: '2',
    type: 'speeding',
    severity: 'medium',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: '456 Oak Ave, City',
    speed: 85,
  },
]

export function BehaviorEventLog({ driverId }: BehaviorEventLogProps) {
  const [filter, setFilter] = useState<string>('all')

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      harsh_braking: '🚨',
      rapid_acceleration: '💨',
      speeding: '⚡',
      excessive_idling: '⏸️',
    }
    return icons[type] || '📍'
  }

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      low: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[severity]}`}>
        {severity}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="all">All Events</option>
            <option value="harsh_braking">Harsh Braking</option>
            <option value="rapid_acceleration">Rapid Acceleration</option>
            <option value="speeding">Speeding</option>
            <option value="excessive_idling">Excessive Idling</option>
          </select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Speed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{getEventIcon(event.type)}</span>
                    <span className="capitalize">{event.type.replace('_', ' ')}</span>
                  </div>
                </TableCell>
                <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.speed ? `${event.speed} km/h` : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
