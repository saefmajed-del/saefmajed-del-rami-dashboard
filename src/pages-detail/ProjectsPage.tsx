import { useMemo, useState } from 'react'
import {
  Building2,
  Users,
  GraduationCap,
  Landmark,
  Rocket,
  AlertCircle,
  Bot,
  Phone,
  Calendar,
  ChevronLeft,
  Activity,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Wrench,
  ShieldCheck,
  PlayCircle,
} from 'lucide-react'
import { PageShell } from './_PageShell'
import { SaudiMap } from '@/home/parts/SaudiMap'
import { PROJECTS, type Project, type RobotPin } from '@/home/data'
import { cn } from '@/lib/utils'

type FilterKey = 'all' | 'university' | 'gov' | 'accelerator'

const FILTERS: { key: FilterKey; ar: string; en: string }[] = [
  { key: 'all', ar: 'الكل', en: 'All' },
  { key: 'university', ar: 'جامعات', en: 'Universities' },
  { key: 'gov', ar: 'حكومي', en: 'Government' },
  { key: 'accelerator', ar: 'مسرّعات', en: 'Accelerators' },
]

const BADGE_LABEL: Record<Project['badge'], { ar: string; en: string }> = {
  university: { ar: 'جامعة', en: 'University' },
  gov: { ar: 'حكومي', en: 'Government' },
  accelerator: { ar: 'مسرّعة', en: 'Accelerator' },
}

const BADGE_ICON: Record<Project['badge'], typeof GraduationCap> = {
  university: GraduationCap,
  gov: Landmark,
  accelerator: Rocket,
}

interface ProjectMeta {
  city: { ar: string; en: string }
  contactAr: string
  contactRole: string
  phone: string
  deployedAr: string
  lastActivityAr: string
  pin: { x: number; y: number; status: RobotPin['status'] }
  spark: number[]
  timeline: { ar: string; en: string; ago: string }[]
}

