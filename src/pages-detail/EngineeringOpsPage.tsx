import { useEffect, useMemo, useState } from 'react'
import {
  ServerCog,
  Cpu,
  Database,
  Cloud,
  GitBranch,
  Zap,
  Activity,
  Network,
  HardDrive,
  Gauge,
  GitCommit,
  Rocket,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Pause,
  X,
  RefreshCw,
} from 'lucide-react'
import { PageShell } from './_PageShell'
import { Sparkline } from '@/home/parts/Sparkline'
import { PanelHeader } from '@/home/parts/PanelHeader'
import { cn } from '@/lib/utils'

// ---------------- Helpers ----------------

type Trend = 'up' | 'down' | 'flat'
type Health = 'good' | 'warn' | 'bad'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function fmtTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const HEALTH_TEXT: Record<Health, string> = {
  good: 'text-[--color-good]',
  warn: 'text-[--color-warn]',
  bad: 'text-[--color-bad]',
}

const HEALTH_BG: Record<Health, string> = {
  good: 'bg-[--color-good]',
  warn: 'bg-[--color-warn]',
  bad: 'bg-[--color-bad]',
}

const HEALTH_GLOW: Record<Health, string> = {
  good: '0 0 8px rgba(34,197,94,0.65)',
  warn: '0 0 8px rgba(245,165,36,0.7)',
  bad: '0 0 8px rgba(244,63,94,0.7)',
}

// ---------------- KPI strip ----------------

interface Kpi {
  ar: string
  en: string
  value: string
  delta: string
  trend: Trend
  spark: number[]
  icon: typeof Activity
}

const KPIS: Kpi[] = [
  {
    ar: 'الخدمات الصحية',
    en: 'Services healthy',
    value: '42/44',
    delta: '+1',
    trend: 'up',
    spark: [38, 39, 40, 41, 41, 42, 41, 42, 42, 43, 42, 42],
    icon: ShieldCheck,
  },
  {
    ar: 'وقت التشغيل',
    en: 'Uptime · 30d',
    value: '99.97%',
    delta: '+0.02',
    trend: 'up',
    spark: [99.91, 99.92, 99.93, 99.94, 99.94, 99.95, 99.95, 99.96, 99.96, 99.96, 99.97, 99.97],
    icon: Activity,
  },
  {
    ar: 'استخدام GPU',
    en: 'GPU utilization',
    value: '68%',
    delta: '+4',
    trend: 'up',
    spark: [52, 55, 58, 60, 62, 61, 63, 65, 66, 67, 67, 68],
    icon: Cpu,
  },
  {
    ar: 'الإنتاجية',
    en: 'Throughput · ev/s',
    value: '12.4k',
    delta: '+0.8k',
    trend: 'up',
    spark: [9.1, 9.6, 10.1, 10.6, 10.9, 11.2, 11.5, 11.7, 11.9, 12.1, 12.3, 12.4],
    icon: Zap,
  },
  {
    ar: 'تأخير p99',
    en: 'p99 latency',
    value: '178ms',
    delta: '−6ms',
    trend: 'down',
    spark: [206, 202, 198, 194, 192, 190, 188, 186, 184, 182, 180, 178],
    icon: Gauge,
  },
  {
    ar: 'البودات',
    en: 'Pods running',
    value: '96/100',
    delta: '+2',
    trend: 'up',
    spark: [88, 89, 90, 92, 92, 93, 94, 94, 95, 95, 96, 96],
    icon: Boxes,
  },
]

// ---------------- Topology ----------------

interface TopoNode {
  id: string
  label: string
  sub: string
  x: number
  y: number
  layer: number
  health: Health
}

const TOPO_LAYERS = [
  { layer: 0, ar: 'الأجهزة الطرفية', en: 'Edge devices', count: 10, x: [60, 140, 220, 300, 380, 460, 540, 620, 700, 780] },
  { layer: 1, ar: 'وسطاء MQTT', en: 'MQTT brokers', count: 3, x: [200, 420, 640] },
  { layer: 2, ar: 'مُعالج التدفق', en: 'Stream processor', count: 2, x: [300, 540] },
  { layer: 3, ar: 'عنقود الذكاء', en: 'AI inference', count: 4, x: [180, 360, 540, 720] },
] as const

const TOPO_LAYER_Y = [60, 170, 290, 410]

