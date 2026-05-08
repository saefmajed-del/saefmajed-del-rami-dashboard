import type { CatalogEntry } from '@/types'

/**
 * Catalogue entries.
 *
 * `videoUrl` — URL the modal will try to embed (mp4 / TikTok / IG / YouTube / Vimeo / X).
 *   When SM gets specific post URLs from the editorial team, paste them here.
 * `externalUrl` — fallback opened in a new tab. Used now to point at the relevant social
 *   profile or event hashtag while specific videos are pending.
 *
 * Sources of truth:
 *   - Mr. Savvy:   https://www.tiktok.com/@mrsavvy_saudi · https://www.instagram.com/mr.savvy_saudi/ · https://x.com/mrsavvy_saudi
 *   - Hoksha:      https://www.tiktok.com/@abadi.01
 *   - Site:        https://savvy-world.com (canonical, savvyworld.ai redirects here)
 */

const TIKTOK_SAVVY = 'https://www.tiktok.com/@mrsavvy_saudi'
const TIKTOK_HOKSHA = 'https://www.tiktok.com/@abadi.01'
const IG_SAVVY = 'https://www.instagram.com/mr.savvy_saudi/'
const X_SAVVY = 'https://x.com/mrsavvy_saudi'
const SAVVY_SITE = 'https://savvy-world.com'

export const SAVVY_EVENTS: CatalogEntry[] = [
  {
    title: 'LEAP 2026',
    meta: 'الرياض · ١٢ مارس',
    views: '4.2M',
    likes: '320k',
    shares: '48k',
    gradient: ['#003D82', '#0057B7'],
    externalUrl: `${TIKTOK_SAVVY}/search?q=LEAP`,
  },
  {
    title: 'NEOM Tech Summit',
    meta: 'نيوم · ٢٤ فبراير',
    views: '2.8M',
    likes: '210k',
    shares: '31k',
    gradient: ['#2D6A4F', '#52B788'],
    externalUrl: `${TIKTOK_SAVVY}/search?q=NEOM`,
  },
  {
    title: 'Saudi Founders Forum',
    meta: 'الرياض · ٨ مارس',
    views: '1.4M',
    likes: '98k',
    shares: '12k',
    gradient: ['#7B2D26', '#C8761F'],
    externalUrl: TIKTOK_SAVVY,
  },
  {
    title: 'KAUST Innovation Day',
    meta: 'ثول · ١٨ يناير',
    views: '980k',
    likes: '62k',
    shares: '8.4k',
    gradient: ['#0a3d7a', '#1976D2'],
    externalUrl: `${SAVVY_SITE}/ar`,
  },
  {
    title: 'موسم الرياض · بوليفارد',
    meta: 'الرياض · ٢ ديسمبر',
    views: '6.1M',
    likes: '480k',
    shares: '72k',
    gradient: ['#5D2E8C', '#A66ED9'],
    externalUrl: IG_SAVVY,
  },
  {
    title: 'GITEX Dubai',
    meta: 'دبي · ٢٠ أكتوبر',
    views: '3.4M',
    likes: '240k',
    shares: '34k',
    gradient: ['#C8761F', '#E8A33D'],
    externalUrl: X_SAVVY,
  },
]

export const HOKSHA_CLIPS: CatalogEntry[] = [
  {
    title: 'حكشة الضيف الأجنبي',
    meta: 'TikTok @abadi.01',
    views: '12.4M',
    likes: '1.8M',
    shares: '180k',
    gradient: ['#1D1D1F', '#515154'],
    externalUrl: TIKTOK_HOKSHA,
  },
  {
    title: 'حكشة الجدّة',
    meta: 'TikTok @abadi.01',
    views: '18.6M',
    likes: '2.4M',
    shares: '310k',
    gradient: ['#7B2D26', '#C8761F'],
    best: true,
    externalUrl: TIKTOK_HOKSHA,
  },
  {
    title: 'حكشة في السيارة',
    meta: 'Snap @mr.savvy',
    views: '4.8M',
    likes: '620k',
    shares: '48k',
    gradient: ['#FFC700', '#FF9500'],
    externalUrl: 'https://www.snapchat.com/add/mr.savvy_saudi',
  },
  {
    title: '7oksha والـ pitch',
    meta: 'X @mr_savvy',
    views: '1.8M',
    likes: '140k',
    shares: '18k',
    gradient: ['#0a0a0a', '#333'],
    externalUrl: X_SAVVY,
  },
  {
    title: 'حكشة موسم الرياض',
    meta: 'IG Reels',
    views: '6.2M',
    likes: '890k',
    shares: '62k',
    gradient: ['#E1306C', '#F77737'],
    externalUrl: IG_SAVVY,
  },
  {
    title: 'حكشة في المطبخ',
    meta: 'TikTok @abadi.01',
    views: '8.4M',
    likes: '1.2M',
    shares: '92k',
    gradient: ['#003D82', '#0057B7'],
    externalUrl: TIKTOK_HOKSHA,
  },
]
