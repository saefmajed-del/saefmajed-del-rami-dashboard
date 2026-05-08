import { useState, type ComponentType } from 'react'
import {
  Shirt,
  Palette,
  Save,
  Download,
  RefreshCw,
  Eye,
  Layers,
  Type,
  Copy,
  Check,
  X,
  Glasses,
  Watch,
  Footprints,
  HardHat,
  Crown,
  ShieldCheck,
} from 'lucide-react'
import { PageShell } from '@/pages-detail/_PageShell'
import { UnitreeG1 } from '@/home/parts/UnitreeG1'
import { UnitreeR1 } from '@/home/parts/UnitreeR1'
import { UnitreeGo2 } from '@/home/parts/UnitreeGo2'
import { SavvyLogo } from '@/home/SavvyLogo'
import { cn } from '@/lib/utils'

interface Model {
  id: 'g1' | 'r1' | 'go2'
  ar: string
  en: string
  spec: string
  polys: string
  Component: ComponentType<{ className?: string }>
}

const MODELS: Model[] = [
  { id: 'g1', ar: 'يونيتري G1', en: 'Unitree G1', spec: 'Humanoid · 1.30m · 29-DOF', polys: '184k', Component: UnitreeG1 },
  { id: 'r1', ar: 'يونيتري R1', en: 'Unitree R1', spec: 'Humanoid · Concept · 32-DOF', polys: '212k', Component: UnitreeR1 },
  { id: 'go2', ar: 'يونيتري Go2', en: 'Unitree Go2', spec: 'Quadruped · 15kg · 3.7m/s', polys: '96k', Component: UnitreeGo2 },
]

const KPIS = [
  { ar: 'قوالب محفوظة', en: 'Templates saved', value: '12', delta: '+3 هذا الأسبوع', good: true },
  { ar: 'هويات نشطة', en: 'Active brand kits', value: '3', delta: 'Aramco · NEOM · Riyadh', good: true },
  { ar: 'الالتزام بالهوية', en: 'Compliance', value: '98%', delta: '+2.4 vs آخر شهر', good: true },
  { ar: 'آخر تطبيق', en: 'Last applied', value: 'قبل ساعة', delta: 'KSU labs kit · G1', good: true },
]

const APPAREL: { id: string; ar: string; en: string; icon: ComponentType<{ size?: number; className?: string }>; on: boolean }[] = [
  { id: 'hoodie', ar: 'هودي', en: 'Hoodie', icon: Shirt, on: true },
  { id: 'tshirt', ar: 'تيشيرت', en: 'T-Shirt', icon: Shirt, on: false },
  { id: 'jacket', ar: 'جاكيت', en: 'Jacket', icon: Shirt, on: true },
  { id: 'cap', ar: 'كاب', en: 'Cap', icon: Crown, on: true },
  { id: 'glasses', ar: 'نظارة', en: 'Glasses', icon: Glasses, on: false },
  { id: 'watch', ar: 'ساعة', en: 'Watch', icon: Watch, on: false },
  { id: 'shoes', ar: 'حذاء', en: 'Shoes', icon: Footprints, on: true },
  { id: 'helmet', ar: 'خوذة عمل', en: 'Hard Hat', icon: HardHat, on: false },
]

const PALETTES: { name: string; en: string; colors: string[] }[] = [
  { name: 'Admiral', en: 'Savvy Admiral', colors: ['#003d82', '#0057b7', '#4ea3ff', '#0a1330', '#dadada', '#ffffff'] },
  { name: 'Aramco', en: 'Aramco Energy', colors: ['#00833e', '#006b33', '#f4c20d', '#0a0a0a', '#ffffff', '#cfd8dc'] },
  { name: 'NEOM', en: 'NEOM Future', colors: ['#5a3fff', '#9b87ff', '#ff7adb', '#0a0a0a', '#1a1a2e', '#ffffff'] },
  { name: 'Riyadh', en: 'Riyadh Season', colors: ['#7a1a3a', '#c2185b', '#f5a524', '#0a0a0a', '#dadada', '#ffffff'] },
]

