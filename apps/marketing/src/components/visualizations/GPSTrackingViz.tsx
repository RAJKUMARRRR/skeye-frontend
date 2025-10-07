'use client'

import { motion } from 'framer-motion'

export function GPSTrackingViz() {
  const vehicles = [
    { id: 1, x: 30, y: 25, label: 'Truck A', speed: '45 mph' },
    { id: 2, x: 65, y: 40, label: 'Van B', speed: '38 mph' },
    { id: 3, x: 45, y: 65, label: 'Truck C', speed: '52 mph' },
    { id: 4, x: 75, y: 75, label: 'Van D', speed: '40 mph' },
  ]

  const routes = [
    { x1: 20, y1: 20, x2: 35, y2: 30 },
    { x1: 60, y1: 35, x2: 70, y2: 45 },
    { x1: 40, y1: 60, x2: 50, y2: 70 },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#3DD5AC_1px,transparent_1px),linear-gradient(to_bottom,#3DD5AC_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Map Roads */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        {/* Road lines */}
        <motion.path
          d="M 10 20 Q 30 25 45 35 T 80 60"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 25 80 Q 50 70 70 65 T 90 55"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />

        {/* Route highlights */}
        {routes.map((route, i) => (
          <motion.line
            key={i}
            x1={`${route.x1}%`}
            y1={`${route.y1}%`}
            x2={`${route.x2}%`}
            y2={`${route.y2}%`}
            stroke="#3DD5AC"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}
      </svg>

      {/* Vehicle Markers */}
      {vehicles.map((vehicle, i) => (
        <motion.div
          key={vehicle.id}
          className="absolute"
          style={{ left: `${vehicle.x}%`, top: `${vehicle.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />

          {/* Vehicle icon */}
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-primary shadow-lg shadow-primary/50">
              <svg className="h-full w-full p-1 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
          </div>

          {/* Info tooltip */}
          <motion.div
            className="absolute left-10 top-0 z-10 whitespace-nowrap rounded-md border border-primary/20 bg-black/90 px-2 py-1 text-xs backdrop-blur-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 0.5 }}
          >
            <div className="font-semibold text-primary">{vehicle.label}</div>
            <div className="text-muted-foreground">{vehicle.speed}</div>
          </motion.div>
        </motion.div>
      ))}

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-border/40 bg-black/80 px-3 py-2 backdrop-blur-sm">
        <div className="flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
        </div>
        <span className="text-xs font-medium text-foreground">Live Tracking</span>
      </div>

      {/* Stats */}
      <div className="absolute right-4 top-4 space-y-2">
        <div className="rounded-lg border border-border/40 bg-black/80 px-3 py-2 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground">Active Vehicles</div>
          <div className="text-lg font-bold text-primary">4</div>
        </div>
      </div>
    </div>
  )
}
