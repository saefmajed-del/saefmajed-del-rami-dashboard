import { Suspense, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import {
  Boxes,
  Box,
  Layers,
  Eye,
  Camera,
  Route,
  Map,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Building2,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Locate,
  Activity,
  Battery,
  Compass,
  Gauge,
  Cpu,
  Hexagon,
  Radar,
  ShieldAlert,
  Bell,
  CircleDot,
} from 'lucide-react'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import { PageShell } from '@/pages-detail/_PageShell'
import { KpiCard } from '@/components/KpiCard'
import { Sparkline } from '@/home/parts/Sparkline'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type RobotKind = 'G1' | 'Go2'

interface TwinRobot {
  id: string
  kind: RobotKind
  position: [number, number, number]
  heading: number // degrees
  velocity: number // m/s
  battery: number // %
  status: 'active' | 'idle' | 'charging'
  facility: string
  zone: string
  ar: string
}

const ROBOTS: TwinRobot[] = [
  { id: 'G1-TWIN-01', kind: 'G1', position: [-3.2, 0, -2.0], heading: 42, velocity: 0.8, battery: 84, status: 'active', facility: 'KACST Demo Floor', zone: 'Zone A · مهمة الضيافة', ar: 'الضيافة الذكيّة' },
  { id: 'G1-TWIN-02', kind: 'G1', position: [1.5, 0, -3.4], heading: 318, velocity: 0.3, battery: 67, status: 'active', facility: 'KACST Demo Floor', zone: 'Zone B · ممرّ الزوّار', ar: 'إرشاد الزوار' },
  { id: 'G1-TWIN-03', kind: 'G1', position: [4.8, 0, 1.6], heading: 90, velocity: 0.0, battery: 38, status: 'charging', facility: 'NEOM Hangar A', zone: 'Charging Bay', ar: 'محطة الشحن' },
  { id: 'GO2-TWIN-01', kind: 'Go2', position: [-1.4, 0, 2.8], heading: 215, velocity: 1.6, battery: 71, status: 'active', facility: 'KSU Lab Floor 3', zone: 'Patrol Loop · حلقة الدورية', ar: 'دورية أمنيّة' },
]

const FACILITIES = [
  {
    name: 'KACST Demo Floor',
    ar: 'مدينة الملك عبدالعزيز للعلوم والتقنية',
    zones: [
      { name: 'Zone A · الاستقبال', robots: ['G1-TWIN-01'] },
      { name: 'Zone B · ممرّ الزوّار', robots: ['G1-TWIN-02'] },
      { name: 'Zone C · المختبر', robots: [] },
    ],
  },
  {
    name: 'NEOM Hangar A',
    ar: 'حظيرة نيوم أ',
    zones: [
      { name: 'Charging Bay · محطة الشحن', robots: ['G1-TWIN-03'] },
      { name: 'Loading Dock · رصيف التحميل', robots: [] },
    ],
  },
  {
    name: 'KSU Lab Floor 3',
    ar: 'جامعة الملك سعود — الطابق الثالث',
    zones: [
      { name: 'Patrol Loop · حلقة الدورية', robots: ['GO2-TWIN-01'] },
      { name: 'Server Room · غرفة الخوادم', robots: [] },
    ],
  },
]

interface TwinEvent {
  id: string
  ar: string
  en: string
  ts: string
  level: 'info' | 'good' | 'warn' | 'urgent'
  icon: ComponentType<{ size?: number; className?: string }>
}

const EVENTS: TwinEvent[] = [
  { id: 'e1', ar: 'دخل G1-TWIN-01 منطقة الاستقبال', en: 'G1-TWIN-01 entered Zone A', ts: '14:32', level: 'info', icon: Locate },
  { id: 'e2', ar: 'اكتمل المسار 4 لـ Go2-TWIN-01', en: 'Route 4 completed', ts: '14:28', level: 'good', icon: Route },
  { id: 'e3', ar: 'تجاوز الحدود الجغرافيّة في المختبر', en: 'Geofence breach · Lab', ts: '14:21', level: 'warn', icon: ShieldAlert },
  { id: 'e4', ar: 'تنبيه كاميرا — حركة ليليّة', en: 'Camera trigger · night motion', ts: '14:09', level: 'warn', icon: Camera },
  { id: 'e5', ar: 'تم تحميل إعادة المشهد 12.04', en: 'Replay 12.04 loaded', ts: '13:58', level: 'info', icon: Eye },
  { id: 'e6', ar: 'بدأ G1-TWIN-03 الشحن', en: 'G1-TWIN-03 charging', ts: '13:42', level: 'info', icon: Battery },
  { id: 'e7', ar: 'كشف ليدار حدث جديد', en: 'New LiDAR contact', ts: '13:30', level: 'info', icon: Radar },
  { id: 'e8', ar: 'إعادة معايرة الخريطة', en: 'Map recalibration', ts: '13:12', level: 'good', icon: Map },
]

const KPI_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  entities: Hexagon,
  fps: Gauge,
  render: Cpu,
  routes: Route,
  geofences: Map,
}

