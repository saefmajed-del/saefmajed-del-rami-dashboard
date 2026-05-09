import { motion } from 'framer-motion'
import { AnimatedNumber } from './AnimatedNumber'
import { useSimulatedValue } from '@/lib/magic-hooks'
import { cn } from '@/lib/utils'

interface MagicStatCardProps {
  ar: string
  en: string
  value: number
  unit: string
  icon: any
  delay?: number
  className?: string
  simulate?: boolean
}

export function MagicStatCard({ 
  ar, 
  en, 
  value: initialValue, 
  unit, 
  icon: Icon,
  delay = 0,
  className,
  simulate = true
}: MagicStatCardProps) {
  const value = simulate ? useSimulatedValue(initialValue) : initialValue
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "glass-card group relative overflow-hidden p-5 transition-all hover:border-[rgba(78,163,255,0.4)]",
        className
      )}
    >
      <div className="absolute -end-8 -top-8 h-24 w-24 rounded-full bg-[--color-admiral-glow]/5 blur-2xl transition-all group-hover:bg-[--color-admiral-glow]/10" />
      
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow] transition-transform group-hover:scale-110">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-[14px] font-extrabold text-[--color-ink]">{ar}</div>
          <div className="font-en text-[10px] font-semibold uppercase tracking-[0.2em] text-[--color-faint]">{en}</div>
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-en text-[32px] font-black tabular-nums tracking-tight text-[--color-ink]">
          <AnimatedNumber value={value} />
        </span>
        <span className="font-en text-[14px] font-bold text-[--color-muted]">{unit}</span>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ delay: delay + 0.5, duration: 1.5, ease: "circOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[--color-admiral-deep] to-[--color-admiral-glow]" 
        />
      </div>
    </motion.div>
  )
}
