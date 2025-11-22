import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fleet/ui-web'
import { Save, CheckCircle } from 'lucide-react'

export function OrganizationSettings() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organization</h2>
          <p className="text-gray-600">Manage your organization and fleet information</p>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Saved
            </div>
          )}
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="org-name" className="text-sm font-medium mb-2 block">Organization Name</Label>
              <Input id="org-name" placeholder="Acme Fleet Services" defaultValue="Acme Fleet Services" />
            </div>
            <div>
              <Label htmlFor="org-email" className="text-sm font-medium mb-2 block">Contact Email</Label>
              <Input id="org-email" type="email" placeholder="contact@fleet.com" defaultValue="admin@fleet.com" />
            </div>
            <div>
              <Label htmlFor="org-phone" className="text-sm font-medium mb-2 block">Phone Number</Label>
              <Input id="org-phone" type="tel" placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
            </div>
            <div>
              <Label htmlFor="org-address" className="text-sm font-medium mb-2 block">Address</Label>
              <Input id="org-address" placeholder="123 Main St, Chicago, IL 60601" defaultValue="123 Main St, Chicago, IL 60601" />
            </div>
            <div>
              <Label htmlFor="org-timezone" className="text-sm font-medium mb-2 block">Timezone</Label>
              <Select defaultValue="america-chicago">
                <SelectTrigger id="org-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                  <SelectItem value="america-chicago">America/Chicago (CST)</SelectItem>
                  <SelectItem value="america-denver">America/Denver (MST)</SelectItem>
                  <SelectItem value="america-los-angeles">America/Los Angeles (PST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Fleet Information */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fleet-size" className="text-sm font-medium mb-2 block">Fleet Size</Label>
              <Input id="fleet-size" type="number" defaultValue="50" />
            </div>
            <div>
              <Label htmlFor="distance-unit" className="text-sm font-medium mb-2 block">Distance Unit</Label>
              <Select defaultValue="km">
                <SelectTrigger id="distance-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="mi">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fuel-unit" className="text-sm font-medium mb-2 block">Fuel Unit</Label>
              <Select defaultValue="liters">
                <SelectTrigger id="fuel-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="gallons">Gallons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency" className="text-sm font-medium mb-2 block">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
