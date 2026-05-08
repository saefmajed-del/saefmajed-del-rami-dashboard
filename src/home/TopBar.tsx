import { Bell, Search, Sparkles, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SavvyLogo } from './SavvyLogo'
import { useNavigate, useRoute } from '@/lib/router'
import { NAV } from './data'

interface Props {
  onOpenDrawer?: () => void
}

function SaudiFlag({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 16" width={size * 1.4} height={size} aria-label="Saudi Arabia">
      <rect width="24" height="16" rx="2" fill="#006c35" />
      <rect x="3" y="4" width="18" height="0.7" fill="#ffffff" opacity="0.7" />
      <rect x="3" y="5.4" width="14" height="0.5" fill="#ffffff" opacity="0.55" />
      <path d="M3 11 L19 11" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M19 11 L21 10.4 L19 11.6 Z" fill="#ffffff" />
    </svg>
  )
}

export function TopBar({ onOpenDrawer }: Props) {
  const route = useRoute()
  const navigate = useNavigate()
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const dateEn = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const current = NAV.find((n) => n.id === route.id) ?? NAV[0]
  const breadcrumbAr = route.id === 'home' ? 'مركز القيادة' : current.ar
  const breadcrumbEn = route.id === 'home' ? 'Command Center' : current.en

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:ps-[260px]">
      <div className="flex h-[64px] items-center gap-3 rounded-2xl border border-[--color-line] bg-[--color-surface]/70 px-3 backdrop-blur-2xl md:px-4">
        {/* Hamburger (mobile/tablet only) */}
        <button
          onClick={onOpenDrawer}
          aria-label="فتح القائمة"
          className="grid h-10 w-10 place-items-center rounded-xl border border-[--color-line] bg-black/30 text-[--color-ink-2] transition-colors hover:text-[--color-ink] lg:hidden"
        >
          <Menu size={16} />
        </button>

        {/* mobile brand */}
        <button onClick={() => navigate('home')} className="lg:hidden">
          <SavvyLogo height={22} />
        </button>

        {/* breadcrumb */}
        <button
          onClick={() => navigate('home')}
          className="hidden md:flex items-baseline gap-2 hover:opacity-80"
        >
          <span className="text-[15px] font-extrabold text-[--color-ink]">{breadcrumbAr}</span>
          <span className="text-[--color-faint]">·</span>
          <span className="font-en text-[11px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
            {breadcrumbEn}
          </span>
        </button>

        {/* search */}
        <div className="ms-auto hidden md:flex h-10 min-w-[240px] xl:min-w-[280px] items-center gap-2 rounded-xl border border-[--color-line] bg-black/30 px-3 transition-colors focus-within:border-[--color-admiral-2]/50">
          <Search size={15} className="text-[--color-muted]" />
          <input
            type="text"
            placeholder="ابحث عن روبوت، مشروع، تقرير…"
            className="flex-1 bg-transparent text-[13px] text-[--color-ink] placeholder:text-[--color-faint] outline-none"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center rounded-md border border-[--color-line] bg-black/40 px-1.5 font-en text-[10px] font-semibold text-[--color-muted]">
            ⌘K
          </kbd>
        </div>

        {/* AI assistant chip */}
        <button className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-l from-[#0a3a7e]/40 to-[#003d82]/20 px-3 text-[12px] font-bold text-[--color-ink] transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.25)]">
          <Sparkles size={13} className="text-[--color-admiral-glow]" />
          مساعد سَفِي
        </button>

        {/* flag + clock */}
        <div className="hidden xl:flex items-center gap-2.5 rounded-xl border border-[--color-line] bg-black/30 px-3 py-1.5">
          <SaudiFlag />
          <div className="leading-tight">
            <div className="font-en text-[12px] font-bold tabular-nums text-[--color-ink]">{time}</div>
            <div className="font-en text-[9px] font-medium uppercase tracking-[0.16em] text-[--color-faint]">
              KSA · {dateEn}
            </div>
          </div>
        </div>

        {/* bell */}
        <button
          onClick={() => navigate('fleet')}
          aria-label="notifications"
          className="ms-auto md:ms-0 relative grid h-10 w-10 place-items-center rounded-xl border border-[--color-line] bg-black/30 text-[--color-ink-2] transition-colors hover:text-[--color-ink]"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[--color-bad] px-1 font-en text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* user */}
        <button
          onClick={() => navigate('settings')}
          className="flex items-center gap-2.5 rounded-xl border border-[--color-line] bg-black/30 px-2 py-1.5 hover:border-[rgba(78,163,255,0.32)]"
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#0a3a7e] to-[#003d82] font-en text-[12px] font-extrabold text-white">
            RA
          </div>
          <div className="hidden md:block leading-tight text-start">
            <div className="text-[12px] font-bold text-[--color-ink]">رامي العجرمي</div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" />
              <span className="font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-muted]">
                Super Admin
              </span>
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}
