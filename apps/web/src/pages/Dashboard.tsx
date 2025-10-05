import { useVehicles } from '../hooks/useVehicles'

export function Dashboard() {
  const { data: vehicles, isLoading } = useVehicles()

  if (isLoading) {
    return <div className="text-gray-600">Loading...</div>
  }

  const stats = {
    total: vehicles?.length || 0,
    active: vehicles?.filter(v => v.status === 'active').length || 0,
    idle: vehicles?.filter(v => v.status === 'idle').length || 0,
    maintenance: vehicles?.filter(v => v.status === 'maintenance').length || 0,
    offline: vehicles?.filter(v => v.status === 'offline').length || 0,
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Vehicles</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-green-500 truncate">Active</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.active}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-yellow-500 truncate">Idle</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.idle}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-orange-500 truncate">Maintenance</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.maintenance}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-red-500 truncate">Offline</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.offline}</dd>
          </div>
        </div>
      </div>
    </div>
  )
}
