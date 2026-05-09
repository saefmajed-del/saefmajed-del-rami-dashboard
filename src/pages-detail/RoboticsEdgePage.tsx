import { type ComponentType } from 'react'
import {
  CircuitBoard,
  Bot,
  Radio,
  Wifi,
  Zap,
  GitBranch,
  Network,
  ShieldAlert,
  Box,
  Boxes,
  MapPin,
  AlertTriangle,
  Clock,
  Download,
  Upload,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { MagicStatCard } from '@/components/magic/MagicStatCard'
import { NeuralNetwork3D } from '@/components/magic/NeuralNetwork3D'
import { PageShell } from '@/pages-detail/_PageShell'
import { Sparkline } from '@/home/parts/Sparkline'
import { PanelHeader } from '@/home/parts/PanelHeader'
import { ROBOT_PINS } from '@/home/data'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* DEMO DATA                                                          */
/* ------------------------------------------------------------------ */

type Tone = 'good' | 'warn' | 'bad' | 'admiral'

interface Kpi {
  ar: string
  en: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  spark: number[]
  icon: ComponentType<{ size?: number; className?: string }>
}

const KPIS: Kpi[] = [
  {
    ar: 'عقد ROS2',
    en: 'ROS2 Nodes',
    value: '142',
    delta: '+6',
    trend: 'up',
    spark: [128, 130, 132, 131, 134, 136, 138, 138, 139, 140, 141, 142],
    icon: GitBranch,
  },
  {
    ar: 'تجزئات DDS',
    en: 'DDS Partitions',
    value: '3',
    delta: '0',
    trend: 'flat',
    spark: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    icon: Network,
  },
  {
    ar: 'مواضيع MQTT',
    en: 'MQTT Topics',
    value: '87',
    delta: '+4',
    trend: 'up',
    spark: [78, 79, 80, 82, 83, 83, 84, 85, 85, 86, 86, 87],
    icon: Radio,
  },
  {
    ar: 'متوسط النبض',
    en: 'Heartbeat avg',
    value: '24ms',
    delta: '-2',
    trend: 'down',
    spark: [28, 27, 27, 26, 26, 25, 25, 24, 25, 24, 24, 24],
    icon: Zap,
  },
  {
    ar: 'تأكيد الأوامر p95',
    en: 'Cmd ack p95',
    value: '38ms',
    delta: '+1',
    trend: 'flat',
    spark: [37, 37, 38, 38, 39, 38, 38, 37, 38, 39, 38, 38],
    icon: Clock,
  },
  {
    ar: 'تحديثات OTA جارية',
    en: 'OTA in flight',
    value: '2',
    delta: '+1',
    trend: 'up',
    spark: [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
    icon: Download,
  },
]

/* --- DDS partitions --- */
interface DdsPartition {
  name: string
  ar: string
  en: string
  pubs: number
  subs: number
  rate: string
  p50: string
  p99: string
  health: Tone
  icon: ComponentType<{ size?: number; className?: string }>
}
const DDS_PARTITIONS: DdsPartition[] = [
  {
    name: 'savvy.fleet.command',
    ar: 'قناة الأوامر',
    en: 'Command Plane',
    pubs: 4,
    subs: 10,
    rate: '120/s',
    p50: '8ms',
    p99: '42ms',
    health: 'good',
    icon: Zap,
  },
  {
    name: 'savvy.fleet.telemetry',
    ar: 'قناة القياس',
    en: 'Telemetry',
    pubs: 10,
    subs: 6,
    rate: '4.8k/s',
    p50: '14ms',
    p99: '88ms',
    health: 'warn',
    icon: Radio,
  },
  {
    name: 'savvy.fleet.video',
    ar: 'قناة الفيديو',
    en: 'Video Stream',
    pubs: 8,
    subs: 4,
    rate: '240/s',
    p50: '22ms',
    p99: '110ms',
    health: 'good',
    icon: Upload,
  },
]

/* --- MQTT topics --- */
interface MqttTopic {
  topic: string
  qos: 0 | 1 | 2
  retained: boolean
  rate: string
  lastPub: string
  payload: string
  spark: number[]
}
const MQTT_TOPICS: MqttTopic[] = [
  { topic: 'savvy/robot/+/heartbeat', qos: 0, retained: false, rate: '10/s', lastPub: 'G1-RUH-01', payload: '128 B', spark: [9, 10, 10, 10, 11, 10, 10, 10, 9, 10, 10, 10] },
  { topic: 'savvy/robot/+/cmd', qos: 1, retained: false, rate: '24/s', lastPub: 'gateway', payload: '512 B', spark: [18, 20, 22, 24, 24, 23, 24, 24, 25, 24, 24, 24] },
  { topic: 'savvy/robot/+/video', qos: 0, retained: false, rate: '30/s', lastPub: 'GO2-NEOM-01', payload: '64 KB', spark: [24, 26, 28, 30, 30, 29, 30, 30, 30, 30, 30, 30] },
  { topic: 'savvy/robot/+/telemetry', qos: 1, retained: true, rate: '50/s', lastPub: 'G1-JED-01', payload: '2.1 KB', spark: [40, 44, 46, 48, 50, 50, 50, 49, 50, 50, 50, 50] },
  { topic: 'savvy/fleet/alerts', qos: 2, retained: true, rate: '0.4/s', lastPub: 'monitor', payload: '320 B', spark: [0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1] },
  { topic: 'savvy/ota/status', qos: 1, retained: true, rate: '1/s', lastPub: 'ota-orch', payload: '480 B', spark: [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1] },
  { topic: 'savvy/geofence/breach', qos: 2, retained: false, rate: '0.1/s', lastPub: 'geo-engine', payload: '256 B', spark: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0] },
  { topic: 'savvy/robot/+/diagnostics', qos: 1, retained: false, rate: '5/s', lastPub: 'G1-QSM-01', payload: '1.4 KB', spark: [4, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5] },
  { topic: 'savvy/fleet/presence', qos: 0, retained: true, rate: '0.2/s', lastPub: 'broker', payload: '96 B', spark: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0] },
  { topic: 'savvy/robot/+/audio', qos: 0, retained: false, rate: '12/s', lastPub: 'G1-JIZ-01', payload: '8 KB', spark: [10, 11, 12, 12, 12, 11, 12, 12, 12, 12, 12, 12] },
]

