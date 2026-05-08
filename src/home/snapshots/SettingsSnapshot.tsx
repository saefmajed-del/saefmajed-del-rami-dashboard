import { Settings, Lock, ShieldCheck, Bell, Users, Palette } from 'lucide-react'
import { PanelHeader } from '../parts/PanelHeader'

const TILES = [
  { ar: 'الملف الشخصي', en: 'Profile', icon: Users, hint: 'رامي العجرمي · CEO' },
  { ar: 'الأمان', en: 'Security', icon: Lock, hint: 'كلمة المرور · 2FA' },
  { ar: 'KYC والتحقق', en: 'KYC', icon: ShieldCheck, hint: 'مُفعّل · 12 جهاز' },
  { ar: 'الصلاحيات', en: 'Permissions', icon: Users, hint: '4 أدوار · 18 مستخدم' },
  { ar: 'المظهر', en: 'Appearance', icon: Palette, hint: 'داكن · Admiral' },
  { ar: 'الإشعارات', en: 'Notifications', icon: Bell, hint: '4 جديدة' },
]

export function SettingsSnapshot() {
  return (
    <div className="glass-card glass-card-hover col-span-12 overflow-hidden p-5 lg:col-span-6">
      <PanelHeader ar="الإعدادات" en="Settings" icon={Settings} cta="كل الإعدادات" />

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
        {TILES.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.en}
              className="group flex items-start gap-2.5 rounded-2xl border border-[--color-line] bg-black/30 p-3 text-start transition-colors hover:border-[rgba(78,163,255,0.32)]"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-bold text-[--color-ink]">{t.ar}</div>
                <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                  {t.en}
                </div>
                <div className="mt-1 truncate text-[10.5px] font-medium text-[--color-ink-2]">{t.hint}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
