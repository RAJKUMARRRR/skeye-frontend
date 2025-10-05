import { faker } from '@faker-js/faker'
import type { Vehicle, Driver, Alert, Location } from '../../types'

export function generateLocation(): Location {
  return {
    lat: faker.location.latitude({ min: 37.0, max: 38.0 }),
    lng: faker.location.longitude({ min: -122.5, max: -121.5 }),
    speed: faker.number.int({ min: 0, max: 120 }),
    heading: faker.number.int({ min: 0, max: 360 }),
    timestamp: new Date().toISOString(),
  }
}

export function generateVehicle(overrides?: Partial<Vehicle>): Vehicle {
  const makes = ['Ford', 'Chevrolet', 'Toyota', 'Mercedes-Benz', 'Volvo', 'Freightliner']
  const make = faker.helpers.arrayElement(makes)

  return {
    id: faker.string.uuid(),
    licensePlate: faker.vehicle.vrm(),
    make,
    model: faker.vehicle.model(),
    year: faker.number.int({ min: 2018, max: 2024 }),
    vin: faker.vehicle.vin(),
    status: faker.helpers.arrayElement(['active', 'idle', 'maintenance', 'offline']),
    fuelLevel: faker.number.int({ min: 10, max: 100 }),
    odometer: faker.number.int({ min: 10000, max: 200000 }),
    location: generateLocation(),
    driverId: faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.7 }),
    lastUpdate: new Date().toISOString(),
    ...overrides,
  }
}

export function generateVehicles(count: number): Vehicle[] {
  return Array.from({ length: count }, () => generateVehicle())
}

export function generateDriver(overrides?: Partial<Driver>): Driver {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
    status: faker.helpers.arrayElement(['available', 'on-trip', 'off-duty']),
    currentVehicleId: faker.helpers.maybe(() => faker.string.uuid(), { probability: 0.5 }),
    ...overrides,
  }
}

export function generateDrivers(count: number): Driver[] {
  return Array.from({ length: count }, () => generateDriver())
}

export function generateAlert(overrides?: Partial<Alert>): Alert {
  const types = ['speeding', 'harsh-braking', 'low-fuel', 'maintenance', 'geofence'] as const
  const type = faker.helpers.arrayElement(types)

  const messages = {
    speeding: 'Vehicle exceeded speed limit',
    'harsh-braking': 'Harsh braking detected',
    'low-fuel': 'Fuel level is low',
    maintenance: 'Maintenance required',
    geofence: 'Vehicle left geofence area',
  }

  return {
    id: faker.string.uuid(),
    vehicleId: faker.string.uuid(),
    type,
    severity: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    message: messages[type],
    timestamp: faker.date.recent({ days: 7 }).toISOString(),
    acknowledged: faker.datatype.boolean(),
    ...overrides,
  }
}

export function generateAlerts(count: number): Alert[] {
  return Array.from({ length: count }, () => generateAlert())
}
