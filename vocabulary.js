// SignSync AI — sample ISL demonstration vocabulary.
//
// This is a deliberately small, clearly labelled prototype vocabulary. It is
// an illustration of the pipeline (text -> keywords -> sign sequence -> avatar),
// not a complete or linguistically validated Indian Sign Language dataset.

export const CATEGORIES = [
  { id: 'greetings', label: 'Greetings', description: 'Everyday openings and closings' },
  { id: 'classroom', label: 'Classroom Vocabulary', description: 'Words used in a lesson' },
  { id: 'numbers', label: 'Numbers', description: 'Counting signs one to five' },
  { id: 'questions', label: 'Common Questions', description: 'Question words' },
  { id: 'daily', label: 'Daily Communication', description: 'Everyday needs and feelings' },
  { id: 'educational', label: 'Educational Terms', description: 'Subject and classroom topics' },
]

// label = the written form shown to the user, meanings help learners.
export const VOCABULARY = [
  // Greetings
  { id: 'HELLO', label: 'HELLO', aliases: ['hello', 'hi', 'hey', 'hii'], category: 'greetings', meaning: 'A common greeting used when meeting someone.' },
  { id: 'GOOD MORNING', label: 'GOOD MORNING', aliases: ['good morning', 'gm'], category: 'greetings', meaning: 'A greeting used earlier in the day.' },
  { id: 'GOOD AFTERNOON', label: 'GOOD AFTERNOON', aliases: ['good afternoon'], category: 'greetings', meaning: 'A greeting used after midday.' },
  { id: 'THANK YOU', label: 'THANK YOU', aliases: ['thank you', 'thanks', 'thankyou'], category: 'greetings', meaning: 'Expressing gratitude.' },
  { id: 'PLEASE', label: 'PLEASE', aliases: ['please'], category: 'greetings', meaning: 'A polite word used when asking for something.' },
  { id: 'SORRY', label: 'SORRY', aliases: ['sorry', 'apologise', 'apologize'], category: 'greetings', meaning: 'An apology.' },
  { id: 'GOODBYE', label: 'GOODBYE', aliases: ['goodbye', 'good bye', 'bye', 'see you'], category: 'greetings', meaning: 'Used when leaving.' },
  { id: 'WELCOME', label: 'WELCOME', aliases: ['welcome'], category: 'greetings', meaning: 'Greeting someone warmly on arrival.' },
  { id: 'HOW ARE YOU', label: 'HOW ARE YOU', aliases: ['how are you', 'how do you do'], category: 'greetings', meaning: 'Asking about someone’s wellbeing.' },
  { id: 'NAMASTE', label: 'NAMASTE', aliases: ['namaste', 'namaskar'], category: 'greetings', meaning: 'A respectful Indian greeting with joined palms.' },

  // Classroom
  { id: 'TEACHER', label: 'TEACHER', aliases: ['teacher', 'teachers', 'sir', 'madam', 'maam'], category: 'classroom', meaning: 'A person who teaches a class.' },
  { id: 'STUDENT', label: 'STUDENT', aliases: ['student', 'students', 'pupil', 'pupils'], category: 'classroom', meaning: 'A person who is learning in a class.' },
  { id: 'CLASS', label: 'CLASS', aliases: ['class', 'classroom', 'classes'], category: 'classroom', meaning: 'A group of students learning together.' },
  { id: 'LESSON', label: 'LESSON', aliases: ['lesson', 'lessons', 'topic'], category: 'classroom', meaning: 'A unit of teaching.' },
  { id: 'LISTEN', label: 'LISTEN', aliases: ['listen', 'listening', 'hear'], category: 'classroom', meaning: 'Paying attention to sound or a speaker.' },
  { id: 'WRITE', label: 'WRITE', aliases: ['write', 'writing', 'wrote'], category: 'classroom', meaning: 'Putting words on paper or a screen.' },
  { id: 'READ', label: 'READ', aliases: ['read', 'reading'], category: 'classroom', meaning: 'Looking at and understanding written text.' },
  { id: 'UNDERSTAND', label: 'UNDERSTAND', aliases: ['understand', 'understood', 'understandable'], category: 'classroom', meaning: 'To grasp the meaning of something.' },
  { id: 'LEARN', label: 'LEARN', aliases: ['learn', 'learning', 'learned', 'learnt', 'study', 'studying'], category: 'classroom', meaning: 'Gaining new knowledge or skill.' },
  { id: 'ATTENTION', label: 'ATTENTION', aliases: ['attention', 'focus', 'concentrate'], category: 'classroom', meaning: 'Directing focus to the lesson.' },
  { id: 'HOMEWORK', label: 'HOMEWORK', aliases: ['homework', 'assignment'], category: 'classroom', meaning: 'School work done outside class.' },
  { id: 'QUESTION', label: 'QUESTION', aliases: ['question', 'questions', 'doubt', 'doubts'], category: 'classroom', meaning: 'Something asked in order to learn.' },
  { id: 'ANSWER', label: 'ANSWER', aliases: ['answer', 'answers', 'respond', 'response'], category: 'classroom', meaning: 'A reply to a question.' },
  { id: 'IDEA', label: 'IDEA', aliases: ['idea', 'ideas', 'thought'], category: 'classroom', meaning: 'A new thought or concept.' },
  { id: 'SMART', label: 'SMART', aliases: ['smart', 'clever', 'intelligent'], category: 'classroom', meaning: 'Quick to understand and learn.' },
  { id: 'FRIEND', label: 'FRIEND', aliases: ['friend', 'friends'], category: 'classroom', meaning: 'A person you know well and like.' },

  // Numbers
  { id: 'ONE', label: 'ONE', aliases: ['one', '1'], category: 'numbers', meaning: 'The number 1.' },
  { id: 'TWO', label: 'TWO', aliases: ['two', '2'], category: 'numbers', meaning: 'The number 2.' },
  { id: 'THREE', label: 'THREE', aliases: ['three', '3'], category: 'numbers', meaning: 'The number 3.' },
  { id: 'FOUR', label: 'FOUR', aliases: ['four', '4'], category: 'numbers', meaning: 'The number 4.' },
  { id: 'FIVE', label: 'FIVE', aliases: ['five', '5'], category: 'numbers', meaning: 'The number 5.' },

  // Questions
  { id: 'WHAT', label: 'WHAT', aliases: ['what'], category: 'questions', meaning: 'Asking for information about something.' },
  { id: 'WHERE', label: 'WHERE', aliases: ['where'], category: 'questions', meaning: 'Asking about a place.' },
  { id: 'WHEN', label: 'WHEN', aliases: ['when'], category: 'questions', meaning: 'Asking about time.' },
  { id: 'WHO', label: 'WHO', aliases: ['who', 'whom'], category: 'questions', meaning: 'Asking about a person.' },
  { id: 'WHY', label: 'WHY', aliases: ['why'], category: 'questions', meaning: 'Asking for a reason.' },
  { id: 'HOW', label: 'HOW', aliases: ['how'], category: 'questions', meaning: 'Asking about the way something happens.' },

  // Daily communication
  { id: 'YES', label: 'YES', aliases: ['yes', 'yeah', 'yep', 'sure'], category: 'daily', meaning: 'Agreement or confirmation.' },
  { id: 'NO', label: 'NO', aliases: ['no', 'nope', 'not'], category: 'daily', meaning: 'Refusal or disagreement.' },
  { id: 'WATER', label: 'WATER', aliases: ['water', 'drink'], category: 'daily', meaning: 'Asking for or naming water.' },
  { id: 'HELP', label: 'HELP', aliases: ['help', 'assist', 'support'], category: 'daily', meaning: 'Asking for or offering assistance.' },
  { id: 'FAMILY', label: 'FAMILY', aliases: ['family', 'parents', 'mother', 'father'], category: 'daily', meaning: 'People related to you.' },
  { id: 'HOME', label: 'HOME', aliases: ['home', 'house'], category: 'daily', meaning: 'The place where you live.' },
  { id: 'FOOD', label: 'FOOD', aliases: ['food', 'eat', 'eating', 'hungry', 'lunch'], category: 'daily', meaning: 'Eating or asking for food.' },
  { id: 'TIME', label: 'TIME', aliases: ['time', 'clock', 'hour'], category: 'daily', meaning: 'Asking about or naming time.' },
  { id: 'TODAY', label: 'TODAY', aliases: ['today'], category: 'daily', meaning: 'The present day.' },
  { id: 'NOW', label: 'NOW', aliases: ['now', 'immediately'], category: 'daily', meaning: 'At this moment.' },
  { id: 'NAME', label: 'NAME', aliases: ['name', 'called'], category: 'daily', meaning: 'Introducing or asking a name.' },
  { id: 'SLOW', label: 'SLOW', aliases: ['slow', 'slowly'], category: 'daily', meaning: 'Asking someone to go slower.' },
  { id: 'AGAIN', label: 'AGAIN', aliases: ['again', 'repeat', 'once more'], category: 'daily', meaning: 'Asking for something to be repeated.' },
  { id: 'FINISH', label: 'FINISH', aliases: ['finish', 'finished', 'done', 'complete'], category: 'daily', meaning: 'Something is complete.' },

  // Educational terms
  { id: 'COMPUTER', label: 'COMPUTER', aliases: ['computer', 'computers', 'laptop', 'pc'], category: 'educational', meaning: 'A machine used for computing and digital work.' },
  { id: 'SCIENCE', label: 'SCIENCE', aliases: ['science', 'scientific'], category: 'educational', meaning: 'The study of the natural world.' },
  { id: 'MATHEMATICS', label: 'MATHEMATICS', aliases: ['mathematics', 'maths', 'math', 'algebra'], category: 'educational', meaning: 'The study of numbers and patterns.' },
  { id: 'ARTIFICIAL INTELLIGENCE', label: 'ARTIFICIAL INTELLIGENCE', aliases: ['artificial intelligence', 'ai', 'machine intelligence'], category: 'educational', meaning: 'Computer systems that perform tasks that need human-like intelligence.' },
  { id: 'TECHNOLOGY', label: 'TECHNOLOGY', aliases: ['technology', 'tech'], category: 'educational', meaning: 'Tools and systems created through science.' },
  { id: 'LANGUAGE', label: 'LANGUAGE', aliases: ['language', 'languages', 'english', 'hindi'], category: 'educational', meaning: 'A system of communication.' },
  { id: 'SIGN LANGUAGE', label: 'SIGN LANGUAGE', aliases: ['sign language', 'isl', 'indian sign language'], category: 'educational', meaning: 'A visual language using hand shapes, movement and expression.' },
  { id: 'SCHOOL', label: 'SCHOOL', aliases: ['school', 'college', 'campus'], category: 'educational', meaning: 'A place of learning.' },
  { id: 'BOOK', label: 'BOOK', aliases: ['book', 'books', 'notebook', 'textbook'], category: 'educational', meaning: 'A written or printed source of knowledge.' },
]