const PROJECT_META: Record<string, ProjectMeta> = {
  'King Saud University': {
    city: { ar: 'الرياض', en: 'Riyadh' },
    contactAr: 'د. خالد الشهري',
    contactRole: 'مدير مختبر الذكاء الاصطناعي',
    phone: '+966 11 4••• 217',
    deployedAr: '٢٠٢٥/٠٩/١٢',
    lastActivityAr: 'قبل ساعتين',
    pin: { x: 56, y: 50, status: 'online' },
    spark: [3, 4, 4, 6, 5, 7, 7, 8, 9, 8, 10, 11, 10, 12, 11, 13, 14, 13, 15, 14, 16, 15, 17, 16, 18, 17, 19, 18, 20, 21],
    timeline: [
      { ar: 'جلسة تدريب G1 مع طلاب الهندسة', en: 'G1 training session', ago: 'قبل ساعتين' },
      { ar: 'تحديث برمجي v3.4.2', en: 'Firmware v3.4.2', ago: 'أمس' },
      { ar: 'افتتاح مختبر التشغيل التجريبي', en: 'Lab inauguration', ago: 'قبل ٤ أيام' },
    ],
  },
  'King Abdulaziz University': {
    city: { ar: 'جدة', en: 'Jeddah' },
    contactAr: 'د. منى البلوي',
    contactRole: 'رئيسة برنامج الروبوتات',
    phone: '+966 12 6••• 884',
    deployedAr: '٢٠٢٥/١٠/٠٣',
    lastActivityAr: 'قبل ٣ ساعات',
    pin: { x: 28, y: 60, status: 'online' },
    spark: [2, 3, 4, 4, 5, 6, 5, 7, 8, 7, 9, 8, 10, 11, 10, 12, 11, 13, 12, 14, 13, 15, 14, 16, 15, 17, 16, 18, 17, 19],
    timeline: [
      { ar: 'محاضرة تفاعلية مع G1', en: 'Interactive lecture', ago: 'قبل ٣ ساعات' },
      { ar: 'صيانة دورية للوحدة الثانية', en: 'Scheduled maintenance', ago: 'قبل يومين' },
      { ar: 'استلام وحدة جديدة', en: 'New unit onboarded', ago: 'قبل أسبوع' },
    ],
  },
  KACST: {
    city: { ar: 'الرياض', en: 'Riyadh' },
    contactAr: 'م. عبدالرحمن القحطاني',
    contactRole: 'مدير تكامل الأنظمة',
    phone: '+966 11 4813•••',
    deployedAr: '٢٠٢٥/٠٧/٢١',
    lastActivityAr: 'قبل ٤٥ دقيقة',
    pin: { x: 56, y: 49, status: 'warn' },
    spark: [5, 6, 7, 8, 9, 10, 11, 12, 13, 12, 14, 13, 15, 14, 13, 11, 12, 10, 9, 8, 9, 10, 11, 12, 13, 12, 11, 10, 11, 12],
    timeline: [
      { ar: 'تنبيه: بطارية منخفضة على وحدة B', en: 'Low battery alert', ago: 'قبل ٤٥د' },
      { ar: 'مراجعة بروتوكولات السلامة', en: 'Safety review', ago: 'قبل ٣ أيام' },
      { ar: 'عرض تجريبي للجنة الفنية', en: 'Demo to technical committee', ago: 'قبل أسبوع' },
    ],
  },
  "Monsha'at": {
    city: { ar: 'الرياض', en: 'Riyadh' },
    contactAr: 'أ. سارة العتيبي',
    contactRole: 'منسّقة برامج الابتكار',
    phone: '+966 11 8••• 442',
    deployedAr: '٢٠٢٥/١١/١٨',
    lastActivityAr: 'قبل ٦ ساعات',
    pin: { x: 57, y: 51, status: 'online' },
    spark: [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 9, 10, 11, 10, 12, 11, 13, 12, 14, 13, 15, 14, 16, 15, 17, 18],
    timeline: [
      { ar: 'حضور رواد الأعمال للعرض الحي', en: 'Founders attended demo', ago: 'قبل ٦ ساعات' },
      { ar: 'ورشة عمل للمسرّعات', en: 'Accelerator workshop', ago: 'قبل ٣ أيام' },
      { ar: 'تسجيل ٣٢ شركة ناشئة', en: '32 startups onboarded', ago: 'قبل أسبوع' },
    ],
  },
  TAQNIA: {
    city: { ar: 'الرياض', en: 'Riyadh' },
    contactAr: 'د. فهد الدوسري',
    contactRole: 'مدير الشراكات التقنية',
    phone: '+966 11 2••• 109',
    deployedAr: '٢٠٢٥/٠٨/٠٥',
    lastActivityAr: 'قبل يوم',
    pin: { x: 55, y: 50, status: 'online' },
    spark: [4, 5, 6, 7, 7, 8, 9, 10, 11, 12, 11, 13, 14, 13, 15, 14, 16, 15, 17, 16, 18, 17, 19, 18, 20, 19, 21, 20, 22, 21],
    timeline: [
      { ar: 'إغلاق دورة الاستثمار الأولى', en: 'Round-1 investment closed', ago: 'قبل يوم' },
      { ar: 'لقاء مع وفد آسيوي', en: 'Asian delegation visit', ago: 'قبل ٤ أيام' },
      { ar: 'توقيع مذكرة تفاهم', en: 'MoU signed', ago: 'قبل أسبوعين' },
    ],
  },
  'Falak Accelerator': {
    city: { ar: 'الرياض', en: 'Riyadh' },
    contactAr: 'م. ريم الزهراني',
    contactRole: 'قائدة برنامج التسريع',
    phone: '+966 11 5••• 071',
    deployedAr: '٢٠٢٦/٠١/١٠',
    lastActivityAr: 'قبل يومين',
    pin: { x: 58, y: 51, status: 'offline' },
    spark: [1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 7, 6, 5, 4, 5, 4, 3, 4, 5, 4, 3, 2, 3, 2, 3, 2, 1],
    timeline: [
      { ar: 'تنبيه: الوحدة خارج الخدمة', en: 'Unit offline', ago: 'قبل يومين' },
      { ar: 'دفعة جديدة من رواد الأعمال', en: 'New cohort onboarded', ago: 'قبل ٤ أيام' },
      { ar: 'افتتاح المساحة', en: 'Space inaugurated', ago: 'قبل ١٠ أيام' },
    ],
  },
}

