import { useState } from 'react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@fleet/ui-web'
import { WorkOrderList } from '../features/maintenance/components/WorkOrderList'
import { WorkOrderForm } from '../features/maintenance/components/WorkOrderForm'
import { InventoryManagement } from '../features/maintenance/components/InventoryManagement'

export function Maintenance() {
  const [activeTab, setActiveTab] = useState('work-orders')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Maintenance Management</h2>
          <p className="text-gray-600">Manage work orders, inventory, and maintenance schedules</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="create">Create Work Order</TabsTrigger>
          <TabsTrigger value="inventory">Parts Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="work-orders" className="space-y-6">
          <WorkOrderList />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <WorkOrderForm />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <InventoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
