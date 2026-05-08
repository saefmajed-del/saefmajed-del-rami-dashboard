import { GraduationCap, Glasses, Activity, Headphones, Play } from 'lucide-react'
import { PanelHeader } from '../parts/PanelHeader'

const COURSES = [
  { ar: 'الحركة والمشي', en: 'Locomotion', progress: 78, icon: Activity },
  { ar: 'التواصل الصوتي', en: 'Voice Comms', progress: 64, icon: Headphones },
  { ar: 'التحكم بالنظر VR', en: 'VR Operate', progress: 42, icon: Glasses },
]

export function LearningSnapshot() {
  return (
    <div className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-6">
      <PanelHeader ar="التعلم والمشاهدة" en="Learning & Education" icon={GraduationCap} cta="افتح الأكاديمية" />

      <div className="grid grid-cols-12 gap-3">
        {/* simulator viewport */}
        <div className="col-span-12 md:col-span-6">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0c1330] to-[#050813]">
            {/* horizon grid */}
            <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sim-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(78,163,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(78,163,255,0)" />
                </linearGradient>
              </defs>
              <rect width="200" height="60" fill="url(#sim-sky)" />
              {/* grid floor — perspective */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={60 + i * (60 / 8) * (1 + i * 0.2)}
                  x2="200"
                  y2={60 + i * (60 / 8) * (1 + i * 0.2)}
                  stroke="rgba(78,163,255,0.18)"
                  strokeWidth="0.4"
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => {
                const x = 100 + (i - 6) * 16
                return (
                  <line
                    key={`v${i}`}
                    x1={100}
                    y1={60}
                    x2={x}
                    y2={120}
                    stroke="rgba(78,163,255,0.18)"
                    strokeWidth="0.4"
                  />
                )
              })}
              {/* G1 silhouette in distance */}
              <g transform="translate(95 55)">
                <rect x="0" y="0" width="10" height="20" rx="2" fill="rgba(154,165,184,0.35)" />
                <rect x="2" y="-8" width="6" height="9" rx="2" fill="rgba(11,16,36,0.95)" stroke="rgba(78,163,255,0.5)" strokeWidth="0.4" />
                <line x1="3" y1="-5" x2="7" y2="-5" stroke="#4ea3ff" strokeWidth="0.4" />
              </g>
            </svg>
            {/* HUD */}
            <div className="absolute inset-x-3 top-3 flex items-center justify-between">
              <div className="rounded-md border border-[rgba(78,163,255,0.3)] bg-black/55 px-2 py-1 font-en text-[9.5px] font-bold tabular-nums text-[--color-admiral-glow] backdrop-blur-md">
                SIM · 60 FPS · 12 ms
              </div>
              <div className="rounded-md border border-[--color-line] bg-black/55 px-2 py-1 font-en text-[9.5px] font-bold text-[--color-ink-2] backdrop-blur-md">
                CH-04
              </div>
            </div>
            <button className="absolute bottom-3 start-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-[rgba(78,163,255,0.35)] bg-black/55 px-3 py-1.5 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-ink] backdrop-blur-md hover:shadow-[0_0_24px_rgba(78,163,255,0.4)]">
              <Play size={10} fill="currentColor" />
              Resume Sim
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[10.5px]">
            <span className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en font-bold text-[--color-ink-2]">
              <Glasses size={10} className="text-[--color-admiral-glow]" />
              VR · Quest 3
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/30 px-1.5 py-0.5 font-en font-bold text-[--color-ink-2]">
              IMU · Manus Gloves
            </span>
          </div>
        </div>

        {/* courses */}
        <div className="col-span-12 flex flex-col gap-2 md:col-span-6">
          {COURSES.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.en}
                className="rounded-2xl border border-[--color-line] bg-black/30 p-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg border border-[--color-line] bg-[--color-admiral]/10 text-[--color-admiral-glow]">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-[--color-ink]">{c.ar}</div>
                    <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                      {c.en}
                    </div>
                  </div>
                  <span className="font-en text-[12px] font-extrabold tabular-nums text-[--color-admiral-glow]">
                    {c.progress}%
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[--color-admiral] to-[--color-admiral-glow]"
                    style={{ width: `${c.progress}%`, boxShadow: '0 0 12px rgba(78,163,255,0.35)' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
