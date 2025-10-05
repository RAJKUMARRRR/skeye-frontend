import { faker } from '@faker-js/faker'
import type { Driver } from '../../../types'

export function generateDriver(organizationId: string): Driver {
  return {
    id: faker.string.uuid(),
    organizationId,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    photoUrl: faker.image.avatar(),
    licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
    licenseExpiry: faker.date.future().toISOString(),
    licenseState: faker.location.state({ abbreviated: true }),
    licenseClass: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
    status: faker.helpers.arrayElement(['active', 'inactive', 'suspended']),
    assignedVehicleIds: [],
    performanceScore: faker.number.int({ min: 60, max: 100 }),
    totalTrips: faker.number.int({ min: 0, max: 1000 }),
    totalDistance: faker.number.int({ min: 0, max: 100000 }),
    totalDrivingHours: faker.number.int({ min: 0, max: 5000 }),
    behaviorMetrics: {
      harshBraking: faker.number.int({ min: 0, max: 50 }),
      rapidAcceleration: faker.number.int({ min: 0, max: 50 }),
      speeding: faker.number.int({ min: 0, max: 50 }),
      idling: faker.number.int({ min: 0, max: 50 }),
      score: faker.number.int({ min: 60, max: 100 }),
      lastCalculated: faker.date.recent().toISOString(),
    },
    groupIds: [],
    metadata: {},
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }
}
