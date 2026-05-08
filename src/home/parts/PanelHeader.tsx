import { ChevronLeft } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'

interface Props {
  ar: string
  en: string
  icon?: ComponentType<{ size?: number; className?: string }>
  cta?: string
  ctaHref?: string
  badge?: ReactNode
}

export function PanelHeader({ ar, en, icon: Icon, cta, badge }: Props) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
            <Icon size={16} />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[16px] font-extrabold text-[--color-ink]">{ar}</h3>
            {badge}
          </div>
          <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            {en}
          </div>
        </div>
      </div>
      {cta && (
        <button className="group inline-flex items-center gap-1 rounded-lg border border-[--color-line] bg-black/30 px-2.5 py-1.5 text-[11px] font-bold text-[--color-ink-2] transition-colors hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
          <span>{cta}</span>
          <ChevronLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
        </button>
      )}
    </div>
  )
}
