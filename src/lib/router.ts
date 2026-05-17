import { useEffect, useState, useCallback } from 'react'

export const ROUTES = [
  'home',
  'landing',
  'fleet',
  'robotics-edge',
  'projects',
  'media',
  'language',
  'brand',
  'streaming',
  'engineering',
  'twin',
  'security',
  'learning',
  'reports',
  'team',
  'settings',
  'showcase',
] as const

export type RouteId = (typeof ROUTES)[number]

export interface Route {
  id: RouteId
  /** optional resource identifier (e.g., robot id, project slug) */
  param?: string
}

const ROUTE_SET = new Set<string>(ROUTES)

export function parseHash(hash: string = window.location.hash): Route {
  const raw = hash.replace(/^#\/?/, '')
  if (!raw) return { id: 'landing' }
  const [head, param] = raw.split('/')
  return ROUTE_SET.has(head) ? { id: head as RouteId, param } : { id: 'landing' }
}

export function routeHref(id: RouteId, param?: string) {
  return param ? `#/${id}/${param}` : `#/${id}`
}

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> }
}

export function navigate(id: RouteId, param?: string) {
  const apply = () => {
    window.location.hash = routeHref(id, param)
    // ensure scroll resets when changing screens
    requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }

  // Native View Transitions API — Chromium-only today, graceful no-op elsewhere.
  // Respect prefers-reduced-motion to skip the cross-fade for a11y.
  const doc = document as DocWithVT
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (doc.startViewTransition && !reduced) {
    doc.startViewTransition(apply)
    return
  }
  apply()
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash())
  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function useNavigate() {
  return useCallback((id: RouteId, param?: string) => navigate(id, param), [])
}
