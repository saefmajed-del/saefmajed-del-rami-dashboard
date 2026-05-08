import type { SocialAccount, AudienceCountry } from '@/types'

export const SAVVY_SOCIAL: SocialAccount[] = [
  { platform: 'TikTok', handle: '@mrsavvy', followers: '1.8M', reach: '142M مشاهدة' },
  { platform: 'Snapchat', handle: '@mr.savvy', followers: '920k', reach: '48M أسبوعي' },
  { platform: 'Instagram', handle: '@mr.savvy', followers: '580k', reach: '32M reach' },
  { platform: 'X', handle: '@mr_savvy', followers: '240k', reach: '18M impressions' },
]

export const HOKSHA_STATS = [
  { num: '18M', label: '❤ لايكات' },
  { num: '3.2M', label: '😂 ضحك' },
  { num: '8.4k', label: '📣 mentions/أسبوع' },
  { num: '4.7k', label: '🔁 إعادة نشر' },
]

export const AUDIENCE_REACH: AudienceCountry[] = [
  { flag: '🇸🇦', name: 'السعودية', reach: 96 },
  { flag: '🇪🇬', name: 'مصر', reach: 64 },
  { flag: '🇦🇪', name: 'الإمارات', reach: 54 },
  { flag: '🇲🇦', name: 'المغرب', reach: 32 },
  { flag: '🇰🇼', name: 'الكويت', reach: 48 },
]

export const PRODUCTION_STATS = [
  { num: '34', label: 'منشور' },
  { num: '12', label: 'فيديو 3D' },
  { num: '4.7M', label: 'عرض شهري' },
  { num: '8', label: 'فعالية' },
  { num: '22', label: 'قصّة' },
  { num: '5', label: 'شراكة' },
]

export const INTEGRATION_TEAM = [
  { flag: '🇵🇸', name: 'ليلى أبو-حسّان', role: 'PM · knowledge/dialects/R&D' },
  { flag: '🇵🇸', name: 'كريم الخطيب', role: 'Integration · APIs + SOTI' },
  { flag: '🇺🇦', name: 'Olena Petrova', role: 'Sr. LiDAR + Vision' },
  { flag: '🇺🇦', name: 'Maksym Ivanov', role: 'Sr. TTS + Speech' },
  { flag: '🇸🇪', name: 'Astrid Lindberg', role: 'Creative Director' },
  { flag: '🇸🇪', name: 'Erik Sandström', role: '3D / Motion Design' },
]

export const LANGUAGES = [
  { name: 'عربي', current: 96, target: 95 },
  { name: 'إنجليزي', current: 88, target: 90 },
  { name: 'صيني', current: 42, target: 60 },
  { name: 'فرنسي', current: 58, target: 70 },
]
