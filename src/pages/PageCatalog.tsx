import type { CatalogEntry } from '@/types'

interface PageCatalogProps {
  entries: CatalogEntry[]
}

export function PageCatalog({ entries }: PageCatalogProps) {
  return (
    <>
      <div className="grid h-full grid-cols-3 grid-rows-2 gap-3.5">
        {entries.map((e) => (
          <div
            key={e.title}
            className="relative flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-black/5 bg-card shadow-[0_8px_30px_rgba(20,20,40,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(0,61,130,0.12)]"
          >
            <div
              className="relative grid h-1/2 place-items-center overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${e.gradient[0]}, ${e.gradient[1]})` }}
            >
              <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" className="opacity-50">
                <circle cx="40" cy="50" r="30" fill="white" opacity="0.2" />
                <circle cx="160" cy="40" r="20" fill="white" opacity="0.15" />
                <rect x="80" y="60" width="60" height="20" rx="4" fill="white" opacity="0.2" />
              </svg>
              {e.best && (
                <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-extrabold text-white">
                  ⭐ الأعلى
                </span>
              )}
              <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-sm font-black text-admiral shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                ▶
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <div className="text-[16px] font-black -tracking-[0.2px]">{e.title}</div>
              <div className="text-[12px] font-semibold text-muted">{e.meta}</div>
              <div className="mt-1.5 flex gap-3 text-[11px]">
                <span className="flex items-center gap-1 font-bold text-ink-2">👁 {e.views}</span>
                <span className="flex items-center gap-1 font-bold text-ink-2">❤ {e.likes}</span>
                <span className="flex items-center gap-1 font-bold text-ink-2">🔁 {e.shares}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
