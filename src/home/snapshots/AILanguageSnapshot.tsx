import { Languages, Mic, Play } from 'lucide-react'
import { DIALECTS } from '../data'
import { PanelHeader } from '../parts/PanelHeader'
import { SaudiMap } from '../parts/SaudiMap'
import { Waveform } from '../parts/Waveform'

export function AILanguageSnapshot() {
  const ksa = DIALECTS.filter((d) => d.group === 'KSA')
  const mena = DIALECTS.filter((d) => d.group === 'MENA')
  const global = DIALECTS.filter((d) => d.group === 'Global')

  return (
    <div className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-7">
      <PanelHeader
        ar="الذكاء اللغوي"
        en="AI Language Intelligence"
        icon={Languages}
        cta="ساحة الاختبار"
        badge={
          <span className="rounded-md border border-[rgba(78,163,255,0.25)] bg-[--color-admiral]/10 px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
            v3 · Najdi-tuned
          </span>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        {/* dialect map */}
        <div className="col-span-12 md:col-span-6">
          <div className="bg-grid relative aspect-[10/9] overflow-hidden rounded-2xl border border-[--color-line] bg-black/30">
            <SaudiMap showDialects className="absolute inset-0 h-full w-full p-3" />
            <div className="absolute bottom-2 end-2 flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/50 px-2 py-1 font-en text-[9.5px] font-bold text-[--color-ink-2] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow] shadow-[0_0_8px_rgba(78,163,255,0.7)]" />
              KSA dialect maturity
            </div>
          </div>
        </div>

        {/* live test playground */}
        <div className="col-span-12 flex flex-col gap-3 md:col-span-6">
          <div className="rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] to-[#050813] p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[12px] font-bold text-[--color-ink]">جلسة اختبار حيّة</div>
                <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  Live Voice Session · Najdi
                </div>
              </div>
              <button className="grid h-8 w-8 place-items-center rounded-full border border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/15 text-[--color-admiral-glow] transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.4)]">
                <Play size={12} fill="currentColor" />
              </button>
            </div>
            <div className="mb-2 rounded-xl border border-[--color-line] bg-black/40 p-2.5">
              <div className="mb-1 flex items-center gap-1.5 font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                <Mic size={10} className="text-[--color-admiral-glow]" />
                Input
              </div>
              <div className="text-[12px] font-bold leading-relaxed text-[--color-ink]" dir="rtl">
                "هلا والله بالضيوف، شرّفتم سَفي اليوم — ودّك بقهوة سعودية ولا شاي؟"
              </div>
            </div>
            <div className="rounded-xl border border-[--color-line] bg-black/40 p-2.5">
              <div className="mb-2 flex items-center justify-between font-en text-[9.5px] font-semibold uppercase tracking-[0.16em]">
                <span className="text-[--color-faint]">Synthesis</span>
                <span className="text-[--color-admiral-glow]">94% match</span>
              </div>
              <div className="h-12">
                <Waveform bars={56} />
              </div>
            </div>
          </div>

          {/* group toggles + matures */}
          <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
            <Row title="السعودية" en="KSA" rows={ksa.slice(0, 5)} />
            <div className="hairline my-2.5" />
            <Row title="الشرق الأوسط" en="MENA" rows={mena.slice(0, 4)} />
            <div className="hairline my-2.5" />
            <Row title="عالمي" en="Global" rows={global} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  title,
  en,
  rows,
}: {
  title: string
  en: string
  rows: { ar: string; en: string; maturity: number; tone?: string }[]
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[10.5px] font-extrabold text-[--color-ink-2]">{title}</span>
        <span className="font-en text-[9px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">{en}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {rows.map((r) => (
          <span
            key={r.en}
            className="inline-flex items-center gap-1 rounded-full border border-[--color-line] bg-white/[0.02] px-2 py-0.5"
          >
            <span className="text-[10.5px] font-bold text-[--color-ink]">{r.ar}</span>
            <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-admiral-glow]">{r.maturity}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}
