import { useMemo, useState, type ComponentType } from 'react'
import {
  ShieldAlert,
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  AlertTriangle,
  AlertCircle,
  Activity,
  Network,
  Cpu,
  FileCheck2,
  Crosshair,
  BadgeCheck,
  UserCheck,
  Gauge,
} from 'lucide-react'
import { PageShell } from '@/pages-detail/_PageShell'
import { Sparkline } from '@/home/parts/Sparkline'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* types                                                               */
/* ------------------------------------------------------------------ */

type Severity = 'critical' | 'high' | 'medium' | 'low'
type IncidentStatus = 'open' | 'investigating' | 'mitigated' | 'closed'
type ComplianceStatus = 'compliant' | 'partial' | 'gap'
type AuthScope = 'full' | 'restricted' | 'read-only'
type OtaChannel = 'stable' | 'canary'
type EventAction = 'blocked' | 'allowed' | 'quarantined'
type ExposureLevel = 'high' | 'medium' | 'low' | 'internal'

/* ------------------------------------------------------------------ */
/* demo data                                                           */
/* ------------------------------------------------------------------ */

const DAYS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'] as const
const DAYS_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

// Deterministic 7d × 24h heatmap intensities (0..10)
const HEATMAP: number[][] = [
  [1, 0, 0, 1, 0, 0, 1, 2, 3, 2, 1, 2, 1, 2, 1, 0, 1, 2, 3, 2, 1, 2, 1, 0],
  [0, 1, 0, 1, 0, 1, 2, 3, 4, 3, 2, 1, 2, 3, 2, 1, 0, 1, 2, 3, 4, 3, 1, 0],
  [1, 1, 0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 3, 4, 3, 2, 1, 0],
  [2, 1, 1, 1, 0, 1, 2, 4, 6, 7, 5, 3, 4, 5, 6, 7, 5, 3, 4, 6, 4, 2, 1, 1],
  [1, 0, 0, 1, 1, 2, 3, 5, 7, 8, 6, 4, 5, 6, 7, 8, 7, 4, 3, 5, 4, 2, 1, 0],
  [0, 1, 0, 1, 0, 1, 2, 3, 5, 6, 4, 3, 2, 3, 4, 5, 4, 3, 2, 3, 2, 1, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 2, 3, 5, 6, 8, 9, 10, 9, 7, 5, 4, 3, 2, 2, 1, 1, 0],
]

interface Incident {
  id: string
  severity: Severity
  ar: string
  asset: string
  assignee: string
  age: string
  status: IncidentStatus
}

const INCIDENTS: Incident[] = [
  {
    id: 'INC-2078',
    severity: 'critical',
    ar: 'محاولة دخول مرفوضة من IP خارجي',
    asset: 'control-plane / edge-api',
    assignee: 'سعود الحربي',
    age: 'قبل 4د',
    status: 'investigating',
  },
  {
    id: 'INC-2076',
    severity: 'high',
    ar: 'OTA token expiring في ٢٤س',
    asset: 'fleet / G1-RUH-01',
    assignee: 'منى العتيبي',
    age: 'قبل 38د',
    status: 'open',
  },
  {
    id: 'INC-2074',
    severity: 'medium',
    ar: 'اختراق منطقة آمنة geofence',
    asset: 'fleet / GO2-NEOM-01',
    assignee: 'فهد القحطاني',
    age: 'قبل 1س 12د',
    status: 'mitigated',
  },
  {
    id: 'INC-2071',
    severity: 'low',
    ar: 'تسجيل دخول من جهاز جديد',
    asset: 'iam / operator-console',
    assignee: 'ريم الزهراني',
    age: 'قبل 3س',
    status: 'closed',
  },
]

interface SurfaceNode {
  id: string
  ar: string
  en: string
  group: 'public' | 'agent' | 'control' | 'data' | 'iam'
  exposure: ExposureLevel
  x: number
  y: number
}

const SURFACE_NODES: SurfaceNode[] = [
  // public endpoints (3)
  { id: 'pub-edge', ar: 'حافة API', en: 'edge-api', group: 'public', exposure: 'high', x: 90, y: 60 },
  { id: 'pub-portal', ar: 'بوابة المشغّل', en: 'op-portal', group: 'public', exposure: 'medium', x: 90, y: 160 },
  { id: 'pub-cdn', ar: 'CDN ثابت', en: 'static-cdn', group: 'public', exposure: 'low', x: 90, y: 260 },
  // IAM (1)
  { id: 'iam', ar: 'مدير الهويات', en: 'iam-core', group: 'iam', exposure: 'medium', x: 280, y: 60 },
  // control plane (1)
  { id: 'ctrl', ar: 'لوحة التحكم', en: 'control-plane', group: 'control', exposure: 'internal', x: 280, y: 160 },
  // data plane (1)
  { id: 'data', ar: 'منصّة البيانات', en: 'data-plane', group: 'data', exposure: 'internal', x: 280, y: 260 },
  // robot agents (10)
  { id: 'r-1', ar: 'G1-RUH-01', en: 'G1-RUH-01', group: 'agent', exposure: 'medium', x: 500, y: 30 },
  { id: 'r-2', ar: 'G1-JED-01', en: 'G1-JED-01', group: 'agent', exposure: 'medium', x: 540, y: 70 },
  { id: 'r-3', ar: 'GO2-DMM-01', en: 'GO2-DMM-01', group: 'agent', exposure: 'low', x: 560, y: 120 },
  { id: 'r-4', ar: 'GO2-NEOM-01', en: 'GO2-NEOM-01', group: 'agent', exposure: 'high', x: 565, y: 170 },
  { id: 'r-5', ar: 'GO2-MED-01', en: 'GO2-MED-01', group: 'agent', exposure: 'medium', x: 555, y: 220 },
  { id: 'r-6', ar: 'G1-AHS-01', en: 'G1-AHS-01', group: 'agent', exposure: 'low', x: 525, y: 260 },
  { id: 'r-7', ar: 'G1-ABH-01', en: 'G1-ABH-01', group: 'agent', exposure: 'low', x: 485, y: 290 },
  { id: 'r-8', ar: 'G1-TBK-01', en: 'G1-TBK-01', group: 'agent', exposure: 'medium', x: 440, y: 300 },
  { id: 'r-9', ar: 'G1-QSM-01', en: 'G1-QSM-01', group: 'agent', exposure: 'low', x: 495, y: 50 },
  { id: 'r-10', ar: 'G1-JIZ-01', en: 'G1-JIZ-01', group: 'agent', exposure: 'low', x: 595, y: 145 },
]

