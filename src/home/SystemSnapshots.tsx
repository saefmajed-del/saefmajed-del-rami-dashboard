import { ServerCog, CircuitBoard, Boxes, Video, ShieldAlert, UsersRound, ChevronLeft } from 'lucide-react'
import { useNavigate, type RouteId } from '@/lib/router'
import { Sparkline } from './parts/Sparkline'

interface SystemTile {
  id: RouteId
  ar: string
  en: string
  icon: typeof ServerCog
  /** primary big metric */
  metric: string
  metricLabel: string
  /** 2 inline secondary metrics */
  inline: [string, string]
  /** spark data */
  spark: number[]
  trend: 'up' | 'down' | 'flat'
  /** status pill */
  statusAr: string
  statusEn: string
  statusTone: 'good' | 'warn' | 'admiral' | 'live'
  /** very small visual hint shown beside metric */
  badge?: string
}

const TILES: SystemTile[] = [
  {
    id: 'engineering',
    ar: 'الهندسة والبنية',
    en: 'Engineering Ops',
    icon: ServerCog,
    metric: '99.97%',
    metricLabel: 'Uptime · 30d',
    inline: ['42 / 44 services', 'GPU 68%'],
    spark: [99.91, 99.92, 99.93, 99.94, 99.95, 99.94, 99.95, 99.96, 99.97, 99.97, 99.97, 99.97],
    trend: 'up',
    statusAr: 'جميع الأنظمة',
    statusEn: 'All systems',
    statusTone: 'good',
  },
  {
    id: 'robotics-edge',
    ar: 'الوسيط والحافة',
    en: 'Robotics Middleware',
    icon: CircuitBoard,
    metric: '24 ms',
    metricLabel: 'Heartbeat avg',
    inline: ['142 ROS2 nodes', '87 MQTT topics'],
    spark: [38, 36, 34, 32, 30, 30, 28, 26, 25, 24, 24, 24],
    trend: 'down',
    statusAr: 'OTA قيد التشغيل',
    statusEn: 'OTA in flight · 2',
    statusTone: 'admiral',
    badge: 'v3.4.2',
  },
  {
    id: 'twin',
    ar: 'التوأم الرقمي',
    en: 'Digital Twin',
    icon: Boxes,
    metric: '60 fps',
    metricLabel: 'Render · 8.4 ms',
    inline: ['16 entities', '4 routes'],
    spark: [54, 56, 58, 58, 60, 60, 60, 60, 60, 60, 60, 60],
    trend: 'up',
    statusAr: 'مشهد حي',
    statusEn: 'Scene live',
    statusTone: 'live',
  },
  {
    id: 'streaming',
    ar: 'البث المباشر',
    en: 'Telepresence',
    icon: Video,
    metric: '6',
    metricLabel: 'Live streams',
    inline: ['240 ms p95', '32.4 Mbps'],
    spark: [4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6],
    trend: 'up',
    statusAr: 'مشغّلون متصلون',
    statusEn: 'Operators · 3',
    statusTone: 'live',
    badge: 'WebRTC',
  },
  {
    id: 'security',
    ar: 'الأمن السيبراني',
    en: 'Security Operations',
    icon: ShieldAlert,
    metric: '96%',
    metricLabel: 'Compliance · KSA',
    inline: ['142 blocked / 24h', '3 open'],
    spark: [82, 85, 87, 88, 90, 91, 93, 94, 95, 95, 96, 96],
    trend: 'up',
    statusAr: 'صفر-ثقة مفعّل',
    statusEn: 'Zero-trust · armed',
    statusTone: 'good',
  },
  {
    id: 'team',
    ar: 'فريق المنصة',
    en: 'Platform Team',
    icon: UsersRound,
    metric: '5 / 11',
    metricLabel: 'Roles filled · P1',
    inline: ['6 open', 'P2 in 6 mo'],
    spark: [1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5],
    trend: 'up',
    statusAr: 'مرحلة ١ — MVP فعلي',
    statusEn: 'Phase 1 · Real MVP',
    statusTone: 'admiral',
  },
]

export function SystemSnapshots() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
            Industrial OS · System Operations
          </div>
          <h2 className="mt-0.5 text-[18px] font-extrabold text-[--color-ink]">
            عمليات النظام
            <span className="ms-2 font-en text-[12px] font-semibold uppercase tracking-[0.16em] text-[--color-muted]">
              Engineering · Edge · Twin · Telepresence · Security · Team
            </span>
          </h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/30 px-2.5 py-1.5 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-ink-2]">
          <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" />
          Unified · 6 modules
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {TILES.map((t) => {
          const Icon = t.icon
          const toneClass =
            t.statusTone === 'good'
              ? 'text-[--color-good] border-[--color-good]/25 bg-[--color-good]/10'
              : t.statusTone === 'warn'
                ? 'text-[--color-warn] border-[--color-warn]/25 bg-[--color-warn]/10'
                : t.statusTone === 'live'
                  ? 'text-[--color-admiral-glow] border-[rgba(78,163,255,0.3)] bg-[--color-admiral]/10'
                  : 'text-[--color-admiral-glow] border-[rgba(78,163,255,0.22)] bg-[--color-admiral]/10'

          return (
            <button
              key={t.id}
              onClick={() => navigate(t.id)}
              className="glass-card glass-card-hover relative overflow-hidden p-4 text-start transition-all hover:-translate-y-0.5"
            >
              {/* corner glow */}
              <div className="pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full bg-[--color-admiral-glow]/10 blur-2xl" />

              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[14px] font-extrabold text-[--color-ink]">{t.ar}</h3>
                    {t.badge && (
                      <span className="font-en text-[9px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                        {t.badge}
                      </span>
                    )}
                  </div>
                  <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    {t.en}
                  </div>
                </div>
                <ChevronLeft
                  size={13}
                  className="shrink-0 text-[--color-faint] transition-transform group-hover:-translate-x-0.5"
                />
              </div>

              {/* big metric */}
              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <div className="font-en text-[26px] font-extrabold leading-none tracking-tight tabular-nums text-[--color-ink]">
                    {t.metric}
                  </div>
                  <div className="mt-1 font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                    {t.metricLabel}
                  </div>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[10px] font-bold leading-tight ${toneClass}`}
                >
                  {t.statusTone === 'live' && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-70" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
                    </span>
                  )}
                  {t.statusTone !== 'live' && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  <span className="text-[10px] font-bold leading-tight">{t.statusEn}</span>
                </span>
              </div>

              {/* sparkline + inline metrics */}
              <div className="mt-3">
                <Sparkline data={t.spark} trend={t.trend} height={28} />
                <div className="mt-1.5 flex items-center justify-between font-en text-[10px] font-semibold tabular-nums text-[--color-ink-2]">
                  <span>{t.inline[0]}</span>
                  <span className="text-[--color-faint]">·</span>
                  <span>{t.inline[1]}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
