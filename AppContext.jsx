import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { KEYS, load, save } from '../lib/storage.js'

const DEFAULT_PROFILE = {
  name: '',
  userType: 'deaf',
  mode: 'classroom',
}

const DEFAULT_PREFS = {
  highContrast: false,
  largeText: false,
  captions: true,
  reducedMotion: false,
  playbackSpeed: 1,
  outputLanguage: 'en',
  speakSigns: false,
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [profile, setProfileState] = useState(() => ({ ...DEFAULT_PROFILE, ...load(KEYS.profile, {}) }))
  const [prefs, setPrefsState] = useState(() => ({ ...DEFAULT_PREFS, ...load(KEYS.prefs, {}) }))
  const [conversation, setConversation] = useState(() => load(KEYS.conversation, []))
  const [recent, setRecent] = useState(() => load(KEYS.recent, []))

  useEffect(() => save(KEYS.profile, profile), [profile])
  useEffect(() => save(KEYS.prefs, prefs), [prefs])
  useEffect(() => save(KEYS.conversation, conversation.slice(-40)), [conversation])
  useEffect(() => save(KEYS.recent, recent.slice(0, 8)), [recent])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.contrast = prefs.highContrast ? 'high' : 'normal'
    root.dataset.textSize = prefs.largeText ? 'large' : 'normal'
    root.dataset.motion = prefs.reducedMotion ? 'reduced' : 'full'
  }, [prefs.highContrast, prefs.largeText, prefs.reducedMotion])

  const setProfile = useCallback((patch) => {
    setProfileState((prev) => ({ ...prev, ...patch }))
  }, [])

  const setPrefs = useCallback((patch) => {
    setPrefsState((prev) => ({ ...prev, ...patch }))
  }, [])

  const addMessage = useCallback((message) => {
    setConversation((prev) => [...prev, { id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, at: new Date().toISOString(), ...message }])
  }, [])

  const clearConversation = useCallback(() => setConversation([]), [])

  const addRecent = useCallback((entry) => {
    setRecent((prev) => [{ id: `${Date.now()}`, at: new Date().toISOString(), ...entry }, ...prev].slice(0, 8))
  }, [])

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      prefs,
      setPrefs,
      conversation,
      addMessage,
      clearConversation,
      recent,
      addRecent,
    }),
    [profile, setProfile, prefs, setPrefs, conversation, addMessage, clearConversation, recent, addRecent],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
