import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { KpiStrip } from './KpiStrip'
import { FleetSnapshot } from './snapshots/FleetSnapshot'
import { MediaSnapshot } from './snapshots/MediaSnapshot'
import { AILanguageSnapshot } from './snapshots/AILanguageSnapshot'
import { BrandStudioSnapshot } from './snapshots/BrandStudioSnapshot'
import { ProjectsSnapshot } from './snapshots/ProjectsSnapshot'
import { LearningSnapshot } from './snapshots/LearningSnapshot'
import { ReportsSnapshot } from './snapshots/ReportsSnapshot'
import { SettingsSnapshot } from './snapshots/SettingsSnapshot'
import { AlertsBar } from './AlertsBar'
import { DemoPill } from '@/pages-detail/_PageShell'

export function HomeCommandCenter() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="min-h-screen text-[--color-ink]">
      <Sidebar active="home" drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
      <div className="lg:ps-[260px]">
        <TopBar onOpenDrawer={() => setDrawerOpen(true)} />
        <main className="px-4 pb-12 pt-4">
          {/* Hero salutation */}
          <section className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Savvy World · OS
              </div>
              <h1 className="mt-1 text-[26px] font-black leading-tight text-[--color-ink] md:text-[32px]">
                مساء الخير، <span className="text-[--color-admiral-glow]">رامي</span>
                <span className="ms-3 align-middle font-en text-[16px] font-semibold uppercase tracking-[0.18em] text-[--color-muted]">
                  AI · Robotics Command
                </span>
              </h1>
              <p className="mt-1 max-w-[640px] text-[13px] font-medium leading-relaxed text-[--color-ink-2]">
                ملخّص تنفيذي مباشر للأسطول، الذكاء اللغوي، المحتوى، والمشاريع — مُحدَّث لحظياً.
                <span className="ms-2 font-en text-[11px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                  Live executive overview · KSA fleet · MENA reach
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DemoPill />
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.25)] bg-[--color-admiral]/10 px-2.5 py-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[--color-admiral-glow] opacity-70" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
                </span>
                Live · Mission Control
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-2.5 py-1.5 font-en text-[10.5px] font-bold tracking-[0.12em] text-[--color-ink-2]">
                v3.4.2 · Najdi-tuned
              </span>
            </div>
          </section>

          <section className="mb-5">
            <KpiStrip />
          </section>

          <section className="mb-5 grid grid-cols-12 gap-3">
            <FleetSnapshot />
            <MediaSnapshot />
            <AILanguageSnapshot />
            <BrandStudioSnapshot />
            <ProjectsSnapshot />
            <LearningSnapshot />
            <ReportsSnapshot />
            <SettingsSnapshot />
          </section>

          <section className="mb-2">
            <AlertsBar />
          </section>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 text-center font-en text-[10px] font-semibold uppercase tracking-[0.22em] text-[--color-faint]">
            <span>© 2026 Savvy World · Riyadh · Internal</span>
            <span>Built for Mission Control · 24/7</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
