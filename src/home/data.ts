// All data here is DEMO. Replace with real APIs when integration team wires backend.

import type { ComponentType } from 'react'
import {
  Home,
  Cpu,
  Building2,
  Film,
  Languages,
  Shirt,
  GraduationCap,
  FileBarChart2,
  Settings,
} from 'lucide-react'

export interface NavItem {
  id: string
  ar: string
  en: string
  icon: ComponentType<{ size?: number | string; className?: string }>
  badge?: number | string
}

export const NAV: NavItem[] = [
  { id: 'home', ar: 'الرئيسية', en: 'Home', icon: Home },
  { id: 'fleet', ar: 'إدارة الأسطول', en: 'Fleet', icon: Cpu, badge: 3 },
  { id: 'projects', ar: 'المشاريع والشركاء', en: 'Projects', icon: Building2 },
  { id: 'media', ar: 'المحتوى والإعلام', en: 'Media', icon: Film },
  { id: 'language', ar: 'الذكاء اللغوي', en: 'AI Language', icon: Languages },
  { id: 'brand', ar: 'بناء هوية العلامة', en: 'Brand Studio', icon: Shirt },
  { id: 'learning', ar: 'التعلم والمشاهدة', en: 'Learning', icon: GraduationCap },
  { id: 'reports', ar: 'التقارير', en: 'Reports', icon: FileBarChart2 },
  { id: 'settings', ar: 'الإعدادات', en: 'Settings', icon: Settings },
]

export interface Kpi {
  ar: string
  en: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  spark: number[]
  unit?: string
  hint?: string
}

export const KPIS: Kpi[] = [
  {
    ar: 'إجمالي الروبوتات',
    en: 'Total Robots',
    value: '10',
    delta: '+2',
    trend: 'up',
    spark: [3, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9, 10],
    hint: 'across 4 deployments',
  },
  {
    ar: 'متصل الآن',
    en: 'Online Now',
    value: '8',
    delta: '80%',
    trend: 'up',
    spark: [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8],
    hint: '8 / 10 reachable',
  },
  {
    ar: 'الوصول الكلي',
    en: 'Total Reach',
    value: '12.8M',
    delta: '+1.4M',
    trend: 'up',
    spark: [4, 5, 6, 7, 7, 9, 10, 9, 11, 12, 12, 13],
    hint: 'last 30 days',
  },
  {
    ar: 'النشر الفعّال',
    en: 'Active Deployments',
    value: '4',
    delta: '+1',
    trend: 'up',
    spark: [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4],
    hint: 'KSA cities',
  },
  {
    ar: 'التزام الهوية',
    en: 'Brand Compliance',
    value: '98%',
    delta: '+1.2',
    trend: 'up',
    spark: [88, 90, 89, 92, 93, 94, 95, 96, 96, 97, 97, 98],
    hint: 'auto-audited',
  },
  {
    ar: 'المشاهدات الأسبوعية',
    en: 'Weekly Views',
    value: '4.2M',
    delta: '−3%',
    trend: 'down',
    spark: [5, 6, 6, 7, 6, 5, 5, 4, 4, 4, 4, 4],
    hint: 'TikTok + Snap + IG',
  },
]

export interface RobotPin {
  id: string
  city: string
  // svg coordinate space (KSA outline below uses 0..100 viewBox)
  x: number
  y: number
  status: 'online' | 'warn' | 'offline'
  battery: number
}

export const ROBOT_PINS: RobotPin[] = [
  { id: 'G1-RUH-01', city: 'الرياض', x: 48, y: 50, status: 'online', battery: 88 },
  { id: 'G1-JED-01', city: 'جدة', x: 23, y: 56, status: 'online', battery: 91 },
  { id: 'GO2-DMM-01', city: 'الدمام', x: 70, y: 44, status: 'online', battery: 76 },
  { id: 'GO2-NEOM-01', city: 'نيوم', x: 14, y: 22, status: 'online', battery: 95 },
  { id: 'GO2-MED-01', city: 'المدينة', x: 30, y: 42, status: 'online', battery: 81 },
  { id: 'G1-AHS-01', city: 'الأحساء', x: 68, y: 50, status: 'offline', battery: 0 },
  { id: 'G1-ABH-01', city: 'أبها', x: 38, y: 78, status: 'online', battery: 58 },
  { id: 'G1-TBK-01', city: 'تبوك', x: 18, y: 18, status: 'warn', battery: 31 },
  { id: 'G1-QSM-01', city: 'القصيم', x: 44, y: 38, status: 'online', battery: 73 },
  { id: 'G1-JIZ-01', city: 'جيزان', x: 32, y: 88, status: 'online', battery: 62 },
]

export interface MediaItem {
  channel: 'Huksha' | 'Abadi01' | 'Huksha & Savi'
  title: string
  views: string
  likes: string
  shares: string
  platform: 'TikTok' | 'Snap' | 'IG' | 'X' | 'YT'
  hueA: string
  hueB: string
}