/* --- Edge agent per robot --- */
interface EdgeAgent {
  id: string
  agentVersion: string
  nodeCount: number
  domainId: number
  ddsHealth: Tone
  mqttState: 'connected' | 'reconnecting' | 'offline'
  cmdQueue: number
  lastHeartbeatMs: number
}
const EDGE_AGENTS: EdgeAgent[] = [
  { id: 'G1-RUH-01', agentVersion: 'v3.4.1', nodeCount: 16, domainId: 12, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 0, lastHeartbeatMs: 24 },
  { id: 'G1-JED-01', agentVersion: 'v3.4.1', nodeCount: 16, domainId: 14, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 1, lastHeartbeatMs: 26 },
  { id: 'GO2-DMM-01', agentVersion: 'v3.4.0', nodeCount: 14, domainId: 22, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 0, lastHeartbeatMs: 28 },
  { id: 'GO2-NEOM-01', agentVersion: 'v3.4.2', nodeCount: 15, domainId: 18, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 0, lastHeartbeatMs: 22 },
  { id: 'GO2-MED-01', agentVersion: 'v3.4.0', nodeCount: 14, domainId: 24, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 2, lastHeartbeatMs: 30 },
  { id: 'G1-AHS-01', agentVersion: 'v3.3.7', nodeCount: 0, domainId: 26, ddsHealth: 'bad', mqttState: 'offline', cmdQueue: 12, lastHeartbeatMs: 920 },
  { id: 'G1-ABH-01', agentVersion: 'v3.4.1', nodeCount: 16, domainId: 28, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 0, lastHeartbeatMs: 27 },
  { id: 'G1-TBK-01', agentVersion: 'v3.4.0', nodeCount: 15, domainId: 30, ddsHealth: 'warn', mqttState: 'reconnecting', cmdQueue: 4, lastHeartbeatMs: 142 },
  { id: 'G1-QSM-01', agentVersion: 'v3.4.1', nodeCount: 16, domainId: 32, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 1, lastHeartbeatMs: 25 },
  { id: 'G1-JIZ-01', agentVersion: 'v3.4.1', nodeCount: 16, domainId: 34, ddsHealth: 'good', mqttState: 'connected', cmdQueue: 0, lastHeartbeatMs: 29 },
]

