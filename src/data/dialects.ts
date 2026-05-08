import type { Dialect, DialectMaturity } from '@/types'

export const DIALECTS: Dialect[] = [
  { name: 'نجدية', maturity: 'mature' },
  { name: 'حجازية', maturity: 'mature' },
  { name: 'شرقاوية', maturity: 'mature' },
  { name: 'جنوبية', maturity: 'ready' },
  { name: 'شمالية', maturity: 'ready' },
  { name: 'كويتية', maturity: 'mature' },
  { name: 'إماراتية', maturity: 'mature' },
  { name: 'قطرية', maturity: 'ready' },
  { name: 'بحرينية', maturity: 'ready' },
  { name: 'عُمانية', maturity: 'training' },
  { name: 'يمنية شمالية', maturity: 'training' },
  { name: 'يمنية جنوبية', maturity: 'early' },
  { name: 'مصرية قاهرية', maturity: 'mature' },
  { name: 'صعيدية', maturity: 'training' },
  { name: 'إسكندرانية', maturity: 'training' },
  { name: 'شامية دمشقية', maturity: 'ready' },
  { name: 'شامية حلبية', maturity: 'training' },
  { name: 'لبنانية', maturity: 'ready' },
  { name: 'فلسطينية', maturity: 'ready' },
  { name: 'أردنية', maturity: 'ready' },
  { name: 'عراقية بغدادية', maturity: 'training' },
  { name: 'موصلية', maturity: 'early' },
  { name: 'بصراوية', maturity: 'training' },
  { name: 'كردية-عربية', maturity: 'early' },
  { name: 'ليبية', maturity: 'training' },
  { name: 'تونسية', maturity: 'early' },
  { name: 'جزائرية', maturity: 'early' },
  { name: 'مغربية درجة', maturity: 'planned' },
  { name: 'موريتانية', maturity: 'planned' },
  { name: 'سودانية', maturity: 'training' },
  { name: 'سودانية غربية', maturity: 'planned' },
  { name: 'تشادية', maturity: 'planned' },
  { name: 'صومالية-عربية', maturity: 'planned' },
  { name: 'أهوازية', maturity: 'planned' },
  { name: 'زنجبارية', maturity: 'planned' },
  { name: 'مالطية', maturity: 'planned' },
  { name: 'أندلسية تاريخية', maturity: 'planned' },
  { name: 'فصحى عصرية', maturity: 'mature' },
  { name: 'كلاسيكية', maturity: 'ready' },
  { name: 'شعرية', maturity: 'training' },
]

export const MATURITY_STYLES: Record<DialectMaturity, string> = {
  mature: 'bg-admiral text-white',
  ready: 'bg-[#4A8AD4] text-white',
  training: 'bg-warn text-white',
  early: 'bg-[#E89BB0] text-white',
  planned: 'bg-line text-muted',
}

export const MATURITY_LABELS: Record<DialectMaturity, string> = {
  mature: 'إنتاجي',
  ready: 'جاهز',
  training: 'تدريب',
  early: 'مبكّر',
  planned: 'مخطّط',
}

export const MATURITY_DOT_COLORS: Record<DialectMaturity, string> = {
  mature: '#003D82',
  ready: '#4A8AD4',
  training: '#E8A33D',
  early: '#E89BB0',
  planned: '#E8E8ED',
}
