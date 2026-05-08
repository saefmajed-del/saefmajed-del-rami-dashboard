import { ArrowLeft, ArrowRight } from 'lucide-react'
import { TOTAL_PAGES, PAGE_TITLES } from '@/data/pages'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  pageIndex: number
  onPrev: () => void
  onNext: () => void
}

export function BottomNav({ pageIndex, onPrev, onNext }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[70px] items-center justify-between border-t border-black/5 bg-white/85 px-9 backdrop-saturate-150 backdrop-blur-xl">
      {/* In RTL: visual right is "previous" — use ArrowRight icon, prev handler */}
      <button
        onClick={onPrev}
        disabled={pageIndex === 0}
        aria-label="الصفحة السابقة"
        className={cn(
          'grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-line bg-white text-lg shadow-[0_8px_30px_rgba(20,20,40,0.06)] transition-all',
          'hover:border-admiral hover:text-admiral disabled:cursor-not-allowed disabled:opacity-30',
        )}
      >
        <ArrowRight size={18} />
      </button>

      <div className="text-[18px] font-black -tracking-[0.2px]">{PAGE_TITLES[pageIndex]}</div>

      <button
        onClick={onNext}
        disabled={pageIndex === TOTAL_PAGES - 1}
        aria-label="الصفحة التالية"
        className={cn(
          'grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-line bg-white text-lg shadow-[0_8px_30px_rgba(20,20,40,0.06)] transition-all',
          'hover:border-admiral hover:text-admiral disabled:cursor-not-allowed disabled:opacity-30',
        )}
      >
        <ArrowLeft size={18} />
      </button>
    </nav>
  )
}
