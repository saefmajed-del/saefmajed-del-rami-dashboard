import { useEffect, useRef } from 'react'

/**
 * Adds a subtle "magnetic pull" hover effect — the element translates toward
 * the cursor on pointermove and returns to origin on leave.
 *
 * Strength is in pixels of max offset (default 6). Respects
 * prefers-reduced-motion: reduce — no-ops in that case.
 *
 * Usage:
 *   const ref = useMagneticHover<HTMLDivElement>(8)
 *   return <div ref={ref}>{children}</div>
 */
export function useMagneticHover<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let raf = 0
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = ((e.clientX - cx) / rect.width) * strength * 2
      const dy = ((e.clientY - cy) / rect.height) * strength * 2
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${clamp(dx, strength)}px, ${clamp(dy, strength)}px, 0)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.transform = 'translate3d(0, 0, 0)'
    }
    // Smooth transform via transition only — avoids jank on slow pointermove ticks.
    el.style.transition = 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.willChange = 'transform'

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.style.transform = ''
      el.style.transition = ''
      el.style.willChange = ''
    }
  }, [strength])

  return ref
}

function clamp(v: number, max: number) {
  return Math.max(-max, Math.min(max, v))
}
