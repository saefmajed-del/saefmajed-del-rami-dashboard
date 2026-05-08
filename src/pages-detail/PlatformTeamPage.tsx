import { useMemo, useState, type ComponentType, type ReactNode } from 'react'
import {
  UsersRound,
  UserCog,
  Code2,
  Boxes,
  Server,
  CircuitBoard,
  BrainCircuit,
  Cloud,
  Palette,
  TestTube2,
  ShieldAlert,
  Languages,
  Briefcase,
  CheckCircle2,
  Hourglass,
  CalendarRange,
  Target,
  Layers,
  Building2,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { PageShell } from '@/pages-detail/_PageShell'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type RoleStatus = 'filled' | 'open' | 'recruiting'
type Phase = 1 | 2 | 3
type Seniority = 'Senior' | 'Lead' | 'Mid+'

interface Role {
  key: string
  ar: string
  en: string
  specializationAr: string
  specializationEn: string
  responsibilities: string[]
  tech: string[]
  systems: string[]
  ownership: string[]
  status: RoleStatus
  phase: Phase
  candidates?: number
  icon: ComponentType<{ size?: number; className?: string }>
  cluster: 'lead' | 'frontend' | 'backend' | 'robotics' | 'data' | 'devops' | 'uxqa' | 'security'
}

interface OpenPosition {
  key: string
  ar: string
  en: string
  location: string
  seniority: Seniority
  reqAr: string[]
  candidates: number
}

interface PhasePlan {
  phase: Phase
  ar: string
  en: string
  duration: string
  headcount: string
  color: string
  rolesActive: string[]
  rolesAdded?: string[]
  deliverables: Array<{ ar: string; en: string; status: 'planned' | 'in-progress' | 'live' }>
  milestones: Array<{ ar: string; en: string; date: string }>
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const ROLES: Role[] = [
  {
    key: 'tech-lead',
    ar: 'القائد التقني / مهندس الحلول',
    en: 'Technical Lead · Solution Architect',
    specializationAr: 'هندسة معمارية شاملة وقرارات تقنية',
    specializationEn: 'System Architecture · Cloud · Security',
    responsibilities: [
      'تصميم الهندسة المعمارية للنظام والقرارات التقنية الجوهرية',
      'مراجعة الأكواد ومعايير الجودة عبر فِرَق الواجهة والخلفية',
      'إعداد البنية السحابية متعدّدة المناطق وأنماط التكامل',
      'صياغة سياسات الأمن والتحكّم في الوصول وإدارة الأسرار',
      'قيادة المخططات التقنية للمنصة وتصعيد العقبات',
      'التواصل مع أصحاب المنفعة التقنيين الحكوميين',
    ],
    tech: ['TypeScript', 'Go', 'Python', 'AWS', 'Kubernetes', 'Terraform', 'gRPC', 'PostgreSQL'],
    systems: ['Platform Core', 'Cloud Infra', 'Security Layer', 'CI/CD'],
    ownership: ['Architecture', 'Tech Roadmap', 'Code Standards', 'Risk Register'],
    status: 'filled',
    phase: 1,
    icon: UserCog,
    cluster: 'lead',
  },
  {
    key: 'fe-dashboard',
    ar: 'مهندس واجهة · أنظمة لوحات التحكم',
    en: 'Frontend Engineer · Dashboard Systems',
    specializationAr: 'لوحات تحكم زمن-حقيقي وتصوّر بيانات',
    specializationEn: 'Real-time Widgets · Charts · State',
    responsibilities: [
      'بناء لوحات تحكم صناعية ثنائية اللغة (RTL/LTR)',
      'تطوير ودجِت زمن-حقيقي عبر WebSockets ومصادر مدفوعة',
      'إعداد طبقة إدارة الحالة والذاكرة المؤقتة للواجهة',
      'تحسين الأداء البصري (CLS / TBT / 60fps)',
      'دمج مكتبات الرسوم البيانية وإطار التصميم',
      'كتابة اختبارات وحدات وقصص Storybook للمكوّنات',
    ],
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind v4', 'TanStack Query', 'Zustand', 'D3', 'Recharts'],
    systems: ['Dashboard API', 'Telemetry Stream', 'Auth Service'],
    ownership: ['Operations Dashboard', 'KPI Widgets', 'Live Feeds', 'A11y/RTL'],
    status: 'filled',
    phase: 1,
    icon: Code2,
    cluster: 'frontend',
  },
  {
    key: 'fe-3d-gis',
    ar: 'مهندس واجهة · ثلاثيّة الأبعاد و GIS',
    en: 'Frontend Engineer · 3D & GIS',
    specializationAr: 'تصوّر مكاني ثلاثي الأبعاد وخرائط مدنية',
    specializationEn: 'Three.js · R3F · Cesium · Mapbox',
    responsibilities: [
      'بناء التوأم الرقمي للمنشآت والمدن الذكية',
      'دمج خرائط Mapbox/Cesium مع طبقات تشغيلية حيّة',
      'تحسين WebGL وتدفّق نماذج glTF/3DTiles',
      'بناء أدوات قياس وتفتيش ميدانية تفاعلية',
      'دمج بيانات GPS و LiDAR على الخريطة',
      'تطوير وضع VR/AR للعرض على الشاشات الكبيرة',
    ],
    tech: ['Three.js', 'React Three Fiber', 'Cesium', 'Mapbox GL', 'WebGL', 'TypeScript', 'Drei', 'WebXR'],
    systems: ['Map Tiles CDN', 'Telemetry Stream', '3D Asset Store'],
    ownership: ['Digital Twin', 'GIS Layers', 'Field Survey UI', 'Map Composer'],
    status: 'open',
    phase: 1,
    candidates: 4,
    icon: Boxes,
    cluster: 'frontend',
  },
  {
    key: 'be-platform',
    ar: 'مهندس خلفية · البنية التحتية للمنصة',
    en: 'Backend Engineer · Platform Infrastructure',
    specializationAr: 'خدمات API وبنية مصغّرة قابلة للتوسّع',
    specializationEn: 'APIs · gRPC · WebSockets · Microservices',
    responsibilities: [
      'تصميم وتنفيذ خدمات REST و gRPC الأساسية',
      'بناء طبقة الأحداث والبثّ للقوافل الميدانية',
      'إدارة قواعد البيانات الزمنية ومخزّنات المتجهات',
      'تنفيذ عمليات المصادقة والصلاحيات والتدقيق',
      'تكامل أنظمة الجهات الخارجية (KYC/مدفوعات/سحابات حكومية)',
      'مراقبة الأداء والاستقرار وتحسين زمن الاستجابة',
    ],
    tech: ['Go', 'Node.js', 'gRPC', 'PostgreSQL', 'TimescaleDB', 'Redis', 'NATS', 'Protobuf'],
    systems: ['Fleet API', 'Auth/IAM', 'Event Bus', 'Edge Telemetry'],
    ownership: ['Core APIs', 'Realtime Layer', 'Data Models', 'Audit Logs'],
    status: 'filled',
    phase: 1,
    icon: Server,
    cluster: 'backend',
  },
  {
    key: 'robotics',
    ar: 'مهندس روبوتات وأنظمة مدمجة',
    en: 'Robotics & Embedded Engineer',
    specializationAr: 'تكامل Unitree و ROS2 ووكلاء الحافة',
    specializationEn: 'Unitree SDK · ROS2 · DDS · MQTT · OTA',
    responsibilities: [
      'تكامل الـ SDK مع روبوتات Unitree G1 و Go2',
      'بناء وكلاء حافة (Edge Agents) منخفضة الكمون',
      'تنفيذ بروتوكولات DDS و MQTT للقوافل',
      'تطوير منظومة OTA لتحديث الروبوتات الميدانية',
      'تكامل المستشعرات (LiDAR/IMU/Depth) مع المنصة',
      'تشخيص ميداني عن بُعد وأرشفة سجلات المهام',
    ],
    tech: ['Python', 'C++', 'ROS2', 'DDS', 'MQTT', 'Docker', 'CycloneDDS', 'Linux'],
    systems: ['Fleet API', 'Edge Telemetry', 'OTA Service', 'Mission Bus'],
    ownership: ['Robot SDK', 'Edge Agents', 'OTA Pipeline', 'Sensor Fusion'],
    status: 'filled',
    phase: 1,
    icon: CircuitBoard,
    cluster: 'robotics',
  },
  {
    key: 'data-ml-voice',
    ar: 'مهندس بيانات وذكاء اصطناعي وصوت',
    en: 'Data / ML / Voice Engineer',
    specializationAr: 'أنظمة الصوت العربية ونماذج التقييم',
    specializationEn: 'ASR · TTS · Whisper · XTTS · Qwen-Audio',
    responsibilities: [
      'بناء خط أنابيب ASR/TTS للهجة السعودية',
      'تدريب وضبط نماذج اللهجات الإقليمية',
      'تطوير منظومة تقييم تلقائية (eval harness)',
      'دمج Whisper/XTTS/Qwen-Audio في خدمات الإنتاج',
      'بناء RAG وذاكرة طويلة الأمد للوكلاء',
      'مراقبة جودة الإخراج وانحياز النماذج',
    ],
    tech: ['Python', 'PyTorch', 'Whisper', 'XTTS', 'Qwen-Audio', 'ChromaDB', 'ONNX', 'CUDA'],
    systems: ['AI Pipeline', 'Voice Gateway', 'Model Registry', 'Eval Harness'],
    ownership: ['ASR/TTS', 'Dialect Models', 'RAG Layer', 'Quality Metrics'],
    status: 'open',
    phase: 2,
    candidates: 3,
    icon: BrainCircuit,
    cluster: 'data',
  },
  {
    key: 'devops',
    ar: 'مهندس DevOps وسحابة',
    en: 'DevOps / Cloud Engineer',
    specializationAr: 'CI/CD ومراقبة وبنية كوبرنيتس',
    specializationEn: 'AWS · Azure · K8s · Docker · Observability',
    responsibilities: [
      'إعداد خطوط CI/CD وتسليم متعدّد البيئات',
      'إدارة عناقيد Kubernetes متعدّدة المناطق',
      'بناء طبقة المراقبة والتنبيه والرصد الموحّد',
      'إدارة الأسرار وسياسات الامتثال السحابي',
      'تحسين التكلفة وحجز الموارد',
      'إعداد التعافي من الكوارث والنسخ الاحتياطي',
    ],
    tech: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'Grafana', 'ArgoCD'],
    systems: ['CI/CD', 'K8s Cluster', 'Monitoring', 'Secrets Vault'],
    ownership: ['Deploy Pipelines', 'Observability', 'DR Plan', 'Cost Ops'],
    status: 'open',
    phase: 1,
    candidates: 6,
    icon: Cloud,
    cluster: 'devops',
  },
  {
    key: 'ux-industrial',
    ar: 'مصمّم تجربة استخدام صناعية',
    en: 'Industrial UX Designer',
    specializationAr: 'سير عمل صناعي ونظام تصميم RTL',
    specializationEn: 'Enterprise UX · Industrial Workflows · RTL DS',
    responsibilities: [
      'تصميم تجربة لوحات التحكّم للعمليات الميدانية',
      'بناء وصيانة نظام التصميم الموحّد',
      'إجراء أبحاث المستخدمين الميدانية مع المشغّلين',
      'تصميم مخططات RTL/LTR متناسقة',
      'صياغة دلائل الأنماط والمكوّنات',
      'مراجعة قابلية الوصول (WCAG AA)',
    ],
    tech: ['Figma', 'Tokens Studio', 'Storybook', 'Tailwind', 'Lottie', 'Framer', 'A11y', 'RTL'],
    systems: ['Design System', 'Component Library', 'UX Research'],
    ownership: ['Design System', 'UX Patterns', 'A11y', 'Field Research'],
    status: 'filled',
    phase: 1,
    icon: Palette,
    cluster: 'uxqa',
  },
  {
    key: 'qa-automation',
    ar: 'مهندس ضمان جودة وأتمتة',
    en: 'QA Automation Engineer',
    specializationAr: 'اختبارات تكامل وأداء وموثوقيّة',
    specializationEn: 'Playwright · Cypress · k6 · Reliability',
    responsibilities: [
      'بناء حزم اختبارات تكامل وE2E آلية',
      'إعداد اختبارات الأداء والحمل',
      'صياغة استراتيجيّة موثوقيّة وSLO/SLI',
      'تكامل الاختبارات في خط CI/CD',
      'تشخيص الأعطال الميدانية وتقاريرها',
      'مراجعة جودة الإصدارات قبل النشر',
    ],
    tech: ['Playwright', 'Cypress', 'k6', 'Jest', 'Vitest', 'TypeScript', 'Locust', 'Allure'],
    systems: ['CI/CD', 'Test Lab', 'Staging Env'],
    ownership: ['E2E Tests', 'Perf Suite', 'SLO Reports', 'Release Gate'],
    status: 'open',
    phase: 2,
    candidates: 5,
    icon: TestTube2,
    cluster: 'uxqa',
  },
  {
    key: 'security',
    ar: 'مستشار أمن المعلومات',
    en: 'Security Consultant',
    specializationAr: 'نمذجة تهديدات وامتثال زيرو-تراست',
    specializationEn: 'Threat Modeling · KYC · Zero-Trust · Pen-Test',
    responsibilities: [
      'إجراء نمذجة تهديدات للخدمات الجديدة',
      'مراجعة سياسات KYC/AML والامتثال السعودي',
      'تنفيذ بنية زيرو-تراست بين الخدمات',
      'إدارة اختبارات الاختراق الدورية',
      'إعداد متطلّبات الامتثال الحكومي',
      'مراجعة الكود من منظور أمني',
    ],
    tech: ['OWASP', 'Burp Suite', 'Vault', 'OPA', 'Zero-Trust', 'SOC2', 'NCA ECC', 'KYC'],
    systems: ['IAM', 'Secrets Vault', 'Audit Logs', 'Compliance'],
    ownership: ['Threat Models', 'Pen-Test', 'Compliance', 'Sec Reviews'],
    status: 'open',
    phase: 2,
    candidates: 2,
    icon: ShieldAlert,
    cluster: 'security',
  },
  {
    key: 'localization',
    ar: 'متخصّص تعريب وتجربة عربية',
    en: 'Arabic UX / Localization Specialist',
    specializationAr: 'عربية المؤسّسة السعودية ومصطلحات تخصصيّة',
    specializationEn: 'Saudi Enterprise Arabic · Terminology · Copy',
    responsibilities: [
      'صياغة المصطلحات التقنية بالعربيّة المؤسّسية',
      'مراجعة كافّة نصوص الواجهة وضمان الاتّساق',
      'بناء معجم مصطلحات داخلي للمنتج',
      'تكييف الأسلوب لكل قطاع (نفط/مدن/حكومي)',
      'مراجعة ترجمات تلقائية وتدقيقها',
      'كتابة دليل أسلوب التحرير العربي',
    ],
    tech: ['ICU MessageFormat', 'Crowdin', 'Lokalise', 'Glossary Tools', 'CAT', 'TM', 'QA Tools', 'i18n'],
    systems: ['i18n Pipeline', 'Glossary', 'Style Guide'],
    ownership: ['Arabic Copy', 'Terminology', 'Style Guide', 'Locale QA'],
    status: 'filled',
    phase: 1,
    icon: Languages,
    cluster: 'uxqa',
  },
]

const PHASES: PhasePlan[] = [
  {
    phase: 1,
    ar: 'المرحلة الأولى — منتج أوّلي حقيقي',
    en: 'Phase 1 — Real MVP',
    duration: '6 أشهر · May 2026 → Nov 2026',
    headcount: '5 مشغول · 6 مفتوح · 8–9 فعّال',
    color: 'var(--color-admiral-glow)',
    rolesActive: ['tech-lead', 'fe-dashboard', 'fe-3d-gis', 'be-platform', 'robotics', 'devops', 'ux-industrial', 'localization'],
    deliverables: [
      { ar: 'إدارة الأسطول الميداني (G1/Go2)', en: 'Fleet Management', status: 'in-progress' },
      { ar: 'منصة قياس الأداء وتلميتري حيّ', en: 'Live Telemetry', status: 'in-progress' },
      { ar: 'دمج روبوتات Unitree والوكلاء الحافيّون', en: 'Robotics Integration', status: 'in-progress' },
      { ar: 'خرائط تشغيليّة للمملكة (GIS)', en: 'Operational Maps', status: 'planned' },
      { ar: 'مركز عمليّات حيّ (Live Ops)', en: 'Live Operations Center', status: 'planned' },
      { ar: 'نظام تصميم موحّد RTL', en: 'Unified RTL Design System', status: 'live' },
    ],
    milestones: [
      { ar: 'إطلاق MVP الداخلي', en: 'Internal MVP Launch', date: '2026-08-15' },
      { ar: 'تكامل أوّل عميل صناعي', en: 'First Industrial Customer', date: '2026-10-01' },
      { ar: 'مراجعة أمن خارجيّة', en: 'External Security Review', date: '2026-11-10' },
    ],
  },
  {
    phase: 2,
    ar: 'المرحلة الثانية — توسّع المؤسّسة',
    en: 'Phase 2 — Enterprise Scale',
    duration: '+6 أشهر · Nov 2026 → May 2027',
    headcount: '11–14 شخصاً',
    color: 'var(--color-info)',
    rolesActive: ['data-ml-voice', 'qa-automation', 'security'],
    rolesAdded: ['data-ml-voice', 'qa-automation', 'security'],
    deliverables: [
      { ar: 'منظومة الصوت والذكاء الاصطناعي', en: 'AI Voice Systems', status: 'planned' },
      { ar: 'التوأم الرقمي للمنشآت', en: 'Digital Twin', status: 'planned' },
      { ar: 'تحليلات متقدّمة وتنبّؤيّة', en: 'Advanced Analytics', status: 'planned' },
      { ar: 'توسعة المؤسّسة (تعدّد المستأجرين)', en: 'Enterprise Multi-Tenant', status: 'planned' },
      { ar: 'تطبيق جوّال للعمليّات الميدانيّة', en: 'Mobile Field Ops', status: 'planned' },
      { ar: 'منظومة تقييم النماذج (Eval)', en: 'Model Eval Harness', status: 'planned' },
    ],
    milestones: [
      { ar: 'إطلاق نسخة المؤسّسة', en: 'Enterprise Release', date: '2027-02-01' },
      { ar: 'اعتماد الامتثال SOC2', en: 'SOC2 Certification', date: '2027-03-15' },
      { ar: 'تطبيق الجوّال على المتاجر', en: 'Mobile App Live', date: '2027-04-20' },
    ],
  },
  {
    phase: 3,
    ar: 'المرحلة الثالثة — مدن ذكيّة وحكومية',
    en: 'Phase 3 — Government / Smart City',
    duration: '+12 شهراً · May 2027 → 2028',
    headcount: '15–20 شخصاً',
    color: 'var(--color-gold)',
    rolesActive: [],
    rolesAdded: [],
    deliverables: [
      { ar: 'نشر متعدّد المناطق (Multi-Region)', en: 'Multi-Region Deploys', status: 'planned' },
      { ar: 'تكامل المدن الذكيّة (NEOM/Diriyah)', en: 'Smart City Integrations', status: 'planned' },
      { ar: 'تنسيق الذكاء الاصطناعي المتقدّم', en: 'AI Orchestration', status: 'planned' },
      { ar: 'توسعة الامتثال الحكومي', en: 'Compliance Expansion', status: 'planned' },
      { ar: 'بنية تشغيليّة احتياطيّة', en: 'Operational Redundancy', status: 'planned' },
      { ar: 'منصّة تكامل وزاريّة موحّدة', en: 'Unified Ministry Hub', status: 'planned' },
    ],
    milestones: [
      { ar: 'أوّل مدينة ذكيّة منشورة', en: 'First Smart City Live', date: '2027-09-01' },
      { ar: 'اعتماد NCA-ECC الكامل', en: 'NCA-ECC Full Cert', date: '2027-12-15' },
      { ar: 'تكامل وزاريّ موحّد', en: 'Ministry Hub GA', date: '2028-03-01' },
    ],
  },
]

const SKILLS_HEATMAP: Array<{ skill: string; p1: number; p2: number; p3: number }> = [
  { skill: 'React',       p1: 4, p2: 4, p3: 4 },
  { skill: 'TypeScript',  p1: 4, p2: 4, p3: 4 },
  { skill: 'Node.js',     p1: 3, p2: 4, p3: 4 },
  { skill: 'Python',      p1: 3, p2: 4, p3: 4 },
  { skill: 'Go',          p1: 3, p2: 4, p3: 4 },
  { skill: 'ROS2',        p1: 4, p2: 4, p3: 3 },
  { skill: 'MQTT',        p1: 3, p2: 4, p3: 4 },
  { skill: 'Docker',      p1: 4, p2: 4, p3: 4 },
  { skill: 'Kubernetes',  p1: 2, p2: 4, p3: 4 },
  { skill: 'Mapbox',      p1: 3, p2: 4, p3: 4 },
  { skill: 'Three.js',    p1: 3, p2: 4, p3: 4 },
  { skill: 'WebRTC',      p1: 1, p2: 3, p3: 4 },
  { skill: 'gRPC',        p1: 2, p2: 4, p3: 4 },
  { skill: 'PostgreSQL',  p1: 4, p2: 4, p3: 4 },
  { skill: 'TimescaleDB', p1: 3, p2: 4, p3: 4 },
  { skill: 'Redis',       p1: 3, p2: 3, p3: 4 },
  { skill: 'ML/AI',       p1: 1, p2: 4, p3: 4 },
]

const OPEN_POSITIONS: OpenPosition[] = ROLES.filter((r) => r.status === 'open' || r.status === 'recruiting').map((r) => ({
  key: r.key,
  ar: r.ar,
  en: r.en,
  location: r.cluster === 'robotics' ? 'الرياض · حضوري' : r.cluster === 'security' ? 'الرياض · هجين' : 'الرياض / عن بُعد',
  seniority: r.cluster === 'lead' ? 'Lead' : r.cluster === 'security' || r.cluster === 'data' ? 'Senior' : 'Senior',
  reqAr: [
    `خبرة ${r.cluster === 'lead' ? '8+' : '5+'} سنوات في ${r.specializationAr}`,
    `إتقان: ${r.tech.slice(0, 4).join(' / ')}`,
    'إجادة العربية والإنجليزية كتابةً',
    'سابقة في بيئات صناعية أو حكومية مفضّلة',
  ],
  candidates: r.candidates ?? 0,
}))

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function statusToColor(s: RoleStatus): string {
  if (s === 'filled') return 'var(--color-good)'
  if (s === 'recruiting') return 'var(--color-info)'
  return 'var(--color-warn)'
}
function statusAr(s: RoleStatus): string {
  if (s === 'filled') return 'مشغول'
  if (s === 'recruiting') return 'قيد التوظيف'
  return 'مفتوح'
}
function statusEn(s: RoleStatus): string {
  if (s === 'filled') return 'Filled'
  if (s === 'recruiting') return 'Recruiting'
  return 'Open'
}

function delivStatusColor(s: 'planned' | 'in-progress' | 'live'): string {
  if (s === 'live') return 'var(--color-good)'
  if (s === 'in-progress') return 'var(--color-info)'
  return 'var(--color-faint)'
}
function delivStatusAr(s: 'planned' | 'in-progress' | 'live'): string {
  if (s === 'live') return 'منشور'
  if (s === 'in-progress') return 'قيد التنفيذ'
  return 'مخطّط'
}
function delivStatusEn(s: 'planned' | 'in-progress' | 'live'): string {
  if (s === 'live') return 'Live'
  if (s === 'in-progress') return 'In Progress'
  return 'Planned'
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function PlatformTeamPage() {
  const [activeCluster, setActiveCluster] = useState<Role['cluster'] | 'all'>('all')

  const filled = ROLES.filter((r) => r.status === 'filled').length
  const open = ROLES.filter((r) => r.status === 'open').length
  const total = ROLES.length

  const visibleRoles = useMemo(() => {
    if (activeCluster === 'all') return ROLES
    return ROLES.filter((r) => r.cluster === activeCluster)
  }, [activeCluster])

  const kpis: Array<{ ar: string; en: string; value: string; sub: string; tone: string; icon: ComponentType<{ size?: number; className?: string }> }> = [
    { ar: 'إجمالي الأدوار', en: 'Total Roles', value: String(total), sub: 'across 8 clusters', tone: 'var(--color-admiral-glow)', icon: UsersRound },
    { ar: 'مشغولة (المرحلة 1)', en: 'Filled · Phase 1', value: String(filled), sub: `${Math.round((filled / total) * 100)}% staffed`, tone: 'var(--color-good)', icon: CheckCircle2 },
    { ar: 'مفتوحة للتوظيف', en: 'Open Positions', value: String(open), sub: '20 candidates in pipe', tone: 'var(--color-warn)', icon: Briefcase },
    { ar: 'حالة المرحلة', en: 'Phase Status', value: 'P1', sub: 'Real MVP · in flight', tone: 'var(--color-info)', icon: Hourglass },
  ]

  return (
    <PageShell
      active="team"
      ar="فريق المنصة وخارطة المراحل"
      en="Platform Engineering Team & Roadmap"
      icon={UsersRound}
      description="مصفوفة قدرات الهندسة الكاملة لمنصة Savvy World الصناعيّة — الأدوار، التخصّصات، الأنظمة المتّصلة، وخطّة التوظيف عبر ثلاث مراحل من MVP إلى نطاق المدن الذكيّة الحكومي."
    >
      {/* === KPI strip === */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div
              key={k.en}
              className="glass-card glass-card-hover relative overflow-hidden p-4 transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.18)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-en text-[10px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
                    {k.en}
                  </div>
                  <div className="text-[12px] font-bold text-[--color-ink-2]">{k.ar}</div>
                </div>
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border"
                  style={{
                    borderColor: `color-mix(in srgb, ${k.tone} 32%, transparent)`,
                    background: `color-mix(in srgb, ${k.tone} 12%, transparent)`,
                    color: k.tone,
                  }}
                >
                  <Icon size={14} />
                </div>
              </div>
              <div className="mt-2 font-en text-[28px] font-black tabular-nums text-[--color-ink]">
                {k.value}
              </div>
              <div className="mt-0.5 font-en text-[10px] font-semibold uppercase tracking-[0.16em] text-[--color-faint]">
                {k.sub}
              </div>
            </div>
          )
        })}
      </section>

      {/* === Cluster filter === */}
      <section className="mt-4 flex flex-wrap items-center gap-1.5">
        <ClusterChip active={activeCluster === 'all'} onClick={() => setActiveCluster('all')}>كل الأدوار · All</ClusterChip>
        <ClusterChip active={activeCluster === 'lead'} onClick={() => setActiveCluster('lead')}>قيادة · Lead</ClusterChip>
        <ClusterChip active={activeCluster === 'frontend'} onClick={() => setActiveCluster('frontend')}>الواجهة · Frontend</ClusterChip>
        <ClusterChip active={activeCluster === 'backend'} onClick={() => setActiveCluster('backend')}>الخلفيّة · Backend</ClusterChip>
        <ClusterChip active={activeCluster === 'robotics'} onClick={() => setActiveCluster('robotics')}>الروبوتات · Robotics</ClusterChip>
        <ClusterChip active={activeCluster === 'data'} onClick={() => setActiveCluster('data')}>البيانات والذكاء · Data/AI</ClusterChip>
        <ClusterChip active={activeCluster === 'devops'} onClick={() => setActiveCluster('devops')}>السحابة · DevOps</ClusterChip>
        <ClusterChip active={activeCluster === 'uxqa'} onClick={() => setActiveCluster('uxqa')}>تجربة وجودة · UX/QA</ClusterChip>
        <ClusterChip active={activeCluster === 'security'} onClick={() => setActiveCluster('security')}>الأمن · Security</ClusterChip>
      </section>

      {/* === Capability matrix === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {visibleRoles.map((r) => (
          <RoleCard key={r.key} role={r} />
        ))}
      </section>

      {/* === Phasing roadmap === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {PHASES.map((p) => (
          <PhaseCard key={p.phase} phase={p} />
        ))}
      </section>

      {/* === Org chart + Skills heatmap === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {/* Org chart */}
        <div className="glass-card col-span-12 overflow-hidden p-4 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Org Topology · Reporting Lines
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                خريطة فريق الهندسة
              </h3>
            </div>
            <span className="rounded-md border border-[--color-line] bg-black/30 px-2 py-1 font-en text-[10px] font-bold text-[--color-muted]">
              11 nodes · 4 layers
            </span>
          </div>
          <OrgChart />
        </div>

        {/* Skills heatmap */}
        <div className="glass-card col-span-12 flex flex-col overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between p-4 pb-3">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Skills Heatmap · Phase Demand
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                خريطة كثافة المهارات
              </h3>
            </div>
            <HeatLegend />
          </div>
          <div className="hairline mx-4" />
          <div className="overflow-x-auto px-2 pb-2">
            <table className="w-full min-w-[320px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-start font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                    Skill · مهارة
                  </th>
                  <th className="px-2 py-2 text-center font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                    P1
                  </th>
                  <th className="px-2 py-2 text-center font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                    P2
                  </th>
                  <th className="px-2 py-2 text-center font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
                    P3
                  </th>
                </tr>
              </thead>
              <tbody>
                {SKILLS_HEATMAP.map((s) => (
                  <tr key={s.skill}>
                    <td className="border-t border-[--color-line] px-2 py-1.5 font-en text-[11.5px] font-bold text-[--color-ink-2]">
                      {s.skill}
                    </td>
                    <td className="border-t border-[--color-line] px-2 py-1.5 text-center">
                      <HeatCell intensity={s.p1} />
                    </td>
                    <td className="border-t border-[--color-line] px-2 py-1.5 text-center">
                      <HeatCell intensity={s.p2} />
                    </td>
                    <td className="border-t border-[--color-line] px-2 py-1.5 text-center">
                      <HeatCell intensity={s.p3} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* === Open positions === */}
      <section className="glass-card mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 pb-3">
          <div>
            <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
              Open Positions · Hiring Pipeline
            </div>
            <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
              الوظائف المفتوحة — {OPEN_POSITIONS.length} دور
            </h3>
          </div>
          <span className="rounded-md border border-[rgba(245,165,36,0.28)] bg-[--color-warn]/10 px-2.5 py-1 font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-warn]">
            Riyadh / Remote · Q2-Q3 2026
          </span>
        </div>
        <div className="hairline mx-4" />
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {OPEN_POSITIONS.map((p) => (
            <OpenPositionCard key={p.key} pos={p} />
          ))}
        </div>
      </section>
    </PageShell>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function ClusterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-en text-[10.5px] font-bold uppercase tracking-[0.14em] transition-shadow',
        active
          ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/15 text-[--color-ink] shadow-[0_0_18px_rgba(78,163,255,0.18)]'
          : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)] hover:text-[--color-ink]',
      )}
    >
      {children}
    </button>
  )
}

