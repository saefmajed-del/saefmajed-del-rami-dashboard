export type DialectMaturity = 'mature' | 'ready' | 'training' | 'early' | 'planned'

export interface Dialect {
  name: string
  maturity: DialectMaturity
}

export type UnitStatus = 'online' | 'warn' | 'offline'

export interface FleetUnit {
  id: string
  location: string
  user: string
  ip: string
  battery: number
  memory: number
  wifiDbm: number
  lastSeen: string
  status: UnitStatus
}

export type AlertSeverity = 'urgent' | 'warn' | 'info'

export interface FleetAlert {
  id: string
  severity: AlertSeverity
  time: string
  message: string
  detail: string
}

export interface ResearchPartner {
  tag: string
  name: string
  phase: string
  status: 'active' | 'eval' | 'paused'
}

export interface SocialAccount {
  platform: string
  handle: string
  followers: string
  reach: string
}

export interface AudienceCountry {
  flag: string
  name: string
  reach: number
}

export interface CatalogEntry {
  title: string
  meta: string
  views: string
  likes: string
  shares: string
  gradient: [string, string]
  best?: boolean
}

export interface InfoSpec {
  tag: string
  title: string
  description: string
  meta: string[]
}
