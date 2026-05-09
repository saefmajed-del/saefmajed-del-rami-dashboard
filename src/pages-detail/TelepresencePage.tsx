import { useMemo, useState } from 'react'
import {
  Video,
  Camera,
  Mic,
  MicOff,
  Volume2,
  Headphones,
  Cast,
  Maximize2,
  CircleDot,
  ScanLine,
  Hand,
  AlertTriangle,
  Pause,
  Radio,
  Server,
  Activity,
  Wifi,
  Gauge,
  PackageX,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { MagicStatCard } from '@/components/magic/MagicStatCard'
import { PageShell } from './_PageShell'
import { ROBOT_PINS } from '@/home/data'
import { Waveform } from '@/home/parts/Waveform'
import { cn } from '@/lib/utils'

// ---------------- KPIs ----------------

interface TKpi {
  ar: string
  en: string
  value: string
  unit?: string
  hint: string
  icon: typeof Video
  tone?: 'good' | 'warn' | 'live' | 'neutral'
}

const KPIS: TKpi[] = [
  {
    ar: 'البث الحي',
    en: 'Live Streams',
    value: '6',
    hint: 'WebRTC · SFU',
    icon: Radio,
    tone: 'live',
  },
  {
    ar: 'المشغّلون المتصلون',
    en: 'Operators Online',
    value: '3',
    hint: '24/7 NOC',
    icon: Headphones,
    tone: 'good',
  },
  {
    ar: 'متوسط الكمون',
    en: 'Avg Glass-to-Glass',
    value: '240',
    unit: 'ms',
    hint: 'p50 · all regions',
    icon: Gauge,
    tone: 'good',
  },
  {
    ar: 'استهلاك النطاق',
    en: 'Bandwidth Used',
    value: '32.4',
    unit: 'Mbps',
    hint: 'aggregate uplink',
    icon: Wifi,
    tone: 'neutral',
  },
  {
    ar: 'القنوات الصوتية',
    en: 'Audio Channels',
    value: '4',
    hint: 'Operators + Robot + PA',
    icon: Volume2,
    tone: 'neutral',
  },
]

// ---------------- Camera streams ----------------

interface StreamMeta {
  id: string
  city: string
  cityEn: string
  latencyMs: number
  resolution: string
  bitrateKbps: number
  codec: 'H.264' | 'H.265'
  packetsLost: number
  jitterMs: number
  keyframeSec: number
  iceState: 'connected' | 'checking' | 'completed'
  audioLevelDb: number
  status: 'live' | 'standby' | 'offline'
  kind: 'robot' | 'facility'
}

const CITY_EN: Record<string, string> = {
  الرياض: 'Riyadh',
  جدة: 'Jeddah',
  الدمام: 'Dammam',
  نيوم: 'NEOM',
  المدينة: 'Madinah',
  الأحساء: 'Al-Ahsa',
  أبها: 'Abha',
  تبوك: 'Tabuk',
  القصيم: 'Qassim',
  جيزان: 'Jazan',
}

// Build stream list from canonical ROBOT_PINS + 2 facility cams
const STREAMS: StreamMeta[] = (() => {
  const robotCams: StreamMeta[] = ROBOT_PINS.map((p, i) => {
    const live = p.status === 'online'
    const codec: 'H.264' | 'H.265' = i % 3 === 0 ? 'H.265' : 'H.264'
    const lat = live ? 180 + ((i * 37) % 140) : 0
    return {
      id: p.id,
      city: p.city,
      cityEn: CITY_EN[p.city] ?? p.city,
      latencyMs: lat,
      resolution: i % 2 === 0 ? '1080p60' : '720p30',
      bitrateKbps: live ? 2400 + ((i * 113) % 2200) : 0,
      codec,
      packetsLost: live ? (i * 7) % 12 : 0,
      jitterMs: live ? 4 + ((i * 3) % 14) : 0,
      keyframeSec: 2,
      iceState: live ? 'connected' : 'checking',
      audioLevelDb: live ? -18 + ((i * 5) % 14) : -60,
      status: p.status === 'online' ? 'live' : p.status === 'offline' ? 'offline' : 'standby',
      kind: 'robot',
    }
  })
  const facility: StreamMeta[] = [
    {
      id: 'FAC-RUH-LOBBY',
      city: 'مقر الرياض',
      cityEn: 'RUH HQ Lobby',
      latencyMs: 124,
      resolution: '1080p30',
      bitrateKbps: 3200,
      codec: 'H.265',
      packetsLost: 1,
      jitterMs: 3,
      keyframeSec: 4,
      iceState: 'connected',
      audioLevelDb: -22,
      status: 'live',
      kind: 'facility',
    },
    {
      id: 'FAC-JED-LAB',
      city: 'مختبر جدة',
      cityEn: 'JED R&D Lab',
      latencyMs: 158,
      resolution: '1440p30',
      bitrateKbps: 4800,
      codec: 'H.265',
      packetsLost: 0,
      jitterMs: 5,
      keyframeSec: 4,
      iceState: 'connected',
      audioLevelDb: -28,
      status: 'live',
      kind: 'facility',
    },
  ]
  return [...robotCams, ...facility]
})()

const MAIN_STAGE_IDS = ['G1-RUH-01', 'GO2-NEOM-01', 'G1-JED-01', 'GO2-DMM-01']

// ---------------- Audio rack ----------------

interface AudioStrip {
  id: string
  ar: string
  en: string
  icon: typeof Mic
  level: number // 0..1 LUFS-ish
  gain: number // 0..100
  muted: boolean
  solo: boolean
  tag: string
}

const AUDIO_STRIPS: AudioStrip[] = [
  {
    id: 'op1',
    ar: 'المشغّل ١',
    en: 'Operator-1',
    icon: Headphones,
    level: 0.72,
    gain: 78,
    muted: false,
    solo: false,
    tag: 'NOC · Riyadh',
  },
  {
    id: 'op2',
    ar: 'المشغّل ٢',
    en: 'Operator-2',
    icon: Headphones,
    level: 0.41,
    gain: 64,
    muted: false,
    solo: false,
    tag: 'NOC · Jeddah',
  },
  {
    id: 'rmic',
    ar: 'ميكروفون الروبوت',
    en: 'Robot-Mic',
    icon: Mic,
    level: 0.58,
    gain: 70,
    muted: false,
    solo: false,
    tag: 'G1-RUH-01 · onboard',
  },
  {
    id: 'pa',
    ar: 'إعلان عام',
    en: 'Public-Address',
    icon: Volume2,
    level: 0.18,
    gain: 50,
    muted: true,
    solo: false,
    tag: 'Venue PA · standby',
  },
]

// ---------------- Network telemetry ----------------

interface NetMetric {
  ar: string
  en: string
  value: string
  unit: string
  threshold: 'ok' | 'warn' | 'bad'
  thresholdLabel: string
  spark: number[]
  icon: typeof Activity
}

const NET_METRICS: NetMetric[] = [
  {
    ar: 'زمن الذهاب والإياب',
    en: 'RTT',
    value: '38',
    unit: 'ms',
    threshold: 'ok',
    thresholdLabel: '< 80ms',
    spark: [44, 41, 39, 42, 40, 38, 37, 39, 40, 38, 37, 38],
    icon: Activity,
  },
  {
    ar: 'الارتعاش',
    en: 'Jitter',
    value: '6.2',
    unit: 'ms',
    threshold: 'ok',
    thresholdLabel: '< 15ms',
    spark: [9, 8, 7, 8, 7, 6, 7, 6, 5, 7, 6, 6.2],
    icon: ScanLine,
  },
  {
    ar: 'فقد الحزم',
    en: 'Packet Loss',
    value: '0.4',
    unit: '%',
    threshold: 'warn',
    thresholdLabel: '< 1%',
    spark: [0.2, 0.3, 0.5, 0.7, 0.8, 0.6, 0.5, 0.4, 0.4, 0.3, 0.4, 0.4],
    icon: PackageX,
  },
  {
    ar: 'النطاق',
    en: 'Bandwidth',
    value: '32.4',
    unit: 'Mbps',
    threshold: 'ok',
    thresholdLabel: '< 50 Mbps',
    spark: [24, 26, 28, 30, 31, 33, 32, 30, 31, 32, 33, 32.4],
    icon: Wifi,
  },
]

// ---------------- Events / takeovers ----------------

interface TEvent {
  id: string
  kind: 'handoff' | 'taken' | 'estop' | 'audio-cut' | 'recording' | 'snapshot'
  ar: string
  en: string
  operator: string
  robot: string
  ts: string
}

const EVENTS: TEvent[] = [
  {
    id: 'e1',
    kind: 'taken',
    ar: 'تمّت السيطرة على الروبوت',
    en: 'Control taken',
    operator: 'Operator-1 · Faisal',
    robot: 'G1-RUH-01',
    ts: '11:42:18',
  },
  {
    id: 'e2',
    kind: 'handoff',
    ar: 'تسليم التحكم بين المشغّلين',
    en: 'Operator handoff',
    operator: 'Operator-2 → Operator-1',
    robot: 'GO2-NEOM-01',
    ts: '11:38:04',
  },
  {
    id: 'e3',
    kind: 'recording',
    ar: 'بدأ التسجيل',
    en: 'Recording started',
    operator: 'Operator-3 · Lina',
    robot: 'G1-JED-01',
    ts: '11:31:50',
  },
  {
    id: 'e4',
    kind: 'audio-cut',
    ar: 'قطع الصوت العام',
    en: 'Audio cut',
    operator: 'Operator-1 · Faisal',
    robot: 'PA · venue',
    ts: '11:24:12',
  },
  {
    id: 'e5',
    kind: 'estop',
    ar: 'إيقاف طارئ',
    en: 'Emergency stop',
    operator: 'Auto · safety guard',
    robot: 'G1-AHS-01',
    ts: '11:19:33',
  },
  {
    id: 'e6',
    kind: 'snapshot',
    ar: 'لقطة من البث',
    en: 'Snapshot captured',
    operator: 'Operator-2 · Hessa',
    robot: 'GO2-DMM-01',
    ts: '11:12:07',
  },
]

const TURN_SERVERS = [
  'turn:turn-ruh-01.savvy.world:3478',
  'turn:turn-jed-02.savvy.world:3478',
  'stun:stun-global.savvy.world:19302',
]

// ---------------- Page ----------------

export function TelepresencePage() {
  const [activeId, setActiveId] = useState<string>('G1-RUH-01')
  const [codec, setCodec] = useState<'H.264' | 'H.265'>('H.265')
  const [paused, setPaused] = useState(false)

  const stage = useMemo(() => STREAMS.filter((s) => MAIN_STAGE_IDS.includes(s.id)), [])
  const active = useMemo(
    () => STREAMS.find((s) => s.id === activeId) ?? STREAMS[0],
    [activeId]
  )

  return (
    <PageShell
      active="streaming"
      ar="البث المباشر والحضور عن بُعد"
      en="Telepresence & Live Streaming"
      icon={Video}
      description="مركز عمليات الحضور عن بُعد لأسطول Savvy World — WebRTC SFU متعدد المناطق، نقل صوت وصورة بزمن استجابة منخفض، تحكّم تشغيلي وتسليم بين المشغّلين، رصد جودة الشبكة وتسجيل اللقطات."
    >
      {/* KPI strip */}
      <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {KPIS.map((k, i) => (
          <MagicStatCard
            key={k.en}
            ar={k.ar}
            en={k.en}
            value={parseFloat(k.value)}
            unit={k.unit ?? ''}
            icon={k.icon}
            delay={i * 0.05}
          />
        ))}
      </div>

      {/* Main grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-12 gap-3"
      >
        {/* Main stage 2x2 */}
        <section className="col-span-12 lg:col-span-8">
          <div className="glass-card p-3">
            <div className="mb-2 flex items-end justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold text-[--color-ink]">منصة العرض الحيّة</h3>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Live stage · 2×2 multiview
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Chip>WebRTC · SFU</Chip>
                <Chip tone="muted">Mesh fallback</Chip>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {stage.map((s) => (
                <ViewportTile key={s.id} stream={s} large onClick={() => setActiveId(s.id)} active={s.id === activeId} />
              ))}
            </div>
          </div>
        </section>

        {/* Selected stream side panel */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="glass-card p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Cast size={13} className="text-[--color-admiral-glow]" />
                  <h3 className="truncate text-[14px] font-extrabold text-[--color-ink]">البث المختار</h3>
                </div>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Selected stream
                </div>
              </div>
              <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">{active.id}</span>
            </div>

            <ViewportTile stream={active} large showSubject onPause={() => setPaused((p) => !p)} paused={paused} />

            {/* Codec toggle */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[--color-line] bg-black/30 p-1">
              {(['H.264', 'H.265'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCodec(c)}
                  className={cn(
                    'flex-1 rounded-lg px-2 py-1.5 font-en text-[11px] font-bold uppercase tracking-[0.16em] transition-all',
                    codec === c
                      ? 'border border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 text-[--color-admiral-glow] shadow-[0_0_18px_rgba(78,163,255,0.18)]'
                      : 'border border-transparent text-[--color-ink-2] hover:bg-white/[0.04]'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Stats grid */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Stat ar="معدّل البت" en="Bitrate" value={`${(active.bitrateKbps / 1000).toFixed(1)} Mbps`} />
              <Stat ar="فقد الحزم" en="Packets lost" value={`${active.packetsLost}`} />
              <Stat ar="الارتعاش" en="Jitter" value={`${active.jitterMs} ms`} />
              <Stat ar="فاصل المفاتيح" en="Keyframe int." value={`${active.keyframeSec}s`} />
              <Stat ar="حالة ICE" en="ICE state" value={active.iceState} mono />
              <Stat ar="مستوى الصوت" en="Audio level" value={`${active.audioLevelDb} dBFS`} />
            </div>

            {/* Audio meter */}
            <div className="mt-3 rounded-xl border border-[--color-line] bg-black/30 p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                  Audio · live waveform
                </span>
                <span className="inline-flex items-center gap-1 font-en text-[10px] font-bold tabular-nums text-[--color-good]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[--color-good] shadow-[0_0_8px_rgba(46,213,115,0.7)]" />
                  ON-AIR
                </span>
              </div>
              <Waveform bars={56} className="h-10 w-full" />
            </div>

            {/* TURN/STUN list */}
            <div className="mt-3 rounded-xl border border-[--color-line] bg-black/30 p-2.5">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Server size={11} className="text-[--color-admiral-glow]" />
                <span className="font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                  TURN / STUN servers
                </span>
              </div>
              <ul className="space-y-1">
                {TURN_SERVERS.map((s) => (
                  <li
                    key={s}
                    className="flex items-center justify-between gap-2 font-en text-[10.5px] font-semibold tabular-nums text-[--color-ink-2]"
                  >
                    <span className="truncate">{s}</span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-[--color-good]/25 bg-[--color-good]/10 px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-wider text-[--color-good]">
                      <span className="h-1 w-1 rounded-full bg-[--color-good]" />
                      OK
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA cluster */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.4)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/20 px-3 py-2 font-en text-[11.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow] shadow-[0_0_24px_rgba(78,163,255,0.18)] hover:from-[#0a3a7e]/60">
                <Hand size={13} />
                Take control
              </button>
              <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[--color-warn]/30 bg-[--color-warn]/10 px-3 py-2 font-en text-[11px] font-bold uppercase tracking-[0.16em] text-[--color-warn] hover:bg-[--color-warn]/15">
                <MicOff size={12} />
                Cut audio
              </button>
              <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[--color-line] bg-white/[0.03] px-3 py-2 font-en text-[11px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2] hover:bg-white/[0.06]">
                <Camera size={12} />
                Snapshot
              </button>
              <button className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[--color-bad]/30 bg-[--color-bad]/10 px-3 py-2 font-en text-[11px] font-bold uppercase tracking-[0.16em] text-[--color-bad] hover:bg-[--color-bad]/15">
                <CircleDot size={12} />
                Record
              </button>
            </div>
          </div>
        </aside>

        {/* Camera grid (all cameras) */}
        <section className="col-span-12">
          <div className="glass-card p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold text-[--color-ink]">شبكة الكاميرات</h3>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  All cameras · {STREAMS.length} sources
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Chip>10 robots</Chip>
                <Chip tone="muted">2 facilities</Chip>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9">
              {STREAMS.map((s) => (
                <ViewportTile
                  key={s.id}
                  stream={s}
                  small
                  onClick={() => setActiveId(s.id)}
                  active={s.id === activeId}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Audio rack */}
        <section className="col-span-12 lg:col-span-7">
          <div className="glass-card p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold text-[--color-ink]">رفّ القنوات الصوتية</h3>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Audio rack · 4-channel mixer · LUFS metering
                </div>
              </div>
              <Chip>Opus 48kHz · stereo</Chip>
            </div>
            <div className="space-y-2">
              {AUDIO_STRIPS.map((s) => (
                <ChannelStrip key={s.id} strip={s} />
              ))}
            </div>
          </div>
        </section>

        {/* Network telemetry */}
        <section className="col-span-12 lg:col-span-5">
          <div className="glass-card p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold text-[--color-ink]">قياس جودة الشبكة</h3>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Network telemetry · last 60s
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {NET_METRICS.map((m) => (
                <NetCard key={m.en} metric={m} />
              ))}
            </div>
          </div>
        </section>

        {/* Events timeline */}
        <section className="col-span-12">
          <div className="glass-card p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h3 className="text-[15px] font-extrabold text-[--color-ink]">آخر الأحداث والتسليم</h3>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Recent events & operator handoffs
                </div>
              </div>
              <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
                {EVENTS.length} events · last 30 min
              </span>
            </div>
            <ul className="divide-y divide-[--color-line]">
              {EVENTS.map((e) => (
                <EventRow key={e.id} ev={e} />
              ))}
            </ul>
          </div>
        </section>
      </motion.div>
    </PageShell>
  )
}

// ---------------- Sub-components ----------------

function Chip({
  children,
  tone = 'admiral',
}: {
  children: React.ReactNode
  tone?: 'admiral' | 'muted' | 'good' | 'warn' | 'bad'
}) {
  const cls =
    tone === 'admiral'
      ? 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 text-[--color-admiral-glow]'
      : tone === 'good'
        ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
        : tone === 'warn'
          ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
          : tone === 'bad'
            ? 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]'
            : 'border-[--color-line] bg-white/[0.03] text-[--color-ink-2]'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em]',
        cls
      )}
    >
      {children}
    </span>
  )
}

interface ViewportProps {
  stream: StreamMeta
  large?: boolean
  small?: boolean
  active?: boolean
  showSubject?: boolean
  paused?: boolean
  onClick?: () => void
  onPause?: () => void
}

function ViewportTile({
  stream,
  large,
  small,
  active,
  showSubject = true,
  paused,
  onClick,
  onPause,
}: ViewportProps) {
  const isLive = stream.status === 'live'
  const isOffline = stream.status === 'offline'

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative block w-full overflow-hidden rounded-2xl border text-start transition-all',
        active
          ? 'border-[rgba(78,163,255,0.55)] shadow-[0_0_28px_rgba(78,163,255,0.28)]'
          : 'border-[--color-line] hover:border-[rgba(78,163,255,0.4)]',
        small ? 'aspect-video' : 'aspect-video'
      )}
      style={{
        background: isOffline
          ? 'radial-gradient(120% 90% at 30% 10%, #1a0a0e 0%, transparent 60%), linear-gradient(180deg, #0a0608, #050306)'
          : `radial-gradient(120% 90% at 30% 10%, #0a3a7e 0%, transparent 60%),
             radial-gradient(120% 90% at 80% 90%, #002766 0%, transparent 60%),
             linear-gradient(180deg, #050b22, #02060f)`,
      }}
    >
      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_50%,rgba(0,0,0,0.55)_100%)]" />

      {/* humanoid silhouette */}
      {showSubject && !isOffline && (
        <svg
          viewBox="0 0 100 56"
          className={cn(
            'absolute inset-0 h-full w-full',
            small ? 'opacity-70' : 'opacity-90'
          )}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id={`halo-${stream.id}`} cx="0.5" cy="0.42" r="0.45">
              <stop offset="0%" stopColor="rgba(78,163,255,0.32)" />
              <stop offset="100%" stopColor="rgba(78,163,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="26" r="20" fill={`url(#halo-${stream.id})`} />
          {/* head */}
          <ellipse
            cx="50"
            cy="20"
            rx="6"
            ry="7"
            fill="rgba(0,0,0,0.55)"
            stroke="rgba(78,163,255,0.55)"
            strokeWidth="0.4"
          />
          {/* visor */}
          <rect x="46" y="19" width="8" height="1.4" rx="0.7" fill="rgba(78,163,255,0.85)" />
          {/* shoulders / chest */}
          <path
            d="M38 38 Q38 30 44 30 L56 30 Q62 30 62 38 L62 54 L38 54 Z"
            fill="rgba(0,0,0,0.55)"
            stroke="rgba(78,163,255,0.4)"
            strokeWidth="0.4"
          />
          {/* chest light */}
          <circle cx="50" cy="42" r="0.9" fill="rgba(78,163,255,0.95)" />
          {/* arms */}
          <path d="M38 38 L30 50" stroke="rgba(78,163,255,0.45)" strokeWidth="0.5" />
          <path d="M62 38 L70 50" stroke="rgba(78,163,255,0.45)" strokeWidth="0.5" />
        </svg>
      )}

      {/* offline overlay */}
      {isOffline && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-en text-[10px] font-bold uppercase tracking-[0.22em] text-[--color-bad]">
              Signal lost
            </div>
            <div className="mt-1 font-en text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
              ICE: failed · reconnecting
            </div>
          </div>
        </div>
      )}

      {/* latency chip top-left */}
      <span
        className={cn(
          'absolute start-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 font-en font-bold tabular-nums text-white backdrop-blur-md',
          small ? 'text-[8px]' : 'text-[9.5px]'
        )}
      >
        <ScanLine size={small ? 8 : 9} className="text-[--color-admiral-glow]" />
        {isLive ? `${stream.latencyMs}ms · ${stream.resolution}` : '— · —'}
      </span>

      {/* LIVE chip top-right */}
      <span
        className={cn(
          'absolute end-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 font-en font-bold uppercase tracking-wider text-white backdrop-blur-md',
          small ? 'text-[8px]' : 'text-[9.5px]'
        )}
      >
        {isLive ? (
          <>
            <span className="relative grid h-1.5 w-1.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[--color-bad]/70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-bad]" />
            </span>
            LIVE
          </>
        ) : isOffline ? (
          <>
            <AlertTriangle size={small ? 8 : 9} className="text-[--color-bad]" />
            OFFLINE
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-[--color-warn]" />
            STBY
          </>
        )}
      </span>

      {/* bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#02060f] to-transparent" />

      {/* robot id + city bottom-left */}
      <div className="absolute bottom-1.5 start-1.5 max-w-[70%]">
        <div
          className={cn(
            'truncate font-en font-bold tabular-nums text-white drop-shadow',
            small ? 'text-[9px]' : 'text-[11px]'
          )}
        >
          {stream.id}
        </div>
        <div
          className={cn(
            'truncate font-bold text-[--color-ink-2] drop-shadow',
            small ? 'text-[8.5px]' : 'text-[10.5px]'
          )}
        >
          {stream.city}
          <span className="ms-1 font-en font-semibold uppercase tracking-[0.12em] text-[--color-faint]">
            {stream.cityEn}
          </span>
        </div>
      </div>

      {/* pause / fullscreen bottom-right */}
      {!small && (
        <div className="absolute bottom-1.5 end-1.5 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPause?.()
            }}
            className="grid h-6 w-6 place-items-center rounded-md border border-white/15 bg-black/55 text-white backdrop-blur-md hover:bg-black/75"
            aria-label="إيقاف / Pause"
          >
            {paused ? <Radio size={11} /> : <Pause size={11} />}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="grid h-6 w-6 place-items-center rounded-md border border-white/15 bg-black/55 text-white backdrop-blur-md hover:bg-black/75"
            aria-label="تكبير / Fullscreen"
          >
            <Maximize2 size={11} />
          </button>
        </div>
      )}

      {/* small tile codec corner */}
      {small && isLive && (
        <span className="absolute bottom-1 end-1 rounded bg-black/60 px-1 py-[1px] font-en text-[7.5px] font-bold uppercase tracking-wider text-white/85 backdrop-blur-md">
          {stream.codec}
        </span>
      )}

      {/* large tile facility/robot tag */}
      {large && (
        <span className="absolute end-1.5 bottom-9 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 font-en text-[8.5px] font-bold uppercase tracking-wider text-[--color-admiral-glow] backdrop-blur-md">
          <Camera size={9} />
          {stream.kind === 'facility' ? 'Facility' : 'Robot'} · {stream.codec}
        </span>
      )}
    </button>
  )
}

