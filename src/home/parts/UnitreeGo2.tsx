// Unitree Go2 — quadruped. Industrial line art with sensor turret.

interface Props {
  className?: string
  width?: number | string
  height?: number | string
}

export function UnitreeGo2({ className, width = '100%', height = '100%' }: Props) {
  return (
    <svg viewBox="0 0 280 200" width={width} height={height} className={className} aria-label="Unitree Go2">
      <defs>
        <linearGradient id="go2-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e1e7ef" />
          <stop offset="50%" stopColor="#9ba6b8" />
          <stop offset="100%" stopColor="#3a4154" />
        </linearGradient>
        <linearGradient id="go2-joint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#191c26" />
          <stop offset="100%" stopColor="#06070e" />
        </linearGradient>
        <linearGradient id="go2-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1020" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
        <radialGradient id="go2-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(78,163,255,0.18)" />
          <stop offset="100%" stopColor="rgba(78,163,255,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="140" cy="186" rx="120" ry="6" fill="url(#go2-floor)" />

      {/* far legs (slightly behind) */}
      <g opacity="0.7">
        <path d="M82 110 L78 150 L74 178 L82 178 L86 152 L92 116 Z" fill="url(#go2-body)" stroke="#0a0d18" strokeWidth="0.6" />
        <path d="M210 110 L214 150 L218 178 L210 178 L206 152 L200 116 Z" fill="url(#go2-body)" stroke="#0a0d18" strokeWidth="0.6" />
      </g>

      {/* body — boxy but rounded */}
      <path
        d="M62 88 Q58 70 80 64 L210 64 Q232 70 228 88 L226 110 Q224 122 212 122 L78 122 Q66 122 64 110 Z"
        fill="url(#go2-body)"
        stroke="#0a0d18"
        strokeWidth="0.9"
      />
      {/* dorsal panel */}
      <path d="M88 70 L202 70 L196 96 L94 96 Z" fill="#0a0e1a" stroke="rgba(78,163,255,0.3)" strokeWidth="0.5" />
      {/* spine led */}
      <line x1="100" y1="82" x2="190" y2="82" stroke="rgba(78,163,255,0.45)" strokeWidth="0.6" />
      <circle cx="145" cy="82" r="1.5" fill="#4ea3ff" />

      {/* head — forward-mounted */}
      <path
        d="M218 78 Q244 80 244 100 L244 116 Q244 128 230 130 L210 130 Q204 128 204 120 L204 90 Q204 80 218 78 Z"
        fill="url(#go2-body)"
        stroke="#0a0d18"
        strokeWidth="0.9"
      />
      {/* visor */}
      <path
        d="M222 92 Q238 92 238 102 L238 116 Q238 122 230 122 L218 122 Q214 120 214 116 L214 100 Q214 92 222 92 Z"
        fill="url(#go2-visor)"
        stroke="rgba(78,163,255,0.55)"
        strokeWidth="0.8"
      />
      {/* sensor dots */}
      <circle cx="221" cy="106" r="1.4" fill="#4ea3ff" />
      <circle cx="232" cy="106" r="1.4" fill="#4ea3ff" />

      {/* sensor turret on top — LiDAR puck */}
      <ellipse cx="155" cy="62" rx="14" ry="4" fill="url(#go2-joint)" />
      <ellipse cx="155" cy="58" rx="14" ry="4" fill="url(#go2-body)" stroke="#0a0d18" strokeWidth="0.6" />
      <line x1="142" y1="56" x2="168" y2="56" stroke="rgba(78,163,255,0.5)" strokeWidth="0.6" />

      {/* near legs (foreground) */}
      <g stroke="#0a0d18" strokeWidth="0.8">
        <path d="M92 116 L88 156 L82 184 L98 184 L102 156 L108 122 Z" fill="url(#go2-body)" />
        <path d="M196 116 L200 156 L206 184 L190 184 L186 156 L180 122 Z" fill="url(#go2-body)" />
        <circle cx="92" cy="148" r="5" fill="url(#go2-joint)" />
        <circle cx="196" cy="148" r="5" fill="url(#go2-joint)" />
        <ellipse cx="90" cy="184" rx="9" ry="3" fill="#0c0f17" />
        <ellipse cx="198" cy="184" rx="9" ry="3" fill="#0c0f17" />
      </g>

      <text
        x="140"
        y="196"
        textAnchor="middle"
        fill="rgba(196,210,236,0.4)"
        fontSize="6"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
        letterSpacing="2"
      >
        UNITREE GO2
      </text>
    </svg>
  )
}
