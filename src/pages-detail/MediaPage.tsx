import { useState, useMemo } from 'react'
import {
  Film,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Play,
  TrendingUp,
  Hash,
  Clock,
  Sparkles,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { PageShell } from './_PageShell'
import { MEDIA, type MediaItem } from '@/home/data'
import { Sparkline } from '@/home/parts/Sparkline'
import { cn } from '@/lib/utils'

// ---------------- Local demo extensions (read-only MEDIA + 4 more) ----------------

interface VideoCard extends MediaItem {
  comments: string
  saves: string
  duration: string
  posted: string
}

const EXTRA: VideoCard[] = [
  {
    channel: 'Huksha',
    title: 'Mr. Savvy في LEAP 2026',
    views: '6.4M',
    likes: '498k',
    shares: '72k',
    platform: 'TikTok',
    hueA: '#0057b7',
    hueB: '#0a1330',
    comments: '38k',
    saves: '64k',
    duration: '0:54',
    posted: 'قبل يومين',
  },
  {
    channel: 'Huksha & Savi',
    title: 'سَفِي يردّ بالحجازي',
    views: '4.1M',
    likes: '301k',
    shares: '49k',
    platform: 'IG',
    hueA: '#003d82',
    hueB: '#091a3a',
    comments: '22k',
    saves: '41k',
    duration: '0:38',
    posted: 'قبل ٤ أيام',
  },
  {
    channel: 'Abadi01',
    title: 'لمّا الروبوت ينسى التعليمات',
    views: '2.9M',
    likes: '174k',
    shares: '31k',
    platform: 'Snap',
    hueA: '#1d3557',
    hueB: '#000814',
    comments: '14k',
    saves: '19k',
    duration: '0:22',
    posted: 'قبل أسبوع',
  },
  {
    channel: 'Huksha',
    title: 'تحدّي اللهجة النجدية مع G1',
    views: '7.1M',
    likes: '584k',
    shares: '88k',
    platform: 'YT',
    hueA: '#06214b',
    hueB: '#000914',
    comments: '46k',
    saves: '71k',
    duration: '1:12',
    posted: 'قبل أسبوعين',
  },
]

const VIDEOS: VideoCard[] = [
  ...MEDIA.map<VideoCard>((m, i) => ({
    ...m,
    comments: ['52k', '19k', '34k', '12k'][i] ?? '10k',
    saves: ['81k', '24k', '53k', '17k'][i] ?? '12k',
    duration: ['1:04', '0:28', '0:48', '0:36'][i] ?? '0:30',
    posted: ['قبل ٣ أيام', 'قبل ٥ أيام', 'قبل أسبوع', 'قبل ١٠ أيام'][i] ?? 'حديث',
  })),
  ...EXTRA,
]

// ---------------- Channels ----------------

type ChannelKey = 'all' | 'Huksha' | 'Abadi01' | 'Huksha & Savi'

interface ChannelMeta {
  key: ChannelKey
  ar: string
  en: string
  handle: string
  followers: string
  totalViews: string
  brandSafe: string
  posts: number
  lastPost: string
  gradient: string
}

const CHANNELS: ChannelMeta[] = [
  {
    key: 'all',
    ar: 'الكل',
    en: 'All Channels',
    handle: '@savvyworld',
    followers: '14.2M',
    totalViews: '684M',
    brandSafe: '99.1%',
    posts: 412,
    lastPost: 'اليوم · ١١:٢٤',
    gradient:
      'radial-gradient(120% 90% at 18% 12%, #0057b7 0%, transparent 55%), radial-gradient(120% 90% at 88% 88%, #1a3a8e 0%, transparent 60%), linear-gradient(135deg, #050b22, #02060f)',
  },
  {
    key: 'Huksha',
    ar: 'حُكشة',
    en: 'Huksha',
    handle: '@huksha',
    followers: '8.4M',
    totalViews: '412M',
    brandSafe: '99.4%',
    posts: 218,
    lastPost: 'قبل ٥ ساعات',
    gradient:
      'radial-gradient(110% 80% at 22% 18%, #0057b7 0%, transparent 55%), radial-gradient(120% 80% at 82% 90%, #002766 0%, transparent 60%), linear-gradient(140deg, #050d28, #00040c)',
  },
  {
    key: 'Abadi01',
    ar: 'عبادي ٠١',
    en: 'Abadi01',
    handle: '@abadi01',
    followers: '3.1M',
    totalViews: '128M',
    brandSafe: '98.6%',
    posts: 121,
    lastPost: 'أمس · ٢٠:٤٠',
    gradient:
      'radial-gradient(110% 80% at 18% 14%, #1d3557 0%, transparent 55%), radial-gradient(120% 80% at 86% 88%, #4a1d57 0%, transparent 60%), linear-gradient(140deg, #0a0820, #02020a)',
  },
  {
    key: 'Huksha & Savi',
    ar: 'حُكشة وسَفِي',
    en: 'Huksha & Savi',
    handle: '@hukshasavi',
    followers: '2.7M',
    totalViews: '144M',
    brandSafe: '99.7%',
    posts: 73,
    lastPost: 'اليوم · ٠٩:١٠',
    gradient:
      'radial-gradient(110% 80% at 20% 16%, #003d82 0%, transparent 55%), radial-gradient(120% 80% at 84% 86%, #0a6cb7 0%, transparent 60%), linear-gradient(140deg, #03102a, #00040d)',
  },
]

// ---------------- KPIs ----------------

interface MediaKpi {
  ar: string
  en: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  spark: number[]
  icon: typeof Eye
}

const KPI_LIST: MediaKpi[] = [
  {
    ar: 'الوصول الكلي',
    en: 'Total Reach',
    value: '12.8M',
    delta: '+1.4M',
    trend: 'up',
    spark: [4, 5, 6, 7, 7, 9, 10, 9, 11, 12, 12, 13],
    icon: Eye,
  },
  {
    ar: 'المشاهدات الأسبوعية',
    en: 'Weekly Views',
    value: '4.2M',
    delta: '−3%',
    trend: 'down',
    spark: [5, 6, 6, 7, 6, 5, 5, 4, 4, 4, 4, 4],
    icon: Play,
  },
  {
    ar: 'متوسط التفاعل',
    en: 'Avg Engagement',
    value: '9.4%',
    delta: '+0.6',
    trend: 'up',
    spark: [6.8, 7.1, 7.4, 7.6, 8.1, 8.4, 8.6, 8.8, 9.0, 9.1, 9.3, 9.4],
    icon: Heart,
  },
  {
    ar: 'أعلى منصّة',
    en: 'Top Platform',
    value: 'TikTok',
    delta: '62%',
    trend: 'up',
    spark: [40, 44, 47, 49, 52, 54, 55, 57, 58, 60, 61, 62],
    icon: TrendingUp,
  },
  {
    ar: 'وتيرة النشر',
    en: 'Posting Cadence',
    value: '3.2/wk',
    delta: '+0.4',
    trend: 'up',
    spark: [2.4, 2.5, 2.6, 2.7, 2.7, 2.8, 2.9, 3.0, 3.0, 3.1, 3.1, 3.2],
    icon: Clock,
  },
]

// ---------------- Hashtags / themes / insights ----------------

const HASHTAGS = [
  { tag: '#حكشة', uses: '184', delta: '+24%' },
  { tag: '#G1', uses: '142', delta: '+18%' },
  { tag: '#سَفِي', uses: '128', delta: '+31%' },
  { tag: '#نجدي', uses: '96', delta: '+12%' },
  { tag: '#LEAP2026', uses: '74', delta: '+58%' },
  { tag: '#روبوت_سعودي', uses: '67', delta: '+9%' },
  { tag: '#حجازي', uses: '54', delta: '+6%' },
  { tag: '#AbadiLab', uses: '49', delta: '+14%' },
  { tag: '#تحدي_الصوت', uses: '42', delta: '+27%' },
  { tag: '#SavvyWorld', uses: '38', delta: '+11%' },
]

const THEMES = [
  'الفكاهة النجدية تتفوّق على الحجازية بـ 1.4x في معدل المشاركة',
  'Reels قصيرة (٢٠–٣٥ث) تحقق ٢.١x مشاهدات مقابل ٤٥–٦٠ث',
  'محتوى الكواليس مع G1 يحقق أعلى Save Rate (8.2%)',
  'وسوم اللهجة المحلية ترفع الوصول العضوي ٣٢٪',
]

const AI_INSIGHTS = [
  {
    icon: Sparkles,
    ar: 'أعلى تفاعل في صباح الجمعة',
    en: 'Friday morning peaks at +42% engagement',
    spark: [5, 6, 7, 9, 10, 12, 14, 13, 11, 10, 9, 8],
    trend: 'up' as const,
  },
  {
    icon: TrendingUp,
    ar: 'Reels ترتفع +٢٣٪ أسبوعياً',
    en: 'Reels velocity climbing weekly',
    spark: [4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    trend: 'up' as const,
  },
  {
    icon: Target,
    ar: 'النجدي يتفوّق على الحجازي بـ ١.٤x',
    en: 'Najdi humor outperforms Hijazi 1.4×',
    spark: [8, 9, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15],
    trend: 'up' as const,
  },
]

// ---------------- Heatmap data ----------------

const DAYS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']

function makeHeatmap(): number[][] {
  // 7 days × 24 hours score 0..1
  const grid: number[][] = []
  for (let d = 0; d < 7; d++) {
    const row: number[] = []
    for (let h = 0; h < 24; h++) {
      // mornings (8-11) and evenings (19-23) light up; Friday morning peak
      const morning = Math.exp(-((h - 10) ** 2) / 8) * (d === 6 ? 1.0 : 0.55)
      const evening = Math.exp(-((h - 21) ** 2) / 6) * (d >= 4 ? 0.95 : 0.65)
      const noise = (Math.sin(d * 7.3 + h * 1.7) + 1) / 14
      row.push(Math.min(1, morning + evening + noise))
    }
    grid.push(row)
  }
  return grid
}

// ---------------- 30-day reach chart data ----------------

function makeReach(seed: number, base: number, amp: number) {
  const out: number[] = []
  for (let i = 0; i < 30; i++) {
    const v =
      base +
      Math.sin((i + seed) / 3.1) * amp * 0.6 +
      Math.cos((i + seed) / 5.7) * amp * 0.4 +
      ((Math.sin(seed * 11 + i * 1.3) + 1) / 2) * amp * 0.5
    out.push(Math.max(0, v))
  }
  return out
}

const REACH_HUKSHA = makeReach(2, 220, 80)
const REACH_ABADI = makeReach(7, 90, 40)
const REACH_DUO = makeReach(13, 150, 60)

// ---------------- Page ----------------

export function MediaPage() {
  const [active, setActive] = useState<ChannelKey>('all')

  const heat = useMemo(() => makeHeatmap(), [])
  const channel = CHANNELS.find((c) => c.key === active) ?? CHANNELS[0]

  const filteredVideos = useMemo(
    () => (active === 'all' ? VIDEOS : VIDEOS.filter((v) => v.channel === active)),
    [active]
  )

  return (
    <PageShell
      active="media"
      ar="المحتوى والإعلام"
      en="Media & Content"
      icon={Film}
      description="استوديو محتوى Savvy World — أداء قنوات حُكشة وعبادي وسَفِي عبر TikTok و Snap و IG و YouTube، مع رؤى أداء وتوصيات نشر مدعومة بالذكاء الاصطناعي."
    >
      {/* KPI strip */}
      <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {KPI_LIST.map((k) => {
          const TIcon = k.trend === 'up' ? ArrowUpRight : k.trend === 'down' ? ArrowDownRight : ArrowUpRight
          const Icon = k.icon
          const trendColor =
            k.trend === 'up'
              ? 'text-[--color-good] bg-[--color-good]/10 border-[--color-good]/20'
              : k.trend === 'down'
                ? 'text-[--color-warn] bg-[--color-warn]/10 border-[--color-warn]/20'
                : 'text-[--color-muted] bg-white/[0.04] border-[--color-line]'
          return (
            <div key={k.en} className="glass-card glass-card-hover relative overflow-hidden p-4">
              <div className="pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full bg-[--color-admiral-glow]/10 blur-2xl" />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon size={12} className="text-[--color-admiral-glow]" />
                    <div className="truncate text-[12px] font-bold text-[--color-ink-2]">{k.ar}</div>
                  </div>
                  <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    {k.en}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-en text-[10px] font-bold ${trendColor}`}
                >
                  <TIcon size={10} />
                  {k.delta}
                </span>
              </div>
              <div className="mt-3 font-en text-[24px] font-extrabold leading-none tracking-tight tabular-nums text-[--color-ink]">
                {k.value}
              </div>
              <div className="mt-2 -mx-1">
                <Sparkline data={k.spark} trend={k.trend} height={30} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Channel switcher */}
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-[--color-line] bg-black/30 p-1.5 backdrop-blur-md">
        {CHANNELS.map((c) => {
          const isActive = c.key === active
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12.5px] font-bold transition-all',
                isActive
                  ? 'border border-[rgba(78,163,255,0.4)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-ink] shadow-[0_0_24px_rgba(78,163,255,0.18)]'
                  : 'border border-transparent text-[--color-ink-2] hover:border-[--color-line] hover:bg-white/[0.04]'
              )}
            >
              <span>{c.ar}</span>
              <span className="font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                {c.en}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Channel hero */}
        <section
          className="glass-card relative col-span-12 overflow-hidden p-5 lg:col-span-4"
          style={{ background: channel.gradient }}
        >
          {/* film grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
              backgroundSize: '3px 3px',
            }}
          />
          {/* glow */}
          <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-[--color-admiral-glow]/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow] backdrop-blur-md">
                Channel
              </span>
              <span className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                {channel.handle}
              </span>
            </div>
            <h2 className="mt-2 text-[26px] font-black leading-tight text-[--color-ink]">{channel.ar}</h2>
            <div className="font-en text-[12px] font-semibold uppercase tracking-[0.16em] text-[--color-ink-2]">
              {channel.en}
            </div>

            {/* big follower */}
            <div className="mt-5 flex items-end gap-2">
              <div className="font-en text-[44px] font-extrabold leading-none tabular-nums text-[--color-ink]">
                {channel.followers}
              </div>
              <div className="pb-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
                Followers
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Stat ar="مشاهدات كلية" en="Total views" value={channel.totalViews} />
              <Stat ar="آمن للعلامة" en="Brand-safe" value={channel.brandSafe} />
              <Stat ar="عدد المنشورات" en="Posts" value={String(channel.posts)} />
              <Stat ar="آخر منشور" en="Last post" value={channel.lastPost} small />
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[--color-line] pt-4">
              <span className="inline-flex items-center gap-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-good]">
                <span className="h-1.5 w-1.5 rounded-full bg-[--color-good] shadow-[0_0_8px_rgba(46,213,115,0.7)]" />
                Live · publishing
              </span>
              <button className="rounded-lg border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 px-2.5 py-1.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow] hover:bg-[--color-admiral]/25">
                Open studio
              </button>
            </div>
          </div>
        </section>

        {/* Top videos */}
        <section className="glass-card col-span-12 p-5 lg:col-span-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h3 className="text-[15px] font-extrabold text-[--color-ink]">أعلى الفيديوهات أداءً</h3>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Top performing videos · last 30 days
              </div>
            </div>
            <span className="font-en text-[10.5px] font-bold tabular-nums text-[--color-ink-2]">
              {filteredVideos.length} clips
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((v, i) => (
              <button
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-[--color-line] bg-black/30 text-start transition-all hover:-translate-y-0.5 hover:border-[rgba(78,163,255,0.4)]"
              >
                {/* Thumbnail 4:5 */}
                <div
                  className="relative aspect-[4/5] overflow-hidden"
                  style={{
                    background: `radial-gradient(120% 90% at 30% 10%, ${v.hueA} 0%, transparent 60%),
                                 radial-gradient(120% 90% at 80% 90%, ${v.hueB} 0%, transparent 60%),
                                 linear-gradient(180deg, #0b1024, #050813)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
                      backgroundSize: '3px 3px',
                    }}
                  />
                  {/* Stylized SVG subject */}
                  <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id={`vid-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(78,163,255,0.55)" />
                        <stop offset="100%" stopColor="rgba(0,87,183,0)" />
                      </linearGradient>
                      <radialGradient id={`vid-r-${i}`} cx="0.5" cy="0.4" r="0.6">
                        <stop offset="0%" stopColor="rgba(78,163,255,0.35)" />
                        <stop offset="100%" stopColor="rgba(78,163,255,0)" />
                      </radialGradient>
                    </defs>
                    {/* halo */}
                    <circle cx="50" cy="50" r="32" fill={`url(#vid-r-${i})`} />
                    {/* head */}
                    <ellipse cx="50" cy="48" rx="13" ry="15" fill="rgba(0,0,0,0.55)" />
                    <ellipse cx="50" cy="48" rx="13" ry="15" fill="none" stroke="rgba(78,163,255,0.5)" strokeWidth="0.6" />
                    {/* eye line */}
                    <rect x="42" y="46" width="16" height="2.4" rx="1" fill="rgba(78,163,255,0.85)" />
                    {/* shoulders / chassis */}
                    <path
                      d="M30 78 Q30 64 42 64 L58 64 Q70 64 70 78 L70 110 L30 110 Z"
                      fill="rgba(0,0,0,0.62)"
                      stroke="rgba(78,163,255,0.35)"
                      strokeWidth="0.6"
                    />
                    {/* chest light */}
                    <circle cx="50" cy="84" r="2.2" fill="rgba(78,163,255,0.9)" />
                    {/* connector lines */}
                    <path d="M50 64 L50 110" stroke={`url(#vid-${i})`} strokeWidth="1.4" />
                    {/* side accents */}
                    <path d="M30 78 L20 96" stroke="rgba(78,163,255,0.35)" strokeWidth="0.7" />
                    <path d="M70 78 L80 96" stroke="rgba(78,163,255,0.35)" strokeWidth="0.7" />
                  </svg>

                  {/* platform pill */}
                  <span className="absolute end-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {v.platform}
                  </span>
                  {/* duration */}
                  <span className="absolute start-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 font-en text-[9px] font-bold tabular-nums text-white backdrop-blur-md">
                    {v.duration}
                  </span>

                  {/* play overlay */}
                  <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/40 text-white shadow-[0_0_30px_rgba(78,163,255,0.45)] backdrop-blur-md">
                      <Play size={18} fill="currentColor" />
                    </span>
                  </span>

                  {/* gradient veil */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050813] to-transparent" />
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <div className="mb-1 flex items-center justify-between gap-1.5">
                    <span className="inline-flex h-4 items-center gap-1 rounded-md bg-[--color-admiral]/15 px-1.5 font-en text-[9.5px] font-bold uppercase tracking-wider text-[--color-admiral-glow]">
                      {v.channel}
                    </span>
                    <span className="font-en text-[9px] font-semibold text-[--color-faint]">{v.posted}</span>
                  </div>
                  <div className="mb-1.5 line-clamp-1 text-[12px] font-bold text-[--color-ink]">{v.title}</div>
                  <div className="flex items-center justify-between font-en text-[10px] font-semibold tabular-nums text-[--color-muted]">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={10} />
                      {v.views}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart size={10} />
                      {v.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Share2 size={10} />
                      {v.shares}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bookmark size={10} />
                      {v.saves}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Reach 30-day chart */}
        <section className="glass-card col-span-12 p-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-extrabold text-[--color-ink]">الوصول · ٣٠ يوم</h3>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Reach across channels · last 30 days
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Legend color="#4ea3ff" ar="حُكشة" en="Huksha" />
              <Legend color="#7fc0ff" ar="حُكشة وسَفِي" en="Huksha & Savi" />
              <Legend color="#a8d3ff" ar="عبادي ٠١" en="Abadi01" />
            </div>
          </div>
          <ReachChart
            series={[
              { values: REACH_HUKSHA, color: '#4ea3ff' },
              { values: REACH_DUO, color: '#7fc0ff' },
              { values: REACH_ABADI, color: '#a8d3ff' },
            ]}
          />
        </section>

        {/* Heatmap */}
        <section className="glass-card col-span-12 p-5 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-extrabold text-[--color-ink]">أفضل أوقات النشر</h3>
              <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                Best posting times · 7 days × 24 hours
              </div>
            </div>
            <div className="flex items-center gap-2 font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
              <span>low</span>
              <div className="flex h-2 w-32 overflow-hidden rounded-full">
                {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((s, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ background: `rgba(78,163,255,${s})` }}
                  />
                ))}
              </div>
              <span>peak</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* hour labels */}
              <div className="mb-1 grid" style={{ gridTemplateColumns: '64px repeat(24, minmax(0, 1fr))' }}>
                <div />
                {Array.from({ length: 24 }).map((_, h) => (
                  <div
                    key={h}
                    className="text-center font-en text-[8.5px] font-semibold tabular-nums text-[--color-faint]"
                  >
                    {h % 3 === 0 ? String(h).padStart(2, '0') : ''}
                  </div>
                ))}
              </div>
              {heat.map((row, d) => (
                <div
                  key={d}
                  className="grid items-center gap-[2px]"
                  style={{ gridTemplateColumns: '64px repeat(24, minmax(0, 1fr))' }}
                >
                  <div className="text-[11px] font-bold text-[--color-ink-2]">{DAYS_AR[d]}</div>
                  {row.map((v, h) => {
                    const a = Math.max(0.04, v)
                    return (
                      <div
                        key={h}
                        className="aspect-square rounded-[3px] border border-white/[0.04]"
                        style={{
                          background: `rgba(78,163,255,${a.toFixed(3)})`,
                          boxShadow:
                            v > 0.78 ? '0 0 10px rgba(78,163,255,0.45)' : undefined,
                        }}
                        title={`${DAYS_AR[d]} · ${String(h).padStart(2, '0')}:00 · ${(v * 100).toFixed(0)}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hashtags + themes */}
        <section className="col-span-12 grid grid-cols-1 gap-3 lg:col-span-5">
          <div className="glass-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Hash size={14} className="text-[--color-admiral-glow]" />
              <h3 className="text-[15px] font-extrabold text-[--color-ink]">أعلى الوسوم</h3>
              <span className="ms-auto font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                Top hashtags
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HASHTAGS.map((h) => (
                <span
                  key={h.tag}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[--color-line] bg-black/30 px-2 py-1 text-[12px] font-bold text-[--color-ink]"
                >
                  <span className="font-en text-[--color-admiral-glow]">{h.tag}</span>
                  <span className="font-en text-[10px] font-semibold tabular-nums text-[--color-ink-2]">
                    {h.uses}
                  </span>
                  <span className="font-en text-[9.5px] font-bold tabular-nums text-[--color-good]">
                    {h.delta}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[--color-admiral-glow]" />
              <h3 className="text-[15px] font-extrabold text-[--color-ink]">رؤى الذكاء الاصطناعي</h3>
              <span className="ms-auto font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                Trending themes
              </span>
            </div>
            <ul className="flex flex-col">
              {THEMES.map((t, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-2.5 py-2.5 text-[12.5px] font-semibold leading-relaxed text-[--color-ink-2]',
                    i !== THEMES.length - 1 && 'border-b border-[--color-line]'
                  )}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[--color-admiral-glow] shadow-[0_0_8px_rgba(78,163,255,0.7)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* AI insight cards */}
        <section className="col-span-12 grid grid-cols-1 gap-3 md:grid-cols-3">
          {AI_INSIGHTS.map((ins, i) => {
            const Icon = ins.icon
            return (
              <div key={i} className="glass-card glass-card-hover relative overflow-hidden p-5">
                <div className="pointer-events-none absolute -end-12 -top-12 h-32 w-32 rounded-full bg-[--color-admiral-glow]/10 blur-2xl" />
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-extrabold leading-snug text-[--color-ink]">{ins.ar}</div>
                    <div className="mt-0.5 font-en text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                      {ins.en}
                    </div>
                  </div>
                </div>
                <div className="mt-3 -mx-1">
                  <Sparkline data={ins.spark} trend={ins.trend} height={36} />
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </PageShell>
  )
}

// ---------------- Sub-components ----------------

function Stat({ ar, en, value, small }: { ar: string; en: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/30 p-2.5 backdrop-blur-md">
      <div className="text-[11px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
        {en}
      </div>
      <div
        className={cn(
          'mt-1 font-en font-extrabold tabular-nums text-[--color-ink]',
          small ? 'text-[12.5px]' : 'text-[16px]'
        )}
      >
        {value}
      </div>
    </div>
  )
}

function Legend({ color, ar, en }: { color: string; ar: string; en: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[--color-ink-2]">
      <span
        className="h-1.5 w-4 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}66` }}
      />
      <span>{ar}</span>
      <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
        {en}
      </span>
    </span>
  )
}

interface Series {
  values: number[]
  color: string
}

function ReachChart({ series }: { series: Series[] }) {
  const W = 1000
  const H = 220
  const padX = 36
  const padY = 18
  const innerW = W - padX * 2
  const innerH = H - padY * 2

  const allMax = Math.max(...series.flatMap((s) => s.values))
  const allMin = 0
  const span = allMax - allMin || 1
  const days = series[0]?.values.length ?? 30

  const xAt = (i: number) => padX + (i / (days - 1)) * innerW
  const yAt = (v: number) => padY + innerH - ((v - allMin) / span) * innerH

  const yTicks = 4
  const xTicks = 6

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`reach-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* y grid */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = padY + (innerH * i) / yTicks
        const v = allMax - (span * i) / yTicks
        return (
          <g key={`yg-${i}`}>
            <line
              x1={padX}
              x2={W - padX}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={padX - 6}
              y={y + 3}
              textAnchor="end"
              className="fill-[--color-faint]"
              style={{ font: '600 9px ui-sans-serif, system-ui' }}
            >
              {Math.round(v)}k
            </text>
          </g>
        )
      })}

      {/* x ticks */}
      {Array.from({ length: xTicks + 1 }).map((_, i) => {
        const idx = Math.round((i / xTicks) * (days - 1))
        const x = xAt(idx)
        return (
          <g key={`xg-${i}`}>
            <line
              x1={x}
              x2={x}
              y1={padY}
              y2={H - padY}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
            <text
              x={x}
              y={H - padY + 12}
              textAnchor="middle"
              className="fill-[--color-faint]"
              style={{ font: '600 9px ui-sans-serif, system-ui' }}
            >
              D{idx + 1}
            </text>
          </g>
        )
      })}

      {/* series */}
      {series.map((s, i) => {
        const pts = s.values.map((v, j) => `${xAt(j).toFixed(2)},${yAt(v).toFixed(2)}`)
        const path = `M${pts.join(' L')}`
        const area = `${path} L${xAt(days - 1)},${H - padY} L${xAt(0)},${H - padY} Z`
        const last = s.values[s.values.length - 1]
        return (
          <g key={i}>
            <path d={area} fill={`url(#reach-grad-${i})`} />
            <path
              d={path}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 6px ${s.color}55)` }}
            />
            <circle cx={xAt(days - 1)} cy={yAt(last)} r="3" fill={s.color} />
          </g>
        )
      })}
    </svg>
  )
}
