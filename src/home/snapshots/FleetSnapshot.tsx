import { Cpu, Battery, Wifi, MemoryStick } from 'lucide-react'
import { ROBOT_PINS } from '../data'
import { SaudiMap } from '../parts/SaudiMap'
import { UnitreeGo2 } from '../parts/UnitreeGo2'
import { PanelHeader } from '../parts/PanelHeader'

export function FleetSnapshot() {
  const online = ROBOT_PINS.filter((p) => p.status === 'online').length
  const warn = ROBOT_PINS.filter((p) => p.status === 'warn').length
  const offline = ROBOT_PINS.filter((p) => p.status === 'offline').length

  return (
    <div className="glass-card glass-card-hover relative col-span-12 row-span-2 overflow-hidden p-5 lg:col-span-7">
      <PanelHeader ar="إدارة الأسطول" en="Fleet Management" icon={Cpu} cta="عرض الكل" route="fleet" />

      <div className="grid grid-cols-12 gap-4">
        {/* map */}
        <div className="relative col-span-12 md:col-span-7">
          <div className="bg-grid relative aspect-[10/8.5] overflow-hidden rounded-2xl border border-[--color-line] bg-black/30">
            <SaudiMap pins={ROBOT_PINS} className="absolute inset-0 h-full w-full p-3" />
            {/* scanline */}
            <div
              className="pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-[rgba(78,163,255,0.08)] to-transparent"
              style={{ animation: 'scan-line 6s ease-in-out infinite' }}
            />
            {/* legend */}
            <div className="absolute bottom-3 start-3 flex gap-2 rounded-xl border border-[--color-line] bg-black/50 px-3 py-1.5 backdrop-blur-md">
              <Dot color="#22c55e" label="متصل" en={`${online}`} />
              <Dot color="#f5a524" label="تحذير" en={`${warn}`} />
              <Dot color="#7a86a8" label="غير متصل" en={`${offline}`} />
            </div>
            {/* live tag */}
            <div className="absolute top-3 end-3 flex items-center gap-1.5 rounded-lg border border-[rgba(78,163,255,0.3)] bg-black/50 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink] backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[--color-admiral-glow] opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
              </span>
              LIVE · KSA
            </div>
          </div>
        </div>

        {/* go2 + stats */}
        <div className="col-span-12 flex flex-col gap-3 md:col-span-5">
          <div className="relative overflow-hidden rounded-2xl border border-[--color-line] bg-gradient-to-br from-[#0a1330] to-[#050813] p-3">
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-admiral-glow]">
              Featured · Go2 Pro
            </div>
            <div className="mt-1 text-[13px] font-bold text-[--color-ink]">روبوت Go2 — الأسطول الميداني</div>
            <div className="relative mt-1 h-[120px]">
              <UnitreeGo2 className="absolute inset-0 h-full w-full" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Stat ar="الاستقلالية" en="Endurance" val="3.5h" />
              <Stat ar="السرعة" en="Speed" val="3.7m/s" />
              <Stat ar="الحمولة" en="Payload" val="8kg" />
            </div>
          </div>

          {/* live health rows */}
          <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
            <div className="mb-2 font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
              Live Health · Top 3
            </div>
            <ul className="flex flex-col gap-2">
              {ROBOT_PINS.slice(0, 3).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2.5 rounded-xl border border-[--color-line] bg-white/[0.02] px-2.5 py-2"
                >
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      p.status === 'online'
                        ? 'bg-[--color-good]'
                        : p.status === 'warn'
                          ? 'bg-[--color-warn]'
                          : 'bg-[--color-muted]'
                    }`}
                  >
                    {p.status === 'online' && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-[--color-good]/60" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-en text-[11.5px] font-bold text-[--color-ink]">{p.id}</div>
                    <div className="truncate text-[10.5px] font-medium text-[--color-faint]">{p.city}</div>
                  </div>
                  <Metric icon={Battery} v={`${p.battery}%`} />
                  <Metric icon={MemoryStick} v="58%" />
                  <Metric icon={Wifi} v="−54" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dot({ color, label, en }: { color: string; label: string; en: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[10.5px] font-bold text-[--color-ink-2]">{label}</span>
      <span className="font-en text-[10.5px] font-extrabold tabular-nums text-[--color-ink]">{en}</span>
    </div>
  )
}

function Stat({ ar, en, val }: { ar: string; en: string; val: string }) {
  return (
    <div className="rounded-lg border border-[--color-line] bg-black/30 p-2">
      <div className="font-en text-[16px] font-extrabold tabular-nums text-[--color-ink]">{val}</div>
      <div className="text-[10px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className="font-en text-[9px] font-medium uppercase tracking-wide text-[--color-faint]">{en}</div>
    </div>
  )
}

function Metric({
  icon: Icon,
  v,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  v: string
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en text-[10px] font-bold tabular-nums text-[--color-ink-2]">
      <Icon size={10} className="text-[--color-faint]" />
      {v}
    </div>
  )
}
