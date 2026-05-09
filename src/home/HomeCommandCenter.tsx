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
import { SystemSnapshots } from './SystemSnapshots'
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
          <section className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Savvy World · Industrial OS
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

          {/* Industrial OS positioning band */}
          <section className="mb-5 overflow-hidden rounded-2xl border border-[rgba(78,163,255,0.18)] bg-gradient-to-l from-[#0a3a7e]/30 via-[#0a1330]/60 to-[#050813]/40 p-4 backdrop-blur-md">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 lg:col-span-8">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15">
                    <span className="font-en text-[12px] font-extrabold leading-none tracking-tight">
                      <span className="text-white">S</span>
                      <span className="text-[--color-admiral-glow]">vv</span>
                    </span>
                  </span>
                  <span className="font-en text-[10px] font-bold uppercase tracking-[0.24em] text-[--color-admiral-glow]">
                    Savvy World · Industrial OS
                  </span>
                </div>
                <p className="mt-2 text-[14px] font-bold leading-relaxed text-[--color-ink]">
                  نظام تشغيل روبوتات وذكاء اصطناعي على مستوى المؤسسات، يدعم البنية التحتية الذكية المتصلة عبر البيئات
                  الصناعية، الحكومية، والمدن الذكية.
                </p>
                <p className="mt-1 max-w-[680px] font-en text-[11px] font-semibold leading-relaxed text-[--color-ink-2]">
                  A real enterprise-grade robotics and AI operating system powering intelligent connected infrastructure
                  across industrial, government, and smart-city environments.
                </p>
              </div>
              <div className="col-span-12 grid grid-cols-3 gap-2 lg:col-span-4">
                <PositioningChip ar="صناعي" en="Industrial" />
                <PositioningChip ar="حكومي" en="Government" />
                <PositioningChip ar="مدن ذكية" en="Smart Cities" />
              </div>
            </div>
          </section>

          {/* Top KPI strip */}
          <section className="mb-5">
            <KpiStrip />
          </section>

          {/* Original 8 platform snapshots */}
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

          {/* New: 6-tile system operations strip */}
          <section className="mb-5">
            <SystemSnapshots />
          </section>

          {/* Alerts band */}
          <section className="mb-2">
            <AlertsBar />
          </section>

          {/* Branded footer */}
          <footer className="mt-8 overflow-hidden rounded-2xl border border-[rgba(78,163,255,0.14)] bg-gradient-to-b from-[#0a1330]/60 to-[#050813]/80">
            <div className="hairline" />
            <div className="grid grid-cols-12 gap-3 p-5">
              <div className="col-span-12 lg:col-span-7">
                <div className="font-en text-[10px] font-bold uppercase tracking-[0.24em] text-[--color-admiral-glow]">
                  Savvy World · Industrial OS
                </div>
                <p className="mt-1.5 text-[13px] font-bold leading-relaxed text-[--color-ink]">
                  منصّة تشغيل ذكاء وروبوتات للمؤسسات السعودية والخليجية والحكومية.
                </p>
                <p className="mt-1 max-w-[640px] font-en text-[11px] font-semibold leading-relaxed text-[--color-ink-2]">
                  Enterprise-grade AI · Robotics OS for KSA / GCC / B2G operations.
                </p>
              </div>
              <div className="col-span-12 flex flex-wrap items-end justify-end gap-2 lg:col-span-5">
                <FooterChip ar="الرياض · KSA" en="Riyadh HQ" />
                <FooterChip ar="إصدار" en="v3.4.2 · Najdi-tuned" />
                <FooterChip ar="حالة" en="All systems · 24/7" tone="good" />
              </div>
            </div>
            <div className="border-t border-[--color-line] px-5 py-2 font-en text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              © 2026 Savvy World · Internal · Built for Mission Control
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

function PositioningChip({ ar, en }: { ar: string; en: string }) {
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/30 p-2.5 text-center">
      <div className="text-[12px] font-extrabold text-[--color-ink]">{ar}</div>
      <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
        {en}
      </div>
    </div>
  )
}

function FooterChip({ ar, en, tone }: { ar: string; en: string; tone?: 'good' }) {
  const accent =
    tone === 'good'
      ? 'border-[--color-good]/30 text-[--color-good] bg-[--color-good]/10'
      : 'border-[--color-line] text-[--color-ink-2] bg-black/30'
  return (
    <span className={`inline-flex flex-col rounded-xl border px-2.5 py-1.5 ${accent}`}>
      <span className="text-[10.5px] font-bold leading-tight text-[--color-ink]">{ar}</span>
      <span className="font-en text-[9.5px] font-semibold uppercase leading-tight tracking-[0.16em] opacity-80">
        {en}
      </span>
    </span>
  )
}