export const MEDIA: MediaItem[] = [
  {
    channel: 'Huksha',
    title: 'هذا أنا • مع روبوت G1',
    views: '8.2M',
    likes: '612k',
    shares: '94k',
    platform: 'TikTok',
    hueA: '#0057b7',
    hueB: '#1a1a2e',
  },
  {
    channel: 'Abadi01',
    title: 'موقف اليوم في المختبر',
    views: '3.4M',
    likes: '218k',
    shares: '41k',
    platform: 'Snap',
    hueA: '#1d3557',
    hueB: '#000814',
  },
  {
    channel: 'Huksha & Savi',
    title: 'سَفِي يتعلّم النجدي',
    views: '5.1M',
    likes: '402k',
    shares: '63k',
    platform: 'IG',
    hueA: '#003d82',
    hueB: '#0d1a3a',
  },
  {
    channel: 'Huksha',
    title: 'تحدّي الصوت السعودي',
    views: '2.7M',
    likes: '184k',
    shares: '28k',
    platform: 'TikTok',
    hueA: '#06214b',
    hueB: '#000914',
  },
]

export interface DialectRow {
  ar: string
  en: string
  group: 'KSA' | 'MENA' | 'Global'
  maturity: number // 0..100
  tone?: 'mature' | 'training' | 'planned'
}

export const DIALECTS: DialectRow[] = [
  { ar: 'النجدي', en: 'Najdi', group: 'KSA', maturity: 96, tone: 'mature' },
  { ar: 'الحجازي', en: 'Hijazi', group: 'KSA', maturity: 91, tone: 'mature' },
  { ar: 'الشرقاوي', en: 'Eastern', group: 'KSA', maturity: 84 },
  { ar: 'القصيمي', en: 'Qassimi', group: 'KSA', maturity: 78 },
  { ar: 'الجنوبي', en: 'Southern', group: 'KSA', maturity: 71 },
  { ar: 'العسيري', en: 'Asiri', group: 'KSA', maturity: 64, tone: 'training' },
  { ar: 'التبوكي', en: 'Tabuki', group: 'KSA', maturity: 58, tone: 'training' },
  { ar: 'الجيزاني', en: 'Jizani', group: 'KSA', maturity: 52, tone: 'training' },
  { ar: 'البدوي', en: 'Bedouin', group: 'KSA', maturity: 47, tone: 'training' },
  { ar: 'المصري', en: 'Egyptian', group: 'MENA', maturity: 88 },
  { ar: 'الخليجي', en: 'Gulf', group: 'MENA', maturity: 86 },
  { ar: 'الشامي', en: 'Levantine', group: 'MENA', maturity: 79 },
  { ar: 'العراقي', en: 'Iraqi', group: 'MENA', maturity: 62, tone: 'training' },
  { ar: 'المغربي', en: 'Moroccan', group: 'MENA', maturity: 41, tone: 'planned' },
  { ar: 'الإنجليزية', en: 'English', group: 'Global', maturity: 94 },
  { ar: 'الفلبينية - تاغالوغ', en: 'Tagalog', group: 'Global', maturity: 60, tone: 'training' },
]

export interface Project {
  ar: string
  en: string
  robots: number
  online: number
  alerts: number
  badge: 'university' | 'gov' | 'accelerator'
}

export const PROJECTS: Project[] = [
  { ar: 'جامعة الملك سعود', en: 'King Saud University', robots: 3, online: 3, alerts: 0, badge: 'university' },
  { ar: 'جامعة الملك عبدالعزيز', en: 'King Abdulaziz University', robots: 2, online: 2, alerts: 0, badge: 'university' },
  { ar: 'كاكست', en: 'KACST', robots: 2, online: 1, alerts: 1, badge: 'gov' },
  { ar: 'منشآت', en: "Monsha'at", robots: 1, online: 1, alerts: 0, badge: 'gov' },
  { ar: 'تقنية', en: 'TAQNIA', robots: 1, online: 1, alerts: 0, badge: 'gov' },
  { ar: 'فلك للأعمال', en: 'Falak Accelerator', robots: 1, online: 0, alerts: 1, badge: 'accelerator' },
]

export interface Alert {
  id: string
  level: 'urgent' | 'warn' | 'info'
  ar: string
  en: string
  meta: string
}

export const ALERTS: Alert[] = [
  { id: 'a1', level: 'warn', ar: 'بطارية منخفضة — G1-TBK-01', en: 'Low battery · 31%', meta: 'تبوك • قبل 4د' },
  { id: 'a2', level: 'urgent', ar: 'الجهاز خارج الخدمة — G1-AHS-01', en: 'Unit offline', meta: 'الأحساء • قبل 12د' },
  { id: 'a3', level: 'info', ar: 'تحديث برمجي متاح v3.4.2', en: 'Update available', meta: 'الأسطول كاملاً' },
]

export const PARTNERS = ['Unitree', 'NVIDIA', 'Intel RealSense', 'Hesai LiDAR', 'Ouster', 'Bosch']
