import type { InfoSpec } from '@/types'

export const INFO: Record<string, InfoSpec> = {
  lidar: {
    tag: 'LIDAR + VISION',
    title: 'قارئ المشهد',
    description:
      'LiDAR + كاميرا على رأس الروبوت يقرؤون لحظياً: عدد المارّين، انطباعات الوجوه (سعيد/محايد/منزعج)، التواصل البصري المباشر، والمارّون بلا توقّف. القراءة فقط — لا يكتب على الروبوت.',
    meta: ['LiDAR Dome', 'Vision API', 'تحديث ٣٠ FPS'],
  },
  transcript: {
    tag: 'SPEECH',
    title: 'النصّ الحيّ',
    description: 'حوار سيف وسافي يُنقل لحظياً عبر Speech-to-Text. الفريق يربط هذا بـ pipeline على Mac+ASUS.',
    meta: ['STT Realtime', 'Whisper / Mac', 'Maksym'],
  },
  rd: {
    tag: 'RESEARCH',
    title: 'شراكات الأبحاث',
    description:
      'KAU، KSU، MIT، Stanford، KFU — لكل واحدة pipeline أبحاث قيد التنفيذ أو التقييم. تُربط لاحقاً بنظام إدارة الشراكات الجامعية.',
    meta: ['٥ جامعات', 'PM: ليلى'],
  },
  dialects: {
    tag: 'NLP',
    title: 'اللهجات العربية',
    description: '٤٠ لهجة بمستوى نضج مختلف. الإنتاجي = جاهز للسوق، التدريب = على نموذج active، المخطّط = في خارطة الطريق.',
    meta: ['٤٠ لهجة', 'نموذج تصنيف', 'Olena + Maksym'],
  },
  langs: {
    tag: 'LOCALIZATION',
    title: 'اللغات vs الهدف',
    description: 'مقياس الإنجاز السنوي. 🎯 = الهدف الـ KPI الموضوع للسنة الحالية. الفجوة بين شريط الأداء والـ pin = ما تبقّى.',
    meta: ['Q3 target', 'OKR aligned'],
  },
  voice: {
    tag: 'TTS',
    title: 'عيّنات الصوت',
    description: 'مكتبة عيّنات سافي للـ TTS (ElevenLabs). تشمل تحيات، شرح علمي، حوارات لهجات.',
    meta: ['ElevenLabs', '١٢٤ عيّنة', 'Maksym'],
  },
  social: {
    tag: 'SOCIAL',
    title: 'سوشيال Mr. Savvy',
    description: 'أرقام رامي الفعلية: 240M MENA reach. الربط القادم بـ APIs لـ TikTok, Snap, IG, X.',
    meta: ['TikTok API', 'Snap API', 'IG Graph', 'X API', 'Astrid'],
  },
  hoksha: {
    tag: 'VIRAL',
    title: 'انتشار حكشة',
    description: 'مقاطع حكشة (7oksha) من قناة @abadi.01 + قنوات سافي الخاصة. Astrid مسؤولة عن scraping/API.',
    meta: ['@abadi.01', 'MENA', 'Astrid'],
  },
  brand: {
    tag: 'BRAND',
    title: 'التزام العلامة',
    description: 'فحص ٥ أبعاد: الرمادي #F5F5F7، Admiral Blue، خط Tajawal، حدود 28px، شعار 3D. النتيجة الحالية ٩٤/١٠٠ Apple-grade.',
    meta: ['Apple-grade', 'Tajawal', 'Admiral'],
  },
  team: {
    tag: 'PEOPLE',
    title: 'فريق التكامل',
    description: '٦ أشخاص — إدارة من فلسطين، برمجة من أوكرانيا، تصميم من السويد. كل واحد يربط APIs محدّدة.',
    meta: ['🇵🇸 PM/Integration', '🇺🇦 Engineering', '🇸🇪 Creative'],
  },
  reach: {
    tag: 'AUDIENCE',
    title: 'انتشار الجمهور',
    description: '٢٤٠ مليون مشاهدة عبر MENA. التركيز السعودية، والامتداد وصل المغرب.',
    meta: ['MENA', '240M', 'GCC + Maghreb'],
  },
  production: {
    tag: 'CONTENT',
    title: 'الإنتاج الشهري',
    description: 'متوسط الإنتاج آخر ٣٠ يوماً عبر كل القنوات. ٣٤ منشور + ١٢ فيديو 3D + ٢٢ قصّة.',
    meta: ['/30 days', 'rolling avg'],
  },
  units: {
    tag: 'FLEET',
    title: 'وحدات الأسطول',
    description: 'بيانات KYC لكل روبوت: المعرّف، الموقع، اسم المستخدم، البطارية، الذاكرة، IP، WiFi، آخر heartbeat.',
    meta: ['SOTI-grade', '5 units', 'live'],
  },
  map: {
    tag: 'MAP',
    title: 'خريطة الأسطول',
    description: 'pins حيّة. أدوات: ارسم منطقة آمنة (geofence)، السجلّ التاريخي، تحديد الموقع، مسح. الـ geofence نشط على الرياض.',
    meta: ['MENA', '5 pins', 'geofence ON'],
  },
  console: {
    tag: 'CONTROL',
    title: 'وحدة التحكّم',
    description: 'أوامر الأسطول. الصلاحية لسيف فقط — الـ dashboard هذا READ-ONLY. الأوامر الفعلية تنفّذ من جهاز سيف المعتمد.',
    meta: ['SM-only', 'AuthZ', 'Audit log'],
  },
  health: {
    tag: 'HEALTH',
    title: 'صحّة الأسطول',
    description: 'لمحة سريعة عن حالة الأسطول: ONLINE، بطارية منخفضة، ذاكرة عالية، ضمن نطاق الـ geofence.',
    meta: ['real-time', 'heartbeat 5s'],
  },
  alerts: {
    tag: 'ALERTS',
    title: 'تنبيهات حيّة',
    description: 'urgent (أحمر): بطارية/فقدان اتصال. warn (برتقالي): ذاكرة/WiFi. info (أزرق): geofence/firmware.',
    meta: ['urgent', 'warn', 'info'],
  },
  wifi: {
    tag: 'NETWORK',
    title: 'اتصال WiFi',
    description: 'قوة الإشارة (dBm) لكل وحدة. أعلى من -50 ممتاز، -50 إلى -70 جيد، أقل من -70 ضعيف.',
    meta: ['dBm', 'heatmap'],
  },
}
