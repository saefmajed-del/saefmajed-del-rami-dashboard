import { useState } from 'react'
import {
  Languages,
  Mic,
  Play,
  Pause,
  Volume2,
  FileAudio,
  Activity,
  Sparkles,
  GitBranch,
  BrainCircuit,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  Database,
  Trophy,
  TrendingUp,
  Upload,
  MessageSquare,
  Server,
  Cpu,
  Gauge,
  Clock,
  AlertTriangle,
  ArrowRight,
  Network,
  Layers,
  ShieldCheck,
  Tag,
  Search,
} from 'lucide-react'
import { PageShell } from './_PageShell'
import { SaudiMap } from '@/home/parts/SaudiMap'
import { Waveform } from '@/home/parts/Waveform'
import { Sparkline } from '@/home/parts/Sparkline'
import { DIALECTS, ROBOT_PINS } from '@/home/data'
import { cn } from '@/lib/utils'

// ---- demo-only deterministic helpers ----------------------------------------------
function corpusHours(seed: number, maturity: number): number {
  // deterministic pseudo-random "K hours" tied to dialect maturity
  const base = 4 + ((seed * 37) % 18)
  return Math.round(base + maturity * 0.6)
}

function lastUpdate(seed: number): string {
  const days = (seed * 11) % 21
  if (days === 0) return 'اليوم'
  if (days === 1) return 'أمس'
  return `قبل ${days} يوم`
}

