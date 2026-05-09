import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function HologramCore() {
  const ref = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.5
  })

  return (
    <group ref={ref}>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        <meshStandardMaterial color="#4ea3ff" wireframe emissive="#4ea3ff" emissiveIntensity={2} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.4]} />
        <meshStandardMaterial color="#0057B7" wireframe emissive="#0057B7" emissiveIntensity={1} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.5, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#4ea3ff" wireframe />
      </mesh>
      <mesh position={[0.5, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color="#4ea3ff" wireframe />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.2, -0.3, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#4ea3ff" wireframe />
      </mesh>
      <mesh position={[0.2, -0.3, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#4ea3ff" wireframe />
      </mesh>

      {/* Glow Rings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.01, 16, 100]} />
        <meshStandardMaterial color="#4ea3ff" emissive="#4ea3ff" emissiveIntensity={5} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export function RobotHologram() {
  return (
    <div className="h-full w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 30 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, -10, -10]} intensity={0.5} />
        <HologramCore />
      </Canvas>
    </div>
  )
}