function Stat({
  ar,
  en,
  value,
  mono,
}: {
  ar: string
  en: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/30 p-2.5 backdrop-blur-md">
      <div className="text-[11px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
        {en}
      </div>
      <div
        className={cn(
          'mt-1 font-en text-[14px] font-extrabold tabular-nums text-[--color-ink]',
          mono && 'uppercase tracking-[0.12em]'
        )}
      >
        {value}
      </div>
    </div>
  )
}

function ChannelStrip({ strip }: { strip: AudioStrip }) {
  const [muted, setMuted] = useState(strip.muted)
  const [solo, setSolo] = useState(strip.solo)
  const [gain, setGain] = useState(strip.gain)
  const Icon = strip.icon

  // LUFS-style level meter — 14 segments, color graded
  const segments = 14
  const lit = Math.round(strip.level * segments)

  return (
    <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
      <div className="grid grid-cols-12 items-center gap-3">
        {/* identity */}
        <div className="col-span-12 flex items-center gap-2.5 sm:col-span-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
            <Icon size={14} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-extrabold text-[--color-ink]">{strip.ar}</div>
            <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
              {strip.en} · {strip.tag}
            </div>
          </div>
        </div>

        {/* waveform */}
        <div className="col-span-7 sm:col-span-4">
          <div className={cn('h-9 w-full rounded-lg border border-[--color-line] bg-black/40 px-2', muted && 'opacity-30')}>
            <Waveform bars={48} className="h-full w-full" />
          </div>
        </div>

        {/* level meter */}
        <div className="col-span-5 sm:col-span-2">
          <div className="flex h-9 items-end gap-[2px] rounded-lg border border-[--color-line] bg-black/40 px-1.5 py-1">
            {Array.from({ length: segments }).map((_, i) => {
              const isLit = i < lit && !muted
              const ratio = i / segments
              const color =
                ratio < 0.6
                  ? 'rgba(46,213,115,0.85)'
                  : ratio < 0.85
                    ? 'rgba(245,165,36,0.9)'
                    : 'rgba(255,80,80,0.95)'
              return (
                <span
                  key={i}
                  className="flex-1 rounded-[1.5px]"
                  style={{
                    height: `${20 + ratio * 70}%`,
                    background: isLit ? color : 'rgba(255,255,255,0.06)',
                    boxShadow: isLit && ratio > 0.6 ? `0 0 6px ${color}` : undefined,
                  }}
                />
              )
            })}
          </div>
          <div className="mt-1 flex items-center justify-between font-en text-[9px] font-semibold tabular-nums text-[--color-faint]">
            <span>−60</span>
            <span>LUFS</span>
            <span>0</span>
          </div>
        </div>

        {/* gain */}
        <div className="col-span-9 sm:col-span-2">
          <div className="flex items-center gap-2">
            <span className="font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
              Gain
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={gain}
              onChange={(e) => setGain(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[--color-line] accent-[--color-admiral-glow]"
            />
            <span className="w-7 text-end font-en text-[10.5px] font-bold tabular-nums text-[--color-ink]">
              {gain}
            </span>
          </div>
        </div>

        {/* mute/solo */}
        <div className="col-span-3 flex items-center justify-end gap-1.5 sm:col-span-1">
          <button
            onClick={() => setMuted((m) => !m)}
            className={cn(
              'grid h-8 w-8 place-items-center rounded-lg border font-en text-[9.5px] font-extrabold uppercase tracking-wider transition-colors',
              muted
                ? 'border-[--color-bad]/40 bg-[--color-bad]/15 text-[--color-bad]'
                : 'border-[--color-line] bg-white/[0.03] text-[--color-ink-2] hover:bg-white/[0.06]'
            )}
            aria-label="mute"
          >
            M
          </button>
          <button
            onClick={() => setSolo((s) => !s)}
            className={cn(
              'grid h-8 w-8 place-items-center rounded-lg border font-en text-[9.5px] font-extrabold uppercase tracking-wider transition-colors',
              solo
                ? 'border-[--color-warn]/40 bg-[--color-warn]/15 text-[--color-warn]'
                : 'border-[--color-line] bg-white/[0.03] text-[--color-ink-2] hover:bg-white/[0.06]'
            )}
            aria-label="solo"
          >
            S
          </button>
        </div>
      </div>
    </div>
  )
}

function NetCard({ metric }: { metric: NetMetric }) {
  const Icon = metric.icon
  const tone =
    metric.threshold === 'ok'
      ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
      : metric.threshold === 'warn'
        ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
        : 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]'

  // Build mini sparkline path (no Sparkline.tsx — keep tile compact, custom)
  const W = 100
  const H = 28
  const max = Math.max(...metric.spark)
  const min = Math.min(...metric.spark)
  const span = max - min || 1
  const step = W / (metric.spark.length - 1)
  const pts = metric.spark.map(
    (v, i) => `${(i * step).toFixed(2)},${(H - ((v - min) / span) * (H - 4) - 2).toFixed(2)}`
  )
  const path = `M${pts.join(' L')}`
  const area = `${path} L${W},${H} L0,${H} Z`
  const stroke =
    metric.threshold === 'ok' ? '#4ea3ff' : metric.threshold === 'warn' ? '#f5a524' : '#ff5050'

  return (
    <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Icon size={11} className="text-[--color-admiral-glow]" />
            <div className="truncate text-[12px] font-bold text-[--color-ink-2]">{metric.ar}</div>
          </div>
          <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
            {metric.en}
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.14em]',
            tone
          )}
        >
          {metric.thresholdLabel}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className="font-en text-[20px] font-extrabold leading-none tabular-nums tracking-tight text-[--color-ink]">
          {metric.value}
        </div>
        <div className="font-en text-[10px] font-bold uppercase tracking-[0.14em] text-[--color-faint]">
          {metric.unit}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" className="mt-2">
        <defs>
          <linearGradient id={`net-${metric.en}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#net-${metric.en})`} />
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function EventRow({ ev }: { ev: TEvent }) {
  const cfg = (() => {
    switch (ev.kind) {
      case 'taken':
        return { Icon: Hand, tone: 'admiral' as const, badge: 'CONTROL' }
      case 'handoff':
        return { Icon: Cast, tone: 'admiral' as const, badge: 'HANDOFF' }
      case 'estop':
        return { Icon: AlertTriangle, tone: 'bad' as const, badge: 'E-STOP' }
      case 'audio-cut':
        return { Icon: MicOff, tone: 'warn' as const, badge: 'AUDIO' }
      case 'recording':
        return { Icon: CircleDot, tone: 'bad' as const, badge: 'REC' }
      case 'snapshot':
        return { Icon: Camera, tone: 'good' as const, badge: 'SNAP' }
    }
  })()
  const toneCls =
    cfg.tone === 'bad'
      ? 'text-[--color-bad] bg-[--color-bad]/10 border-[--color-bad]/30'
      : cfg.tone === 'warn'
        ? 'text-[--color-warn] bg-[--color-warn]/10 border-[--color-warn]/30'
        : cfg.tone === 'good'
          ? 'text-[--color-good] bg-[--color-good]/10 border-[--color-good]/30'
          : 'text-[--color-admiral-glow] bg-[--color-admiral]/15 border-[rgba(78,163,255,0.28)]'

  const Icon = cfg.Icon
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span
        className={cn(
          'grid h-8 w-8 shrink-0 place-items-center rounded-xl border',
          toneCls
        )}
      >
        <Icon size={13} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-extrabold text-[--color-ink]">{ev.ar}</span>
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.16em]',
              toneCls
            )}
          >
            {cfg.badge}
          </span>
        </div>
        <div className="truncate font-en text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
          {ev.en} · {ev.operator} · {ev.robot}
        </div>
      </div>
      <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">{ev.ts}</span>
    </li>
  )
}
