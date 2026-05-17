import { useEffect, useRef, useState } from 'react'

/**
 * Animates a numeric portion inside a string from 0 → target over `durationMs`.
 * Preserves any non-numeric prefix/suffix (e.g. "+", "%", " ms", thousands separators).
 *
 * - "98%"     → counts 0 → 98 then appends "%"
 * - "1,247"   → counts 0 → 1247 then re-inserts commas
 * - "+3"      → counts 0 → 3 with the "+" sign preserved
 * - "قبل ساعة" → returned as-is (no number to count)
 *
 * Respects `prefers-reduced-motion: reduce` — returns the final string immediately.
 */
export function useCountUp(target: string, durationMs = 900): string {
  // Find the first numeric run (with optional decimal). Capture sign separately.
  const match = /^(\+|-)?\s*(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(target ?? '')

  // No number → render verbatim.
  const initial = match ? buildString(0, match[1] ?? '', match[2], match[3] ?? '') : target
  const [out, setOut] = useState(initial)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!match) {
      setOut(target)
      return
    }
    const sign = match[1] ?? ''
    const rawNum = match[2]
    const suffix = match[3] ?? ''
    const hasComma = rawNum.includes(',')
    const isFloat = rawNum.includes('.')
    const finalNum = Number(rawNum.replace(/,/g, ''))

    if (!Number.isFinite(finalNum)) {
      setOut(target)
      return
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || finalNum === 0) {
      setOut(target)
      return
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(1, elapsed / durationMs)
      // easeOutCubic — gentle settle, no overshoot.
      const eased = 1 - Math.pow(1 - t, 3)
      const current = finalNum * eased
      setOut(formatNumber(current, isFloat, hasComma, sign, suffix))
      if (t < 1) {
        rafRef.current = window.requestAnimationFrame(tick)
      } else {
        setOut(target) // snap to exact source string at the end
      }
    }

    rafRef.current = window.requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [target, durationMs, match])

  return out
}

function buildString(value: number, sign: string, _raw: string, suffix: string): string {
  return `${sign}${Math.round(value)}${suffix}`
}

function formatNumber(
  value: number,
  isFloat: boolean,
  hasComma: boolean,
  sign: string,
  suffix: string,
): string {
  const n = isFloat ? value.toFixed(1) : String(Math.round(value))
  const withCommas = hasComma ? Number(n).toLocaleString('en-US') : n
  return `${sign}${withCommas}${suffix}`
}
