// Small localStorage helpers + persisted keys for the prototype.

const PREFIX = 'signsync:'

export const KEYS = {
  profile: `${PREFIX}profile`,
  prefs: `${PREFIX}prefs`,
  conversation: `${PREFIX}conversation`,
  recent: `${PREFIX}recent`,
}

export function load(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage may be unavailable (private mode) — prototype can continue */
  }
}
