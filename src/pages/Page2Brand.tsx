import { Card } from '@/components/Card'
import { SAVVY_SOCIAL, HOKSHA_STATS, AUDIENCE_REACH, PRODUCTION_STATS, INTEGRATION_TEAM } from '@/data/brand'

interface PageProps {
  onInfo: (key: string) => void
}

export function Page2Brand({ onInfo }: PageProps) {
  return (
    <div className="grid grid-cols-12 auto-rows-auto gap-3 lg:h-full lg:grid-rows-[minmax(180px,auto)_minmax(180px,auto)] lg:gap-4">
      {/* Mr. Savvy Social */}
      <Card
        title="سوشيال Mr. Savvy"
        subtitle="إجمالي المتابعين والمشاهدات"
        infoKey="social"
        onInfo={onInfo}
        className="col-span-12 md:col-span-6 lg:col-span-4 lg:row-span-2"
      >
        <div className="mt-2 grid flex-1 grid-cols-2 gap-2">
          {SAVVY_SOCIAL.map((s) => (
            <div key={s.platform} className="flex flex-col rounded-2xl bg-black/[0.03] px-3 py-2.5">
              <div className="text-[11px] font-extrabold text-ink-2">{s.platform}</div>
              <div className="text-[10px] text-muted">{s.handle}</div>
              <div className="mt-1 text-[22px] font-black -tracking-[0.5px] text-admiral">{s.followers}</div>
              <div className="text-[10px] text-muted">{s.reach}</div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <a href="#" className="rounded-full bg-admiral px-3 py-1.5 text-[11px] font-bold text-white no-underline">linktr.ee/mrsavvy</a>
          <a href="#" className="rounded-full bg-admiral px-3 py-1.5 text-[11px] font-bold text-white no-underline">savvyworld.ai</a>
        </div>
      </Card>

      {/* Hoksha */}
      <Card
        title="حكشة · انتشار فيروسي"
        subtitle="8.4k mentions أسبوعي · MENA"
        infoKey="hoksha"
        onInfo={onInfo}
        className="col-span-12 md:col-span-6 lg:col-span-4"
      >
        <div className="mt-2 grid flex-1 grid-cols-2 gap-2.5">
          {HOKSHA_STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-gradient-to-br from-[#FFF5E6] to-[#FFEAD0] p-3">
              <div className="text-[28px] font-black -tracking-[1px] text-[#C8761F]">{s.num}</div>
              <div className="text-[11px] font-bold text-ink-2">{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Brand Compliance */}
      <Card
        title="التزام العلامة"
        subtitle="معيار Apple-grade"
        infoKey="brand"
        onInfo={onInfo}
        className="col-span-12 md:col-span-6 lg:col-span-4"
      >
        <div className="my-2.5 flex flex-1 items-center gap-4">
          <div
            className="grid h-[110px] w-[110px] place-items-center rounded-full"
            style={{ background: 'conic-gradient(#1E8E3E 0% 94%, #D2D2D7 94% 100%)' }}
          >
            <div className="grid h-[90px] w-[90px] place-items-center rounded-full bg-white">
              <span className="text-[32px] font-black">
                94<small className="text-[14px] text-muted">/100</small>
              </span>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 text-[12px]">
            {['رمادي #F5F5F7', 'Admiral Blue', 'Tajawal الأساسي', 'شعار 3D', 'حدود 28px'].map((c) => (
              <div key={c} className="flex items-center gap-2 font-semibold">
                <span className="font-black text-good">✓</span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Integration Team */}
      <Card
        title="فريق التكامل التقني"
        subtitle="٦ أشخاص · فلسطين + أوكرانيا + السويد"
        infoKey="team"
        onInfo={onInfo}
        className="col-span-12 md:col-span-6"
      >
        <div className="mt-1.5 grid flex-1 grid-cols-2 gap-2">
          {INTEGRATION_TEAM.map((m) => (
            <div key={m.name} className="flex items-center gap-2.5 rounded-xl bg-black/[0.025] px-2.5 py-2">
              <span className="text-[22px]">{m.flag}</span>
              <div>
                <div className="text-[12px] font-extrabold leading-tight">{m.name}</div>
                <div className="text-[10px] text-muted">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audience Reach */}
      <Card
        title="انتشار الجمهور"
        subtitle="240M مشاهدة · MENA"
        infoKey="reach"
        onInfo={onInfo}
        className="col-span-6 lg:col-span-3"
      >
        <div className="mt-1.5 flex flex-1 flex-col justify-center gap-2">
          {AUDIENCE_REACH.map((c) => (
            <div key={c.name} className="flex items-center gap-2.5">
              <span className="grid h-5 w-7 shrink-0 place-items-center rounded bg-line text-sm">{c.flag}</span>
              <span className="w-20 text-[12px] font-bold">{c.name}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-gradient-to-l from-admiral-2 to-admiral" style={{ width: `${c.reach}%` }} />
              </div>
              <span className="w-10 text-left text-[12px] font-extrabold tabular-nums text-admiral">{c.reach}٪</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Content Production */}
      <Card
        title="الإنتاج الشهري"
        subtitle="معدّل آخر ٣٠ يوماً"
        infoKey="production"
        onInfo={onInfo}
        className="col-span-6 lg:col-span-3"
      >
        <div className="mt-1.5 grid flex-1 grid-cols-3 gap-2">
          {PRODUCTION_STATS.map((p) => (
            <div
              key={p.label}
              className="flex flex-col justify-center rounded-2xl border border-admiral/8 bg-gradient-to-br from-admiral/[0.06] to-admiral/[0.02] p-3"
            >
              <div className="text-[26px] font-black -tracking-[0.7px] text-admiral">{p.num}</div>
              <div className="mt-0.5 text-[11px] font-semibold text-ink-2">{p.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
