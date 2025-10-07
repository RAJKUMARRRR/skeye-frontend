'use client'

import { motion } from 'framer-motion'

export function GeofenceViz() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#3DD5AC_1px,transparent_1px),linear-gradient(to_bottom,#3DD5AC_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        {/* Geofence zones */}
        <motion.circle
          cx="35"
          cy="35"
          r="18"
          fill="rgba(61, 213, 172, 0.1)"
          stroke="#3DD5AC"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.path
          d="M 55 55 L 80 55 L 85 75 L 70 80 L 55 75 Z"
          fill="rgba(61, 213, 172, 0.1)"
          stroke="#3DD5AC"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Vehicle entering zone */}
        <motion.circle
          cx="35"
          cy="35"
          r="2"
          fill="#3DD5AC"
          initial={{ cx: 10, cy: 10 }}
          animate={{ cx: 35, cy: 35 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Alert indicator */}
        <motion.circle
          cx="35"
          cy="35"
          r="3"
          fill="none"
          stroke="#3DD5AC"
          strokeWidth="0.5"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </svg>

      {/* Zone labels */}
      <motion.div
        className="absolute left-[20%] top-[25%] rounded-md border border-primary/20 bg-black/90 px-2 py-1 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs font-semibold text-primary">Warehouse Zone</div>
        <div className="text-[10px] text-muted-foreground">Active</div>
      </motion.div>

      <motion.div
        className="absolute right-[15%] top-[55%] rounded-md border border-primary/20 bg-black/90 px-2 py-1 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="text-xs font-semibold text-primary">Delivery Area</div>
        <div className="text-[10px] text-muted-foreground">Active</div>
      </motion.div>

      {/* Alert badge */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 backdrop-blur-sm">
        <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium text-primary">Zone Entry Detected</span>
      </div>

      {/* Stats */}
      <div className="absolute right-4 top-4 rounded-lg border border-border/40 bg-black/80 px-3 py-2 backdrop-blur-sm">
        <div className="text-xs text-muted-foreground">Active Zones</div>
        <div className="text-lg font-bold text-primary">2</div>
      </div>
    </div>
  )
}
