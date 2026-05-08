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
    <header className="fixed inset-x-0 top-0 z-50 flex h-[78px] items-center justify-between border-b border-black/5 bg-bg/80 px-9 backdrop-saturate-150 backdrop-blur-xl">
      <div className="flex items-center gap-3.5">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-admiral to-admiral-2 text-white text-xl font-black shadow-[0_4px_14px_rgba(0,87,183,0.35)]">
          S
        </div>
        <div>
          <div className="text-[22px] font-black -tracking-[0.3px]">Savvy KPI · لوحة رامي</div>
          <div className="-mt-0.5 text-[13px] text-muted">Executive Dashboard · Riyadh HQ</div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            aria-label={`اذهب إلى الصفحة ${i + 1}`}
            className={cn(
              'h-2.5 cursor-pointer rounded-full transition-all duration-300',
              i === pageIndex ? 'w-8 bg-admiral' : 'w-2.5 bg-line',
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-3.5">
        <div className="inline-flex items-center gap-2 rounded-full border border-bad/20 bg-bad/8 px-3.5 py-2 text-[13px] font-bold text-bad">
          <Lock size={12} className="stroke-[2.5]" />
          <span className="h-2 w-2 rounded-full bg-bad" />
          READ-ONLY · ملف رامي
        </div>
        <div className="font-bold text-[14px] text-ink-2 tabular-nums">{time}</div>
      </div>
    </header>
  )
}