function StatusPill({ status, candidates }: { status: RoleStatus; candidates?: number }) {
  const color = statusToColor(status)
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold"
      style={{
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span>{statusAr(status)}</span>
      <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] opacity-80">
        {statusEn(status)}
      </span>
      {status !== 'filled' && candidates !== undefined && candidates > 0 && (
        <span className="ms-1 rounded-md bg-black/40 px-1.5 py-0.5 font-en text-[9.5px] font-bold tabular-nums text-[--color-ink]">
          {candidates}
        </span>
      )}
    </span>
  )
}

function Chip({ children, tone = 'admiral' }: { children: ReactNode; tone?: 'admiral' | 'muted' | 'gold' | 'info' }) {
  const map: Record<string, string> = {
    admiral: 'border-[rgba(78,163,255,0.22)] bg-[rgba(78,163,255,0.08)] text-[--color-ink-2]',
    muted: 'border-[--color-line] bg-black/30 text-[--color-muted]',
    gold: 'border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.08)] text-[--color-ink-2]',
    info: 'border-[rgba(56,189,248,0.28)] bg-[rgba(56,189,248,0.08)] text-[--color-ink-2]',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 font-en text-[10px] font-bold tracking-[0.04em]',
        map[tone],
      )}
    >
      {children}
    </span>
  )
}

