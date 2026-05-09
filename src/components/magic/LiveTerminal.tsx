import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function LiveTerminal() {
  const [logs, setLogs] = useState<string[]>([
    '[04:18:01] System boot complete.',
    '[04:18:05] Establishing neural handshake...',
    '[04:18:12] 13/13 assets online.',
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().toLocaleTimeString('en-GB', { hour12: false })
      const messages = [
        `Incoming telemetry from DRN-RUH-01`,
        `Neural sync stabilized at 98.4%`,
        `OTA manifest v3.4.2 verified`,
        `New intent detected: fleet.locate`,
      ]
      const msg = messages[Math.floor(Math.random() * messages.length)]
      setLogs(prev => [...prev.slice(-5), `[${now}] ${msg}`])
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-2xl border border-[--color-line] bg-black/60 p-4 font-mono">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500/80" />
        <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
        <div className="h-2 w-2 rounded-full bg-green-500/80" />
        <span className="ms-2 font-en text-[10px] font-bold uppercase tracking-widest text-[--color-faint]">System Console</span>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <motion.div 
            key={log + i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[11px] leading-relaxed text-[#4ea3ff]/90"
          >
            <span className="text-[--color-faint] opacity-50">$</span> {log}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block h-3 w-1.5 bg-[--color-admiral-glow] align-middle"
        />
      </div>
    </div>
  )
}