export const VOCAB_BY_ID = Object.fromEntries(VOCABULARY.map((v) => [v.id, v]))

// Grammar glue that is skipped rather than reported as "unsupported".
export const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being',
  'of', 'to', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'but', 'so',
  'this', 'that', 'these', 'those', 'it', 'its', 'we', 'us', 'you', 'your',
  'i', 'me', 'my', 'he', 'she', 'they', 'them', 'their', 'our', 'ours',
  'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'may',
  'have', 'has', 'had', 'about', 'very', 'really', 'as', 'by', 'from',
  'into', 'up', 'out', 'there', 'here', 'then', 'than', 'also', 'just',
  'some', 'any', 'all', 'if', 'because', 'let', 'lets', 'will', 'shall',
  'today’s', "today's", 'please', 'okay', 'ok', 'well', 'um', 'uh',
  'going', 'gonna', 'want', 'like', 'get', 'got', 'make', 'makes',
])

// Words with a sign demo, used by the learning and practice sections.
export const PRACTICE_POOL = ['HELLO', 'GOOD MORNING', 'THANK YOU', 'PLEASE', 'QUESTION', 'TEACHER', 'STUDENT', 'COMPUTER', 'WATER', 'HELP', 'YES', 'NO', 'FRIEND', 'LEARN']
