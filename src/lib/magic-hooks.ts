import { useState, useEffect } from 'react'

export function useSimulatedValue(initial: number, jitter: number = 0.05, interval: number = 3000) {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.5) * jitter * initial
      setValue(prev => {
        const next = prev + delta
        // Keep it somewhat realistic
        if (next > initial * 1.5) return initial * 1.4
        if (next < initial * 0.5) return initial * 0.6
        return next
      })
    }, interval)
    return () => clearInterval(timer)
  }, [initial, jitter, interval])

  return value
}
