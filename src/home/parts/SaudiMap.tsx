// Saudi Arabia map — simplified polygon outline + regional dialect zones.
// viewBox: 100 (lon) x 110 (lat), with 0..100 mapping ~32E..56E, 0..110 ~33N..15N.

import type { RobotPin } from '../data'
import { pinKind } from '../data'

interface Props {
  pins?: RobotPin[]
  showDialects?: boolean
  showCities?: boolean
  className?: string
}

// More detailed national boundary (~30 points): NW corner -> Jordan/Iraq border ->
// Kuwait notch -> Gulf coast (Bahrain bay, Qatar peninsula notch) -> UAE border ->
// Empty Quarter -> Yemen border -> Red Sea coast -> back.
const KSA_OUTLINE = `
  M 12 18
  L 18 14
  L 26 12
  L 36 12
  L 46 14
  L 54 16
  L 60 14
  L 64 18
  L 70 22
  L 76 22
  L 78 26
  L 80 30
  L 82 34
  L 86 36
  L 86 40
  L 84 44
  L 88 48
  L 86 52
  L 82 54
  L 84 58
  L 88 62
  L 92 68
  L 90 76
  L 84 82
  L 76 84
  L 66 86
  L 54 88
  L 44 90
  L 36 92
  L 30 90
  L 28 84
  L 26 76
  L 22 68
  L 18 58
  L 14 48
  L 12 38
  L 10 28
  Z
`.replace(/\s+/g, ' ').trim()

// Internal dialect regions, simplified.
const DIALECT_REGIONS = [
  { d: 'M 50 30 L 70 32 L 72 50 L 58 56 L 46 52 L 44 38 Z', name: 'النجدي', en: 'Najdi', maturity: 96, lx: 58, ly: 42 },
  { d: 'M 22 38 L 34 32 L 44 38 L 42 54 L 26 58 L 20 50 Z', name: 'الحجازي', en: 'Hijazi', maturity: 91, lx: 32, ly: 46 },
  { d: 'M 70 30 L 86 34 L 88 50 L 72 52 L 70 38 Z', name: 'الشرقاوي', en: 'Eastern', maturity: 84, lx: 78, ly: 42 },
  { d: 'M 14 18 L 36 14 L 42 24 L 26 28 L 18 26 Z', name: 'التبوكي', en: 'Tabuki', maturity: 58, lx: 28, ly: 22 },
  { d: 'M 44 16 L 60 16 L 66 26 L 52 30 L 44 26 Z', name: 'القصيمي', en: 'Qassimi', maturity: 78, lx: 56, ly: 22 },
  { d: 'M 30 60 L 46 58 L 50 72 L 36 76 L 26 70 Z', name: 'البدوي', en: 'Bedouin', maturity: 47, lx: 38, ly: 68 },
  { d: 'M 50 60 L 68 58 L 72 72 L 58 78 L 50 72 Z', name: 'الجنوبي', en: 'Southern', maturity: 71, lx: 60, ly: 68 },
  { d: 'M 30 78 L 52 78 L 54 88 L 42 92 L 32 86 Z', name: 'العسيري', en: 'Asiri', maturity: 64, lx: 42, ly: 84 },
  { d: 'M 26 86 L 38 88 L 38 92 L 30 92 Z', name: 'الجيزاني', en: 'Jizani', maturity: 52, lx: 32, ly: 89 },
]

// Major cities (geographic anchors). Coordinates align with the new outline.
const CITIES = [
  { ar: 'الرياض', en: 'Riyadh', x: 56, y: 50 },
  { ar: 'جدة', en: 'Jeddah', x: 28, y: 60 },
  { ar: 'الدمام', en: 'Dammam', x: 80, y: 40 },
  { ar: 'مكة', en: 'Mecca', x: 30, y: 64 },
  { ar: 'المدينة', en: 'Medina', x: 30, y: 48 },
  { ar: 'تبوك', en: 'Tabuk', x: 22, y: 22 },
  { ar: 'القصيم', en: 'Qassim', x: 50, y: 38 },
  { ar: 'أبها', en: 'Abha', x: 42, y: 82 },
  { ar: 'جيزان', en: 'Jizan', x: 34, y: 90 },
  { ar: 'نيوم', en: 'NEOM', x: 14, y: 22 },
]

