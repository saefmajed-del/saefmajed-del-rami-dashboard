import { useEffect } from 'react'
import { INFO } from '@/data/info'

interface InfoPopoverProps {
  infoKey: string | null
  onClose: () => void
}

export function InfoPopover({ infoKey, onClose }: InfoPopoverProps) {
  useEffect(() => {
    if (!infoKey) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [infoKey, onClose])

  if (!infoKey) return null
  const info = INFO[infoKey]
  if (!info) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-10 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[520px] rounded-[28px] bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        <span className="text-[11px] font-extrabold tracking-[1px] text-admiral">{info.tag}</span>
        <h3 className="mt-1 text-[22px] font-black">{info.title}</h3>
        <p className="my-3 text-[14px] leading-[1.6] text-ink-2">{info.description}</p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {info.meta.map((m) => (
            <span key={m} className="rounded-full bg-admiral/8 px-3 py-1 text-[12px] font-bold text-admiral">
              {m}
            </span>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full cursor-pointer rounded-2xl border-none bg-admiral py-3.5 text-[14px] font-extrabold text-white"
        >
          حسناً
        </button>
      </div>
    </div>
  )
}
