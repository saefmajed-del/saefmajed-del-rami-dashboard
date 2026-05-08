import { Card } from '@/components/Card'
import { RobotG1Scene } from '@/components/RobotG1Scene'
import { DIALECTS, MATURITY_STYLES, MATURITY_LABELS, MATURITY_DOT_COLORS } from '@/data/dialects'
import { RESEARCH_PARTNERS, RESEARCH_STATUS_LABELS } from '@/data/research'
import { LANGUAGES } from '@/data/brand'
import { cn } from '@/lib/utils'

interface PageProps {
  onInfo: (key: string) => void
}

const HERO_STATS = [
  { num: '147', label: 'حركة المرور (footfall) · ١٠د' },
  { num: '82', unit: '٪', label: 'انطباعات إيجابية' },
  { num: '38', label: 'تواصل بصري مباشر' },
  { num: '24', label: 'مارّون بلا توقّف' },
]

export function Page1Scene({ onInfo }: PageProps) {
  return (
    <div className="grid grid-cols-12 auto-rows-auto gap-3 lg:h-full lg:grid-rows-[minmax(180px,auto)_minmax(180px,auto)] lg:gap-4">
      {/* Hero LiDAR */}
      <Card
        hero
        title="قارئ المشهد · LiDAR + Vision"
        subtitle="الروبوت يرى ٥ أشخاص ويصنّف انطباعاتهم لحظياً"
        infoKey="lidar"
        onInfo={onInfo}
        className="col-span-12 lg:col-span-8 lg:row-span-2"
      >
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(0,87,183,0.18)_0%,transparent_70%)]">
          <div
            className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00B4FF]/60"
            style={{ animation: 'radar 3s ease-out infinite' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00B4FF]/60"
            style={{ animation: 'radar 3s ease-out 1s infinite' }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00B4FF]/60"
            style={{ animation: 'radar 3s ease-out 2s infinite' }}
          />
          <RobotG1Scene />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
              <div className="text-[24px] font-black -tracking-[0.5px] text-white">
                {s.num}
                {s.unit && <span className="mr-0.5 text-[13px] text-white/60">{s.unit}</span>}
              </div>
              <div className="mt-0.5 text-[11px] font-semibold text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live Transcript */}
      <Card
        title="النصّ الحيّ"
        subtitle={
          <>
            حوار سيف وسافي الآن{' '}
            <span className="ml-1.5 inline-flex items-center gap-1.5 rounded-full bg-bad/10 px-2.5 py-1 text-[11px] font-extrabold text-bad">
              <span className="h-1.5 w-1.5 rounded-full bg-bad" style={{ animation: 'blink 1.2s infinite' }} />
              LIVE
            </span>
          </>
        }
        infoKey="transcript"
        onInfo={onInfo}
        className="col-span-12 md:col-span-6 lg:col-span-4"
      >
        <div className="mt-1.5 flex flex-1 flex-col gap-2.5 overflow-hidden">
          {[
            { who: 'سيف', text: 'سافي، اشرح للأطفال كيف يعمل الرادار في عشر ثواني', delay: 0 },
            { who: 'سافي', text: 'يا أبطال، الرادار مثل الخفاش — يرسل صوت ويسمع الصدى ليعرف كل شي حواليه', delay: 0.3 },
            { who: 'سيف', text: 'ممتاز — كرّرها بلهجة سعودية', delay: 0.6 },
          ].map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 opacity-0"
              style={{ animation: `fade-in 0.5s forwards ${line.delay}s` }}
            >
              <span
                className={cn(
                  'w-[60px] shrink-0 rounded-lg px-2 py-1 text-center text-[11px] font-extrabold text-white',
                  line.who === 'سافي' ? 'bg-gold' : 'bg-admiral',
                )}
              >
                {line.who}
              </span>
              <span className="text-[14px] leading-[1.5] text-ink-2">{line.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* R&D */}
      <Card
        title="شراكات الأبحاث"
        subtitle="٥ جامعات نشطة في pipeline سافي"
        infoKey="rd"
        onInfo={onInfo}
        className="col-span-12 md:col-span-6 lg:col-span-4"
      >
        <div className="mt-1.5 flex flex-1 flex-col gap-2">
          {RESEARCH_PARTNERS.map((p) => (
            <div
              key={p.tag}
              className="grid grid-cols-[60px_1fr_auto] items-center gap-2.5 rounded-xl bg-black/[0.025] px-3 py-2"
            >
              <span className="rounded-md bg-admiral/10 px-2 py-1 text-center text-[11px] font-black tracking-wide text-admiral">
                {p.tag}
              </span>
              <div>
                <div className="text-[13px] font-bold">{p.name}</div>
                <div className="mt-0.5 text-[11px] text-muted">{p.phase}</div>
              </div>
              <span
                className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-extrabold', RESEARCH_STATUS_LABELS[p.status].cls)}
              >
                {RESEARCH_STATUS_LABELS[p.status].label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Dialects */}
      <Card
        title="اللهجات العربية · النضج"
        subtitle="٤٠ لهجة مرصودة · ٧ بمستوى إنتاجي"
        infoKey="dialects"
        onInfo={onInfo}
        className="col-span-12 md:col-span-6"
      >
        <div className="mt-2 grid grid-cols-8 content-start gap-1.5">
          {DIALECTS.map((d) => (
            <div
              key={d.name}
              title={`${d.name} · ${MATURITY_LABELS[d.maturity]}`}
              className={cn(
                'grid aspect-square place-items-center rounded-lg p-0.5 text-center text-[9px] font-bold leading-tight',
                MATURITY_STYLES[d.maturity],
              )}
            >
              {d.name}
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] font-semibold text-ink-2">
          {(['mature', 'ready', 'training', 'early', 'planned'] as const).map((m) => (
            <span key={m} className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded" style={{ background: MATURITY_DOT_COLORS[m] }} />
              {MATURITY_LABELS[m]}
            </span>
          ))}
        </div>
      </Card>

      {/* Languages */}
      <Card
        title="اللغات vs الهدف"
        subtitle="📍 = الهدف السنوي"
        infoKey="langs"
        onInfo={onInfo}
        className="col-span-6 lg:col-span-3"
      >
        <div className="flex flex-1 flex-col justify-center gap-3.5 mt-2">
          {LANGUAGES.map((lang) => (
            <div key={lang.name}>
              <div className="mb-1.5 flex justify-between text-[13px] font-bold">
                <span>{lang.name}</span>
                <span className="text-admiral tabular-nums">{lang.current}٪</span>
              </div>
              <div className="relative h-3.5 rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-admiral-2 to-admiral transition-[width] duration-1000"
                  style={{ width: `${lang.current}%` }}
                />
                <div
                  className="absolute -top-1.5 -bottom-1.5 w-[3px] rounded-sm bg-gold"
                  style={{ insetInlineStart: `${lang.target}%` }}
                >
                  <span className="absolute -top-5 -translate-x-1/2 text-[14px]">🎯</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Voice Samples */}
      <Card
        title="عيّنات صوت سافي"
        subtitle="١٢٤ تسجيلاً مرجعياً"
        infoKey="voice"
        onInfo={onInfo}
        className="col-span-6 lg:col-span-3"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-3.5">
          <div
            className="h-[110px] w-[110px] rounded-full shadow-[0_0_40px_rgba(0,87,183,0.5),inset_-10px_-10px_30px_rgba(0,0,0,0.3)]"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(circle at 70% 65%, #1a4d2e 0%, #2d6a4f 30%, transparent 50%), radial-gradient(circle at 25% 70%, #1a4d2e 0%, transparent 30%), radial-gradient(circle at 60% 25%, #2d6a4f 0%, transparent 25%), linear-gradient(135deg, #1976D2 0%, #0a3d7a 100%)',
              animation: 'spin-slow 30s linear infinite',
            }}
          />
          <div className="flex items-center gap-4">
            <button className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-white text-base shadow-[0_8px_30px_rgba(20,20,40,0.06)] hover:scale-110 hover:border-admiral hover:text-admiral">
              ⏮
            </button>
            <button className="grid h-14 w-14 cursor-pointer place-items-center rounded-full border-none bg-gradient-to-br from-admiral to-admiral-2 text-xl text-white shadow-[0_8px_30px_rgba(0,87,183,0.4)] hover:scale-110">
              ▶
            </button>
            <button className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-white text-base shadow-[0_8px_30px_rgba(20,20,40,0.06)] hover:scale-110 hover:border-admiral hover:text-admiral">
              ⏭
            </button>
          </div>
          <div className="text-[12px] font-semibold text-muted">يشتغل: تحية_سعودية_v3.wav · 0:12</div>
        </div>
      </Card>
    </div>
  )
}
