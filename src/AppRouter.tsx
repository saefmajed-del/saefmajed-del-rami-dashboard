import { Suspense, lazy } from 'react'
import { useRoute } from '@/lib/router'
import { HomeCommandCenter } from '@/home/HomeCommandCenter'
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

// Heavy: Three.js + R3F + drei. Code-split into its own chunk.
const DigitalTwinPage = lazy(() =>
  import('@/pages-detail/DigitalTwinPage').then((m) => ({ default: m.DigitalTwinPage })),
)

function TwinFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-[--color-bg]">
      <div className="text-center">
        <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
          Loading 3D scene
        </div>
        <div className="mt-2 text-[14px] font-bold text-[--color-ink]">جاري تحميل المحرّك ثلاثي الأبعاد…</div>
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
    default:
      return <HomeCommandCenter />
  }
}
