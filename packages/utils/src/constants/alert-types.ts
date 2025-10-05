export enum AlertType {
  SPEED_THRESHOLD = 'speed_threshold',
  GEOFENCE_ENTRY = 'geofence_entry',
  GEOFENCE_EXIT = 'geofence_exit',
  IDLE_TIME = 'idle_time',
  FUEL_LEVEL_LOW = 'fuel_level_low',
  MAINTENANCE_DUE = 'maintenance_due',
  HARSH_BRAKING = 'harsh_braking',
  RAPID_ACCELERATION = 'rapid_acceleration',
  DEVICE_OFFLINE = 'device_offline',
  BATTERY_LOW = 'battery_low',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  [AlertType.SPEED_THRESHOLD]: 'Speed Threshold Exceeded',
  [AlertType.GEOFENCE_ENTRY]: 'Geofence Entry',
  [AlertType.GEOFENCE_EXIT]: 'Geofence Exit',
  [AlertType.IDLE_TIME]: 'Excessive Idle Time',
  [AlertType.FUEL_LEVEL_LOW]: 'Low Fuel Level',
  [AlertType.MAINTENANCE_DUE]: 'Maintenance Due',
  [AlertType.HARSH_BRAKING]: 'Harsh Braking Detected',
  [AlertType.RAPID_ACCELERATION]: 'Rapid Acceleration Detected',
  [AlertType.DEVICE_OFFLINE]: 'Device Offline',
  [AlertType.BATTERY_LOW]: 'Low Battery',
}

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: 'Low',
  [AlertSeverity.MEDIUM]: 'Medium',
  [AlertSeverity.HIGH]: 'High',
  [AlertSeverity.CRITICAL]: 'Critical',
}

export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: 'blue',
  [AlertSeverity.MEDIUM]: 'yellow',
  [AlertSeverity.HIGH]: 'orange',
  [AlertSeverity.CRITICAL]: 'red',
}
