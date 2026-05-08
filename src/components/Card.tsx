import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  title: string
  subtitle?: string | ReactNode
  infoKey?: string
  onInfo?: (key: string) => void
  className?: string
  hero?: boolean
  demo?: boolean
  children: ReactNode
}

export function Card({
  title,
  subtitle,
  infoKey,
  onInfo,
  className,
  hero = false,
  demo = true,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[28px] p-5 transition-shadow',
        'shadow-[0_8px_30px_rgba(20,20,40,0.06),0_2px_8px_rgba(20,20,40,0.04)]',
        'hover:shadow-[0_24px_60px_rgba(0,61,130,0.12),0_6px_18px_rgba(20,20,40,0.05)]',
        hero
          ? 'border border-white/5 bg-gradient-to-br from-[#0a1f44] via-[#082c5e] to-[#0a3a7e] text-white'
          : 'border border-black/5 bg-card',
        className,
      )}
    >
      {demo && (
        <span
          className={cn(
            'absolute top-3.5 right-3.5 z-10 rounded-lg border border-warn/30 bg-warn/15 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-warn',
            hero && 'bg-warn/20',
          )}
        >
          DEMO
        </span>
      )}

      <div className="mb-2 flex items-start justify-between gap-2.5">
        <div className="flex-1">
          <div className={cn('text-[18px] font-black -tracking-[0.2px]', hero ? 'text-white' : 'text-ink')}>
            {title}
          </div>
          {subtitle && (
            <div className={cn('mt-0.5 text-[13px] font-medium', hero ? 'text-white/70' : 'text-muted')}>
              {subtitle}
            </div>
          )}
        </div>
        {infoKey && onInfo && (
          <button
            onClick={() => onInfo(infoKey)}
            aria-label="معلومات"
            className={cn(
              'grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full border-none transition-colors',
              hero ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-ink-2 hover:bg-admiral/10 hover:text-admiral',
            )}
          >
            <Info size={14} />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
