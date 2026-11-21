// Sample gesture recognition for the sign-to-text demo.
//
// Optional: MediaPipe Hands loads from a CDN when the browser/network allows.
// If it does not load, the UI falls back to a clearly labelled simulation.
// Classification is a small rule set over hand landmarks — a demo, not ISL
// recognition. Indian Sign Language contains far more than hand shape.

const MEDIAPIPE_VERSION = '0.10.14'
const MP_ROOT = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}`
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export const SAMPLE_GESTURES = [
  { id: 'HELLO', label: 'HELLO', meaning: 'Open hand, fingers spread — a wave.', shape: 'All five fingers extended' },
  { id: 'YES', label: 'YES', meaning: 'Closed hand — a nod of agreement.', shape: 'Closed fist' },
  { id: 'NO', label: 'NO', meaning: 'Two fingers raised.', shape: 'Index and middle fingers extended' },
  { id: 'HELP', label: 'HELP', meaning: 'Thumb raised at the chest.', shape: 'Thumb extended, fingers curled' },
  { id: 'WATER', label: 'WATER', meaning: 'Three fingers raised.', shape: 'Index, middle and ring extended' },
  { id: 'THANK YOU', label: 'THANK YOU', meaning: 'Index finger raised.', shape: 'Index finger only' },
]

// Minimum score for a gesture to be reported instead of "unclear".
export const MIN_CONFIDENCE = 0.62

// expected openness signature: [thumb, index, middle, ring, pinky]
const SIGNATURES = {
  HELLO: [1, 1, 1, 1, 1],
  YES: [0, 0, 0, 0, 0],
  NO: [0, 1, 1, 0, 0],
  HELP: [1, 0, 0, 0, 0],
  WATER: [0, 1, 1, 1, 0],
  'THANK YOU': [0, 1, 0, 0, 0],
}

let landmarkerPromise = null

export async function loadHandLandmarker() {
  if (landmarkerPromise) return landmarkerPromise
  landmarkerPromise = (async () => {
    const vision = await import(/* @vite-ignore */ `${MP_ROOT}/vision_bundle.mjs`)
    const fileset = await vision.FilesetResolver.forVisionTasks(`${MP_ROOT}/wasm`)
    const landmarker = await vision.HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.55,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })
    return landmarker
  })()
  try {
    return await landmarkerPromise
  } catch (error) {
    landmarkerPromise = null
    throw error
  }
}

export function detectHands(landmarker, video, timestampMs) {
  if (!landmarker) return null
  const result = landmarker.detectForVideo(video, timestampMs)
  if (!result || !result.landmarks || result.landmarks.length === 0) return null
  return result.landmarks[0]
}

// Distance-based finger extension test, wrist relative.
function fingerExtended(landmarks, tip, pip, wrist = 0) {
  const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0))
  const tipDist = d(landmarks[tip], landmarks[wrist])
  const pipDist = d(landmarks[pip], landmarks[wrist])
  return (tipDist - pipDist) / (pipDist + 1e-6)
}

// Landmark indices [tip, pip] for index, middle, ring and pinky.
const FINGER_JOINTS = [
  [8, 6],
  [12, 10],
  [16, 14],
  [20, 18],
]

export function classifyHand(landmarks) {
  if (!landmarks || landmarks.length < 21) return null

  // Each score is normalised into 0..1 exactly once. The thumb moves on a
  // different axis, so it keeps a more relaxed scale than the fingers.
  const thumbOpen = clamp01(fingerExtended(landmarks, 4, 2) * 1.6 + 0.5)
  const openness = [
    thumbOpen,
    ...FINGER_JOINTS.map(([tip, pip]) => clamp01(fingerExtended(landmarks, tip, pip) * 2.2 + 0.5)),
  ]

  let best = null
  for (const [id, signature] of Object.entries(SIGNATURES)) {
    let score = 0
    for (let i = 0; i < 5; i += 1) {
      const expected = signature[i]
      const actual = openness[i]
      score += expected ? actual : 1 - actual
    }
    const confidence = score / 5
    if (!best || confidence > best.confidence) best = { id, confidence, openness }
  }

  // Require a clear match, otherwise report "unsure".
  if (!best || best.confidence < MIN_CONFIDENCE) {
    return { id: null, label: 'Unclear gesture', confidence: best ? best.confidence : 0, openness }
  }
  const gesture = SAMPLE_GESTURES.find((g) => g.id === best.id)
  return { id: best.id, label: gesture.label, confidence: best.confidence, openness }
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}

// Simulation helper: cycles sample gestures so the demo works with no camera.
export function simulatedDetection(index) {
  const gesture = SAMPLE_GESTURES[index % SAMPLE_GESTURES.length]
  const confidence = 0.78 + ((index * 7) % 17) / 100
  return { id: gesture.id, label: gesture.label, confidence: Math.min(0.97, confidence), simulated: true }
}

export function drawLandmarks(ctx, landmarks, width, height) {
  if (!ctx || !landmarks) return
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
  ]
  ctx.clearRect(0, 0, width, height)
  ctx.strokeStyle = '#22d3ee'
  ctx.lineWidth = 3
  ctx.beginPath()
  for (const [a, b] of connections) {
    ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height)
    ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height)
  }
  ctx.stroke()
  ctx.fillStyle = '#0ea5a5'
  for (const point of landmarks) {
    ctx.beginPath()
    ctx.arc(point.x * width, point.y * height, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}
