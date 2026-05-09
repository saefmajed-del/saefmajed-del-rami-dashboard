import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useSpring } from 'framer-motion'
import { 
  Sparkles, 
  Search, 
  Terminal, 
  Cpu, 
  Zap, 
  Command, 
  ArrowRight, 
  Activity, 
  ShieldCheck,
  Bot,
  Globe,
  Waves
} from 'lucide-react'
import { PageShell } from './_PageShell'

/* ------------------------------------------------------------------ */
/* 3D Background: Neural Particle Network                              */
/* ------------------------------------------------------------------ */

function NeuralParticles() {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20
      p[i * 3 + 1] = (Math.random() - 0.5) * 20
      p[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return p
  }, [])

  const ref = useRef<THREE.Points>(null!)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.1
    ref.current.rotation.y = t
    ref.current.rotation.x = t * 0.5
  })

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4ea3ff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function FloatingCore() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#0057B7"
          wireframe
          emissive="#4ea3ff"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh scale={0.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#4ea3ff" emissive="#4ea3ff" emissiveIntensity={5} />
      </mesh>
    </Float>
  )
}

/* ------------------------------------------------------------------ */
/* UI Components: Animated Metrics                                     */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    return spring.on('change', (latest) => setDisplay(Math.round(latest)))
  }, [spring])

  return <>{display}</>
}

