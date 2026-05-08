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

export function AppRouter() {
  const route = useRoute()
  switch (route.id) {
    case 'fleet':
      return <FleetPage />
    case 'projects':
      return <ProjectsPage />
    case 'media':
      return <MediaPage />
    case 'language':
      return <LanguagePage />
    case 'brand':
      return <BrandPage />
    case 'learning':
      return <LearningPage />
    case 'reports':
      return <ReportsPage />
    case 'settings':
      return <SettingsPage />
    default:
      return <HomeCommandCenter />
  }
}
