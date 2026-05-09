import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, Points, PointMaterial, MeshDistortMaterial, GradientTexture } from '@react-three/drei'
import * as THREE from 'three'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Bot, 
  ArrowLeft, 
  ChevronDown,
  Layers,
  Zap,
  Activity
} from 'lucide-react'
import { useNavigate } from '@/lib/router'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* 3D Scene: Cinematic Background                                      */
/* ------------------------------------------------------------------ */

function CinematicBackground() {
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30
      p[i * 3 + 1] = (Math.random() - 0.5) * 30
      p[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return p
  }, [])

  const ref = useRef<THREE.Points>(null!)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.05
    ref.current.rotation.y = t
  })

  return (
    <group>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#0057B7"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.4}
        />
      </Points>
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[4, 64, 64]} />
          <MeshDistortMaterial
            color="#001d4a"
            speed={2}
            distort={0.4}
            radius={1}
          >
            <GradientTexture
              stops={[0, 1]}
              colors={['#0057B7', '#050813']}
            />
          </MeshDistortMaterial>
        </mesh>
      </Float>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function BentoCard({ 
  ar, 
  en, 
  icon: Icon, 
  className,
  delay = 0 
}: { 
  ar: string, 
  en: string, 
  icon: any, 
  className?: string,
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={cn(
        "glass-card group relative flex flex-col justify-between overflow-hidden p-8 transition-all hover:border-[rgba(78,163,255,0.4)]",
        className
      )}
    >
      <div className="absolute -end-12 -top-12 h-40 w-40 rounded-full bg-[--color-admiral-glow]/5 blur-3xl transition-all group-hover:bg-[--color-admiral-glow]/15" />
      <div className="relative z-10">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[rgba(78,163,255,0.22)] bg-gradient-to-br from-[#0a3a7e]/40 to-[#003d82]/15 text-[--color-admiral-glow] shadow-[0_0_20px_rgba(78,163,255,0.15)] group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <h3 className="mt-8 text-[24px] font-black text-white">{ar}</h3>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-[--color-ink-2]">
          <span className="font-en uppercase tracking-wider opacity-60 block mb-1">{en}</span>
          تمكين البنية التحتية الذكية من خلال أحدث تقنيات الروبوتات والذكاء الاصطناعي في المملكة.
        </p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Page: Landing                                                      */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div className="min-h-screen bg-[#050813] text-[--color-ink] selection:bg-[--color-admiral-glow]/30 overflow-x-hidden">
      {/* Cinematic Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 backdrop-blur-md border-b border-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-[rgba(78,163,255,0.3)] bg-gradient-to-br from-[#0a3a7e] to-[#003d82] shadow-[0_0_15px_rgba(78,163,255,0.2)]">
            <span className="font-en font-black text-[14px] text-white">S<span className="text-[--color-admiral-glow]">vv</span></span>
          </div>
          <span className="text-[18px] font-black tracking-tight text-white">SAVVY WORLD</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('home')}
            className="hidden md:block font-en text-[11px] font-black uppercase tracking-[0.25em] text-[--color-muted] hover:text-[--color-admiral-glow] transition-colors"
          >
            Launch OS
          </button>
          <button 
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-[13px] font-black text-black transition-transform hover:scale-105 active:scale-95"
          >
            <Activity size={14} />
            <span>نظام التشغيل</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <CinematicBackground />
          </Canvas>
        </motion.div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(78,163,255,0.3)] bg-[--color-admiral]/10 px-6 py-2 backdrop-blur-xl mb-8">
              <Sparkles size={16} className="text-[--color-admiral-glow]" />
              <span className="font-en text-[12px] font-black uppercase tracking-[0.3em] text-[--color-admiral-glow]">Industrial Intelligence v2.0</span>
            </div>
            <h1 className="text-[52px] md:text-[88px] font-black leading-tight text-white max-w-[1000px]">
              مستقبل الروبوتات <span className="text-[--color-admiral-glow]">يبدأ هنا</span>
            </h1>
            <p className="mt-8 mx-auto max-w-[700px] text-[18px] md:text-[22px] font-medium leading-relaxed text-[--color-ink-2]">
              نظام تشغيل صناعي متكامل يربط بين الذكاء الاصطناعي المتقدم والأسطول الروبوتات في بيئات العمل الحقيقية.
              <span className="block font-en text-[14px] uppercase tracking-[0.15em] opacity-60 mt-3">An integrated industrial OS linking advanced AI with robotic fleets.</span>
            </p>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('home')}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[--color-admiral-glow] px-10 py-5 text-[18px] font-black text-white shadow-[0_20px_50px_rgba(78,163,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_25px_60px_rgba(78,163,255,0.4)] active:scale-95"
              >
                <span>ابدأ الآن — OS</span>
                <ArrowLeft size={20} />
              </button>
              <button className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-[18px] font-black text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95">
                <span>استكشف الحلول</span>
                <Layers size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
          >
            <span className="font-en text-[10px] font-bold uppercase tracking-[0.4em] text-[--color-faint]">Scroll to Explore</span>
            <ChevronDown size={20} className="text-[--color-faint] animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="relative px-6 py-32 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <BentoCard 
            ar="التحكم في الأسطول" 
            en="Fleet Orchestration" 
            icon={Bot} 
            className="col-span-12 md:col-span-8 min-h-[400px]" 
            delay={0.1}
          />
          <BentoCard 
            ar="الذكاء الحافي" 
            en="Edge Intelligence" 
            icon={Cpu} 
            className="col-span-12 md:col-span-4" 
            delay={0.2}
          />
          <BentoCard 
            ar="الأمن السيبراني" 
            en="Secure Operations" 
            icon={ShieldCheck} 
            className="col-span-12 md:col-span-4" 
            delay={0.3}
          />
          <BentoCard 
            ar="التواجد العالمي" 
            en="Global Presence" 
            icon={Globe} 
            className="col-span-12 md:col-span-8" 
            delay={0.4}
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative px-6 py-40 text-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[--color-admiral-glow]/10 blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="text-[42px] md:text-[64px] font-black text-white leading-tight">
            هل أنت مستعد <span className="text-[--color-admiral-glow]">للتحول؟</span>
          </h2>
          <p className="mt-6 mx-auto max-w-[600px] text-[18px] text-[--color-ink-2]">
            انضم إلى قادة الصناعة الذين يستخدمون Savvy World لتشغيل عملياتهم بذكاء لا مثيل له.
          </p>
          <div className="mt-12">
            <button 
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-12 py-5 text-[20px] font-black text-black transition-all hover:scale-105 hover:bg-white active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.15)]"
            >
              <span>دخول النظام الصناعي</span>
              <Zap size={24} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/[0.03] text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded bg-white text-black font-en font-black text-[10px]">S</div>
            <span className="font-en text-[14px] font-black tracking-widest text-white">SAVVY WORLD</span>
          </div>
          <div className="text-[--color-faint] text-[13px] font-medium">
            © 2026 Savvy World · Built for the Saudi Industrial Future · Powered by Gemini
          </div>
        </div>
      </footer>
    </div>
  )
}