function RoleCard({ role }: { role: Role }) {
  const Icon = role.icon
  return (
    <article className="glass-card glass-card-hover col-span-12 flex flex-col gap-3 p-4 transition-shadow md:col-span-12 lg:col-span-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow]">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold leading-tight text-[--color-ink]">
              {role.ar}
            </h3>
            <div className="mt-0.5 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-admiral-glow]">
              {role.en}
            </div>
            <div className="mt-1 text-[11.5px] font-semibold text-[--color-ink-2]">
              {role.specializationAr}
            </div>
            <div className="mt-0.5 font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
              {role.specializationEn}
            </div>
          </div>
        </div>
        <StatusPill status={role.status} candidates={role.candidates} />
      </header>

      <div className="hairline" />

      {/* Responsibilities */}
      <div>
        <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
          Core Responsibilities · المسؤوليات
        </div>
        <ul className="space-y-1">
          {role.responsibilities.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-[--color-ink-2]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[--color-admiral-glow]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech stack */}
      <div>
        <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
          Core Stack · التقنيّات
        </div>
        <div className="flex flex-wrap gap-1.5">
          {role.tech.map((t) => (
            <Chip key={t} tone="admiral">{t}</Chip>
          ))}
        </div>
      </div>

      {/* Connected systems */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
            Connected Systems
          </div>
          <div className="flex flex-wrap gap-1.5">
            {role.systems.map((s) => (
              <Chip key={s} tone="info">{s}</Chip>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
            Ownership Areas
          </div>
          <div className="flex flex-wrap gap-1.5">
            {role.ownership.map((o) => (
              <Chip key={o} tone="gold">{o}</Chip>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function PhaseCard({ phase }: { phase: PhasePlan }) {
  const rolesAdded = (phase.rolesAdded ?? []).map((k) => ROLES.find((r) => r.key === k)).filter(Boolean) as Role[]
  const rolesActive = phase.rolesActive.map((k) => ROLES.find((r) => r.key === k)).filter(Boolean) as Role[]
  return (
    <article
      className="glass-card col-span-12 flex flex-col gap-3 p-4 lg:col-span-4"
      style={{
        boxShadow: `0 0 0 1px color-mix(in srgb, ${phase.color} 18%, var(--color-line)), 0 12px 40px rgba(0,0,0,0.45)`,
      }}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <div
            className="font-en text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: phase.color }}
          >
            Phase {phase.phase} · {phase.en.split('— ')[1] ?? phase.en}
          </div>
          <h3 className="mt-1 text-[16px] font-extrabold leading-tight text-[--color-ink]">
            {phase.ar}
          </h3>
        </div>
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border"
          style={{
            borderColor: `color-mix(in srgb, ${phase.color} 32%, transparent)`,
            background: `color-mix(in srgb, ${phase.color} 12%, transparent)`,
            color: phase.color,
          }}
        >
          <Layers size={14} />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[--color-line] bg-black/30 p-2.5">
          <div className="flex items-center gap-1.5">
            <CalendarRange size={11} className="text-[--color-faint]" />
            <div className="font-en text-[9px] font-bold uppercase tracking-[0.14em] text-[--color-faint]">
              Duration
            </div>
          </div>
          <div className="mt-1 font-en text-[11px] font-extrabold text-[--color-ink]">
            {phase.duration}
          </div>
        </div>
        <div className="rounded-xl border border-[--color-line] bg-black/30 p-2.5">
          <div className="flex items-center gap-1.5">
            <UsersRound size={11} className="text-[--color-faint]" />
            <div className="font-en text-[9px] font-bold uppercase tracking-[0.14em] text-[--color-faint]">
              Headcount
            </div>
          </div>
          <div className="mt-1 font-en text-[11px] font-extrabold text-[--color-ink]">
            {phase.headcount}
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
          Deliverables · التسليمات
        </div>
        <ul className="space-y-1.5">
          {phase.deliverables.map((d) => {
            const c = delivStatusColor(d.status)
            return (
              <li key={d.en} className="flex items-start gap-2 text-[12px]">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: c, boxShadow: `0 0 8px color-mix(in srgb, ${c} 40%, transparent)` }}
                />
                <span className="flex-1 font-medium text-[--color-ink-2]">{d.ar}</span>
                <span
                  className="shrink-0 rounded-md border px-1.5 py-0.5 font-en text-[8.5px] font-bold uppercase tracking-[0.12em]"
                  style={{
                    borderColor: `color-mix(in srgb, ${c} 32%, transparent)`,
                    background: `color-mix(in srgb, ${c} 12%, transparent)`,
                    color: c,
                  }}
                  title={delivStatusAr(d.status)}
                >
                  {delivStatusEn(d.status)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Roles added in this phase */}
      {rolesAdded.length > 0 && (
        <div>
          <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
            New Roles · أدوار مضافة
          </div>
          <div className="flex flex-wrap gap-1.5">
            {rolesAdded.map((r) => {
              const Icon = r.icon
              return (
                <span
                  key={r.key}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(78,163,255,0.22)] bg-[rgba(78,163,255,0.06)] px-2 py-0.5 text-[10.5px] font-bold text-[--color-ink-2]"
                >
                  <Icon size={10} className="text-[--color-admiral-glow]" />
                  <span>{r.ar.split('·')[0].split('—')[0].trim()}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Active roles in this phase (P1 only — others have rolesAdded) */}
      {phase.phase === 1 && rolesActive.length > 0 && (
        <div>
          <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
            Active Roles · أدوار فعّالة
          </div>
          <div className="flex flex-wrap gap-1.5">
            {rolesActive.map((r) => {
              const Icon = r.icon
              const c = statusToColor(r.status)
              return (
                <span
                  key={r.key}
                  className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10.5px] font-bold text-[--color-ink-2]"
                  style={{
                    borderColor: `color-mix(in srgb, ${c} 28%, var(--color-line))`,
                    background: `color-mix(in srgb, ${c} 8%, transparent)`,
                  }}
                >
                  <span style={{ color: c, display: 'inline-flex' }}>
                    <Icon size={10} />
                  </span>
                  <span>{r.ar.split('·')[0].split('—')[0].trim()}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Milestones */}
      <div>
        <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
          Key Milestones · المعالم
        </div>
        <ul className="space-y-1.5">
          {phase.milestones.map((m) => (
            <li
              key={m.en}
              className="flex items-center justify-between gap-2 rounded-xl border border-[--color-line] bg-black/25 px-2.5 py-1.5"
            >
              <div className="flex items-start gap-2 min-w-0">
                <Target size={11} className="mt-0.5 shrink-0" style={{ color: phase.color }} />
                <div className="min-w-0">
                  <div className="truncate text-[11.5px] font-bold text-[--color-ink]">{m.ar}</div>
                  <div className="truncate font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
                    {m.en}
                  </div>
                </div>
              </div>
              <span className="shrink-0 font-en text-[10px] font-extrabold tabular-nums text-[--color-ink-2]">
                {m.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/* ----- Org chart (SVG) ------------------------------------------------ */

function OrgChart() {
  // Layout coordinates inside a 1100x520 viewBox.
  const layers: Array<{
    y: number
    nodes: Array<{ x: number; w: number; key: string; ar: string; en: string; status: RoleStatus }>
  }> = [
    {
      y: 30,
      nodes: [{ x: 425, w: 250, key: 'tech-lead', ar: 'القائد التقني', en: 'Tech Lead', status: 'filled' }],
    },
    {
      y: 150,
      nodes: [
        { x: 30,  w: 200, key: 'fe-cluster',  ar: 'الواجهة', en: 'Frontend',  status: 'filled' },
        { x: 250, w: 180, key: 'be-platform', ar: 'الخلفيّة', en: 'Backend',  status: 'filled' },
        { x: 450, w: 180, key: 'robotics',    ar: 'روبوتات', en: 'Robotics', status: 'filled' },
        { x: 650, w: 200, key: 'data-ml',     ar: 'بيانات وذكاء', en: 'Data / ML', status: 'open' },
        { x: 870, w: 200, key: 'devops',      ar: 'سحابة',   en: 'DevOps',   status: 'open' },
      ],
    },
    {
      y: 280,
      nodes: [
        { x: 20,  w: 210, key: 'fe-dashboard', ar: 'لوحات تحكّم', en: 'Dashboard FE', status: 'filled' },
        { x: 250, w: 210, key: 'fe-3d-gis',    ar: '٣د و GIS',     en: '3D & GIS FE',  status: 'open' },
        { x: 480, w: 210, key: 'ux-industrial', ar: 'تجربة صناعيّة', en: 'Industrial UX', status: 'filled' },
        { x: 710, w: 210, key: 'qa-automation', ar: 'ضمان الجودة',   en: 'QA Automation', status: 'open' },
        { x: 940, w: 150, key: 'security',     ar: 'الأمن',         en: 'Security',     status: 'open' },
      ],
    },
    {
      y: 410,
      nodes: [
        { x: 20,  w: 210, key: 'localization', ar: 'تعريب', en: 'Localization', status: 'filled' },
      ],
    },
  ]

  // Edges: parent (layer,index) -> child (layer,index)
  const edges: Array<[number, number, number, number]> = [
    // Layer0 → Layer1 (5 children)
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 2],
    [0, 0, 1, 3],
    [0, 0, 1, 4],
    // Layer1[0] (Frontend) → FE-Dashboard, FE-3D
    [1, 0, 2, 0],
    [1, 0, 2, 1],
    // Layer1[0] (Frontend cluster) → Industrial UX shared with backend? attach UX to Tech Lead via FE
    [1, 0, 2, 2],
    // Layer1[1] (Backend) → QA
    [1, 1, 2, 3],
    // Layer1[4] (DevOps) → Security
    [1, 4, 2, 4],
    // FE-Dashboard → Localization
    [2, 0, 3, 0],
  ]

  function nodeAt(layerIdx: number, nodeIdx: number) {
    const layer = layers[layerIdx]
    const n = layer.nodes[nodeIdx]
    return { cx: n.x + n.w / 2, cy: layer.y + 26, x: n.x, y: layer.y, w: n.w, h: 52, n }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[--color-line] bg-black/30">
      <div
        className="pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-[rgba(78,163,255,0.06)] to-transparent"
        style={{ animation: 'scan-line 8s ease-in-out infinite' }}
      />
      <svg viewBox="0 0 1100 520" className="block h-auto w-full">
        <defs>
          <linearGradient id="org-edge" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(78,163,255,0.35)" />
            <stop offset="100%" stopColor="rgba(78,163,255,0.10)" />
          </linearGradient>
          <pattern id="org-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(78,163,255,0.10)" />
          </pattern>
        </defs>

        <rect width="1100" height="520" fill="url(#org-grid)" />

        {/* Edges */}
        <g>
          {edges.map(([la, na, lb, nb], idx) => {
            const a = nodeAt(la, na)
            const b = nodeAt(lb, nb)
            const midY = (a.cy + a.h / 2 + b.cy - b.h / 2) / 2
            const d = `M ${a.cx} ${a.y + a.h} C ${a.cx} ${midY}, ${b.cx} ${midY}, ${b.cx} ${b.y}`
            return (
              <path
                key={idx}
                d={d}
                fill="none"
                stroke="url(#org-edge)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )
          })}
        </g>

        {/* Nodes */}
        <g>
          {layers.map((L, li) =>
            L.nodes.map((n, ni) => {
              const c = statusToColor(n.status)
              const isLead = li === 0
              return (
                <g key={`${li}-${ni}`}>
                  <rect
                    x={n.x}
                    y={L.y}
                    width={n.w}
                    height={52}
                    rx={14}
                    ry={14}
                    fill={isLead ? 'rgba(78,163,255,0.10)' : 'rgba(11,16,36,0.85)'}
                    stroke={isLead ? 'rgba(78,163,255,0.55)' : 'rgba(78,163,255,0.22)'}
                    strokeWidth={1.25}
                  />
                  <circle cx={n.x + 14} cy={L.y + 16} r={4} fill={c} />
                  <text
                    x={n.x + 26}
                    y={L.y + 22}
                    fontSize="13"
                    fontWeight="800"
                    fill="#f4f6fb"
                    fontFamily="Tajawal, IBM Plex Sans Arabic, system-ui"
                  >
                    {n.ar}
                  </text>
                  <text
                    x={n.x + 26}
                    y={L.y + 40}
                    fontSize="10"
                    fontWeight="700"
                    fill="#7a86a8"
                    fontFamily="Inter, system-ui"
                    letterSpacing="1.5"
                  >
                    {n.en.toUpperCase()}
                  </text>
                </g>
              )
            }),
          )}
        </g>
      </svg>
    </div>
  )
}

/* ----- Heatmap helpers ----------------------------------------------- */

function HeatCell({ intensity }: { intensity: number }) {
  // intensity 1..4
  const i = Math.max(0, Math.min(4, intensity))
  const alpha = i === 0 ? 0.04 : 0.15 + i * 0.18
  const color = i >= 4 ? 'var(--color-admiral-glow)' : i >= 3 ? 'var(--color-admiral-2)' : i >= 2 ? 'var(--color-info)' : 'var(--color-faint)'
  return (
    <div
      className="mx-auto grid h-6 w-12 place-items-center rounded-md border font-en text-[10px] font-extrabold tabular-nums"
      style={{
        background: `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`,
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        color: i >= 3 ? 'var(--color-ink)' : 'var(--color-ink-2)',
      }}
      title={`Demand: ${i}/4`}
    >
      {i}
    </div>
  )
}

function HeatLegend() {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((n) => (
        <HeatCell key={n} intensity={n} />
      ))}
    </div>
  )
}

/* ----- Open positions ------------------------------------------------ */

function OpenPositionCard({ pos }: { pos: OpenPosition }) {
  return (
    <article className="glass-card glass-card-hover flex flex-col gap-3 p-4 transition-shadow">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-[14px] font-extrabold leading-tight text-[--color-ink]">
            {pos.ar}
          </h4>
          <div className="mt-0.5 truncate font-en text-[10px] font-bold uppercase tracking-[0.16em] text-[--color-admiral-glow]">
            {pos.en}
          </div>
        </div>
        <span className="shrink-0 rounded-md border border-[rgba(245,165,36,0.28)] bg-[--color-warn]/10 px-2 py-0.5 font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-warn]">
          Open
        </span>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <MetaCell icon={MapPin} ar="الموقع" en="Location" v={pos.location} />
        <MetaCell icon={Building2} ar="الأقدميّة" en="Seniority" v={pos.seniority} />
        <MetaCell icon={UsersRound} ar="مرشّحون" en="Candidates" v={String(pos.candidates)} />
      </div>

      <div>
        <div className="mb-1.5 font-en text-[9.5px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
          Key Requirements · المتطلّبات
        </div>
        <ul className="space-y-1">
          {pos.reqAr.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[11.5px] font-medium leading-relaxed text-[--color-ink-2]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[--color-admiral-glow]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[--color-line] pt-3">
        <div>
          <div className="font-en text-[9.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
            Salary Band
          </div>
          <div className="text-[12px] font-extrabold text-[--color-ink]">منافسة</div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 px-3 py-2 font-en text-[10.5px] font-bold uppercase tracking-[0.18em] text-[--color-ink] transition-shadow hover:shadow-[0_0_24px_rgba(78,163,255,0.22)]">
          <span>تقديم</span>
          <span>· Apply</span>
          <ArrowRight size={11} />
        </button>
      </div>
    </article>
  )
}

function MetaCell({
  icon: Icon,
  ar,
  en,
  v,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  ar: string
  en: string
  v: string
}) {
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/25 p-2">
      <div className="flex items-center gap-1.5">
        <Icon size={10} className="text-[--color-faint]" />
        <div className="font-en text-[8.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
          {en}
        </div>
      </div>
      <div className="mt-0.5 truncate text-[10.5px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className="truncate text-[11.5px] font-extrabold text-[--color-ink]">{v}</div>
    </div>
  )
}
