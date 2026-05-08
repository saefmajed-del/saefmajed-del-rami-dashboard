import { useState, type ReactNode, type ComponentType } from 'react'
import { Sidebar } from '@/home/Sidebar'
import { TopBar } from '@/home/TopBar'

interface Props {
  active: string
  ar: string
  en: string
  icon?: ComponentType<{ size?: number; className?: string }>
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageShell({ active, ar, en, icon: Icon, description, actions, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="min-h-screen text-[--color-ink]">
      <Sidebar active={active} drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
      <div className="lg:ps-[260px]">
        <TopBar onOpenDrawer={() => setDrawerOpen(true)} />
        <main className="px-4 pb-12 pt-4">
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-start gap-3">
              {Icon && (
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Icon size={20} />
                </div>
              )}
              <div>
                <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                  Savvy World · OS / {en}
                </div>
                <h1 className="mt-1 text-[26px] font-black leading-tight md:text-[32px]">
                  {ar}
                  <span className="ms-3 align-middle font-en text-[15px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
                    {en}
                  </span>
                </h1>
                {description && (
                  <p className="mt-1 max-w-[680px] text-[13px] font-medium leading-relaxed text-[--color-ink-2]">
                    {description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DemoPill />
              {actions}
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}

export function DemoPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(245,165,36,0.28)] bg-[--color-warn]/10 px-2.5 py-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-warn]">
      <span className="h-1.5 w-1.5 rounded-full bg-[--color-warn]" />
      بيانات تجريبية · DEMO
    </span>
  )
}

export function ComingSoonStub({ ar, en }: { ar: string; en: string }) {
  return (
    <div className="glass-card grid place-items-center p-12 text-center">
      <div>
        <div className="font-en text-[11px] font-bold uppercase tracking-[0.24em] text-[--color-admiral-glow]">
          Coming soon
        </div>
        <h3 className="mt-2 text-[22px] font-extrabold text-[--color-ink]">{ar}</h3>
        <p className="mt-2 max-w-[420px] text-[13px] leading-relaxed text-[--color-ink-2]">
          {en}
        </p>
      </div>
    </div>
  )
}
