import { faker } from '@faker-js/faker'
import type { Organization } from '../../../types'

export function generateOrganization(id?: string): Organization {
  return {
    id: id || faker.string.uuid(),
    name: faker.company.name(),
    logo: faker.image.url(),
    subscriptionTier: faker.helpers.arrayElement(['trial', 'basic', 'pro', 'enterprise']),
    maxVehicles: faker.helpers.arrayElement([50, 100, 500, 5000]),
    maxUsers: faker.helpers.arrayElement([10, 25, 100, 500]),
    features: ['tracking', 'geofencing', 'alerts', 'reports'],
    settings: {
      timezone: faker.location.timeZone(),
      dateFormat: 'MM/DD/YYYY',
      distanceUnit: faker.helpers.arrayElement(['km', 'mi']),
      speedUnit: faker.helpers.arrayElement(['kmh', 'mph']),
      currency: faker.finance.currencyCode(),
      locale: faker.helpers.arrayElement(['en', 'es', 'fr', 'de', 'hi']),
    },
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }
}
