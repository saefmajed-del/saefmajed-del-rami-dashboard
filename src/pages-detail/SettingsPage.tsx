import { Settings, User, Lock, ShieldCheck, Bell, Palette, KeyRound, Globe, Smartphone, Plug, History, Trash2 } from 'lucide-react'
import { PageShell } from './_PageShell'

const SECTIONS = [
  {
    ar: 'الملف الشخصي',
    en: 'Profile',
    icon: User,
    fields: [
      { ar: 'الاسم الكامل', en: 'Full name', value: 'رامي العجرمي' },
      { ar: 'المسمى الوظيفي', en: 'Title', value: 'CEO · Savvy World' },
      { ar: 'البريد الإلكتروني', en: 'Email', value: 'rami@savvyworld.ai' },
      { ar: 'الموقع', en: 'Location', value: 'الرياض، السعودية' },
    ],
  },
  {
    ar: 'الأمان وكلمة المرور',
    en: 'Security & Password',
    icon: Lock,
    fields: [
      { ar: 'كلمة المرور', en: 'Password', value: '••••••••••', cta: 'تغيير' },
      { ar: 'المصادقة الثنائية', en: '2FA', value: 'مفعّل · تطبيق Authenticator', cta: 'تعديل' },
      { ar: 'كلمة مرور التطبيق', en: 'App passwords', value: '2 مفاتيح', cta: 'إدارة' },
      { ar: 'الجلسات النشطة', en: 'Active sessions', value: '3 أجهزة', cta: 'عرض' },
    ],
  },
  {
    ar: 'KYC والتحقق',
    en: 'KYC & Verification',
    icon: ShieldCheck,
    fields: [
      { ar: 'حالة الحساب', en: 'Account status', value: 'مُتحقَّق · Tier 3' },
      { ar: 'الهوية الوطنية', en: 'National ID', value: '1•••••••••' },
      { ar: 'السجل التجاري', en: 'Commercial registry', value: 'CR 4030••••' },
      { ar: 'KYC للأجهزة', en: 'Robot KYC', value: '10 من 10 مُفعَّل' },
    ],
  },
  {
    ar: 'الصلاحيات والأدوار',
    en: 'Roles & Permissions',
    icon: KeyRound,
    fields: [
      { ar: 'الدور', en: 'Role', value: 'Super Admin' },
      { ar: 'فرق الفريق', en: 'Teams', value: 'Integration · Brand · R&D' },
      { ar: 'مشاركون في الحساب', en: 'Account members', value: '18 مستخدم', cta: 'إدارة' },
      { ar: 'مفاتيح API', en: 'API keys', value: '4 مفاتيح', cta: 'عرض' },
    ],
  },
  {
    ar: 'المظهر',
    en: 'Appearance',
    icon: Palette,
    fields: [
      { ar: 'الوضع', en: 'Theme', value: 'داكن · Admiral' },
      { ar: 'لغة الواجهة', en: 'UI language', value: 'العربية أولاً' },
      { ar: 'الكثافة', en: 'Density', value: 'مريحة' },
      { ar: 'الخط', en: 'Font', value: 'Tajawal + IBM Plex Sans Arabic' },
    ],
  },
  {
    ar: 'الإشعارات',
    en: 'Notifications',
    icon: Bell,
    fields: [
      { ar: 'تنبيهات الأسطول', en: 'Fleet alerts', value: 'فوري · Push + Email' },
      { ar: 'الإشعارات الذكية', en: 'Smart alerts', value: 'مفعّل' },
      { ar: 'تقارير دورية', en: 'Periodic reports', value: 'الأحد ١٤:٠٠' },
      { ar: 'إشعارات التسويق', en: 'Marketing', value: 'إيقاف' },
    ],
  },
  {
    ar: 'التكاملات',
    en: 'Integrations',
    icon: Plug,
    fields: [
      { ar: 'TikTok Business', en: 'TikTok Business', value: 'متّصل · @huksha' },
      { ar: 'Snap Ads', en: 'Snap Ads', value: 'متّصل' },
      { ar: 'Slack', en: 'Slack', value: 'savvyworld.slack.com' },
      { ar: 'SOTI Mobi', en: 'SOTI Mobi', value: 'متّصل · 10 أجهزة' },
    ],
  },
  {
    ar: 'الخصوصية',
    en: 'Privacy',
    icon: Globe,
    fields: [
      { ar: 'تخزين بيانات الأسطول', en: 'Fleet data residency', value: 'KSA · Riyadh' },
      { ar: 'تسجيل الفيديو', en: 'Video recording', value: 'مفعّل · 30 يوم' },
      { ar: 'تسجيل الصوت', en: 'Voice recording', value: 'On-device only' },
      { ar: 'مشاركة المقاييس', en: 'Telemetry', value: 'مجهول الهوية' },
    ],
  },
  {
    ar: 'الأجهزة المعتمدة',
    en: 'Trusted Devices',
    icon: Smartphone,
    fields: [
      { ar: 'iPhone 16 Pro · رامي', en: 'iPhone 16 Pro · Rami', value: 'الرياض · قبل 4د' },
      { ar: 'MacBook Pro M4', en: 'MacBook Pro M4', value: 'الرياض · الآن' },
      { ar: 'iPad Pro 13', en: 'iPad Pro 13', value: 'جدة · أمس' },
    ],
  },
  {
    ar: 'سجلّ النشاط',
    en: 'Activity Log',
    icon: History,
    fields: [
      { ar: 'إنشاء تقرير', en: 'Report generated', value: 'منذ 12 دقيقة' },
      { ar: 'تسجيل دخول', en: 'Sign-in', value: 'الرياض · Chrome · اليوم 09:00' },
      { ar: 'تحديث صلاحية', en: 'Permission updated', value: 'كريم → API write' },
      { ar: 'تحديث برمجي', en: 'Firmware update', value: 'الأسطول كاملاً · v3.4.2' },
    ],
  },
]

