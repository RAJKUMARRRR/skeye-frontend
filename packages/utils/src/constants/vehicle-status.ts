export enum VehicleStatus {
  ACTIVE = 'active',
  IDLE = 'idle',
  PARKED = 'parked',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline',
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  [VehicleStatus.ACTIVE]: 'Active',
  [VehicleStatus.IDLE]: 'Idle',
  [VehicleStatus.PARKED]: 'Parked',
  [VehicleStatus.MAINTENANCE]: 'Maintenance',
  [VehicleStatus.OFFLINE]: 'Offline',
}

export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
  [VehicleStatus.ACTIVE]: 'green',
  [VehicleStatus.IDLE]: 'yellow',
  [VehicleStatus.PARKED]: 'blue',
  [VehicleStatus.MAINTENANCE]: 'orange',
  [VehicleStatus.OFFLINE]: 'gray',
}
