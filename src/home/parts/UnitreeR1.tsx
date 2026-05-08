// Unitree R1 — newer humanoid, sleeker single-piece visor. Industrial line art.

interface Props {
  className?: string
  width?: number | string
  height?: number | string
}

export function UnitreeR1({ className, width = '100%', height = '100%' }: Props) {
  return (
    <svg viewBox="0 0 200 360" width={width} height={height} className={className} aria-label="Unitree R1">
      <defs>
        <linearGradient id="r1-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9eef5" />
          <stop offset="50%" stopColor="#aab4c4" />
          <stop offset="100%" stopColor="#41485c" />
        </linearGradient>
        <linearGradient id="r1-joint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#191c26" />
          <stop offset="100%" stopColor="#070912" />
        </linearGradient>
        <linearGradient id="r1-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1020" />
          <stop offset="60%" stopColor="#02040a" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <radialGradient id="r1-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(78,163,255,0.18)" />
          <stop offset="100%" stopColor="rgba(78,163,255,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="346" rx="68" ry="8" fill="url(#r1-floor)" />

      {/* legs — slightly wider athletic stance */}
      <g stroke="#0a0d18" strokeWidth="0.8">
        <path d="M120 196 L132 256 L132 308 L142 332 L154 332 L148 300 L132 250 Z" fill="url(#r1-body)" />
        <path d="M80 196 L68 256 L68 308 L58 332 L46 332 L52 300 L68 250 Z" fill="url(#r1-body)" />
        <circle cx="128" cy="260" r="6.5" fill="url(#r1-joint)" />
        <circle cx="72" cy="260" r="6.5" fill="url(#r1-joint)" />
        <rect x="42" y="332" width="24" height="6" rx="2" fill="#0f1219" />
        <rect x="134" y="332" width="24" height="6" rx="2" fill="#0f1219" />
      </g>

      {/* hip + waist */}
      <path d="M64 184 L136 184 L142 210 L58 210 Z" fill="url(#r1-joint)" />

      {/* torso — more athletic, narrow waist */}
      <path
        d="M58 100 Q56 94 64 88 L82 76 L118 76 L136 88 Q144 94 142 100 L138 158 L138 184 Q138 192 130 192 L70 192 Q62 192 62 184 L62 158 Z"
        fill="url(#r1-body)"
        stroke="#0a0d18"
        strokeWidth="0.9"
      />
      {/* chest panel ridge */}
      <path d="M84 92 L116 92 L116 154 L100 168 L84 154 Z" fill="#0a0e1a" stroke="rgba(78,163,255,0.32)" strokeWidth="0.5" />
      <line x1="100" y1="98" x2="100" y2="162" stroke="rgba(78,163,255,0.14)" strokeWidth="0.4" />

      {/* shoulders */}
      <circle cx="58" cy="90" r="11" fill="url(#r1-joint)" />
      <circle cx="142" cy="90" r="11" fill="url(#r1-joint)" />

      {/* arms */}
      <g stroke="#0a0d18" strokeWidth="0.8">
        <path d="M48 96 L42 156 L48 198 L54 196 L50 156 L58 100 Z" fill="url(#r1-body)" />
        <path d="M152 96 L158 156 L152 198 L146 196 L150 156 L142 100 Z" fill="url(#r1-body)" />
        <circle cx="46" cy="158" r="4.5" fill="url(#r1-joint)" />
        <circle cx="154" cy="158" r="4.5" fill="url(#r1-joint)" />
        <ellipse cx="48" cy="206" rx="6" ry="9" fill="url(#r1-joint)" />
        <ellipse cx="152" cy="206" rx="6" ry="9" fill="url(#r1-joint)" />
      </g>

      {/* neck */}
      <rect x="93" y="64" width="14" height="14" rx="4" fill="url(#r1-joint)" />

      {/* head — single-piece smooth helmet */}
      <path
        d="M74 24 Q74 10 90 8 L110 8 Q126 10 126 24 L126 60 Q126 70 116 72 L84 72 Q74 70 74 60 Z"
        fill="url(#r1-body)"
        stroke="#0a0d18"
        strokeWidth="0.9"
      />
      {/* full-width visor */}
      <path
        d="M78 22 Q78 14 90 12 L110 12 Q122 14 122 22 L122 52 Q122 60 112 62 L88 62 Q78 60 78 52 Z"
        fill="url(#r1-visor)"
        stroke="rgba(78,163,255,0.6)"
        strokeWidth="0.95"
      />
      {/* led strip across visor */}
      <line x1="84" y1="36" x2="116" y2="36" stroke="#4ea3ff" strokeWidth="0.7" opacity="0.85" />
      {/* sensor cluster */}
      <circle cx="100" cy="46" r="1.6" fill="#4ea3ff" />

      <text
        x="100"
        y="356"
        textAnchor="middle"
        fill="rgba(196,210,236,0.4)"
        fontSize="6"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
        letterSpacing="2"
      >
        UNITREE R1
      </text>
    </svg>
  )
}