function statusFromTone(tone?: 'mature' | 'training' | 'planned', maturity = 0) {
  if (tone === 'mature' || (!tone && maturity >= 80))
    return { label: 'ناضج', en: 'Mature', cls: 'border-[--color-good]/30 bg-[--color-good]/12 text-[--color-good]' }
  if (tone === 'planned')
    return { label: 'مخطّط', en: 'Planned', cls: 'border-[--color-faint]/40 bg-white/[0.03] text-[--color-muted]' }
  if (tone === 'training' || maturity < 80)
    return { label: 'تدريب', en: 'Training', cls: 'border-[--color-warn]/30 bg-[--color-warn]/12 text-[--color-warn]' }
  return { label: 'نشط', en: 'Active', cls: 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/12 text-[--color-admiral-glow]' }
}

const KPIS: Array<{
  ar: string
  en: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  hint: string
}> = [
  { ar: 'اللهجات المدعومة', en: 'Supported dialects', value: '16', delta: '+3', trend: 'up', hint: 'إجمالي عبر KSA · MENA · Global' },
  { ar: 'ناضجة', en: 'Mature', value: '5', delta: '+1', trend: 'up', hint: 'دقة ≥ 88%' },
  { ar: 'قيد التدريب', en: 'In training', value: '7', delta: '+2', trend: 'up', hint: 'تجميع + ضبط دقيق' },
  { ar: 'مخطّطة', en: 'Planned', value: '4', delta: '0', trend: 'flat', hint: 'بانتظار البيانات' },
]

const DEFAULT_PROMPT =
  'هلا والله بالضيوف، شرّفتم سَفي اليوم — ودّك بقهوة سعودية ولا شاي؟'

const VOICE_SAMPLES = [
  { name: 'najdi_greeting_v3.wav', dur: '0:04', tag: 'Najdi · greeting' },
  { name: 'hijazi_question_a2.wav', dur: '0:06', tag: 'Hijazi · question' },
  { name: 'eastern_invite_b1.wav', dur: '0:05', tag: 'Eastern · invite' },
  { name: 'asiri_smalltalk_a1.wav', dur: '0:08', tag: 'Asiri · smalltalk' },
  { name: 'gulf_news_brief_v2.wav', dur: '0:11', tag: 'Gulf · news brief' },
]

const PIPELINE = [
  { ar: 'تجميع البيانات', en: 'Data collection', icon: Database, progress: 92, eta: 'مكتمل · مرحلة Q2' },
  { ar: 'النسخ', en: 'Transcription', icon: FileAudio, progress: 71, eta: 'متبقي ~3 أيام' },
  { ar: 'التدريب', en: 'Training', icon: BrainCircuit, progress: 48, eta: 'GPU 8× · 36 ساعة' },
  { ar: 'التقييم', en: 'Evaluation', icon: Trophy, progress: 22, eta: 'بانتظار checkpoint 4' },
]

const ACTIVITY: Array<{
  icon: typeof Upload
  ar: string
  en: string
  meta: string
  tone: 'good' | 'info' | 'admiral' | 'warn'
}> = [
  { icon: Upload, ar: 'رفع كوربس جديد · النجدي 12k ساعة', en: 'Corpus uploaded · Najdi 12k h', meta: 'قبل 4د', tone: 'info' },
  { icon: BrainCircuit, ar: 'انتهاء تدريب نموذج · الحجازي v2.4', en: 'Model trained · Hijazi v2.4', meta: 'قبل 22د', tone: 'admiral' },
  { icon: CheckCircle2, ar: 'اجتياز اختبار · الشرقاوي 86%', en: 'Benchmark passed · Eastern 86%', meta: 'قبل 1س', tone: 'good' },
  { icon: TrendingUp, ar: 'ترقية اللهجة · العسيري → ناضج', en: 'Promoted to mature · Asiri', meta: 'قبل 3س', tone: 'good' },
  { icon: GitBranch, ar: 'فرع نسخ جديد · الجيزاني', en: 'Transcription branch · Jizani', meta: 'اليوم 09:14', tone: 'info' },
  { icon: Sparkles, ar: 'سكربت AI تم توليده · 24 جملة نجدية', en: 'AI script generated · 24 Najdi lines', meta: 'أمس', tone: 'admiral' },
]

const ROBOT_OPTIONS = ROBOT_PINS.filter((p) => p.id.startsWith('G1-')).map((p) => ({
  id: p.id,
  city: p.city,
}))

// ---- page -------------------------------------------------------------------------

export function LanguagePage() {
  const ksa = DIALECTS.filter((d) => d.group === 'KSA')
  const mena = DIALECTS.filter((d) => d.group === 'MENA')
  const global = DIALECTS.filter((d) => d.group === 'Global')

  const [robot, setRobot] = useState(ROBOT_OPTIONS[0]?.id ?? 'G1-RUH-01')
  const [dialect, setDialect] = useState('Najdi')
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [playing, setPlaying] = useState(true)

  const top10 = [...DIALECTS]
    .sort((a, b) => b.maturity - a.maturity)
    .slice(0, 10)
    .map((d) => ({
      ...d,
      // accuracy ~ maturity with small deterministic offset
      accuracy: Math.min(99, d.maturity + ((d.en.length * 3) % 6) - 1),
    }))

  return (
    <PageShell
      active="language"
      ar="الذكاء اللغوي"
      en="AI Language Intelligence"
      icon={Languages}
      description="منظومة فهم وتوليد الصوت العربي متعدد اللهجات لروبوتات Savvy World — نجدي · حجازي · شرقاوي · جنوبي · وأكثر."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/12 px-3 py-2 text-[12px] font-bold text-[--color-admiral-glow] transition-shadow hover:shadow-[0_0_22px_rgba(78,163,255,0.3)]">
          <Sparkles size={12} />
          <div className="flex flex-col items-start leading-tight">
            <span>توليد سكربت AI</span>
            <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-70">Generate AI Script</span>
          </div>
        </button>
      }
    >
      {/* Sticky navigation for deep page hierarchy */}
      <div className="sticky top-[80px] z-20 -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-2 backdrop-blur-sm lg:justify-center">
        <NavButton label="اللهجات" en="Dialects" target="dialects" />
        <NavButton label="العمليات" en="Voice Ops" target="voice-ops" />
        <NavButton label="البث الحي" en="Transcripts" target="transcripts" />
        <NavButton label="البيانات" en="Data Pipeline" target="pipeline" />
        <NavButton label="التدريب" en="Training" target="training" />
      </div>

      {/* ---- KPI strip ---- */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {KPIS.map((k) => {
          const TrendIcon = k.trend === 'up' ? ArrowUpRight : k.trend === 'down' ? ArrowDownRight : Minus
          const trendColor =
            k.trend === 'up'
              ? 'text-[--color-good] bg-[--color-good]/10 border-[--color-good]/20'
              : k.trend === 'down'
                ? 'text-[--color-warn] bg-[--color-warn]/10 border-[--color-warn]/20'
                : 'text-[--color-muted] bg-white/[0.04] border-[--color-line]'
          return (
            <div key={k.en} className="glass-card relative overflow-hidden p-4">
              <div className="pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full bg-[--color-admiral-glow]/8 blur-2xl" />
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[12px] font-bold text-[--color-ink-2]">{k.ar}</div>
                  <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    {k.en}
                  </div>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-en text-[10px] font-bold tabular-nums',
                    trendColor,
                  )}
                >
                  <TrendIcon size={10} />
                  {k.delta}
                </span>
              </div>
              <div className="mt-3 font-en text-[30px] font-extrabold leading-none tracking-tight tabular-nums text-[--color-ink]">
                {k.value}
              </div>
              <div className="mt-1 truncate font-en text-[10px] font-medium text-[--color-faint]">{k.hint}</div>
            </div>
          )
        })}
      </div>

      {/* ---- main grid ---- */}
      <div className="grid grid-cols-12 gap-4">
        {/* ===== Big dialect map ===== */}
        <section className="glass-card relative col-span-12 overflow-hidden p-5 lg:col-span-7">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[--color-admiral-glow]" />
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">خريطة اللهجات السعودية</h2>
              </div>
              <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                KSA Dialect Coverage Map
              </div>
            </div>
            <span className="rounded-md border border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
              v3 · Najdi-tuned
            </span>
          </div>
          <div className="bg-grid relative aspect-[10/9] overflow-hidden rounded-2xl border border-[--color-line] bg-black/30">
            <SaudiMap showDialects className="absolute inset-0 h-full w-full p-3" />
            <div className="absolute bottom-2 end-2 flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/50 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink-2] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow] shadow-[0_0_8px_rgba(78,163,255,0.7)]" />
              KSA dialect maturity
            </div>
            <div className="absolute start-2 top-2 flex flex-col gap-1 rounded-lg border border-[--color-line] bg-black/50 p-2 backdrop-blur-md">
              {[
                { c: 'rgba(78,163,255,0.85)', ar: 'ناضج', en: 'Mature' },
                { c: 'rgba(78,163,255,0.55)', ar: 'تدريب', en: 'Training' },
                { c: 'rgba(78,163,255,0.25)', ar: 'مخطّط', en: 'Planned' },
              ].map((l) => (
                <div key={l.en} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: l.c }} />
                  <span className="text-[10.5px] font-bold text-[--color-ink]">{l.ar}</span>
                  <span className="font-en text-[9px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                    {l.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Live test playground ===== */}
        <section className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Mic size={14} className="text-[--color-admiral-glow]" />
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">ساحة الاختبار الحيّة</h2>
              </div>
              <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Live Voice Playground
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[--color-good]/30 bg-[--color-good]/10 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[--color-good]" />
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Selector
              label="الروبوت"
              en="Robot"
              value={robot}
              onChange={setRobot}
              options={ROBOT_OPTIONS.map((r) => ({ value: r.id, label: `${r.id} · ${r.city}` }))}
            />
            <Selector
              label="اللهجة"
              en="Dialect"
              value={dialect}
              onChange={setDialect}
              options={DIALECTS.map((d) => ({ value: d.en, label: `${d.ar} · ${d.en}` }))}
            />
          </div>

          <div className="mt-2.5 rounded-2xl border border-[--color-line] bg-black/40 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                <Mic size={11} className="text-[--color-admiral-glow]" />
                Prompt · Input
              </div>
              <button className="inline-flex items-center gap-1 rounded-md border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/10 px-1.5 py-0.5 font-en text-[10px] font-bold text-[--color-admiral-glow] hover:shadow-[0_0_14px_rgba(78,163,255,0.3)]">
                <Sparkles size={10} />
                AI script
              </button>
            </div>
            <textarea
              dir="rtl"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-[--color-line] bg-black/40 p-2 text-[12.5px] font-bold leading-relaxed text-[--color-ink] outline-none focus:border-[rgba(78,163,255,0.4)]"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => setPlaying(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 px-3 py-1.5 text-[11.5px] font-bold text-[--color-admiral-glow] transition-shadow hover:shadow-[0_0_22px_rgba(78,163,255,0.35)]"
              >
                <Play size={12} fill="currentColor" />
                تشغيل الاختبار
                <span className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
                  Run Test
                </span>
              </button>
              <span className="font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                target: <span className="text-[--color-ink]">{robot}</span>
              </span>
            </div>
          </div>

          {/* synthesis output */}
          <div id="pipeline" className="mt-2.5 rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3">
            <div className="mb-2 flex items-center justify-between font-en text-[10px] font-semibold uppercase tracking-[0.16em]">
              <div className="flex items-center gap-1.5 text-[--color-faint]">
                <Activity size={10} className="text-[--color-admiral-glow]" />
                Synthesis Output
              </div>
              <span className="text-[--color-admiral-glow]">94% match · {dialect}</span>
            </div>
            <div className="h-14">
              <Waveform bars={68} />
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 text-[--color-admiral-glow] transition-shadow hover:shadow-[0_0_22px_rgba(78,163,255,0.4)]"
                >
                  {playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                </button>
                <Volume2 size={12} className="text-[--color-faint]" />
                <div className="h-1 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]" />
                </div>
              </div>
              <div className="flex items-center gap-3 font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
                <span>
                  acc <span className="text-[--color-good]">94%</span>
                </span>
                <span>
                  lat <span className="text-[--color-admiral-glow]">218ms</span>
                </span>
              </div>
            </div>
          </div>

          {/* voice samples */}
          <div className="mt-2.5">
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-[11px] font-extrabold text-[--color-ink-2]">عيّنات صوتية</span>
              <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Voice samples · {VOICE_SAMPLES.length}
              </span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {VOICE_SAMPLES.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between gap-2 rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5 hover:border-[rgba(78,163,255,0.32)]"
                >
                  <button aria-label="تشغيل العينة" className="grid h-6 w-6 place-items-center rounded-full border border-[rgba(78,163,255,0.3)] bg-[--color-admiral]/10 text-[--color-admiral-glow]">
                    <Play size={9} fill="currentColor" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-en text-[11px] font-bold text-[--color-ink]">{s.name}</div>
                    <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                      {s.tag}
                    </div>
                  </div>
                  <span className="font-en text-[10px] font-bold tabular-nums text-[--color-ink-2]">{s.dur}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== KSA dialects table ===== */}
        <section id="dialects" className="glass-card col-span-12 overflow-hidden p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Languages size={14} className="text-[--color-admiral-glow]" />
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">اللهجات السعودية</h2>
              </div>
              <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                KSA Dialects · {ksa.length} entries
              </div>
            </div>
            <span className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
              auto-audited · {new Date().getFullYear()}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[--color-line]">
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-[--color-line] bg-black/30">
                  <Th>اللهجة</Th>
                  <Th>Dialect</Th>
                  <Th>النضج · Maturity</Th>
                  <Th>الكوربس · Corpus</Th>
                  <Th>آخر تحديث</Th>
                  <Th>الحالة</Th>
                  <Th className="text-end">الإجراء</Th>
                </tr>
              </thead>
              <tbody>
                {ksa.map((d, i) => {
                  const status = statusFromTone(d.tone, d.maturity)
                  return (
                    <tr
                      key={d.en}
                      className={cn(
                        'border-b border-[--color-line] transition-colors hover:bg-white/[0.02]',
                        i === ksa.length - 1 && 'border-b-0',
                      )}
                    >
                      <Td>
                        <span className="text-[12.5px] font-extrabold text-[--color-ink]">{d.ar}</span>
                      </Td>
                      <Td>
                        <span className="font-en text-[11px] font-semibold uppercase tracking-[0.16em] text-[--color-ink-2]">
                          {d.en}
                        </span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
                              style={{ width: `${d.maturity}%` }}
                            />
                          </div>
                          <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-admiral-glow]">
                            {d.maturity}%
                          </span>
                        </div>
                      </Td>
                      <Td>
                        <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">
                          {corpusHours(i + 1, d.maturity)}k
                        </span>
                        <span className="ms-1 font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                          hours
                        </span>
                      </Td>
                      <Td>
                        <span className="text-[11px] font-bold text-[--color-ink-2]">{lastUpdate(i + 2)}</span>
                      </Td>
                      <Td>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.16em]',
                            status.cls,
                          )}
                        >
                          <span className="text-[10.5px] font-extrabold not-italic">{status.label}</span>
                          <span className="opacity-70">· {status.en}</span>
                        </span>
                      </Td>
                      <Td className="text-end">
                        <button className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-admiral-glow]">
                          <Activity size={10} />
                          Run benchmark
                        </button>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== MENA + Global cards ===== */}
        <section className="glass-card col-span-12 overflow-hidden p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[--color-admiral-glow]" />
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">اللهجات الإقليمية والعالمية</h2>
              </div>
              <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                MENA + Global Coverage
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <DialectGrid title="الشرق الأوسط" en="MENA" rows={mena} />
            <DialectGrid title="عالمي" en="Global" rows={global} />
          </div>
        </section>

        {/* ===== Pronunciation accuracy scoreboard ===== */}
        <section className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-[--color-admiral-glow]" />
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">دقّة النطق · Top 10</h2>
              </div>
              <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Pronunciation Accuracy Scoreboard
              </div>
            </div>
            <span className="font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
              eval set v4
            </span>
          </div>

          <ul className="flex flex-col gap-2">
            {top10.map((d, i) => (
              <li key={d.en} className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-1 font-en text-[11px] font-bold tabular-nums text-[--color-faint]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="col-span-4 min-w-0">
                  <div className="truncate text-[12px] font-extrabold text-[--color-ink]">{d.ar}</div>
                  <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                    {d.en}
                  </div>
                </div>
                <div className="col-span-6">
                  <AccuracyBar pct={d.accuracy} />
                </div>
                <div className="col-span-1 text-end font-en text-[11px] font-bold tabular-nums text-[--color-admiral-glow]">
                  {d.accuracy}%
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Training pipeline ===== */}
        <section id="training" className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <GitBranch size={14} className="text-[--color-admiral-glow]" />
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">خطّ أنابيب التدريب</h2>
              </div>
              <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Training Pipeline · 4 stages
              </div>
            </div>
            <span className="rounded-md border border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-admiral-glow]">
              cycle 14
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {PIPELINE.map((s, i) => {
              const Icon = s.icon
              return (
                <div
                  key={s.en}
                  className="rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3"
                >
                  <div className="mb-2 flex items-start gap-2">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                      <Icon size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-faint]">
                          0{i + 1}
                        </span>
                        <h3 className="truncate text-[12.5px] font-extrabold text-[--color-ink]">{s.ar}</h3>
                      </div>
                      <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                        {s.en}
                      </div>
                    </div>
                    <span className="font-en text-[12px] font-extrabold tabular-nums text-[--color-admiral-glow]">
                      {s.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                  <div className="mt-1.5 truncate text-[10.5px] font-bold text-[--color-ink-2]">{s.eta}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ===== Recent activity feed ===== */}
        <section className="glass-card col-span-12 overflow-hidden p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[--color-admiral-glow]" />
                <h2 className="text-[15px] font-extrabold text-[--color-ink]">النشاط الأخير</h2>
              </div>
              <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Recent Activity Feed
              </div>
            </div>
          </div>
          <ul className="flex flex-col">
            {ACTIVITY.map((a, i) => {
              const Icon = a.icon
              const tone =
                a.tone === 'good'
                  ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
                  : a.tone === 'warn'
                    ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
                    : a.tone === 'admiral'
                      ? 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/12 text-[--color-admiral-glow]'
                      : 'border-[--color-line] bg-white/[0.03] text-[--color-ink-2]'
              return (
                <li
                  key={i}
                  className={cn(
                    'flex items-center gap-3 py-2.5',
                    i !== ACTIVITY.length - 1 && 'border-b border-[--color-line]',
                  )}
                >
                  <div
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-xl border',
                      tone,
                    )}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-extrabold text-[--color-ink]">{a.ar}</div>
                    <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                      {a.en}
                    </div>
                  </div>
                  <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">{a.meta}</span>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {/* ====================================================================== */}
      {/* ===== AI VOICE OPERATIONS — extended ops grid (12 new panels) ====== */}
      {/* ====================================================================== */}
      <section id="voice-ops" className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3 border-b border-[--color-line] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit size={16} className="text-[--color-admiral-glow]" />
              <h2 className="text-[18px] font-extrabold text-[--color-ink]">العمليات الذكية للصوت</h2>
            </div>
            <div className="mt-0.5 font-en text-[11px] font-semibold uppercase tracking-[0.22em] text-[--color-faint]">
              AI Voice Operations · Orchestration · Routing · Health
            </div>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[--color-admiral-glow]" />
            ai control plane
          </span>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* 1 — AI Model Orchestration & Routing */}
          <VoicePanel
            className="col-span-12 lg:col-span-7"
            ar="تنسيق نماذج الصوت"
            en="AI Voice Model Orchestration"
            icon={Network}
            badge={<StatusPill tone="good" ar="نشط" en="Live" pulse />}
          >
            <ModelOrchestrationDiagram />
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[--color-line] pt-3">
              <MicroStat ar="نماذج" en="Models" value="5" />
              <MicroStat ar="GPU" en="GPU pool" value="A100×4" />
              <MicroStat ar="عقد/ث" en="Hops/sec" value="218" />
            </div>
          </VoicePanel>

          {/* 2 — Whisper-AR · ASR Pipeline */}
          <VoicePanel
            className="col-span-12 lg:col-span-5"
            ar="Whisper-AR · التعرّف على الكلام"
            en="Whisper-AR · ASR pipeline"
            icon={Mic}
            badge={
              <span className="inline-flex items-center gap-1 rounded-md border border-[--color-good]/30 bg-[--color-good]/10 px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[--color-good]" />
                Streaming
              </span>
            }
          >
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {[
                { l: 'large-v3' },
                { l: '1.55B params' },
                { l: 'fp16' },
                { l: 'A100 ×2' },
              ].map((b) => (
                <span
                  key={b.l}
                  className="inline-flex items-center rounded-md border border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]"
                >
                  {b.l}
                </span>
              ))}
            </div>

            <div className="rounded-2xl border border-[--color-line] bg-black/40 p-3">
              <div className="mb-2 flex items-center justify-between font-en text-[10px] font-semibold uppercase tracking-[0.18em]">
                <span className="text-[--color-faint]">Live transcript · last 5</span>
                <span className="text-[--color-admiral-glow]">tokens · token-conf</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {ASR_STREAM.map((row, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-2"
                  >
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                      <span className="tabular-nums text-[--color-admiral-glow]">{row.ts}</span>
                      <span className="text-[--color-ink-2]">{row.spk}</span>
                      <span className="rounded border border-[--color-line] bg-white/[0.03] px-1 py-px text-[--color-ink-2]">
                        {row.dialect}
                      </span>
                    </div>
                    <p dir="rtl" className="text-[12px] font-bold leading-relaxed text-[--color-ink]">
                      {row.tokens.map((t, j) => (
                        <span
                          key={j}
                          className={cn(
                            'mx-[1px] rounded px-[3px]',
                            t.c >= 90
                              ? 'bg-[--color-good]/12 text-[--color-good]'
                              : t.c >= 75
                                ? 'bg-[--color-admiral]/15 text-[--color-admiral-glow]'
                                : 'bg-[--color-warn]/15 text-[--color-warn]',
                          )}
                          title={`${t.c}%`}
                        >
                          {t.w}
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
                <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                  Req/sec
                </div>
                <Sparkline data={[28, 31, 29, 34, 36, 33, 38, 41, 39, 42, 45, 44]} trend="up" height={22} />
              </div>
              <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
                <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                  p95 latency
                </div>
                <div className="font-en text-[14px] font-extrabold tabular-nums text-[--color-admiral-glow]">
                  186ms
                </div>
              </div>
              <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
                <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                  GPU util
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
                    style={{ width: '72%' }}
                  />
                </div>
                <div className="mt-1 font-en text-[10px] font-bold tabular-nums text-[--color-ink-2]">72%</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[--color-line] pt-3">
              <ActionBtn icon={Server}>إعادة تحميل النموذج</ActionBtn>
              <ActionBtn icon={GitBranch}>إلى A/B test</ActionBtn>
              <ActionBtn icon={AlertTriangle} tone="warn">
                تفريغ الذاكرة
              </ActionBtn>
            </div>
          </VoicePanel>

          {/* 3 — XTTS-Najdi · Speech Synthesis */}
          <VoicePanel
            className="col-span-12 lg:col-span-5"
            ar="XTTS-Najdi · توليد الصوت"
            en="XTTS-Najdi · speech synthesis"
            icon={Volume2}
            badge={<StatusPill tone="good" ar="جاهز" en="Ready" />}
          >
            <div className="mb-3">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-[10.5px] font-extrabold text-[--color-ink-2]">صوت افتراضي</span>
                <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Default voice profile
                </span>
              </div>
              <div className="relative">
                <select
                  defaultValue="najdi-male"
                  className="w-full appearance-none rounded-lg border border-[--color-line] bg-black/40 px-2.5 py-2 pe-7 text-[12px] font-bold text-[--color-ink] outline-none focus:border-[rgba(78,163,255,0.4)]"
                >
                  {VOICE_PROFILES.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#0b1024] text-[--color-ink]">
                      {v.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 font-en text-[10px] font-bold text-[--color-admiral-glow]">
                  ▾
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {VOICE_PROFILES.map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl border border-[--color-line] bg-black/30 p-2 hover:border-[rgba(78,163,255,0.32)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[11.5px] font-extrabold text-[--color-ink]">{v.ar}</div>
                      <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                        {v.en}
                      </div>
                    </div>
                    <button
                      aria-label="play sample"
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/10 text-[--color-admiral-glow]"
                    >
                      <Play size={9} fill="currentColor" />
                    </button>
                  </div>
                  <div className="mt-1.5 h-7">
                    <Waveform bars={28} />
                  </div>
                  <div className="mt-1 flex items-center justify-between font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2]">
                    <span>{v.dur}</span>
                    <span className="text-[--color-faint]">{v.sr}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
                <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                  Inference latency
                </div>
                <Sparkline
                  data={[360, 340, 332, 328, 326, 322, 320, 318, 322, 320, 319, 320]}
                  trend="down"
                  height={22}
                />
                <div className="mt-0.5 font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
                  avg <span className="text-[--color-admiral-glow]">320ms</span> · p95 412ms
                </div>
              </div>
              <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
                <div className="mb-1 font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                  Phoneme accuracy · top 6
                </div>
                <PhonemeBars />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[--color-line] pt-3">
              <ActionBtn icon={Sparkles}>محاكاة صوت جديد</ActionBtn>
              <ActionBtn icon={FileAudio}>تصدير عيّنة</ActionBtn>
            </div>
          </VoicePanel>

          {/* 4 — Qwen-Audio Routing & Reasoning */}
          <VoicePanel
            className="col-span-12 lg:col-span-7"
            ar="Qwen2.5-Audio · توجيه واستدلال"
            en="Qwen2.5-Audio · routing & reasoning"
            icon={BrainCircuit}
            badge={
              <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/12 px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
                ctx 8k · v0.9.7
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[11px] font-extrabold text-[--color-ink-2]">تيار النوايا</span>
                  <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    Intent → action stream
                  </span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {INTENT_STREAM.map((r, i) => {
                    const ToolIcon = r.toolIcon
                    return (
                      <li
                        key={i}
                        className="rounded-lg border border-[--color-line] bg-black/30 p-2"
                      >
                        <p dir="rtl" className="truncate text-[12px] font-bold text-[--color-ink]">
                          “{r.utt}”
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
                            <Tag size={9} />
                            {r.intent}
                          </span>
                          <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-good]">
                            {r.conf}%
                          </span>
                          <ArrowRight size={10} className="text-[--color-faint]" />
                          <span className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-white/[0.03] px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-ink-2]">
                            <ToolIcon size={9} />
                            {r.tool}
                          </span>
                          <span className="ms-auto font-en text-[9.5px] font-bold tabular-nums text-[--color-faint]">
                            {r.lat}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[11px] font-extrabold text-[--color-ink-2]">توزيع المسارات</span>
                  <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    Tool router · share
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <DonutChart
                    data={[
                      { label: 'Fleet API', value: 32, color: '#4ea3ff' },
                      { label: 'Knowledge', value: 24, color: '#2d7fd9' },
                      { label: 'Project lookup', value: 16, color: '#0057b7' },
                      { label: 'Calendar', value: 12, color: '#22c55e' },
                      { label: 'Camera ctrl', value: 9, color: '#f5a524' },
                      { label: 'Voice reply', value: 7, color: '#7a86a8' },
                    ]}
                  />
                  <ul className="flex flex-1 flex-col gap-1">
                    {[
                      { l: 'Fleet API', v: 32, c: '#4ea3ff' },
                      { l: 'Knowledge', v: 24, c: '#2d7fd9' },
                      { l: 'Project lookup', v: 16, c: '#0057b7' },
                      { l: 'Calendar', v: 12, c: '#22c55e' },
                      { l: 'Camera ctrl', v: 9, c: '#f5a524' },
                      { l: 'Voice reply', v: 7, c: '#7a86a8' },
                    ].map((s) => (
                      <li
                        key={s.l}
                        className="flex items-center justify-between gap-2 font-en text-[10px] font-bold text-[--color-ink-2]"
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-1.5 w-1.5 rounded-sm"
                            style={{ background: s.c, boxShadow: `0 0 6px ${s.c}` }}
                          />
                          {s.l}
                        </span>
                        <span className="tabular-nums text-[--color-ink]">{s.v}%</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 rounded-lg border border-[--color-line] bg-black/30 p-2">
                  <div className="flex items-center justify-between font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                    <span>Context window</span>
                    <span className="tabular-nums text-[--color-admiral-glow]">5.4k / 8k</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
                      style={{ width: '67.5%' }}
                    />
                  </div>
                </div>
                <div className="mt-2 rounded-lg border border-[--color-line] bg-black/30 p-2">
                  <div className="flex items-center justify-between font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                    <span>Multi-turn depth</span>
                    <span className="tabular-nums text-[--color-ink]">avg 3.4 · max 9</span>
                  </div>
                  <div className="mt-1 flex items-end gap-0.5">
                    {[2, 3, 4, 5, 4, 6, 5, 7, 6, 4, 3, 2].map((v, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-[--color-admiral-deep] to-[--color-admiral-glow]"
                        style={{ height: `${v * 4}px`, opacity: 0.4 + v / 12 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </VoicePanel>

          {/* 5 — Speech-to-Command Pipeline */}
          <VoicePanel
            className="col-span-12"
            ar="خط أوامر الصوت"
            en="Voice command pipeline"
            icon={Layers}
            badge={
              <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/12 px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
                end-to-end
              </span>
            }
          >
            <div className="overflow-x-auto">
              <div className="grid min-w-[920px] grid-cols-6 gap-2">
                {VOICE_PIPELINE.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={s.en} className="relative">
                      <div className="rounded-xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                            <Icon size={13} />
                          </span>
                          <StatusPill tone={s.tone} ar={s.tone === 'warn' ? 'تنبيه' : 'OK'} en={s.tone === 'warn' ? 'Watch' : 'OK'} />
                        </div>
                        <div className="text-[12.5px] font-extrabold text-[--color-ink]">
                          <span className="me-1.5 font-en text-[9.5px] font-bold tabular-nums text-[--color-faint]">
                            0{i + 1}
                          </span>
                          {s.ar}
                        </div>
                        <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                          {s.en}
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          <PipelineMicro label="p50" value={s.p50} />
                          <PipelineMicro label="p95" value={s.p95} tone="admiral" />
                          <PipelineMicro label="ok%" value={s.ok} tone="good" />
                          <PipelineMicro label="err%" value={s.err} tone={s.tone === 'warn' ? 'warn' : undefined} />
                        </div>
                        <div className="mt-2 font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2]">
                          <span className="text-[--color-faint]">tput · </span>
                          {s.tput}
                        </div>
                      </div>
                      {i !== VOICE_PIPELINE.length - 1 && (
                        <span className="pointer-events-none absolute -end-1 top-1/2 hidden -translate-y-1/2 lg:block">
                          <FlowArrow />
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
              <span className="font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                aggregate · voice → motor
              </span>
              <span className="text-[12.5px] font-extrabold text-[--color-ink]">
                أمر إلى تنفيذ:{' '}
                <span className="font-en tabular-nums text-[--color-admiral-glow]">1.24s</span>{' '}
                <span className="font-en text-[10.5px] font-semibold text-[--color-faint]">total</span>
              </span>
              <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-good]">
                ok 99.2% · err 0.8%
              </span>
            </div>
          </VoicePanel>

          {/* 6 — Live Transcription Monitor */}
          <VoicePanel
            className="col-span-12 lg:col-span-6"
            ar="مراقبة النسخ المباشر"
            en="Live transcription monitor"
            icon={Activity}
            badge={
              <span className="inline-flex items-center gap-1 rounded-md border border-[--color-good]/30 bg-[--color-good]/10 px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[--color-good]" />
                Streaming
              </span>
            }
          >
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 p-2">
              <select
                defaultValue="all"
                className="appearance-none rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[10.5px] font-bold text-[--color-ink-2]"
              >
                <option value="all" className="bg-[#0b1024]">
                  كل اللهجات
                </option>
                <option value="najdi" className="bg-[#0b1024]">
                  نجدي
                </option>
                <option value="hijazi" className="bg-[#0b1024]">
                  حجازي
                </option>
                <option value="eastern" className="bg-[#0b1024]">
                  شرقاوي
                </option>
              </select>
              <select
                defaultValue="all"
                className="appearance-none rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[10.5px] font-bold text-[--color-ink-2]"
              >
                <option value="all" className="bg-[#0b1024]">
                  كل الروبوتات
                </option>
                <option value="g1-001" className="bg-[#0b1024]">
                  G1-RUH-01
                </option>
                <option value="g1-002" className="bg-[#0b1024]">
                  G1-JED-02
                </option>
              </select>
              <button className="ms-auto inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[10.5px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-admiral-glow]">
                <Pause size={10} />
                Pause stream
              </button>
            </div>
            <ul className="flex max-h-[460px] flex-col gap-1.5 overflow-y-auto pe-1">
              {LIVE_TRANSCRIPTS.map((t, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-[--color-line] bg-black/30 p-2 hover:border-[rgba(78,163,255,0.28)]"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2 font-en text-[9.5px] font-bold uppercase tracking-[0.16em]">
                    <span className="text-[--color-admiral-glow] tabular-nums">{t.robot}</span>
                    <span className="text-[--color-faint]">· {t.city}</span>
                    <span className="text-[--color-ink-2]">· {t.user}</span>
                    <span className="ms-auto text-[--color-faint] tabular-nums">{t.time}</span>
                  </div>
                  <p dir="rtl" className="text-[12.5px] font-bold leading-relaxed text-[--color-ink]">
                    {t.utt}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded border border-[--color-line] bg-white/[0.03] px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-ink-2]">
                      {t.dialect}
                    </span>
                    <span
                      className={cn(
                        'rounded border px-1.5 py-0.5 font-en text-[9.5px] font-bold tabular-nums',
                        t.conf >= 90
                          ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
                          : t.conf >= 75
                            ? 'border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 text-[--color-admiral-glow]'
                            : 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]',
                      )}
                    >
                      {t.conf}%
                    </span>
                    <span
                      className={cn(
                        'ms-auto rounded border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em]',
                        t.action === 'ok'
                          ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
                          : t.action === 'warn'
                            ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
                            : 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]',
                      )}
                    >
                      {t.action === 'ok' ? '✓ executed' : t.action === 'warn' ? '⚠ low conf' : '✗ rejected'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </VoicePanel>

          {/* 7 — Voice Analytics & Insights */}
          <VoicePanel
            className="col-span-12 lg:col-span-6"
            ar="تحليلات الصوت"
            en="Voice analytics"
            icon={Gauge}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[11.5px] font-extrabold text-[--color-ink]">أكثر اللهجات استخداماً</span>
                  <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    Top dialects
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <DonutChart
                    size={88}
                    data={[
                      { label: 'Najdi', value: 58, color: '#4ea3ff' },
                      { label: 'Hijazi', value: 22, color: '#2d7fd9' },
                      { label: 'Eastern', value: 12, color: '#0057b7' },
                      { label: 'Other', value: 8, color: '#7a86a8' },
                    ]}
                  />
                  <ul className="flex flex-1 flex-col gap-1 font-en text-[10px] font-bold text-[--color-ink-2]">
                    {[
                      { l: 'Najdi · نجدي', v: 58, c: '#4ea3ff' },
                      { l: 'Hijazi · حجازي', v: 22, c: '#2d7fd9' },
                      { l: 'Eastern · شرقاوي', v: 12, c: '#0057b7' },
                      { l: 'Other · أخرى', v: 8, c: '#7a86a8' },
                    ].map((s) => (
                      <li key={s.l} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-1.5 w-1.5 rounded-sm"
                            style={{ background: s.c, boxShadow: `0 0 6px ${s.c}` }}
                          />
                          {s.l}
                        </span>
                        <span className="tabular-nums text-[--color-ink]">{s.v}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[11.5px] font-extrabold text-[--color-ink]">متوسط طول الأمر</span>
                  <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    Avg utterance
                  </span>
                </div>
                <div className="font-en text-[28px] font-extrabold leading-none tabular-nums text-[--color-ink]">
                  4.2<span className="text-[14px] text-[--color-faint]"> ث</span>
                </div>
                <div className="mt-1 font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                  4.2 sec · trailing 7d
                </div>
                <div className="mt-2">
                  <Sparkline
                    data={[3.6, 3.7, 3.9, 4.0, 4.1, 4.0, 4.2, 4.3, 4.2, 4.1, 4.2, 4.2]}
                    trend="up"
                    height={28}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[11.5px] font-extrabold text-[--color-ink]">نسبة الرفض</span>
                  <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    Rejection rate
                  </span>
                </div>
                <div className="font-en text-[28px] font-extrabold leading-none tabular-nums text-[--color-warn]">
                  4.3<span className="text-[14px] text-[--color-faint]">%</span>
                </div>
                <div className="mt-1 inline-flex items-center gap-1 font-en text-[10px] font-bold tabular-nums text-[--color-good]">
                  <ArrowDownRight size={10} />
                  −0.6 · trending down
                </div>
                <div className="mt-2">
                  <Sparkline
                    data={[5.1, 5.0, 4.9, 4.8, 4.7, 4.6, 4.6, 4.5, 4.4, 4.4, 4.3, 4.3]}
                    trend="down"
                    height={28}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[11.5px] font-extrabold text-[--color-ink]">ساعة الذروة</span>
                  <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    Peak hour · 24h
                  </span>
                </div>
                <HourHeatmap />
                <div className="mt-1 font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                  peak · <span className="text-[--color-admiral-glow]">19:00–21:00</span>
                </div>
              </div>
            </div>
          </VoicePanel>

          {/* 8 — AI Conversation Logs */}
          <VoicePanel
            className="col-span-12"
            ar="سجل المحادثات"
            en="AI conversation logs"
            icon={MessageSquare}
          >
            <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 p-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search
                  size={11}
                  className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 text-[--color-faint]"
                />
                <input
                  type="text"
                  placeholder="بحث · session id, operator, intent…"
                  className="w-full rounded-md border border-[--color-line] bg-black/40 px-2 py-1 ps-7 font-en text-[10.5px] font-semibold text-[--color-ink-2] placeholder:text-[--color-faint] outline-none focus:border-[rgba(78,163,255,0.4)]"
                />
              </div>
              {['اليوم · Today', 'هذا الأسبوع · Week', 'الشهر · Month', 'الكل · All'].map((c, i) => (
                <button
                  key={c}
                  className={cn(
                    'rounded-md border px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em]',
                    i === 0
                      ? 'border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 text-[--color-admiral-glow]'
                      : 'border-[--color-line] bg-black/40 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)]',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-[--color-line]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-start">
                  <thead>
                    <tr className="border-b border-[--color-line] bg-black/30">
                      <Th>Session</Th>
                      <Th>Started</Th>
                      <Th>Robot</Th>
                      <Th>Operator</Th>
                      <Th>Turns</Th>
                      <Th>Avg conf.</Th>
                      <Th>Outcome</Th>
                      <Th>Duration</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONVO_LOGS.map((c, i) => (
                      <ConversationRow key={c.id} c={c} last={i === CONVO_LOGS.length - 1} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </VoicePanel>

          {/* 9 — Operator ↔ Robot Voice Flows */}
          <VoicePanel
            className="col-span-12 lg:col-span-7"
            ar="تدفّق الصوت"
            en="Operator ↔ Robot voice flow"
            icon={GitBranch}
          >
            <SequenceDiagram />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[--color-line] pt-3">
              <div className="flex flex-wrap items-center gap-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                <span>operator → edge → cloud → robot</span>
                <span className="text-[--color-admiral-glow]">· 6 messages</span>
              </div>
              <ReplayButton />
            </div>
          </VoicePanel>

          {/* 10 — Dataset & Corpus Management */}
          <VoicePanel
            className="col-span-12 lg:col-span-5"
            ar="إدارة الكوربس"
            en="Dataset management"
            icon={Database}
          >
            <div className="overflow-hidden rounded-xl border border-[--color-line]">
              <table className="w-full text-start">
                <thead>
                  <tr className="border-b border-[--color-line] bg-black/30">
                    <Th>Dialect</Th>
                    <Th>Hours</Th>
                    <Th>Speakers</Th>
                    <Th>Updated</Th>
                    <Th>Quality</Th>
                    <Th className="text-end">Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {CORPUS_ROWS.map((r, i) => (
                    <tr
                      key={r.en}
                      className={cn(
                        'border-b border-[--color-line] transition-colors hover:bg-white/[0.02]',
                        i === CORPUS_ROWS.length - 1 && 'border-b-0',
                      )}
                    >
                      <Td>
                        <div className="text-[12px] font-extrabold text-[--color-ink]">{r.ar}</div>
                        <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                          {r.en}
                        </div>
                      </Td>
                      <Td>
                        <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">
                          {r.hours}k
                        </span>
                      </Td>
                      <Td>
                        <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">
                          {r.speakers}
                        </span>
                      </Td>
                      <Td>
                        <span className="font-en text-[10.5px] font-bold text-[--color-ink-2]">{r.updated}</span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
                              style={{ width: `${r.quality}%` }}
                            />
                          </div>
                          <span className="font-en text-[10px] font-bold tabular-nums text-[--color-admiral-glow]">
                            {r.quality}
                          </span>
                        </div>
                      </Td>
                      <Td className="text-end">
                        <div className="inline-flex items-center gap-1">
                          <button className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en text-[9.5px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-admiral-glow]">
                            <Upload size={9} />
                            زيادة
                          </button>
                          <button className="inline-flex items-center gap-1 rounded-md border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/12 px-1.5 py-0.5 font-en text-[9.5px] font-bold text-[--color-admiral-glow]">
                            <BrainCircuit size={9} />
                            تدريب
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2">
              <div className="flex flex-wrap items-center gap-3">
                <CorpusTotal label="Hours" value="61.4k" />
                <CorpusTotal label="Speakers" value="1,842" />
                <CorpusTotal label="Dialects" value={String(CORPUS_ROWS.length)} />
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 px-2.5 py-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow] hover:shadow-[0_0_18px_rgba(78,163,255,0.32)]">
                <Upload size={11} />
                رفع كوربس جديد
              </button>
            </div>
          </VoicePanel>

          {/* 11 — Training & Evaluation Pipelines */}
          <VoicePanel
            id="training"
            className="col-span-12 lg:col-span-7"
            ar="خطوط التدريب والتقييم"
            en="Training & eval pipelines"
            icon={GitBranch}
          >
            <div className="mb-3">
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[11.5px] font-extrabold text-[--color-ink]">عمليات نشطة</span>
                <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Active runs · {ACTIVE_RUNS.length}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {ACTIVE_RUNS.map((r) => (
                  <li
                    key={r.name}
                    className="rounded-xl border border-[--color-line] bg-black/30 p-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-en text-[12px] font-extrabold tracking-tight text-[--color-ink]">
                            {r.name}
                          </span>
                          <span className="rounded-md border border-[--color-line] bg-white/[0.03] px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-ink-2]">
                            {r.dataset}
                          </span>
                        </div>
                        <div className="mt-0.5 font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                          started {r.started} · ETA {r.eta} · GPU {r.gpu}
                        </div>
                      </div>
                      <span className="font-en text-[14px] font-extrabold tabular-nums text-[--color-admiral-glow]">
                        {r.pct}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <RunMetric label="epoch" value={r.epoch} />
                      <RunMetric label="loss" value={r.loss} tone="warn" />
                      <RunMetric label="val acc" value={r.val} tone="good" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[11.5px] font-extrabold text-[--color-ink]">آخر تقييمات</span>
                <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Recent evaluations
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {EVAL_RUNS.map((e) => (
                  <div
                    key={e.name}
                    className="rounded-xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-1.5">
                      <span className="font-en text-[12px] font-extrabold tracking-tight text-[--color-ink]">
                        {e.name}
                      </span>
                      <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                        {e.when}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <EvalChip label="BLEU" value={e.bleu} />
                      <EvalChip label="WER" value={e.wer} tone="warn" />
                      <EvalChip label="dialect acc" value={e.dialect} tone="good" />
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <button className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-admiral-glow] hover:shadow-[0_0_18px_rgba(78,163,255,0.28)]">
                        <CheckCircle2 size={10} />
                        Promote to prod
                      </button>
                      <button className="inline-flex items-center justify-center gap-1 rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2] hover:border-[--color-warn]/40 hover:text-[--color-warn]">
                        <AlertTriangle size={10} />
                        Rollback
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </VoicePanel>

          {/* 12 — AI Model Health Monitor */}
          <VoicePanel
            className="col-span-12 lg:col-span-5"
            ar="صحة النماذج"
            en="Model health"
            icon={ShieldCheck}
          >
            <ul className="flex flex-col gap-1.5">
              {MODEL_HEALTH.map((m) => (
                <li
                  key={m.name}
                  className="rounded-xl border border-[--color-line] bg-black/30 p-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-en text-[12px] font-extrabold tracking-tight text-[--color-ink]">
                        {m.name}
                      </div>
                      <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                        replicas {m.replicas} · GPU {m.gpu}
                      </div>
                    </div>
                    <StatusPill
                      tone={m.status === 'good' ? 'good' : m.status === 'warn' ? 'warn' : 'bad'}
                      ar={m.status === 'good' ? 'سليم' : m.status === 'warn' ? 'متدهور' : 'متوقف'}
                      en={m.status === 'good' ? 'Healthy' : m.status === 'warn' ? 'Degraded' : 'Down'}
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    <HealthMetric label="p95" value={m.p95} tone="admiral" />
                    <HealthMetric label="err%" value={m.err} tone={m.status === 'good' ? 'good' : 'warn'} />
                    <HealthMetric label="vram" value={m.vram} />
                  </div>
                  <div className="mt-2">
                    <Sparkline
                      data={m.spark}
                      trend={m.status === 'good' ? 'flat' : m.status === 'warn' ? 'down' : 'down'}
                      height={20}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[--color-line] pt-3">
              <span className="font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                {MODEL_HEALTH.filter((m) => m.status === 'good').length}/{MODEL_HEALTH.length} healthy
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <ActionBtn icon={Server} tone="warn">
                  إعادة تشغيل المتدهورة
                </ActionBtn>
                <ActionBtn icon={AlertTriangle}>تكوين alert</ActionBtn>
              </div>
            </div>
          </VoicePanel>
        </div>
      </section>
    </PageShell>
  )
}

// ---- small primitives ------------------------------------------------------------

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        'px-3 py-2 text-start font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-faint]',
        className,
      )}
    >
      {children}
    </th>
  )
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-3 py-2.5 align-middle', className)}>{children}</td>
}

function Selector({
  label,
  en,
  value,
  onChange,
  options,
}: {
  label: string
  en: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10.5px] font-extrabold text-[--color-ink-2]">{label}</span>
        <span className="font-en text-[9px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">{en}</span>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-[--color-line] bg-black/40 px-2.5 py-2 pe-7 text-[12px] font-bold text-[--color-ink] outline-none focus:border-[rgba(78,163,255,0.4)]"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0b1024] text-[--color-ink]">
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 font-en text-[10px] font-bold text-[--color-admiral-glow]">
          ▾
        </span>
      </div>
    </label>
  )
}

function AccuracyBar({ pct }: { pct: number }) {
  const w = Math.max(0, Math.min(100, pct))
  return (
    <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="h-2 w-full">
      <defs>
        <linearGradient id={`accbar-${pct}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#003d82" />
          <stop offset="100%" stopColor="#4ea3ff" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="8" rx="3" fill="rgba(255,255,255,0.06)" />
      <rect x="0" y="0" width={w} height="8" rx="3" fill={`url(#accbar-${pct})`} />
      {[25, 50, 75].map((t) => (
        <line key={t} x1={t} y1="0" x2={t} y2="8" stroke="rgba(78,163,255,0.18)" strokeWidth="0.4" />
      ))}
    </svg>
  )
}

// =====================================================================
// AI Voice Operations — supporting data + components
// =====================================================================

type Tone = 'good' | 'warn' | 'bad' | 'admiral'

interface AsrRow {
  ts: string
  spk: string
  dialect: string
  tokens: { w: string; c: number }[]
}

const ASR_STREAM: AsrRow[] = [
  {
    ts: '11:24:08',
    spk: 'مشغّل · Op-04',
    dialect: 'Najdi',
    tokens: [
      { w: 'هلا', c: 96 },
      { w: 'يا', c: 94 },
      { w: 'سَفِي', c: 92 },
      { w: 'افتح', c: 95 },
      { w: 'اللوبي', c: 88 },
    ],
  },
  {
    ts: '11:23:51',
    spk: 'زائر · Visitor',
    dialect: 'Hijazi',
    tokens: [
      { w: 'لو', c: 91 },
      { w: 'سمحت', c: 87 },
      { w: 'وين', c: 82 },
      { w: 'قاعة', c: 78 },
      { w: 'الاجتماعات؟', c: 73 },
    ],
  },
  {
    ts: '11:23:30',
    spk: 'مشغّل · Op-02',
    dialect: 'MSA',
    tokens: [
      { w: 'ابدأ', c: 97 },
      { w: 'جولة', c: 95 },
      { w: 'العرض', c: 96 },
      { w: 'للزوار', c: 92 },
    ],
  },
  {
    ts: '11:23:11',
    spk: 'موظف · Staff',
    dialect: 'Eastern',
    tokens: [
      { w: 'يَلّا', c: 84 },
      { w: 'روح', c: 81 },
      { w: 'استقبل', c: 86 },
      { w: 'الضيوف', c: 89 },
    ],
  },
  {
    ts: '11:22:48',
    spk: 'زائر · Visitor',
    dialect: 'Najdi',
    tokens: [
      { w: 'وش', c: 79 },
      { w: 'فعالياتكم', c: 71 },
      { w: 'اليوم؟', c: 84 },
    ],
  },
]

interface VoiceProfile {
  id: string
  ar: string
  en: string
  label: string
  dur: string
  sr: string
}

const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'najdi-male', ar: 'صوت سعودي · رجل', en: 'Najdi · male', label: 'صوت سعودي · رجل', dur: '0:04', sr: '24kHz' },
  { id: 'hijazi-female', ar: 'حجازية · امرأة', en: 'Hijazi · female', label: 'حجازية · امرأة', dur: '0:05', sr: '24kHz' },
  { id: 'khaleeji-male', ar: 'خليجي · رجل', en: 'Khaleeji · male', label: 'خليجي · رجل', dur: '0:06', sr: '22kHz' },
  { id: 'msa-formal', ar: 'فصحى رسمية', en: 'MSA · formal', label: 'فصحى · رسمية', dur: '0:05', sr: '24kHz' },
]

interface IntentRow {
  utt: string
  intent: string
  conf: number
  tool: string
  toolIcon: typeof Server
  lat: string
}

const INTENT_STREAM: IntentRow[] = [
  { utt: 'وين الروبوت اللي عند بوابة LEAP؟', intent: 'fleet.locate', conf: 94, tool: 'Fleet API', toolIcon: Server, lat: '142ms' },
  { utt: 'اعرض لي تقرير اليوم لمشروع سَفِي', intent: 'project.summary', conf: 91, tool: 'Project lookup', toolIcon: Database, lat: '198ms' },
  { utt: 'اضبط اجتماع مع فريق الهندسة الساعة عشر', intent: 'calendar.create', conf: 88, tool: 'Calendar', toolIcon: Clock, lat: '224ms' },
  { utt: 'صوّر اللي قدامك وحفظ الفيديو', intent: 'camera.capture', conf: 87, tool: 'Camera ctrl', toolIcon: Activity, lat: '167ms' },
  { utt: 'كم سعر الباقة الفضية؟', intent: 'knowledge.lookup', conf: 92, tool: 'Knowledge', toolIcon: BrainCircuit, lat: '185ms' },
  { utt: 'قول للضيف يدخل القاعة الكبيرة', intent: 'voice.reply', conf: 95, tool: 'Voice reply', toolIcon: Volume2, lat: '154ms' },
]

interface VoicePipelineStage {
  ar: string
  en: string
  icon: typeof Mic
  p50: string
  p95: string
  ok: string
  err: string
  tput: string
  tone: 'good' | 'warn' | 'bad'
}

const VOICE_PIPELINE: VoicePipelineStage[] = [
  { ar: 'كشف الكلام', en: 'VAD · Silero', icon: Activity, p50: '12ms', p95: '24ms', ok: '99.8', err: '0.2', tput: '4.2k/min', tone: 'good' },
  { ar: 'النسخ', en: 'Whisper-AR', icon: Mic, p50: '186ms', p95: '312ms', ok: '99.4', err: '0.6', tput: '842/min', tone: 'good' },
  { ar: 'ترجمة وتطبيع', en: 'Translate', icon: Languages, p50: '48ms', p95: '92ms', ok: '99.2', err: '0.8', tput: '842/min', tone: 'warn' },
  { ar: 'استدلال النيّة', en: 'Intent · Qwen', icon: BrainCircuit, p50: '218ms', p95: '386ms', ok: '98.7', err: '1.3', tput: '784/min', tone: 'good' },
  { ar: 'تخويل الأمر', en: 'Authorize', icon: ShieldCheck, p50: '14ms', p95: '32ms', ok: '99.9', err: '0.1', tput: '776/min', tone: 'good' },
  { ar: 'تنفيذ الروبوت', en: 'Execute · robot', icon: Cpu, p50: '124ms', p95: '248ms', ok: '99.3', err: '0.7', tput: '770/min', tone: 'good' },
]

interface LiveTranscript {
  robot: string
  city: string
  user: string
  utt: string
  dialect: string
  conf: number
  time: string
  action: 'ok' | 'warn' | 'rej'
}

const LIVE_TRANSCRIPTS: LiveTranscript[] = [
  { robot: 'G1-RUH-01', city: 'الرياض', user: 'فيصل العتيبي', utt: 'هلا والله، خوّش بكم في سفي', dialect: 'Najdi', conf: 96, time: '11:24:08', action: 'ok' },
  { robot: 'G1-JED-02', city: 'جدة', user: 'سارة الحربي', utt: 'لو تسمح، فين قاعة الاجتماعات؟', dialect: 'Hijazi', conf: 88, time: '11:23:51', action: 'ok' },
  { robot: 'G1-DMM-03', city: 'الدمام', user: 'عبدالله الشمري', utt: 'يلا روح استقبل الضيوف الجداد', dialect: 'Eastern', conf: 84, time: '11:23:30', action: 'ok' },
  { robot: 'G1-RUH-04', city: 'الرياض', user: 'منى الدوسري', utt: 'وش الفعاليات اليوم في المعرض؟', dialect: 'Najdi', conf: 79, time: '11:23:11', action: 'warn' },
  { robot: 'G1-RUH-05', city: 'الرياض', user: 'تركي القحطاني', utt: 'سفي، شغّل عرض الفيديو الرئيسي', dialect: 'Najdi', conf: 94, time: '11:22:48', action: 'ok' },
  { robot: 'G1-JED-06', city: 'جدة', user: 'لينا الزهراني', utt: 'ابدأ جولة العرض للزوار من فضلك', dialect: 'MSA', conf: 91, time: '11:22:21', action: 'ok' },
  { robot: 'G1-RUH-07', city: 'الرياض', user: 'بدر السبيعي', utt: 'كم سعر الباقة الذهبية لاشتراك سفي؟', dialect: 'Najdi', conf: 86, time: '11:21:58', action: 'ok' },
  { robot: 'G1-RUH-01', city: 'الرياض', user: 'مجهول', utt: '... صوت غير واضح ...', dialect: '?', conf: 42, time: '11:21:35', action: 'rej' },
  { robot: 'G1-DMM-03', city: 'الدمام', user: 'هند العنزي', utt: 'سجّل ملاحظة لاجتماع بكرة الساعة تسع', dialect: 'Eastern', conf: 89, time: '11:21:12', action: 'ok' },
  { robot: 'G1-RUH-04', city: 'الرياض', user: 'يزيد المطيري', utt: 'افتح كاميرا اللوبي وأرسل الصورة', dialect: 'Najdi', conf: 92, time: '11:20:48', action: 'ok' },
]

interface ConvoLog {
  id: string
  started: string
  robot: string
  operator: string
  turns: number
  conf: number
  outcome: 'success' | 'escalation' | 'cancel'
  duration: string
  preview: { user: string; bot: string }[]
}

const CONVO_LOGS: ConvoLog[] = [
  {
    id: 'sess_8f2c·a401',
    started: '11:24:08',
    robot: 'G1-RUH-01',
    operator: 'فيصل العتيبي',
    turns: 6,
    conf: 94,
    outcome: 'success',
    duration: '02:42',
    preview: [
      { user: 'هلا سفي، عطني تقرير اليوم', bot: 'تقرير اليوم: ٤٢ زائر، ٣ اجتماعات، حدثان مجدولان.' },
      { user: 'أرسل التقرير لقروب الإدارة', bot: 'تم الإرسال إلى قروب الإدارة في تيمز.' },
      { user: 'ذكّرني بعد ساعة بالاجتماع', bot: 'سأذكّرك الساعة ١٢:٢٤ بإذن الله.' },
    ],
  },
  {
    id: 'sess_8f2c·a3f9',
    started: '11:18:21',
    robot: 'G1-JED-02',
    operator: 'سارة الحربي',
    turns: 4,
    conf: 88,
    outcome: 'success',
    duration: '01:54',
    preview: [
      { user: 'وين قاعة الاجتماعات؟', bot: 'الجهة اليسرى من اللوبي، الباب الزجاجي الكبير.' },
      { user: 'ابلّغهم إني جاية', bot: 'تم إبلاغ منسّق القاعة، بانتظارك.' },
      { user: 'شكراً سفي', bot: 'بالخدمة دائماً.' },
    ],
  },
  {
    id: 'sess_8f2c·a3e2',
    started: '11:11:02',
    robot: 'G1-DMM-03',
    operator: 'عبدالله الشمري',
    turns: 9,
    conf: 81,
    outcome: 'escalation',
    duration: '04:18',
    preview: [
      { user: 'ما يبيّن عرض اليوم', bot: 'اعرض جدول اليوم، أو أوصلك بمختص؟' },
      { user: 'وصّلني مع مختص', bot: 'يتم تحويلك إلى الدعم الآن.' },
      { user: 'تمام', bot: 'الاتصال جارٍ — التذكرة #INC-2618.' },
    ],
  },
  {
    id: 'sess_8f2c·a3c4',
    started: '11:02:47',
    robot: 'G1-RUH-04',
    operator: 'منى الدوسري',
    turns: 5,
    conf: 90,
    outcome: 'success',
    duration: '02:05',
    preview: [
      { user: 'افتح كاميرا اللوبي', bot: 'تم تشغيل الكاميرا، يمكنك المتابعة من اللوحة.' },
      { user: 'صوّر صورة وأرسلها لي', bot: 'تم — وصلت إلى بريدك الآن.' },
      { user: 'ممتاز', bot: 'بالخدمة.' },
    ],
  },
  {
    id: 'sess_8f2c·a3a1',
    started: '10:54:18',
    robot: 'G1-RUH-05',
    operator: 'تركي القحطاني',
    turns: 7,
    conf: 92,
    outcome: 'success',
    duration: '03:11',
    preview: [
      { user: 'شغّل عرض الفيديو الرئيسي', bot: 'تم تشغيل العرض على الشاشة الكبيرة.' },
      { user: 'أوقفه عند الدقيقة الثانية', bot: 'متوقف عند 02:00.' },
      { user: 'كمّله من جديد', bot: 'إعادة من البداية.' },
    ],
  },
  {
    id: 'sess_8f2c·a37e',
    started: '10:47:33',
    robot: 'G1-JED-06',
    operator: 'لينا الزهراني',
    turns: 3,
    conf: 86,
    outcome: 'cancel',
    duration: '00:48',
    preview: [
      { user: 'ابدأ جولة العرض', bot: 'هل أبدأها بالعربية أم بالإنجليزية؟' },
      { user: 'لا، بعدين', bot: 'تم الإلغاء.' },
    ],
  },
  {
    id: 'sess_8f2c·a361',
    started: '10:38:12',
    robot: 'G1-RUH-07',
    operator: 'بدر السبيعي',
    turns: 8,
    conf: 89,
    outcome: 'success',
    duration: '03:42',
    preview: [
      { user: 'كم سعر الباقة الذهبية؟', bot: 'الباقة الذهبية: ٤٩٩ ريال شهرياً.' },
      { user: 'أرسل لي العرض على الواتس', bot: 'تم — يصلك خلال دقيقة.' },
      { user: 'تمام شكراً', bot: 'بالخدمة دائماً.' },
    ],
  },
  {
    id: 'sess_8f2c·a342',
    started: '10:21:05',
    robot: 'G1-RUH-01',
    operator: 'هند العنزي',
    turns: 5,
    conf: 87,
    outcome: 'success',
    duration: '02:18',
    preview: [
      { user: 'ذكّرني باجتماع بكرة', bot: 'حُدِّد التذكير لـ ٠٩:٠٠ صباحاً.' },
      { user: 'أرسل دعوة للفريق', bot: 'الدعوات في طريقها.' },
      { user: 'شكراً', bot: 'بالخدمة.' },
    ],
  },
]

interface CorpusRow {
  ar: string
  en: string
  hours: number
  speakers: number
  updated: string
  quality: number
}

const CORPUS_ROWS: CorpusRow[] = [
  { ar: 'النجدي', en: 'Najdi', hours: 18.4, speakers: 612, updated: 'اليوم', quality: 94 },
  { ar: 'الحجازي', en: 'Hijazi', hours: 12.1, speakers: 384, updated: 'أمس', quality: 88 },
  { ar: 'الشرقاوي', en: 'Eastern', hours: 8.6, speakers: 246, updated: 'قبل 3 أيام', quality: 84 },
  { ar: 'العسيري', en: 'Asiri', hours: 6.2, speakers: 174, updated: 'هذا الأسبوع', quality: 79 },
  { ar: 'الجنوبي', en: 'Southern', hours: 4.8, speakers: 132, updated: 'هذا الأسبوع', quality: 76 },
  { ar: 'الفصحى', en: 'MSA · formal', hours: 11.3, speakers: 294, updated: 'اليوم', quality: 92 },
]

interface ActiveRun {
  name: string
  dataset: string
  started: string
  eta: string
  gpu: string
  pct: number
  epoch: string
  loss: string
  val: string
}

const ACTIVE_RUNS: ActiveRun[] = [
  { name: 'whisper-ar-v3.5', dataset: 'najdi-12k · hijazi-8k', started: '08:14', eta: '14h 22m', gpu: 'A100 ×4', pct: 62, epoch: '7/12', loss: '0.184', val: '94.2%' },
  { name: 'xtts-najdi-v2.2', dataset: 'najdi-male · 6.1k', started: '06:48', eta: '06h 11m', gpu: 'A100 ×2', pct: 81, epoch: '18/22', loss: '0.092', val: '91.8%' },
  { name: 'qwen-audio-ft-ksa', dataset: 'mixed-ksa · 22k', started: '02:32', eta: '21h 04m', gpu: 'A100 ×4', pct: 28, epoch: '3/10', loss: '0.412', val: '86.4%' },
]

interface EvalRun {
  name: string
  when: string
  bleu: string
  wer: string
  dialect: string
}

const EVAL_RUNS: EvalRun[] = [
  { name: 'whisper-ar-v3.4 · eval-set-v4', when: 'قبل ساعتين', bleu: '42.8', wer: '8.4%', dialect: '93.1%' },
  { name: 'xtts-najdi-v2.1 · eval-najdi', when: 'أمس', bleu: '46.2', wer: '6.9%', dialect: '95.4%' },
]

interface ModelHealth {
  name: string
  replicas: string
  gpu: string
  status: 'good' | 'warn' | 'bad'
  p95: string
  err: string
  vram: string
  spark: number[]
}

const MODEL_HEALTH: ModelHealth[] = [
  { name: 'Whisper-AR', replicas: '2/2', gpu: 'A100', status: 'good', p95: '186ms', err: '0.4%', vram: '34/40', spark: [184, 188, 186, 184, 182, 186, 188, 186, 184, 186, 188, 186] },
  { name: 'XTTS-Najdi', replicas: '3/3', gpu: 'A100', status: 'good', p95: '320ms', err: '0.2%', vram: '22/40', spark: [330, 326, 322, 320, 318, 322, 320, 318, 320, 322, 320, 320] },
  { name: 'XTTS-Hijazi', replicas: '1/2', gpu: 'A100', status: 'warn', p95: '486ms', err: '2.1%', vram: '18/40', spark: [320, 360, 388, 412, 442, 458, 472, 478, 482, 486, 484, 486] },
  { name: 'Qwen2.5-Audio', replicas: '2/2', gpu: 'A100', status: 'good', p95: '386ms', err: '0.6%', vram: '38/40', spark: [380, 382, 384, 386, 384, 388, 386, 384, 386, 388, 386, 386] },
  { name: 'Silero VAD', replicas: '4/4', gpu: 'CPU', status: 'good', p95: '24ms', err: '0.1%', vram: '—', spark: [22, 23, 24, 24, 23, 24, 25, 24, 24, 23, 24, 24] },
  { name: 'Confidence scorer', replicas: '2/2', gpu: 'L40', status: 'good', p95: '38ms', err: '0.3%', vram: '12/48', spark: [36, 37, 38, 38, 37, 38, 39, 38, 38, 37, 38, 38] },
]

// ----- presentational helpers -----------------------------------------

function VoicePanel({
  className,
  ar,
  en,
  icon: Icon,
  badge,
  children,
}: {
  className?: string
  ar: string
  en: string
  icon: typeof Activity
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className={cn('glass-card overflow-hidden p-5', className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
            <Icon size={15} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-extrabold text-[--color-ink]">{ar}</h3>
            <div className="truncate font-en text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              {en}
            </div>
          </div>
        </div>
        {badge}
      </div>
      {children}
    </section>
  )
}

function StatusPill({
  tone,
  ar,
  en,
  pulse,
}: {
  tone: 'good' | 'warn' | 'bad'
  ar: string
  en: string
  pulse?: boolean
}) {
  const cls =
    tone === 'good'
      ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
      : tone === 'warn'
        ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
        : 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]'
  const dotBg = tone === 'good' ? 'bg-[--color-good]' : tone === 'warn' ? 'bg-[--color-warn]' : 'bg-[--color-bad]'
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em]', cls)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dotBg, pulse && 'animate-pulse')} />
      {ar} <span className="opacity-70">· {en}</span>
    </span>
  )
}

function MicroStat({ ar, en, value }: { ar: string; en: string; value: string }) {
  return (
    <div className="rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">{en}</div>
      <div className="text-[10px] font-semibold text-[--color-ink-2]">{ar}</div>
      <div className="mt-0.5 font-en text-[13px] font-extrabold tabular-nums text-[--color-ink]">{value}</div>
    </div>
  )
}

function ActionBtn({
  icon: Icon,
  children,
  tone,
}: {
  icon: typeof Activity
  children: React.ReactNode
  tone?: 'warn'
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em]',
        tone === 'warn'
          ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn] hover:shadow-[0_0_14px_rgba(245,165,36,0.28)]'
          : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-admiral-glow]',
      )}
    >
      <Icon size={10} />
      {children}
    </button>
  )
}

function PipelineMicro({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'good' | 'admiral' | 'warn'
}) {
  const cls =
    tone === 'good'
      ? 'text-[--color-good]'
      : tone === 'admiral'
        ? 'text-[--color-admiral-glow]'
        : tone === 'warn'
          ? 'text-[--color-warn]'
          : 'text-[--color-ink]'
  return (
    <div className="rounded-md border border-[--color-line] bg-white/[0.03] px-1.5 py-1">
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">{label}</div>
      <div className={cn('font-en text-[11px] font-extrabold tabular-nums', cls)}>{value}</div>
    </div>
  )
}

function FlowArrow() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14">
      <path d="M0 7 L9 7" stroke="rgba(78,163,255,0.5)" strokeWidth="1.2" />
      <path d="M9 3 L12 7 L9 11 Z" fill="rgba(78,163,255,0.7)" />
    </svg>
  )
}

function ModelOrchestrationDiagram() {
  const nodes = [
    { id: 'mic', x: 60, y: 72, label: 'Mic input', sub: 'edge-stream', metric: '4.2k req/min' },
    { id: 'vad', x: 200, y: 72, label: 'Silero VAD', sub: 'v4.0 · CPU', metric: 'p95 24ms' },
    { id: 'asr', x: 360, y: 72, label: 'Whisper-AR', sub: 'large-v3 · A100', metric: '842/min · p95 186ms' },
    { id: 'conf', x: 360, y: 200, label: 'Confidence scorer', sub: 'v1.2 · L40', metric: '38ms' },
    { id: 'qwen', x: 540, y: 72, label: 'Qwen2.5-Audio', sub: 'v0.9.7 · A100×2', metric: '218/min · ctx 8k' },
    { id: 'router', x: 720, y: 72, label: 'Tool router', sub: 'fleet · kb · cal', metric: '6 tools · ok 99%' },
    { id: 'tts', x: 540, y: 200, label: 'XTTS-Najdi', sub: 'v2.1 · A100', metric: '514/min · 320ms' },
    { id: 'out', x: 720, y: 200, label: 'Audio out', sub: 'edge-replay', metric: 'p95 412ms' },
  ]
  const edges: { from: string; to: string; label?: string }[] = [
    { from: 'mic', to: 'vad', label: 'PCM' },
    { from: 'vad', to: 'asr', label: 'voiced' },
    { from: 'asr', to: 'qwen', label: 'AR text' },
    { from: 'asr', to: 'conf', label: 'tokens' },
    { from: 'qwen', to: 'router', label: 'intent' },
    { from: 'qwen', to: 'tts', label: 'reply text' },
    { from: 'tts', to: 'out', label: 'wav' },
  ]
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 800 280" width="100%" className="min-w-[760px]" style={{ height: 280 }}>
        <defs>
          <linearGradient id="orch-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(78,163,255,0.08)" />
            <stop offset="100%" stopColor="rgba(78,163,255,0.5)" />
          </linearGradient>
          <radialGradient id="orch-node" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0%" stopColor="rgba(11,16,36,0.95)" />
            <stop offset="100%" stopColor="rgba(11,16,36,0.7)" />
          </radialGradient>
        </defs>

        {edges.map((e, i) => {
          const a = byId[e.from]
          const b = byId[e.to]
          const dx = b.x - a.x
          const cy = (a.y + b.y) / 2
          const d = `M${a.x + 60},${a.y} C${a.x + 60 + dx * 0.25},${cy} ${b.x - 60 - dx * 0.25},${cy} ${b.x - 60},${b.y}`
          const pid = `orch-path-${i}`
          return (
            <g key={i}>
              <path id={pid} d={d} fill="none" stroke="url(#orch-edge)" strokeWidth="1.2" />
              {e.label && (
                <text
                  x={(a.x + b.x) / 2}
                  y={cy - 4}
                  textAnchor="middle"
                  style={{ font: '700 9px ui-sans-serif, system-ui', letterSpacing: '0.16em' }}
                  className="fill-[--color-faint]"
                >
                  {e.label}
                </text>
              )}
              <circle r="2" fill="#4ea3ff" style={{ filter: 'drop-shadow(0 0 4px #4ea3ff)' }}>
                <animateMotion dur={`${2.4 + (i % 4) * 0.4}s`} begin={`${i * 0.18}s`} repeatCount="indefinite">
                  <mpath href={`#${pid}`} />
                </animateMotion>
              </circle>
            </g>
          )
        })}

        {nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x - 60}
              y={n.y - 26}
              width={120}
              height={52}
              rx={10}
              fill="url(#orch-node)"
              stroke="rgba(78,163,255,0.4)"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(0 0 8px rgba(78,163,255,0.18))' }}
            />
            <circle cx={n.x - 50} cy={n.y - 16} r="2.6" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 4px #22c55e)' }} />
            <text
              x={n.x - 42}
              y={n.y - 12}
              style={{ font: '800 10px ui-sans-serif, system-ui' }}
              className="fill-[--color-ink]"
            >
              {n.label}
            </text>
            <text
              x={n.x - 42}
              y={n.y + 2}
              style={{ font: '700 8px ui-sans-serif, system-ui', letterSpacing: '0.14em' }}
              className="fill-[--color-faint]"
            >
              {n.sub.toUpperCase()}
            </text>
            <text
              x={n.x - 42}
              y={n.y + 16}
              style={{ font: '700 9px ui-sans-serif, system-ui' }}
              className="fill-[--color-admiral-glow]"
            >
              {n.metric}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function PhonemeBars() {
  const data = [
    { l: 'ع', v: 96 },
    { l: 'ح', v: 92 },
    { l: 'ق', v: 88 },
    { l: 'خ', v: 84 },
    { l: 'ض', v: 78 },
    { l: 'ظ', v: 71 },
  ]
  const max = 100
  return (
    <ul className="flex flex-col gap-1">
      {data.map((d) => (
        <li key={d.l} className="flex items-center gap-1.5">
          <span className="w-3 text-center text-[11px] font-extrabold text-[--color-ink]">{d.l}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
              style={{ width: `${(d.v / max) * 100}%` }}
            />
          </div>
          <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-admiral-glow]">{d.v}</span>
        </li>
      ))}
    </ul>
  )
}

function DonutChart({
  data,
  size = 96,
}: {
  data: { label: string; value: number; color: string }[]
  size?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = size / 2 - 8
  const cx = size / 2
  const cy = size / 2
  let acc = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      {data.map((d, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI / 2
        acc += d.value
        const end = (acc / total) * Math.PI * 2 - Math.PI / 2
        const large = end - start > Math.PI ? 1 : 0
        const x1 = cx + Math.cos(start) * r
        const y1 = cy + Math.sin(start) * r
        const x2 = cx + Math.cos(end) * r
        const y2 = cy + Math.sin(end) * r
        const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={d.color}
            strokeWidth="10"
            strokeLinecap="butt"
            style={{ filter: `drop-shadow(0 0 4px ${d.color})` }}
          />
        )
      })}
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        style={{ font: '800 13px ui-sans-serif, system-ui' }}
        className="fill-[--color-ink]"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 11}
        textAnchor="middle"
        style={{ font: '700 8px ui-sans-serif, system-ui', letterSpacing: '0.18em' }}
        className="fill-[--color-faint]"
      >
        TOTAL
      </text>
    </svg>
  )
}

function HourHeatmap() {
  const hours = Array.from({ length: 24 }, (_, h) => {
    const peak = Math.exp(-((h - 20) ** 2) / 14) * 0.9 + Math.exp(-((h - 12) ** 2) / 18) * 0.5
    return Math.min(1, peak + ((h * 13) % 5) / 30)
  })
  return (
    <div className="flex h-12 items-end gap-[2px]">
      {hours.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
          <span
            className="w-full rounded-sm"
            style={{
              height: `${Math.max(8, v * 100)}%`,
              background: `rgba(78,163,255,${0.18 + v * 0.8})`,
              boxShadow: v > 0.6 ? `0 0 6px rgba(78,163,255,${v * 0.6})` : 'none',
            }}
          />
        </div>
      ))}
    </div>
  )
}

function SequenceDiagram() {
  const lanes = [
    { x: 80, ar: 'المشغّل', en: 'Operator' },
    { x: 280, ar: 'وكيل الحافة', en: 'Edge agent' },
    { x: 480, ar: 'منسّق السحابة', en: 'Cloud orchestrator' },
    { x: 680, ar: 'محرّكات الروبوت', en: 'Robot motors' },
  ]
  const messages = [
    { y: 80, from: 0, to: 1, label: 'audio_chunk', t: '00:00.00', tone: '#4ea3ff' },
    { y: 124, from: 1, to: 2, label: 'transcript · 96%', t: '00:00.18', tone: '#4ea3ff' },
    { y: 168, from: 2, to: 3, label: 'command · move(lobby)', t: '00:00.46', tone: '#22c55e' },
    { y: 212, from: 3, to: 2, label: 'ack · executing', t: '00:00.52', tone: '#22c55e' },
    { y: 256, from: 3, to: 2, label: 'motion · 14% complete', t: '00:01.04', tone: '#f5a524' },
    { y: 300, from: 2, to: 0, label: 'voice_reply · streaming', t: '00:01.24', tone: '#4ea3ff' },
  ]
  const height = 360
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 760 ${height}`} width="100%" className="min-w-[760px]" style={{ height }}>
        {lanes.map((l) => (
          <g key={l.en}>
            <rect
              x={l.x - 70}
              y={20}
              width={140}
              height={32}
              rx={8}
              fill="rgba(11,16,36,0.85)"
              stroke="rgba(78,163,255,0.32)"
            />
            <text
              x={l.x}
              y={36}
              textAnchor="middle"
              style={{ font: '800 11px ui-sans-serif, system-ui' }}
              className="fill-[--color-ink]"
            >
              {l.ar}
            </text>
            <text
              x={l.x}
              y={48}
              textAnchor="middle"
              style={{ font: '700 8px ui-sans-serif, system-ui', letterSpacing: '0.18em' }}
              className="fill-[--color-faint]"
            >
              {l.en.toUpperCase()}
            </text>
            <line x1={l.x} y1={56} x2={l.x} y2={height - 12} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 5" />
          </g>
        ))}

        {messages.map((m, i) => {
          const x1 = lanes[m.from].x
          const x2 = lanes[m.to].x
          const dir = x2 > x1 ? 1 : -1
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={m.y}
                x2={x2 - dir * 8}
                y2={m.y}
                stroke={m.tone}
                strokeWidth="1.2"
                style={{ filter: `drop-shadow(0 0 4px ${m.tone})` }}
              />
              <polygon
                points={`${x2},${m.y} ${x2 - dir * 8},${m.y - 4} ${x2 - dir * 8},${m.y + 4}`}
                fill={m.tone}
              />
              <text
                x={(x1 + x2) / 2}
                y={m.y - 6}
                textAnchor="middle"
                style={{ font: '700 9.5px ui-sans-serif, system-ui' }}
                className="fill-[--color-ink-2]"
              >
                {m.label}
              </text>
              <text
                x={(x1 + x2) / 2}
                y={m.y + 14}
                textAnchor="middle"
                style={{ font: '700 8.5px ui-sans-serif, system-ui', letterSpacing: '0.16em' }}
                className="fill-[--color-faint]"
              >
                {m.t}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function ReplayButton() {
  const [on, setOn] = useState(false)
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] transition-shadow',
        on
          ? 'border-[rgba(78,163,255,0.5)] bg-[--color-admiral]/20 text-[--color-admiral-glow] shadow-[0_0_18px_rgba(78,163,255,0.32)]'
          : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-admiral-glow]',
      )}
    >
      {on ? <Pause size={11} /> : <Play size={11} fill="currentColor" />}
      {on ? 'Replaying' : 'Replay'}
    </button>
  )
}

function ConversationRow({ c, last }: { c: ConvoLog; last: boolean }) {
  const [open, setOpen] = useState(false)
  const outcomeCls =
    c.outcome === 'success'
      ? 'border-[--color-good]/30 bg-[--color-good]/10 text-[--color-good]'
      : c.outcome === 'escalation'
        ? 'border-[--color-warn]/30 bg-[--color-warn]/10 text-[--color-warn]'
        : 'border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]'
  const outcomeAr = c.outcome === 'success' ? 'نجاح' : c.outcome === 'escalation' ? 'تصعيد' : 'إلغاء'
  return (
    <>
      <tr
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'cursor-pointer border-b border-[--color-line] transition-colors hover:bg-white/[0.03]',
          last && !open && 'border-b-0',
        )}
      >
        <Td>
          <span className="font-mono text-[11px] font-bold tabular-nums text-[--color-admiral-glow]">{c.id}</span>
        </Td>
        <Td>
          <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">{c.started}</span>
        </Td>
        <Td>
          <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink]">{c.robot}</span>
        </Td>
        <Td>
          <span className="text-[12px] font-bold text-[--color-ink]">{c.operator}</span>
        </Td>
        <Td>
          <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">{c.turns}</span>
        </Td>
        <Td>
          <span
            className={cn(
              'font-en text-[11px] font-bold tabular-nums',
              c.conf >= 90 ? 'text-[--color-good]' : c.conf >= 80 ? 'text-[--color-admiral-glow]' : 'text-[--color-warn]',
            )}
          >
            {c.conf}%
          </span>
        </Td>
        <Td>
          <span className={cn('inline-flex items-center rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em]', outcomeCls)}>
            {outcomeAr} · {c.outcome}
          </span>
        </Td>
        <Td>
          <span className="font-en text-[11px] font-bold tabular-nums text-[--color-ink-2]">{c.duration}</span>
        </Td>
      </tr>
      {open && (
        <tr className={cn(!last && 'border-b border-[--color-line]')}>
          <td colSpan={8} className="bg-black/30 px-3 py-3">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {c.preview.map((p, i) => (
                <div key={i} className="rounded-lg border border-[--color-line] bg-black/40 p-2">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                      turn {i + 1}
                    </span>
                    <span className="font-en text-[9px] font-bold uppercase tracking-[0.16em] text-[--color-admiral-glow]">
                      user → robot
                    </span>
                  </div>
                  <p dir="rtl" className="text-[11.5px] font-bold text-[--color-ink]">
                    “{p.user}”
                  </p>
                  <div className="my-1 h-px bg-gradient-to-r from-transparent via-[rgba(78,163,255,0.32)] to-transparent" />
                  <p dir="rtl" className="text-[11.5px] font-semibold text-[--color-ink-2]">
                    {p.bot}
                  </p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function CorpusTotal({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">{label}</div>
      <div className="font-en text-[14px] font-extrabold tabular-nums text-[--color-ink]">{value}</div>
    </div>
  )
}

function RunMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'good' | 'warn'
}) {
  const cls = tone === 'good' ? 'text-[--color-good]' : tone === 'warn' ? 'text-[--color-warn]' : 'text-[--color-ink]'
  return (
    <div className="rounded-md border border-[--color-line] bg-white/[0.03] px-2 py-1">
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">{label}</div>
      <div className={cn('font-en text-[12px] font-extrabold tabular-nums', cls)}>{value}</div>
    </div>
  )
}

function EvalChip({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'good' | 'warn'
}) {
  const cls = tone === 'good' ? 'text-[--color-good]' : tone === 'warn' ? 'text-[--color-warn]' : 'text-[--color-admiral-glow]'
  return (
    <div className="rounded-md border border-[--color-line] bg-white/[0.03] px-2 py-1.5 text-center">
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">{label}</div>
      <div className={cn('font-en text-[13px] font-extrabold tabular-nums', cls)}>{value}</div>
    </div>
  )
}

function HealthMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: Tone
}) {
  const cls =
    tone === 'good'
      ? 'text-[--color-good]'
      : tone === 'warn'
        ? 'text-[--color-warn]'
        : tone === 'bad'
          ? 'text-[--color-bad]'
          : tone === 'admiral'
            ? 'text-[--color-admiral-glow]'
            : 'text-[--color-ink]'
  return (
    <div className="rounded-md border border-[--color-line] bg-white/[0.03] px-1.5 py-1 text-center">
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">{label}</div>
      <div className={cn('font-en text-[11px] font-extrabold tabular-nums', cls)}>{value}</div>
    </div>
  )
}

// ---- existing primitives (kept) --------------------------------------

function NavButton({ label, en, target }: { label: string; en: string; target: string }) {
  return (
    <button
      onClick={() => {
        const el = document.getElementById(target)
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 140
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }}
      className="group flex shrink-0 flex-col items-center rounded-xl border border-[--color-line] bg-black/40 px-4 py-2 transition-all hover:border-[rgba(78,163,255,0.4)] hover:bg-[--color-admiral]/10"
    >
      <span className="text-[12px] font-bold text-[--color-ink] group-hover:text-[--color-admiral-glow]">{label}</span>
      <span className="font-en text-[9px] font-semibold uppercase tracking-[0.12em] text-[--color-faint] group-hover:text-[--color-admiral-glow]/80">{en}</span>
    </button>
  )
}

function DialectGrid({
  title,
  en,
  rows,
}: {
  title: string
  en: string
  rows: typeof DIALECTS
}) {
  return (
    <div className="rounded-2xl border border-[--color-line] bg-black/30 p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[12.5px] font-extrabold text-[--color-ink]">{title}</span>
        <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
          {en} · {rows.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {rows.map((d, i) => {
          const status = statusFromTone(d.tone, d.maturity)
          return (
            <div
              key={d.en}
              className="rounded-xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3"
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="truncate text-[12px] font-extrabold text-[--color-ink]">{d.ar}</span>
                <span className="font-en text-[10px] font-bold tabular-nums text-[--color-admiral-glow]">
                  {d.maturity}%
                </span>
              </div>
              <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                {d.en}
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]"
                  style={{ width: `${d.maturity}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="font-en text-[10px] font-bold tabular-nums text-[--color-ink-2]">
                  {corpusHours(i + 3, d.maturity)}k
                  <span className="ms-1 font-en text-[9px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                    hours
                  </span>
                </span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em]',
                    status.cls,
                  )}
                >
                  {status.en}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
