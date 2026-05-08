import { Card } from '@/components/Card'
import { MenaMap } from '@/components/MenaMap'
import { FLEET_UNITS, FLEET_ALERTS } from '@/data/fleet'
import { cn } from '@/lib/utils'

interface PageProps {
  onInfo: (key: string) => void
}

const STATUS_STYLES = {
  online: 'bg-good/15 text-good',
  warn: 'bg-warn/15 text-warn',
  offline: 'bg-bad/15 text-bad',
}

const ALERT_STYLES = {
  urgent: 'border-bad',
  warn: 'border-warn',
  info: 'border-info',
}

const dbmBars = (dbm: number) => {
  if (dbm >= -50) return 4
  if (dbm >= -60) return 3
  if (dbm >= -70) return 2
  return 1
}

export function Page3Fleet({ onInfo }: PageProps) {
  return (
    <div className="grid h-full grid-cols-12 grid-rows-[minmax(180px,auto)_minmax(180px,auto)] gap-4">
      {/* Units list */}
      <Card
        title="وحدات الأسطول · KYC"
        subtitle="٥ روبوتات · 4 ONLINE · 1 WARN"
        infoKey="units"
        onInfo={onInfo}
        className="col-span-6 row-span-2"
      >
        <div className="mt-1.5 flex flex-1 flex-col gap-1.5 overflow-auto">
          {FLEET_UNITS.map((u) => {
            const battCls = u.battery < 20 ? 'bg-bad' : u.battery < 50 ? 'bg-warn' : 'bg-good'
            const memCls = u.memory > 80 ? 'bg-bad' : u.memory > 65 ? 'bg-warn' : 'bg-good'
            return (
              <div
                key={u.id}
                className="grid grid-cols-[18px_70px_1fr_50px_50px_70px] items-center gap-2.5 rounded-xl bg-black/[0.025] px-2.5 py-2 text-[11px]"
              >
                <input type="checkbox" className="accent-admiral" />
                <span className="font-extrabold text-admiral">{u.id}</span>
                <div>
                  <div className="font-bold">{u.location}</div>
                  <div className="text-muted">
                    {u.user} · {u.ip}
                  </div>
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] text-muted">🔋 {u.battery}٪</div>
                  <div className="h-2 overflow-hidden rounded bg-line">
                    <div className={cn('h-full rounded', battCls)} style={{ width: `${u.battery}%` }} />
                  </div>
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] text-muted">💾 {u.memory}٪</div>
                  <div className="h-2 overflow-hidden rounded bg-line">
                    <div className={cn('h-full rounded', memCls)} style={{ width: `${u.memory}%` }} />
                  </div>
                </div>
                <span className={cn('rounded-full px-2 py-0.5 text-center text-[10px] font-extrabold', STATUS_STYLES[u.status])}>
                  {u.status.toUpperCase()}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* MENA Map */}
      <Card
        title="خريطة الأسطول · MENA"
        subtitle="تتبّع لحظي · geofence نشط"
        infoKey="map"
        onInfo={onInfo}
        className="col-span-6 row-span-2"
      >
        <MenaMap />
      </Card>

      {/* Remote Console */}
      <Card title="وحدة التحكّم" subtitle="صلاحية سيف فقط" infoKey="console" onInfo={onInfo} className="col-span-3">
        <div className="mt-2 grid flex-1 grid-cols-2 gap-2.5">
          <button className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-bad/25 bg-white px-2.5 py-3.5 font-extrabold text-bad transition hover:bg-bad/8">
            <span className="text-[22px]">🛑</span>
            <span className="text-[11px]">إيقاف الكل</span>
          </button>
          <button className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-bad/25 bg-white px-2.5 py-3.5 font-extrabold text-bad transition hover:bg-bad/8">
            <span className="text-[22px]">⛔</span>
            <span className="text-[11px]">إيقاف المحدّد</span>
          </button>
          <button className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-admiral/25 bg-white px-2.5 py-3.5 font-extrabold text-admiral transition hover:bg-admiral/8">
            <span className="text-[22px]">📍</span>
            <span className="text-[11px]">تحديد الموقع</span>
          </button>
          <button className="flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-good/25 bg-white px-2.5 py-3.5 font-extrabold text-good transition hover:bg-good/8">
            <span className="text-[22px]">🗺️</span>
            <span className="text-[11px]">منطقة آمنة</span>
          </button>
        </div>
      </Card>

      {/* Health */}
      <Card title="صحّة الأسطول" subtitle="آخر تحديث: الآن" infoKey="health" onInfo={onInfo} className="col-span-3">
        <div className="mt-1.5 grid flex-1 grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-0.5 rounded-2xl bg-black/[0.025] p-2.5">
            <div className="text-[24px] font-black text-good">4/5</div>
            <div className="text-[11px] font-semibold text-muted">ONLINE</div>
          </div>
          <div className="flex flex-col gap-0.5 rounded-2xl bg-black/[0.025] p-2.5">
            <div className="text-[24px] font-black text-warn">1</div>
            <div className="text-[11px] font-semibold text-muted">بطارية منخفضة</div>
          </div>
          <div className="flex flex-col gap-0.5 rounded-2xl bg-black/[0.025] p-2.5">
            <div className="text-[24px] font-black text-warn">1</div>
            <div className="text-[11px] font-semibold text-muted">ذاكرة عالية</div>
          </div>
          <div className="flex flex-col gap-0.5 rounded-2xl bg-black/[0.025] p-2.5">
            <div className="text-[24px] font-black text-good">5</div>
            <div className="text-[11px] font-semibold text-muted">ضمن النطاق</div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      <Card title="تنبيهات حيّة" subtitle="٥ تنبيهات نشطة" infoKey="alerts" onInfo={onInfo} className="col-span-3">
        <div className="mt-1.5 flex flex-1 flex-col gap-1.5 overflow-auto">
          {FLEET_ALERTS.map((a) => (
            <div
              key={a.id}
              className={cn('flex items-start gap-2.5 rounded-xl border-r-4 bg-black/[0.025] px-2.5 py-2', ALERT_STYLES[a.severity])}
            >
              <span className="min-w-[36px] text-[10px] font-bold text-muted">{a.time}</span>
              <div className="text-[12px] font-semibold">
                {a.message}
                <small className="mt-0.5 block text-[10px] font-medium text-muted">{a.detail}</small>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* WiFi */}
      <Card title="اتصال WiFi" subtitle="قوة الإشارة لكل وحدة" infoKey="wifi" onInfo={onInfo} className="col-span-3">
        <div className="mt-1.5 flex flex-1 flex-col justify-center gap-2">
          {FLEET_UNITS.map((u) => {
            const bars = dbmBars(u.wifiDbm)
            return (
              <div key={u.id} className="grid grid-cols-[60px_1fr_60px] items-center gap-2.5">
                <span className="text-[11px] font-extrabold text-admiral">{u.id}</span>
                <div className="flex items-end gap-0.5 h-[18px]">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={cn('w-1 rounded-sm', i <= bars ? 'bg-good' : 'bg-line')}
                      style={{ height: `${i * 25}%` }}
                    />
                  ))}
                </div>
                <span className="text-left text-[11px] font-bold tabular-nums text-ink-2">{u.wifiDbm} dBm</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
