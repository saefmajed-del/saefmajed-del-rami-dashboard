import {
  GraduationCap,
  Glasses,
  Activity,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Trophy,
  BookOpen,
  ShieldAlert,
  Eye,
  Hand,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { PageShell } from '@/pages-detail/_PageShell'

type IconType = ComponentType<{ size?: number; className?: string }>

const KPIS: { ar: string; en: string; value: string; sub: string; icon: IconType }[] = [
  { ar: 'الدورات', en: 'Courses', value: '14', sub: '٦ مسارات معتمدة', icon: BookOpen },
  { ar: 'المتدربون النشطون', en: 'Active learners', value: '38', sub: 'هذا الأسبوع', icon: GraduationCap },
  { ar: 'متوسّط التقدّم', en: 'Avg progress', value: '67%', sub: '+٤٪ من الشهر الماضي', icon: Activity },
  { ar: 'شهادات صادرة', en: 'Certificates issued', value: '19', sub: 'معتمدة من Savvy World', icon: Trophy },
]

const SCENARIOS: { ar: string; en: string; duration: string; gradient: string; active?: boolean }[] = [
  { ar: 'استقبال لوبي الرياض', en: 'Riyadh Lobby Greeting v2', duration: '08:24', gradient: 'from-[#0a3a7e] to-[#1d4ed8]', active: true },
  { ar: 'جولة معرض حيّ', en: 'Live Showroom Tour', duration: '12:10', gradient: 'from-[#2d7fd9] to-[#003d82]' },
  { ar: 'تحية ضيف VIP', en: 'VIP Guest Welcome', duration: '03:48', gradient: 'from-[#003d82] to-[#0a3a7e]' },
  { ar: 'تجاوز عقبة بشريّة', en: 'Crowd Avoidance', duration: '06:32', gradient: 'from-[#0057b7] to-[#11173a]' },
  { ar: 'بثّ عن بُعد', en: 'Tele-presence Stream', duration: '15:00', gradient: 'from-[#161d4a] to-[#2d7fd9]' },
]

const COURSES: {
  ar: string
  en: string
  instructor: string
  duration: string
  progress: number
  level: 'مبتدئ' | 'متقدّم' | 'خبير'
  icon: IconType
}[] = [
  { ar: 'الحركة والمشي', en: 'Locomotion Mastery', instructor: 'د. ليلى الشهري', duration: '4h 20m', progress: 78, level: 'متقدّم', icon: Activity },
  { ar: 'التواصل الصوتي', en: 'Voice Comms & Dialogue', instructor: 'م. سلطان القحطاني', duration: '3h 05m', progress: 64, level: 'مبتدئ', icon: Headphones },
  { ar: 'التحكم بالنظر VR', en: 'VR Operate Pilot', instructor: 'م. نوف الدوسري', duration: '5h 40m', progress: 42, level: 'متقدّم', icon: Glasses },
  { ar: 'السلامة والإيقاف', en: 'Safety & E-Stop', instructor: 'د. عبدالله الحربي', duration: '2h 15m', progress: 88, level: 'مبتدئ', icon: ShieldAlert },
  { ar: 'الحدود الجغرافية', en: 'Geofencing & Zones', instructor: 'م. ريما العنزي', duration: '3h 30m', progress: 55, level: 'متقدّم', icon: BookOpen },
  { ar: 'الحضور عن بُعد', en: 'Tele-presence', instructor: 'م. فهد المطيري', duration: '4h 50m', progress: 31, level: 'خبير', icon: Eye },
  { ar: 'الرؤية الحاسوبية', en: 'Vision & Perception', instructor: 'د. هند الزهراني', duration: '6h 10m', progress: 47, level: 'خبير', icon: Camera },
  { ar: 'التزام العلامة', en: 'Brand Compliance', instructor: 'أ. منيرة الغامدي', duration: '1h 45m', progress: 92, level: 'مبتدئ', icon: Hand },
]

const TIMELINE: { ar: string; en: string; meta: string; tag: 'lesson' | 'sim' | 'cert' | 'vr' | 'quiz' }[] = [
  { ar: 'أكمل درس "تحية الضيف"', en: 'Lesson completed · Guest Greeting', meta: 'منذ ٤د · سلطان القحطاني', tag: 'lesson' },
  { ar: 'تشغيل محاكاة Riyadh Lobby v2', en: 'Sim run · Riyadh Lobby v2', meta: 'منذ ١٢د · 60 FPS', tag: 'sim' },
  { ar: 'حصل على شهادة Locomotion', en: 'Certificate earned · Locomotion', meta: 'منذ ٤٥د · ليلى الشهري', tag: 'cert' },
  { ar: 'جلسة VR · Quest 3', en: 'VR session · Quest 3 · 22 min', meta: 'اليوم ١١:٠٤ · زمن استجابة 18ms', tag: 'vr' },
  { ar: 'اجتاز اختبار السلامة', en: 'Quiz passed · Safety & E-Stop', meta: 'اليوم ١٠:١٧ · 96/100', tag: 'quiz' },
  { ar: 'محاكاة عبور الزحام', en: 'Sim run · Crowd Avoidance', meta: 'أمس ١٧:٣٠ · بدون اصطدام', tag: 'sim' },
  { ar: 'درس الحدود الجغرافية', en: 'Lesson completed · Geofencing', meta: 'أمس ١٤:٢٢ · ريما العنزي', tag: 'lesson' },
  { ar: 'جلسة VR تجريبية للوبي', en: 'VR session · Lobby preview', meta: 'الأحد · ٣٤ دقيقة', tag: 'vr' },
]

const ACHIEVEMENTS: { ar: string; en: string; icon: IconType; unlocked: boolean }[] = [
  { ar: 'أوّل خطوة', en: 'First Step', icon: Activity, unlocked: true },
  { ar: 'صديق الروبوت', en: 'Robot Buddy', icon: Hand, unlocked: true },
  { ar: 'مايسترو الصوت', en: 'Voice Maestro', icon: Headphones, unlocked: true },
  { ar: 'مهندس النجدي', en: 'Najdi Engineer', icon: ShieldAlert, unlocked: false },
  { ar: 'خبير VR', en: 'VR Expert', icon: Glasses, unlocked: true },
  { ar: 'مدرّب معتمد', en: 'Certified Trainer', icon: Trophy, unlocked: false },
]

const TAG_STYLES: Record<string, string> = {
  lesson: 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 text-[--color-admiral-glow]',
  sim: 'border-[rgba(56,189,248,0.32)] bg-[--color-info]/15 text-[--color-info]',
  cert: 'border-[rgba(212,175,55,0.32)] bg-[--color-gold]/15 text-[--color-gold]',
  vr: 'border-[rgba(154,165,184,0.32)] bg-white/[0.04] text-[--color-ink-2]',
  quiz: 'border-[rgba(34,197,94,0.32)] bg-[--color-good]/15 text-[--color-good]',
}
const TAG_LABELS: Record<string, string> = {
  lesson: 'درس',
  sim: 'محاكاة',
  cert: 'شهادة',
  vr: 'VR',
  quiz: 'اختبار',
}
const LEVEL_STYLES: Record<string, string> = {
  'مبتدئ': 'border-[rgba(34,197,94,0.32)] bg-[--color-good]/15 text-[--color-good]',
  'متقدّم': 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 text-[--color-admiral-glow]',
  'خبير': 'border-[rgba(212,175,55,0.32)] bg-[--color-gold]/15 text-[--color-gold]',
}

export function LearningPage() {
  return (
    <PageShell
      active="learning"
      ar="التعلم والمشاهدة"
      en="Learning & Education"
      icon={GraduationCap}
      description="أكاديمية التدريب على تشغيل وقيادة روبوتات Savvy World — محاكاة فيزيائية، VR، مسارات تعليمية معتمدة، وشهادات."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 px-3 py-2 text-[12px] font-bold text-[--color-admiral-glow] transition-shadow hover:shadow-[0_0_18px_rgba(78,163,255,0.28)]">
          <BookOpen size={12} />
          أكاديمية الروبوت · DJI Style
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-3">
        {/* === KPI cards === */}
        {KPIS.map((k) => {
          const Icon = k.icon
          return (
            <section key={k.en} className="glass-card glass-card-hover col-span-12 p-4 sm:col-span-6 lg:col-span-3">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-[--color-ink]">{k.ar}</div>
                  <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                    {k.en}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="font-en text-[28px] font-black tabular-nums leading-none text-[--color-ink]">
                  {k.value}
                </div>
                <div className="text-[10.5px] font-semibold text-[--color-ink-2]">{k.sub}</div>
              </div>
            </section>
          )
        })}

        {/* === Simulator viewport === */}
        <section className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[--color-ink]">محاكاة التدريب</h2>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Training Simulator · Live
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(34,197,94,0.32)] bg-[--color-good]/12 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[--color-good]" />
                LIVE
              </span>
              <span className="rounded-md border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-admiral-glow]">
                MuJoCo 3.2
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            {/* Viewport */}
            <div className="col-span-12 md:col-span-8">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-[--color-line] bg-gradient-to-b from-[#0c1330] to-[#050813]">
                {/* horizon grid */}
                <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="learn-sim-sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(78,163,255,0.14)" />
                      <stop offset="100%" stopColor="rgba(78,163,255,0)" />
                    </linearGradient>
                    <radialGradient id="learn-sim-pool" cx="50%" cy="100%" r="50%">
                      <stop offset="0%" stopColor="rgba(78,163,255,0.18)" />
                      <stop offset="100%" stopColor="rgba(78,163,255,0)" />
                    </radialGradient>
                  </defs>
                  <rect width="200" height="60" fill="url(#learn-sim-sky)" />
                  <rect y="60" width="200" height="60" fill="url(#learn-sim-pool)" />
                  {Array.from({ length: 10 }).map((_, i) => (
                    <line
                      key={`h${i}`}
                      x1="0"
                      y1={60 + i * (60 / 10) * (1 + i * 0.18)}
                      x2="200"
                      y2={60 + i * (60 / 10) * (1 + i * 0.18)}
                      stroke="rgba(78,163,255,0.18)"
                      strokeWidth="0.4"
                    />
                  ))}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const x = 100 + (i - 8) * 13
                    return (
                      <line
                        key={`v${i}`}
                        x1={100}
                        y1={60}
                        x2={x}
                        y2={120}
                        stroke="rgba(78,163,255,0.16)"
                        strokeWidth="0.4"
                      />
                    )
                  })}
                  {/* targets */}
                  <circle cx="60" cy="92" r="3" fill="none" stroke="rgba(78,163,255,0.4)" strokeWidth="0.4" />
                  <circle cx="60" cy="92" r="6" fill="none" stroke="rgba(78,163,255,0.22)" strokeWidth="0.4" />
                  <circle cx="140" cy="100" r="3" fill="none" stroke="rgba(245,165,36,0.55)" strokeWidth="0.4" />
                  <circle cx="140" cy="100" r="7" fill="none" stroke="rgba(245,165,36,0.25)" strokeWidth="0.4" />
                  {/* G1 silhouette */}
                  <g transform="translate(93 48)">
                    <rect x="0" y="0" width="14" height="26" rx="2.5" fill="rgba(154,165,184,0.4)" />
                    <rect x="3" y="-10" width="8" height="11" rx="2.5" fill="rgba(11,16,36,0.95)" stroke="rgba(78,163,255,0.55)" strokeWidth="0.4" />
                    <line x1="4.5" y1="-6" x2="9.5" y2="-6" stroke="#4ea3ff" strokeWidth="0.5" />
                    {/* arms */}
                    <rect x="-3" y="2" width="3" height="14" rx="1" fill="rgba(154,165,184,0.32)" />
                    <rect x="14" y="2" width="3" height="14" rx="1" fill="rgba(154,165,184,0.32)" />
                    {/* legs */}
                    <rect x="2" y="26" width="4" height="14" rx="1" fill="rgba(154,165,184,0.34)" />
                    <rect x="8" y="26" width="4" height="14" rx="1" fill="rgba(154,165,184,0.34)" />
                  </g>
                </svg>

                {/* Top HUD */}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md border border-[rgba(78,163,255,0.32)] bg-black/55 px-2 py-1 font-en text-[10px] font-bold tabular-nums text-[--color-admiral-glow] backdrop-blur-md">
                      60 FPS · 12 ms
                    </span>
                    <span className="rounded-md border border-[--color-line] bg-black/55 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.14em] text-[--color-ink-2] backdrop-blur-md">
                      Riyadh Lobby v2
                    </span>
                  </div>
                  <span className="rounded-md border border-[rgba(78,163,255,0.32)] bg-black/55 px-2 py-1 font-en text-[10px] font-bold tabular-nums text-[--color-admiral-glow] backdrop-blur-md">
                    MuJoCo 3.2
                  </span>
                </div>

                {/* Side HUD — joints + IMU */}
                <div className="absolute end-3 top-12 flex flex-col gap-1.5">
                  <div className="rounded-md border border-[--color-line] bg-black/55 px-2 py-1 font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2] backdrop-blur-md">
                    JOINTS · 29/29
                  </div>
                  <div className="rounded-md border border-[--color-line] bg-black/55 px-2 py-1 font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2] backdrop-blur-md">
                    IMU drift · 0.02°/s
                  </div>
                  <div className="rounded-md border border-[--color-line] bg-black/55 px-2 py-1 font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2] backdrop-blur-md">
                    Δt · 16.6 ms
                  </div>
                </div>

                {/* Scan line */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div
                    className="absolute inset-x-0 h-[2px] bg-gradient-to-b from-transparent via-[rgba(78,163,255,0.4)] to-transparent"
                    style={{ animation: 'scan-line 5s ease-in-out infinite' }}
                  />
                </div>

                {/* Bottom controls bar */}
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl border border-[rgba(78,163,255,0.22)] bg-black/65 px-2 py-1.5 backdrop-blur-md">
                  <div className="flex items-center gap-1">
                    <button className="grid h-7 w-7 place-items-center rounded-md border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/20 text-[--color-admiral-glow] hover:shadow-[0_0_14px_rgba(78,163,255,0.4)]">
                      <Play size={11} fill="currentColor" />
                    </button>
                    <button className="grid h-7 w-7 place-items-center rounded-md border border-[--color-line] bg-black/40 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                      <Pause size={11} />
                    </button>
                    <button className="grid h-7 w-7 place-items-center rounded-md border border-[--color-line] bg-black/40 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                      <RotateCcw size={11} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                      Slow-mo · 0.25×
                    </button>
                    <button className="rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                      Step
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="inline-flex items-center gap-1 rounded-md border border-[rgba(244,63,94,0.32)] bg-[--color-bad]/12 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-bad] hover:shadow-[0_0_12px_rgba(244,63,94,0.32)]">
                      <span className="h-1.5 w-1.5 animate-blink rounded-full bg-[--color-bad]" />
                      Record
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-black/40 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                      <Camera size={10} />
                      Snapshot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario list */}
            <div className="col-span-12 flex flex-col gap-2 md:col-span-4">
              <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                Scenarios · ٥
              </div>
              {SCENARIOS.map((s) => (
                <div
                  key={s.en}
                  className={`group flex items-center gap-2.5 rounded-xl border p-2 transition-all ${
                    s.active
                      ? 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/10 shadow-[0_0_18px_rgba(78,163,255,0.15)]'
                      : 'border-[--color-line] bg-black/30 hover:border-[rgba(78,163,255,0.22)]'
                  }`}
                >
                  <div
                    className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-[--color-line] bg-gradient-to-br ${s.gradient}`}
                  >
                    <div className="absolute inset-0 bg-grid opacity-30" />
                    {s.active && (
                      <div className="absolute inset-0 grid place-items-center">
                        <Play size={10} className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-bold text-[--color-ink]">{s.ar}</div>
                    <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                      {s.en}
                    </div>
                  </div>
                  <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
                    {s.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === VR & Hardware === */}
        <section className="glass-card glass-card-hover col-span-12 p-5 lg:col-span-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[--color-ink]">VR والأجهزة المرتبطة</h2>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                VR & Hardware bridge
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(34,197,94,0.32)] bg-[--color-good]/12 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" />
              ٣ متّصلة
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Quest 3 */}
            <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Glasses size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[--color-ink]">Meta Quest 3</div>
                  <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                    Headset · Wi-Fi 6E
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(34,197,94,0.32)] bg-[--color-good]/12 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" />
                  متّصل
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">Battery</span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[--color-good] to-[#86efac]"
                    style={{ width: '84%', boxShadow: '0 0 10px rgba(34,197,94,0.4)' }}
                  />
                </div>
                <span className="font-en text-[11px] font-extrabold tabular-nums text-[--color-good]">84%</span>
              </div>
            </div>

            {/* Manus IMU gloves */}
            <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Hand size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[--color-ink]">قفازات Manus IMU</div>
                  <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                    Manus IMU Gloves · Pair
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(34,197,94,0.32)] bg-[--color-good]/12 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" />
                  متّصل
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {['L · 92%', 'R · 88%', 'Calibrated'].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-[--color-line] bg-black/30 px-1.5 py-1 text-center font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* LIDAR replay */}
            <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Eye size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[--color-ink]">جهاز إعادة LIDAR</div>
                  <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                    LIDAR Replay · Livox MID-360
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(34,197,94,0.32)] bg-[--color-good]/12 px-2 py-1 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-good]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[--color-good]" />
                  متّصل
                </span>
              </div>
            </div>

            {/* Mirror to robot toggle */}
            <div className="rounded-2xl border border-[rgba(78,163,255,0.28)] bg-gradient-to-br from-[#0a3a7e]/30 to-[#003d82]/10 p-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-[--color-ink]">المرآة إلى الروبوت الحقيقي</div>
                  <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-admiral-glow]">
                    Mirror to robot · G1-04
                  </div>
                </div>
                <button
                  className="relative h-6 w-11 shrink-0 rounded-full border border-[rgba(78,163,255,0.4)] bg-[--color-admiral]/30 transition-shadow hover:shadow-[0_0_14px_rgba(78,163,255,0.4)]"
                  aria-label="Toggle mirror to robot"
                >
                  <span
                    className="absolute top-0.5 end-0.5 h-4 w-4 rounded-full bg-gradient-to-br from-[--color-admiral-glow] to-[--color-admiral] shadow-[0_0_10px_rgba(78,163,255,0.6)]"
                  />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10.5px]">
                <span className="font-en font-bold uppercase tracking-[0.16em] text-[--color-faint]">Latency</span>
                <span className="font-en text-[14px] font-black tabular-nums text-[--color-admiral-glow]">
                  18 ms
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* === Course catalog === */}
        <section className="glass-card glass-card-hover col-span-12 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[--color-ink]">كتالوج الدورات</h2>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Course Catalog · ٨ مسارات
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {['الكل', 'مبتدئ', 'متقدّم', 'خبير'].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                    i === 0
                      ? 'border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 text-[--color-admiral-glow]'
                      : 'border border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.22)] hover:text-[--color-ink]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.map((c) => {
              const Icon = c.icon
              const isStart = c.progress === 0
              const isDone = c.progress >= 100
              return (
                <div
                  key={c.en}
                  className="group flex flex-col rounded-2xl border border-[--color-line] bg-gradient-to-b from-[rgba(22,29,74,0.5)] to-[rgba(11,16,36,0.7)] p-3 transition-all hover:border-[rgba(78,163,255,0.32)] hover:shadow-[0_0_22px_rgba(78,163,255,0.15)]"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-bold text-[--color-ink]">{c.ar}</div>
                      <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                        {c.en}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold ${LEVEL_STYLES[c.level]}`}
                    >
                      {c.level}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10.5px]">
                    <div className="min-w-0 truncate font-bold text-[--color-ink-2]">{c.instructor}</div>
                    <div className="font-en font-bold tabular-nums text-[--color-faint]">{c.duration}</div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[--color-admiral] to-[--color-admiral-glow]"
                        style={{ width: `${c.progress}%`, boxShadow: '0 0 10px rgba(78,163,255,0.35)' }}
                      />
                    </div>
                    <span className="font-en text-[10.5px] font-extrabold tabular-nums text-[--color-admiral-glow]">
                      {c.progress}%
                    </span>
                  </div>

                  <button
                    className={`mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.16em] transition-shadow ${
                      isDone
                        ? 'border-[rgba(34,197,94,0.32)] bg-[--color-good]/12 text-[--color-good] hover:shadow-[0_0_14px_rgba(34,197,94,0.32)]'
                        : isStart
                          ? 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]'
                          : 'border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 text-[--color-admiral-glow] hover:shadow-[0_0_14px_rgba(78,163,255,0.32)]'
                    }`}
                  >
                    {isDone ? <Trophy size={11} /> : <Play size={11} fill="currentColor" />}
                    {isDone ? 'مكتمل' : isStart ? 'سجّل الآن' : 'متابعة'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* === Activity timeline === */}
        <section className="glass-card glass-card-hover col-span-12 p-5 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[--color-ink]">سجلّ النشاط الأخير</h2>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Recent Activity · ٨ أحداث
              </div>
            </div>
            <button className="rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
              عرض الكل
            </button>
          </div>

          <ol className="relative ms-2 flex flex-col">
            <span className="absolute inset-y-1 start-[7px] w-px bg-gradient-to-b from-transparent via-[rgba(78,163,255,0.2)] to-transparent" />
            {TIMELINE.map((t, i) => (
              <li
                key={i}
                className={`relative ps-6 ${i !== TIMELINE.length - 1 ? 'pb-3' : ''}`}
              >
                <span className="absolute start-[3px] top-1.5 h-[9px] w-[9px] rounded-full border border-[rgba(78,163,255,0.5)] bg-[--color-admiral] shadow-[0_0_10px_rgba(78,163,255,0.55)]" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] ${TAG_STYLES[t.tag]}`}
                      >
                        {TAG_LABELS[t.tag]}
                      </span>
                      <div className="truncate text-[13px] font-bold text-[--color-ink]">{t.ar}</div>
                    </div>
                    <div className="mt-0.5 truncate font-en text-[10.5px] font-semibold text-[--color-faint]">
                      {t.en}
                    </div>
                  </div>
                  <div className="shrink-0 text-end font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
                    {t.meta}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* === Achievements wall === */}
        <section className="glass-card glass-card-hover col-span-12 p-5 lg:col-span-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-extrabold text-[--color-ink]">جدار الإنجازات</h2>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Achievements · ٤ من ٦
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(212,175,55,0.32)] bg-[--color-gold]/12 px-2 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-gold]">
              <Trophy size={10} />
              GOLD TIER
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {ACHIEVEMENTS.map((a) => {
              const Icon = a.icon
              return (
                <div
                  key={a.en}
                  className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border p-3 text-center transition-all ${
                    a.unlocked
                      ? 'border-[rgba(212,175,55,0.32)] bg-gradient-to-b from-[rgba(212,175,55,0.12)] to-[rgba(11,16,36,0.7)] hover:shadow-[0_0_18px_rgba(212,175,55,0.28)]'
                      : 'border-[--color-line] bg-black/30 opacity-65'
                  }`}
                >
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl border ${
                      a.unlocked
                        ? 'border-[rgba(212,175,55,0.4)] bg-gradient-to-br from-[#3a2a05] to-[#1a1408] text-[--color-gold]'
                        : 'border-[--color-line] bg-black/40 text-[--color-faint]'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div
                      className={`text-[12.5px] font-extrabold ${a.unlocked ? 'text-[--color-ink]' : 'text-[--color-muted]'}`}
                    >
                      {a.ar}
                    </div>
                    <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                      {a.en}
                    </div>
                  </div>
                  {a.unlocked ? (
                    <span className="font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-gold]">
                      Unlocked
                    </span>
                  ) : (
                    <span className="font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                      Locked
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
