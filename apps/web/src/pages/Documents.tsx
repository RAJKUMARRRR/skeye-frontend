import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { DocumentManager } from '../features/documents/components/DocumentManager'
import { DocumentUpload } from '../features/documents/components/DocumentUpload'

export function Documents() {
  const [activeTab, setActiveTab] = useState('library')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-gray-600">Manage fleet documentation and files</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="library">Document Library</TabsTrigger>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <DocumentManager />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <DocumentUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}