export function SettingsPage() {
  return (
    <PageShell
      active="settings"
      ar="الإعدادات"
      en="Settings"
      icon={Settings}
      description="إدارة الحساب، الأمان، الصلاحيات، التكاملات، والخصوصية لمنصّة Savvy World."
      actions={
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-bad]/30 bg-[--color-bad]/10 px-3 py-2 text-[12px] font-bold text-[--color-bad] transition-shadow hover:shadow-[0_0_18px_rgba(244,63,94,0.18)]">
          <Trash2 size={12} />
          حذف الحساب
        </button>
      }
    >
      <div className="grid grid-cols-12 gap-3">
        {SECTIONS.map((s, i) => {
          const Icon = s.icon
          const wide = i < 4
          return (
            <section
              key={s.en}
              className={`glass-card p-4 ${wide ? 'col-span-12 lg:col-span-6' : 'col-span-12 md:col-span-6 lg:col-span-4'}`}
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                  <Icon size={15} />
                </div>
                <div>
                  <h2 className="text-[14px] font-extrabold text-[--color-ink]">{s.ar}</h2>
                  <div className="font-en text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[--color-faint]">
                    {s.en}
                  </div>
                </div>
              </div>
              <ul className="flex flex-col">
                {s.fields.map((f, j) => (
                  <li
                    key={j}
                    className={`flex items-center gap-3 py-2 ${j !== s.fields.length - 1 ? 'border-b border-[--color-line]' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-bold text-[--color-ink]">{f.ar}</div>
                      <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                        {f.en}
                      </div>
                    </div>
                    <div className="truncate text-[12px] font-semibold text-[--color-ink-2]">{f.value}</div>
                    {'cta' in f && f.cta && (
                      <button className="rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]">
                        {f.cta}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </PageShell>
  )
}
