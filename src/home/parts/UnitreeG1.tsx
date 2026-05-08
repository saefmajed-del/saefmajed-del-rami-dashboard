// Real product photo, sourced from savvyworld.ai/robot/g1/g1.png

interface Props {
  className?: string
  width?: number | string
  height?: number | string
  glow?: boolean
}

export function UnitreeG1({ className, width = '100%', height = '100%' }: Props) {
  const src = import.meta.env.BASE_URL + 'robots/g1.jpg'
  return (
    <div className={`relative ${className ?? ''}`} style={{ width, height }}>
      <img
        src={src}
        alt="Unitree G1"
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover object-center"
      />
      {/* dark vignette to integrate with the dark UI */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050813]/85 via-[#050813]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050813]/45 via-transparent to-[#050813]/45" />
    </div>
  )
}