/* ------------------------------------------------------------------ */
/* 3D Scene                                                            */
/* ------------------------------------------------------------------ */

interface SceneProps {
  robots: TwinRobot[]
  selectedId: string
  onSelect: (id: string) => void
  layers: LayerState
  autoRotate: boolean
  onFrame: (ms: number) => void
  hoveredId: string | null
  onHover: (id: string | null) => void
  followSelected: boolean
}

interface LayerState {
  grid: boolean
  buildings: boolean
  robots: boolean
  routes: boolean
  geofences: boolean
  cameras: boolean
  heatmap: boolean
}

const ROBOT_TINT = '#c8d0db'
const FACE_DARK = '#0a0e1a'
const ADMIRAL = '#4ea3ff'

function HumanoidRobot({
  robot,
  selected,
  onSelect,
  onHover,
  hovered,
}: {
  robot: TwinRobot
  selected: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  hovered: boolean
}) {
  const groupRef = useRef<Group>(null!)
  const rad = (robot.heading * Math.PI) / 180

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(robot.id)
  }
  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    onHover(robot.id)
  }
  const handleOut = () => onHover(null)

  return (
    <group
      ref={groupRef}
      position={robot.position}
      rotation={[0, rad, 0]}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      {/* selection ring */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.55, 0.7, 48]} />
          <meshBasicMaterial color={ADMIRAL} transparent opacity={0.85} />
        </mesh>
      )}
      {/* shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.32} />
      </mesh>
      {/* legs */}
      <mesh position={[-0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.16]} />
        <meshStandardMaterial color="#515967" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.35, 0]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.16]} />
        <meshStandardMaterial color="#515967" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.5, 24]} />
        <meshStandardMaterial color={ROBOT_TINT} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* arms */}
      <mesh position={[-0.32, 0.95, 0]} castShadow>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color={ROBOT_TINT} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.32, 0.95, 0]} castShadow>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color={ROBOT_TINT} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.36, 0]} castShadow>
        <sphereGeometry args={[0.18, 24, 16]} />
        <meshStandardMaterial color={ROBOT_TINT} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* face plate */}
      <mesh position={[0, 1.36, 0.16]}>
        <boxGeometry args={[0.22, 0.1, 0.02]} />
        <meshStandardMaterial color={FACE_DARK} metalness={0.2} roughness={0.6} />
      </mesh>
      {/* admiral eye */}
      <mesh position={[0, 1.36, 0.175]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial color={ADMIRAL} emissive={ADMIRAL} emissiveIntensity={1.6} />
      </mesh>
      {/* heading marker (front) */}
      <mesh position={[0, 0.05, 0.5]}>
        <coneGeometry args={[0.07, 0.16, 16]} />
        <meshStandardMaterial color={ADMIRAL} emissive={ADMIRAL} emissiveIntensity={0.6} />
      </mesh>

      {hovered && (
        <Html distanceFactor={8} position={[0, 1.85, 0]} center>
          <div className="pointer-events-none rounded-lg border border-[rgba(78,163,255,0.35)] bg-black/80 px-2 py-1 font-en text-[10px] font-bold text-white backdrop-blur-md">
            <div className="font-en tabular-nums">{robot.id}</div>
            <div className="mt-0.5 text-[9px] text-[rgba(78,163,255,0.9)]">{robot.zone}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function QuadrupedRobot({
  robot,
  selected,
  onSelect,
  onHover,
  hovered,
}: {
  robot: TwinRobot
  selected: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  hovered: boolean
}) {
  const rad = (robot.heading * Math.PI) / 180
  return (
    <group
      position={robot.position}
      rotation={[0, rad, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(robot.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(robot.id)
      }}
      onPointerOut={() => onHover(null)}
    >
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.55, 0.72, 48]} />
          <meshBasicMaterial color={ADMIRAL} transparent opacity={0.85} />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.32} />
      </mesh>
      {/* body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.85]} />
        <meshStandardMaterial color={ROBOT_TINT} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* head bump */}
      <mesh position={[0, 0.55, 0.5]} castShadow>
        <boxGeometry args={[0.28, 0.18, 0.18]} />
        <meshStandardMaterial color={FACE_DARK} metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.56, 0.6]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color={ADMIRAL} emissive={ADMIRAL} emissiveIntensity={1.6} />
      </mesh>
      {/* legs */}
      {[
        [-0.18, -0.35],
        [0.18, -0.35],
        [-0.18, 0.35],
        [0.18, 0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.45, 12]} />
          <meshStandardMaterial color="#515967" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {hovered && (
        <Html distanceFactor={8} position={[0, 1.05, 0]} center>
          <div className="pointer-events-none rounded-lg border border-[rgba(78,163,255,0.35)] bg-black/80 px-2 py-1 font-en text-[10px] font-bold text-white backdrop-blur-md">
            <div className="font-en tabular-nums">{robot.id}</div>
            <div className="mt-0.5 text-[9px] text-[rgba(78,163,255,0.9)]">{robot.zone}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function FacilityBuilding({ position, size, label }: { position: [number, number, number]; size: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#1c2533" metalness={0.55} roughness={0.45} />
      </mesh>
      {/* admiral edge band */}
      <mesh position={[0, size[1] - 0.05, 0]}>
        <boxGeometry args={[size[0] + 0.02, 0.06, size[2] + 0.02]} />
        <meshStandardMaterial color={ADMIRAL} emissive={ADMIRAL} emissiveIntensity={0.45} transparent opacity={0.85} />
      </mesh>
      <Html position={[0, size[1] + 0.35, 0]} center distanceFactor={12}>
        <div className="pointer-events-none whitespace-nowrap rounded-md border border-[rgba(78,163,255,0.3)] bg-black/65 px-1.5 py-0.5 font-en text-[8.5px] font-bold uppercase tracking-[0.18em] text-[rgba(200,220,255,0.95)] backdrop-blur-md">
          {label}
        </div>
      </Html>
    </group>
  )
}

function RouteLine({ points }: { points: [number, number, number][] }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const arr = new Float32Array(points.flat())
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [points])
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color={ADMIRAL} transparent opacity={0.65} />
    </line>
  )
}

function GeofenceRing({ radius, position, color = '#f5a524' }: { radius: number; position: [number, number, number]; color?: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <ringGeometry args={[radius - 0.04, radius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
    </mesh>
  )
}

function CameraIcon({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null!)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6
  })
  return (
    <group position={position}>
      <mesh ref={ref}>
        <coneGeometry args={[0.18, 0.32, 16]} />
        <meshStandardMaterial color="#7a86a8" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Heatmap() {
  const points = useMemo(() => {
    const arr: { p: [number, number, number]; c: string; s: number }[] = []
    for (let i = 0; i < 28; i++) {
      const x = (Math.random() - 0.5) * 11
      const z = (Math.random() - 0.5) * 11
      const intensity = Math.random()
      const color = intensity > 0.66 ? '#ef4444' : intensity > 0.33 ? '#f5a524' : '#4ea3ff'
      arr.push({ p: [x, 0.02, z], c: color, s: 0.3 + intensity * 0.6 })
    }
    return arr
  }, [])
  return (
    <group>
      {points.map((pt, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={pt.p}>
          <circleGeometry args={[pt.s, 24]} />
          <meshBasicMaterial color={pt.c} transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  )
}

function FrameMonitor({ onFrame }: { onFrame: (ms: number) => void }) {
  const last = useRef(performance.now())
  useFrame(() => {
    const now = performance.now()
    onFrame(now - last.current)
    last.current = now
  })
  return null
}

function CameraFollower({
  target,
  enabled,
}: {
  target: [number, number, number] | null
  enabled: boolean
}) {
  useFrame((state) => {
    if (!enabled || !target) return
    const desired = new THREE.Vector3(target[0] + 4, 4, target[2] + 4)
    state.camera.position.lerp(desired, 0.06)
    state.camera.lookAt(target[0], 0.6, target[2])
  })
  return null
}

function Scene({
  robots,
  selectedId,
  onSelect,
  layers,
  autoRotate,
  onFrame,
  hoveredId,
  onHover,
  followSelected,
}: SceneProps) {
  const selected = robots.find((r) => r.id === selectedId) ?? null

  const routes: [number, number, number][][] = [
    [
      [-3.2, 0.05, -2.0],
      [-2.0, 0.05, -1.0],
      [-1.0, 0.05, 0.4],
      [0.5, 0.05, 1.4],
      [1.5, 0.05, -3.4],
    ],
    [
      [-1.4, 0.05, 2.8],
      [0.6, 0.05, 3.0],
      [2.6, 0.05, 2.6],
      [3.4, 0.05, 0.8],
      [3.0, 0.05, -1.4],
      [-1.4, 0.05, 2.8],
    ],
  ]

  return (
    <>
      <color attach="background" args={['#050813']} />
      <fog attach="fog" args={['#050813', 14, 30]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} castShadow />
      <directionalLight position={[-6, 8, -8]} intensity={0.55} color="#4ea3ff" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#0b1220" metalness={0.2} roughness={0.85} />
      </mesh>
      {layers.grid && (
        <gridHelper
          args={[24, 24, '#1d3a73', '#13243f']}
          position={[0, 0.01, 0]}
        />
      )}

      {/* Buildings */}
      {layers.buildings && (
        <>
          <FacilityBuilding position={[-5, 0, -4.5]} size={[3.2, 1.6, 2.4]} label="KACST" />
          <FacilityBuilding position={[5.5, 0, -3]} size={[2.6, 2.2, 2.0]} label="NEOM A" />
          <FacilityBuilding position={[4.5, 0, 4]} size={[2.4, 1.4, 2.6]} label="KSU L3" />
        </>
      )}

      {/* Heatmap */}
      {layers.heatmap && <Heatmap />}

      {/* Routes */}
      {layers.routes && routes.map((p, i) => <RouteLine key={i} points={p} />)}

      {/* Geofences */}
      {layers.geofences && (
        <>
          <GeofenceRing radius={2.2} position={[-3.2, 0.02, -2.0]} />
          <GeofenceRing radius={2.6} position={[1.5, 0.02, -3.4]} color="#22c55e" />
          <GeofenceRing radius={2.4} position={[-1.4, 0.02, 2.8]} color="#4ea3ff" />
        </>
      )}

      {/* Cameras */}
      {layers.cameras && (
        <>
          <CameraIcon position={[-5.0, 1.9, -4.5]} />
          <CameraIcon position={[5.5, 2.5, -3.0]} />
          <CameraIcon position={[4.5, 1.7, 4.0]} />
        </>
      )}

      {/* Robots */}
      {layers.robots &&
        robots.map((r) =>
          r.kind === 'G1' ? (
            <HumanoidRobot
              key={r.id}
              robot={r}
              selected={r.id === selectedId}
              onSelect={onSelect}
              onHover={onHover}
              hovered={hoveredId === r.id}
            />
          ) : (
            <QuadrupedRobot
              key={r.id}
              robot={r}
              selected={r.id === selectedId}
              onSelect={onSelect}
              onHover={onHover}
              hovered={hoveredId === r.id}
            />
          ),
        )}

      <CameraFollower target={selected ? selected.position : null} enabled={followSelected} />
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4}
        maxDistance={22}
      />
      <FrameMonitor onFrame={onFrame} />
    </>
  )
}

function LoadingTwin() {
  return (
    <div className="grid h-full w-full place-items-center bg-black/40">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[rgba(78,163,255,0.2)] border-t-[#4ea3ff]" />
        <div className="mt-2 font-en text-[10px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
          تحميل المشهد · Loading scene…
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function DigitalTwinPage() {
  const [selectedId, setSelectedId] = useState<string>(ROBOTS[0].id)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [follow, setFollow] = useState<boolean>(false)
  const [resetKey, setResetKey] = useState<number>(0)
  const [frameMs, setFrameMs] = useState<number>(8.4)
  const [fps, setFps] = useState<number>(60)

  const [layers, setLayers] = useState<LayerState>({
    grid: true,
    buildings: true,
    robots: true,
    routes: true,
    geofences: true,
    cameras: true,
    heatmap: false,
  })

  const [playing, setPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<1 | 2 | 4 | 8>(1)
  const [tMin, setTMin] = useState<number>(14 * 60 + 32) // 14:32

  const [openFacility, setOpenFacility] = useState<Record<string, boolean>>({
    'KACST Demo Floor': true,
    'NEOM Hangar A': false,
    'KSU Lab Floor 3': true,
  })

  // simple play loop via requestAnimationFrame
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      setTMin((m) => (m + dt * speed * 0.5) % (24 * 60))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed])

  const selected = ROBOTS.find((r) => r.id === selectedId) ?? ROBOTS[0]

  const onFrame = (ms: number) => {
    // EWMA smooth
    setFrameMs((prev) => prev * 0.92 + ms * 0.08)
    setFps((prev) => prev * 0.92 + (1000 / Math.max(ms, 1)) * 0.08)
  }

  const sparkX = useMemo(
    () => Array.from({ length: 24 }, (_, i) => selected.position[0] + Math.sin(i / 3) * 0.8),
    [selected],
  )
  const sparkV = useMemo(
    () => Array.from({ length: 24 }, (_, i) => Math.max(0, selected.velocity + Math.sin(i / 2) * 0.3)),
    [selected],
  )
  const sparkH = useMemo(
    () => Array.from({ length: 24 }, (_, i) => (selected.heading + i * 4) % 360),
    [selected],
  )

  const tHour = Math.floor(tMin / 60)
  const tMinute = Math.floor(tMin % 60)
  const tStr = `${String(tHour).padStart(2, '0')}:${String(tMinute).padStart(2, '0')}`

  const kpis = [
    { key: 'entities', ar: 'الكيانات المتتبعة', en: 'Tracked entities', value: '16', spark: [12, 13, 14, 14, 15, 16, 15, 16, 16, 16, 16, 16], trend: 'up' as const },
    { key: 'fps', ar: 'الإطارات/ث', en: 'FPS', value: fps.toFixed(0), spark: [58, 59, 60, 60, 60, 59, 60, 61, 60, 60, 60, Math.round(fps)], trend: 'flat' as const },
    { key: 'render', ar: 'زمن العرض', en: 'Render', value: `${frameMs.toFixed(1)}ms`, spark: [8, 9, 8, 8, 9, 8, 8, 9, 8, 8, 8, Math.round(frameMs)], trend: 'flat' as const },
    { key: 'routes', ar: 'المسارات النشطة', en: 'Active routes', value: '4', spark: [2, 2, 3, 3, 4, 4, 3, 4, 4, 4, 4, 4], trend: 'up' as const },
    { key: 'geofences', ar: 'الحدود الجغرافيّة', en: 'Geofences', value: '5', spark: [3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5], trend: 'up' as const },
  ]

  const layerToggles: Array<{ key: keyof LayerState; ar: string; en: string; icon: ComponentType<{ size?: number; className?: string }> }> = [
    { key: 'grid', ar: 'الشبكة', en: 'Grid', icon: Layers },
    { key: 'buildings', ar: 'المباني', en: 'Buildings', icon: Building2 },
    { key: 'robots', ar: 'الروبوتات', en: 'Robots', icon: Box },
    { key: 'routes', ar: 'المسارات', en: 'Routes', icon: Route },
    { key: 'geofences', ar: 'الحدود', en: 'Geofences', icon: Map },
    { key: 'cameras', ar: 'الكاميرات', en: 'Cameras', icon: Camera },
    { key: 'heatmap', ar: 'خريطة حرارية', en: 'Heatmap', icon: Radar },
  ]

  return (
    <PageShell
      active="twin"
      ar="التوأم الرقمي"
      en="Digital Twin & Facility Visualization"
      icon={Boxes}
      description="رؤية مكانية ثلاثيّة الأبعاد لجميع المرافق والروبوتات والمسارات — تحكّم زمني، طبقات قابلة للتبديل، وإعادة تشغيل المشاهد."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFollow((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[12px] font-bold transition-all",
              follow
                ? "border-[--color-admiral-glow] bg-[--color-admiral]/20 text-[--color-admiral-glow] shadow-[0_0_18px_rgba(78,163,255,0.25)]"
                : "border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 text-[--color-ink] hover:shadow-[0_0_18px_rgba(78,163,255,0.22)]"
            )}
            aria-label="تتبع المختار / Follow Selected"
          >
            <Locate size={12} />
            <div className="flex flex-col items-start leading-tight">
              <span>تتبع المختار</span>
              <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-70">Follow Selected</span>
            </div>
          </button>
          <button
            onClick={() => {
              setFollow(false)
              setResetKey((k) => k + 1)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(78,163,255,0.28)] bg-[--color-admiral]/10 px-3 py-2 text-[12px] font-bold text-[--color-ink] transition-shadow hover:shadow-[0_0_18px_rgba(78,163,255,0.22)]"
            aria-label="إعادة الكاميرا / Reset Camera"
          >
            <RotateCcw size={12} />
            <div className="flex flex-col items-start leading-tight">
              <span>إعادة الكاميرا</span>
              <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-70">Reset Camera</span>
            </div>
          </button>
        </div>
      }
    >
      {/* Layer toolbar */}
      <section className="glass-card mb-3 flex flex-wrap items-center justify-between gap-2 p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {layerToggles.map((l) => {
            const Icon = l.icon
            const on = layers[l.key]
            return (
              <button
                key={l.key}
                onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-en text-[10.5px] font-bold uppercase tracking-[0.14em] transition-shadow',
                  on
                    ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/15 text-[--color-ink] shadow-[0_0_18px_rgba(78,163,255,0.18)]'
                    : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.28)] hover:text-[--color-ink]',
                )}
              >
                <Icon size={11} />
                <span className="font-sans text-[10.5px]">{l.ar}</span>
                <span className="opacity-70">{l.en}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[12px] font-bold transition-shadow',
              autoRotate
                ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/15 text-[--color-ink]'
                : 'border-[--color-line] bg-black/30 text-[--color-ink-2]',
            )}
            aria-label="دوران تلقائي / Auto Rotate"
          >
            <RotateCcw size={11} />
            <div className="flex flex-col items-start leading-tight">
              <span>دوران تلقائي</span>
              <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-70">Auto Rotate</span>
            </div>
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-xl border border-[--color-line] bg-black/30 px-2.5 py-1.5 text-[12px] font-bold text-[--color-ink-2] hover:text-[--color-ink]"
            aria-label="تكبير / Maximize"
          >
            <Maximize2 size={11} />
            <div className="flex flex-col items-start leading-tight">
              <span>تكبير</span>
              <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-70">Maximize</span>
            </div>
          </button>
        </div>
      </section>

      {/* === Viewport + side panel === */}
      <section className="grid grid-cols-12 gap-3">
        {/* 3D Viewport */}
        <div className="glass-card relative col-span-12 overflow-hidden lg:col-span-8">
          <div className="flex items-start justify-between gap-2 p-3 pb-2">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Omniverse Twin · Live 3D
              </div>
              <h2 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                المشهد ثلاثي الأبعاد — مباشر
              </h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-[rgba(78,163,255,0.3)] bg-black/50 px-2 py-1 font-en text-[10px] font-bold text-[--color-ink] backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[--color-admiral-glow] opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[--color-admiral-glow]" />
              </span>
              LIVE · TWIN
            </div>
          </div>

          <div className="relative h-[600px] w-full overflow-hidden border-y border-[--color-line] bg-[#050813]">
            <Suspense fallback={<LoadingTwin />}>
              <Canvas
                key={resetKey}
                shadows
                dpr={[1, 2]}
                camera={{ position: [9, 7, 9], fov: 50 }}
                gl={{ antialias: true }}
              >
                <Scene
                  robots={ROBOTS}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  layers={layers}
                  autoRotate={autoRotate}
                  onFrame={onFrame}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  followSelected={follow}
                />
              </Canvas>
            </Suspense>

            {/* HUD overlay */}
            <div className="pointer-events-none absolute inset-x-0 top-3 flex items-start justify-between px-3">
              <div className="rounded-lg border border-[--color-line] bg-black/55 px-2 py-1 font-en text-[10px] font-bold tabular-nums text-[--color-ink-2] backdrop-blur-md">
                {fps.toFixed(0)} FPS · {frameMs.toFixed(1)}ms
              </div>
              <div className="rounded-lg border border-[--color-line] bg-black/55 px-2 py-1 font-en text-[10px] font-bold tabular-nums text-[--color-ink-2] backdrop-blur-md">
                {ROBOTS.length} entities · 3 facilities
              </div>
            </div>

            {/* Time scrubber */}
            <div className="pointer-events-auto absolute inset-x-3 bottom-3 rounded-2xl border border-[--color-line] bg-black/65 p-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(78,163,255,0.32)] bg-[--color-admiral]/15 text-[--color-ink] transition-shadow hover:shadow-[0_0_18px_rgba(78,163,255,0.22)]"
                  title={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <div className="font-en text-[12px] font-extrabold tabular-nums text-[--color-ink]">
                  {tStr}
                </div>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="absolute inset-y-0 start-0 rounded-full"
                    style={{
                      width: `${(tMin / (24 * 60)) * 100}%`,
                      background: 'linear-gradient(90deg, #4ea3ff, rgba(78,163,255,0.4))',
                      boxShadow: '0 0 12px rgba(78,163,255,0.5)',
                    }}
                  />
                  {/* hour ticks */}
                  <div className="pointer-events-none absolute inset-0 flex justify-between">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-full w-px',
                          i % 6 === 0 ? 'bg-[rgba(200,220,255,0.35)]' : 'bg-[rgba(200,220,255,0.12)]',
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {([1, 2, 4, 8] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={cn(
                        'rounded-md border px-2 py-0.5 font-en text-[10px] font-bold tabular-nums transition-colors',
                        speed === s
                          ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/15 text-[--color-ink]'
                          : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:text-[--color-ink]',
                      )}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <aside className="glass-card col-span-12 flex flex-col overflow-hidden lg:col-span-4">
          <div className="flex items-start justify-between gap-2 p-4">
            <div>
              <div className="font-en text-[10px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Selected Entity
              </div>
              <div className="mt-1 font-en text-[18px] font-black tabular-nums text-[--color-ink]">
                {selected.id}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold text-[--color-ink-2]">
                <Crosshair size={11} className="text-[--color-faint]" />
                {selected.zone}
              </div>
              <div className="mt-0.5 text-[11px] font-semibold text-[--color-muted]">
                {selected.ar} · {selected.kind}
              </div>
            </div>
            <StatusPill status={selected.status} />
          </div>

          <div className="hairline mx-4" />

          {/* Position grid */}
          <div className="grid grid-cols-3 gap-2 p-4 pb-2">
            <PosCell label="X" value={selected.position[0].toFixed(2)} />
            <PosCell label="Y" value={selected.position[1].toFixed(2)} />
            <PosCell label="Z" value={selected.position[2].toFixed(2)} />
          </div>

          <div className="grid grid-cols-3 gap-2 px-4 pb-3">
            <MiniMetric icon={Compass} ar="الاتجاه" en="Heading" v={`${selected.heading}°`} />
            <MiniMetric icon={Activity} ar="السرعة" en="Velocity" v={`${selected.velocity.toFixed(1)} m/s`} />
            <MiniMetric icon={Battery} ar="البطارية" en="Battery" v={`${selected.battery}%`} />
          </div>

          <div className="hairline mx-4" />

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2 p-4">
            <SideAction
              icon={Locate}
              label="تحديد"
              en="Locate"
              active={false}
              onClick={() => {
                setFollow(false)
                setResetKey((k) => k + 1)
              }}
            />
            <SideAction
              icon={Eye}
              label="تتبّع"
              en="Follow"
              active={follow}
              onClick={() => setFollow((v) => !v)}
            />
            <SideAction
              icon={RotateCcw}
              label="إعادة"
              en="Reset"
              active={false}
              onClick={() => setResetKey((k) => k + 1)}
            />
          </div>

          <div className="hairline mx-4" />

          {/* Telemetry sparklines */}
          <div className="flex flex-col gap-3 p-4">
            <div className="font-en text-[10px] font-bold uppercase tracking-[0.22em] text-[--color-faint]">
              Telemetry · القياسات الحيّة
            </div>
            <TelemetryRow ar="الإحداثي X" en="X position" data={sparkX} trend="flat" value={selected.position[0].toFixed(2)} />
            <TelemetryRow ar="السرعة" en="Velocity" data={sparkV} trend="up" value={`${selected.velocity.toFixed(1)} m/s`} />
            <TelemetryRow ar="الاتجاه" en="Heading" data={sparkH} trend="up" value={`${selected.heading}°`} />
          </div>
        </aside>
      </section>

      {/* === KPI strip === */}
      <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => {
          const Icon = KPI_ICONS[k.key] ?? Hexagon
          return (
            <KpiCard
              key={k.key}
              ar={k.ar}
              en={k.en}
              value={k.value}
              spark={k.spark}
              trend={k.trend}
              icon={Icon}
            />
          )
        })}
      </section>

      {/* === Facility browser + Events === */}
      <section className="mt-4 grid grid-cols-12 gap-3">
        {/* Facility tree */}
        <div className="glass-card col-span-12 p-4 lg:col-span-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Facility Browser
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                المرافق والمناطق
              </h3>
            </div>
            <div className="font-en text-[10.5px] font-bold tabular-nums text-[--color-faint]">
              {FACILITIES.length} facilities
            </div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {FACILITIES.map((f) => {
              const open = openFacility[f.name]
              const total = f.zones.reduce((acc, z) => acc + z.robots.length, 0)
              return (
                <li key={f.name} className="rounded-xl border border-[--color-line] bg-black/25">
                  <button
                    onClick={() => setOpenFacility((s) => ({ ...s, [f.name]: !s[f.name] }))}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-start"
                  >
                    {open ? (
                      <ChevronDown size={13} className="text-[--color-admiral-glow]" />
                    ) : (
                      <ChevronRight size={13} className="text-[--color-faint]" />
                    )}
                    <Building2 size={13} className="text-[--color-faint]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-bold text-[--color-ink]">{f.name}</div>
                      <div className="truncate font-en text-[10px] font-semibold text-[--color-faint]">
                        {f.ar}
                      </div>
                    </div>
                    <span className="font-en text-[10.5px] font-extrabold tabular-nums text-[--color-admiral-glow]">
                      {total}
                    </span>
                  </button>
                  {open && (
                    <ul className="border-t border-[--color-line] bg-black/30 px-3 py-2">
                      {f.zones.map((z) => (
                        <li key={z.name} className="flex items-start gap-2 py-1.5">
                          <CircleDot size={10} className="mt-1 text-[--color-admiral-glow]" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12px] font-bold text-[--color-ink-2]">{z.name}</div>
                            {z.robots.length > 0 ? (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {z.robots.map((rid) => (
                                  <button
                                    key={rid}
                                    onClick={() => setSelectedId(rid)}
                                    className={cn(
                                      'rounded-md border px-1.5 py-0.5 font-en text-[9.5px] font-bold tabular-nums transition-colors',
                                      rid === selectedId
                                        ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/15 text-[--color-ink]'
                                        : 'border-[--color-line] bg-black/40 text-[--color-ink-2] hover:text-[--color-ink]',
                                    )}
                                  >
                                    {rid}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-0.5 font-en text-[9.5px] font-semibold text-[--color-muted]">
                                no units · فارغة
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Events feed */}
        <div className="glass-card col-span-12 p-4 lg:col-span-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-en text-[10.5px] font-bold uppercase tracking-[0.22em] text-[--color-admiral-glow]">
                Live Events Feed
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold text-[--color-ink]">
                الأحداث الأخيرة
              </h3>
            </div>
            <div className="flex items-center gap-1.5 font-en text-[10.5px] font-bold tabular-nums text-[--color-faint]">
              <Bell size={11} />
              {EVENTS.length}
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {EVENTS.map((e) => (
              <EventRow key={e.id} ev={e} />
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  )
}

/* ------------------------------------------------------------------ */
/* sub-components                                                      */
/* ------------------------------------------------------------------ */

function StatusPill({ status }: { status: TwinRobot['status'] }) {
  const map = {
    active: { color: 'var(--color-good)', ar: 'نشط', en: 'Active' },
    idle: { color: 'var(--color-muted)', ar: 'خامل', en: 'Idle' },
    charging: { color: 'var(--color-warn)', ar: 'يشحن', en: 'Charging' },
  } as const
  const { color, ar, en } = map[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold"
      style={{
        borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span>{ar}</span>
      <span className="font-en text-[9.5px] font-semibold uppercase tracking-[0.14em] opacity-80">
        {en}
      </span>
    </span>
  )
}

function PosCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/30 px-2.5 py-2 text-center">
      <div className="font-en text-[9px] font-bold uppercase tracking-[0.18em] text-[--color-faint]">
        {label}
      </div>
      <div className="mt-1 font-en text-[14px] font-extrabold tabular-nums text-[--color-ink]">
        {value}
      </div>
    </div>
  )
}

function MiniMetric({
  icon: Icon,
  ar,
  en,
  v,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  ar: string
  en: string
  v: string
}) {
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/30 px-2 py-2">
      <div className="flex items-center gap-1.5">
        <Icon size={11} className="text-[--color-admiral-glow]" />
        <div className="font-en text-[8.5px] font-bold uppercase tracking-[0.16em] text-[--color-faint]">
          {en}
        </div>
      </div>
      <div className="mt-1 text-[10.5px] font-bold text-[--color-ink-2]">{ar}</div>
      <div className="font-en text-[12px] font-extrabold tabular-nums text-[--color-ink]">{v}</div>
    </div>
  )
}

function SideAction({
  icon: Icon,
  label,
  en,
  active,
  onClick,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  en: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 transition-shadow',
        active
          ? 'border-[rgba(78,163,255,0.45)] bg-[--color-admiral]/15 text-[--color-ink] shadow-[0_0_18px_rgba(78,163,255,0.22)]'
          : 'border-[--color-line] bg-black/30 text-[--color-ink-2] hover:border-[rgba(78,163,255,0.32)] hover:text-[--color-ink]',
      )}
    >
      <Icon size={13} />
      <span className="text-[11px] font-bold">{label}</span>
      <span className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] opacity-70">
        {en}
      </span>
    </button>
  )
}

function TelemetryRow({
  ar,
  en,
  data,
  trend,
  value,
}: {
  ar: string
  en: string
  data: number[]
  trend: 'up' | 'down' | 'flat'
  value: string
}) {
  return (
    <div className="rounded-xl border border-[--color-line] bg-black/25 p-2.5">
      <div className="mb-1 flex items-center justify-between">
        <div>
          <div className="text-[11.5px] font-bold text-[--color-ink-2]">{ar}</div>
          <div className="font-en text-[9px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
            {en}
          </div>
        </div>
        <div className="font-en text-[12px] font-extrabold tabular-nums text-[--color-ink]">
          {value}
        </div>
      </div>
      <Sparkline data={data} trend={trend} height={28} />
    </div>
  )
}

function EventRow({ ev }: { ev: TwinEvent }) {
  const map = {
    info: { color: 'var(--color-info)' },
    good: { color: 'var(--color-good)' },
    warn: { color: 'var(--color-warn)' },
    urgent: { color: 'var(--color-bad)' },
  } as const
  const color = map[ev.level].color
  const Icon = ev.icon
  return (
    <li
      className="flex items-start gap-2.5 rounded-xl border bg-black/25 p-2.5"
      style={{ borderColor: `color-mix(in srgb, ${color} 22%, var(--color-line))` }}
    >
      <div
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border"
        style={{
          borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          color,
        }}
      >
        <Icon size={12} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-bold text-[--color-ink]">{ev.ar}</div>
        <div className="truncate font-en text-[10px] font-semibold uppercase tracking-[0.14em] text-[--color-faint]">
          {ev.en}
        </div>
      </div>
      <span className="shrink-0 font-en text-[10.5px] font-extrabold tabular-nums text-[--color-ink-2]">
        {ev.ts}
      </span>
    </li>
  )
}