const SURFACE_EDGES: Array<[string, string]> = [
  ['pub-edge', 'iam'],
  ['pub-portal', 'iam'],
  ['pub-cdn', 'ctrl'],
  ['iam', 'ctrl'],
  ['ctrl', 'data'],
  ['ctrl', 'r-1'],
  ['ctrl', 'r-2'],
  ['ctrl', 'r-3'],
  ['ctrl', 'r-4'],
  ['ctrl', 'r-5'],
  ['ctrl', 'r-6'],
  ['ctrl', 'r-7'],
  ['ctrl', 'r-8'],
  ['ctrl', 'r-9'],
  ['ctrl', 'r-10'],
  ['data', 'r-4'],
  ['data', 'r-1'],
]

interface Pillar {
  id: string
  ar: string
  en: string
  metric: string
  score: number
  audit: string
  icon: ComponentType<{ size?: number; className?: string }>
}

const PILLARS: Pillar[] = [
  { id: 'identity', ar: 'الهويّة', en: 'Identity', metric: '100% مُحقَّقة', score: 100, audit: '2026-05-08 14:22', icon: UserCheck },
  { id: 'device', ar: 'الجهاز', en: 'Device', metric: '10/10 موثّقة (TPM)', score: 100, audit: '2026-05-09 03:10', icon: Cpu },
  { id: 'network', ar: 'الشبكة', en: 'Network', metric: 'شبكة مُشفّرة (mTLS)', score: 96, audit: '2026-05-08 21:05', icon: Network },
  { id: 'application', ar: 'التطبيق', en: 'Application', metric: 'إصدارات موقّعة', score: 92, audit: '2026-05-07 11:48', icon: BadgeCheck },
  { id: 'data', ar: 'البيانات', en: 'Data', metric: 'مُشفّرة في النقل والسكون', score: 98, audit: '2026-05-09 06:30', icon: Lock },
]

interface ComplianceRow {
  ar: string
  en: string
  status: ComplianceStatus
  score: number
  last: string
  next: string
  owner: string
}

const COMPLIANCE: ComplianceRow[] = [
  { ar: 'الهيئة الوطنية للأمن السيبراني', en: 'NCA', status: 'compliant', score: 98, last: '2026-04-22', next: '2026-07-22', owner: 'سعود الحربي' },
  { ar: 'مؤسسة النقد العربي السعودي', en: 'SAMA', status: 'compliant', score: 95, last: '2026-04-30', next: '2026-07-30', owner: 'منى العتيبي' },
  { ar: 'المكتب الوطني لإدارة البيانات', en: 'NDMO', status: 'compliant', score: 96, last: '2026-05-01', next: '2026-08-01', owner: 'ريم الزهراني' },
  { ar: 'آيزو 27001', en: 'ISO 27001', status: 'partial', score: 88, last: '2026-03-18', next: '2026-06-18', owner: 'فهد القحطاني' },
  { ar: 'مكافئ GDPR للمملكة', en: 'GDPR-equivalent KSA', status: 'compliant', score: 94, last: '2026-04-12', next: '2026-07-12', owner: 'ريم الزهراني' },
  { ar: 'نظام حماية البيانات الشخصية', en: 'PDPL', status: 'gap', score: 78, last: '2026-02-09', next: '2026-05-30', owner: 'سعود الحربي' },
]

interface RobotAuth {
  id: string
  scope: AuthScope
  killSwitch: 'armed' | 'disarmed'
  ota: OtaChannel
  tpm: boolean
  lastCert: string
}

