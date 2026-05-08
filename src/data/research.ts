import type { ResearchPartner } from '@/types'

export const RESEARCH_PARTNERS: ResearchPartner[] = [
  { tag: 'KAU', name: 'جامعة الملك عبدالعزيز', phase: 'معالجة اللغة العربية', status: 'active' },
  { tag: 'KSU', name: 'جامعة الملك سعود', phase: 'دراسة سلوك المستخدم', status: 'active' },
  { tag: 'MIT', name: 'معهد ماساتشوستس', phase: 'تعلّم آلي للحركة', status: 'eval' },
  { tag: 'STAN', name: 'ستانفورد · HAI', phase: 'أخلاقيات الذكاء', status: 'eval' },
  { tag: 'KFU', name: 'جامعة الملك فيصل', phase: 'لهجات الخليج', status: 'paused' },
]

export const RESEARCH_STATUS_LABELS: Record<ResearchPartner['status'], { label: string; cls: string }> = {
  active: { label: 'نشط', cls: 'bg-good/15 text-good' },
  eval: { label: 'تقييم', cls: 'bg-warn/15 text-warn' },
  paused: { label: 'انتظار', cls: 'bg-muted/20 text-muted' },
}
