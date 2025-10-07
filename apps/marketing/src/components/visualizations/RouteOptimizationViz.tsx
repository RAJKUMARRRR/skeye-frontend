'use client'

import { motion } from 'framer-motion'

export function RouteOptimizationViz() {
  const waypoints = [
    { x: 20, y: 30, label: 'A' },
    { x: 45, y: 25, label: 'B' },
    { x: 70, y: 40, label: 'C' },
    { x: 60, y: 65, label: 'D' },
    { x: 30, y: 70, label: 'E' },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#3DD5AC_1px,transparent_1px),linear-gradient(to_bottom,#3DD5AC_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        {/* Old inefficient route (dimmed) */}
        <motion.path
          d="M 20 30 L 30 70 L 60 65 L 70 40 L 45 25"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5 }}
        />

        {/* Optimized route (highlighted) */}
        <motion.path
          d="M 20 30 L 45 25 L 70 40 L 60 65 L 30 70"
          stroke="#3DD5AC"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Animated vehicle on route */}
        <motion.circle
          r="2"
          fill="#3DD5AC"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: "path('M 20 30 L 45 25 L 70 40 L 60 65 L 30 70')" }}
        />
      </svg>

      {/* Waypoints */}
      {waypoints.map((point, i) => (
        <motion.div
          key={i}
          className="absolute flex h-8 w-8 items-center justify-center"
          style={{ left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%, -50%)' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 + 0.3 }}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-black text-xs font-bold text-primary">
            {point.label}
          </div>
        </motion.div>
      ))}

      {/* Route info */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="rounded-lg border border-border/40 bg-black/80 px-3 py-2 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground">Distance Saved</div>
          <div className="text-lg font-bold text-primary">-12.4 mi</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 space-y-2">
        <div className="rounded-lg border border-border/40 bg-black/80 px-3 py-2 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground">Time Saved</div>
          <div className="text-lg font-bold text-primary">-23 min</div>
        </div>
      </div>

      {/* Optimization badge */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 backdrop-blur-sm">
        <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-xs font-medium text-primary">AI Optimized</span>
      </div>
    </div>
  )
}
