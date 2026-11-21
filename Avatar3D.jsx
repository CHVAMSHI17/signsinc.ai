import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { REST_POSE } from '../data/poses.js'

const D2R = THREE.MathUtils.degToRad
const damp = THREE.MathUtils.damp

const SKIN = '#e9b58c'
const SKIN_DARK = '#d9a175'
const SHIRT = '#1d5c8c'
const SHIRT_DARK = '#164a72'
const HAIR = '#2a2320'
const TEAL = '#0fa3a3'

// Finger layout for one hand. `x` and `rot` are multiplied by the arm mirror,
// so both hands are built from the same measurements.
const FINGER_LAYOUT = [
  { f: 0, x: -0.058, y: -0.026, z: 0.012, rot: 1.0, lengths: [0.040, 0.030, 0.024], r: 0.012 },
  { f: 1, x: -0.037, y: -0.086, z: 0, rot: -0.04, lengths: [0.050, 0.034, 0.026], r: 0.0112 },
  { f: 2, x: -0.012, y: -0.092, z: 0, rot: 0, lengths: [0.055, 0.038, 0.028], r: 0.0115 },
  { f: 3, x: 0.014, y: -0.089, z: 0, rot: 0.03, lengths: [0.051, 0.035, 0.026], r: 0.0108 },
  { f: 4, x: 0.039, y: -0.082, z: 0, rot: 0.07, lengths: [0.040, 0.028, 0.022], r: 0.0098 },
]

// ---------------------------------------------------------------------------
// Motion accents layered on top of the static pose of a sign.
// ---------------------------------------------------------------------------
function motionAdd(motion, t, side) {
  const phase = side === 'A' ? 1 : -1
  switch (motion) {
    case 'wave':
      return { s: [0, 0, phase * 5 * Math.sin(t * 7)], w: [0, 0, phase * 24 * Math.sin(t * 7)] }
    case 'nod':
      return { e: [12 * Math.sin(t * 5), 0, 0] }
    case 'shake':
      return { w: [0, phase * 20 * Math.sin(t * 8), 0] }
    case 'circle':
      return { s: [7 * Math.sin(t * 3), 0, 8 * Math.cos(t * 3)], e: [-10 * Math.cos(t * 3), 0, 0] }
    case 'tap':
      return { e: [12 * Math.sin(t * 4), 0, 0] }
    case 'rise':
      return { s: [6 * Math.sin(t * 2.2), 0, 0] }
    case 'push':
      return { s: [10 * Math.sin(t * 3), 0, 0] }
    case 'open':
      return { s: [0, 0, -10 * Math.sin(t * 2.4) * phase] }
    case 'roll':
      return { w: [0, 16 * Math.sin(t * 2.6), 0] }
    case 'slide':
      return { s: [0, 0, 9 * Math.sin(t * 2)], w: [0, 0, 8 * Math.cos(t * 2)] }
    case 'scribble':
      return { w: [14 * Math.sin(t * 9), 0, 10 * Math.cos(t * 7)] }
    case 'small':
      return { s: [2.5 * Math.sin(t * 1.6), 0, 0] }
    case 'slow':
      return { s: [3 * Math.sin(t * 1), 0, 0], e: [6 * Math.sin(t * 1), 0, 0] }
    default:
      return {}
  }
}

// ---------------------------------------------------------------------------
// Hand: palm + five jointed fingers. Curl is driven by the pose `open` array.
// ---------------------------------------------------------------------------
function FingerChain({ spec, register, depth = 0 }) {
  if (depth >= spec.lengths.length) return null
  return (
    <group
      ref={(el) => register(el, depth)}
      position={depth === 0 ? spec.base : [0, -spec.lengths[depth - 1], 0]}
      rotation={depth === 0 ? spec.rot : undefined}
    >
      <mesh position={[0, -spec.lengths[depth] / 2, 0]}>
        <capsuleGeometry args={[spec.r, Math.max(0.002, spec.lengths[depth] - spec.r * 2), 3, 8]} />
        <meshStandardMaterial color={depth === 2 ? SKIN_DARK : SKIN} roughness={0.6} />
      </mesh>
      <FingerChain spec={spec} register={register} depth={depth + 1} />
    </group>
  )
}