export function SaudiMap({ pins = [], showDialects = false, showCities = false, className }: Props) {
  return (
    <svg viewBox="0 0 100 110" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ksa-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(45,127,217,0.14)" />
          <stop offset="100%" stopColor="rgba(0,87,183,0.04)" />
        </linearGradient>
        <radialGradient id="pin-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(78,163,255,0.55)" />
          <stop offset="100%" stopColor="rgba(78,163,255,0)" />
        </radialGradient>
        <pattern id="topo" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 1.5 L3 1.5" stroke="rgba(78,163,255,0.05)" strokeWidth="0.2" />
        </pattern>
      </defs>

      <path d={KSA_OUTLINE} fill="url(#ksa-fill)" stroke="rgba(78,163,255,0.6)" strokeWidth="0.6" strokeLinejoin="round" />
      <path d={KSA_OUTLINE} fill="url(#topo)" />

      {/* dialect overlays */}
      {showDialects &&
        DIALECT_REGIONS.map((r, i) => {
          const opacity = 0.06 + (r.maturity / 100) * 0.18
          return (
            <g key={i}>
              <path
                d={r.d}
                fill={`rgba(78,163,255,${opacity})`}
                stroke="rgba(78,163,255,0.18)"
                strokeWidth="0.25"
              />
              <text
                x={r.lx}
                y={r.ly}
                textAnchor="middle"
                fontSize="2.6"
                fontWeight="700"
                fill="rgba(244,246,251,0.85)"
                fontFamily="Tajawal, sans-serif"
              >
                {r.name}
              </text>
              <text
                x={r.lx}
                y={r.ly + 3}
                textAnchor="middle"
                fontSize="1.7"
                fontWeight="600"
                fill="rgba(78,163,255,0.85)"
                fontFamily="Inter, sans-serif"
                letterSpacing="0.3"
              >
                {r.maturity}%
              </text>
            </g>
          )
        })}

      {/* city markers */}
      {showCities &&
        CITIES.map((c) => (
          <g key={c.en} opacity="0.7">
            <circle cx={c.x} cy={c.y} r="0.5" fill="rgba(244,246,251,0.7)" />
            <text
              x={c.x + 1.2}
              y={c.y + 0.6}
              fontSize="1.7"
              fill="rgba(244,246,251,0.55)"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              {c.en}
            </text>
          </g>
        ))}

      {/* robot + drone pins */}
      {pins.map((p) => {
        const color =
          p.status === 'online' ? '#22c55e' : p.status === 'warn' ? '#f5a524' : '#7a86a8'
        const kind = pinKind(p)
        if (kind === 'drone') {
          return (
            <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
              {p.status === 'online' && (
                <circle r="4.2" fill="url(#pin-glow)">
                  <animate attributeName="r" values="3.4;5.2;3.4" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              {/* quadcopter top-down: 4 rotor circles + cross */}
              <g stroke="rgba(255,255,255,0.65)" strokeWidth="0.28" fill={color}>
                <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke={color} strokeWidth="0.4" />
                <line x1="-1.8" y1="1.8" x2="1.8" y2="-1.8" stroke={color} strokeWidth="0.4" />
                <circle cx="-1.8" cy="-1.8" r="0.7" />
                <circle cx="1.8" cy="-1.8" r="0.7" />
                <circle cx="-1.8" cy="1.8" r="0.7" />
                <circle cx="1.8" cy="1.8" r="0.7" />
                <circle r="0.55" fill="#0b1024" stroke={color} strokeWidth="0.35" />
              </g>
            </g>
          )
        }
        const isQuad = kind === 'quadruped'
        return (
          <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
            {p.status === 'online' && <circle r="3.6" fill="url(#pin-glow)" />}
            {isQuad ? (
              // small box for quadruped
              <rect x="-1.3" y="-0.9" width="2.6" height="1.8" rx="0.4" fill={color} stroke="rgba(255,255,255,0.6)" strokeWidth="0.25" />
            ) : (
              // circle for humanoid
              <circle r="1.2" fill={color} stroke="rgba(255,255,255,0.6)" strokeWidth="0.25" />
            )}
            {p.status === 'online' && (
              <circle r="0.9" fill={color}>
                <animate attributeName="r" values="0.9;2.6;0.9" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        )
      })}

      {/* compass + scale chrome */}
      <g transform="translate(86 96)" opacity="0.55">
        <circle r="3.6" fill="none" stroke="rgba(78,163,255,0.4)" strokeWidth="0.25" />
        <line x1="0" y1="-3.6" x2="0" y2="3.6" stroke="rgba(78,163,255,0.6)" strokeWidth="0.25" />
        <line x1="-3.6" y1="0" x2="3.6" y2="0" stroke="rgba(78,163,255,0.4)" strokeWidth="0.25" />
        <text x="0" y="-4.2" textAnchor="middle" fontSize="2" fill="#4ea3ff" fontFamily="Inter">
          N
        </text>
      </g>
    </svg>
  )
}
