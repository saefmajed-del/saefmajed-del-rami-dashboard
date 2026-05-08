import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { KPIS } from './data'
import { Sparkline } from './parts/Sparkline'

export function KpiStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {KPIS.map((k) => {
        const TrendIcon = k.trend === 'up' ? ArrowUpRight : k.trend === 'down' ? ArrowDownRight : Minus
        const trendColor =
          k.trend === 'up'
            ? 'text-[--color-good] bg-[--color-good]/10 border-[--color-good]/20'
            : k.trend === 'down'
              ? 'text-[--color-warn] bg-[--color-warn]/10 border-[--color-warn]/20'
              : 'text-[--color-muted] bg-white/[0.04] border-[--color-line]'

        return (
          <div
            key={k.en}
            className="glass-card glass-card-hover relative overflow-hidden p-4 transition-all"
          >
            {/* corner glow */}
            <div className="pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full bg-[--color-admiral-glow]/8 blur-2xl" />

            <div className="flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-[12px] font-bold text-[--color-ink-2]">{k.ar}</div>
                <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                  {k.en}
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-en text-[10px] font-bold ${trendColor}`}
              >
                <TrendIcon size={10} />
                {k.delta}
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-2">
              <div className="font-en text-[28px] font-extrabold leading-none tracking-tight tabular-nums text-[--color-ink]">
                {k.value}
              </div>
            </div>

            <div className="mt-2 -mx-1">
              <Sparkline data={k.spark} trend={k.trend} height={32} />
            </div>

            {k.hint && (
              <div className="mt-1 truncate font-en text-[10px] font-medium text-[--color-faint]">{k.hint}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