const ZONES = [
  { id: 'chest', ar: 'الصدر', en: 'Chest', on: true },
  { id: 'back', ar: 'الظهر', en: 'Back', on: true },
  { id: 'arm-l', ar: 'الذراع اليسرى', en: 'Left Arm', on: false },
  { id: 'arm-r', ar: 'الذراع اليمنى', en: 'Right Arm', on: true },
  { id: 'cap', ar: 'الكاب', en: 'Cap', on: true },
  { id: 'shoes', ar: 'الحذاء', en: 'Shoes', on: false },
]

const TEMPLATES = [
  { name: 'Aramco kit', ar: 'هوية أرامكو', applied: 14, model: 'g1' as const, accent: '#00833e' },
  { name: 'NEOM kit', ar: 'هوية نيوم', applied: 9, model: 'r1' as const, accent: '#5a3fff' },
  { name: 'Riyadh Season', ar: 'موسم الرياض', applied: 22, model: 'g1' as const, accent: '#c2185b' },
  { name: 'KSU labs kit', ar: 'مختبرات الملك سعود', applied: 6, model: 'go2' as const, accent: '#0a3a7e' },
  { name: 'Savvy Hub', ar: 'هاب سافي', applied: 31, model: 'g1' as const, accent: '#0057b7' },
  { name: 'Diriyah Gate', ar: 'بوابة الدرعية', applied: 4, model: 'r1' as const, accent: '#7a1a3a' },
  { name: 'STC pavilion', ar: 'جناح STC', applied: 11, model: 'go2' as const, accent: '#5a3fff' },
  { name: 'KAUST research', ar: 'كاوست أبحاث', applied: 7, model: 'g1' as const, accent: '#0f4c5c' },
]

const COMPLIANCE_ROWS = [
  { time: '٠٩:٤٢', kit: 'Aramco kit', robot: 'G1-014', score: 99, status: 'pass' as const },
  { time: '٠٩:٢٠', kit: 'Riyadh Season', robot: 'G1-022', score: 97, status: 'pass' as const },
  { time: '٠٨:٥٨', kit: 'NEOM kit', robot: 'R1-003', score: 94, status: 'pass' as const },
  { time: '٠٨:٣١', kit: 'KSU labs kit', robot: 'Go2-009', score: 88, status: 'warn' as const },
  { time: '٠٧:٥٥', kit: 'Diriyah Gate', robot: 'G1-006', score: 76, status: 'fail' as const },
  { time: '٠٧:٢٠', kit: 'Savvy Hub', robot: 'G1-001', score: 100, status: 'pass' as const },
]

const VIEWS = [
  { id: 'front', ar: 'أمامي', en: 'Front' },
  { id: '3q', ar: '٣/٤', en: '3-Quarter' },
  { id: 'side', ar: 'جانبي', en: 'Side' },
] as const

const RENDER_MODES = [
  { id: 'realistic', ar: 'واقعي', en: 'Realistic' },
  { id: 'schematic', ar: 'تخطيطي', en: 'Schematic' },
] as const

const DOS = [
  'استخدم Admiral Blue للوحدات الرئيسية فقط',
  'حافظ على هامش لا يقل عن 24px حول الشعار',
  'الخلفيات الداكنة تتطلب نسخة Savvy البيضاء',
]
const DONTS = [
  'لا تغيّر لون "vv" أبداً — يبقى أزرق Admiral',
  'لا تطبّق ألوان فاقعة على ٢٥٪ من الجسم',
  'لا تجمع شعارين مع بعض على نفس المنطقة',
]

