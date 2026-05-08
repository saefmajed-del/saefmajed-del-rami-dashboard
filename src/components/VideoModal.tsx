import { useEffect } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { resolveEmbed } from '@/lib/video'

interface VideoModalProps {
  url: string | null
  title?: string
  onClose: () => void
}

export function VideoModal({ url, title, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!url) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [url, onClose])

  if (!url) return null
  const embed = resolveEmbed(url)
  const isPortrait = embed.kind === 'iframe' && embed.aspect === 'portrait'

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md sm:p-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-[480px] rounded-[28px] bg-white p-3 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-4">
        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <div className="truncate text-[15px] font-black -tracking-[0.2px]">{title ?? 'فيديو'}</div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-none bg-black/5 hover:bg-black/10"
          >
            <X size={16} />
          </button>
        </div>

        <div
          className="relative mt-2 overflow-hidden rounded-2xl bg-black"
          style={{ aspectRatio: isPortrait ? '9 / 16' : '16 / 9' }}
        >
          {embed.kind === 'iframe' && (
            <iframe
              src={embed.src}
              title={title ?? 'video'}
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          )}

          {embed.kind === 'video' && (
            <video
              src={embed.src}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}

          {embed.kind === 'external' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-admiral to-admiral-2 p-6 text-center text-white">
              <ExternalLink size={36} />
              <p className="text-[14px] font-semibold leading-relaxed">
                هذا الفيديو على منصّة خارجية ولا يدعم الـ embed.
                <br />
                افتحه في تبويب جديد:
              </p>
              <a
                href={embed.src}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-6 py-3 text-[14px] font-bold text-admiral no-underline transition hover:scale-105"
              >
                فتح في تبويب جديد ↗
              </a>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between px-2 py-1 text-[12px] text-muted">
          <span className="truncate">{new URL(embed.src).hostname.replace('www.', '')}</span>
          <a
            href={embed.src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-admiral no-underline hover:underline"
          >
            افتح خارجياً <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  )
}
