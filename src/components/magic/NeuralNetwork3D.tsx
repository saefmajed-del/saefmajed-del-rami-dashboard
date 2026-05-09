import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function NetworkNodes() {
  const count = 20
  const points = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10
      p[i * 3 + 1] = (Math.random() - 0.5) * 5
      p[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return p
  }, [])

  const ref = useRef<THREE.Points>(null!)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.1
    ref.current.rotation.y = t
  })

  return (
    <group>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4ea3ff"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      {/* Dynamic connections would go here, but for now a wireframe cloud */}
      <mesh rotation={[0, 0, 0]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshStandardMaterial color="#4ea3ff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  )
}

export function NeuralNetwork3D() {
  return (
    <div className="h-full w-full">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 12] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <NetworkNodes />
      </Canvas>
    </div>
  )
}
