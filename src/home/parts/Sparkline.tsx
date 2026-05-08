interface Props {
  data: number[]
  trend: 'up' | 'down' | 'flat'
  height?: number
  className?: string
}

export function Sparkline({ data, trend, height = 36, className }: Props) {
  if (!data.length) return null
  const width = 100
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const step = width / (data.length - 1)
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / span) * (height - 4) - 2}`)
  const path = `M${points.join(' L')}`
  const area = `${path} L${width},${height} L0,${height} Z`

  const stroke =
    trend === 'up' ? '#4ea3ff' : trend === 'down' ? '#f5a524' : '#7a86a8'
  const fill = trend === 'up' ? 'rgba(78,163,255,0.18)' : trend === 'down' ? 'rgba(245,165,36,0.16)' : 'rgba(122,134,168,0.14)'

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id={`sl-${trend}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="rgba(78,163,255,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sl-${trend})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / span) * (height - 4) - 2} r="1.6" fill={stroke} />
    </svg>
  )
}
