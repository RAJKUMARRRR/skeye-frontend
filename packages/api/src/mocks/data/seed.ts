import { mockDb } from './database'
import { generateOrganization, generateVehicle, generateDriver } from './generators'

export function seedDatabase() {
  // Clear existing data
  mockDb.clear()

  // Create organization
  const org = generateOrganization('org-1')
  mockDb.createOrganization(org)

  // Create 500 vehicles
  console.log('Seeding vehicles...')
  for (let i = 0; i < 500; i++) {
    const vehicle = generateVehicle(org.id)
    mockDb.createVehicle(vehicle)
  }

  // Create 100 drivers
  console.log('Seeding drivers...')
  for (let i = 0; i < 100; i++) {
    const driver = generateDriver(org.id)
    mockDb.createDriver(driver)
  }

  console.log('Database seeded successfully!')
  console.log(`- Organizations: ${mockDb.getOrganizations().length}`)
  console.log(`- Vehicles: ${mockDb.getVehicles().length}`)
  console.log(`- Drivers: ${mockDb.getDrivers().length}`)
}
