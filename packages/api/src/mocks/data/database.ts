import type {
  Organization,
  User,
  Vehicle,
  Driver,
  Device,
  Trip,
  Geofence,
  Alert,
} from '../../types'

interface Database {
  organizations: Map<string, Organization>
  users: Map<string, User>
  vehicles: Map<string, Vehicle>
  drivers: Map<string, Driver>
  devices: Map<string, Device>
  trips: Map<string, Trip>
  geofences: Map<string, Geofence>
  alerts: Map<string, Alert>
}

class MockDatabase {
  private db: Database = {
    organizations: new Map(),
    users: new Map(),
    vehicles: new Map(),
    drivers: new Map(),
    devices: new Map(),
    trips: new Map(),
    geofences: new Map(),
    alerts: new Map(),
  }

  getVehicles(organizationId?: string) {
    const vehicles = Array.from(this.db.vehicles.values())
    return organizationId
      ? vehicles.filter(v => v.organizationId === organizationId)
      : vehicles
  }

  getVehicle(id: string) {
    return this.db.vehicles.get(id)
  }

  createVehicle(vehicle: Vehicle) {
    this.db.vehicles.set(vehicle.id, vehicle)
    return vehicle
  }

  updateVehicle(id: string, data: Partial<Vehicle>) {
    const vehicle = this.db.vehicles.get(id)
    if (!vehicle) return null
    const updated = { ...vehicle, ...data, updatedAt: new Date().toISOString() }
    this.db.vehicles.set(id, updated)
    return updated
  }

  getDrivers(organizationId?: string) {
    const drivers = Array.from(this.db.drivers.values())
    return organizationId ? drivers.filter(d => d.organizationId === organizationId) : drivers
  }

  getDriver(id: string) {
    return this.db.drivers.get(id)
  }

  createDriver(driver: Driver) {
    this.db.drivers.set(driver.id, driver)
    return driver
  }

  createOrganization(org: Organization) {
    this.db.organizations.set(org.id, org)
    return org
  }

  getOrganizations() {
    return Array.from(this.db.organizations.values())
  }

  clear() {
    Object.values(this.db).forEach(collection => collection.clear())
  }
}

export const mockDb = new MockDatabase()
