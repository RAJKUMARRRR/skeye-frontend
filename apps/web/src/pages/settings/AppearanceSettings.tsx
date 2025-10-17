import { useState } from 'react'
import { Card, Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@fleet/ui-web'
import { Sun, Moon, Monitor, Save, CheckCircle } from 'lucide-react'

export function AppearanceSettings() {
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
          <h2 className="text-3xl font-bold tracking-tight">Appearance</h2>
          <p className="text-gray-600">Customize the look and feel of your application</p>
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
        {/* Left Column */}
        <div className="space-y-6">
          {/* Theme Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 border-2 border-accent rounded-lg bg-accent/5 transition-all hover:bg-accent/10">
                <Sun className="w-7 h-7 text-accent" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border-2 border-transparent rounded-lg hover:border-gray-300 transition-all">
                <Moon className="w-7 h-7" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border-2 border-transparent rounded-lg hover:border-gray-300 transition-all">
                <Monitor className="w-7 h-7" />
                <span className="text-sm font-medium">Auto</span>
              </button>
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Display</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Density</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Sidebar Icons</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Show icons in navigation</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Compact Tables</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Reduce table row height</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Animations</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Enable UI animations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Language & Region */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Time Format</Label>
                <Select defaultValue="12">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12-hour (2:30 PM)</SelectItem>
                    <SelectItem value="24">24-hour (14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Timezone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (PST)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (MST)</SelectItem>
                    <SelectItem value="utc-6">Central Time (CST)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (EST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Accessibility */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Accessibility</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">High Contrast</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Improve text readability</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Reduce Motion</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Minimize animations</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-sm font-medium">Large Text</Label>
                  <p className="text-xs text-gray-500 mt-0.5">Increase font sizes</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
