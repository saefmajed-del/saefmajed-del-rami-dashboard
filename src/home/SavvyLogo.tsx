// Real Savvy brand mark — hand-drawn brush script. Source: Downloads/Savvy logo.pdf
// Two raster variants: light (black ink) for white surfaces, dark (white ink) for dark surfaces.
// "vv" stays brand royal blue per the brand rule.

interface SavvyLogoProps {
  /** Render height in px. Width auto-scales from the natural ~1.69:1 ratio. */
  height?: number
  /** "dark" = white ink + blue vv (use on dark surfaces). "light" = black ink + blue vv. */
  variant?: 'light' | 'dark'
  className?: string
}

const RATIO = 1234 / 731 // from extracted PNG

export function SavvyLogo({ height = 28, variant = 'dark', className }: SavvyLogoProps) {
  const src = import.meta.env.BASE_URL + (variant === 'dark' ? 'savvy-logo-dark.png' : 'savvy-logo.png')
  return (
    <img
      src={src}
      alt="Savvy"
      width={Math.round(height * RATIO)}
      height={height}
      draggable={false}
      className={`select-none ${className ?? ''}`}
      style={{ display: 'inline-block', height, width: 'auto' }}
    />
  )
}
