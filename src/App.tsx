import { useCallback, useEffect, useState } from 'react'
import { Topbar } from '@/components/Topbar'
import { BottomNav } from '@/components/BottomNav'
import { InfoPopover } from '@/components/InfoPopover'
import { Page1Scene } from '@/pages/Page1Scene'
import { Page2Brand } from '@/pages/Page2Brand'
import { Page3Fleet } from '@/pages/Page3Fleet'
import { PageCatalog } from '@/pages/PageCatalog'
import { SAVVY_EVENTS, HOKSHA_CLIPS } from '@/data/catalogues'
import { TOTAL_PAGES, PAGE_TITLES } from '@/data/pages'

export default function App() {
  const [pageIndex, setPageIndex] = useState(0)
  const [info, setInfo] = useState<string | null>(null)

  const goTo = useCallback((i: number) => {
    setPageIndex(Math.max(0, Math.min(TOTAL_PAGES - 1, i)))
  }, [])

  // Keyboard nav (RTL: right arrow = previous)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(pageIndex - 1)
      if (e.key === 'ArrowLeft') goTo(pageIndex + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pageIndex, goTo])

  // Touch swipe
  useEffect(() => {
    let tx = 0
    const onStart = (e: TouchEvent) => (tx = e.touches[0].clientX)
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - tx
      if (Math.abs(dx) > 60) goTo(pageIndex + (dx > 0 ? -1 : 1))
    }
    document.addEventListener('touchstart', onStart)
    document.addEventListener('touchend', onEnd)
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
    }
  }, [pageIndex, goTo])

  return (
    <>
      <Topbar pageIndex={pageIndex} onGoTo={goTo} />

      <main className="fixed inset-x-0 top-[78px] bottom-[70px] overflow-hidden">
        <div
          className="flex h-full transition-transform duration-[550ms] ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{
            width: `${TOTAL_PAGES * 100}%`,
            transform: `translateX(${pageIndex * (100 / TOTAL_PAGES)}%)`,
          }}
        >
          {/* Each page slot is 1/TOTAL of the strip width */}
          {[
            <Page1Scene onInfo={setInfo} />,
            <Page2Brand onInfo={setInfo} />,
            <Page3Fleet onInfo={setInfo} />,
            <PageCatalog entries={SAVVY_EVENTS} />,
            <PageCatalog entries={HOKSHA_CLIPS} />,
          ].map((node, i) => (
            <section
              key={i}
              className="h-full overflow-auto px-9 py-6"
              style={{ width: `${100 / TOTAL_PAGES}%` }}
            >
              <div className="mb-4 flex items-baseline justify-between">
                <h1 className="text-[30px] font-black -tracking-[0.5px]">{PAGE_TITLES[i]}</h1>
                <span className="text-[14px] font-semibold text-muted">
                  الصفحة {i + 1} من {TOTAL_PAGES}
                </span>
              </div>
              {node}
            </section>
          ))}
        </div>
      </main>

      <BottomNav pageIndex={pageIndex} onPrev={() => goTo(pageIndex - 1)} onNext={() => goTo(pageIndex + 1)} />

      <InfoPopover infoKey={info} onClose={() => setInfo(null)} />
    </>
  )
}
