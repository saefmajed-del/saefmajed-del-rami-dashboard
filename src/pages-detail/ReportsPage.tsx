import {
  FileBarChart2,
  FileText,
  Presentation,
  Sheet,
  Mail,
  Download,
  Clock,
  Filter,
  Calendar,
  Users,
  Send,
  Sparkles,
  Share2,
  ChevronLeft,
  Plus,
  Eye,
  Copy,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { PageShell } from './_PageShell'

/* ───────────────────────── data ───────────────────────── */

const KPIS = [
  { ar: 'مُنشأة هذا الشهر', en: 'Generated · MTD', val: '38', delta: '+12', tone: 'admiral' as const },
  { ar: 'مجدولة', en: 'Scheduled', val: '14', delta: '+3', tone: 'info' as const },
  { ar: 'مُسلَّمة', en: 'Delivered', val: '142', delta: '98%', tone: 'good' as const },
  { ar: 'متوسط زمن الإنشاء', en: 'Avg gen time', val: '3.2s', delta: '-0.4s', tone: 'good' as const },
  { ar: 'التخزين المُستهلك', en: 'Storage used', val: '2.4 GB', delta: '/ 50 GB', tone: 'admiral' as const },
]

const REPORT_TYPES = [
  { ar: 'تقرير الأسطول الأسبوعي', en: 'Fleet Weekly', desc: 'صحّة الأسطول، الجلسات، التنبيهات' },
  { ar: 'حوكمة المشاريع', en: 'Project Governance', desc: 'OKR، المخاطر، تقدّم المراحل' },
  { ar: 'الالتزام بالهوية', en: 'Brand Compliance', desc: 'مطابقة الصوت، اللون، الشعار' },
  { ar: 'أداء الذكاء اللغوي', en: 'Language Performance', desc: 'دقة اللهجات، WER، الحوارات' },
  { ar: 'تقرير مخصّص', en: 'Custom', desc: 'منشئ القوالب — اختر الحقول' },
]

const ROBOTS = [
  'savvy-001 · الرياض',
  'savvy-002 · جدة',
  'savvy-003 · KAUST',
  'savvy-004 · موسم',
  'savvy-005 · دبي',
  'savvy-006 · القصيم',
  'savvy-007 · الدمام',
  'savvy-008 · الطائف',
  'savvy-009 · أبها',
  'savvy-010 · تبوك',
]

const PROJECTS = [
  'مشروع نيوم',
  'حملة هكشة',
  'موسم الرياض',
  'KAUST Lab',
  'Savvy Speak',
  'Brand Refresh',
]

const KSA_CITIES = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'تبوك', 'أبها', 'الطائف', 'القصيم', 'حائل', 'نيوم']

const FORMATS = [
  { id: 'pdf', label: 'PDF', icon: FileText, default: true },
  { id: 'pptx', label: 'PPTX', icon: Presentation, default: true },
  { id: 'xlsx', label: 'XLSX', icon: Sheet, default: false },
  { id: 'csv', label: 'CSV', icon: Sheet, default: false },
  { id: 'email', label: 'Email', icon: Mail, default: true },
]

const RECIPIENTS = ['rami@savvyworld.ai', 'ops@savvyworld.ai', 'board@savvyworld.ai', 'integration@savvyworld.ai']

const WEEK_DAYS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

const RECENT = [
  { ar: 'تقرير الأسطول الأسبوعي', en: 'Weekly Fleet Report · W18', kind: 'pdf', date: 'الأحد · 14:00', size: '4.2 MB', status: 'done' as const },
  { ar: 'أداء الذكاء اللغوي', en: 'AI Language Performance', kind: 'pptx', date: 'السبت · 09:30', size: '12 MB', status: 'done' as const },
  { ar: 'التزام الهوية — أبريل', en: 'Brand Compliance · April', kind: 'xlsx', date: 'الجمعة · 18:15', size: '880 KB', status: 'done' as const },
  { ar: 'حوكمة المشاريع · Q2', en: 'Project Governance · Q2', kind: 'pdf', date: 'الخميس · 11:00', size: '6.7 MB', status: 'done' as const },
  { ar: 'حصيلة المحتوى — هكشة', en: 'Content Yield · Hukshah', kind: 'pptx', date: 'الأربعاء · 16:40', size: '9.1 MB', status: 'done' as const },
  { ar: 'تقرير الجلسات اليومي', en: 'Daily Sessions Recap', kind: 'pdf', date: 'الآن', size: '—', status: 'running' as const },
  { ar: 'تقدّم اللهجات السعودية', en: 'KSA Dialect Progress', kind: 'xlsx', date: 'غداً · 09:00', size: '—', status: 'scheduled' as const },
  { ar: 'مراجعة الهوية — مايو', en: 'Brand Review · May', kind: 'pdf', date: 'الإثنين · 10:00', size: '—', status: 'scheduled' as const },
]

