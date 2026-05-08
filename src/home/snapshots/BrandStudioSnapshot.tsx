import { Shirt, Palette, Save } from 'lucide-react'
import { useState } from 'react'
import { PanelHeader } from '../parts/PanelHeader'
import { UnitreeG1 } from '../parts/UnitreeG1'
import { UnitreeR1 } from '../parts/UnitreeR1'
import { UnitreeGo2 } from '../parts/UnitreeGo2'
import { cn } from '@/lib/utils'

const MODELS = [
  { id: 'g1', ar: 'يونيتري G1', en: 'Unitree G1', meta: 'Humanoid · 1.30m · 29-DOF' },
  { id: 'r1', ar: 'يونيتري R1', en: 'Unitree R1', meta: 'Humanoid · Concept · 32-DOF' },
  { id: 'go2', ar: 'يونيتري Go2', en: 'Unitree Go2', meta: 'Quadruped · 15kg · 3.7m/s' },
]

const PALETTES = [
  ['#003d82', '#0057b7', '#4ea3ff'],
  ['#0a0a0a', '#3a3a3a', '#dadada'],
  ['#1d3557', '#a8dadc', '#e63946'],
  ['#0f4c5c', '#5f0f40', '#fb8b24'],
]

export function BrandStudioSnapshot() {
  const [active, setActive] = useState('g1')
  const Render = active === 'g1' ? UnitreeG1 : active === 'r1' ? UnitreeR1 : UnitreeGo2
  const tall = active !== 'go2'

  return (
    <div className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-5">
      <PanelHeader
        ar="بناء هوية العلامة التجارية"
        en="Brand & Identity Studio"
        icon={Shirt}
        cta="افتح الستوديو"
      />

      <div className="grid grid-cols-12 gap-3">
        {/* hero render */}
        <div className="col-span-12 sm:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0a1330] via-[#050813] to-[#040611]">
            {/* studio backdrop */}
            <svg viewBox="0 0 200 220" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="studio-spot" cx="0.5" cy="0.4" r="0.55">
                  <stop offset="0%" stopColor="rgba(78,163,255,0.18)" />
                  <stop offset="100%" stopColor="rgba(78,163,255,0)" />
                </radialGradient>
              </defs>
              <rect width="200" height="220" fill="url(#studio-spot)" />
              {/* turntable */}
              <ellipse cx="100" cy="200" rx="78" ry="6" fill="rgba(78,163,255,0.08)" />
              <ellipse cx="100" cy="200" rx="78" ry="6" fill="none" stroke="rgba(78,163,255,0.25)" strokeWidth="0.5" strokeDasharray="2 4" />
            </svg>
            <div className={cn('relative grid place-items-center px-4', tall ? 'h-[280px]' : 'h-[220px]')}>
              <Render className="h-full w-auto" />
            </div>
            {/* model badge */}
            <div className="absolute bottom-3 start-3 rounded-xl border border-[--color-line] bg-black/55 px-2.5 py-1.5 backdrop-blur-md">
              <div className="text-[11px] font-bold text-[--color-ink]">
                {MODELS.find((m) => m.id === active)?.ar}
              </div>
              <div className="font-en text-[9px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                {MODELS.find((m) => m.id === active)?.meta}
              </div>
            </div>
            <div className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-md border border-[rgba(78,163,255,0.3)] bg-black/55 px-2 py-1 font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
              Realistic
            </div>
          </div>
        </div>

        {/* model picker + palette */}
        <div className="col-span-12 flex flex-col gap-2.5 sm:col-span-5">
          <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
            <div className="mb-2 font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              Robot Model
            </div>
            <div className="flex flex-col gap-1.5">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={cn(
                    'group flex items-center justify-between rounded-xl border px-2.5 py-2 transition-all',
                    active === m.id
                      ? 'border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/10 shadow-[0_0_24px_rgba(78,163,255,0.15)]'
                      : 'border-[--color-line] bg-white/[0.02] hover:border-[rgba(78,163,255,0.22)]',
                  )}
                >
                  <div className="text-start">
                    <div className="text-[12px] font-bold text-[--color-ink]">{m.ar}</div>
                    <div className="font-en text-[10px] font-semibold tracking-wide text-[--color-faint]">
                      {m.en}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      active === m.id ? 'bg-[--color-admiral-glow]' : 'bg-[--color-muted]/40',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Palette
              </span>
              <Palette size={12} className="text-[--color-faint]" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {PALETTES.map((p, i) => (
                <button
                  key={i}
                  className={cn(
                    'flex items-center gap-1 rounded-lg border p-1.5',
                    i === 0
                      ? 'border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/10'
                      : 'border-[--color-line] bg-white/[0.02] hover:border-[rgba(78,163,255,0.22)]',
                  )}
                >
                  {p.map((c) => (
                    <span
                      key={c}
                      className="h-5 flex-1 rounded-md"
                      style={{ background: c, boxShadow: `0 0 12px ${c}55` }}
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>

          <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.3)] bg-gradient-to-l from-[#0a3a7e]/40 to-[#003d82]/15 px-3 py-2 text-[12px] font-bold text-[--color-ink] hover:shadow-[0_0_24px_rgba(78,163,255,0.25)]">
            <Save size={12} />
            حفظ القالب
          </button>
        </div>
      </div>
    </div>
  )
}
