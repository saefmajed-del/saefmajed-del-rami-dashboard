import type { ComponentType } from 'react'
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sparkline } from '@/home/parts/Sparkline'

interface KpiCardProps {
  ar: string
  en: string
  value: string | number
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  spark?: number[]
  icon?: LucideIcon | ComponentType<{ size?: number; className?: string }>
  className?: string
  accent?: boolean
}

export function KpiCard({
  ar,
  en,
  value,
  delta,
  trend,
  spark,
  icon: Icon,
  className,
  accent = false,
}: KpiCardProps) {
  const isUp = trend === 'up'
  const isDown = trend === 'down'
  
  // Logic for "good" vs "bad" delta depends on context, but usually up=good, down=bad.
  // Exception: latency/errors where down=good.
  const isGoodDelta = (isUp && !en.toLowerCase().includes('latency') && !en.toLowerCase().includes('error')) || 
                      (isDown && (en.toLowerCase().includes('latency') || en.toLowerCase().includes('error')))

  const trendCls = isGoodDelta
    ? 'text-[--color-good] bg-[--color-good]/10 border-[--color-good]/20'
    : isDown || isUp
      ? 'text-[--color-warn] bg-[--color-warn]/10 border-[--color-warn]/20'
      : 'text-[--color-muted] bg-white/[0.04] border-[--color-line]'

  const TIcon = isDown ? ArrowDownRight : ArrowUpRight

  return (
    <div
      className={cn(
        'glass-card glass-card-hover relative overflow-hidden p-4 transition-all',
        accent && 'border-[rgba(78,163,255,0.3)] shadow-[0_0_24px_rgba(78,163,255,0.12)]',
        className
      )}
    >
      {accent && (
        <div className="pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full bg-[--color-admiral-glow]/10 blur-2xl" />
      )}
      
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {Icon && <Icon size={12} className="text-[--color-admiral-glow]" />}
            <div className="truncate text-[12px] font-bold text-[--color-ink-2]">{ar}</div>
          </div>
          <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            {en}
          </div>
        </div>
        
        {delta && (
          <span className={cn('inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-en text-[10px] font-bold', trendCls)}>
            {(isUp || isDown) && <TIcon size={10} />}
            {delta}
          </span>
        )}
      </div>

      <div className="mt-3 font-en text-[24px] font-black leading-none tracking-tight tabular-nums text-[--color-ink]">
        {value}
      </div>

      {spark && (
        <div className="mt-2 -mx-1">
          <Sparkline data={spark} trend={trend ?? 'flat'} height={30} />
        </div>
      )}
    </div>
  )
}
