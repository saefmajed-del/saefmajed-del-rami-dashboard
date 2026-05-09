import { useMemo, useState, type ComponentType } from 'react'
import {
  Cpu,
  Battery,
  Wifi,
  MemoryStick,
  Activity,
  AlertTriangle,
  Thermometer,
  Mic,
  Camera,
  Power,
  Terminal,
  RotateCw,
  Eye,
  Radar,
  Cog,
  Hand,
  Info,
  ShieldAlert,
  CircleDot,
  MapPin,
  Clock,
  Gauge,
} from 'lucide-react'
import { PageShell } from '@/pages-detail/_PageShell'
import { SaudiMap } from '@/home/parts/SaudiMap'
import { Sparkline } from '@/home/parts/Sparkline'
import { ROBOT_PINS, ALERTS, type RobotPin, type Alert } from '@/home/data'
import { cn } from '@/lib/utils'

type RobotType = 'G1' | 'Go2' | 'Drone'
type StatusFilter = 'all' | 'online' | 'warn' | 'offline'
type TypeFilter = 'all' | 'G1' | 'Go2' | 'Drone'

interface RobotDetail {
  type: RobotType
  uptime: string // e.g. '6d 14h'
  uptimePct: number // 0..100 for bar
  memoryPct: number
  wifiDbm: number // negative number
  cpuTempC: number
  micActive: boolean
  cameraActive: boolean
  lastSeen: string
}

// Stable per-id detail map (DEMO data — keeps render deterministic).
const ROBOT_DETAIL: Record<string, RobotDetail> = {
  'G1-RUH-01': { type: 'G1', uptime: '12d 04h', uptimePct: 96, memoryPct: 58, wifiDbm: -54, cpuTempC: 47, micActive: true, cameraActive: true, lastSeen: 'الآن' },
  'G1-JED-01': { type: 'G1', uptime: '08d 22h', uptimePct: 92, memoryPct: 61, wifiDbm: -58, cpuTempC: 49, micActive: true, cameraActive: true, lastSeen: 'قبل 1د' },
  'GO2-DMM-01': { type: 'Go2', uptime: '05d 11h', uptimePct: 84, memoryPct: 44, wifiDbm: -62, cpuTempC: 52, micActive: false, cameraActive: true, lastSeen: 'قبل 2د' },
  'GO2-NEOM-01': { type: 'Go2', uptime: '14d 02h', uptimePct: 98, memoryPct: 39, wifiDbm: -49, cpuTempC: 44, micActive: false, cameraActive: true, lastSeen: 'الآن' },
  'GO2-MED-01': { type: 'Go2', uptime: '09d 06h', uptimePct: 90, memoryPct: 52, wifiDbm: -60, cpuTempC: 51, micActive: false, cameraActive: true, lastSeen: 'قبل 3د' },
  'G1-AHS-01': { type: 'G1', uptime: '00d 00h', uptimePct: 0, memoryPct: 0, wifiDbm: -110, cpuTempC: 0, micActive: false, cameraActive: false, lastSeen: 'قبل 12د' },
  'G1-ABH-01': { type: 'G1', uptime: '03d 18h', uptimePct: 78, memoryPct: 66, wifiDbm: -65, cpuTempC: 53, micActive: true, cameraActive: true, lastSeen: 'قبل 1د' },
  'G1-TBK-01': { type: 'G1', uptime: '02d 09h', uptimePct: 71, memoryPct: 73, wifiDbm: -71, cpuTempC: 58, micActive: true, cameraActive: false, lastSeen: 'قبل 4د' },
  'G1-QSM-01': { type: 'G1', uptime: '07d 12h', uptimePct: 88, memoryPct: 49, wifiDbm: -56, cpuTempC: 48, micActive: true, cameraActive: true, lastSeen: 'الآن' },
  'G1-JIZ-01': { type: 'G1', uptime: '06d 03h', uptimePct: 86, memoryPct: 55, wifiDbm: -68, cpuTempC: 50, micActive: true, cameraActive: true, lastSeen: 'قبل 1د' },
  'DRN-RUH-01': { type: 'Drone', uptime: '04d 14h', uptimePct: 81, memoryPct: 32, wifiDbm: -42, cpuTempC: 38, micActive: false, cameraActive: true, lastSeen: 'الآن' },
  'DRN-NEOM-01': { type: 'Drone', uptime: '02d 20h', uptimePct: 74, memoryPct: 28, wifiDbm: -45, cpuTempC: 39, micActive: false, cameraActive: true, lastSeen: 'الآن' },
  'DRN-DMM-01': { type: 'Drone', uptime: '01d 08h', uptimePct: 62, memoryPct: 41, wifiDbm: -72, cpuTempC: 45, micActive: false, cameraActive: true, lastSeen: 'قبل 5د' },
}