function buildTopo(): { nodes: TopoNode[]; edges: { from: string; to: string; rate: string; health: Health }[] } {
  const nodes: TopoNode[] = []
  TOPO_LAYERS.forEach((L) => {
    for (let i = 0; i < L.count; i++) {
      const id = `L${L.layer}-${i}`
      const health: Health = (L.layer === 0 && i === 7) ? 'warn' : (L.layer === 3 && i === 2 ? 'warn' : 'good')
      nodes.push({
        id,
        label: L.layer === 0 ? `R-${pad2(i + 1)}` : L.layer === 1 ? `MQ-${i + 1}` : L.layer === 2 ? `KAF-${i + 1}` : `A100-${i + 1}`,
        sub: L.en,
        x: L.x[i],
        y: TOPO_LAYER_Y[L.layer],
        layer: L.layer,
        health,
      })
    }
  })

  const edges: { from: string; to: string; rate: string; health: Health }[] = []
  // edge -> mqtt (10 -> 3)
  for (let i = 0; i < 10; i++) {
    const broker = i < 4 ? 0 : i < 7 ? 1 : 2
    edges.push({ from: `L0-${i}`, to: `L1-${broker}`, rate: `${(0.4 + (i % 3) * 0.3).toFixed(1)}k`, health: 'good' })
  }
  // mqtt -> stream (3 -> 2)
  edges.push({ from: 'L1-0', to: 'L2-0', rate: '4.2k', health: 'good' })
  edges.push({ from: 'L1-1', to: 'L2-0', rate: '3.8k', health: 'good' })
  edges.push({ from: 'L1-1', to: 'L2-1', rate: '2.1k', health: 'good' })
  edges.push({ from: 'L1-2', to: 'L2-1', rate: '2.3k', health: 'warn' })
  // stream -> ai (2 -> 4)
  edges.push({ from: 'L2-0', to: 'L3-0', rate: '3.1k', health: 'good' })
  edges.push({ from: 'L2-0', to: 'L3-1', rate: '2.7k', health: 'good' })
  edges.push({ from: 'L2-1', to: 'L3-2', rate: '2.4k', health: 'warn' })
  edges.push({ from: 'L2-1', to: 'L3-3', rate: '2.9k', health: 'good' })

  return { nodes, edges }
}

// ---------------- Pipeline ----------------

interface PipelineStage {
  ar: string
  en: string
  icon: typeof Network
  ops: string
  p95: string
  err: string
  health: Health
  fill: number
}

const PIPELINE: PipelineStage[] = [
  { ar: 'الطرف', en: 'Edge', icon: HardDrive, ops: '12.4k/s', p95: '8ms', err: '0.01%', health: 'good', fill: 0.92 },
  { ar: 'الاستيعاب', en: 'Ingest', icon: Network, ops: '12.3k/s', p95: '14ms', err: '0.02%', health: 'good', fill: 0.88 },
  { ar: 'تطبيع', en: 'Normalize', icon: Cpu, ops: '12.1k/s', p95: '22ms', err: '0.04%', health: 'warn', fill: 0.74 },
  { ar: 'تخزين', en: 'Persist', icon: Database, ops: '12.0k/s', p95: '38ms', err: '0.01%', health: 'good', fill: 0.81 },
  { ar: 'استعلام', en: 'Query', icon: Activity, ops: '4.2k/s', p95: '46ms', err: '0.03%', health: 'good', fill: 0.66 },
]

// ---------------- AI models ----------------

interface AiModel {
  name: string
  version: string
  replicas: number
  gpu: 'A100' | 'L40'
  vram: string
  rpm: string
  status: Health
  ar: string
}

const MODELS: AiModel[] = [
  { name: 'Whisper-AR-large', version: 'v3.4.1', replicas: 4, gpu: 'A100', vram: '34/40GB', rpm: '842/min', status: 'good', ar: 'تعرف الكلام العربي' },
  { name: 'XTTS-Najdi-v2', version: 'v2.1.0', replicas: 3, gpu: 'A100', vram: '22/40GB', rpm: '514/min', status: 'good', ar: 'صوت سَفِي النجدي' },
  { name: 'Qwen2.5-Audio', version: 'v0.9.7', replicas: 2, gpu: 'A100', vram: '38/40GB', rpm: '218/min', status: 'warn', ar: 'فهم متعدد الوسائط' },
  { name: 'YOLOv8-pedestrian', version: 'v8.2.3', replicas: 6, gpu: 'L40', vram: '12/48GB', rpm: '1.6k/min', status: 'good', ar: 'كشف المشاة' },
  { name: 'ASL-pose', version: 'v1.4.0', replicas: 2, gpu: 'L40', vram: '18/48GB', rpm: '184/min', status: 'good', ar: 'استشعار حركة الجسم' },
  { name: 'Brand-vision-classifier', version: 'v2.0.0', replicas: 3, gpu: 'L40', vram: '14/48GB', rpm: '612/min', status: 'good', ar: 'تصنيف بصري للعلامة' },
]

// ---------------- GPUs ----------------

interface GpuTile {
  id: string
  util: number
  vram: number
  vramTotal: number
  temp: number
  power: number
  job: string
}

const GPUS: GpuTile[] = [
  { id: 'A100 #1', util: 84, vram: 34, vramTotal: 40, temp: 71, power: 312, job: 'Whisper-AR · batch-22' },
  { id: 'A100 #2', util: 67, vram: 22, vramTotal: 40, temp: 64, power: 248, job: 'XTTS-Najdi · stream-7' },
  { id: 'A100 #3', util: 92, vram: 38, vramTotal: 40, temp: 78, power: 348, job: 'Qwen2.5-Audio · ctx-8k' },
  { id: 'A100 #4', util: 41, vram: 18, vramTotal: 40, temp: 58, power: 184, job: 'idle · warm-pool' },
]