const PARTNER_FEED: { type: 'deployment' | 'training' | 'alert' | 'onboarded'; ar: string; en: string; partner: string; ago: string; ar_meta?: string }[] = [
  {
    type: 'deployment',
    ar: 'نشر وحدة G1 جديدة في مختبر الهندسة',
    en: 'New G1 unit deployed at engineering lab',
    partner: 'King Saud University',
    ago: 'قبل ٢ ساعة',
    ar_meta: 'الرياض',
  },
  {
    type: 'training',
    ar: 'جلسة تدريب طلابية على نموذج الذكاء اللغوي',
    en: 'Student training session on language model',
    partner: 'King Abdulaziz University',
    ago: 'قبل ٣ ساعات',
    ar_meta: 'جدة',
  },
  {
    type: 'alert',
    ar: 'تم حلّ تنبيه البطارية على وحدة KACST-B',
    en: 'Battery alert resolved · KACST-B',
    partner: 'KACST',
    ago: 'قبل ٤٥د',
    ar_meta: 'الرياض',
  },
  {
    type: 'onboarded',
    ar: 'تسجيل ٣٢ شركة ناشئة على منصّة سَفِي',
    en: '32 startups onboarded on Savvy platform',
    partner: "Monsha'at",
    ago: 'قبل ٦ ساعات',
    ar_meta: 'الرياض',
  },
  {
    type: 'deployment',
    ar: 'استلام وحدة Go2 لمنصّة العروض الميدانية',
    en: 'Go2 unit received for field demos',
    partner: 'TAQNIA',
    ago: 'أمس',
    ar_meta: 'الرياض',
  },
  {
    type: 'training',
    ar: 'ورشة عمل للمسرّعات حول تطبيقات الروبوتات',
    en: 'Accelerator workshop on robotics applications',
    partner: 'Falak Accelerator',
    ago: 'قبل ٣ أيام',
    ar_meta: 'الرياض',
  },
]

const FEED_ICON = {
  deployment: Bot,
  training: GraduationCap,
  alert: ShieldCheck,
  onboarded: Sparkles,
} as const

const FEED_TINT = {
  deployment: 'text-[--color-admiral-glow]',
  training: 'text-[--color-info]',
  alert: 'text-[--color-good]',
  onboarded: 'text-[--color-gold]',
} as const

function acronymOf(en: string): string {
  return en
    .split(' ')
    .filter((w) => /[A-Z]/.test(w[0] ?? ''))
    .map((w) => w[0])
    .slice(0, 3)
    .join('')
}

function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const w = 100
  const h = 28
  const max = Math.max(...values, 1)
  const min = Math.min(...values)
  const range = Math.max(max - min, 1)
  const stepX = w / (values.length - 1)
  const pts = values.map((v, i) => `${i * stepX},${h - ((v - min) / range) * h}`).join(' ')
  const area = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn('w-full', className)}>
      <defs>
        <linearGradient id="spark-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(78,163,255,0.32)" />
          <stop offset="100%" stopColor="rgba(78,163,255,0)" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#spark-fade)" />
      <polyline
        points={pts}
        fill="none"
        stroke="#4ea3ff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function KpiCard({
  ar,
  en,
  value,
  hint,
  icon: Icon,
  tint,
}: {
  ar: string
  en: string
  value: string
  hint: string
  icon: typeof Bot
  tint: string
}) {
  return (
    <div className="glass-card glass-card-hover col-span-12 p-4 transition-transform sm:col-span-6 lg:col-span-3 hover:-translate-y-0.5 hover:border-[rgba(78,163,255,0.4)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-bold text-[--color-ink-2]">{ar}</div>
          <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            {en}
          </div>
        </div>
        <div className={cn('grid h-9 w-9 place-items-center rounded-xl border border-[--color-line] bg-black/30', tint)}>
          <Icon size={15} />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-en text-[28px] font-black tabular-nums leading-none text-[--color-ink]">
          {value}
        </div>
      </div>
      <div className="mt-1.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
        {hint}
      </div>
    </div>
  )
}