const HARDWARE_MODULES: Array<{
  ar: string
  en: string
  brand: string
  status: 'connected' | 'running' | 'ok' | 'disconnected'
  icon: ComponentType<{ size?: number; className?: string }>
}> = [
  { ar: 'ليدار', en: 'LiDAR', brand: 'Hesai Pandar XT32', status: 'connected', icon: Radar },
  { ar: 'كاميرا عمق', en: 'Depth Camera', brand: 'Intel RealSense D455', status: 'connected', icon: Camera },
  { ar: 'وحدة معالجة', en: 'Compute', brand: 'NVIDIA Jetson Orin AGX', status: 'running', icon: Cpu },
  { ar: 'وحدة قياس بالقصور', en: 'IMU', brand: 'Bosch BMI088', status: 'ok', icon: Cog },
  { ar: 'ميكروفون', en: 'Microphone', brand: 'Shure MV7', status: 'ok', icon: Mic },
  { ar: 'يد ديكسترية', en: 'Dex Hand (optional)', brand: 'Unitree Dex3-1', status: 'disconnected', icon: Hand },
]

const EXTENDED_ALERTS: Alert[] = [
  ...ALERTS,
  { id: 'a4', level: 'warn', ar: 'ارتفاع حرارة المعالج — G1-TBK-01', en: 'CPU temp 58°C', meta: 'تبوك • قبل 6د' },
  { id: 'a5', level: 'info', ar: 'مزامنة خرائط نجاحاً — كامل الأسطول', en: 'Map sync complete', meta: 'الأسطول • قبل 18د' },
  { id: 'a6', level: 'urgent', ar: 'إشارة WiFi ضعيفة — G1-TBK-01', en: 'WiFi −71 dBm', meta: 'تبوك • قبل 9د' },
]

function getRobotType(id: string): RobotType {
  if (id.startsWith('GO2')) return 'Go2'
  if (id.startsWith('DRN')) return 'Drone'
  return 'G1'
}

function statusColor(status: RobotPin['status']): string {
  if (status === 'online') return 'var(--color-good)'
  if (status === 'warn') return 'var(--color-warn)'
  return 'var(--color-muted)'
}

function statusAr(status: RobotPin['status']): string {
  if (status === 'online') return 'متصل'
  if (status === 'warn') return 'تحذير'
  return 'غير متصل'
}

function statusEn(status: RobotPin['status']): string {
  if (status === 'online') return 'Online'
  if (status === 'warn') return 'Warn'
  return 'Offline'
}