const SCHEDULED = [
  { ar: 'الأسطول الأسبوعي', en: 'Fleet Weekly', cadence: 'أسبوعي · الأحد', next: 'الأحد 14:00', recipients: ['RA', 'OP', 'BR'], format: 'PDF' },
  { ar: 'حصيلة المحتوى', en: 'Content Yield', cadence: 'يومي', next: 'غداً 09:00', recipients: ['KH', 'OP'], format: 'PPTX' },
  { ar: 'حوكمة المشاريع', en: 'Project Governance', cadence: 'شهري · ١', next: '١ يونيو 08:00', recipients: ['RA', 'BR', 'CF', 'IN'], format: 'PDF+XLSX' },
  { ar: 'الالتزام بالهوية', en: 'Brand Compliance', cadence: 'أسبوعي · الإثنين', next: 'الإثنين 10:00', recipients: ['RA', 'BR'], format: 'PDF' },
  { ar: 'تقدّم اللهجات', en: 'Dialect Progress', cadence: 'أسبوعي · الخميس', next: 'الخميس 17:00', recipients: ['KH', 'IN'], format: 'XLSX' },
  { ar: 'مراجعة الأمان', en: 'Security Review', cadence: 'شهري · ١٥', next: '١٥ مايو 08:00', recipients: ['RA', 'CF'], format: 'PDF' },
]

const ANALYTICS = [
  { ar: 'معدّل الفتح', en: 'Open rate', val: '92%', delta: '+4%', spark: [3, 5, 4, 7, 6, 8, 9, 8, 9, 10, 11, 12], tone: 'good' as const },
  { ar: 'معدّل التحميل', en: 'Download rate', val: '74%', delta: '+2%', spark: [4, 4, 5, 5, 6, 6, 7, 8, 9, 9, 10, 11], tone: 'admiral' as const },
  { ar: 'معدّل التحويل', en: 'Forward rate', val: '38%', delta: '+8%', spark: [2, 3, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11], tone: 'info' as const },
]

const TEMPLATES = [
  { ar: 'الأسبوعي التنفيذي', en: 'Executive Weekly', last: 'قبل ٣ أيام', kind: 'pdf' as const },
  { ar: 'حالة الأسطول', en: 'Fleet Status', last: 'قبل يومين', kind: 'pdf' as const },
  { ar: 'حصيلة المحتوى', en: 'Content Yield', last: 'قبل ٤ ساعات', kind: 'pptx' as const },
  { ar: 'مراجعة الهوية', en: 'Brand Review', last: 'الأسبوع الماضي', kind: 'pdf' as const },
  { ar: 'تقدّم اللغة', en: 'Language Progress', last: 'أمس', kind: 'xlsx' as const },
  { ar: 'حوكمة المشاريع', en: 'Project Governance', last: 'قبل ٦ أيام', kind: 'pdf' as const },
]

/* ───────────────────────── helpers ───────────────────────── */

const KIND_ICON = { pdf: FileText, pptx: Presentation, xlsx: Sheet } as const

function kindClasses(kind: 'pdf' | 'pptx' | 'xlsx') {
  if (kind === 'pdf') return 'bg-[--color-bad]/10 text-[--color-bad] border-[--color-bad]/25'
  if (kind === 'pptx') return 'bg-[--color-warn]/10 text-[--color-warn] border-[--color-warn]/25'
  return 'bg-[--color-good]/10 text-[--color-good] border-[--color-good]/25'
}

function StatusPill({ status }: { status: 'done' | 'running' | 'scheduled' }) {
  if (status === 'done')
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[--color-good]/25 bg-[--color-good]/10 px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
        مكتمل
      </span>
    )
  if (status === 'running')
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[--color-info]/25 bg-[--color-info]/10 px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.16em] text-[--color-info]">
        <span className="h-1 w-1 animate-pulse rounded-full bg-[--color-info]" />
        جاري
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[--color-line] bg-white/5 px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2]">
      <Clock size={8} />
      مجدول
    </span>
  )
}

