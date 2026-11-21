// Sample classroom content, announcements, learning topics and demo scripts.

export const CLASSROOM_SIMULATION = [
  {
    id: 'c1',
    text: 'Good morning students. Today we are learning about computers.',
    note: 'Greeting + topic introduction',
  },
  {
    id: 'c2',
    text: 'A computer is a machine that helps us read, write and learn.',
    note: 'Definition, one unsupported verb',
  },
  {
    id: 'c3',
    text: 'Today we will also talk about artificial intelligence.',
    note: 'Introduces a multi-word technical sign',
  },
  {
    id: 'c4',
    text: 'Please listen carefully. Ask a question if you do not understand.',
    note: 'Classroom instructions',
  },
]

export const ANNOUNCEMENTS = [
  {
    id: 'a1',
    text: 'Science class will start at ten in the morning.',
    category: 'Timetable',
  },
  {
    id: 'a2',
    text: 'Please bring your computer homework tomorrow.',
    category: 'Reminder',
  },
  {
    id: 'a3',
    text: 'The mathematics test is on Friday. Ask your teacher if you need help.',
    category: 'Assessment',
  },
]

export const LEARNING_TOPICS = [
  {
    id: 'mathematics',
    label: 'Mathematics',
    blurb: 'Numbers, counting and basic maths words in the demo vocabulary.',
    words: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'MATHEMATICS', 'QUESTION'],
  },
  {
    id: 'science',
    label: 'Science',
    blurb: 'Simple science classroom vocabulary.',
    words: ['SCIENCE', 'WATER', 'IDEA', 'QUESTION', 'LEARN', 'BOOK'],
  },
  {
    id: 'computer-science',
    label: 'Computer Science',
    blurb: 'Technology and computing terms used in the demo.',
    words: ['COMPUTER', 'ARTIFICIAL INTELLIGENCE', 'TECHNOLOGY', 'SMART', 'LEARN'],
  },
  {
    id: 'daily',
    label: 'Daily Communication',
    blurb: 'Everyday phrases that help a student take part in class.',
    words: ['HELLO', 'THANK YOU', 'PLEASE', 'WATER', 'HELP', 'AGAIN', 'SLOW', 'FINISH'],
  },
]

export const DEMO_SCENARIOS = [
  {
    id: 'A',
    title: 'Demo A — Classroom',
    to: '/classroom',
    lines: ['“Good morning students. Today we are learning about computers.”'],
    expected: [
      'Speech (or the simulation) appears as text',
      'Supported keywords are identified',
      'The avatar demonstrates the matching signs',
      'Captions stay visible through the sequence',
    ],
  },
  {
    id: 'B',
    title: 'Demo B — Everyday communication',
    to: '/communication',
    lines: ['“Hello, how are you?”', '“Hello, can you help me?”'],
    expected: [
      'The sentence appears in the conversation panel',
      'The avatar demonstrates supported signs',
      'Person B sees the sign sequence and captions',
    ],
  },
  {
    id: 'C',
    title: 'Demo C — Sign recognition',
    to: '/sign-recognition',
    lines: ['Show a supported sample gesture to the camera.'],
    expected: [
      'The camera captures the hand',
      'The demo model identifies a supported gesture',
      'The word appears as text with a confidence score',
    ],
  },
]

export const HOW_IT_WORKS_STAGES = [
  {
    id: 'speech',
    label: 'Speech Input',
    short: 'Microphone or typed sentence',
    detail: 'The teacher speaks into the browser microphone, or types the sentence when no microphone is available.',
    status: 'Listening',
  },
  {
    id: 'asr',
    label: 'Speech Recognition',
    short: 'Browser Web Speech API',
    detail: 'Browser speech recognition transcribes audio to text on the device where the browser supports it.',
    status: 'Transcribing',
  },
  {
    id: 'nlp',
    label: 'Text Processing',
    short: 'Normalise and tokenise',
    detail: 'The sentence is lower-cased, tokenised, and light suffix rules map plurals and simple verb forms to their base word.',
    status: 'Processing',
  },
  {
    id: 'vocab',
    label: 'Vocabulary Identification',
    short: 'Phrase + keyword matching',
    detail: 'Longest multi-word phrases are matched first (for example “artificial intelligence”), then single words against the demo vocabulary.',
    status: 'Identifying signs',
  },
  {
    id: 'mapping',
    label: 'ISL Sequence Mapping',
    short: 'Keywords to sign order',
    detail: 'Matched keywords become an ordered sign sequence. Unsupported words are reported instead of being silently dropped.',
    status: 'Generating sequence',
  },
  {
    id: 'avatar',
    label: '3D Avatar Animation',
    short: 'Pose blending + playback',
    detail: 'Each sign maps to a pose rig of joint angles. The avatar blends smoothly between poses with playback and speed controls.',
    status: 'Playing animation',
  },
  {
    id: 'visual',
    label: 'Visual Communication',
    short: 'Avatar + captions',
    detail: 'Captions remain visible beside the avatar so the message is never available only through the animation.',
    status: 'Displaying',
  },
]

export const PROFILE_TYPES = [
  { id: 'deaf', label: 'Deaf or hard-of-hearing student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'hearing', label: 'Hearing individual' },
  { id: 'other', label: 'Other' },
]

export const COMMUNICATION_MODES = [
  { id: 'speech-to-sign', label: 'Speech to sign' },
  { id: 'text-to-sign', label: 'Text to sign' },
  { id: 'sign-to-text', label: 'Sign to text' },
]