export function BrandPage() {
  const [activeId, setActiveId] = useState<Model['id']>('g1')
  const [renderMode, setRenderMode] = useState<typeof RENDER_MODES[number]['id']>('realistic')
  const [view, setView] = useState<typeof VIEWS[number]['id']>('3q')
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [apparel, setApparel] = useState<Record<string, boolean>>(
    Object.fromEntries(APPAREL.map((a) => [a.id, a.on])),
  )
  const [zones, setZones] = useState<Record<string, boolean>>(
    Object.fromEntries(ZONES.map((z) => [z.id, z.on])),
  )
  const [logoScale, setLogoScale] = useState(60)

  const active = MODELS.find((m) => m.id === activeId)!
  const ActiveRender = active.Component
  const palette = PALETTES[paletteIdx]

  return (
    <PageShell
      active="brand"
      ar="بناء هوية العلامة التجارية"
      en="Brand & Identity Studio"
      icon={Shirt}
      description="استوديو Nike By You للروبوتات — كسوة، ألوان، شعارات، وضوابط هوية بصرية كاملة لكل سفير من أسطول Savvy World."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.3)] bg-gradient-to-l from-[#0a3a7e]/40 to-[#003d82]/15 px-3 py-2 text-[12px] font-bold text-[--color-ink] hover:shadow-[0_0_24px_rgba(78,163,255,0.25)]">
          <Download size={12} />
          تصدير PDF
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-3">
        {/* ============== KPIs ============== */}
        {KPIS.map((k) => (
          <div key={k.en} className="glass-card col-span-6 p-4 lg:col-span-3">
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              {k.en}
            </div>
            <div className="mt-1 text-[13px] font-bold text-[--color-ink]">{k.ar}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-en text-[26px] font-black tabular-nums text-[--color-ink]">
                {k.value}
              </span>
            </div>
            <div className="mt-1 text-[11px] font-semibold text-[--color-good]">{k.delta}</div>
          </div>
        ))}

        {/* ============== Robot Model Picker ============== */}
        <div className="glass-card col-span-12 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Robot model
              </div>
              <h2 className="mt-0.5 text-[15px] font-extrabold text-[--color-ink]">اختر الروبوت</h2>
            </div>
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
              3 platforms · {active.en}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {MODELS.map((m) => {
              const Render = m.Component
              const selected = m.id === activeId
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveId(m.id)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border text-start transition-all',
                    selected
                      ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/10 shadow-[0_0_28px_rgba(78,163,255,0.18)]'
                      : 'border-[--color-line] bg-black/30 hover:border-[rgba(78,163,255,0.28)]',
                  )}
                >
                  <div className="relative h-[180px] w-full overflow-hidden bg-gradient-to-b from-[#0a1330] via-[#050813] to-[#040611]">
                    <Render className="h-full w-full" />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-extrabold text-[--color-ink]">{m.ar}</div>
                      <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                        {m.en} · {m.spec}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'grid h-6 w-6 shrink-0 place-items-center rounded-full border',
                        selected
                          ? 'border-[--color-admiral-glow] bg-[--color-admiral-glow]/15 text-[--color-admiral-glow]'
                          : 'border-[--color-line] text-[--color-muted]',
                      )}
                    >
                      {selected ? <Check size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-[--color-muted]/60" />}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============== Hero render ============== */}
        <section className="glass-card col-span-12 overflow-hidden p-4 lg:col-span-7">
          <div className="relative h-[480px] overflow-hidden rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] via-[#050813] to-[#040611]">
            {/* studio backdrop */}
            <svg
              viewBox="0 0 200 220"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <radialGradient id="brand-spot" cx="0.5" cy="0.4" r="0.6">
                  <stop offset="0%" stopColor="rgba(78,163,255,0.22)" />
                  <stop offset="100%" stopColor="rgba(78,163,255,0)" />
                </radialGradient>
              </defs>
              <rect width="200" height="220" fill="url(#brand-spot)" />
              <ellipse cx="100" cy="208" rx="78" ry="6" fill="rgba(78,163,255,0.08)" />
              <ellipse
                cx="100"
                cy="208"
                rx="78"
                ry="6"
                fill="none"
                stroke="rgba(78,163,255,0.25)"
                strokeWidth="0.4"
                strokeDasharray="2 4"
              />
            </svg>

            {/* photo */}
            <div className="absolute inset-0">
              <ActiveRender className="h-full w-full" />
              {renderMode === 'schematic' && (
                <div className="pointer-events-none absolute inset-0 bg-[#050813]/55 mix-blend-multiply" />
              )}
            </div>

            {/* top-left HUD: model id + polys */}
            <div className="absolute start-3 top-3 flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/55 px-2 py-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
                <span className="font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-ink]">
                  ID · {active.en.replace('Unitree ', '').toUpperCase()}-014
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/55 px-2 py-1 backdrop-blur-md">
                <Layers size={11} className="text-[--color-faint]" />
                <span className="font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                  {active.polys} polys
                </span>
              </div>
            </div>

            {/* top-right HUD: render mode toggle */}
            <div className="absolute end-3 top-3 inline-flex overflow-hidden rounded-lg border border-[--color-line] bg-black/55 backdrop-blur-md">
              {RENDER_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setRenderMode(m.id)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 font-en text-[10px] font-bold uppercase tracking-[0.18em] transition-colors',
                    renderMode === m.id
                      ? 'bg-[--color-admiral]/25 text-[--color-admiral-glow]'
                      : 'text-[--color-faint] hover:text-[--color-ink]',
                  )}
                >
                  <Eye size={11} />
                  {m.en}
                </button>
              ))}
            </div>

            {/* bottom-left badge */}
            <div className="absolute bottom-3 start-3 rounded-xl border border-[--color-line] bg-black/55 px-3 py-2 backdrop-blur-md">
              <div className="text-[12px] font-extrabold text-[--color-ink]">{active.ar}</div>
              <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                {active.spec}
              </div>
            </div>

            {/* bottom-right view selector */}
            <div className="absolute bottom-3 end-3 inline-flex overflow-hidden rounded-lg border border-[--color-line] bg-black/55 backdrop-blur-md">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={cn(
                    'px-2.5 py-1 font-en text-[10px] font-bold uppercase tracking-[0.18em] transition-colors',
                    view === v.id
                      ? 'bg-[--color-admiral]/25 text-[--color-admiral-glow]'
                      : 'text-[--color-faint] hover:text-[--color-ink]',
                  )}
                >
                  {v.en}
                </button>
              ))}
            </div>

            {/* applied palette strip */}
            <div className="absolute inset-x-3 bottom-[68px] flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/55 px-2 py-1.5 backdrop-blur-md">
              <span className="font-en text-[9.5px] font-bold uppercase tracking-[0.2em] text-[--color-faint]">
                Palette
              </span>
              <div className="flex flex-1 items-center gap-1">
                {palette.colors.map((c) => (
                  <span
                    key={c}
                    className="h-3.5 flex-1 rounded-sm"
                    style={{ background: c, boxShadow: `0 0 10px ${c}55` }}
                  />
                ))}
              </div>
              <span className="font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-ink]">
                {palette.name}
              </span>
            </div>
          </div>
        </section>

        {/* ============== Customization panels ============== */}
        <aside className="col-span-12 flex flex-col gap-3 lg:col-span-5">
          {/* Apparel */}
          <div className="glass-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                  Apparel
                </div>
                <h3 className="mt-0.5 text-[13px] font-extrabold text-[--color-ink]">الكسوة</h3>
              </div>
              <span className="font-en text-[10px] font-bold tabular-nums text-[--color-admiral-glow]">
                {Object.values(apparel).filter(Boolean).length}/{APPAREL.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {APPAREL.map((a) => {
                const Icon = a.icon
                const on = apparel[a.id]
                return (
                  <button
                    key={a.id}
                    onClick={() => setApparel((p) => ({ ...p, [a.id]: !p[a.id] }))}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-2.5 py-2 text-start transition-all',
                      on
                        ? 'border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/10'
                        : 'border-[--color-line] bg-white/[0.02] hover:border-[rgba(78,163,255,0.22)]',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-7 w-7 shrink-0 place-items-center rounded-lg border',
                        on
                          ? 'border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 text-[--color-admiral-glow]'
                          : 'border-[--color-line] bg-black/30 text-[--color-faint]',
                      )}
                    >
                      <Icon size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-bold text-[--color-ink]">{a.ar}</div>
                      <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                        {a.en}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'font-en text-[9.5px] font-extrabold uppercase tracking-[0.18em]',
                        on ? 'text-[--color-admiral-glow]' : 'text-[--color-muted]',
                      )}
                    >
                      {on ? 'ON' : 'OFF'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color palettes */}
          <div className="glass-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                  Color palettes
                </div>
                <h3 className="mt-0.5 text-[13px] font-extrabold text-[--color-ink]">لوحات الألوان</h3>
              </div>
              <Palette size={13} className="text-[--color-faint]" />
            </div>
            <div className="flex flex-col gap-1.5">
              {PALETTES.map((p, i) => {
                const selected = i === paletteIdx
                return (
                  <button
                    key={p.name}
                    onClick={() => setPaletteIdx(i)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border p-2 transition-all',
                      selected
                        ? 'border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/10'
                        : 'border-[--color-line] bg-white/[0.02] hover:border-[rgba(78,163,255,0.22)]',
                    )}
                  >
                    <div className="flex flex-1 items-center gap-1">
                      {p.colors.map((c) => (
                        <span
                          key={c}
                          className="h-6 flex-1 rounded-md"
                          style={{ background: c, boxShadow: `0 0 10px ${c}55` }}
                        />
                      ))}
                    </div>
                    <div className="min-w-[88px] text-end">
                      <div className="text-[12px] font-bold text-[--color-ink]">{p.name}</div>
                      <div className="font-en text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                        {p.en}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Logo placement */}
          <div className="glass-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                  Logo placement
                </div>
                <h3 className="mt-0.5 text-[13px] font-extrabold text-[--color-ink]">مواضع الشعار</h3>
              </div>
              <span className="font-en text-[10px] font-bold tabular-nums text-[--color-admiral-glow]">
                {Object.values(zones).filter(Boolean).length}/6
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {ZONES.map((z) => {
                const on = zones[z.id]
                return (
                  <button
                    key={z.id}
                    onClick={() => setZones((p) => ({ ...p, [z.id]: !p[z.id] }))}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-xl border p-2 text-start transition-all',
                      on
                        ? 'border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/10'
                        : 'border-[--color-line] bg-white/[0.02] hover:border-[rgba(78,163,255,0.22)]',
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="text-[11px] font-bold text-[--color-ink]">{z.ar}</div>
                      <span
                        className={cn(
                          'grid h-4 w-4 place-items-center rounded border',
                          on
                            ? 'border-[--color-admiral-glow] bg-[--color-admiral]/30 text-[--color-admiral-glow]'
                            : 'border-[--color-line]',
                        )}
                      >
                        {on && <Check size={10} />}
                      </span>
                    </div>
                    <div className="font-en text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                      {z.en}
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 rounded-xl border border-[--color-line] bg-black/30 p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Logo scale
                </span>
                <span className="font-en text-[11px] font-extrabold tabular-nums text-[--color-admiral-glow]">
                  {logoScale}%
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={logoScale}
                onChange={(e) => setLogoScale(Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[--color-line] accent-[--color-admiral-glow]"
              />
            </div>
          </div>

          {/* Logo lock */}
          <div className="glass-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                  Logo lock
                </div>
                <h3 className="mt-0.5 text-[13px] font-extrabold text-[--color-ink]">قفل الشعار</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(78,163,255,0.3)] bg-[--color-admiral]/10 px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
                <ShieldCheck size={10} />
                Locked
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[--color-line] bg-black/30 p-3">
              <div className="grid h-16 w-24 shrink-0 place-items-center rounded-lg border border-[--color-line] bg-[#050813]">
                <SavvyLogo height={28} variant="dark" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold leading-snug text-[--color-ink]">
                  ONLY <span className="font-en text-[--color-admiral-glow]">"vv"</span> is Admiral Blue
                </div>
                <div className="mt-0.5 text-[11px] leading-snug text-[--color-ink-2]">
                  باقي الشعار يبقى أبيض على الخلفيات الداكنة وأسود على الفاتحة. لا تعديل، لا تدوير، لا تلوين.
                </div>
              </div>
            </div>
          </div>

          {/* Action bar (sticky inside customization column) */}
          <div className="glass-card sticky bottom-3 grid grid-cols-2 gap-2 p-3 backdrop-blur-md md:grid-cols-4">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.35)] bg-gradient-to-l from-[#0a3a7e]/40 to-[#003d82]/15 px-3 py-2 text-[12px] font-bold text-[--color-ink] hover:shadow-[0_0_20px_rgba(78,163,255,0.25)]">
              <Save size={12} />
              حفظ القالب
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[--color-good]/30 bg-[--color-good]/10 px-3 py-2 text-[12px] font-bold text-[--color-good] hover:shadow-[0_0_18px_rgba(34,197,94,0.18)]">
              <Check size={12} />
              تطبيق على الروبوت
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2 text-[12px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)] hover:text-[--color-ink]">
              <RefreshCw size={12} />
              إعادة تعيين
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2 text-[12px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)] hover:text-[--color-ink]">
              <Download size={12} />
              تصدير PDF
            </button>
          </div>
        </aside>

        {/* ============== Saved templates strip ============== */}
        <section className="glass-card col-span-12 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Saved templates
              </div>
              <h3 className="mt-0.5 text-[14px] font-extrabold text-[--color-ink]">القوالب المحفوظة</h3>
            </div>
            <span className="font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
              {TEMPLATES.length} kits · scroll →
            </span>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {TEMPLATES.map((t) => {
              const Render = MODELS.find((m) => m.id === t.model)!.Component
              return (
                <button
                  key={t.name}
                  className="group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[--color-line] bg-black/30 text-start transition-all hover:border-[rgba(78,163,255,0.32)] hover:shadow-[0_0_22px_rgba(78,163,255,0.18)]"
                >
                  <div className="relative h-[110px] w-full overflow-hidden bg-gradient-to-b from-[#0a1330] via-[#050813] to-[#040611]">
                    <Render className="h-full w-full" />
                    <span
                      className="absolute end-2 top-2 h-2.5 w-2.5 rounded-full"
                      style={{ background: t.accent, boxShadow: `0 0 10px ${t.accent}` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-extrabold text-[--color-ink]">{t.ar}</div>
                      <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                        {t.name}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="font-en text-[12px] font-black tabular-nums text-[--color-admiral-glow]">
                        {t.applied}
                      </div>
                      <div className="font-en text-[8.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                        applied
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ============== Brand guidelines ============== */}
        <section className="glass-card col-span-12 p-5 lg:col-span-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
              <Type size={15} />
            </div>
            <div>
              <h3 className="text-[14px] font-extrabold text-[--color-ink]">دليل الهوية البصرية</h3>
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Brand guidelines · Savvy World
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="rounded-xl border border-[--color-line] bg-black/30 p-3">
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              Typography
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div>
                <div className="text-[18px] font-black text-[--color-ink]">تجوال</div>
                <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                  Tajawal · AR Display
                </div>
              </div>
              <div>
                <div className="text-[18px] font-black text-[--color-ink]">بليكس</div>
                <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                  IBM Plex Sans AR · Body
                </div>
              </div>
              <div>
                <div className="font-en text-[18px] font-black text-[--color-ink]">Inter</div>
                <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                  Inter · Latin
                </div>
              </div>
            </div>
          </div>

          {/* Color system */}
          <div className="mt-2 rounded-xl border border-[--color-line] bg-black/30 p-3">
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              Color system
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { name: 'Admiral Blue', hex: '#0057b7', tone: 'ink' as const },
                { name: 'Ink', hex: '#050813', tone: 'ink' as const },
                { name: 'Surface', hex: '#dadada', tone: 'dark' as const },
              ].map((c) => (
                <div key={c.name} className="overflow-hidden rounded-lg border border-[--color-line]">
                  <div className="h-10 w-full" style={{ background: c.hex, boxShadow: `inset 0 -1px 0 ${c.hex}88` }} />
                  <div className="px-2 py-1.5">
                    <div className="text-[11px] font-bold text-[--color-ink]">{c.name}</div>
                    <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                      {c.hex}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing + do/don't */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[--color-good]/25 bg-[--color-good]/5 p-3">
              <div className="mb-1.5 inline-flex items-center gap-1 font-en text-[10px] font-bold uppercase tracking-[0.2em] text-[--color-good]">
                <Check size={11} /> Do
              </div>
              <ul className="flex flex-col gap-1">
                {DOS.map((d) => (
                  <li key={d} className="text-[11.5px] leading-snug text-[--color-ink]">
                    · {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[--color-bad]/25 bg-[--color-bad]/5 p-3">
              <div className="mb-1.5 inline-flex items-center gap-1 font-en text-[10px] font-bold uppercase tracking-[0.2em] text-[--color-bad]">
                <X size={11} /> Don't
              </div>
              <ul className="flex flex-col gap-1">
                {DONTS.map((d) => (
                  <li key={d} className="text-[11.5px] leading-snug text-[--color-ink]">
                    · {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Spacing token strip */}
          <div className="mt-2 rounded-xl border border-[--color-line] bg-black/30 p-3">
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              Spacing tokens
            </div>
            <div className="mt-2 flex items-end gap-2">
              {[8, 16, 24, 32, 48, 64].map((s) => (
                <div key={s} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-[--color-admiral]/40"
                    style={{ height: s / 1.5 }}
                  />
                  <div className="font-en text-[9.5px] font-bold tabular-nums text-[--color-faint]">
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== Compliance audit ============== */}
        <section className="glass-card col-span-12 p-5 lg:col-span-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                <ShieldCheck size={15} />
              </div>
              <div>
                <h3 className="text-[14px] font-extrabold text-[--color-ink]">تدقيق الالتزام بالهوية</h3>
                <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Compliance audit · last 6 applications
                </div>
              </div>
            </div>
            <button className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)] hover:text-[--color-ink]">
              <Copy size={11} />
              نسخ
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[--color-line]">
            <div className="grid grid-cols-12 gap-2 border-b border-[--color-line] bg-black/40 px-3 py-2 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
              <div className="col-span-2">Time</div>
              <div className="col-span-4">Kit</div>
              <div className="col-span-3">Robot</div>
              <div className="col-span-2 text-end">Score</div>
              <div className="col-span-1 text-end">St.</div>
            </div>
            <ul>
              {COMPLIANCE_ROWS.map((r, i) => {
                const tone =
                  r.status === 'pass'
                    ? 'text-[--color-good]'
                    : r.status === 'warn'
                      ? 'text-[--color-warn]'
                      : 'text-[--color-bad]'
                const dot =
                  r.status === 'pass'
                    ? 'bg-[--color-good]'
                    : r.status === 'warn'
                      ? 'bg-[--color-warn]'
                      : 'bg-[--color-bad]'
                return (
                  <li
                    key={i}
                    className={cn(
                      'grid grid-cols-12 items-center gap-2 px-3 py-2.5',
                      i !== COMPLIANCE_ROWS.length - 1 && 'border-b border-[--color-line]',
                    )}
                  >
                    <div className="col-span-2 font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">
                      {r.time}
                    </div>
                    <div className="col-span-4 truncate text-[12px] font-bold text-[--color-ink]">
                      {r.kit}
                    </div>
                    <div className="col-span-3 truncate font-en text-[11px] font-semibold tabular-nums text-[--color-ink-2]">
                      {r.robot}
                    </div>
                    <div className="col-span-2 text-end font-en text-[12px] font-black tabular-nums text-[--color-ink]">
                      {r.score}
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <span className={cn('inline-flex items-center gap-1 font-en text-[9.5px] font-extrabold uppercase tracking-[0.16em]', tone)}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
                        {r.status === 'pass' ? 'OK' : r.status === 'warn' ? 'WARN' : 'FAIL'}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-[--color-line] bg-black/30 p-3">
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Pass rate
              </div>
              <div className="mt-1 font-en text-[20px] font-black tabular-nums text-[--color-good]">
                94%
              </div>
            </div>
            <div className="rounded-xl border border-[--color-line] bg-black/30 p-3">
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Avg score
              </div>
              <div className="mt-1 font-en text-[20px] font-black tabular-nums text-[--color-ink]">
                92.3
              </div>
            </div>
            <div className="rounded-xl border border-[--color-line] bg-black/30 p-3">
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Open issues
              </div>
              <div className="mt-1 font-en text-[20px] font-black tabular-nums text-[--color-warn]">
                2
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
