import { Pencil, History, Crosshair, Eraser } from 'lucide-react'
import { MAP_PINS } from '@/data/fleet'
import { cn } from '@/lib/utils'

const PIN_COLORS = {
  online: 'bg-admiral',
  warn: 'bg-warn',
  offline: 'bg-bad',
}

export function MenaMap() {
  return (
    <div className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f0f4fa] to-[#e6ecf5]">
      {/* Tools */}
      <div className="absolute inset-inline-start-2.5 top-2.5 z-10 flex flex-col gap-1.5">
        {[Pencil, History, Crosshair, Eraser].map((Icon, i) => (
          <button
            key={i}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl border-none bg-white shadow-[0_8px_30px_rgba(20,20,40,0.06)] hover:bg-admiral hover:text-white"
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        <path
          d="M 60 180 Q 120 80, 250 90 Q 380 60, 470 100 Q 560 130, 540 220 Q 510 300, 400 320 Q 280 340, 180 310 Q 80 280, 60 180 Z"
          fill="rgba(0,87,183,0.12)"
          stroke="rgba(0,87,183,0.3)"
          strokeWidth="2"
        />
        <path
          d="M 280 160 Q 320 140, 380 155 Q 410 200, 380 260 Q 320 280, 280 250 Q 260 200, 280 160 Z"
          fill="rgba(0,87,183,0.18)"
          stroke="#003D82"
          strokeWidth="1.5"
        />
        <text x="330" y="215" textAnchor="middle" fill="#003D82" fontSize="14" fontWeight="800">
          السعودية
        </text>
        <text x="180" y="200" textAnchor="middle" fill="#515154" fontSize="11" fontWeight="600">
          مصر
        </text>
        <text x="450" y="180" textAnchor="middle" fill="#515154" fontSize="11" fontWeight="600">
          الإمارات
        </text>
        <text x="100" y="160" textAnchor="middle" fill="#515154" fontSize="11" fontWeight="600">
          المغرب
        </text>
        {/* Geofence */}
        <circle cx="335" cy="210" r="38" fill="none" stroke="#1E8E3E" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
      </svg>

      {/* Pins */}
      {MAP_PINS.map((pin) => (
        <div
          key={pin.id}
          className="absolute -translate-x-1/2 -translate-y-full text-center pointer-events-none"
          style={{ top: pin.top, left: pin.left }}
        >
          <div
            className={cn(
              'mx-auto h-3.5 w-3.5 rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
              PIN_COLORS[pin.status],
            )}
            style={{ animation: 'pulse-ring 2s ease-out infinite' }}
          />
          <div className="mt-0.5 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {pin.id} · {pin.label}
          </div>
        </div>
      ))}
    </div>
  )
}
