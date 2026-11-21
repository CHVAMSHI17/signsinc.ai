// SignSync AI — pose rig data
//
// Every sign is described as a small set of joint angles for a stylised
// 3D humanoid. This is a *sample sign demonstration set*, authored for this
// prototype. It is not a linguistically validated ISL dictionary.
//
// Conventions (degrees):
//   s = shoulder rotation [x, y, z]
//   e = elbow rotation    [x, y, z]
//   w = wrist rotation    [x, y, z]
//   o = hand openness, 5 values 0..1 for [thumb, index, middle, ring, pinky]
//       1 = fully extended, 0 = fully curled
//
// Values are authored for the avatar's screen-left arm ("A"). The rig mirrors
// y/z for the other arm so both sides look symmetric.

const OPEN = [1, 1, 1, 1, 1]
const SOFT = [0.28, 0.5, 0.5, 0.5, 0.5]
const FIST = [0.05, 0.08, 0.08, 0.08, 0.08]
const POINT = [0.15, 1, 0.1, 0.1, 0.1]
const TWO = [0.2, 1, 1, 0.1, 0.1]
const THREE_F = [0.2, 1, 1, 1, 0.1]
const THREE_M = [0.2, 0.1, 1, 1, 1]
const THUMB = [1, 0.1, 0.1, 0.1, 0.1]
const PINCH = [0.25, 0.8, 0.8, 0.15, 0.15]
const FLAT_SOFT = [0.4, 0.95, 0.95, 0.95, 0.95]

// Authored poses (screen-left arm).
const ARMS = {
  rest: { s: [-4, 0, -12], e: [-16, 0, 0], w: [0, 0, 0], o: SOFT },
  forward: { s: [-72, 0, -8], e: [-58, 0, 0], w: [0, 0, 0], o: OPEN },
  forwardLow: { s: [-58, 0, -14], e: [-62, 0, 0], w: [0, 0, 0], o: OPEN },
  up: { s: [-104, 0, -14], e: [-58, 0, 0], w: [20, 0, 0], o: OPEN },
  upHigh: { s: [-118, 0, -10], e: [-46, 0, 0], w: [20, 0, 0], o: OPEN },
  wave: { s: [-108, 0, -20], e: [-52, 0, 0], w: [0, 0, 18], o: OPEN },
  out: { s: [-46, 0, -62], e: [-34, 0, 0], w: [0, 0, 0], o: OPEN },
  outLow: { s: [-26, 0, -48], e: [-30, 0, 0], w: [0, 0, 0], o: SOFT },
  chest: { s: [-54, 0, 24], e: [-102, 0, 0], w: [0, 0, 0], o: OPEN },
  chestFist: { s: [-50, 0, 22], e: [-104, 0, 0], w: [0, 0, 0], o: FIST },
  chestPoint: { s: [-52, 0, 22], e: [-100, 0, 0], w: [0, 0, 0], o: POINT },
  chestThumb: { s: [-56, 0, 18], e: [-98, 0, 0], w: [0, 0, 0], o: THUMB },
  chin: { s: [-96, 0, -6], e: [-96, 0, 0], w: [30, 0, 0], o: OPEN },
  cheek: { s: [-100, 0, -12], e: [-104, 0, 0], w: [30, 0, 0], o: FLAT_SOFT },
  ear: { s: [-40, 0, -74], e: [-128, 0, 0], w: [0, 0, 0], o: [0.3, 0.85, 0.85, 0.85, 0.85] },
  temple: { s: [-96, 0, -18], e: [-124, 0, 0], w: [0, 0, 0], o: POINT },
  indexUp: { s: [-70, 0, -18], e: [-76, 0, 0], w: [0, 0, 0], o: POINT },
  pinch: { s: [-66, 0, -14], e: [-66, 0, 0], w: [0, 0, 0], o: PINCH },
  across: { s: [-70, 0, 30], e: [-78, 0, 0], w: [0, 0, 0], o: OPEN },
  acrossLow: { s: [-40, 0, 34], e: [-64, 0, 0], w: [0, 0, 0], o: OPEN },
  palmDown: { s: [-62, 0, 4], e: [-42, 0, 0], w: [-40, 0, 0], o: OPEN },
  palmUp: { s: [-58, 0, 6], e: [-70, 0, 0], w: [-30, 0, 0], o: FLAT_SOFT },
  lowPalm: { s: [-34, 0, 10], e: [-56, 0, 0], w: [-20, 0, 0], o: OPEN },
  threeHand: { s: [-62, 0, -26], e: [-64, 0, 0], w: [0, 0, 0], o: THREE_F },
  threeMid: { s: [-58, 0, -22], e: [-62, 0, 0], w: [0, 0, 0], o: THREE_M },
  twoFinger: { s: [-64, 0, -20], e: [-64, 0, 0], w: [0, 0, 0], o: TWO },
  clasp: { s: [-56, 0, 34], e: [-112, 0, 0], w: [0, 0, 20], o: [0.5, 0.55, 0.55, 0.55, 0.55] },
  faceOpen: { s: [-86, 0, -26], e: [-58, 0, 0], w: [10, 0, 0], o: OPEN },
}

