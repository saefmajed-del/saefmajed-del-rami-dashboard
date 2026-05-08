import { NAV } from './data'
import { SavvyLogo } from './SavvyLogo'
import { cn } from '@/lib/utils'
import { ChevronLeft, ShieldCheck, X } from 'lucide-react'
import { useNavigate, type RouteId } from '@/lib/router'

interface SidebarProps {
  active: string
  drawerOpen?: boolean
  onCloseDrawer?: () => void
}

export function Sidebar({ active, drawerOpen = false, onCloseDrawer }: SidebarProps) {
  const navigate = useNavigate()
  const handleSelect = (id: string) => {
    navigate(id as RouteId)
    onCloseDrawer?.()
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onCloseDrawer}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed top-0 bottom-0 z-50 w-[280px] flex flex-col transition-transform duration-300 ease-out',
          'lg:w-[260px] lg:translate-x-0 lg:translate-y-0',
          drawerOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0',
        )}
        style={{
          insetInlineStart: 0,
          // RTL: drawer slides in from start (right edge in Arabic). Use logical positioning.
          transform: undefined,
        }}
        dir="rtl"
      >
        <div className="m-4 flex flex-1 flex-col rounded-[24px] border border-[--color-line] bg-[--color-surface]/85 backdrop-blur-2xl shadow-2xl">
          {/* Brand block */}
          <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-4">
            <button onClick={() => handleSelect('home')} className="text-start">
              <SavvyLogo height={32} />
              <div className="mt-1.5 font-en text-[10px] font-medium uppercase tracking-[0.22em] text-[--color-faint]">
                AI · Robotics OS
              </div>
            </button>
            {onCloseDrawer && (
              <button
                onClick={onCloseDrawer}
                aria-label="إغلاق"
                className="lg:hidden grid h-8 w-8 place-items-center rounded-lg border border-[--color-line] bg-black/30 text-[--color-ink-2] hover:text-[--color-ink]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="hairline mx-5" />

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <div className="px-3 pb-2 font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              Workspace
            </div>
            <ul className="flex flex-col gap-0.5">
              {NAV.map((item) => {
                const Icon = item.icon
                const isActive = item.id === active
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSelect(item.id)}
                      className={cn(
                        'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-all',
                        isActive
                          ? 'bg-gradient-to-l from-[#0a3a7e]/40 via-[#0a3a7e]/15 to-transparent text-[--color-ink] shadow-[inset_1px_0_0_rgba(78,163,255,0.55)]'
                          : 'text-[--color-ink-2] hover:bg-white/[0.04] hover:text-[--color-ink]',
                      )}
                    >
                      {isActive && (
                        <span
                          className="absolute inset-y-2 w-[3px] rounded-full bg-[--color-admiral-glow] shadow-[0_0_12px_rgba(78,163,255,0.7)]"
                          style={{ insetInlineStart: -1 }}
                        />
                      )}
                      <Icon size={17} className={cn(isActive ? 'text-[--color-admiral-glow]' : 'text-[--color-muted]')} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[13.5px] font-bold">{item.ar}</div>
                        <div className="truncate font-en text-[10px] font-medium uppercase tracking-[0.14em] text-[--color-faint]">
                          {item.en}
                        </div>
                      </div>
                      {item.badge != null && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[--color-bad]/20 px-1.5 font-en text-[10px] font-bold text-[--color-bad]">
                          {item.badge}
                        </span>
                      )}
                      <ChevronLeft
                        size={14}
                        className={cn(
                          'shrink-0 transition-opacity',
                          isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40',
                        )}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer status pill */}
          <div className="mx-3 mb-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[--color-good]/15 text-[--color-good]">
                <ShieldCheck size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-[--color-ink]">جميع الأنظمة تعمل</div>
                <div className="font-en text-[10px] font-medium tracking-wide text-[--color-faint]">
                  All systems operational
                </div>
              </div>
              <div className="relative h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-[--color-good]" />
                <span className="absolute inset-0 rounded-full bg-[--color-good]/60 animate-pulse-ring" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
