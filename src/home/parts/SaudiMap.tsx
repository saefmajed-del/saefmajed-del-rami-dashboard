// Stylized Saudi Arabia outline with dialect regions + robot pins.
// Coordinate space: 100x110 viewBox.

import type { RobotPin } from '../data'

interface Props {
  pins?: RobotPin[]
  showDialects?: boolean
  className?: string
}

const KSA_OUTLINE =
  'M14,16 L26,12 L40,14 L52,10 L62,12 L74,18 L80,20 L84,30 L90,38 L94,44 L88,52 L86,62 L84,72 L78,80 L70,86 L60,92 L48,96 L36,94 L28,90 L24,82 L22,72 L18,60 L14,48 L12,36 L12,24 Z'

const DIALECT_REGIONS = [
  { d: 'M52 28 L72 28 L74 46 L60 52 L48 50 L46 38 Z', name: 'النجدي', en: 'Najdi', maturity: 96, lx: 60, ly: 40 },
  { d: 'M22 38 L34 30 L42 36 L40 50 L26 56 L20 50 Z', name: 'الحجازي', en: 'Hijazi', maturity: 91, lx: 30, ly: 44 },
  { d: 'M70 28 L86 30 L88 48 L72 50 L70 38 Z', name: 'الشرقاوي', en: 'Eastern', maturity: 84, lx: 78, ly: 40 },
  { d: 'M14 18 L36 14 L40 26 L26 30 L18 28 Z', name: 'التبوكي', en: 'Tabuki', maturity: 58, lx: 26, ly: 22 },
  { d: 'M44 16 L60 14 L66 26 L52 30 L44 26 Z', name: 'القصيمي', en: 'Qassimi', maturity: 78, lx: 56, ly: 22 },
  { d: 'M30 56 L46 54 L48 68 L36 72 L26 66 Z', name: 'البدوي', en: 'Bedouin', maturity: 47, lx: 38, ly: 64 },
  { d: 'M48 56 L66 54 L70 70 L56 76 L48 70 Z', name: 'الجنوبي', en: 'Southern', maturity: 71, lx: 60, ly: 66 },
  { d: 'M30 74 L52 76 L52 88 L40 92 L32 84 Z', name: 'العسيري', en: 'Asiri', maturity: 64, lx: 42, ly: 82 },
  { d: 'M22 84 L36 86 L36 94 L26 92 Z', name: 'الجيزاني', en: 'Jizani', maturity: 52, lx: 30, ly: 90 },
]

export function SaudiMap({ pins = [], showDialects = false, className }: Props) {
  return (
    <svg viewBox="0 0 100 110" className={className} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ksa-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(45,127,217,0.12)" />
          <stop offset="100%" stopColor="rgba(0,87,183,0.04)" />
        </linearGradient>
        <radialGradient id="pin-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(78,163,255,0.55)" />
          <stop offset="100%" stopColor="rgba(78,163,255,0)" />
        </radialGradient>
        <pattern id="topo" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 1.5 L3 1.5" stroke="rgba(78,163,255,0.04)" strokeWidth="0.2" />
        </pattern>
      </defs>

      {/* outline */}
      <path d={KSA_OUTLINE} fill="url(#ksa-fill)" stroke="rgba(78,163,255,0.55)" strokeWidth="0.6" />
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

      {/* robot pins */}
      {pins.map((p) => {
        const color =
          p.status === 'online' ? '#22c55e' : p.status === 'warn' ? '#f5a524' : '#7a86a8'
        return (
          <g key={p.id} transform={`translate(${p.x} ${p.y})`}>
            {p.status === 'online' && <circle r="3.6" fill="url(#pin-glow)" />}
            <circle r="1.2" fill={color} stroke="rgba(255,255,255,0.6)" strokeWidth="0.25" />
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
      <g transform="translate(86 88)" opacity="0.55">
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