// ---------------- Cloud pillars ----------------

interface Pillar {
  ar: string
  en: string
  icon: typeof Cloud
  items: string[]
}

const PILLARS: Pillar[] = [
  {
    ar: 'AWS · الرياض',
    en: 'AWS Riyadh region',
    icon: Cloud,
    items: ['EKS · prod-riy-1', 'S3 · savvy-prod-riy', 'RDS · postgres-15', 'CloudFront · me-south-1'],
  },
  {
    ar: 'نقاط الحافة',
    en: 'Edge POPs',
    icon: Network,
    items: ['JED-01 · Jeddah', 'DXB-02 · Dubai', 'CAI-01 · Cairo', 'IST-03 · Istanbul'],
  },
  {
    ar: 'شبكة Tailscale',
    en: 'Tailscale mesh',
    icon: GitBranch,
    items: ['savvy-mac · M4', 'asus-rig · 4090', 'g1-edu-001', 'crepto-prod-vm'],
  },
  {
    ar: 'Tailnet ACL',
    en: 'Tailnet ACL',
    icon: ShieldCheck,
    items: ['admin · sm@savvy', 'fleet · robots/*', 'dev · engineering/*', 'audit · readonly'],
  },
]

// ---------------- Deployment kanban ----------------

type DeployStage = 'build' | 'deploy' | 'verify' | 'production'

interface DeployCard {
  hash: string
  service: string
  author: string
  time: string
  stage: DeployStage
  health: Health
}

const DEPLOY_CARDS: DeployCard[] = [
  { hash: 'a4f12c9', service: 'savvy-speak-api', author: 'sm', time: '00:14:08', stage: 'build', health: 'good' },
  { hash: 'b7e9d31', service: 'g1-bridge', author: 'asus', time: '00:08:42', stage: 'build', health: 'good' },
  { hash: 'c3a87f2', service: 'arb-bot-paper', author: 'sm', time: '00:21:55', stage: 'deploy', health: 'good' },
  { hash: 'd91e4b6', service: 'media-ingest', author: 'huksha', time: '00:32:11', stage: 'deploy', health: 'warn' },
  { hash: 'e0f2a48', service: 'whisper-ar', author: 'sm', time: '00:47:30', stage: 'verify', health: 'good' },
  { hash: 'f12cd09', service: 'xtts-najdi', author: 'sm', time: '01:04:18', stage: 'verify', health: 'good' },
  { hash: '9a7e3c1', service: 'fleet-control', author: 'asus', time: '02:18:44', stage: 'production', health: 'good' },
  { hash: '8b1d4e7', service: 'twin-renderer', author: 'sm', time: '04:02:09', stage: 'production', health: 'good' },
  { hash: '7c2f5a6', service: 'kafka-router', author: 'ops', time: '06:41:23', stage: 'production', health: 'good' },
  { hash: '6d3e6b8', service: 'tailnet-gateway', author: 'sm', time: '08:55:01', stage: 'production', health: 'good' },
]

const DEPLOY_COLS: { key: DeployStage; ar: string; en: string; icon: typeof GitCommit }[] = [
  { key: 'build', ar: 'بناء', en: 'Build', icon: GitCommit },
  { key: 'deploy', ar: 'نشر', en: 'Deploy', icon: Rocket },
  { key: 'verify', ar: 'تحقق', en: 'Verify', icon: ShieldCheck },
  { key: 'production', ar: 'إنتاج', en: 'Production', icon: CheckCircle2 },
]

// ---------------- OTA ----------------

interface OtaRow {
  id: string
  name: string
  current: string
  target: string
  progress: 0 | 25 | 50 | 75 | 100
  state: 'queued' | 'updating' | 'verifying' | 'done' | 'paused'
}

const OTA_ROWS: OtaRow[] = [
  { id: 'G1-001', name: 'سَفِي · مقر الرياض', current: 'v3.4.2', target: 'v3.4.2', progress: 100, state: 'done' },
  { id: 'G1-002', name: 'حُكشة · LEAP demo', current: 'v3.4.2', target: 'v3.4.2', progress: 100, state: 'done' },
  { id: 'G1-003', name: 'لوبي · Savvy HQ', current: 'v3.4.2', target: 'v3.4.2', progress: 100, state: 'done' },
  { id: 'G1-004', name: 'مختبر · ASUS rig', current: 'v3.4.2', target: 'v3.4.2', progress: 100, state: 'done' },
  { id: 'G1-005', name: 'شركاء · Aramco', current: 'v3.4.2', target: 'v3.4.2', progress: 100, state: 'done' },
  { id: 'G1-006', name: 'فعاليات · LEAP', current: 'v3.4.1', target: 'v3.4.2', progress: 75, state: 'updating' },
  { id: 'G1-007', name: 'فعاليات · Misk', current: 'v3.4.1', target: 'v3.4.2', progress: 50, state: 'updating' },
  { id: 'G1-008', name: 'تطوير · Lab-2', current: 'v3.4.2', target: 'v3.4.2', progress: 100, state: 'done' },
  { id: 'G1-009', name: 'احتياط · Spare-1', current: 'v3.4.0', target: 'v3.4.2', progress: 25, state: 'paused' },
  { id: 'G1-010', name: 'احتياط · Spare-2', current: 'v3.4.0', target: 'v3.4.2', progress: 0, state: 'queued' },
]

