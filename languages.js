// Regional output languages for sign-to-text and sign-to-audio.
//
// The demo vocabulary is six signs, so the translations are a word-level
// glossary for those signs — not grammatical sentences in any language.
// Each entry maps a demo sign id to its common written form.

export const OUTPUT_LANGUAGES = [
  { id: 'en', label: 'English', native: 'English', speechLang: 'en-IN' },
  {
    id: 'hi',
    label: 'Hindi',
    native: 'हिन्दी',
    speechLang: 'hi-IN',
    words: { HELLO: 'नमस्ते', YES: 'हाँ', NO: 'नहीं', HELP: 'मदद', WATER: 'पानी', 'THANK YOU': 'धन्यवाद' },
  },
  {
    id: 'ta',
    label: 'Tamil',
    native: 'தமிழ்',
    speechLang: 'ta-IN',
    words: { HELLO: 'வணக்கம்', YES: 'ஆம்', NO: 'இல்லை', HELP: 'உதவி', WATER: 'தண்ணீர்', 'THANK YOU': 'நன்றி' },
  },
  {
    id: 'te',
    label: 'Telugu',
    native: 'తెలుగు',
    speechLang: 'te-IN',
    words: { HELLO: 'నమస్కారం', YES: 'అవును', NO: 'కాదు', HELP: 'సహాయం', WATER: 'నీరు', 'THANK YOU': 'ధన్యవాదాలు' },
  },
  {
    id: 'mr',
    label: 'Marathi',
    native: 'मराठी',
    speechLang: 'mr-IN',
    words: { HELLO: 'नमस्कार', YES: 'होय', NO: 'नाही', HELP: 'मदत', WATER: 'पाणी', 'THANK YOU': 'धन्यवाद' },
  },
  {
    id: 'kn',
    label: 'Kannada',
    native: 'ಕನ್ನಡ',
    speechLang: 'kn-IN',
    words: { HELLO: 'ನಮಸ್ಕಾರ', YES: 'ಹೌದು', NO: 'ಇಲ್ಲ', HELP: 'ಸಹಾಯ', WATER: 'ನೀರು', 'THANK YOU': 'ಧನ್ಯವಾದ' },
  },
  {
    id: 'bn',
    label: 'Bengali',
    native: 'বাংলা',
    speechLang: 'bn-IN',
    words: { HELLO: 'নমস্কার', YES: 'হ্যাঁ', NO: 'না', HELP: 'সাহায্য', WATER: 'জল', 'THANK YOU': 'ধন্যবাদ' },
  },
  {
    id: 'gu',
    label: 'Gujarati',
    native: 'ગુજરાતી',
    speechLang: 'gu-IN',
    words: { HELLO: 'નમસ્તે', YES: 'હા', NO: 'ના', HELP: 'મદદ', WATER: 'પાણી', 'THANK YOU': 'આભાર' },
  },
  {
    id: 'ml',
    label: 'Malayalam',
    native: 'മലയാളം',
    speechLang: 'ml-IN',
    words: { HELLO: 'നമസ്കാരം', YES: 'അതെ', NO: 'ഇല്ല', HELP: 'സഹായം', WATER: 'വെള്ളം', 'THANK YOU': 'നന്ദി' },
  },
  {
    id: 'pa',
    label: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    speechLang: 'pa-IN',
    words: { HELLO: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', YES: 'ਹਾਂ', NO: 'ਨਹੀਂ', HELP: 'ਮਦਦ', WATER: 'ਪਾਣੀ', 'THANK YOU': 'ਧੰਨਵਾਦ' },
  },
  {
    id: 'ur',
    label: 'Urdu',
    native: 'اردو',
    speechLang: 'ur-IN',
    words: { HELLO: 'سلام', YES: 'ہاں', NO: 'نہیں', HELP: 'مدد', WATER: 'پانی', 'THANK YOU': 'شکریہ' },
  },
]

export function getOutputLanguage(id) {
  return OUTPUT_LANGUAGES.find((lang) => lang.id === id) || OUTPUT_LANGUAGES[0]
}

/**
 * Convert a list of signed sign ids into displayable words for one language.
 * Falls back to the English label when a word has no translation.
 */
export function translateSigns(signIds, languageId) {
  const language = getOutputLanguage(languageId)
  const words = language.words || {}
  return signIds.map((id) => ({
    id,
    english: id,
    text: language.id === 'en' ? id : words[id] || id,
    translated: language.id === 'en' || Boolean(words[id]),
  }))
}

/** The sentence to speak aloud: the regional words joined in sign order. */
export function spokenText(entries) {
  return entries.map((entry) => entry.text).join(' ')
}
