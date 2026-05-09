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
} from 'lucide-react'
import { PageShell } from './_PageShell'
import { SaudiMap } from '@/home/parts/SaudiMap'
import { Waveform } from '@/home/parts/Waveform'
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
          توليد سكربت AI
        </button>
      }
    >
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
          <div className="mt-2.5 rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-3">
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
        <section className="glass-card col-span-12 overflow-hidden p-5">
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
        <section className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-6">
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