function MagicStatCard({ 
  ar, 
  en, 
  value, 
  unit, 
  icon: Icon,
  delay = 0 
}: { 
  ar: string, 
  en: string, 
  value: number, 
  unit: string, 
  icon: any,
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="glass-card group relative overflow-hidden p-5 transition-all hover:border-[rgba(78,163,255,0.4)]"
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

/* ------------------------------------------------------------------ */
/* Feature: Mock Command Palette                                      */
/* ------------------------------------------------------------------ */

function MockCommandPalette() {
  const [query, setQuery] = useState('')
  
  const suggestions = [
    { icon: Bot, ar: 'تحديد موقع G1-RUH-01', en: 'Locate humanoid robot' },
    { icon: Zap, ar: 'تفعيل وضع الطاقة القصوى', en: 'Enable performance mode' },
    { icon: ShieldCheck, ar: 'تشغيل تدقيق أمني', en: 'Run security audit' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-3 border-b border-[--color-line] bg-white/[0.02] p-4">
        <Search size={18} className="text-[--color-admiral-glow]" />
        <input 
          type="text" 
          placeholder="ابحث عن أمر أو روبوت... (Cmd+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-[15px] font-bold text-[--color-ink] outline-none placeholder:text-[--color-faint]"
        />
        <div className="flex items-center gap-1 rounded border border-[--color-line] bg-white/[0.05] px-1.5 py-0.5 font-en text-[10px] font-bold text-[--color-muted]">
          <Command size={10} />
          K
        </div>
      </div>
      <div className="p-2">
        {suggestions.map((s, i) => (
          <button 
            key={i}
            className="flex w-full items-center justify-between gap-3 rounded-xl p-3 transition-colors hover:bg-[--color-admiral]/10 group"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[--color-line] bg-white/[0.03] text-[--color-ink-2] group-hover:border-[rgba(78,163,255,0.3)] group-hover:text-[--color-admiral-glow]">
                <s.icon size={14} />
              </div>
              <div className="text-start">
                <div className="text-[13px] font-bold text-[--color-ink]">{s.ar}</div>
                <div className="font-en text-[9px] font-semibold uppercase tracking-wider text-[--color-faint]">{s.en}</div>
              </div>
            </div>
            <ArrowRight size={14} className="text-[--color-faint] opacity-0 transition-all -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Feature: Live Terminal Logs                                        */
/* ------------------------------------------------------------------ */

function LiveTerminal() {
  const [logs, setLogs] = useState<string[]>([
    '[04:18:01] System boot complete.',
    '[04:18:05] Establishing neural handshake...',
    '[04:18:12] 13/13 assets online.',
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().toLocaleTimeString('en-GB', { hour12: false })
      const messages = [
        `Incoming telemetry from DRN-RUH-01`,
        `Neural sync stabilized at 98.4%`,
        `OTA manifest v3.4.2 verified`,
        `New intent detected: fleet.locate`,
      ]
      const msg = messages[Math.floor(Math.random() * messages.length)]
      setLogs(prev => [...prev.slice(-5), `[${now}] ${msg}`])
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-2xl border border-[--color-line] bg-black/60 p-4 font-mono">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500/80" />
        <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
        <div className="h-2 w-2 rounded-full bg-green-500/80" />
        <span className="ms-2 font-en text-[10px] font-bold uppercase tracking-widest text-[--color-faint]">System Console</span>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <motion.div 
            key={log + i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[11px] leading-relaxed text-[#4ea3ff]/90"
          >
            <span className="text-[--color-faint] opacity-50">$</span> {log}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block h-3 w-1.5 bg-[--color-admiral-glow] align-middle"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page: Showcase                                                     */
/* ------------------------------------------------------------------ */

export function ShowcasePage() {
  return (
    <PageShell
      active="showcase"
      ar="معرض السحر"
      en="Gemini Magic Showcase"
      icon={Sparkles}
      description="مساحة تجريبية لاستعراض تقنيات الواجهة المتقدمة — WebGL، Framer Motion، وتصميم الأنظمة الحية."
    >
      {/* 3D Hero Section */}
      <section className="relative mb-6 h-[400px] w-full overflow-hidden rounded-3xl border border-[--color-line] bg-[#050813]">
        <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <NeuralParticles />
            <FloatingCore />
          </Canvas>
        </div>
        
        <div className="relative z-10 flex h-full flex-col items-center justify-center bg-gradient-to-t from-[#050813] via-transparent to-transparent p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(78,163,255,0.3)] bg-[--color-admiral]/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles size={14} className="text-[--color-admiral-glow]" />
              <span className="font-en text-[11px] font-black uppercase tracking-[0.3em] text-[--color-admiral-glow]">Next-Gen Industrial OS</span>
            </div>
            <h1 className="mt-6 text-[42px] font-black leading-tight text-white md:text-[56px]">
              الجيل القادم من <span className="text-[--color-admiral-glow]">الذكاء</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[600px] text-[16px] font-medium leading-relaxed text-[--color-ink-2]">
              دفع حدود التصميم والتكنولوجيا لإنشاء تجربة تشغيلية لا مثيل لها.
              <span className="block font-en text-[13px] uppercase tracking-wider opacity-60 mt-1">Pushing boundaries of design and tech for unparalleled operations.</span>
            </p>
          </motion.div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Metrics & Logs */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <div className="grid grid-cols-1 gap-4">
            <MagicStatCard 
              ar="وحدة المعالجة المركزية" 
              en="System Neural Load" 
              value={94} 
              unit="TFLOPS" 
              icon={Cpu} 
              delay={0.1}
            />
            <MagicStatCard 
              ar="استقرار الشبكة" 
              en="Network Coherence" 
              value={99} 
              unit="%" 
              icon={Globe} 
              delay={0.2}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LiveTerminal />
          </motion.div>
        </div>

        {/* Center/Right Column: Feature Demos */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-[18px] font-extrabold text-[--color-ink]">لوحة الأوامر السريعة</h3>
                  <p className="font-en text-[10px] font-semibold uppercase tracking-widest text-[--color-faint]">Command Orchestrator</p>
                </div>
                <div className="h-8 w-8 rounded-full border border-[--color-line] bg-white/[0.03] grid place-items-center text-[--color-faint]">
                   <Terminal size={14} />
                </div>
              </div>
              <MockCommandPalette />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card relative flex flex-col items-center justify-center overflow-hidden p-8 text-center"
            >
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative z-10">
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-[rgba(78,163,255,0.3)] bg-gradient-to-br from-[#0a3a7e] to-[#003d82] text-[--color-admiral-glow] shadow-[0_0_40px_rgba(78,163,255,0.3)]">
                  <Waves size={32} />
                </div>
                <h3 className="text-[20px] font-extrabold text-[--color-ink]">الاستجابة الحركية</h3>
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-[--color-ink-2]">
                  تفاعل حقيقي مع كل حركة مشغل.
                </p>
                <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-[14px] font-black text-black transition-transform hover:scale-105 active:scale-95">
                  <Activity size={16} />
                  تفعيل النبض
                </button>
              </div>
            </motion.div>
          </div>

          {/* Large Interactive Panel */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card group relative min-h-[300px] overflow-hidden p-8"
          >
            <div className="absolute -end-24 -top-24 h-64 w-64 rounded-full bg-[--color-admiral-glow]/5 blur-[80px] transition-all group-hover:bg-[--color-admiral-glow]/15" />
            
            <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-[28px] font-black text-white">تحكم مطلق في <span className="text-[--color-admiral-glow]">التدفق</span></h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[--color-ink-2]">
                  نظام سفي الصناعي يوفر لك رؤية كاملة لتدفق البيانات بين الروبوتات والحافة والسحابة، مع تأخير يقترب من الصفر.
                </p>
                <div className="mt-8 flex gap-4">
                  <div className="flex flex-col">
                    <span className="font-en text-[22px] font-black text-[--color-good]">12ms</span>
                    <span className="font-en text-[10px] font-bold uppercase tracking-widest text-[--color-faint]">Edge Latency</span>
                  </div>
                  <div className="w-px bg-[--color-line]" />
                  <div className="flex flex-col">
                    <span className="font-en text-[22px] font-black text-[--color-admiral-glow]">4.2GB/s</span>
                    <span className="font-en text-[10px] font-bold uppercase tracking-widest text-[--color-faint]">Data Throughput</span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square">
                <div className="absolute inset-0 animate-pulse rounded-full border-2 border-dashed border-[rgba(78,163,255,0.2)]" />
                <div className="absolute inset-8 animate-[spin_10s_linear_infinite] rounded-full border-2 border-dotted border-[rgba(78,163,255,0.3)]" />
                <div className="absolute inset-0 grid place-items-center">
                   <Bot size={80} className="text-[--color-admiral-glow] opacity-80" />
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </PageShell>
  )
}