const mirrorArm = (arm) => ({
  s: [arm.s[0], -arm.s[1], -arm.s[2]],
  e: [arm.e[0], -arm.e[1], -arm.e[2]],
  w: [arm.w[0], -arm.w[1], -arm.w[2]],
  o: [...arm.o],
})

const A = (name, overrides = {}) => {
  const base = ARMS[name] || ARMS.rest
  return {
    s: overrides.s || [...base.s],
    e: overrides.e || [...base.e],
    w: overrides.w || [...base.w],
    o: overrides.o || [...base.o],
  }
}

const B = (name, overrides = {}) => mirrorArm(A(name, overrides))

function pose(aName, bName = 'rest', opts = {}) {
  return {
    A: A(aName, opts.a),
    B: B(bName, opts.b),
    motion: opts.motion || 'none',
    motionBoth: Boolean(opts.motionBoth),
    face: opts.face || 'friendly',
  }
}

export const REST_POSE = pose('rest')

// ---------------------------------------------------------------------------
// Sign poses. One entry per demonstration vocabulary item.
// ---------------------------------------------------------------------------
export const SIGN_POSES = {
  // Greetings & everyday
  HELLO: pose('wave', 'rest', { motion: 'wave', face: 'smile' }),
  'GOOD MORNING': pose('up', 'outLow', { motion: 'rise', motionBoth: true, face: 'smile' }),
  'GOOD AFTERNOON': pose('upHigh', 'upHigh', { motion: 'rise', motionBoth: true }),
  'THANK YOU': pose('chin', 'rest', { motion: 'push', face: 'smile' }),
  PLEASE: pose('chest', 'rest', { motion: 'circle' }),
  SORRY: pose('chestFist', 'rest', { motion: 'circle', face: 'soft' }),
  GOODBYE: pose('wave', 'rest', { motion: 'wave' }),
  WELCOME: pose('forward', 'forward', { motion: 'open', motionBoth: true }),
  'HOW ARE YOU': pose('palmUp', 'palmUp', { motion: 'roll', motionBoth: true, face: 'question' }),
  NAMASTE: pose('clasp', 'clasp', { face: 'smile' }),
  YES: pose('chestFist', 'rest', { motion: 'nod', face: 'smile' }),
  NO: pose('twoFinger', 'rest', { motion: 'shake', face: 'neutral' }),
  WATER: pose('threeHand', 'rest', { motion: 'tap' }),
  HELP: pose('chestThumb', 'lowPalm', { motion: 'rise' }),
  FAMILY: pose('out', 'out', { motion: 'circle', motionBoth: true }),
  HOME: pose('cheek', 'rest', { motion: 'tap' }),
  FOOD: pose('pinch', 'rest', { motion: 'tap' }),
  TIME: pose('acrossLow', 'rest', { motion: 'tap' }),
  TODAY: pose('palmUp', 'palmUp', { motion: 'push', motionBoth: true }),
  NOW: pose('palmDown', 'palmDown', { motion: 'push', motionBoth: true }),
  NAME: pose('chestPoint', 'chestPoint', { motion: 'tap', motionBoth: true }),
  FRIEND: pose('clasp', 'clasp', { motion: 'small', face: 'smile' }),
  SLOW: pose('palmDown', 'rest', { motion: 'slow' }),
  AGAIN: pose('across', 'rest', { motion: 'circle' }),
  FINISH: pose('forward', 'forward', { motion: 'open', motionBoth: true }),

  // Classroom
  TEACHER: pose('out', 'outLow', { motion: 'small' }),
  STUDENT: pose('chest', 'rest', { face: 'smile' }),
  CLASS: pose('out', 'out', { motion: 'circle', motionBoth: true }),
  LESSON: pose('chest', 'chest', { motion: 'small', motionBoth: true }),
  LISTEN: pose('ear', 'rest', { face: 'neutral' }),
  WRITE: pose('pinch', 'rest', { motion: 'scribble' }),
  READ: pose('palmUp', 'palmUp', { motion: 'small', motionBoth: true }),
  UNDERSTAND: pose('temple', 'rest', { motion: 'small', face: 'smile' }),
  LEARN: pose('chest', 'temple', { motion: 'rise', motionBoth: true }),
  ATTENTION: pose('forward', 'forward', { motion: 'small', motionBoth: true }),
  HOMEWORK: pose('pinch', 'pinch', { motion: 'scribble', motionBoth: true }),
  QUESTION: pose('indexUp', 'rest', { motion: 'roll', face: 'question' }),
  ANSWER: pose('forward', 'forward', { motion: 'push', motionBoth: true }),
  IDEA: pose('indexUp', 'rest', { motion: 'small', face: 'smile' }),
  SMART: pose('temple', 'rest', { motion: 'circle', face: 'smile' }),

  // Questions
  WHAT: pose('palmUp', 'palmUp', { motion: 'shake', motionBoth: true, face: 'question' }),
  WHERE: pose('indexUp', 'rest', { motion: 'circle', face: 'question' }),
  WHEN: pose('acrossLow', 'rest', { motion: 'tap', face: 'question' }),
  WHO: pose('indexUp', 'rest', { motion: 'tap', face: 'question' }),
  WHY: pose('chin', 'rest', { motion: 'push', face: 'question' }),
  HOW: pose('palmUp', 'palmUp', { motion: 'roll', motionBoth: true, face: 'question' }),

  // Learning topics / educational terms
  COMPUTER: pose('pinch', 'pinch', { motion: 'scribble', motionBoth: true }),
  SCIENCE: pose('threeHand', 'threeMid', { motion: 'rise', motionBoth: true }),
  MATHEMATICS: pose('across', 'rest', { motion: 'slide' }),
  'ARTIFICIAL INTELLIGENCE': pose('temple', 'temple', { motion: 'circle', motionBoth: true }),
  TECHNOLOGY: pose('forwardLow', 'forwardLow', { motion: 'small', motionBoth: true }),
  LANGUAGE: pose('faceOpen', 'faceOpen', { motion: 'circle', motionBoth: true }),
  'SIGN LANGUAGE': pose('twoFinger', 'twoFinger', { motion: 'circle', motionBoth: true }),
  SCHOOL: pose('out', 'outLow', { motion: 'small' }),
  BOOK: pose('palmUp', 'palmUp', { motion: 'open', motionBoth: true }),

  // Numbers
  ONE: pose('indexUp', 'rest'),
  TWO: pose('twoFinger', 'rest'),
  THREE: pose('threeHand', 'rest'),
  FOUR: pose('forward', 'rest', { a: { o: [0.1, 1, 1, 1, 1] } }),
  FIVE: pose('forward', 'rest', { a: { o: OPEN } }),
}

export function getPose(id) {
  return SIGN_POSES[id] || REST_POSE
}
