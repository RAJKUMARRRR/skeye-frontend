import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Label,
} from '@fleet/ui-web'
import { Key, Globe, Database, Building2, Save, CheckCircle } from 'lucide-react'

export function Integrations() {
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
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <p className="text-gray-600">Connect with external services and manage API access</p>
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
          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Current API Key</Label>
                <div className="flex items-center gap-2">
                  <Input value="sk_live_••••••••••••••••••••1234" readOnly />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Generate New Key
              </Button>
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook-url" className="text-sm font-medium mb-2 block">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-domain.com/webhook" />
              </div>
              <Button variant="outline">Add Webhook</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Connected Services */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Google Maps</div>
                    <div className="text-sm text-muted-foreground">Route optimization and mapping</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600">Connected</span>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Telematics Provider</div>
                    <div className="text-sm text-muted-foreground">Vehicle data and diagnostics</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Not Connected</span>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Accounting Software</div>
                    <div className="text-sm text-muted-foreground">Financial data sync</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Not Connected</span>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