function Hand({ side, pose, mirror }) {
  const jointRefs = useRef(FINGER_LAYOUT.map(() => [null, null, null]))
  const smoothed = useRef([...REST_POSE[side].o])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const target = pose[side]?.o || REST_POSE[side].o
    for (let f = 0; f < 5; f += 1) {
      smoothed.current[f] = damp(smoothed.current[f], target[f] ?? 0.5, 14, dt)
      const curl = 1 - smoothed.current[f]
      const angles = f === 0 ? [26, 34, 20] : [58, 74, 42]
      for (let j = 0; j < 3; j += 1) {
        const joint = jointRefs.current[f][j]
        if (joint) joint.rotation.x = -curl * D2R(angles[j])
      }
    }
  })

  return (
    <group>
      {/* palm */}
      <mesh position={[0, -0.045, 0]} castShadow>
        <boxGeometry args={[0.098, 0.098, 0.042]} />
        <meshStandardMaterial color={SKIN} roughness={0.62} />
      </mesh>
      <mesh position={[0, -0.045, -0.0215]}>
        <boxGeometry args={[0.094, 0.094, 0.004]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
      </mesh>

      {FINGER_LAYOUT.map((finger) => (
        <FingerChain
          key={finger.f}
          spec={{
            ...finger,
            base: [mirror * finger.x, finger.y, finger.z],
            rot: [0, 0, mirror * finger.rot],
          }}
          register={(el, depth) => {
            jointRefs.current[finger.f][depth] = el
          }}
        />
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Arm with shoulder / elbow / wrist joints.
// ---------------------------------------------------------------------------
function Arm({ side, pose, mirror }) {
  const shoulder = useRef()
  const elbow = useRef()
  const wrist = useRef()

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const arm = pose[side] || REST_POSE[side]
    const t = state.clock.elapsedTime
    const add = pose.motion && pose.motion !== 'none' && (side === 'A' || pose.motionBoth)
      ? motionAdd(pose.motion, t, side)
      : {}
    const lambda = pose.motion === 'slow' ? 5 : 8

    const apply = (ref, base, extra) => {
      if (!ref.current) return
      ref.current.rotation.x = damp(ref.current.rotation.x, D2R(base[0] + (extra?.[0] || 0)), lambda, dt)
      ref.current.rotation.y = damp(ref.current.rotation.y, D2R(base[1] + (extra?.[1] || 0)), lambda, dt)
      ref.current.rotation.z = damp(ref.current.rotation.z, D2R(base[2] + (extra?.[2] || 0)), lambda, dt)
    }

    apply(shoulder, arm.s, add.s)
    apply(elbow, arm.e, add.e)
    apply(wrist, arm.w, add.w)
  })

  return (
    <group position={[mirror * 0.225, 1.335, 0]}>
      <mesh>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={SHIRT} roughness={0.8} />
      </mesh>
      <group ref={shoulder}>
        <mesh position={[0, -0.13, 0]}>
          <capsuleGeometry args={[0.048, 0.20, 6, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.62} />
        </mesh>
        <group ref={elbow} position={[0, -0.285, 0]}>
          <mesh>
            <sphereGeometry args={[0.045, 14, 14]} />
            <meshStandardMaterial color={SKIN} roughness={0.62} />
          </mesh>
          <mesh position={[0, -0.125, 0]}>
            <capsuleGeometry args={[0.041, 0.185, 6, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.62} />
          </mesh>
          {/* sleeve hint near the elbow */}
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.055, 0.05, 0.075, 14]} />
            <meshStandardMaterial color={SHIRT} roughness={0.85} />
          </mesh>
          <group ref={wrist} position={[0, -0.255, 0]}>
            <group scale={1.28} position={[0, -0.02, 0]}>
              <Hand side={side} pose={pose} mirror={mirror} />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Head + friendly face
// ---------------------------------------------------------------------------
function Head({ pose }) {
  const group = useRef()
  const browL = useRef()
  const browR = useRef()
  const mouth = useRef()
  const eyeL = useRef()
  const eyeR = useRef()
  const nextBlink = useRef(3)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const face = pose.face || 'friendly'
    if (group.current) {
      group.current.rotation.y = damp(group.current.rotation.y, D2R(3 * Math.sin(t * 0.55)), 3, dt)
      group.current.rotation.x = damp(
        group.current.rotation.x,
        D2R(face === 'question' ? -6 : 1.5 * Math.sin(t * 0.9)),
        3,
        dt,
      )
    }
    const browTarget = face === 'question' ? 0.028 : face === 'smile' ? 0.004 : 0
    const lift = face === 'question' ? 1 : 0
    if (browL.current) {
      browL.current.position.y = damp(browL.current.position.y, 1.703 + browTarget + lift * 0.004, 6, dt)
      browL.current.rotation.z = damp(browL.current.rotation.z, D2R(lift ? -16 : -6), 6, dt)
    }
    if (browR.current) {
      browR.current.position.y = damp(browR.current.position.y, 1.703 + browTarget - lift * 0.006, 6, dt)
      browR.current.rotation.z = damp(browR.current.rotation.z, D2R(6), 6, dt)
    }
    if (mouth.current) {
      const smile = face === 'smile' || face === 'friendly'
      mouth.current.rotation.z = damp(mouth.current.rotation.z, smile ? Math.PI : Math.PI * 0.86, 6, dt)
      mouth.current.scale.x = damp(mouth.current.scale.x, face === 'question' ? 0.82 : 1, 6, dt)
      mouth.current.scale.y = damp(mouth.current.scale.y, face === 'question' ? 1.5 : 1, 6, dt)
    }
    // blink
    nextBlink.current -= dt
    const blinking = nextBlink.current < 0.12
    if (nextBlink.current < 0) nextBlink.current = 2.4 + Math.random() * 3
    const eyeScale = blinking ? 0.12 : 1
    if (eyeL.current) eyeL.current.scale.y = damp(eyeL.current.scale.y, eyeScale, 26, dt)
    if (eyeR.current) eyeR.current.scale.y = damp(eyeR.current.scale.y, eyeScale, 26, dt)
  })

  return (
    <group ref={group} position={[0, 1.63, 0]}>
      {/* neck */}
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.048, 0.055, 0.09, 16]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
      </mesh>
      {/* head */}
      <mesh>
        <sphereGeometry args={[0.136, 32, 32]} />
        <meshStandardMaterial color={SKIN} roughness={0.55} />
      </mesh>
      {/* ears */}
      <mesh position={[-0.132, 0, 0]} scale={[0.5, 1, 0.8]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      <mesh position={[0.132, 0, 0]} scale={[0.5, 1, 0.8]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      {/* hair cap */}
      <mesh position={[0, 0.028, -0.012]} scale={[1.04, 0.92, 1.06]}>
        <sphereGeometry args={[0.14, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color={HAIR} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.055, -0.055]} scale={[1.0, 0.9, 0.9]}>
        <sphereGeometry args={[0.128, 20, 20]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>
      {/* eyes */}
      <mesh ref={eyeL} position={[-0.05, 0.014, 0.121]}>
        <sphereGeometry args={[0.019, 16, 16]} />
        <meshStandardMaterial color="#1f2a37" roughness={0.3} />
      </mesh>
      <mesh ref={eyeR} position={[0.05, 0.014, 0.121]}>
        <sphereGeometry args={[0.019, 16, 16]} />
        <meshStandardMaterial color="#1f2a37" roughness={0.3} />
      </mesh>
      {/* brows */}
      <mesh ref={browL} position={[-0.05, 0.052, 0.125]} rotation={[0, 0, D2R(-6)]}>
        <boxGeometry args={[0.045, 0.008, 0.012]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>
      <mesh ref={browR} position={[0.05, 0.052, 0.125]} rotation={[0, 0, D2R(6)]}>
        <boxGeometry args={[0.045, 0.008, 0.012]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>
      {/* nose */}
      <mesh position={[0, -0.012, 0.133]} scale={[0.7, 1, 0.8]}>
        <sphereGeometry args={[0.021, 12, 12]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.6} />
      </mesh>
      {/* mouth */}
      <mesh ref={mouth} position={[0, -0.062, 0.124]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.03, 0.006, 8, 18, Math.PI]} />
        <meshStandardMaterial color="#8a4a43" roughness={0.6} />
      </mesh>
    </group>
  )
}

function CameraRig() {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(0, 1.29, 0)
  }, [camera])
  return null
}

function Scene({ pose }) {
  return (
    <>
      {/* soft backdrop disc */}
      <mesh position={[0, 1.25, -0.75]}>
        <circleGeometry args={[0.98, 64]} />
        <meshBasicMaterial color="#dcecf8" />
      </mesh>
      <mesh position={[0, 1.25, -0.74]}>
        <ringGeometry args={[0.66, 0.675, 64]} />
        <meshBasicMaterial color="#bcdcf0" />
      </mesh>

      {/* torso */}
      <mesh position={[0, 1.12, 0]} scale={[1, 1, 0.78]}>
        <capsuleGeometry args={[0.175, 0.24, 10, 24]} />
        <meshStandardMaterial color={SHIRT} roughness={0.8} />
      </mesh>
      {/* collar */}
      <mesh position={[0, 1.375, 0.01]} rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 1, 1]}>
        <torusGeometry args={[0.07, 0.018, 10, 24]} />
        <meshStandardMaterial color={TEAL} roughness={0.6} />
      </mesh>
      {/* logo dot on shirt */}
      <mesh position={[0.085, 1.16, 0.142]}>
        <circleGeometry args={[0.026, 20]} />
        <meshStandardMaterial color={TEAL} roughness={0.5} />
      </mesh>
      {/* bust / pedestal */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.19, 0.24, 0.12, 28]} />
        <meshStandardMaterial color={SHIRT_DARK} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.26, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#123c5c" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.678, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.024, 40]} />
        <meshStandardMaterial color={TEAL} roughness={0.45} metalness={0.15} />
      </mesh>

      <Head pose={pose} />
      <Arm side="A" pose={pose} mirror={-1} />
      <Arm side="B" pose={pose} mirror={1} />
    </>
  )
}

export default function Avatar3D({ pose = REST_POSE, label = 'SignSync 3D sign-language avatar' }) {
  return (
    <div className="avatar-canvas" role="img" aria-label={label}>
      <Canvas
        camera={{ position: [0, 1.33, 2.18], fov: 36 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <CameraRig />
        <hemisphereLight intensity={1.25} groundColor="#cfe3f3" color="#ffffff" />
        <directionalLight position={[2.2, 3.4, 3]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-2.4, 1.6, 2]} intensity={0.55} color="#c8ecff" />
        <directionalLight position={[0, 2, -2.5]} intensity={0.5} color="#9fd6ef" />
        <Scene pose={pose} />
      </Canvas>
    </div>
  )
}
