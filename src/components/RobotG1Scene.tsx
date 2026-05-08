/**
 * LiDAR scene SVG: Unitree G1 + 5 detected people + scan beams.
 * Pure presentation — no external state.
 */
export function RobotG1Scene() {
  return (
    <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
      {/* Floor */}
      <ellipse cx="400" cy="290" rx="350" ry="22" fill="rgba(255,255,255,0.05)" />

      {/* Person 1 — left, happy */}
      <g transform="translate(120,170)">
        <circle cx="0" cy="-30" r="14" fill="#1E8E3E" />
        <rect x="-12" y="-15" width="24" height="40" rx="6" fill="#1E8E3E" />
        <text x="0" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
          سعيد · أحمد
        </text>
      </g>

      {/* Person 2 — left, neutral */}
      <g transform="translate(220,180)">
        <circle cx="0" cy="-30" r="13" fill="#E8A33D" />
        <rect x="-11" y="-16" width="22" height="38" rx="6" fill="#E8A33D" />
        <text x="0" y="48" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
          محايد · فاطمة
        </text>
      </g>

      {/* Robot G1 — center */}
      <g transform="translate(400,165)">
        <rect x="-25" y="-20" width="50" height="60" rx="8" fill="#E8E8ED" />
        <circle cx="0" cy="-40" r="20" fill="#FFFFFF" />
        <rect x="-12" y="-46" width="24" height="6" fill="#0a0a0a" />
        <circle cx="-7" cy="-43" r="2" fill="#00B4FF" />
        <circle cx="7" cy="-43" r="2" fill="#00B4FF" />
        <ellipse cx="0" cy="-62" rx="14" ry="6" fill="#00B4FF" opacity="0.6" />
        <ellipse cx="0" cy="-62" rx="14" ry="6" fill="none" stroke="#00B4FF" strokeWidth="2" />
        <rect x="-32" y="-15" width="8" height="40" rx="4" fill="#D2D2D7" />
        <rect x="24" y="-15" width="8" height="40" rx="4" fill="#D2D2D7" />
        <rect x="-15" y="40" width="10" height="50" rx="4" fill="#515154" />
        <rect x="5" y="40" width="10" height="50" rx="4" fill="#515154" />
        <text x="0" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="800">
          savvy-001
        </text>
      </g>

      {/* Scan beams */}
      <g stroke="#00B4FF" strokeWidth="1" opacity="0.5" fill="none">
        <line x1="400" y1="100" x2="120" y2="155" />
        <line x1="400" y1="100" x2="220" y2="155" />
        <line x1="400" y1="100" x2="560" y2="160" />
        <line x1="400" y1="100" x2="660" y2="170" />
        <line x1="400" y1="100" x2="720" y2="195" />
      </g>

      {/* Person 3 — right, happy */}
      <g transform="translate(560,175)">
        <circle cx="0" cy="-30" r="14" fill="#1E8E3E" />
        <rect x="-12" y="-15" width="24" height="40" rx="6" fill="#1E8E3E" />
        <text x="0" y="50" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
          سعيد · سارة
        </text>
      </g>

      {/* Person 4 — passing */}
      <g transform="translate(660,185)">
        <circle cx="0" cy="-28" r="13" fill="#86868B" />
        <rect x="-11" y="-15" width="22" height="38" rx="6" fill="#86868B" />
        <text x="0" y="48" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
          عابر · مجهول
        </text>
      </g>

      {/* Person 5 — right edge, happy */}
      <g transform="translate(720,200)">
        <circle cx="0" cy="-25" r="12" fill="#1E8E3E" />
        <rect x="-10" y="-13" width="20" height="34" rx="5" fill="#1E8E3E" />
        <text x="0" y="45" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
          سعيد · محمد
        </text>
      </g>
    </svg>
  )
}
