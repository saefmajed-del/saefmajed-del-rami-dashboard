import { NAV } from './data'
import { SavvyLogo } from './SavvyLogo'
import { cn } from '@/lib/utils'
import { ChevronLeft, ShieldCheck, X, Cpu, Activity, MapPin } from 'lucide-react'
import { useNavigate, type RouteId } from '@/lib/router'

interface SidebarProps {
  active: string
  drawerOpen?: boolean
  onCloseDrawer?: () => void
}

// Group nav into 3 enterprise sections so the menu reads like an OS, not a list.
const GROUPS: { ar: string; en: string; ids: RouteId[] }[] = [
  { ar: 'العمليات', en: 'Operations', ids: ['home', 'fleet', 'projects'] },
  { ar: 'الذكاء والمحتوى', en: 'Intelligence & Content', ids: ['media', 'language', 'brand'] },
  { ar: 'الأكاديمية والإدارة', en: 'Academy & Admin', ids: ['learning', 'reports', 'settings'] },
]

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
          'fixed inset-0 z-40 bg-black/65 backdrop-blur-md transition-opacity duration-300 lg:hidden',
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed top-0 bottom-0 z-50 w-[284px] flex flex-col transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
          'lg:w-[260px] lg:translate-x-0',
          // RTL hide: slide off the START edge — in RTL, that's the RIGHT edge,
          // so a positive translate-x moves it off-screen-right.
          drawerOpen ? 'translate-x-0' : 'translate-x-[110%] lg:translate-x-0',
        )}
        style={{ insetInlineStart: 0 }}
      >
        <div className="m-3 lg:m-4 flex flex-1 flex-col overflow-hidden rounded-[24px] border border-[rgba(78,163,255,0.16)] bg-gradient-to-b from-[#10173a]/80 via-[#0b1024]/85 to-[#070a1c]/90 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]">
          {/* decorative top glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(78,163,255,0.18),transparent_70%)]" />

          {/* Brand block */}
          <div className="relative flex items-start justify-between gap-2 px-5 pt-5 pb-4">
            <button
              onClick={() => handleSelect('home')}
              className="flex items-center gap-3 text-start group"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.28)] bg-gradient-to-br from-[#0a3a7e]/55 to-[#003d82]/30 transition-shadow group-hover:shadow-[0_0_18px_rgba(78,163,255,0.35)]">
                <span
                  className="font-en font-extrabold text-[15px] leading-none"
                  style={{ letterSpacing: '-0.06em' }}
                >
                  <span className="text-white">S</span>
                  <span className="text-[#4ea3ff]">vv</span>
                </span>
              </div>
              <div className="min-w-0">
                <SavvyLogo height={20} />
                <div className="mt-1 font-en text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                  AI · Robotics OS
                </div>
              </div>
            </button>
            {onCloseDrawer && (
              <button
                onClick={onCloseDrawer}
                aria-label="إغلاق"
                className="lg:hidden grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[--color-line] bg-black/30 text-[--color-ink-2] transition-colors hover:text-[--color-ink]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* status strip */}
          <div className="mx-5 mb-3 flex items-center gap-2 rounded-lg border border-[rgba(78,163,255,0.14)] bg-black/40 px-2.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[--color-good] opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-good]" />
            </span>
            <span className="font-en text-[9.5px] font-bold uppercase tracking-[0.2em] text-[--color-good]">
              Online
            </span>
            <span className="ms-auto font-en text-[9.5px] font-semibold tabular-nums text-[--color-ink-2]">
              8 / 10 Robots
            </span>
          </div>

          <div className="hairline mx-5" />

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            {GROUPS.map((group, gi) => (
              <div key={group.en} className={cn(gi > 0 && 'mt-4')}>
                <div className="flex items-baseline justify-between px-3 pb-1.5">
                  <span className="text-[10px] font-extrabold text-[--color-ink-2]">{group.ar}</span>
                  <span className="font-en text-[8.5px] font-semibold uppercase tracking-[0.22em] text-[--color-faint]">
                    {group.en}
                  </span>
                </div>
                <ul className="flex flex-col gap-0.5">
                  {group.ids.map((id) => {
                    const item = NAV.find((n) => n.id === id)!
                    const Icon = item.icon
                    const isActive = item.id === active
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleSelect(item.id)}
                          className={cn(
                            'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-all',
                            isActive
                              ? 'bg-gradient-to-l from-[rgba(78,163,255,0.22)] via-[rgba(10,58,126,0.16)] to-transparent text-[--color-ink]'
                              : 'text-[--color-ink-2] hover:bg-white/[0.05] hover:text-[--color-ink]',
                          )}
                        >
                          {isActive && (
                            <span
                              aria-hidden
                              className="absolute inset-y-1.5 w-[3px] rounded-full bg-[--color-admiral-glow] shadow-[0_0_14px_rgba(78,163,255,0.85)]"
                              style={{ insetInlineStart: 0 }}
                            />
                          )}
                          <span
                            className={cn(
                              'grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all',
                              isActive
                                ? 'border border-[rgba(78,163,255,0.4)] bg-[rgba(78,163,255,0.12)] text-[--color-admiral-glow] shadow-[0_0_12px_rgba(78,163,255,0.25)]'
                                : 'border border-transparent text-[--color-muted] group-hover:border-[--color-line] group-hover:bg-black/30 group-hover:text-[--color-ink]',
                            )}
                          >
                            <Icon size={15} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-[13px] font-bold leading-tight">{item.ar}</div>
                            <div
                              className={cn(
                                'truncate font-en text-[9.5px] font-semibold uppercase leading-tight tracking-[0.16em]',
                                isActive ? 'text-[--color-admiral-glow]' : 'text-[--color-faint]',
                              )}
                            >
                              {item.en}
                            </div>
                          </div>
                          {item.badge != null && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[--color-bad]/20 px-1.5 font-en text-[10px] font-bold tabular-nums text-[--color-bad]">
                              {item.badge}
                            </span>
                          )}
                          <ChevronLeft
                            size={13}
                            className={cn(
                              'shrink-0 transition-all',
                              isActive ? 'opacity-70 -translate-x-0.5' : 'opacity-0 group-hover:opacity-40',
                            )}
                          />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer — vital signs cluster */}
          <div className="px-3 pb-3 pt-2">
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <VitalChip icon={Cpu} v="42%" label="CPU" />
              <VitalChip icon={Activity} v="178ms" label="Latency" />
              <VitalChip icon={MapPin} v="KSA" label="Region" />
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-[--color-line] bg-black/40 px-3 py-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[--color-good]/15 text-[--color-good]">
                <ShieldCheck size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11.5px] font-bold text-[--color-ink]">جميع الأنظمة تعمل</div>
                <div className="font-en text-[9.5px] font-medium tracking-wide text-[--color-faint]">
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

function VitalChip({
  icon: Icon,
  v,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  v: string
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/30 px-2 py-1.5">
      <Icon size={11} className="text-[--color-admiral-glow]" />
      <div className="min-w-0 leading-tight">
        <div className="font-en text-[10.5px] font-extrabold tabular-nums text-[--color-ink]">{v}</div>
        <div className="font-en text-[8px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
          {label}
        </div>
      </div>
    </div>
  )
}
