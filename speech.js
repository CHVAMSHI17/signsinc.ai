// Browser speech recognition wrapper (Web Speech API) with capability checks.

export function getSpeechSupport() {
  if (typeof window === 'undefined') return { supported: false }
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  return Ctor ? { supported: true, Ctor } : { supported: false }
}

// Find a system voice for a BCP-47 language tag (e.g. "ta-IN").
export function findVoice(lang) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const base = (lang || '').toLowerCase().split('-')[0]
  return window.speechSynthesis.getVoices().find((voice) => voice.lang?.toLowerCase().startsWith(base)) || null
}

/**
 * Speak text with the browser's speech synthesis.
 * Returns { ok, hasVoice } so the UI can be honest when a language has no voice.
 */
export function speakText(text, lang = 'en-IN') {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
    return { ok: false, hasVoice: false }
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  const voices = synth.getVoices() || []
  const voice = findVoice(lang)
  if (voice) utterance.voice = voice
  try {
    synth.speak(utterance)
  } catch {
    return { ok: false, hasVoice: Boolean(voice), voicesReady: voices.length > 0 }
  }
  // voicesReady=false means the browser has not reported its voice list yet,
  // so a missing voice is unknown rather than confirmed.
  return { ok: true, hasVoice: Boolean(voice), voicesReady: voices.length > 0 }
}

/**
 * Create a continuous recogniser.
 * onResult receives { transcript, final, interim }
 */
export function createRecognizer({ lang = 'en-IN', onResult, onStatus, onError } = {}) {
  const { supported, Ctor } = getSpeechSupport()
  if (!supported) {
    return {
      start() {
        onError?.('Speech recognition is not available in this browser. Use the text input instead.')
      },
      stop() {},
    }
  }

  const recognition = new Ctor()
  recognition.lang = lang
  recognition.continuous = true
  recognition.interimResults = true

  let finalText = ''
  let listening = false

  recognition.onstart = () => {
    listening = true
    onStatus?.({ listening: true, error: null })
  }
  recognition.onend = () => {
    listening = false
    onStatus?.({ listening: false })
  }
  recognition.onerror = (event) => {
    listening = false
    const messages = {
      'not-allowed': 'Microphone permission was blocked. Allow the mic or type the sentence instead.',
      'service-not-allowed': 'Speech service unavailable. Use the text input fallback.',
      'no-speech': 'No speech detected. Try again or type the sentence.',
      network: 'Speech recognition needs a network connection in this browser. Use text input.',
      aborted: null,
    }
    const message = event.error in messages ? messages[event.error] : `Speech recognition error: ${event.error}`
    if (message) onError?.(message)
    onStatus?.({ listening: false, error: message })
  }
  recognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i]
      if (result.isFinal) {
        finalText = `${finalText} ${result[0].transcript}`.trim()
        onResult?.({ transcript: finalText, interim: '', isFinal: true })
      } else {
        interim += result[0].transcript
        onResult?.({ transcript: `${finalText} ${interim}`.trim(), interim, isFinal: false })
      }
    }
  }

  return {
    start() {
      finalText = ''
      try {
        recognition.start()
      } catch {
        // start() throws if already running; ignore.
      }
    },
    stop() {
      try {
        recognition.stop()
      } catch {
        /* noop */
      }
    },
    abort() {
      try {
        recognition.abort()
      } catch {
        /* noop */
      }
    },
  }
}
