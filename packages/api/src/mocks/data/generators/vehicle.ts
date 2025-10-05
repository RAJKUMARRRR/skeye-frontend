import { faker } from '@faker-js/faker'
import type { Vehicle } from '../../../types'

export function generateVehicle(organizationId: string): Vehicle {
  const lat = faker.location.latitude()
  const lng = faker.location.longitude()
  
  return {
    id: faker.string.uuid(),
    organizationId,
    deviceId: faker.string.uuid(),
    make: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.number.int({ min: 2015, max: 2024 }),
    vin: faker.vehicle.vin(),
    licensePlate: faker.vehicle.vrm(),
    color: faker.vehicle.color(),
    vehicleType: faker.helpers.arrayElement(['car', 'truck', 'van', 'motorcycle', 'other']),
    odometer: faker.number.int({ min: 10000, max: 200000 }),
    fuelLevel: faker.number.int({ min: 0, max: 100 }),
    engineHours: faker.number.int({ min: 100, max: 10000 }),
    batteryVoltage: faker.number.float({ min: 11.5, max: 14.5, fractionDigits: 1 }),
    status: faker.helpers.arrayElement(['active', 'idle', 'parked', 'maintenance', 'offline']),
    location: {
      lat,
      lng,
      timestamp: new Date().toISOString(),
      speed: faker.number.int({ min: 0, max: 120 }),
      heading: faker.number.int({ min: 0, max: 359 }),
      accuracy: faker.number.int({ min: 5, max: 20 }),
    },
    telemetry: {
      speed: faker.number.int({ min: 0, max: 120 }),
      odometer: faker.number.int({ min: 10000, max: 200000 }),
      fuelLevel: faker.number.int({ min: 0, max: 100 }),
      engineHours: faker.number.int({ min: 100, max: 10000 }),
      batteryVoltage: faker.number.float({ min: 11.5, max: 14.5, fractionDigits: 1 }),
    },
    groupIds: [],
    metadata: {},
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }
}