function Sparkline({ data, tone }: { data: number[]; tone: 'good' | 'admiral' | 'info' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const w = 120
  const h = 36
  const step = w / (data.length - 1)
  const norm = (v: number) => h - ((v - min) / Math.max(1, max - min)) * (h - 4) - 2
  const points = data.map((v, i) => `${i * step},${norm(v)}`).join(' ')
  const stroke =
    tone === 'good' ? 'var(--color-good)' : tone === 'info' ? 'var(--color-info)' : 'var(--color-admiral-glow)'
  const last = data[data.length - 1]
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`sl-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${points} ${w},${h}`} fill={`url(#sl-${tone})`} stroke="none" />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={norm(last)} r={2.5} fill={stroke} />
    </svg>
  )
}

function Avatar({ initials, idx }: { initials: string; idx: number }) {
  const tones = [
    'from-[#0a3a7e]/70 to-[#003d82]/40 text-[--color-admiral-glow]',
    'from-[#1a3563]/70 to-[#10204a]/40 text-[--color-info]',
    'from-[#2a1a4d]/70 to-[#1a0e35]/40 text-[--color-admiral-glow]',
    'from-[#0e3a3a]/70 to-[#082323]/40 text-[--color-good]',
  ]
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[--color-line] bg-gradient-to-br ${tones[idx % tones.length]} font-en text-[9px] font-bold uppercase`}
    >
      {initials}
    </span>
  )
}

/* ───────────────────────── page ───────────────────────── */

export function ReportsPage() {
  return (
    <PageShell
      active="reports"
      ar="مركز التقارير"
      en="Reports Center"
      icon={FileBarChart2}
      description="إنشاء، جدولة، وإرسال تقارير حوكمة المنصّة — الأسطول، المشاريع، الهوية، اللغة — بالعربية والإنجليزية."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 px-3 py-2 text-[12px] font-bold text-[--color-admiral-glow] transition-shadow hover:shadow-[0_0_18px_rgba(45,127,217,0.32)]">
          <Plus size={12} />
          تقرير جديد
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-3">
        {/* ───── KPI strip ───── */}
        {KPIS.map((k) => (
          <div key={k.en} className="glass-card glass-card-hover col-span-6 p-4 md:col-span-4 lg:col-span-2 xl:col-span-2">
            <div className="flex items-baseline justify-between">
              <div className="font-en text-[22px] font-extrabold leading-none tabular-nums text-[--color-ink]">
                {k.val}
              </div>
              <span
                className={`font-en text-[10px] font-bold ${
                  k.tone === 'good'
                    ? 'text-[--color-good]'
                    : k.tone === 'info'
                      ? 'text-[--color-info]'
                      : 'text-[--color-admiral-glow]'
                }`}
              >
                {k.delta}
              </span>
            </div>
            <div className="mt-1.5 text-[11px] font-bold text-[--color-ink-2]">{k.ar}</div>
            <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
              {k.en}
            </div>
          </div>
        ))}
        {/* spacer for 5 KPIs at xl (5*2=10 — fill remaining 2 with hairline glow card) */}
        <div className="col-span-12 hidden lg:col-span-2 lg:block xl:col-span-2">
          <div className="glass-card flex h-full items-center gap-2 px-4">
            <Sparkles size={14} className="text-[--color-admiral-glow]" />
            <div>
              <div className="text-[11px] font-bold text-[--color-ink]">إنشاء بالذكاء</div>
              <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                AI Compose · Beta
              </div>
            </div>
          </div>
        </div>

        {/* ───── Generate wizard ───── */}
        <Wizard />

        {/* ───── Recent reports ───── */}
        <RecentList />

        {/* ───── Scheduled table ───── */}
        <ScheduledTable />

        {/* ───── Delivery analytics ───── */}
        <Analytics />

        {/* ───── Templates library ───── */}
        <Templates />
      </div>
    </PageShell>
  )
}

/* ───────────────────────── Wizard ───────────────────────── */

function Wizard() {
  return (
    <section className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-7">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
            <Plus size={15} />
          </div>
          <div>
            <h2 className="text-[15px] font-extrabold text-[--color-ink]">إنشاء تقرير جديد</h2>
            <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
              Generate Report · 4 steps
            </div>
          </div>
        </div>
        <button className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-white/[0.02] px-2 py-1 font-en text-[10px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
          <Copy size={10} />
          حفظ كقالب
        </button>
      </header>

      <div className="hairline mb-5" />

      {/* Step 1 — Type */}
      <Step n={1} ar="نوع التقرير" en="Report type">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
          {REPORT_TYPES.map((t, i) => (
            <button
              key={t.en}
              className={`group rounded-xl border p-2.5 text-start transition-all ${
                i === 0
                  ? 'border-[rgba(78,163,255,0.45)] bg-gradient-to-br from-[#0a3a7e]/30 to-[#003d82]/10 shadow-[0_0_18px_rgba(45,127,217,0.18)]'
                  : 'border-[--color-line] bg-black/30 hover:border-[rgba(78,163,255,0.32)]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${
                    i === 0 ? 'border-[--color-admiral-glow] bg-[--color-admiral-glow]/30' : 'border-[--color-line-2]'
                  }`}
                >
                  {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />}
                </span>
                <div className="text-[12px] font-bold text-[--color-ink]">{t.ar}</div>
              </div>
              <div className="mt-1 font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                {t.en}
              </div>
              <div className="mt-1 text-[10.5px] font-medium leading-snug text-[--color-ink-2]">{t.desc}</div>
            </button>
          ))}
        </div>
      </Step>

      {/* Step 2 — Filters */}
      <Step n={2} ar="الفلاتر" en="Filters" icon={Filter}>
        <div className="grid grid-cols-12 gap-3">
          {/* Account */}
          <div className="col-span-12 md:col-span-6">
            <FieldLabel ar="الحساب" en="Account" />
            <div className="flex h-9 items-center justify-between rounded-xl border border-[--color-line] bg-black/30 px-3 text-[12px] font-bold text-[--color-ink]">
              Savvy World HQ · KSA
              <ChevronLeft size={12} className="text-[--color-muted]" />
            </div>
          </div>
          {/* Date range */}
          <div className="col-span-12 md:col-span-6">
            <FieldLabel ar="المدى الزمني" en="Date range" />
            <div className="flex items-center gap-2">
              <DateBox ar="من" en="From" val="01 / 05 / 2026" />
              <DateBox ar="إلى" en="To" val="09 / 05 / 2026" />
            </div>
          </div>
          {/* Robots */}
          <div className="col-span-12">
            <FieldLabel ar="الروبوتات" en="Robots · multi-select" />
            <div className="flex flex-wrap gap-1.5">
              {ROBOTS.map((r, i) => (
                <Chip key={r} active={i < 6} label={r} />
              ))}
            </div>
          </div>
          {/* Projects */}
          <div className="col-span-12 md:col-span-6">
            <FieldLabel ar="المشاريع" en="Projects" />
            <div className="flex flex-wrap gap-1.5">
              {PROJECTS.map((p, i) => (
                <Chip key={p} active={i < 3} label={p} />
              ))}
            </div>
          </div>
          {/* Geography */}
          <div className="col-span-12 md:col-span-6">
            <FieldLabel ar="الجغرافيا" en="Geography · KSA" />
            <div className="flex flex-wrap gap-1.5">
              {KSA_CITIES.map((c, i) => (
                <Chip key={c} active={i < 4} label={c} />
              ))}
            </div>
          </div>
        </div>
      </Step>

      {/* Step 3 — Output */}
      <Step n={3} ar="المخرجات" en="Output">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-7">
            <FieldLabel ar="الصيغ" en="Formats" />
            <div className="flex flex-wrap gap-1.5">
              {FORMATS.map((f) => {
                const Icon = f.icon
                return (
                  <label
                    key={f.id}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                      f.default
                        ? 'border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/30 to-[#003d82]/10 text-[--color-ink]'
                        : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.22)]'
                    }`}
                  >
                    <span
                      className={`grid h-3.5 w-3.5 place-items-center rounded-md border ${
                        f.default
                          ? 'border-[--color-admiral-glow] bg-[--color-admiral-glow]/30'
                          : 'border-[--color-line-2]'
                      }`}
                    >
                      {f.default && <span className="h-1.5 w-1.5 rounded-sm bg-[--color-admiral-glow]" />}
                    </span>
                    <Icon size={11} />
                    <span className="font-en">{f.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <div className="col-span-6 md:col-span-2">
            <FieldLabel ar="الهوية" en="Branding" />
            <Toggle on label="شعار Savvy" />
          </div>
          <div className="col-span-6 md:col-span-3">
            <FieldLabel ar="اللغة" en="Language" />
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-[--color-line] bg-black/30 p-1">
              <SegBtn label="عربي" active />
              <SegBtn label="EN" />
              <SegBtn label="ثنائي" />
            </div>
          </div>
        </div>
      </Step>

      {/* Step 4 — Schedule */}
      <Step n={4} ar="الجدولة" en="Schedule" icon={Calendar}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-5">
            <FieldLabel ar="التكرار" en="Cadence" />
            <div className="grid grid-cols-4 gap-1 rounded-xl border border-[--color-line] bg-black/30 p-1">
              <SegBtn label="مرّة" />
              <SegBtn label="يومي" />
              <SegBtn label="أسبوعي" active />
              <SegBtn label="شهري" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {WEEK_DAYS.map((d, i) => (
                <button
                  key={d}
                  className={`min-w-[44px] rounded-md border px-1.5 py-1 text-[11px] font-bold transition-all ${
                    i === 0
                      ? 'border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/30 to-[#003d82]/10 text-[--color-ink]'
                      : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.22)]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-7">
            <FieldLabel ar="المستلمون" en="Recipients" icon={Users} />
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-[--color-line] bg-black/30 p-2">
              {RECIPIENTS.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 rounded-md border border-[--color-line-2] bg-black/40 px-2 py-1 font-en text-[10.5px] font-bold text-[--color-ink-2]"
                >
                  <Mail size={9} />
                  {r}
                  <button className="ms-0.5 text-[--color-faint] hover:text-[--color-bad]">×</button>
                </span>
              ))}
              <button className="inline-flex items-center gap-1 rounded-md border border-dashed border-[--color-line-2] bg-transparent px-2 py-1 font-en text-[10.5px] font-bold text-[--color-muted] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink-2]">
                <Plus size={10} />
                إضافة
              </button>
            </div>
          </div>
        </div>
      </Step>

      <div className="hairline my-5" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
          Estimated · 3.4s · 4.8 MB
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2 text-[12px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
            <Copy size={12} />
            حفظ كقالب
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-[rgba(78,163,255,0.45)] bg-gradient-to-br from-[#0a3a7e]/60 to-[#003d82]/30 px-4 py-2 text-[13px] font-extrabold text-[--color-ink] shadow-[0_0_18px_rgba(45,127,217,0.32)] transition-shadow hover:shadow-[0_0_28px_rgba(45,127,217,0.45)]">
            <Sparkles size={13} className="text-[--color-admiral-glow]" />
            إنشاء التقرير
          </button>
        </div>
      </div>
    </section>
  )
}

function Step({
  n,
  ar,
  en,
  icon: Icon,
  children,
}: {
  n: number
  ar: string
  en: string
  icon?: ComponentType<{ size?: number; className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full border border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 font-en text-[10.5px] font-extrabold tabular-nums text-[--color-admiral-glow]">
          {n}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] font-extrabold text-[--color-ink]">{ar}</span>
          <span className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            {en}
          </span>
        </div>
        {Icon && <Icon size={11} className="ms-auto text-[--color-muted]" />}
      </div>
      {children}
    </div>
  )
}

function FieldLabel({
  ar,
  en,
  icon: Icon,
}: {
  ar: string
  en: string
  icon?: ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      {Icon && <Icon size={10} className="text-[--color-muted]" />}
      <span className="text-[11px] font-bold text-[--color-ink-2]">{ar}</span>
      <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">{en}</span>
    </div>
  )
}

function Chip({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all ${
        active
          ? 'border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/30 to-[#003d82]/10 text-[--color-ink]'
          : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.22)]'
      }`}
    >
      {label}
    </button>
  )
}

function DateBox({ ar, en, val }: { ar: string; en: string; val: string }) {
  return (
    <div className="flex h-9 flex-1 items-center gap-2 rounded-xl border border-[--color-line] bg-black/30 px-2.5">
      <Calendar size={11} className="text-[--color-muted]" />
      <div className="flex-1">
        <div className="font-en text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
          {ar} · {en}
        </div>
        <div className="font-en text-[11px] font-bold tabular-nums text-[--color-ink]">{val}</div>
      </div>
    </div>
  )
}

function Toggle({ on, label }: { on?: boolean; label: string }) {
  return (
    <button className="flex h-9 w-full items-center justify-between rounded-xl border border-[--color-line] bg-black/30 px-2.5">
      <span className="text-[11px] font-bold text-[--color-ink-2]">{label}</span>
      <span
        className={`relative h-4 w-7 rounded-full transition-colors ${on ? 'bg-[--color-admiral-glow]/60' : 'bg-white/10'}`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${on ? 'inset-inline-start-3.5' : 'inset-inline-start-0.5'}`}
        />
      </span>
    </button>
  )
}

function SegBtn({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition-all ${
        active
          ? 'bg-gradient-to-br from-[#0a3a7e]/60 to-[#003d82]/30 text-[--color-ink] shadow-[0_0_12px_rgba(45,127,217,0.18)]'
          : 'text-[--color-ink-2] hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  )
}

/* ───────────────────────── Recent list ───────────────────────── */

function RecentList() {
  return (
    <section className="glass-card col-span-12 flex flex-col p-5 lg:col-span-5">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-extrabold text-[--color-ink]">آخر التقارير</h2>
          <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            Recent · Last 14 days
          </div>
        </div>
        <button className="inline-flex items-center gap-1 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow] hover:text-[--color-ink]">
          عرض الكل
          <ChevronLeft size={11} />
        </button>
      </header>

      <ul className="flex flex-col rounded-2xl border border-[--color-line] bg-black/30">
        {RECENT.map((r, i) => {
          const Icon = KIND_ICON[r.kind as keyof typeof KIND_ICON]
          return (
            <li
              key={r.en}
              className={`flex items-center gap-2.5 px-3 py-2.5 ${i !== RECENT.length - 1 ? 'border-b border-[--color-line]' : ''}`}
            >
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${kindClasses(r.kind as 'pdf' | 'pptx' | 'xlsx')}`}
              >
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="truncate text-[12px] font-bold text-[--color-ink]">{r.ar}</div>
                  <StatusPill status={r.status} />
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                    {r.en}
                  </span>
                  <span className="font-en text-[9px] text-[--color-faint]">·</span>
                  <span className="inline-flex items-center gap-1 font-en text-[9.5px] font-bold text-[--color-muted]">
                    <Clock size={9} />
                    {r.date}
                  </span>
                  <span className="font-en text-[9px] text-[--color-faint]">·</span>
                  <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2]">{r.size}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IconBtn icon={Eye} title="معاينة" />
                <IconBtn icon={Download} title="تنزيل" />
                <IconBtn icon={Share2} title="مشاركة" />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function IconBtn({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  title: string
}) {
  return (
    <button
      title={title}
      className="grid h-7 w-7 place-items-center rounded-md border border-[--color-line] bg-black/30 text-[--color-ink-2] transition-all hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-admiral-glow]"
    >
      <Icon size={11} />
    </button>
  )
}

/* ───────────────────────── Scheduled table ───────────────────────── */

function ScheduledTable() {
  return (
    <section className="glass-card col-span-12 overflow-hidden p-5">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-extrabold text-[--color-ink]">التقارير المجدولة</h2>
          <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            Scheduled · Active pipelines
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-2.5 py-1.5 text-[11px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
          <Plus size={11} />
          جدولة جديدة
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-start">
          <thead>
            <tr className="border-b border-[--color-line] text-start font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
              <th className="py-2 pe-3 text-start">Report</th>
              <th className="py-2 pe-3 text-start">Cadence</th>
              <th className="py-2 pe-3 text-start">Next run</th>
              <th className="py-2 pe-3 text-start">Recipients</th>
              <th className="py-2 pe-3 text-start">Format</th>
              <th className="py-2 pe-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULED.map((s, i) => (
              <tr
                key={s.en}
                className={`text-[12px] ${i !== SCHEDULED.length - 1 ? 'border-b border-[--color-line]' : ''}`}
              >
                <td className="py-2.5 pe-3">
                  <div className="font-bold text-[--color-ink]">{s.ar}</div>
                  <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                    {s.en}
                  </div>
                </td>
                <td className="py-2.5 pe-3 font-semibold text-[--color-ink-2]">{s.cadence}</td>
                <td className="py-2.5 pe-3">
                  <span className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en text-[10px] font-bold tabular-nums text-[--color-ink]">
                    <Clock size={9} className="text-[--color-admiral-glow]" />
                    {s.next}
                  </span>
                </td>
                <td className="py-2.5 pe-3">
                  <div className="flex -space-x-1.5">
                    {s.recipients.map((r, idx) => (
                      <Avatar key={idx} initials={r} idx={idx} />
                    ))}
                  </div>
                </td>
                <td className="py-2.5 pe-3">
                  <span className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en text-[10px] font-bold text-[--color-ink-2]">
                    {s.format}
                  </span>
                </td>
                <td className="py-2.5 pe-3">
                  <div className="flex items-center gap-1">
                    <IconBtn icon={Send} title="تشغيل الآن" />
                    <IconBtn icon={Eye} title="عرض" />
                    <IconBtn icon={Copy} title="تكرار" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/* ───────────────────────── Analytics ───────────────────────── */

function Analytics() {
  return (
    <section className="glass-card col-span-12 p-5 lg:col-span-6">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-extrabold text-[--color-ink]">تحليلات التسليم</h2>
          <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            Delivery analytics · 30 days
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[--color-good]/25 bg-[--color-good]/10 px-2 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
          Live
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {ANALYTICS.map((a) => (
          <div key={a.en} className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
            <div className="flex items-baseline justify-between">
              <div className="font-en text-[22px] font-extrabold leading-none tabular-nums text-[--color-ink]">
                {a.val}
              </div>
              <span
                className={`font-en text-[10px] font-bold ${
                  a.tone === 'good'
                    ? 'text-[--color-good]'
                    : a.tone === 'info'
                      ? 'text-[--color-info]'
                      : 'text-[--color-admiral-glow]'
                }`}
              >
                {a.delta}
              </span>
            </div>
            <div className="mt-1.5 text-[11px] font-bold text-[--color-ink-2]">{a.ar}</div>
            <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
              {a.en}
            </div>
            <div className="mt-2">
              <Sparkline data={a.spark} tone={a.tone} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Templates ───────────────────────── */

function Templates() {
  return (
    <section className="glass-card col-span-12 p-5 lg:col-span-6">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-extrabold text-[--color-ink]">مكتبة القوالب</h2>
          <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            Templates library
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-2.5 py-1.5 text-[11px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
          <Plus size={11} />
          قالب جديد
        </button>
      </header>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((t) => {
          const Icon = KIND_ICON[t.kind]
          return (
            <div
              key={t.en}
              className="group flex flex-col gap-2 rounded-2xl border border-[--color-line] bg-black/30 p-3 transition-all hover:border-[rgba(78,163,255,0.32)] hover:shadow-[0_0_18px_rgba(45,127,217,0.18)]"
            >
              {/* thumb */}
              <div className="relative h-20 overflow-hidden rounded-xl border border-[--color-line] bg-gradient-to-br from-[#0a3a7e]/30 via-[#11173a] to-[#050813]">
                <div className="bg-grid absolute inset-0 opacity-40" />
                <div className="absolute inset-inline-start-2 top-2 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[--color-bad]/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[--color-warn]/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]/70" />
                </div>
                <div className="absolute inset-x-3 bottom-2 flex flex-col gap-1">
                  <div className="h-1 w-12 rounded-full bg-white/15" />
                  <div className="h-1 w-20 rounded-full bg-white/10" />
                  <div className="h-1 w-16 rounded-full bg-white/8" />
                </div>
                <div
                  className={`absolute inset-inline-end-2 top-2 grid h-7 w-7 place-items-center rounded-md border ${kindClasses(t.kind)}`}
                >
                  <Icon size={11} />
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-extrabold text-[--color-ink]">{t.ar}</div>
                  <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                    {t.en}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 font-en text-[9.5px] font-bold text-[--color-muted]">
                    <Clock size={9} />
                    {t.last}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="flex-1 rounded-md border border-[--color-line] bg-black/40 px-2 py-1 text-[11px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                  استنساخ
                </button>
                <button className="flex-1 rounded-md border border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 px-2 py-1 text-[11px] font-bold text-[--color-admiral-glow]">
                  تعديل
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