// ---------------- Ops timeline ----------------

interface OpsEvent {
  ts: string
  ar: string
  en: string
  kind: 'deploy' | 'incident' | 'pager' | 'scale'
  health: Health
  meta: string
}

const OPS_EVENTS: OpsEvent[] = [
  { ts: '11:24:08', kind: 'deploy', health: 'good', ar: 'نشر savvy-speak-api · v2.18.4', en: 'Deploy savvy-speak-api', meta: 'a4f12c9 · sm · 6 pods' },
  { ts: '11:08:42', kind: 'scale', health: 'good', ar: 'توسعة آلية · whisper-ar +2 بود', en: 'Auto-scale whisper-ar +2 pods', meta: 'p95 = 184ms · trigger CPU' },
  { ts: '10:51:30', kind: 'pager', health: 'warn', ar: 'تنبيه · MQ-3 latency drift', en: 'Pager · MQ-3 latency drift', meta: 'on-call: sm · ack 32s' },
  { ts: '10:32:11', kind: 'deploy', health: 'warn', ar: 'نشر media-ingest فشل التحقق', en: 'Deploy media-ingest verify failed', meta: 'd91e4b6 · rollback queued' },
  { ts: '09:47:55', kind: 'deploy', health: 'good', ar: 'نشر twin-renderer · v0.9.0', en: 'Deploy twin-renderer', meta: '8b1d4e7 · sm · canary 10%' },
  { ts: '09:14:02', kind: 'incident', health: 'bad', ar: 'حادثة INC-2614 أُغلقت', en: 'Incident INC-2614 resolved', meta: 'duration 12m · impact 3 pods' },
  { ts: '08:42:18', kind: 'scale', health: 'good', ar: 'تقليص arb-bot-paper -1 بود', en: 'Scale-in arb-bot-paper -1', meta: 'GPU pool freed · 4GB VRAM' },
  { ts: '08:10:09', kind: 'deploy', health: 'good', ar: 'نشر kafka-router · v1.7.2', en: 'Deploy kafka-router', meta: '7c2f5a6 · ops · 0 errs' },
]

// ---------------- Page ----------------

