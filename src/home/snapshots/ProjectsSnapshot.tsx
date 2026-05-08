import { Building2, Bot, AlertCircle } from 'lucide-react'
import { PROJECTS } from '../data'
import { PanelHeader } from '../parts/PanelHeader'

const BADGE_LABEL = { university: 'جامعة', gov: 'حكومي', accelerator: 'مسرّعة' } as const

export function ProjectsSnapshot() {
  return (
    <div className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-6">
      <PanelHeader ar="المشاريع والشركاء" en="Projects & Partners" icon={Building2} cta="كل المشاريع" />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
        {PROJECTS.map((p) => {
          const onlinePct = (p.online / p.robots) * 100
          return (
            <article
              key={p.en}
              className="group relative overflow-hidden rounded-2xl border border-[--color-line] bg-black/30 p-3 transition-colors hover:border-[rgba(78,163,255,0.32)]"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 font-en text-[11px] font-extrabold text-[--color-ink]">
                  {p.en
                    .split(' ')
                    .filter((w) => /[A-Z]/.test(w[0]))
                    .map((w) => w[0])
                    .slice(0, 3)
                    .join('')}
                </div>
                <span className="rounded-md border border-[--color-line] bg-white/[0.02] px-1.5 py-0.5 text-[9.5px] font-bold text-[--color-ink-2]">
                  {BADGE_LABEL[p.badge]}
                </span>
              </div>
              <div className="text-[12px] font-bold leading-tight text-[--color-ink]">{p.ar}</div>
              <div className="mt-0.5 truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                {p.en}
              </div>

              <div className="mt-3 flex items-center justify-between font-en text-[10.5px] font-bold tabular-nums">
                <span className="inline-flex items-center gap-1 text-[--color-ink-2]">
                  <Bot size={11} className="text-[--color-admiral-glow]" />
                  {p.online}/{p.robots}
                </span>
                {p.alerts > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[--color-warn]">
                    <AlertCircle size={11} />
                    {p.alerts}
                  </span>
                ) : (
                  <span className="text-[--color-good]">OK</span>
                )}
              </div>

              {/* health bar */}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[--color-admiral] to-[--color-admiral-glow]"
                  style={{ width: `${onlinePct}%`, boxShadow: '0 0 12px rgba(78,163,255,0.35)' }}
                />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
