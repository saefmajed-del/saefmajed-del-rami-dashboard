// Unitree G1 — humanoid (1.3m, 29-DOF). Industrial schematic-style line art.
// Replace with photographic render when product photography is approved by Astrid (Creative).

interface Props {
  className?: string
  width?: number | string
  height?: number | string
  glow?: boolean
}

export function UnitreeG1({ className, width = '100%', height = '100%', glow = true }: Props) {
  return (
    <svg viewBox="0 0 200 360" width={width} height={height} className={className} aria-label="Unitree G1">
      <defs>
        <linearGradient id="g1-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dde4ee" />
          <stop offset="40%" stopColor="#9aa5b8" />
          <stop offset="100%" stopColor="#3d4456" />
        </linearGradient>
        <linearGradient id="g1-joint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1d28" />
          <stop offset="100%" stopColor="#080a12" />
        </linearGradient>
        <linearGradient id="g1-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1220" />
          <stop offset="60%" stopColor="#03050b" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <radialGradient id="g1-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(78,163,255,0.18)" />
          <stop offset="100%" stopColor="rgba(78,163,255,0)" />
        </radialGradient>
        {glow && (
          <filter id="g1-led" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* floor pad */}
      <ellipse cx="100" cy="346" rx="64" ry="8" fill="url(#g1-floor)" />

      {/* legs */}
      <g stroke="#0a0d18" strokeWidth="0.8">
        {/* left leg (viewer right) */}
        <path d="M118 196 L124 256 L122 304 L130 332 L142 332 L138 300 L128 252 Z" fill="url(#g1-body)" />
        {/* right leg (viewer left) */}
        <path d="M82 196 L76 256 L78 304 L70 332 L58 332 L62 300 L72 252 Z" fill="url(#g1-body)" />
        {/* knee joints */}
        <circle cx="120" cy="258" r="6" fill="url(#g1-joint)" />
        <circle cx="80" cy="258" r="6" fill="url(#g1-joint)" />
        {/* feet */}
        <rect x="55" y="332" width="22" height="6" rx="2" fill="#11141d" />
        <rect x="123" y="332" width="22" height="6" rx="2" fill="#11141d" />
      </g>

      {/* hip plate */}
      <path d="M68 188 L132 188 L138 208 L62 208 Z" fill="url(#g1-joint)" stroke="#0a0d18" strokeWidth="0.8" />

      {/* torso */}
      <path
        d="M62 102 Q60 96 66 90 L82 78 L118 78 L134 90 Q140 96 138 102 L142 184 Q142 192 134 192 L66 192 Q58 192 58 184 Z"
        fill="url(#g1-body)"
        stroke="#0a0d18"
        strokeWidth="0.9"
      />
      {/* chest panel */}
      <path
        d="M82 96 L118 96 L118 150 L100 162 L82 150 Z"
        fill="#0a0e1a"
        stroke="rgba(78,163,255,0.35)"
        strokeWidth="0.6"
      />
      <line x1="100" y1="100" x2="100" y2="158" stroke="rgba(78,163,255,0.16)" strokeWidth="0.5" />
      {/* sternum LED */}
      <circle cx="100" cy="118" r="2" fill="#4ea3ff" filter={glow ? 'url(#g1-led)' : undefined} />

      {/* shoulders */}
      <circle cx="60" cy="92" r="10" fill="url(#g1-joint)" />
      <circle cx="140" cy="92" r="10" fill="url(#g1-joint)" />

      {/* arms — relaxed at sides */}
      <g stroke="#0a0d18" strokeWidth="0.8">
        <path d="M50 96 L46 158 L52 198 L56 196 L52 158 L58 100 Z" fill="url(#g1-body)" />
        <path d="M150 96 L154 158 L148 198 L144 196 L148 158 L142 100 Z" fill="url(#g1-body)" />
        {/* elbows */}
        <circle cx="49" cy="160" r="4.5" fill="url(#g1-joint)" />
        <circle cx="151" cy="160" r="4.5" fill="url(#g1-joint)" />
        {/* hands */}
        <ellipse cx="50" cy="206" rx="6" ry="9" fill="url(#g1-joint)" />
        <ellipse cx="150" cy="206" rx="6" ry="9" fill="url(#g1-joint)" />
      </g>

      {/* neck */}
      <rect x="92" y="68" width="16" height="12" rx="3" fill="url(#g1-joint)" />

      {/* head */}
      <path
        d="M76 26 Q76 14 88 12 L112 12 Q124 14 124 26 L124 60 Q124 72 112 72 L88 72 Q76 72 76 60 Z"
        fill="url(#g1-body)"
        stroke="#0a0d18"
        strokeWidth="0.9"
      />
      {/* visor (black gloss) */}
      <path
        d="M82 28 Q82 22 90 20 L110 20 Q118 22 118 28 L118 50 Q118 56 110 56 L90 56 Q82 56 82 50 Z"
        fill="url(#g1-visor)"
        stroke="rgba(78,163,255,0.55)"
        strokeWidth="0.85"
        filter={glow ? 'url(#g1-led)' : undefined}
      />
      {/* visor inner gloss highlight */}
      <path d="M86 26 Q88 24 96 24 L108 24" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" fill="none" />
      {/* eye dots */}
      <circle cx="93" cy="38" r="1.4" fill="#4ea3ff" filter={glow ? 'url(#g1-led)' : undefined} />
      <circle cx="107" cy="38" r="1.4" fill="#4ea3ff" filter={glow ? 'url(#g1-led)' : undefined} />

      {/* model tag */}
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
        UNITREE G1
      </text>
    </svg>
  )
}