function ProjectCard({ p }: { p: Project }) {
  const meta = PROJECT_META[p.en]
  const onlinePct = (p.online / p.robots) * 100
  const BadgeIcon = BADGE_ICON[p.badge]
  const badge = BADGE_LABEL[p.badge]
  const acr = acronymOf(p.en)
  return (
    <article className="glass-card group col-span-12 overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:border-[rgba(78,163,255,0.4)] hover:shadow-[0_0_28px_rgba(78,163,255,0.12)] lg:col-span-6">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/55 to-[#003d82]/15 font-en text-[15px] font-extrabold text-[--color-ink] shadow-[0_0_22px_rgba(78,163,255,0.18)_inset]">
          {acr}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-extrabold leading-tight text-[--color-ink]">
                {p.ar}
              </h3>
              <div className="mt-0.5 truncate font-en text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[--color-muted]">
                {p.en}
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[--color-line] bg-white/[0.03] px-2 py-1 text-[10.5px] font-bold text-[--color-ink-2]">
              <BadgeIcon size={11} className="text-[--color-admiral-glow]" />
              {badge.ar}
            </span>
          </div>
          {meta && (
            <div className="mt-2 inline-flex items-center gap-1 font-en text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
              <MapPin size={11} className="text-[--color-admiral-glow]" />
              {meta.city.ar} · {meta.city.en}
            </div>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
          <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
            Online / Total
          </div>
          <div className="mt-1 inline-flex items-center gap-1.5 font-en text-[15px] font-extrabold tabular-nums text-[--color-ink]">
            <Bot size={13} className="text-[--color-admiral-glow]" />
            {p.online}/{p.robots}
          </div>
        </div>
        <div className="rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
          <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
            Alerts
          </div>
          <div
            className={cn(
              'mt-1 inline-flex items-center gap-1.5 font-en text-[15px] font-extrabold tabular-nums',
              p.alerts > 0 ? 'text-[--color-warn]' : 'text-[--color-good]',
            )}
          >
            {p.alerts > 0 ? <AlertCircle size={13} /> : <ShieldCheck size={13} />}
            {p.alerts > 0 ? p.alerts : 'OK'}
          </div>
        </div>
        <div className="rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
          <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
            Health
          </div>
          <div className="mt-1 font-en text-[15px] font-extrabold tabular-nums text-[--color-ink]">
            {Math.round(onlinePct)}%
          </div>
        </div>
      </div>

      {/* Health bar */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[--color-admiral] to-[--color-admiral-glow] transition-[width] duration-700 ease-out"
          style={{ width: `${onlinePct}%`, boxShadow: '0 0 14px rgba(78,163,255,0.4)' }}
        />
      </div>

      {/* Contact + dates */}
      {meta && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[--color-line] bg-white/[0.02] px-3 py-2.5">
            <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
              Primary contact
            </div>
            <div className="mt-1 truncate text-[12px] font-extrabold text-[--color-ink]">{meta.contactAr}</div>
            <div className="truncate text-[11px] text-[--color-ink-2]">{meta.contactRole}</div>
            <div className="mt-1 inline-flex items-center gap-1 font-en text-[10px] font-semibold tabular-nums text-[--color-muted]">
              <Phone size={10} className="text-[--color-admiral-glow]" />
              {meta.phone}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="rounded-xl border border-[--color-line] bg-white/[0.02] px-3 py-2">
              <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                Deployment date
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 font-en text-[12px] font-bold tabular-nums text-[--color-ink]">
                <Calendar size={11} className="text-[--color-admiral-glow]" />
                {meta.deployedAr}
              </div>
            </div>
            <div className="rounded-xl border border-[--color-line] bg-white/[0.02] px-3 py-2">
              <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                Last activity
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] font-bold text-[--color-ink]">
                <Activity size={11} className="text-[--color-admiral-glow]" />
                {meta.lastActivityAr}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent activity timeline */}
      {meta && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[12px] font-bold text-[--color-ink]">النشاط الأخير</div>
            <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
              Recent activity
            </div>
          </div>
          <ul className="flex flex-col">
            {meta.timeline.map((t, i) => (
              <li key={i} className="relative flex items-start gap-2.5 py-1.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[--color-admiral-glow] shadow-[0_0_8px_rgba(78,163,255,0.6)]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11.5px] font-semibold text-[--color-ink]">{t.ar}</div>
                  <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                    {t.en}
                  </div>
                </div>
                <div className="font-en text-[10px] font-semibold tabular-nums text-[--color-muted]">
                  {t.ago}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sparkline */}
      {meta && (
        <div className="mt-4 rounded-xl border border-[--color-line] bg-black/30 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
              Activity · 30d
            </div>
            <div className="font-en text-[10px] font-bold tabular-nums text-[--color-admiral-glow]">
              +{Math.round(((meta.spark[meta.spark.length - 1] ?? 0) - (meta.spark[0] ?? 0)) * 4)}%
            </div>
          </div>
          <Sparkline values={meta.spark} className="h-8" />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 px-3 py-2 text-[12px] font-bold text-[--color-ink] transition-shadow hover:shadow-[0_0_18px_rgba(78,163,255,0.28)]">
          عرض التفاصيل
          <ChevronLeft size={13} className="text-[--color-admiral-glow]" />
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2 text-[12px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
          فتح اللوحة
          <ArrowUpRight size={13} />
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2 text-[12px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
          <Phone size={12} />
          تواصل
        </button>
      </div>
    </article>
  )
}

export function ProjectsPage() {
  const [filter, setFilter] = useState<FilterKey>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.badge === filter)),
    [filter],
  )

  // Build map pins from project metadata.
  const pins: RobotPin[] = useMemo(
    () =>
      PROJECTS.map((p, i) => {
        const meta = PROJECT_META[p.en]
        if (!meta) return null
        // Slight x/y offset per project to avoid overlap when several share Riyadh.
        const offsetX = ((i % 3) - 1) * 1.6
        const offsetY = (Math.floor(i / 3) - 1) * 1.6
        return {
          id: `prj-${p.en}`,
          city: meta.city.ar,
          x: meta.pin.x + offsetX,
          y: meta.pin.y + offsetY,
          status: meta.pin.status,
          battery: meta.pin.status === 'offline' ? 0 : meta.pin.status === 'warn' ? 32 : 86,
        }
      }).filter((x): x is RobotPin => x !== null),
    [],
  )

  return (
    <PageShell
      active="projects"
      ar="المشاريع والشركاء"
      en="Projects & Partners"
      icon={Building2}
      description="عرض كامل لمحفظة شركاء Savvy World — جامعات، جهات حكومية، ومسرّعات أعمال — مع حالة النشر والتنبيهات الحيّة."
    >
      {/* KPI strip */}
      <div className="grid grid-cols-12 gap-3">
        <KpiCard
          ar="إجمالي المشاريع"
          en="Total Projects"
          value="6"
          hint="ACTIVE PARTNERS"
          icon={Building2}
          tint="text-[--color-admiral-glow]"
        />
        <KpiCard
          ar="روبوتات منشورة"
          en="Robots Deployed"
          value="10"
          hint="ACROSS 4 CITIES"
          icon={Bot}
          tint="text-[--color-admiral-glow]"
        />
        <KpiCard
          ar="متصل الآن"
          en="Online Now"
          value="8"
          hint="80% UPTIME"
          icon={Activity}
          tint="text-[--color-good]"
        />
        <KpiCard
          ar="تنبيهات نشطة"
          en="Active Alerts"
          value="3"
          hint="REQUIRES ATTENTION"
          icon={AlertCircle}
          tint="text-[--color-warn]"
        />
      </div>

      {/* Map + Spotlight row */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        <section className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-7">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[--color-ink]">خريطة الشركاء</h2>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Partner footprint · KSA
              </div>
            </div>
            <div className="inline-flex items-center gap-3 font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" /> Online
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#f5a524]" /> Warn
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#7a86a8]" /> Offline
              </span>
            </div>
          </div>
          <div className="hairline mb-3" />
          <div className="relative aspect-[5/4] w-full">
            <SaudiMap pins={pins} showCities className="absolute inset-0 h-full w-full" />
          </div>
        </section>

        {/* Spotlight: KACST */}
        <section className="glass-card relative col-span-12 overflow-hidden p-0 lg:col-span-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <img
              src="/robots/g1.jpg"
              alt="KACST · Featured partner"
              className="h-full w-full object-cover object-center"
              style={{ filter: 'saturate(1.05) contrast(1.05)' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,8,19,0.20) 0%, rgba(5,8,19,0.55) 60%, rgba(5,8,19,0.92) 100%)',
              }}
            />
            <div className="absolute inset-inline-0 top-0 flex items-start justify-between p-4">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(78,163,255,0.3)] bg-black/40 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow] backdrop-blur">
                <Sparkles size={10} />
                Featured partner
              </span>
              <span className="rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-ink-2] backdrop-blur">
                Riyadh · KSA
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
              Spotlight · KACST
            </div>
            <h2 className="mt-1 text-[20px] font-black leading-tight text-[--color-ink]">
              مدينة الملك عبدالعزيز للعلوم والتقنية
              <span className="ms-2 align-middle font-en text-[12px] font-semibold uppercase tracking-[0.16em] text-[--color-muted]">
                KACST
              </span>
            </h2>
            <p className="mt-2 max-w-[420px] text-[12.5px] leading-relaxed text-[--color-ink-2]">
              شريك حكومي رئيسي — وحدتان من G1 منشورتان داخل مختبرات الذكاء الاصطناعي مع تكامل كامل مع منصّة سَفِي.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
                <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                  Robots
                </div>
                <div className="mt-1 font-en text-[16px] font-extrabold tabular-nums text-[--color-ink]">2</div>
              </div>
              <div className="rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
                <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                  Online
                </div>
                <div className="mt-1 font-en text-[16px] font-extrabold tabular-nums text-[--color-good]">1</div>
              </div>
              <div className="rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
                <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                  Milestone
                </div>
                <div className="mt-1 text-[12px] font-extrabold text-[--color-ink]">v3.4 مدمج</div>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-[rgba(78,163,255,0.18)] bg-[#0a3a7e]/15 px-3 py-2.5">
              <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
                Key milestone
              </div>
              <div className="mt-0.5 text-[12.5px] font-bold leading-snug text-[--color-ink]">
                إطلاق برنامج تدريب وطني على الروبوتات الإنسانية بحلول الربع الثالث ٢٠٢٦.
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.32)] bg-gradient-to-br from-[#0a3a7e]/45 to-[#003d82]/15 px-3 py-2 text-[12px] font-bold text-[--color-ink] transition-shadow hover:shadow-[0_0_18px_rgba(78,163,255,0.28)]">
                <PlayCircle size={13} className="text-[--color-admiral-glow]" />
                استعراض الشراكة
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2 text-[12px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                <Wrench size={12} />
                إدارة الوحدات
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Filter row */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-bold transition-colors',
                  active
                    ? 'border-[rgba(78,163,255,0.45)] bg-gradient-to-br from-[#0a3a7e]/55 to-[#003d82]/15 text-[--color-ink] shadow-[0_0_18px_rgba(78,163,255,0.18)]'
                    : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)] hover:text-[--color-ink]',
                )}
              >
                {f.ar}
                <span
                  className={cn(
                    'font-en text-[9.5px] font-semibold uppercase tracking-[0.14em]',
                    active ? 'text-[--color-admiral-glow]' : 'text-[--color-faint]',
                  )}
                >
                  {f.en}
                </span>
              </button>
            )
          })}
        </div>
        <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
          {filtered.length} of {PROJECTS.length} partners
        </div>
      </div>

      {/* Project cards grid */}
      <div className="mt-3 grid grid-cols-12 gap-3">
        {filtered.map((p) => (
          <ProjectCard key={p.en} p={p} />
        ))}
      </div>

      {/* Partner activity feed */}
      <section className="mt-3 grid grid-cols-12 gap-3">
        <div className="glass-card col-span-12 p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                <Users size={15} />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">نشاط الشركاء الأخير</h2>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Recent partner activity · last 7 days
                </div>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-1.5 text-[11px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
              عرض الكل
              <ChevronLeft size={12} />
            </button>
          </div>
          <div className="hairline mb-2" />
          <ul className="flex flex-col">
            {PARTNER_FEED.map((f, i) => {
              const Icon = FEED_ICON[f.type]
              return (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-3 py-3 transition-colors hover:bg-white/[0.02]',
                    i !== PARTNER_FEED.length - 1 && 'border-b border-[--color-line]',
                  )}
                >
                  <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[--color-line] bg-black/30', FEED_TINT[f.type])}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-bold text-[--color-ink]">{f.ar}</div>
                    <div className="mt-0.5 font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                      {f.en}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 text-[10.5px] text-[--color-muted]">
                      <span className="rounded-md border border-[--color-line] bg-white/[0.02] px-1.5 py-0.5 font-en font-bold text-[--color-ink-2]">
                        {f.partner}
                      </span>
                      {f.ar_meta && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={10} className="text-[--color-admiral-glow]" />
                          {f.ar_meta}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 font-en text-[10.5px] font-semibold tabular-nums text-[--color-muted]">
                    {f.ago}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </PageShell>
  )
}
