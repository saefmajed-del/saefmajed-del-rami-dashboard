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
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[60px] items-center justify-between gap-2 border-t border-black/5 bg-white/85 px-4 backdrop-saturate-150 backdrop-blur-xl lg:h-[70px] lg:px-9">
      {/* In RTL: visual right is "previous" — use ArrowRight icon, prev handler */}
      <button
        onClick={onPrev}
        disabled={pageIndex === 0}
        aria-label="الصفحة السابقة"
        className={cn(
          'grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line bg-white text-lg shadow-[0_8px_30px_rgba(20,20,40,0.06)] transition-all lg:h-12 lg:w-12',
          'hover:border-admiral hover:text-admiral disabled:cursor-not-allowed disabled:opacity-30',
        )}
      >
        <ArrowRight size={16} className="lg:hidden" />
        <ArrowRight size={18} className="hidden lg:block" />
      </button>

      <div className="truncate px-2 text-center text-[14px] font-black -tracking-[0.2px] lg:text-[18px]">
        {PAGE_TITLES[pageIndex]}
      </div>

      <button
        onClick={onNext}
        disabled={pageIndex === TOTAL_PAGES - 1}
        aria-label="الصفحة التالية"
        className={cn(
          'grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line bg-white text-lg shadow-[0_8px_30px_rgba(20,20,40,0.06)] transition-all lg:h-12 lg:w-12',
          'hover:border-admiral hover:text-admiral disabled:cursor-not-allowed disabled:opacity-30',
        )}
      >
        <ArrowLeft size={16} className="lg:hidden" />
        <ArrowLeft size={18} className="hidden lg:block" />
      </button>
    </nav>
  )
}
