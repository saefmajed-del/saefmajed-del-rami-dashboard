import { Film, Eye, Heart, Share2, Play } from 'lucide-react'
import { MEDIA } from '../data'
import { PanelHeader } from '../parts/PanelHeader'
import { useNavigate } from '@/lib/router'

export function MediaSnapshot() {
  const navigate = useNavigate()
  return (
    <div className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-5">
      <PanelHeader ar="المحتوى والإعلام" en="Media & Content" icon={Film} cta="الستوديو" route="media" />

      <div className="grid grid-cols-2 gap-2.5">
        {MEDIA.map((m, i) => (
          <button
            key={i}
            onClick={() => navigate('media')}
            className="group relative overflow-hidden rounded-2xl border border-[--color-line] bg-black/30 text-start transition-all hover:border-[rgba(78,163,255,0.4)] hover:-translate-y-0.5"
          >
            {/* Thumbnail surface — generative gradient with Arabic title overlay */}
            <div
              className="relative aspect-[4/5] overflow-hidden"
              style={{
                background: `radial-gradient(120% 90% at 30% 10%, ${m.hueA} 0%, transparent 60%),
                             radial-gradient(120% 90% at 80% 90%, ${m.hueB} 0%, transparent 60%),
                             linear-gradient(180deg, #0b1024, #050813)`,
              }}
            >
              {/* film grain */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
                  backgroundSize: '3px 3px',
                }}
              />
              {/* subject silhouette stylization */}
              <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id={`subject-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(78,163,255,0.45)" />
                    <stop offset="100%" stopColor="rgba(0,87,183,0)" />
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="50" rx="14" ry="16" fill="rgba(0,0,0,0.5)" />
                <rect x="34" y="64" width="32" height="36" rx="6" fill="rgba(0,0,0,0.55)" />
                <path d="M50 64 L50 100" stroke={`url(#subject-${i})`} strokeWidth="2" />
              </svg>

              {/* platform chip */}
              <span className="absolute end-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 font-en text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {m.platform}
              </span>

              {/* play overlay on hover */}
              <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/40 text-white shadow-[0_0_30px_rgba(78,163,255,0.4)] backdrop-blur-md">
                  <Play size={18} fill="currentColor" />
                </span>
              </span>

              {/* gradient veil */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050813] to-transparent" />
            </div>

            {/* Info */}
            <div className="p-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="inline-flex h-4 items-center gap-1 rounded-md bg-[--color-admiral]/15 px-1.5 font-en text-[9.5px] font-bold uppercase tracking-wider text-[--color-admiral-glow]">
                  {m.channel}
                </span>
              </div>
              <div className="mb-1.5 line-clamp-1 text-[12px] font-bold text-[--color-ink]">{m.title}</div>
              <div className="flex items-center justify-between font-en text-[10px] font-semibold text-[--color-muted]">
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Eye size={10} />
                  {m.views}
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Heart size={10} />
                  {m.likes}
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Share2 size={10} />
                  {m.shares}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
