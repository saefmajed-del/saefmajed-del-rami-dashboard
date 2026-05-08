// Real cinematic render, sourced from savvyworld.ai/robot/go2/DZDA.654.png

interface Props {
  className?: string
  width?: number | string
  height?: number | string
}

export function UnitreeGo2({ className, width = '100%', height = '100%' }: Props) {
  const src = import.meta.env.BASE_URL + 'robots/go2.jpg'
  return (
    <div className={`relative ${className ?? ''}`} style={{ width, height }}>
      <img
        src={src}
        alt="Unitree Go2"
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050813]/60 to-transparent" />
    </div>
  )
}
