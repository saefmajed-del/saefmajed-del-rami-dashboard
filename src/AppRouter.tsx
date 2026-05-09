import { Suspense, lazy } from 'react'
import { useRoute } from '@/lib/router'
import { FleetPage } from '@/pages-detail/FleetPage'
import { ProjectsPage } from '@/pages-detail/ProjectsPage'
import { MediaPage } from '@/pages-detail/MediaPage'
import { LanguagePage } from '@/pages-detail/LanguagePage'
import { BrandPage } from '@/pages-detail/BrandPage'
import { LearningPage } from '@/pages-detail/LearningPage'
import { ReportsPage } from '@/pages-detail/ReportsPage'
import { SettingsPage } from '@/pages-detail/SettingsPage'
import { EngineeringOpsPage } from '@/pages-detail/EngineeringOpsPage'
import { RoboticsEdgePage } from '@/pages-detail/RoboticsEdgePage'
import { TelepresencePage } from '@/pages-detail/TelepresencePage'
import { SecurityOpsPage } from '@/pages-detail/SecurityOpsPage'
import { PlatformTeamPage } from '@/pages-detail/PlatformTeamPage'
import { LandingPage } from '@/pages-public/LandingPage'

// Heavy: Three.js + R3F + drei. Code-split into its own chunk.
const DigitalTwinPage = lazy(() =>
  import('@/pages-detail/DigitalTwinPage').then((m) => ({ default: m.DigitalTwinPage })),
)
const ShowcasePage = lazy(() =>
  import('@/pages-detail/ShowcasePage').then((m) => ({ default: m.ShowcasePage })),
)

function TwinFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-[--color-bg]">
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 rounded-full border border-[rgba(78,163,255,0.18)]" />
          <span
            className="absolute inset-0 rounded-full border-t-2 border-[--color-admiral-glow]"
            style={{ animation: 'radar-sweep 1.6s linear infinite', transformOrigin: 'center' }}
          />
          <span className="font-en text-[12px] font-extrabold leading-none tracking-tight">
            <span className="text-white">S</span>
            <span className="text-[--color-admiral-glow]">vv</span>
          </span>
        </div>
        <div className="font-en text-[10px] font-semibold uppercase tracking-[0.24em] text-[--color-admiral-glow]">
          Savvy World · Industrial OS
        </div>
        <div className="text-[14px] font-bold text-[--color-ink]">جاري تحميل المحرّك ثلاثي الأبعاد…</div>
        <div className="font-en text-[10.5px] font-medium text-[--color-faint]">
          Booting Three.js + R3F · Digital Twin scene
        </div>
      </div>
    </div>
  )
}

export function AppRouter() {
  const route = useRoute()
  switch (route.id) {
    case 'fleet':
      return <FleetPage />
    case 'robotics-edge':
      return <RoboticsEdgePage />
    case 'projects':
      return <ProjectsPage />
    case 'media':
      return <MediaPage />
    case 'language':
      return <LanguagePage />
    case 'brand':
      return <BrandPage />
    case 'streaming':
      return <TelepresencePage />
    case 'engineering':
      return <EngineeringOpsPage />
    case 'twin':
      return (
        <Suspense fallback={<TwinFallback />}>
          <DigitalTwinPage />
        </Suspense>
      )
    case 'security':
      return <SecurityOpsPage />
    case 'learning':
      return <LearningPage />
    case 'reports':
      return <ReportsPage />
    case 'team':
      return <PlatformTeamPage />
    case 'settings':
      return <SettingsPage />
    case 'showcase':
      return (
        <Suspense fallback={<TwinFallback />}>
          <ShowcasePage />
        </Suspense>
      )
    case 'landing':
      return <LandingPage />
    default:
      return <LandingPage />
  }
}
