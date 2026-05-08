import { FileBarChart2, FileText, Presentation, Sheet, Mail, Download, Clock } from 'lucide-react'
import { PanelHeader } from '../parts/PanelHeader'

const RECENT = [
  { ar: 'تقرير الأسطول الأسبوعي', en: 'Weekly Fleet Report', date: 'الأحد · 14:00', kind: 'pdf', size: '4.2 MB' },
  { ar: 'أداء الذكاء اللغوي', en: 'AI Language Performance', date: 'السبت · 09:30', kind: 'pptx', size: '12 MB' },
  { ar: 'التزام الهوية — أبريل', en: 'Brand Compliance · April', date: 'الجمعة · 18:15', kind: 'xlsx', size: '880 KB' },
  { ar: 'حوكمة المشاريع', en: 'Project Governance', date: 'الخميس · 11:00', kind: 'pdf', size: '6.7 MB' },
]

const KIND_ICON = { pdf: FileText, pptx: Presentation, xlsx: Sheet } as const

export function ReportsSnapshot() {
  return (
    <div className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-6">
      <PanelHeader ar="مركز التقارير" en="Reports Center" icon={FileBarChart2} cta="إنشاء تقرير" route="reports" />

      <div className="grid grid-cols-12 gap-3">
        {/* counters */}
        <div className="col-span-12 grid grid-cols-3 gap-2 md:col-span-5 md:grid-cols-1">
          <Stat ar="مُنشأة هذا الشهر" en="Generated · MTD" val="38" delta="+12" />
          <Stat ar="مجدولة" en="Scheduled" val="14" delta="+3" tone="info" />
          <Stat ar="مُسلَّمة" en="Delivered" val="142" delta="98%" tone="good" />
        </div>

        {/* recent list */}
        <div className="col-span-12 md:col-span-7">
          <div className="rounded-2xl border border-[--color-line] bg-black/30">
            <div className="flex items-center justify-between border-b border-[--color-line] px-3 py-2">
              <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">
                Recent · Last 7 days
              </div>
              <div className="flex items-center gap-1">
                <Btn icon={Download} label="PDF" />
                <Btn icon={Mail} label="إرسال" />
              </div>
            </div>
            <ul className="flex flex-col">
              {RECENT.map((r, i) => {
                const Icon = KIND_ICON[r.kind as keyof typeof KIND_ICON]
                return (
                  <li
                    key={r.en}
                    className={`flex items-center gap-2.5 px-3 py-2.5 ${i !== RECENT.length - 1 ? 'border-b border-[--color-line]' : ''}`}
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[--color-line] ${
                        r.kind === 'pdf'
                          ? 'bg-[--color-bad]/10 text-[--color-bad]'
                          : r.kind === 'pptx'
                            ? 'bg-[--color-warn]/10 text-[--color-warn]'
                            : 'bg-[--color-good]/10 text-[--color-good]'
                      }`}
                    >
                      <Icon size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-bold text-[--color-ink]">{r.ar}</div>
                      <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                        {r.en}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 font-en text-[9.5px] font-bold text-[--color-muted]">
                        <Clock size={9} />
                        {r.date}
                      </span>
                      <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-ink-2]">
                        {r.size}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({
  ar,
  en,
  val,
  delta,
  tone = 'admiral',
}: {
  ar: string
  en: string
  val: string
  delta: string
  tone?: 'admiral' | 'good' | 'info'
}) {
  const accent =
    tone === 'good' ? 'text-[--color-good]' : tone === 'info' ? 'text-[--color-info]' : 'text-[--color-admiral-glow]'
  return (
    <div className="rounded-2xl border border-[--color-line] bg-black/30 p-3">
      <div className="flex items-baseline justify-between">
        <div className="font-en text-[24px] font-extrabold tabular-nums leading-none text-[--color-ink]">{val}</div>
        <span className={`font-en text-[10px] font-bold ${accent}`}>{delta}</span>
      </div>
      <div className="mt-1.5 text-[11px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">{en}</div>
    </div>
  )
}

function Btn({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number }>; label: string }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-md border border-[--color-line] bg-white/[0.02] px-1.5 py-1 text-[10.5px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
      <Icon size={10} />
      {label}
    </button>
  )
}