const ROBOT_AUTH: RobotAuth[] = [
  { id: 'G1-RUH-01', scope: 'full', killSwitch: 'armed', ota: 'stable', tpm: true, lastCert: '2026-05-02' },
  { id: 'G1-JED-01', scope: 'full', killSwitch: 'armed', ota: 'stable', tpm: true, lastCert: '2026-04-28' },
  { id: 'GO2-DMM-01', scope: 'restricted', killSwitch: 'armed', ota: 'canary', tpm: true, lastCert: '2026-05-04' },
  { id: 'GO2-NEOM-01', scope: 'full', killSwitch: 'armed', ota: 'stable', tpm: true, lastCert: '2026-05-06' },
  { id: 'GO2-MED-01', scope: 'restricted', killSwitch: 'armed', ota: 'stable', tpm: true, lastCert: '2026-04-22' },
  { id: 'G1-AHS-01', scope: 'read-only', killSwitch: 'disarmed', ota: 'canary', tpm: false, lastCert: '2026-03-30' },
  { id: 'G1-ABH-01', scope: 'restricted', killSwitch: 'armed', ota: 'stable', tpm: true, lastCert: '2026-04-18' },
  { id: 'G1-TBK-01', scope: 'restricted', killSwitch: 'armed', ota: 'canary', tpm: true, lastCert: '2026-04-11' },
  { id: 'G1-QSM-01', scope: 'full', killSwitch: 'armed', ota: 'stable', tpm: true, lastCert: '2026-05-01' },
  { id: 'G1-JIZ-01', scope: 'restricted', killSwitch: 'armed', ota: 'stable', tpm: true, lastCert: '2026-04-25' },
]

interface AuditEntry {
  id: string
  operator: string
  action: string
  ar: string
  target: string
  ip: string
  ts: string
  risk: number
}

const AUDIT_LOG: AuditEntry[] = [
  { id: 'a1', operator: 'سعود الحربي', action: 'sign-in', ar: 'تسجيل دخول', target: 'operator-console', ip: '10.42.18.21', ts: '14:38:12', risk: 12 },
  { id: 'a2', operator: 'منى العتيبي', action: 'role-change', ar: 'تعديل صلاحية', target: 'iam / fhd@savvy', ip: '10.42.18.44', ts: '14:21:05', risk: 64 },
  { id: 'a3', operator: 'فهد القحطاني', action: 'api-key', ar: 'استخدام مفتاح API', target: 'fleet-api / read', ip: '10.42.18.91', ts: '13:58:47', risk: 28 },
  { id: 'a4', operator: 'سعود الحربي', action: 'command', ar: 'إصدار أمر', target: 'GO2-NEOM-01 / patrol', ip: '10.42.18.21', ts: '13:42:11', risk: 22 },
  { id: 'a5', operator: 'ريم الزهراني', action: 'ota-push', ar: 'دفع تحديث OTA', target: 'fleet / canary', ip: '10.42.18.66', ts: '13:18:30', risk: 78 },
  { id: 'a6', operator: 'منى العتيبي', action: 'sign-in', ar: 'تسجيل دخول', target: 'operator-console', ip: '10.42.18.44', ts: '12:55:02', risk: 9 },
  { id: 'a7', operator: 'فهد القحطاني', action: 'command', ar: 'إصدار أمر', target: 'G1-RUH-01 / dock', ip: '10.42.18.91', ts: '12:34:51', risk: 18 },
  { id: 'a8', operator: 'سعود الحربي', action: 'role-change', ar: 'إلغاء صلاحية', target: 'iam / contractor-x', ip: '10.42.18.21', ts: '12:11:20', risk: 41 },
]

interface SecEvent {
  id: string
  severity: Severity
  ts: string
  source: string
  destination: string
  ar: string
  action: EventAction
}

const EVENTS: SecEvent[] = [
  { id: 'e1', severity: 'critical', ts: '14:42:11', source: '203.0.113.18', destination: 'edge-api / /v1/auth', ar: 'محاولة تسجيل دخول قسريّة', action: 'blocked' },
  { id: 'e2', severity: 'high', ts: '14:38:02', source: 'GO2-NEOM-01', destination: 'data-plane / s3', ar: 'تجاوز كمية رفع متوقّعة', action: 'quarantined' },
  { id: 'e3', severity: 'medium', ts: '14:32:48', source: '10.42.18.91', destination: 'iam-core / token', ar: 'تجديد رمز جلسة', action: 'allowed' },
  { id: 'e4', severity: 'low', ts: '14:28:19', source: '10.42.18.21', destination: 'control-plane / metrics', ar: 'استعلام مقاييس روتيني', action: 'allowed' },
  { id: 'e5', severity: 'high', ts: '14:18:56', source: '198.51.100.7', destination: 'edge-api / /v1/fleet', ar: 'مسح بحثاً عن ثغرات', action: 'blocked' },
  { id: 'e6', severity: 'medium', ts: '14:09:03', source: 'G1-TBK-01', destination: 'data-plane / telemetry', ar: 'انحراف في توقيع الشهادة', action: 'quarantined' },
  { id: 'e7', severity: 'low', ts: '13:54:41', source: '10.42.18.44', destination: 'operator-portal', ar: 'تسجيل خروج طبيعي', action: 'allowed' },
  { id: 'e8', severity: 'critical', ts: '13:41:09', source: '45.155.205.233', destination: 'edge-api / /v1/auth', ar: 'هجوم تخمين كلمات سرّ', action: 'blocked' },
]

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function severityColor(s: Severity): string {
  if (s === 'critical') return 'var(--color-bad)'
  if (s === 'high') return '#f87171'
  if (s === 'medium') return 'var(--color-warn)'
  return 'var(--color-info)'
}

function severityAr(s: Severity): string {
  if (s === 'critical') return 'حرج'
  if (s === 'high') return 'مرتفع'
  if (s === 'medium') return 'متوسط'
  return 'منخفض'
}

function exposureColor(e: ExposureLevel): string {
  if (e === 'high') return 'var(--color-bad)'
  if (e === 'medium') return 'var(--color-warn)'
  if (e === 'low') return 'var(--color-good)'
  return 'var(--color-admiral-glow)'
}