export function FleetPage() {
  const [selectedId, setSelectedId] = useState<string>('G1-RUH-01')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  const online = ROBOT_PINS.filter((p) => p.status === 'online').length
  const warn = ROBOT_PINS.filter((p) => p.status === 'warn').length
  const offline = ROBOT_PINS.filter((p) => p.status === 'offline').length
  const total = ROBOT_PINS.length

  const avgBattery = Math.round(
    ROBOT_PINS.reduce((acc, p) => acc + p.battery, 0) / total,
  )
  const avgUptimePct = Math.round(
    ROBOT_PINS.reduce((acc, p) => acc + (ROBOT_DETAIL[p.id]?.uptimePct ?? 0), 0) / total,
  )

  const filtered = useMemo(() => {
    return ROBOT_PINS.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (typeFilter !== 'all' && getRobotType(p.id) !== typeFilter) return false
      return true
    })
  }, [statusFilter, typeFilter])

  const selected = ROBOT_PINS.find((p) => p.id === selectedId) ?? ROBOT_PINS[0]
  const detail = ROBOT_DETAIL[selected.id]

  const kpis: Array<{ ar: string; en: string; value: string; spark: number[]; trend: 'up' | 'down' | 'flat'; icon: ComponentType<{ size?: number; className?: string }> }> = [
    { ar: 'إجمالي الروبوتات', en: 'Total', value: String(total), spark: [3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 10, 10], trend: 'up', icon: Cpu },
    { ar: 'متصل الآن', en: 'Online', value: String(online), spark: [4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 8], trend: 'up', icon: CircleDot },
    { ar: 'تحذير', en: 'Warn', value: String(warn), spark: [0, 0, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1], trend: 'flat', icon: AlertTriangle },
    { ar: 'غير متصل', en: 'Offline', value: String(offline), spark: [2, 2, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1], trend: 'down', icon: ShieldAlert },
    { ar: 'متوسط البطارية', en: 'Avg Battery', value: `${avgBattery}%`, spark: [62, 64, 66, 67, 68, 69, 67, 66, 65, 66, 67, avgBattery], trend: 'up', icon: Battery },
    { ar: 'متوسط الجاهزية', en: 'Avg Uptime', value: `${avgUptimePct}%`, spark: [78, 80, 82, 83, 84, 84, 85, 85, 86, 86, 87, avgUptimePct], trend: 'up', icon: Gauge },
  ]

  return (
    <PageShell
      active="fleet"
      ar="إدارة الأسطول"
      en="Fleet Management"
      icon={Cpu}
      description="مركز التحكم الموحّد للأسطول الميداني — مراقبة فورية للحالة، الموقع، والصحة لكلّ روبوت G1 وGo2 منشور عبر مدن المملكة."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 px-3 py-2 text-[12px] font-bold text-[--color-ink] transition-shadow hover:shadow-[0_0_18px_rgba(78,163,255,0.22)]">
          <RotateCw size={12} />
          تحديث الكلّ
        </button>
      }
    >
      {/* === KPI strip === */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div
              key={k.en}
              className="glass-card glass-card-hover relative overflow-hidden p-3 transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.18)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                    {k.en}
                  </div>
                  <div className="text-[11px] font-bold text-[--color-ink-2]">{k.ar}</div>
                </div>
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Icon size={12} />
                </div>
              </div>
              <div className="mt-2 font-en text-[24px] font-black tabular-nums text-[--color-ink]">
                {k.value}
              </div>
              <div className="-mx-1 mt-1">
                <Sparkline data={k.spark} trend={k.trend} height={28} />
              </div>
            </div>
          )
        })}
      </section>

      {/* === Map + side panel === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {/* Big map */}
        <div className="glass-card relative col-span-12 overflow-hidden p-4 lg:col-span-8">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Mission Control · Live Map
              </div>
              <h2 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                خريطة الأسطول — المملكة العربية السعودية
              </h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(78,163,255,0.3)] bg-black/50 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink] backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[--color-admiral-glow] opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
              </span>
              LIVE · KSA
            </div>
          </div>

          <div className="bg-grid relative aspect-[10/8] overflow-hidden rounded-2xl border border-[--color-line] bg-black/30">
            <SaudiMap pins={ROBOT_PINS} showCities className="absolute inset-0 h-full w-full p-3" />
            {/* scanline */}
            <div
              className="pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-[rgba(78,163,255,0.08)] to-transparent"
              style={{ animation: 'scan-line 6s ease-in-out infinite' }}
            />
            {/* legend */}
            <div className="absolute bottom-3 start-3 flex gap-3 rounded-xl border border-[--color-line] bg-black/55 px-3 py-2 backdrop-blur-md">
              <LegendDot color="#22c55e" ar="متصل" en="Online" v={online} />
              <LegendDot color="#f5a524" ar="تحذير" en="Warn" v={warn} />
              <LegendDot color="#7a86a8" ar="غير متصل" en="Offline" v={offline} />
            </div>
            {/* corner stat */}
            <div className="absolute bottom-3 end-3 rounded-xl border border-[--color-line] bg-black/55 px-3 py-2 backdrop-blur-md">
              <div className="font-en text-[9px] font-bold uppercase tracking-[0.2em] text-[--color-faint]">
                Coverage
              </div>
              <div className="font-en text-[14px] font-extrabold tabular-nums text-[--color-ink]">
                {total} <span className="text-[--color-muted]">/ 13 cities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel — selected robot */}
        <aside className="glass-card col-span-12 flex flex-col overflow-hidden lg:col-span-4">
          <div className="flex items-start justify-between gap-2 p-4">
            <div>
              <div className="font-en text-[10px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Selected Unit
              </div>
              <div className="mt-1 font-en text-[18px] font-black tabular-nums text-[--color-ink]">
                {selected.id}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold text-[--color-ink-2]">
                <MapPin size={11} className="text-[--color-faint]" />
                {selected.city}
                <span className="text-[--color-faint]">·</span>
                <span className="font-en text-[11px] font-semibold text-[--color-muted]">
                  {detail.type}
                </span>
              </div>
            </div>
            <StatusPill status={selected.status} />
          </div>

          <div className="hairline mx-4" />

          {/* Last-seen + uptime row */}
          <div className="grid grid-cols-2 gap-2 p-4 pb-2">
            <MiniStat icon={Clock} ar="آخر اتصال" en="Last seen" v={detail.lastSeen} />
            <MiniStat icon={Activity} ar="مدّة التشغيل" en="Uptime" v={detail.uptime} />
          </div>

          {/* Bars */}
          <div className="flex flex-col gap-3 px-4 pb-3">
            <Bar
              icon={Battery}
              ar="البطارية"
              en="Battery"
              pct={selected.battery}
              value={`${selected.battery}%`}
              tone={selected.battery > 50 ? 'good' : selected.battery > 25 ? 'warn' : 'bad'}
            />
            <Bar
              icon={MemoryStick}
              ar="الذاكرة"
              en="Memory"
              pct={detail.memoryPct}
              value={`${detail.memoryPct}%`}
              tone={detail.memoryPct < 70 ? 'good' : detail.memoryPct < 85 ? 'warn' : 'bad'}
            />
            <Bar
              icon={Wifi}
              ar="إشارة الواي-فاي"
              en="WiFi"
              pct={Math.max(0, Math.min(100, 100 + detail.wifiDbm + 30))}
              value={`${detail.wifiDbm} dBm`}
              tone={detail.wifiDbm > -60 ? 'good' : detail.wifiDbm > -75 ? 'warn' : 'bad'}
            />
          </div>

          {/* Sensor row */}
          <div className="grid grid-cols-3 gap-2 px-4 pb-4">
            <SensorChip icon={Thermometer} ar="حرارة المعالج" en="CPU Temp" value={detail.cpuTempC ? `${detail.cpuTempC}°C` : '—'} on={detail.cpuTempC > 0 && detail.cpuTempC < 60} />
            <SensorChip icon={Mic} ar="الميكروفون" en="Mic" value={detail.micActive ? 'نشط' : 'صامت'} on={detail.micActive} />
            <SensorChip icon={Camera} ar="الكاميرا" en="Camera" value={detail.cameraActive ? 'بثّ مباشر' : 'متوقّفة'} on={detail.cameraActive} />
          </div>

          <div className="hairline mx-4" />

          {/* Hardware modules */}
          <div className="px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="font-en text-[10px] font-bold uppercase tracking-[0.22em] text-[--color-faint]">
                  Connected Hardware
                </div>
                <div className="text-[12px] font-bold text-[--color-ink]">الوحدات المتّصلة</div>
              </div>
              <div className="font-en text-[10.5px] font-bold tabular-nums text-[--color-admiral-glow]">
                {HARDWARE_MODULES.filter((m) => m.status !== 'disconnected').length} / {HARDWARE_MODULES.length}
              </div>
            </div>
            <ul className="flex flex-col gap-1.5">
              {HARDWARE_MODULES.map((m) => {
                const Icon = m.icon
                const isOff = m.status === 'disconnected'
                return (
                  <li
                    key={m.en}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl border px-2.5 py-2',
                      isOff
                        ? 'border-[--color-line] bg-white/[0.015] opacity-60'
                        : 'border-[--color-line] bg-white/[0.025]',
                    )}
                  >
                    <div className={cn(
                      'grid h-7 w-7 shrink-0 place-items-center rounded-lg border',
                      isOff
                        ? 'border-[--color-line] bg-black/30 text-[--color-muted]'
                        : 'border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]',
                    )}>
                      <Icon size={12} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-bold text-[--color-ink]">{m.ar}</div>
                      <div className="truncate font-en text-[10px] font-semibold text-[--color-faint]">
                        {m.en} · {m.brand}
                      </div>
                    </div>
                    <ModuleStatusBadge status={m.status} />
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-auto flex gap-2 border-t border-[--color-line] bg-black/20 p-3">
            <ActionBtn icon={Terminal} label="كونسول" />
            <ActionBtn icon={RotateCw} label="إعادة تشغيل" />
            <ActionBtn icon={Eye} label="بثّ مباشر" />
          </div>
        </aside>
      </section>

      {/* === Robot list table === */}
      <section className="glass-card mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-3">
          <div>
            <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
              Fleet Roster · {filtered.length} of {total}
            </div>
            <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
              قائمة الروبوتات
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterChip active={statusFilter === 'all' && typeFilter === 'all'} onClick={() => { setStatusFilter('all'); setTypeFilter('all') }}>الكل · All</FilterChip>
            <FilterChip active={statusFilter === 'online'} onClick={() => setStatusFilter('online')} dot="#22c55e">متصل · Online</FilterChip>
            <FilterChip active={statusFilter === 'warn'} onClick={() => setStatusFilter('warn')} dot="#f5a524">تحذير · Warn</FilterChip>
            <FilterChip active={statusFilter === 'offline'} onClick={() => setStatusFilter('offline')} dot="#7a86a8">غير متصل · Offline</FilterChip>
            <span className="mx-1 h-4 w-px bg-[--color-line]" />
            <FilterChip active={typeFilter === 'G1'} onClick={() => setTypeFilter(typeFilter === 'G1' ? 'all' : 'G1')}>G1</FilterChip>
            <FilterChip active={typeFilter === 'Go2'} onClick={() => setTypeFilter(typeFilter === 'Go2' ? 'all' : 'Go2')}>Go2</FilterChip>
          </div>
        </div>

        <div className="hairline mx-4" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-0">
            <thead>
              <tr className="text-start">
                <Th>المعرّف · ID</Th>
                <Th>النوع · Type</Th>
                <Th>المدينة · City</Th>
                <Th>الحالة · Status</Th>
                <Th align="end">البطارية · Battery</Th>
                <Th align="end">الذاكرة · Memory</Th>
                <Th align="end">واي-فاي · WiFi</Th>
                <Th>آخر اتصال · Last seen</Th>
                <Th align="end">الإجراءات · Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const d = ROBOT_DETAIL[p.id]
                const isSelected = p.id === selectedId
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-white/[0.025]',
                      isSelected && 'bg-[rgba(78,163,255,0.06)]',
                    )}
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <span
                          className="relative inline-flex h-2 w-2 rounded-full"
                          style={{ background: statusColor(p.status) }}
                        >
                          {p.status === 'online' && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-[--color-good]/60" />
                          )}
                        </span>
                        <span className="font-en text-[12px] font-extrabold tabular-nums text-[--color-ink]">
                          {p.id}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span className="rounded-md border border-[--color-line] bg-black/30 px-2 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.14em] text-[--color-ink-2]">
                        {d.type}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[12px] font-bold text-[--color-ink-2]">{p.city}</span>
                    </Td>
                    <Td>
                      <StatusPill status={p.status} compact />
                    </Td>
                    <Td align="end">
                      <span className="font-en text-[12px] font-bold tabular-nums text-[--color-ink]">
                        {p.battery}%
                      </span>
                    </Td>
                    <Td align="end">
                      <span className="font-en text-[12px] font-bold tabular-nums text-[--color-ink-2]">
                        {d.memoryPct}%
                      </span>
                    </Td>
                    <Td align="end">
                      <span className="font-en text-[12px] font-bold tabular-nums text-[--color-ink-2]">
                        {d.wifiDbm} dBm
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[11.5px] font-semibold text-[--color-muted]">
                        {d.lastSeen}
                      </span>
                    </Td>
                    <Td align="end">
                      <div className="flex items-center justify-end gap-1.5">
                        <RowBtn icon={Terminal} label="Console" />
                        <RowBtn icon={Power} label="Restart" />
                        <RowBtn icon={Eye} label="Details" />
                      </div>
                    </Td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[12px] font-bold text-[--color-muted]">
                    لا توجد روبوتات تطابق هذا التصفية · No robots match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* === Alerts feed === */}
      <section className="glass-card mt-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
              Live Alerts Feed
            </div>
            <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
              تنبيهات الأسطول الحيّة
            </h3>
          </div>
          <div className="font-en text-[10.5px] font-bold tabular-nums text-[--color-faint]">
            {EXTENDED_ALERTS.length} active
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {EXTENDED_ALERTS.map((a) => (
            <AlertRow key={a.id} a={a} />
          ))}
        </ul>
      </section>
    </PageShell>
  )
}

