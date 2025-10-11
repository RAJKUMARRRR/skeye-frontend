import { useState } from 'react'
import { Card, Button, Input } from '@fleet/ui-web'

interface VehicleGroup {
  id: string
  name: string
  description?: string
  vehicleIds: string[]
}

export function VehicleGroups() {
  const [groups, setGroups] = useState<VehicleGroup[]>([])
  const [showForm, setShowForm] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateGroup = () => {
    const newGroup: VehicleGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      description,
      vehicleIds: [],
    }
    setGroups([...groups, newGroup])
    setGroupName('')
    setDescription('')
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vehicle Groups</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Group'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Delivery Fleet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
            <Button onClick={handleCreateGroup} disabled={!groupName}>
              Create Group
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="p-4">
            <h4 className="font-semibold">{group.name}</h4>
            {group.description && (
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">{group.vehicleIds.length} vehicles</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