function statusColor(s: IncidentStatus): string {
  if (s === 'open') return 'var(--color-bad)'
  if (s === 'investigating') return 'var(--color-warn)'
  if (s === 'mitigated') return 'var(--color-info)'
  return 'var(--color-muted)'
}

function statusAr(s: IncidentStatus): string {
  if (s === 'open') return 'مفتوح'
  if (s === 'investigating') return 'قيد التحقيق'
  if (s === 'mitigated') return 'مُحتوى'
  return 'مُغلق'
}

function complianceColor(s: ComplianceStatus): string {
  if (s === 'compliant') return 'var(--color-good)'
  if (s === 'partial') return 'var(--color-warn)'
  return 'var(--color-bad)'
}

function complianceAr(s: ComplianceStatus): string {
  if (s === 'compliant') return 'مُلتزم'
  if (s === 'partial') return 'جزئي'
  return 'فجوة'
}

function actionColor(a: EventAction): string {
  if (a === 'blocked') return 'var(--color-bad)'
  if (a === 'quarantined') return 'var(--color-warn)'
  return 'var(--color-good)'
}

function actionAr(a: EventAction): string {
  if (a === 'blocked') return 'محجوب'
  if (a === 'quarantined') return 'حجر'
  return 'مسموح'
}

function heatColor(v: number): string {
  if (v <= 0) return 'rgba(78,163,255,0.04)'
  if (v <= 2) return `rgba(245,165,36,${0.08 + v * 0.04})`
  if (v <= 5) return `rgba(248,113,113,${0.18 + (v - 2) * 0.06})`
  return `rgba(244,63,94,${0.4 + (v - 5) * 0.08})`
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

export function SecurityOpsPage() {
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all')

  const kpis: Array<{
    ar: string
    en: string
    value: string
    spark: number[]
    trend: 'up' | 'down' | 'flat'
    icon: ComponentType<{ size?: number; className?: string }>
    accent?: 'good' | 'warn' | 'bad' | 'info'
  }> = [
    { ar: 'تهديدات محجوبة (٢٤س)', en: 'Threats blocked', value: '142', spark: [88, 96, 102, 110, 118, 124, 132, 138, 140, 141, 142, 142], trend: 'up', icon: ShieldAlert, accent: 'good' },
    { ar: 'حوادث مفتوحة', en: 'Open incidents', value: '3', spark: [5, 5, 4, 4, 3, 3, 4, 4, 3, 3, 3, 3], trend: 'down', icon: AlertTriangle, accent: 'warn' },
    { ar: 'درجة الامتثال', en: 'Compliance score', value: '96%', spark: [92, 92, 93, 93, 94, 94, 95, 95, 96, 96, 96, 96], trend: 'up', icon: FileCheck2, accent: 'good' },
    { ar: 'تغطية MFA', en: 'MFA coverage', value: '100%', spark: [88, 90, 94, 96, 98, 99, 99, 100, 100, 100, 100, 100], trend: 'up', icon: KeyRound, accent: 'good' },
    { ar: 'أجهزة مُشفّرة', en: 'Encrypted devices', value: '10/10', spark: [8, 8, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10], trend: 'up', icon: Lock, accent: 'good' },
    { ar: 'متوسط زمن الاستجابة', en: 'MTTR', value: '6د', spark: [11, 10, 9, 9, 8, 8, 7, 7, 7, 6, 6, 6], trend: 'down', icon: Gauge, accent: 'info' },
  ]

  const filteredIncidents = useMemo(() => {
    if (severityFilter === 'all') return INCIDENTS
    return INCIDENTS.filter((i) => i.severity === severityFilter)
  }, [severityFilter])

  return (
    <PageShell
      active="security"
      ar="الأمن السيبراني والامتثال"
      en="Security Operations & Compliance"
      icon={ShieldAlert}
      description="مركز عمليات الأمن (SOC) — وضعية ثقة-صفر، مراقبة لحظيّة للتهديدات، تدقيق المشغّلين، والتوافق مع NCA / SAMA / NDMO عبر الأسطول الميداني."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(244,63,94,0.32)] bg-[--color-bad]/10 px-3 py-2 text-[12px] font-bold text-[--color-ink] transition-shadow hover:shadow-[0_0_18px_rgba(244,63,94,0.22)]">
          <ShieldAlert size={12} />
          إعلان حادثة
        </button>
      }
    >
      {/* === KPI strip === */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => {
          const Icon = k.icon
          const accent =
            k.accent === 'bad'
              ? 'var(--color-bad)'
              : k.accent === 'warn'
                ? 'var(--color-warn)'
                : k.accent === 'good'
                  ? 'var(--color-good)'
                  : 'var(--color-admiral-glow)'
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
                <div
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border"
                  style={{
                    borderColor: `color-mix(in srgb, ${accent} 32%, transparent)`,
                    background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                    color: accent,
                  }}
                >
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

      {/* === Heatmap + Incidents row === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {/* Threat heatmap */}
        <div className="glass-card col-span-12 overflow-hidden p-4 lg:col-span-7">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Threat density · last 7 days
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                خريطة كثافة التهديدات
              </h3>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(244,63,94,0.3)] bg-black/50 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink] backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[--color-bad] opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-bad]" />
              </span>
              SOC LIVE
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* hour labels */}
              <div className="flex items-center gap-1 ps-[88px]">
                {Array.from({ length: 24 }).map((_, h) => (
                  <div
                    key={h}
                    className={cn(
                      'flex-1 text-center font-en text-[8.5px] font-bold tabular-nums',
                      h % 3 === 0 ? 'text-[--color-faint]' : 'text-transparent',
                    )}
                  >
                    {String(h).padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* rows */}
              <div className="mt-1 flex flex-col gap-1">
                {HEATMAP.map((row, di) => {
                  const rowSum = row.reduce((a, b) => a + b, 0)
                  return (
                    <div key={di} className="flex items-center gap-1">
                      <div className="flex w-[88px] shrink-0 items-center justify-between gap-1 pe-2">
                        <div className="text-[10.5px] font-bold text-[--color-ink-2]">
                          {DAYS_AR[di]}
                        </div>
                        <div className="font-en text-[8.5px] font-bold uppercase tracking-[0.12em] text-[--color-faint]">
                          {DAYS_EN[di]}
                        </div>
                      </div>
                      {row.map((v, hi) => (
                        <div
                          key={hi}
                          title={`${DAYS_EN[di]} · ${String(hi).padStart(2, '0')}:00 · ${v}`}
                          className="h-5 flex-1 rounded-[3px] border border-[rgba(255,255,255,0.04)]"
                          style={{ background: heatColor(v) }}
                        />
                      ))}
                      <div className="ms-2 inline-flex w-[60px] shrink-0 items-center justify-end gap-1 rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en text-[10px] font-extrabold tabular-nums text-[--color-ink]">
                        <Activity size={9} className="text-[--color-faint]" />
                        {rowSum}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* legend */}
              <div className="mt-3 flex items-center gap-2 ps-[88px]">
                <div className="font-en text-[9px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                  intensity
                </div>
                {[0, 2, 4, 6, 8, 10].map((v) => (
                  <div key={v} className="flex items-center gap-1">
                    <div className="h-3 w-5 rounded-sm" style={{ background: heatColor(v) }} />
                    <div className="font-en text-[9px] font-semibold tabular-nums text-[--color-muted]">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Open incidents */}
        <div className="glass-card col-span-12 flex flex-col overflow-hidden lg:col-span-5">
          <div className="flex items-start justify-between gap-2 p-4 pb-3">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Open incidents · {INCIDENTS.length}
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                الحوادث المفتوحة
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <SevChip active={severityFilter === 'all'} onClick={() => setSeverityFilter('all')}>الكل</SevChip>
              {(['critical', 'high', 'medium', 'low'] as Severity[]).map((s) => (
                <SevChip
                  key={s}
                  active={severityFilter === s}
                  onClick={() => setSeverityFilter(severityFilter === s ? 'all' : s)}
                  dot={severityColor(s)}
                >
                  {severityAr(s)}
                </SevChip>
              ))}
            </div>
          </div>
          <div className="hairline mx-4" />
          <ul className="flex flex-col gap-2 p-4">
            {filteredIncidents.map((i) => (
              <li
                key={i.id}
                className="rounded-2xl border bg-black/25 p-3 transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.16)]"
                style={{
                  borderColor: `color-mix(in srgb, ${severityColor(i.severity)} 22%, var(--color-line))`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <SeverityPill severity={i.severity} />
                    <div className="min-w-0">
                      <div className="truncate text-[12.5px] font-bold text-[--color-ink]">
                        {i.ar}
                      </div>
                      <div className="mt-0.5 truncate font-en text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                        {i.id} · {i.asset}
                      </div>
                    </div>
                  </div>
                  <IncidentStatusPill status={i.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-3 text-[--color-ink-2]">
                    <span className="inline-flex items-center gap-1">
                      <UserCheck size={10} className="text-[--color-faint]" />
                      <span className="font-bold">{i.assignee}</span>
                    </span>
                    <span className="font-en font-semibold tabular-nums text-[--color-muted]">{i.age}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]"
                    >
                      احتواء
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]"
                    >
                      عرض
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {filteredIncidents.length === 0 && (
              <li className="rounded-2xl border border-dashed border-[--color-line] bg-black/20 p-6 text-center text-[12px] font-bold text-[--color-muted]">
                لا توجد حوادث بهذا المستوى · No incidents at this severity.
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* === Attack surface + Zero-trust pillars === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {/* Attack surface graph */}
        <div className="glass-card col-span-12 overflow-hidden p-4 lg:col-span-7">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Attack surface · trust graph
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                خريطة سطح الهجوم
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <ExposureLegend />
            </div>
          </div>
          <div className="bg-grid relative aspect-[16/9] overflow-hidden rounded-2xl border border-[--color-line] bg-black/30">
            <svg viewBox="0 0 660 340" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="surface-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(78,163,255,0.4)" />
                  <stop offset="100%" stopColor="rgba(78,163,255,0)" />
                </radialGradient>
              </defs>
              {/* edges */}
              {SURFACE_EDGES.map(([a, b], i) => {
                const na = SURFACE_NODES.find((n) => n.id === a)
                const nb = SURFACE_NODES.find((n) => n.id === b)
                if (!na || !nb) return null
                const stroke =
                  na.exposure === 'high' || nb.exposure === 'high'
                    ? 'rgba(244,63,94,0.34)'
                    : na.exposure === 'medium' || nb.exposure === 'medium'
                      ? 'rgba(245,165,36,0.28)'
                      : 'rgba(78,163,255,0.22)'
                return (
                  <line
                    key={i}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke={stroke}
                    strokeWidth={1}
                    strokeDasharray={na.group === 'public' || nb.group === 'public' ? '3 3' : undefined}
                  />
                )
              })}
              {/* nodes */}
              {SURFACE_NODES.map((n) => {
                const c = exposureColor(n.exposure)
                const r = n.group === 'agent' ? 7 : n.group === 'control' || n.group === 'data' || n.group === 'iam' ? 12 : 9
                return (
                  <g key={n.id}>
                    <circle cx={n.x} cy={n.y} r={r + 6} fill="url(#surface-glow)" opacity={0.6} />
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={r}
                      fill={`color-mix(in srgb, ${c} 28%, #050813)`}
                      stroke={c}
                      strokeWidth={1.4}
                    />
                    <text
                      x={n.x}
                      y={n.y + r + 11}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                      fontWeight="700"
                      fill="#c2cae0"
                    >
                      {n.en}
                    </text>
                  </g>
                )
              })}
              {/* group labels */}
              <text x="90" y="20" textAnchor="middle" fontSize="9" fontWeight="800" fill="#4ea3ff" fontFamily="ui-sans-serif">
                PUBLIC ENDPOINTS
              </text>
              <text x="280" y="20" textAnchor="middle" fontSize="9" fontWeight="800" fill="#4ea3ff" fontFamily="ui-sans-serif">
                CONTROL · DATA · IAM
              </text>
              <text x="520" y="20" textAnchor="middle" fontSize="9" fontWeight="800" fill="#4ea3ff" fontFamily="ui-sans-serif">
                ROBOT AGENTS · 10
              </text>
            </svg>
            {/* corner stat */}
            <div className="absolute bottom-3 end-3 rounded-xl border border-[--color-line] bg-black/55 px-3 py-2 backdrop-blur-md">
              <div className="font-en text-[9px] font-bold uppercase tracking-[0.2em] text-[--color-faint]">
                Surface
              </div>
              <div className="font-en text-[14px] font-extrabold tabular-nums text-[--color-ink]">
                {SURFACE_NODES.length} <span className="text-[--color-muted]">nodes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zero-trust pillars */}
        <div className="glass-card col-span-12 overflow-hidden p-4 lg:col-span-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Zero-trust posture
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                ركائز الثقة الصفريّة
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(34,197,94,0.32)] bg-[--color-good]/10 px-2.5 py-1 font-en text-[10px] font-bold uppercase tracking-[0.14em] text-[--color-good]">
              <ShieldCheck size={10} />
              hardened
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {PILLARS.map((p) => {
              const Icon = p.icon
              const tone =
                p.score >= 95 ? 'var(--color-good)' : p.score >= 85 ? 'var(--color-warn)' : 'var(--color-bad)'
              return (
                <li
                  key={p.id}
                  className="rounded-2xl border border-[--color-line] bg-black/25 p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border"
                      style={{
                        borderColor: `color-mix(in srgb, ${tone} 32%, transparent)`,
                        background: `color-mix(in srgb, ${tone} 12%, transparent)`,
                        color: tone,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="text-[12.5px] font-bold text-[--color-ink]">{p.ar}</div>
                        <div className="font-en text-[12px] font-extrabold tabular-nums" style={{ color: tone }}>
                          {p.score}%
                        </div>
                      </div>
                      <div className="font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                        {p.en} · {p.metric}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.score}%`,
                        background: `linear-gradient(90deg, ${tone}, color-mix(in srgb, ${tone} 50%, transparent))`,
                        boxShadow: `0 0 12px color-mix(in srgb, ${tone} 40%, transparent)`,
                      }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <div className="font-en font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                      Last audit
                    </div>
                    <div className="font-en font-bold tabular-nums text-[--color-ink-2]">
                      {p.audit}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* === Compliance matrix === */}
      <section className="glass-card mt-4 overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-2 p-4 pb-3">
          <div>
            <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
              Compliance matrix · {COMPLIANCE.length} standards
            </div>
            <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
              مصفوفة الامتثال التنظيمي
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2 text-[11.5px] font-bold text-[--color-ink-2] transition-shadow hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
              <FileCheck2 size={12} />
              تصدير ملخّص
            </button>
          </div>
        </div>
        <div className="hairline mx-4" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0">
            <thead>
              <tr>
                <Th>المعيار · Standard</Th>
                <Th>الحالة · Status</Th>
                <Th align="end">الدرجة · Score</Th>
                <Th>آخر تدقيق · Last audit</Th>
                <Th>التدقيق القادم · Next audit</Th>
                <Th>المسؤول · Owner</Th>
                <Th align="end">التقرير · Report</Th>
              </tr>
            </thead>
            <tbody>
              {COMPLIANCE.map((row) => {
                const tone = complianceColor(row.status)
                return (
                  <tr key={row.en} className="transition-colors hover:bg-white/[0.025]">
                    <Td>
                      <div className="flex items-center gap-2">
                        <Shield size={12} className="text-[--color-admiral-glow]" />
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-bold text-[--color-ink]">{row.ar}</div>
                          <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                            {row.en}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-bold"
                        style={{
                          borderColor: `color-mix(in srgb, ${tone} 32%, transparent)`,
                          background: `color-mix(in srgb, ${tone} 14%, transparent)`,
                          color: tone,
                        }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
                        <span>{complianceAr(row.status)}</span>
                        <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-80">
                          {row.status}
                        </span>
                      </span>
                    </Td>
                    <Td align="end">
                      <div className="ms-auto inline-flex items-center justify-end gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.05]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.score}%`,
                              background: tone,
                              boxShadow: `0 0 10px color-mix(in srgb, ${tone} 40%, transparent)`,
                            }}
                          />
                        </div>
                        <span className="font-en text-[12px] font-extrabold tabular-nums text-[--color-ink]">
                          {row.score}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span className="font-en text-[11.5px] font-semibold tabular-nums text-[--color-ink-2]">
                        {row.last}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-en text-[11.5px] font-semibold tabular-nums text-[--color-ink-2]">
                        {row.next}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[11.5px] font-bold text-[--color-ink-2]">{row.owner}</span>
                    </Td>
                    <Td align="end">
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center gap-1 font-en text-[11px] font-bold text-[--color-admiral-glow] hover:underline"
                      >
                        <Eye size={11} />
                        View report
                      </a>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* === Robot fleet auth + Operator audit log === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {/* Robot fleet authorization */}
        <div className="glass-card col-span-12 overflow-hidden lg:col-span-6">
          <div className="flex flex-wrap items-start justify-between gap-2 p-4 pb-3">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Fleet authorization · 10 robots
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                صلاحيات الأسطول الميداني
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <BulkBtn icon={Lock} label="قفل الأسطول" tone="bad" />
              <BulkBtn icon={KeyRound} label="تدوير المفاتيح" tone="warn" />
              <BulkBtn icon={Crosshair} label="إعادة التوثيق" tone="info" />
            </div>
          </div>
          <div className="hairline mx-4" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <Th>المعرّف · ID</Th>
                  <Th>النطاق · Scope</Th>
                  <Th>الإيقاف · Kill</Th>
                  <Th>قناة OTA</Th>
                  <Th>TPM</Th>
                  <Th align="end">آخر شهادة · Cert</Th>
                </tr>
              </thead>
              <tbody>
                {ROBOT_AUTH.map((r) => {
                  const scopeColor =
                    r.scope === 'full'
                      ? 'var(--color-bad)'
                      : r.scope === 'restricted'
                        ? 'var(--color-warn)'
                        : 'var(--color-info)'
                  const scopeAr =
                    r.scope === 'full' ? 'كامل' : r.scope === 'restricted' ? 'مقيّد' : 'قراءة فقط'
                  const ksColor = r.killSwitch === 'armed' ? 'var(--color-good)' : 'var(--color-muted)'
                  const otaColor = r.ota === 'stable' ? 'var(--color-good)' : 'var(--color-warn)'
                  return (
                    <tr key={r.id} className="transition-colors hover:bg-white/[0.025]">
                      <Td>
                        <span className="font-en text-[12px] font-extrabold tabular-nums text-[--color-ink]">
                          {r.id}
                        </span>
                      </Td>
                      <Td>
                        <span
                          className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-bold"
                          style={{
                            borderColor: `color-mix(in srgb, ${scopeColor} 32%, transparent)`,
                            background: `color-mix(in srgb, ${scopeColor} 14%, transparent)`,
                            color: scopeColor,
                          }}
                        >
                          {scopeAr}
                          <span className="font-en text-[9px] font-semibold uppercase tracking-[0.12em] opacity-80">
                            {r.scope}
                          </span>
                        </span>
                      </Td>
                      <Td>
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.14em]"
                          style={{
                            background: `color-mix(in srgb, ${ksColor} 14%, transparent)`,
                            color: ksColor,
                          }}
                        >
                          {r.killSwitch === 'armed' ? <Lock size={10} /> : <Unlock size={10} />}
                          {r.killSwitch}
                        </span>
                      </Td>
                      <Td>
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.14em]"
                          style={{
                            background: `color-mix(in srgb, ${otaColor} 14%, transparent)`,
                            color: otaColor,
                          }}
                        >
                          {r.ota}
                        </span>
                      </Td>
                      <Td>
                        {r.tpm ? (
                          <span className="inline-flex items-center gap-1 font-en text-[10.5px] font-bold text-[--color-good]">
                            <BadgeCheck size={11} /> attested
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-en text-[10.5px] font-bold text-[--color-bad]">
                            <AlertCircle size={11} /> missing
                          </span>
                        )}
                      </Td>
                      <Td align="end">
                        <span className="font-en text-[11px] font-semibold tabular-nums text-[--color-ink-2]">
                          {r.lastCert}
                        </span>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operator audit log */}
        <div className="glass-card col-span-12 overflow-hidden lg:col-span-6">
          <div className="flex items-start justify-between gap-2 p-4 pb-3">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Operator audit log · {AUDIT_LOG.length} entries
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                سجل تدقيق المشغّلين
              </h3>
            </div>
            <div className="font-en text-[10.5px] font-bold tabular-nums text-[--color-faint]">
              today · {new Date().toLocaleDateString('en-CA')}
            </div>
          </div>
          <div className="hairline mx-4" />
          <ul className="flex flex-col gap-1.5 p-4">
            {AUDIT_LOG.map((a) => {
              const riskTone =
                a.risk >= 70 ? 'var(--color-bad)' : a.risk >= 40 ? 'var(--color-warn)' : 'var(--color-good)'
              return (
                <li
                  key={a.id}
                  className="flex items-center gap-2.5 rounded-xl border border-[--color-line] bg-black/25 px-3 py-2"
                >
                  <div
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border"
                    style={{
                      borderColor: `color-mix(in srgb, ${riskTone} 32%, transparent)`,
                      background: `color-mix(in srgb, ${riskTone} 12%, transparent)`,
                      color: riskTone,
                    }}
                  >
                    <UserCheck size={11} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="truncate text-[12px] font-bold text-[--color-ink]">
                        {a.operator}
                        <span className="ms-1.5 font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                          {a.action}
                        </span>
                      </div>
                      <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-muted]">
                        {a.ts}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-[11px] font-bold text-[--color-ink-2]">{a.ar}</span>
                      <span className="font-en text-[10px] font-semibold text-[--color-faint]">
                        → {a.target} · {a.ip}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[10px] font-extrabold tabular-nums"
                    style={{
                      borderColor: `color-mix(in srgb, ${riskTone} 32%, transparent)`,
                      background: `color-mix(in srgb, ${riskTone} 12%, transparent)`,
                      color: riskTone,
                    }}
                  >
                    <Gauge size={10} />
                    {a.risk}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* === Live security events stream === */}
      <section className="glass-card mt-4 p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
              Live security events · {EVENTS.length} latest
            </div>
            <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
              تدفّق الأحداث الأمنيّة الحيّة
            </h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(78,163,255,0.3)] bg-black/50 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink] backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[--color-admiral-glow] opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
            </span>
            STREAMING
          </div>
        </div>
        <div className="hairline -mx-4 mb-3" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0">
            <thead>
              <tr>
                <Th>الخطورة · Severity</Th>
                <Th>الوقت · Time</Th>
                <Th>المصدر · Source</Th>
                <Th>الوجهة · Destination</Th>
                <Th>الحدث · Event</Th>
                <Th align="end">الإجراء · Action</Th>
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((e) => {
                const sc = severityColor(e.severity)
                const ac = actionColor(e.action)
                return (
                  <tr key={e.id} className="transition-colors hover:bg-white/[0.025]">
                    <Td>
                      <div className="flex items-center gap-2">
                        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: sc }}>
                          {e.severity === 'critical' && (
                            <span
                              className="absolute inset-0 animate-ping rounded-full"
                              style={{ background: sc, opacity: 0.6 }}
                            />
                          )}
                        </span>
                        <span className="font-en text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: sc }}>
                          {e.severity}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span className="font-en text-[11.5px] font-bold tabular-nums text-[--color-ink-2]">
                        {e.ts}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-en text-[11.5px] font-semibold tabular-nums text-[--color-ink-2]">
                        {e.source}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-en text-[11.5px] font-semibold tabular-nums text-[--color-ink-2]">
                        {e.destination}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[12px] font-bold text-[--color-ink]">{e.ar}</span>
                    </Td>
                    <Td align="end">
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold"
                        style={{
                          borderColor: `color-mix(in srgb, ${ac} 32%, transparent)`,
                          background: `color-mix(in srgb, ${ac} 14%, transparent)`,
                          color: ac,
                        }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: ac }} />
                        <span>{actionAr(e.action)}</span>
                        <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-80">
                          {e.action}
                        </span>
                      </span>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  )
}

/* ------------------------------------------------------------------ */
/* sub-components                                                      */
/* ------------------------------------------------------------------ */

function SeverityPill({ severity }: { severity: Severity }) {
  const color = severityColor(severity)
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold"
      style={{
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span>{severityAr(severity)}</span>
      <span className="font-en text-[9px] font-semibold uppercase tracking-[0.12em] opacity-80">
        {severity}
      </span>
    </span>
  )
}

function IncidentStatusPill({ status }: { status: IncidentStatus }) {
  const color = statusColor(status)
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
      style={{
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
      }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: color }} />
      <span>{statusAr(status)}</span>
      <span className="font-en text-[9px] font-semibold uppercase tracking-[0.12em] opacity-80">
        {status}
      </span>
    </span>
  )
}

function SevChip({
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
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-bold transition-shadow',
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

function ExposureLegend() {
  const items: Array<{ label: string; ar: string; color: string }> = [
    { label: 'high', ar: 'مرتفع', color: 'var(--color-bad)' },
    { label: 'medium', ar: 'متوسط', color: 'var(--color-warn)' },
    { label: 'low', ar: 'منخفض', color: 'var(--color-good)' },
    { label: 'internal', ar: 'داخلي', color: 'var(--color-admiral-glow)' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[--color-line] bg-black/30 px-2 py-1">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: it.color }} />
          <span className="text-[10px] font-bold text-[--color-ink-2]">{it.ar}</span>
          <span className="font-en text-[9px] font-semibold uppercase tracking-[0.12em] text-[--color-faint]">
            {it.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function BulkBtn({
  icon: Icon,
  label,
  tone,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  tone: 'bad' | 'warn' | 'info'
}) {
  const color =
    tone === 'bad' ? 'var(--color-bad)' : tone === 'warn' ? 'var(--color-warn)' : 'var(--color-info)'
  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-xl border bg-black/30 px-2.5 py-1.5 text-[11px] font-bold transition-shadow hover:shadow-[0_0_18px_rgba(78,163,255,0.18)]"
      style={{
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        color,
      }}
    >
      <Icon size={11} />
      {label}
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