/* ------------------------------------------------------------------ */
/* sub-components                                                      */
/* ------------------------------------------------------------------ */

function LegendDot({ color, ar, en, v }: { color: string; ar: string; en: string; v: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[10.5px] font-bold text-[--color-ink-2]">{ar}</span>
      <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
        {en}
      </span>
      <span className="font-en text-[10.5px] font-extrabold tabular-nums text-[--color-ink]">{v}</span>
    </div>
  )
}

function StatusPill({ status, compact }: { status: RobotPin['status']; compact?: boolean }) {
  const color = statusColor(status)
  const ar = statusAr(status)
  const en = statusEn(status)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-bold',
        compact ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-[11px]',
      )}
      style={{
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span>{ar}</span>
      <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] opacity-80">
        {en}
      </span>
    </span>
  )
}

function MiniStat({
  icon: Icon,
  ar,
  en,
  v,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  ar: string
  en: string
  v: string
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
      <Icon size={13} className="mt-0.5 text-[--color-admiral-glow]" />
      <div>
        <div className="font-en text-[9px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
          {en}
        </div>
        <div className="text-[11px] font-bold text-[--color-ink-2]">{ar}</div>
        <div className="font-en text-[12px] font-extrabold tabular-nums text-[--color-ink]">
          {v}
        </div>
      </div>
    </div>
  )
}

