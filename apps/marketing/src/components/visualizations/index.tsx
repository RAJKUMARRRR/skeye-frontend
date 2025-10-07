export { GPSTrackingViz } from './GPSTrackingViz'
export { GeofenceViz } from './GeofenceViz'
export { RouteOptimizationViz } from './RouteOptimizationViz'

// Additional compact visualizations
import { motion } from 'framer-motion'

export function VehicleDiagnosticsViz() {
  const metrics = [
    { label: 'Engine', value: 98, color: '#3DD5AC' },
    { label: 'Battery', value: 85, color: '#3DD5AC' },
    { label: 'Fuel', value: 72, color: '#3DD5AC' },
    { label: 'Tires', value: 90, color: '#3DD5AC' },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#0a0a0a] to-[#050505] p-6">
      <div className="space-y-4">
        {metrics.map((metric, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-bold text-primary">{metric.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: metric.color }}
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-primary">All systems operational</span>
        </div>
      </div>
    </div>
  )
}

export function DriverSafetyViz() {
  const events = [
    { time: '10:23', type: 'Safe', icon: '✓' },
    { time: '11:45', type: 'Speed', icon: '⚠' },
    { time: '12:10', type: 'Safe', icon: '✓' },
    { time: '14:30', type: 'Brake', icon: '⚠' },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#0a0a0a] to-[#050505] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Safety Score</div>
          <motion.div
            className="text-4xl font-bold text-primary"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            92
          </motion.div>
        </div>
        <div className="relative h-16 w-16">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#3DD5AC"
              strokeWidth="3"
              strokeDasharray="100"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 8 }}
              transition={{ duration: 1.5 }}
            />
          </svg>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((event, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-between rounded-lg border border-border/20 bg-white/5 p-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2">
              <span className={`text-sm ${event.type === 'Safe' ? 'text-primary' : 'text-yellow-500'}`}>
                {event.icon}
              </span>
              <span className="text-xs text-muted-foreground">{event.time}</span>
            </div>
            <span className="text-xs font-medium">{event.type}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsDashboardViz() {
  const data = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 52 },
    { label: 'Thu', value: 85 },
    { label: 'Fri', value: 92 },
    { label: 'Sat', value: 45 },
    { label: 'Sun', value: 38 },
  ]

  const max = Math.max(...data.map(d => d.value))

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#0a0a0a] to-[#050505] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Weekly Overview</div>
          <div className="text-2xl font-bold text-primary">+18%</div>
        </div>
      </div>

      <div className="flex h-32 items-end justify-between gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/50"
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Distance', value: '2.4k mi' },
          { label: 'Fuel', value: '$8.2k' },
          { label: 'Trips', value: '147' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="rounded-lg border border-border/20 bg-white/5 p-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.5 }}
          >
            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            <div className="text-sm font-bold text-primary">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