/* --- Geofences --- */
type FenceMode = 'warn' | 'halt' | 'return'
interface Geofence {
  ar: string
  en: string
  active: number
  breaches: number
  mode: FenceMode
  policy: string
}
const GEOFENCES: Geofence[] = [
  { ar: 'مختبر جامعة الملك سعود · الدور 3', en: 'KSU-Lab-Floor3', active: 3, breaches: 0, mode: 'warn', policy: 'v1.4' },
  { ar: 'حظيرة نيوم A', en: 'NEOM-Hangar-A', active: 1, breaches: 1, mode: 'halt', policy: 'v2.0' },
  { ar: 'مركز الإبتكار · جامعة الملك عبدالعزيز', en: 'KAU-Innovation-Hub', active: 2, breaches: 0, mode: 'warn', policy: 'v1.4' },
  { ar: 'فلك جراج', en: 'Falak-Garage', active: 1, breaches: 2, mode: 'return', policy: 'v1.6' },
  { ar: 'كاكست · أرضية العرض', en: 'KACST-DemoFloor', active: 2, breaches: 0, mode: 'warn', policy: 'v1.4' },
]

/* --- OTA --- */
type OtaStatus = 'queued' | 'downloading' | 'verifying' | 'applying' | 'done' | 'failed'
interface OtaRow {
  id: string
  current: string
  target: string
  status: OtaStatus
  progress: number
  eta: string
  lastError?: string
}
const OTA_ROWS: OtaRow[] = [
  { id: 'G1-RUH-01', current: 'v3.4.1', target: 'v3.4.2', status: 'done', progress: 100, eta: '—' },
  { id: 'G1-JED-01', current: 'v3.4.1', target: 'v3.4.2', status: 'applying', progress: 88, eta: '00:42' },
  { id: 'GO2-DMM-01', current: 'v3.4.0', target: 'v3.4.2', status: 'verifying', progress: 64, eta: '01:18' },
  { id: 'GO2-NEOM-01', current: 'v3.4.2', target: 'v3.4.2', status: 'done', progress: 100, eta: '—' },
  { id: 'GO2-MED-01', current: 'v3.4.0', target: 'v3.4.2', status: 'downloading', progress: 41, eta: '02:36' },
  { id: 'G1-AHS-01', current: 'v3.3.7', target: 'v3.4.2', status: 'failed', progress: 12, eta: '—', lastError: 'unreachable · 12m' },
  { id: 'G1-ABH-01', current: 'v3.4.1', target: 'v3.4.2', status: 'queued', progress: 0, eta: '04:20' },
  { id: 'G1-TBK-01', current: 'v3.4.0', target: 'v3.4.2', status: 'downloading', progress: 28, eta: '03:48', lastError: 'wifi -71 dBm' },
  { id: 'G1-QSM-01', current: 'v3.4.1', target: 'v3.4.2', status: 'queued', progress: 0, eta: '05:10' },
  { id: 'G1-JIZ-01', current: 'v3.4.1', target: 'v3.4.2', status: 'applying', progress: 76, eta: '01:02' },
]

/* --- Latency histogram (10ms buckets, 0..200) --- */
const LATENCY_HIST: number[] = [
  4, 18, 42, 88, 142, 96, 64, 48, 32, 24, 18, 14, 10, 8, 6, 4, 3, 2, 2, 1,
]
const LAT_P50 = 38
const LAT_P95 = 78
const LAT_P99 = 132