export function EngineeringOpsPage() {
  const topo = useMemo(buildTopo, [])
  const nodeById = useMemo(() => Object.fromEntries(topo.nodes.map((n) => [n.id, n])), [topo])

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <PageShell
      active="engineering"
      ar="الهندسة والبنية"
      en="Engineering & Infrastructure Operations"
      icon={ServerCog}
      description="غرفة تحكم Savvy World للبنية التحتية — مراقبة الخدمات والـ GPU والنشر المستمر وتحديثات الأسطول عبر AWS الرياض ومنصة Tailscale."
    >
      {/* KPI strip */}
      <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => {
          const TIcon = k.trend === 'down' ? ArrowDownRight : ArrowUpRight
          const Icon = k.icon
          const isGoodDelta = k.trend === 'up' || (k.en === 'p99 latency' && k.trend === 'down')
          const trendCls = isGoodDelta
            ? 'text-[--color-good] bg-[--color-good]/10 border-[--color-good]/20'
            : k.trend === 'down'
              ? 'text-[--color-warn] bg-[--color-warn]/10 border-[--color-warn]/20'
              : 'text-[--color-muted] bg-white/[0.04] border-[--color-line]'
          return (
            <div key={k.en} className="glass-card glass-card-hover relative overflow-hidden p-4">
              <div className="pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full bg-[--color-admiral-glow]/10 blur-2xl" />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className="text-[--color-admiral-glow]" />
                    <div className="truncate text-[12px] font-bold text-[--color-ink-2]">{k.ar}</div>
                  </div>
                  <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    {k.en}
                  </div>
                </div>
                <span className={cn('inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-en text-[10px] font-bold', trendCls)}>
                  <TIcon size={10} />
                  {k.delta}
                </span>
              </div>
              <div className="mt-3 font-en text-[24px] font-extrabold leading-none tracking-tight tabular-nums text-[--color-ink]">
                {k.value}
              </div>
              <div className="mt-2 -mx-1">
                <Sparkline data={k.spark} trend={k.trend} height={30} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Topology */}
        <section className="glass-card relative col-span-12 overflow-hidden p-5 lg:col-span-7">
          <PanelHeader ar="طوبولوجيا البنية التحتية" en="Infrastructure topology" icon={Network} />
          <div className="absolute end-5 top-5 hidden flex-col items-end gap-1.5 md:flex">
            <LegendDot color="var(--color-good)" ar="سليم" en="Healthy" />
            <LegendDot color="var(--color-warn)" ar="تنبيه" en="Degraded" />
            <LegendDot color="var(--color-admiral-glow)" ar="حركة المرور" en="Traffic flow" />
          </div>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 840 480" width="100%" className="min-w-[720px]" style={{ height: 460 }}>
              <defs>
                <linearGradient id="topo-edge-good" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(78,163,255,0.05)" />
                  <stop offset="100%" stopColor="rgba(78,163,255,0.45)" />
                </linearGradient>
                <linearGradient id="topo-edge-warn" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(245,165,36,0.05)" />
                  <stop offset="100%" stopColor="rgba(245,165,36,0.55)" />
                </linearGradient>
                <radialGradient id="topo-node-good" cx="0.5" cy="0.5" r="0.6">
                  <stop offset="0%" stopColor="rgba(78,163,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(0,87,183,0.4)" />
                </radialGradient>
                <radialGradient id="topo-node-warn" cx="0.5" cy="0.5" r="0.6">
                  <stop offset="0%" stopColor="rgba(245,165,36,0.95)" />
                  <stop offset="100%" stopColor="rgba(245,165,36,0.35)" />
                </radialGradient>
              </defs>

              {/* layer labels */}
              {TOPO_LAYERS.map((L, i) => (
                <g key={L.layer}>
                  <text
                    x={12}
                    y={TOPO_LAYER_Y[i] - 22}
                    style={{ font: '700 9px ui-sans-serif, system-ui', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                    className="fill-[--color-faint]"
                  >
                    {L.en}
                  </text>
                  <text
                    x={12}
                    y={TOPO_LAYER_Y[i] - 8}
                    style={{ font: '700 11px ui-sans-serif, system-ui' }}
                    className="fill-[--color-ink-2]"
                  >
                    {L.ar}
                  </text>
                  <line
                    x1={12}
                    x2={828}
                    y1={TOPO_LAYER_Y[i] + 26}
                    y2={TOPO_LAYER_Y[i] + 26}
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="2 6"
                  />
                </g>
              ))}

              {/* edges */}
              {topo.edges.map((e, i) => {
                const a = nodeById[e.from]
                const b = nodeById[e.to]
                if (!a || !b) return null
                const grad = e.health === 'warn' ? 'url(#topo-edge-warn)' : 'url(#topo-edge-good)'
                const dotColor = e.health === 'warn' ? '#f5a524' : '#4ea3ff'
                const pathId = `topo-path-${i}`
                const dx = b.x - a.x
                const cy = (a.y + b.y) / 2
                const d = `M${a.x},${a.y} C${a.x + dx * 0.2},${cy} ${b.x - dx * 0.2},${cy} ${b.x},${b.y}`
                const dur = `${(2.4 + (i % 5) * 0.3).toFixed(2)}s`
                const begin = `${(i * 0.18).toFixed(2)}s`
                return (
                  <g key={i}>
                    <path id={pathId} d={d} fill="none" stroke={grad} strokeWidth="1.1" />
                    <text
                      x={(a.x + b.x) / 2}
                      y={cy - 4}
                      textAnchor="middle"
                      style={{ font: '700 8px ui-sans-serif, system-ui' }}
                      className="fill-[--color-faint]"
                    >
                      {e.rate}
                    </text>
                    <circle r="1.6" fill={dotColor} style={{ filter: `drop-shadow(0 0 3px ${dotColor})` }}>
                      <animateMotion dur={dur} begin={begin} repeatCount="indefinite">
                        <mpath href={`#${pathId}`} />
                      </animateMotion>
                    </circle>
                  </g>
                )
              })}

              {/* nodes */}
              {topo.nodes.map((n) => {
                const fill = n.health === 'warn' ? 'url(#topo-node-warn)' : 'url(#topo-node-good)'
                const stroke = n.health === 'warn' ? 'rgba(245,165,36,0.9)' : 'rgba(78,163,255,0.85)'
                const shadow = n.health === 'warn' ? 'rgba(245,165,36,0.55)' : 'rgba(78,163,255,0.55)'
                const r = n.layer === 0 ? 7 : n.layer === 3 ? 12 : 10
                return (
                  <g key={n.id}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={r}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="1"
                      style={{ filter: `drop-shadow(0 0 6px ${shadow})` }}
                    />
                    <text
                      x={n.x}
                      y={n.y + r + 11}
                      textAnchor="middle"
                      style={{ font: '700 9px ui-sans-serif, system-ui' }}
                      className="fill-[--color-ink-2]"
                    >
                      {n.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[--color-line] pt-3">
            <span className="font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
              Live · me-south-1
            </span>
            <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
              {topo.nodes.length} nodes · {topo.edges.length} edges
            </span>
            <span className="inline-flex items-center gap-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-good]">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" style={{ boxShadow: HEALTH_GLOW.good }} />
              Streaming · {fmtTime(now)}
            </span>
          </div>
        </section>

        {/* Pipeline */}
        <section className="glass-card col-span-12 p-5 lg:col-span-5">
          <PanelHeader ar="خط الاستيعاب التليمتري" en="Telemetry ingestion pipeline" icon={Activity} />
          <ul className="flex flex-col gap-2">
            {PIPELINE.map((s, i) => {
              const Icon = s.icon
              return (
                <li
                  key={s.en}
                  className="relative rounded-xl border border-[--color-line] bg-black/30 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                        <Icon size={13} />
                      </span>
                      <div>
                        <div className="text-[12.5px] font-bold text-[--color-ink]">
                          <span className="me-1.5 font-en text-[10px] font-bold tabular-nums text-[--color-faint]">
                            {pad2(i + 1)}
                          </span>
                          {s.ar}
                        </div>
                        <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                          {s.en}
                        </div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em]',
                        s.health === 'good'
                          ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
                          : s.health === 'warn'
                            ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
                            : 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]'
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor', boxShadow: HEALTH_GLOW[s.health] }} />
                      {s.health === 'good' ? 'OK' : s.health === 'warn' ? 'DEGRADED' : 'DOWN'}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <MiniStat ar="عمليات/ث" en="Ops/s" value={s.ops} />
                    <MiniStat ar="p95" en="p95 latency" value={s.p95} />
                    <MiniStat ar="أخطاء" en="Error rate" value={s.err} />
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={cn('h-full rounded-full', HEALTH_BG[s.health])}
                      style={{ width: `${(s.fill * 100).toFixed(0)}%`, boxShadow: HEALTH_GLOW[s.health] }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-[--color-line] pt-3">
            <span className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
              Last tick
            </span>
            <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink]">{fmtTime(now)}</span>
          </div>
        </section>

        {/* AI model orchestration */}
        <section className="glass-card col-span-12 p-5 lg:col-span-6">
          <PanelHeader ar="تنسيق نماذج الذكاء" en="AI model orchestration" icon={Cpu} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate" style={{ borderSpacing: 0 }}>
              <thead>
                <tr className="text-start">
                  <Th ar="النموذج" en="Model" />
                  <Th ar="الإصدار" en="Version" />
                  <Th ar="نسخ" en="Replicas" />
                  <Th ar="GPU" en="GPU" />
                  <Th ar="VRAM" en="VRAM" />
                  <Th ar="طلبات" en="Req/min" />
                  <Th ar="الحالة" en="Status" />
                </tr>
              </thead>
              <tbody>
                {MODELS.map((m, i) => (
                  <tr
                    key={m.name}
                    className={cn(
                      'transition-colors hover:bg-white/[0.03]',
                      i !== MODELS.length - 1 && '[&_td]:border-b [&_td]:border-[--color-line]'
                    )}
                  >
                    <td className="px-2 py-2.5">
                      <div className="font-en text-[12px] font-bold tracking-tight text-[--color-ink]">{m.name}</div>
                      <div className="text-[10.5px] font-semibold text-[--color-ink-2]">{m.ar}</div>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="font-en text-[11px] font-bold tabular-nums tracking-tight text-[--color-admiral-glow]">
                        {m.version}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 font-en text-[12px] font-bold tabular-nums text-[--color-ink]">
                      {m.replicas}
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-white/[0.03] px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2]">
                        <Cpu size={9} />
                        {m.gpu}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">
                      {m.vram}
                    </td>
                    <td className="px-2 py-2.5 font-en text-[11px] font-bold tabular-nums text-[--color-ink]">
                      {m.rpm}
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em]',
                          m.status === 'good'
                            ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
                            : m.status === 'warn'
                              ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
                              : 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]'
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor', boxShadow: HEALTH_GLOW[m.status] }} />
                        {m.status === 'good' ? 'Serving' : m.status === 'warn' ? 'Saturated' : 'Down'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* GPU workload monitor */}
        <section className="glass-card col-span-12 p-5 lg:col-span-6">
          <PanelHeader ar="مراقبة أحمال GPU" en="GPU workload monitor" icon={Gauge} />
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {GPUS.map((g) => {
              const utilHealth: Health = g.util > 90 ? 'warn' : 'good'
              const tempHealth: Health = g.temp > 75 ? 'warn' : 'good'
              return (
                <div key={g.id} className="rounded-xl border border-[--color-line] bg-black/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                        <Cpu size={13} />
                      </span>
                      <div className="font-en text-[12.5px] font-extrabold tracking-tight text-[--color-ink]">{g.id}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-good]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" style={{ boxShadow: HEALTH_GLOW.good }} />
                      Online
                    </span>
                  </div>
                  <div className="mt-2 truncate font-en text-[10.5px] font-semibold text-[--color-ink-2]">
                    <span className="text-[--color-faint]">job · </span>
                    {g.job}
                  </div>

                  <div className="mt-3 space-y-2">
                    <BarRow ar="استخدام" en="Utilization" value={g.util} max={100} suffix="%" health={utilHealth} />
                    <BarRow ar="ذاكرة" en="VRAM" value={g.vram} max={g.vramTotal} suffix={`/${g.vramTotal}GB`} health="good" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[--color-line] bg-white/[0.03] px-2 py-1.5">
                      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">Temp</div>
                      <div className={cn('font-en text-[14px] font-extrabold tabular-nums', HEALTH_TEXT[tempHealth])}>
                        {g.temp}°C
                      </div>
                    </div>
                    <div className="rounded-lg border border-[--color-line] bg-white/[0.03] px-2 py-1.5">
                      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">Power</div>
                      <div className="font-en text-[14px] font-extrabold tabular-nums text-[--color-ink]">{g.power}W</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Cloud architecture pillars */}
        <section className="glass-card col-span-12 p-5">
          <PanelHeader ar="ركائز البنية السحابية" en="Cloud architecture pillars" icon={Cloud} />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.en} className="relative overflow-hidden rounded-xl border border-[--color-line] bg-black/30 p-4">
                  <div className="pointer-events-none absolute -end-10 -top-10 h-28 w-28 rounded-full bg-[--color-admiral-glow]/10 blur-2xl" />
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                      <Icon size={15} />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-extrabold text-[--color-ink]">{p.ar}</div>
                      <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                        {p.en}
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 flex flex-col gap-1.5 border-t border-[--color-line] pt-3">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-center gap-2 font-en text-[11.5px] font-semibold tracking-tight text-[--color-ink-2]">
                        <CheckCircle2 size={12} className="shrink-0 text-[--color-good]" />
                        <span className="truncate">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* Deployment kanban */}
        <section className="glass-card col-span-12 p-5 lg:col-span-7">
          <PanelHeader ar="بنية النشر المستمر" en="Deployment infrastructure" icon={Rocket} />
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {DEPLOY_COLS.map((col) => {
              const cards = DEPLOY_CARDS.filter((c) => c.stage === col.key)
              const Icon = col.icon
              const isProd = col.key === 'production'
              return (
                <div key={col.key} className="rounded-xl border border-[--color-line] bg-black/30 p-2.5">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon size={12} className={isProd ? 'text-[--color-good]' : 'text-[--color-admiral-glow]'} />
                      <span className="text-[12px] font-extrabold text-[--color-ink]">{col.ar}</span>
                      <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                        {col.en}
                      </span>
                    </div>
                    <span className="font-en text-[10px] font-bold tabular-nums text-[--color-ink-2]">{cards.length}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {cards.map((c) => (
                      <li
                        key={c.hash}
                        className="rounded-lg border border-[--color-line] bg-gradient-to-br from-white/[0.03] to-transparent p-2 transition-colors hover:border-[rgba(78,163,255,0.32)]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-en text-[10.5px] font-bold tabular-nums tracking-tight text-[--color-admiral-glow]">
                            {c.hash}
                          </span>
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: c.health === 'warn' ? '#f5a524' : c.health === 'bad' ? '#f43f5e' : '#22c55e', boxShadow: HEALTH_GLOW[c.health] }}
                          />
                        </div>
                        <div className="mt-1 truncate font-en text-[11px] font-bold text-[--color-ink]">{c.service}</div>
                        <div className="mt-0.5 flex items-center justify-between font-en text-[9.5px] font-semibold tabular-nums text-[--color-faint]">
                          <span>@{c.author}</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Clock size={9} />
                            {c.time}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* OTA */}
        <section className="glass-card col-span-12 p-5 lg:col-span-5">
          <PanelHeader ar="تحديثات OTA للأسطول" en="OTA deployment status" icon={GitBranch} />
          <div className="mb-3 flex items-center justify-between rounded-xl border border-[--color-line] bg-black/30 p-2.5">
            <div>
              <div className="text-[12.5px] font-extrabold text-[--color-ink]">٨ من ١٠ على v3.4.2</div>
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                8/10 robots on v3.4.2 · target rollout 100%
              </div>
            </div>
            <div className="font-en text-[14px] font-extrabold tabular-nums text-[--color-admiral-glow]">80%</div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {OTA_ROWS.map((r) => {
              const isDone = r.state === 'done'
              const isPaused = r.state === 'paused'
              const barHealth: Health = isPaused ? 'warn' : 'good'
              return (
                <li
                  key={r.id}
                  className="rounded-lg border border-[--color-line] bg-black/30 p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-en text-[11px] font-bold tabular-nums tracking-tight text-[--color-admiral-glow]">
                          {r.id}
                        </span>
                        <span className="truncate text-[11.5px] font-bold text-[--color-ink]">{r.name}</span>
                      </div>
                      <div className="mt-0.5 font-en text-[10px] font-semibold tabular-nums text-[--color-ink-2]">
                        {r.current} <span className="text-[--color-faint]">→</span> {r.target}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-[--color-good]/30 bg-[--color-good]/10 px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
                          <CheckCircle2 size={10} />
                          Done
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="grid h-6 w-6 place-items-center rounded-md border border-[--color-line] bg-white/[0.03] text-[--color-ink-2] transition-colors hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]"
                            title="Pause"
                          >
                            <Pause size={10} />
                          </button>
                          <button
                            type="button"
                            className="grid h-6 w-6 place-items-center rounded-md border border-[--color-line] bg-white/[0.03] text-[--color-ink-2] transition-colors hover:border-[rgba(244,63,94,0.4)] hover:text-[--color-bad]"
                            title="Cancel"
                          >
                            <X size={10} />
                          </button>
                          <button
                            type="button"
                            className="grid h-6 w-6 place-items-center rounded-md border border-[--color-line] bg-white/[0.03] text-[--color-ink-2] transition-colors hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]"
                            title="Retry"
                          >
                            <RefreshCw size={10} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={cn('h-full rounded-full', isDone ? 'bg-[--color-good]' : HEALTH_BG[barHealth])}
                        style={{
                          width: `${r.progress}%`,
                          boxShadow: isDone ? HEALTH_GLOW.good : HEALTH_GLOW[barHealth],
                        }}
                      />
                    </div>
                    <span className="font-en text-[10px] font-bold tabular-nums text-[--color-ink-2]">{r.progress}%</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Ops timeline */}
        <section className="glass-card col-span-12 p-5">
          <PanelHeader ar="سجل العمليات الأخير" en="Recent ops timeline" icon={Clock} />
          <ul className="relative ms-2 flex flex-col gap-3 border-s border-[--color-line] ps-4">
            {OPS_EVENTS.map((e, i) => {
              const Icon = e.kind === 'deploy' ? Rocket : e.kind === 'incident' ? AlertTriangle : e.kind === 'pager' ? Zap : Boxes
              const dotColor = e.health === 'warn' ? '#f5a524' : e.health === 'bad' ? '#f43f5e' : '#22c55e'
              return (
                <li key={i} className="relative">
                  <span
                    className="absolute -start-[19px] top-1.5 h-3 w-3 rounded-full border border-black"
                    style={{ background: dotColor, boxShadow: HEALTH_GLOW[e.health] }}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-[--color-line] bg-black/30 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-en text-[10.5px] font-bold tabular-nums tracking-tight text-[--color-admiral-glow]">
                          {e.ts}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.18em]',
                            e.kind === 'deploy'
                              ? 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 text-[--color-admiral-glow]'
                              : e.kind === 'incident'
                                ? 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]'
                                : e.kind === 'pager'
                                  ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
                                  : 'border-[--color-line] bg-white/[0.04] text-[--color-ink-2]'
                          )}
                        >
                          <Icon size={9} />
                          {e.kind}
                        </span>
                      </div>
                      <div className="mt-1 text-[12.5px] font-bold text-[--color-ink]">{e.ar}</div>
                      <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                        {e.en}
                      </div>
                    </div>
                    <div className="font-en text-[10.5px] font-semibold tabular-nums text-[--color-ink-2]">
                      {e.meta}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </PageShell>
  )
}

// ---------------- Sub-components ----------------

function MiniStat({ ar, en, value }: { ar: string; en: string; value: string }) {
  return (
    <div className="rounded-md border border-[--color-line] bg-white/[0.03] px-2 py-1">
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">{en}</div>
      <div className="text-[10px] font-semibold text-[--color-ink-2]">{ar}</div>
      <div className="mt-0.5 font-en text-[12px] font-extrabold tabular-nums tracking-tight text-[--color-ink]">
        {value}
      </div>
    </div>
  )
}

function Th({ ar, en }: { ar: string; en: string }) {
  return (
    <th className="border-b border-[--color-line] px-2 pb-2 text-start">
      <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.2em] text-[--color-faint]">{en}</div>
      <div className="text-[10.5px] font-semibold text-[--color-ink-2]">{ar}</div>
    </th>
  )
}

function BarRow({
  ar,
  en,
  value,
  max,
  suffix,
  health,
}: {
  ar: string
  en: string
  value: number
  max: number
  suffix: string
  health: Health
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
            {en}
          </span>
          <span className="text-[10px] font-semibold text-[--color-ink-2]">{ar}</span>
        </div>
        <span className={cn('font-en text-[11px] font-bold tabular-nums', HEALTH_TEXT[health])}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={cn('h-full rounded-full', HEALTH_BG[health])}
          style={{ width: `${pct.toFixed(1)}%`, boxShadow: HEALTH_GLOW[health] }}
        />
      </div>
    </div>
  )
}

function LegendDot({ color, ar, en }: { color: string; ar: string; en: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[--color-line] bg-black/40 px-1.5 py-0.5 backdrop-blur-md">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <span className="text-[10px] font-bold text-[--color-ink-2]">{ar}</span>
      <span className="font-en text-[9px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
        {en}
      </span>
    </span>
  )
}
