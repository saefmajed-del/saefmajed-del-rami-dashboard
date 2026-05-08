import { useEffect, useState, useCallback } from 'react'

export const ROUTES = [
  'home',
  'fleet',
  'projects',
  'media',
  'language',
  'brand',
  'learning',
  'reports',
  'settings',
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
  if (!raw) return { id: 'home' }
  const [head, param] = raw.split('/')
  return ROUTE_SET.has(head) ? { id: head as RouteId, param } : { id: 'home' }
}

export function routeHref(id: RouteId, param?: string) {
  return param ? `#/${id}/${param}` : `#/${id}`
}

export function navigate(id: RouteId, param?: string) {
  window.location.hash = routeHref(id, param)
  // ensure scroll resets when changing screens
  requestAnimationFrame(() => window.scrollTo({ top: 0 }))
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