/* --- Heartbeat strips --- */
function genHeartbeat(seed: number, anomaly = false): number[] {
  const out: number[] = []
  let v = 24 + (seed % 6)
  for (let i = 0; i < 60; i++) {
    const jitter = ((seed * (i + 1)) % 7) - 3
    v = Math.max(12, Math.min(60, v + jitter))
    if (anomaly && i > 40 && i < 50) v += 60
    out.push(v)
  }
  return out
}
const HEARTBEATS: { id: string; data: number[]; tone: Tone }[] = EDGE_AGENTS.map((a, i) => {
  const isBad = a.ddsHealth === 'bad'
  const isWarn = a.ddsHealth === 'warn'
  return {
    id: a.id,
    data: genHeartbeat(i + 3, isBad || isWarn),
    tone: isBad ? 'bad' : isWarn ? 'warn' : 'good',
  }
})

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export function RoboticsEdgePage() {
  return (
    <PageShell
      active="robotics-edge"
      ar="الوسيط والحافة"
      en="Robotics Middleware & Edge Layer"
      icon={CircuitBoard}
      description="مراقبة طبقة الوسيط للأسطول — ROS2، DDS، MQTT، عملاء الحافة، الجيوسياج، وتحديثات OTA — في مكان واحد لحظة بلحظة."
    >
      {/* === KPI strip === */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {KPIS.map((k, i) => (
          <MagicStatCard
            key={k.en}
            ar={k.ar}
            en={k.en}
            value={parseFloat(k.value.replace(/[^0-9.]/g, ''))}
            unit={k.value.includes('ms') ? 'ms' : ''}
            icon={k.icon}
            delay={i * 0.05}
          />
        ))}
      </section>

      {/* === Row: ROS2 graph + DDS partitions === */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 grid grid-cols-12 gap-3"
      >
        {/* ROS2 node graph */}
        <div className="glass-card col-span-12 overflow-hidden p-4 lg:col-span-7">
          <PanelHeader ar="رسم عقد ROS2 ثلاثي الأبعاد" en="3D ROS2 Node Graph" icon={GitBranch} />
          <div className="bg-grid relative h-[320px] overflow-hidden rounded-2xl border border-[--color-line] bg-black/30">
            <NeuralNetwork3D />
            <div className="absolute bottom-3 start-3 flex flex-wrap gap-2 rounded-xl border border-[--color-line] bg-black/55 px-3 py-2 backdrop-blur-md">
              <span className="font-en text-[9px] font-bold uppercase tracking-widest text-[--color-admiral-glow]">
                Neural Topology Mode · Real-time Sync
              </span>
            </div>
          </div>
        </div>

        {/* DDS partitions */}
        <div className="col-span-12 lg:col-span-5">
          <div className="glass-card p-4">
            <PanelHeader ar="طوبولوجيا DDS" en="DDS Communication" icon={Network} />
            <ul className="flex flex-col gap-2.5">
              {DDS_PARTITIONS.map((p) => {
                const Icon = p.icon
                const tone = toneVar(p.health)
                return (
                  <li
                    key={p.name}
                    className="rounded-2xl border bg-black/25 p-3 transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.18)]"
                    style={{ borderColor: `color-mix(in srgb, ${tone} 22%, var(--color-line))` }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border"
                        style={{
                          borderColor: `color-mix(in srgb, ${tone} 32%, transparent)`,
                          background: `color-mix(in srgb, ${tone} 12%, transparent)`,
                          color: tone,
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-en text-[12.5px] font-extrabold tracking-tight text-[--color-ink]">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-bold text-[--color-ink-2]">
                          {p.ar}
                          <span className="ms-1.5 font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                            {p.en}
                          </span>
                        </div>
                      </div>
                      <HealthPill tone={p.health} />
                    </div>
                    <div className="mt-2.5 grid grid-cols-5 gap-2">
                      <PartStat label="Pubs" v={String(p.pubs)} />
                      <PartStat label="Subs" v={String(p.subs)} />
                      <PartStat label="Rate" v={p.rate} />
                      <PartStat label="p50" v={p.p50} />
                      <PartStat label="p99" v={p.p99} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* === MQTT topics === */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card mt-4 overflow-hidden"
      >
        <div className="p-4 pb-3">
          <PanelHeader ar="جدول مواضيع MQTT" en="MQTT Topic Stream" icon={Radio} />
        </div>
        <div className="hairline mx-4" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-0">
            <thead>
              <tr>
                <Th>الموضوع · Topic</Th>
                <Th>QoS</Th>
                <Th>محفوظ · Retained</Th>
                <Th align="end">المعدّل · Rate</Th>
                <Th>آخر ناشر · Last Pub</Th>
                <Th align="end">الحمولة · Payload</Th>
                <Th align="end">الإنتاجية · Throughput</Th>
              </tr>
            </thead>
            <tbody>
              {MQTT_TOPICS.map((t) => (
                <tr key={t.topic} className="transition-colors hover:bg-white/[0.025]">
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
                      <span className="font-en text-[11.5px] font-extrabold tracking-tight text-[--color-ink]">
                        {t.topic}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <QosChip qos={t.qos} />
                  </Td>
                  <Td>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.14em]',
                        t.retained
                          ? 'border-[rgba(34,197,94,0.32)] bg-[--color-good]/12 text-[--color-good]'
                          : 'border-[--color-line] bg-black/30 text-[--color-muted]',
                      )}
                    >
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ background: t.retained ? 'var(--color-good)' : 'var(--color-muted)' }}
                      />
                      {t.retained ? 'YES' : 'NO'}
                    </span>
                  </Td>
                  <Td align="end">
                    <span className="font-en text-[12px] font-bold tabular-nums text-[--color-ink]">{t.rate}</span>
                  </Td>
                  <Td>
                    <span className="font-en text-[11px] font-bold tracking-tight text-[--color-ink-2]">
                      {t.lastPub}
                    </span>
                  </Td>
                  <Td align="end">
                    <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">{t.payload}</span>
                  </Td>
                  <Td align="end">
                    <div className="ms-auto w-[110px]">
                      <Sparkline data={t.spark} trend="up" height={22} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* === Row: Edge agents + Geofences === */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 grid grid-cols-12 gap-3"
      >
        <div className="glass-card col-span-12 overflow-hidden p-4 lg:col-span-7">
          <PanelHeader ar="عملاء الحافة لكل روبوت" en="Edge Agents per Robot" icon={Bot} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <Th>الروبوت · Robot</Th>
                  <Th>الإصدار · Agent</Th>
                  <Th align="end">العقد · Nodes</Th>
                  <Th align="end">DDS Domain</Th>
                  <Th>صحة DDS</Th>
                  <Th>MQTT</Th>
                  <Th align="end">قائمة الأوامر</Th>
                  <Th align="end">آخر نبض</Th>
                </tr>
              </thead>
              <tbody>
                {EDGE_AGENTS.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-white/[0.025]">
                    <Td>
                      <div className="flex items-center gap-2">
                        <span
                          className="relative inline-flex h-2 w-2 rounded-full"
                          style={{ background: toneVar(a.ddsHealth) }}
                        >
                          {a.ddsHealth === 'good' && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-[--color-good]/60" />
                          )}
                        </span>
                        <span className="font-en text-[11.5px] font-extrabold tabular-nums tracking-tight text-[--color-ink]">
                          {a.id}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span className="rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en text-[10px] font-bold tracking-tight text-[--color-ink-2]">
                        {a.agentVersion}
                      </span>
                    </Td>
                    <Td align="end">
                      <span className="font-en text-[11.5px] font-bold tabular-nums text-[--color-ink]">
                        {a.nodeCount}
                      </span>
                    </Td>
                    <Td align="end">
                      <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">
                        {a.domainId}
                      </span>
                    </Td>
                    <Td>
                      <HealthPill tone={a.ddsHealth} compact />
                    </Td>
                    <Td>
                      <MqttChip state={a.mqttState} />
                    </Td>
                    <Td align="end">
                      <span
                        className={cn(
                          'font-en text-[11.5px] font-bold tabular-nums',
                          a.cmdQueue === 0
                            ? 'text-[--color-muted]'
                            : a.cmdQueue < 5
                              ? 'text-[--color-ink]'
                              : 'text-[--color-warn]',
                        )}
                      >
                        {a.cmdQueue}
                      </span>
                    </Td>
                    <Td align="end">
                      <span
                        className={cn(
                          'font-en text-[11px] font-bold tabular-nums',
                          a.lastHeartbeatMs < 60
                            ? 'text-[--color-good]'
                            : a.lastHeartbeatMs < 300
                              ? 'text-[--color-warn]'
                              : 'text-[--color-bad]',
                        )}
                      >
                        {a.lastHeartbeatMs}ms ago
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geofences */}
        <div className="glass-card col-span-12 p-4 lg:col-span-5">
          <PanelHeader ar="الجيوسياج ومناطق الأمان" en="Geofencing & Safety Zones" icon={MapPin} />
          <ul className="flex flex-col gap-2">
            {GEOFENCES.map((g) => {
              const modeMeta = fenceModeMeta(g.mode)
              const hasBreach = g.breaches > 0
              return (
                <li
                  key={g.en}
                  className="rounded-2xl border bg-black/25 p-3"
                  style={{
                    borderColor: hasBreach
                      ? 'color-mix(in srgb, var(--color-bad) 28%, var(--color-line))'
                      : 'var(--color-line)',
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                      <MapPin size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-bold text-[--color-ink]">{g.ar}</div>
                      <div className="truncate font-en text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                        {g.en} · policy {g.policy}
                      </div>
                    </div>
                    <span
                      className="inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        borderColor: `color-mix(in srgb, ${modeMeta.color} 32%, transparent)`,
                        background: `color-mix(in srgb, ${modeMeta.color} 12%, transparent)`,
                        color: modeMeta.color,
                      }}
                    >
                      {modeMeta.en}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <FenceStat icon={Bot} label="Active" v={String(g.active)} />
                    <FenceStat
                      icon={ShieldAlert}
                      label="Breaches"
                      v={String(g.breaches)}
                      tone={hasBreach ? 'bad' : 'good'}
                    />
                    <FenceStat icon={AlertTriangle} label="Mode" v={modeMeta.ar} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.section>

        {/* === OTA === */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card mt-4 overflow-hidden"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 p-4">
          <div>
            <PanelHeader ar="حالة تحديثات OTA" en="OTA Deployment Status" icon={Download} />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/10 px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[--color-admiral-glow] opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
            </span>
            <span className="font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-ink]">
              Current rollout · firmware v3.4.2 (canary 20%)
            </span>
          </div>
        </div>
        <div className="hairline mx-4" />
        {/* Timeline */}
        <div className="px-4 pt-3">
          <div className="relative h-9 rounded-xl border border-[--color-line] bg-black/30 p-2">
            <div className="relative h-full w-full">
              {[0, 25, 50, 75, 100].map((p) => (
                <div
                  key={p}
                  className="absolute top-0 h-full border-s border-dashed border-[--color-line]"
                  style={{ insetInlineStart: `${p}%` }}
                />
              ))}
              {OTA_ROWS.map((r, i) => {
                const tone = otaTone(r.status)
                return (
                  <div
                    key={r.id}
                    className="absolute h-1 rounded-full"
                    style={{
                      top: `${(i % 5) * 4 + 4}px`,
                      insetInlineStart: '0%',
                      width: `${r.progress}%`,
                      background: tone,
                      boxShadow: `0 0 8px color-mix(in srgb, ${tone} 50%, transparent)`,
                    }}
                  />
                )
              })}
            </div>
          </div>
          <div className="mt-1 flex justify-between font-en text-[9px] font-bold uppercase tracking-[0.14em] text-[--color-faint]">
            <span>Queued</span>
            <span>Downloading</span>
            <span>Verifying</span>
            <span>Applying</span>
            <span>Done</span>
          </div>
        </div>
        {/* Per-robot rows */}
        <div className="overflow-x-auto p-4 pt-3">
          <table className="w-full min-w-[800px] border-separate border-spacing-0">
            <thead>
              <tr>
                <Th>الروبوت · Robot</Th>
                <Th>الحالي · Current</Th>
                <Th>الهدف · Target</Th>
                <Th>الحالة · Status</Th>
                <Th>التقدّم · Progress</Th>
                <Th align="end">المتبقّي · ETA</Th>
                <Th>آخر خطأ · Last Error</Th>
              </tr>
            </thead>
            <tbody>
              {OTA_ROWS.map((r) => {
                const tone = otaTone(r.status)
                return (
                  <tr key={r.id} className="transition-colors hover:bg-white/[0.025]">
                    <Td>
                      <span className="font-en text-[11.5px] font-extrabold tabular-nums tracking-tight text-[--color-ink]">
                        {r.id}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-en text-[11px] font-bold tracking-tight text-[--color-ink-2]">
                        {r.current}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-en text-[11px] font-bold tracking-tight text-[--color-ink]">
                        {r.target}
                      </span>
                    </Td>
                    <Td>
                      <span
                        className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.14em]"
                        style={{
                          borderColor: `color-mix(in srgb, ${tone} 32%, transparent)`,
                          background: `color-mix(in srgb, ${tone} 12%, transparent)`,
                          color: tone,
                        }}
                      >
                        <span className="h-1 w-1 rounded-full" style={{ background: tone }} />
                        {r.status}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="relative h-1.5 w-[140px] overflow-hidden rounded-full bg-white/[0.05]">
                          <div
                            className="absolute inset-y-0 start-0 rounded-full"
                            style={{
                              width: `${r.progress}%`,
                              background: `linear-gradient(90deg, ${tone}, color-mix(in srgb, ${tone} 50%, transparent))`,
                              boxShadow: `0 0 12px color-mix(in srgb, ${tone} 40%, transparent)`,
                            }}
                          />
                        </div>
                        <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
                          {r.progress}%
                        </span>
                      </div>
                    </Td>
                    <Td align="end">
                      <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">{r.eta}</span>
                    </Td>
                    <Td>
                      {r.lastError ? (
                        <span className="font-en text-[10.5px] font-bold tracking-tight text-[--color-bad]">
                          {r.lastError}
                        </span>
                      ) : (
                        <span className="font-en text-[10.5px] text-[--color-muted]">—</span>
                      )}
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.section>

        {/* === Row: Latency histogram + Heartbeat strips === */}
        <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4 grid grid-cols-12 gap-3"
        >
        {/* Latency histogram */}
        <div className="glass-card col-span-12 p-4 lg:col-span-6">
          <PanelHeader ar="مراقبة زمن استجابة الأوامر" en="Command Latency Monitor" icon={Clock} />
          <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
            <LatencyHistogram />
            <div className="mt-2 flex items-center justify-between font-en text-[10px] font-bold uppercase tracking-[0.14em] text-[--color-faint]">
              <span>0ms</span>
              <span>50ms</span>
              <span>100ms</span>
              <span>150ms</span>
              <span>200ms</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <LatencyMarker label="p50" v={`${LAT_P50}ms`} tone="good" />
              <LatencyMarker label="p95" v={`${LAT_P95}ms`} tone="admiral" />
              <LatencyMarker label="p99" v={`${LAT_P99}ms`} tone="warn" />
            </div>
          </div>
        </div>

        {/* Heartbeat strips */}
        <div className="glass-card col-span-12 p-4 lg:col-span-6">
          <PanelHeader ar="بثّ نبض القلب" en="Heartbeat Health Stream" icon={Wifi} />
          <ul className="flex flex-col gap-1.5">
            {HEARTBEATS.map((h) => (
              <li
                key={h.id}
                className="flex items-center gap-3 rounded-xl border border-[--color-line] bg-black/25 px-3 py-2"
              >
                <span className="font-en text-[11px] font-extrabold tabular-nums tracking-tight text-[--color-ink] w-[88px]">
                  {h.id}
                </span>
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: toneVar(h.tone) }}
                />
                <div className="flex-1">
                  <HeartbeatStrip data={h.data} tone={h.tone} />
                </div>
                <span
                  className={cn(
                    'font-en text-[10px] font-bold tabular-nums',
                    h.tone === 'good'
                      ? 'text-[--color-good]'
                      : h.tone === 'warn'
                        ? 'text-[--color-warn]'
                        : 'text-[--color-bad]',
                  )}
                >
                  {Math.round(h.data.reduce((a, b) => a + b, 0) / h.data.length)}ms
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* spacer */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[10.5px] font-bold text-[--color-faint]">
        <Boxes size={11} />
        <span className="font-en uppercase tracking-[0.18em]">
          Robotics Middleware · {ROBOT_PINS.length} edge units · DEMO data
        </span>
        <Box size={11} />
      </div>
    </PageShell>
  )
}

/* ------------------------------------------------------------------ */
/* sub-components                                                      */
/* ------------------------------------------------------------------ */

function toneVar(t: Tone): string {
  if (t === 'good') return 'var(--color-good)'
  if (t === 'warn') return 'var(--color-warn)'
  if (t === 'bad') return 'var(--color-bad)'
  return 'var(--color-admiral-glow)'
}

function fenceModeMeta(m: FenceMode): { ar: string; en: string; color: string } {
  if (m === 'halt') return { ar: 'إيقاف', en: 'HALT', color: 'var(--color-bad)' }
  if (m === 'return') return { ar: 'عودة للقاعدة', en: 'RTB', color: 'var(--color-warn)' }
  return { ar: 'تنبيه', en: 'WARN', color: 'var(--color-admiral-glow)' }
}

function otaTone(s: OtaStatus): string {
  if (s === 'done') return 'var(--color-good)'
  if (s === 'failed') return 'var(--color-bad)'
  if (s === 'queued') return 'var(--color-muted)'
  if (s === 'applying') return 'var(--color-admiral-glow)'
  return 'var(--color-warn)'
}

function HealthPill({ tone, compact }: { tone: Tone; compact?: boolean }) {
  const c = toneVar(tone)
  const ar = tone === 'good' ? 'سليم' : tone === 'warn' ? 'تحذير' : tone === 'bad' ? 'خطأ' : 'نشط'
  const en = tone === 'good' ? 'Healthy' : tone === 'warn' ? 'Warn' : tone === 'bad' ? 'Down' : 'Active'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-bold',
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[10.5px]',
      )}
      style={{
        borderColor: `color-mix(in srgb, ${c} 32%, transparent)`,
        background: `color-mix(in srgb, ${c} 14%, transparent)`,
        color: c,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      <span>{ar}</span>
      <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-80">{en}</span>
    </span>
  )
}

function PartStat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
      <div className="font-en text-[8.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">{label}</div>
      <div className="font-en text-[12px] font-extrabold tabular-nums tracking-tight text-[--color-ink]">{v}</div>
    </div>
  )
}

function QosChip({ qos }: { qos: 0 | 1 | 2 }) {
  const tone = qos === 2 ? 'var(--color-good)' : qos === 1 ? 'var(--color-admiral-glow)' : 'var(--color-muted)'
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.14em]"
      style={{
        borderColor: `color-mix(in srgb, ${tone} 32%, transparent)`,
        background: `color-mix(in srgb, ${tone} 12%, transparent)`,
        color: tone,
      }}
    >
      QoS {qos}
    </span>
  )
}

function MqttChip({ state }: { state: 'connected' | 'reconnecting' | 'offline' }) {
  const map = {
    connected: { color: 'var(--color-good)', ar: 'متصل', en: 'CONNECTED' },
    reconnecting: { color: 'var(--color-warn)', ar: 'يعيد الاتصال', en: 'RECONNECT' },
    offline: { color: 'var(--color-bad)', ar: 'منقطع', en: 'OFFLINE' },
  } as const
  const m = map[state]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.14em]"
      style={{
        borderColor: `color-mix(in srgb, ${m.color} 32%, transparent)`,
        background: `color-mix(in srgb, ${m.color} 12%, transparent)`,
        color: m.color,
      }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: m.color }} />
      {m.en}
    </span>
  )
}

function FenceStat({
  icon: Icon,
  label,
  v,
  tone,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  v: string
  tone?: Tone
}) {
  const color = tone ? toneVar(tone) : 'var(--color-ink)'
  return (
    <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
      <div className="flex items-center gap-1">
        <Icon size={10} className="text-[--color-faint]" />
        <span className="font-en text-[8.5px] font-bold uppercase tracking-[0.14em] text-[--color-faint]">{label}</span>
      </div>
      <div
        className="font-en text-[12px] font-extrabold tabular-nums tracking-tight"
        style={{ color }}
      >
        {v}
      </div>
    </div>
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

function LatencyHistogram() {
  const W = 360
  const H = 140
  const buckets = LATENCY_HIST.length
  const bw = W / buckets
  const max = Math.max(...LATENCY_HIST)
  const xFor = (latencyMs: number) => (latencyMs / 200) * W
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" height={H + 18} preserveAspectRatio="none">
      <defs>
        <linearGradient id="re-lat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(78,163,255,0.55)" />
          <stop offset="100%" stopColor="rgba(78,163,255,0.05)" />
        </linearGradient>
      </defs>
      {/* baseline */}
      <line x1="0" y1={H} x2={W} y2={H} stroke="rgba(122,134,168,0.25)" strokeWidth="0.5" />
      {/* grid */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" y1={H * (1 - g)} x2={W} y2={H * (1 - g)} stroke="rgba(122,134,168,0.12)" strokeWidth="0.5" strokeDasharray="2 3" />
      ))}
      {/* bars */}
      {LATENCY_HIST.map((v, i) => {
        const h = (v / max) * (H - 8)
        return (
          <rect
            key={i}
            x={i * bw + 0.6}
            y={H - h}
            width={bw - 1.2}
            height={h}
            fill="url(#re-lat)"
            stroke="rgba(78,163,255,0.6)"
            strokeWidth="0.5"
            rx="1"
          />
        )
      })}
      {/* p50 / p95 / p99 markers */}
      {[
        { v: LAT_P50, color: '#22c55e', label: 'p50' },
        { v: LAT_P95, color: '#4ea3ff', label: 'p95' },
        { v: LAT_P99, color: '#f5a524', label: 'p99' },
      ].map((m) => (
        <g key={m.label}>
          <line
            x1={xFor(m.v)}
            y1="0"
            x2={xFor(m.v)}
            y2={H}
            stroke={m.color}
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <rect
            x={xFor(m.v) - 14}
            y={H + 3}
            width="28"
            height="12"
            rx="2"
            fill={`${m.color}22`}
            stroke={m.color}
          />
          <text
            x={xFor(m.v)}
            y={H + 12}
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="700"
            fill={m.color}
          >
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function LatencyMarker({ label, v, tone }: { label: string; v: string; tone: Tone }) {
  const color = toneVar(tone)
  return (
    <div
      className="rounded-lg border bg-black/30 px-2 py-1.5"
      style={{ borderColor: `color-mix(in srgb, ${color} 28%, var(--color-line))` }}
    >
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color }}>
        {label}
      </div>
      <div className="font-en text-[14px] font-extrabold tabular-nums tracking-tight text-[--color-ink]">{v}</div>
    </div>
  )
}

function HeartbeatStrip({ data, tone }: { data: number[]; tone: Tone }) {
  const W = 200
  const H = 22
  const max = Math.max(...data, 60)
  const min = 10
  const span = max - min
  const step = W / (data.length - 1)
  const stroke = toneVar(tone)
  const points = data.map((v, i) => `${i * step},${H - ((v - min) / span) * (H - 4) - 2}`)
  const path = `M${points.join(' L')}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const high = v > 50
        if (!high) return null
        return (
          <circle
            key={i}
            cx={i * step}
            cy={H - ((v - min) / span) * (H - 4) - 2}
            r="1.2"
            fill={tone === 'bad' ? '#ef4444' : '#f5a524'}
          />
        )
      })}
    </svg>
  )
}
