import { AlertTriangle, Info, Wrench, Activity, Cpu } from 'lucide-react'
import { ALERTS } from './data'
import { cn } from '@/lib/utils'

const SYSTEM_ROWS = [
  { ar: 'خدمة الأسطول', en: 'Fleet API', status: 'ok', meta: '99.98%' },
  { ar: 'بث الفيديو', en: 'Stream Edge', status: 'ok', meta: '178 ms' },
  { ar: 'محرك TTS', en: 'TTS Engine', status: 'warn', meta: '2 nodes warm' },
  { ar: 'قاعدة المعرفة', en: 'Knowledge Base', status: 'ok', meta: '12 dialects' },
] as const

export function AlertsBar() {
  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Smart alerts */}
      <div className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-[--color-bad]/30 bg-[--color-bad]/10 text-[--color-bad]">
              <AlertTriangle size={16} />
            </div>
            <div>
              <div className="text-[14px] font-extrabold text-[--color-ink]">تنبيهات ذكية</div>
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Smart Alerts · Live
              </div>
            </div>
          </div>
          <button className="rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10.5px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
            View all
          </button>
        </div>
        <ul className="flex flex-col gap-1.5">
          {ALERTS.map((a) => {
            const tone =
              a.level === 'urgent'
                ? 'border-[--color-bad]/30 bg-[--color-bad]/8 text-[--color-bad]'
                : a.level === 'warn'
                  ? 'border-[--color-warn]/30 bg-[--color-warn]/8 text-[--color-warn]'
                  : 'border-[rgba(78,163,255,0.25)] bg-[--color-admiral]/10 text-[--color-admiral-glow]'
            const Icon = a.level === 'info' ? Info : AlertTriangle
            return (
              <li
                key={a.id}
                className={cn(
                  'flex items-start gap-2.5 rounded-xl border bg-black/30 px-3 py-2 transition-colors',
                  tone,
                )}
              >
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-current/10">
                  <Icon size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-bold text-[--color-ink]">{a.ar}</div>
                  <div className="truncate font-en text-[10px] font-semibold tracking-wide text-[--color-ink-2]">
                    {a.en} · {a.meta}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Predictive maintenance */}
      <div className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-4">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-[rgba(78,163,255,0.3)] bg-[--color-admiral]/10 text-[--color-admiral-glow]">
            <Wrench size={16} />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[--color-ink]">الصيانة التنبؤية</div>
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
              Predictive Maintenance · 30d
            </div>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-2">
          <Mini ar="مفاصل" en="Joints" v="1" tone="warn" />
          <Mini ar="بطاريات" en="Batteries" v="1" tone="warn" />
          <Mini ar="حساسات" en="Sensors" v="0" tone="urgent" />
        </div>

        <div className="rounded-xl border border-[--color-line] bg-black/30 p-3">
          <div className="mb-2 flex items-center justify-between font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
            <span>Risk Curve · 30d</span>
            <span className="text-[--color-warn]">↑ 1 unit</span>
          </div>
          <svg viewBox="0 0 100 30" className="h-12 w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="risk-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(245,165,36,0.35)" />
                <stop offset="100%" stopColor="rgba(245,165,36,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0 22 L10 20 L20 21 L30 18 L40 16 L50 14 L60 12 L70 11 L80 9 L90 7 L100 5 L100 30 L0 30 Z"
              fill="url(#risk-area)"
            />
            <path
              d="M0 22 L10 20 L20 21 L30 18 L40 16 L50 14 L60 12 L70 11 L80 9 L90 7 L100 5"
              stroke="#f5a524"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* System status */}
      <div className="glass-card col-span-12 overflow-hidden p-5 lg:col-span-3">
        <div className="mb-3 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-[--color-good]/25 bg-[--color-good]/10 text-[--color-good]">
            <Activity size={16} />
          </div>
          <div>
            <div className="text-[14px] font-extrabold text-[--color-ink]">حالة الأنظمة</div>
            <div className="font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
              System Status
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-1.5">
          {SYSTEM_ROWS.map((r) => (
            <li
              key={r.en}
              className="flex items-center gap-2 rounded-lg border border-[--color-line] bg-black/30 px-2.5 py-1.5"
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  r.status === 'ok'
                    ? 'bg-[--color-good] shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                    : 'bg-[--color-warn] shadow-[0_0_8px_rgba(245,165,36,0.6)]',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-bold text-[--color-ink-2]">{r.ar}</div>
                <div className="truncate font-en text-[9.5px] font-semibold tracking-wide text-[--color-faint]">
                  {r.en}
                </div>
              </div>
              <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2]">{r.meta}</span>
            </li>
          ))}
        </ul>
        <div className="hairline mt-3" />
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[--color-line] bg-black/30 px-2.5 py-2">
          <Cpu size={13} className="text-[--color-admiral-glow]" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-[--color-ink]">حِمل الحوسبة</div>
            <div className="font-en text-[9.5px] font-semibold uppercase tracking-wide text-[--color-faint]">
              Edge Compute
            </div>
          </div>
          <span className="font-en text-[12px] font-extrabold tabular-nums text-[--color-admiral-glow]">42%</span>
        </div>
      </div>
    </div>
  )
}

function Mini({ ar, en, v, tone }: { ar: string; en: string; v: string; tone: 'warn' | 'urgent' }) {
  const c = tone === 'urgent' ? '--color-bad' : '--color-warn'
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/30 p-2">
      <div className="font-en text-[20px] font-extrabold leading-none tabular-nums" style={{ color: `var(${c})` }}>
        {v}
      </div>
      <div className="mt-1 text-[10px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className="font-en text-[9px] font-semibold uppercase tracking-wide text-[--color-faint]">{en}</div>
    </div>
  )
}