function Bar({
  icon: Icon,
  ar,
  en,
  pct,
  value,
  tone,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  ar: string
  en: string
  pct: number
  value: string
  tone: 'good' | 'warn' | 'bad'
}) {
  const color = tone === 'good' ? 'var(--color-good)' : tone === 'warn' ? 'var(--color-warn)' : 'var(--color-bad)'
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <Icon size={12} className="text-[--color-faint]" />
        <div className="text-[11.5px] font-bold text-[--color-ink-2]">{ar}</div>
        <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
          {en}
        </div>
        <div className="ms-auto font-en text-[11px] font-extrabold tabular-nums text-[--color-ink]">
          {value}
        </div>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="absolute inset-y-0 start-0 rounded-full"
          style={{
            width: `${clamped}%`,
            background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 50%, transparent))`,
            boxShadow: `0 0 12px color-mix(in srgb, ${color} 40%, transparent)`,
          }}
        />
      </div>
    </div>
  )
}

function SensorChip({
  icon: Icon,
  ar,
  en,
  value,
  on,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  ar: string
  en: string
  value: string
  on: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-black/30 px-2.5 py-2',
        on
          ? 'border-[rgba(34,197,94,0.22)]'
          : 'border-[--color-line] opacity-70',
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={11} className={on ? 'text-[--color-good]' : 'text-[--color-muted]'} />
        <div className="font-en text-[9px] font-bold uppercase tracking-[0.14em] text-[--color-faint]">
          {en}
        </div>
      </div>
      <div className="mt-1 text-[11px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className={cn('font-en text-[11.5px] font-extrabold tabular-nums', on ? 'text-[--color-ink]' : 'text-[--color-muted]')}>
        {value}
      </div>
    </div>
  )
}

function ModuleStatusBadge({ status }: { status: 'connected' | 'running' | 'ok' | 'disconnected' }) {
  const map = {
    connected: { color: 'var(--color-good)', ar: 'متّصل', en: 'Connected' },
    running: { color: 'var(--color-admiral-glow)', ar: 'يعمل', en: 'Running' },
    ok: { color: 'var(--color-good)', ar: 'سليم', en: 'OK' },
    disconnected: { color: 'var(--color-muted)', ar: 'مفصول', en: 'Off' },
  } as const
  const { color, ar, en } = map[status]
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.12em]"
      style={{
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
      }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: color }} />
      <span className="text-[9px] tracking-normal text-[--color-ink-2]">{ar}</span>
      <span>{en}</span>
    </span>
  )
}

function ActionBtn({ icon: Icon, label }: { icon: ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-2.5 py-2 text-[11.5px] font-bold text-[--color-ink-2] transition-shadow hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink] hover:shadow-[0_0_24px_rgba(78,163,255,0.18)]">
      <Icon size={12} />
      {label}
    </button>
  )
}

function FilterChip({
  active,
  onClick,
  dot,
  children,
}: {
  active: boolean
  onClick: () => void
  dot?: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-en text-[10.5px] font-bold uppercase tracking-[0.14em] transition-shadow',
        active
          ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/15 text-[--color-ink] shadow-[0_0_18px_rgba(78,163,255,0.18)]'
          : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)] hover:text-[--color-ink]',
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  )
}

function Th({ children, align = 'start' }: { children: React.ReactNode; align?: 'start' | 'end' }) {
  return (
    <th
      className={cn(
        'border-b border-[--color-line] bg-black/20 px-3 py-2 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]',
        align === 'end' ? 'text-end' : 'text-start',
      )}
    >
      {children}
    </th>
  )
}

function Td({ children, align = 'start' }: { children: React.ReactNode; align?: 'start' | 'end' }) {
  return (
    <td
      className={cn(
        'border-b border-[--color-line] px-3 py-2.5',
        align === 'end' ? 'text-end' : 'text-start',
      )}
    >
      {children}
    </td>
  )
}

function RowBtn({ icon: Icon, label }: { icon: ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <button
      title={label}
      onClick={(e) => e.stopPropagation()}
      className="grid h-7 w-7 place-items-center rounded-lg border border-[--color-line] bg-black/30 text-[--color-ink-2] transition-shadow hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink] hover:shadow-[0_0_18px_rgba(78,163,255,0.18)]"
    >
      <Icon size={11} />
    </button>
  )
}

function AlertRow({ a }: { a: Alert }) {
  const map = {
    urgent: { color: 'var(--color-bad)', icon: ShieldAlert },
    warn: { color: 'var(--color-warn)', icon: AlertTriangle },
    info: { color: 'var(--color-info)', icon: Info },
  } as const
  const { color, icon: Icon } = map[a.level]
  return (
    <li
      className="flex items-start gap-3 rounded-2xl border bg-black/25 p-3 transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.18)]"
      style={{ borderColor: `color-mix(in srgb, ${color} 24%, var(--color-line))` }}
    >
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border"
        style={{
          borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          color,
        }}
      >
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-bold text-[--color-ink]">{a.ar}</div>
        <div className="truncate font-en text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
          {a.en} · {a.meta}
        </div>
      </div>
      <button className="shrink-0 rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
        مراجعة
      </button>
    </li>
  )
}
