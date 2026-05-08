interface Props {
  bars?: number
  className?: string
}

export function Waveform({ bars = 48, className }: Props) {
  const heights = Array.from({ length: bars }, (_, i) => {
    // pseudo-random but stable, biased to middle
    const t = i / bars
    const env = Math.sin(t * Math.PI) * 0.7 + 0.3
    const noise = ((Math.sin(i * 1.31) + 1) / 2) * 0.5 + ((Math.cos(i * 0.73) + 1) / 2) * 0.5
    return Math.max(0.12, env * (0.5 + noise * 0.5))
  })
  return (
    <div className={`flex items-center justify-between gap-[2px] ${className ?? ''}`}>
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[3px] flex-1 max-w-[5px] rounded-full bg-gradient-to-t from-[--color-admiral-deep] to-[--color-admiral-glow]"
          style={{
            height: `${Math.round(h * 100)}%`,
            animation: `wave 1.6s ease-in-out infinite`,
            animationDelay: `${(i % 8) * 0.07}s`,
            transformOrigin: 'center',
            opacity: 0.55 + h * 0.45,
          }}
        />
      ))}
    </div>
  )
}
