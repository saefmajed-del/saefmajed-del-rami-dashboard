import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { TOTAL_PAGES } from '@/data/pages'

interface TopbarProps {
  pageIndex: number
  onGoTo: (i: number) => void
}

export function Topbar({ pageIndex, onGoTo }: TopbarProps) {
  const [time, setTime] = useState(formatTime())
  useEffect(() => {
    const t = setInterval(() => setTime(formatTime()), 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[64px] items-center justify-between gap-2 border-b border-black/5 bg-bg/80 px-3 backdrop-saturate-150 backdrop-blur-xl lg:h-[78px] lg:px-9">
      <div className="flex min-w-0 items-center gap-2.5 lg:gap-3.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-admiral to-admiral-2 text-white text-lg font-black shadow-[0_4px_14px_rgba(0,87,183,0.35)] lg:h-11 lg:w-11 lg:text-xl">
          S
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-black -tracking-[0.3px] lg:text-[22px]">
            Savvy KPI · لوحة رامي
          </div>
          <div className="-mt-0.5 hidden text-[13px] text-muted lg:block">Executive Dashboard · Riyadh HQ</div>
        </div>
      </div>

      <div className="hidden items-center gap-2.5 sm:flex">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            aria-label={`اذهب إلى الصفحة ${i + 1}`}
            className={cn(
              'h-2 cursor-pointer rounded-full transition-all duration-300 lg:h-2.5',
              i === pageIndex ? 'w-6 bg-admiral lg:w-8' : 'w-2 bg-line lg:w-2.5',
            )}
          />
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:gap-3.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-bad/20 bg-bad/8 px-2 py-1 text-[10px] font-bold text-bad lg:gap-2 lg:px-3.5 lg:py-2 lg:text-[13px]">
          <Lock size={10} className="stroke-[2.5] lg:hidden" />
          <Lock size={12} className="hidden stroke-[2.5] lg:block" />
          <span className="h-1.5 w-1.5 rounded-full bg-bad lg:h-2 lg:w-2" />
          <span className="hidden sm:inline">READ-ONLY · ملف رامي</span>
          <span className="sm:hidden">READ-ONLY</span>
        </div>
        <div className="hidden font-bold text-[14px] text-ink-2 tabular-nums sm:block">{time}</div>
      </div>
    </header>
  )
}
