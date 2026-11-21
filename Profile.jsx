import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/icons.jsx'
import { Notice, PageHero, Panel } from '../components/ui.jsx'
import { useApp } from '../context/AppContext.jsx'
import { COMMUNICATION_MODES, PROFILE_TYPES } from '../data/classroom.js'
import { OUTPUT_LANGUAGES } from '../data/languages.js'

export default function Profile() {
  const { profile, setProfile, prefs, setPrefs, conversation, recent, clearConversation } = useApp()
  const [form, setForm] = useState(profile)
  const [saved, setSaved] = useState(false)

  const update = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }))
    setSaved(false)
  }

  const saveProfile = (event) => {
    event.preventDefault()
    setProfile(form)
    setSaved(true)
  }

  return (
    <div className="page">
      <PageHero
        eyebrow="Your profile"
        title="Personalise SignSync AI"
        lead="Preferences are stored locally in this browser for the prototype. Nothing is sent to a server."
      />

      <div className="container stack">
        <form className="profile-grid" onSubmit={saveProfile}>
          <Panel title="About you" subtitle="Used only to greet you and suggest a starting mode" icon="user">
            <label className="field">
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => update({ name: event.target.value })}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>

            <fieldset className="field">
              <legend>User type</legend>
              <div className="radio-list">
                {PROFILE_TYPES.map((type) => (
                  <label key={type.id} className={`radio-card ${form.userType === type.id ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="userType"
                      value={type.id}
                      checked={form.userType === type.id}
                      onChange={() => update({ userType: type.id })}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="field">
              <span>Sign output language</span>
              <select
                value={prefs.outputLanguage || 'en'}
                onChange={(event) => setPrefs({ outputLanguage: event.target.value })}
              >
                {OUTPUT_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label} — {lang.native}
                  </option>
                ))}
              </select>
              <small className="muted">
                Used for sign-to-text and sign-to-audio messages. Interface labels stay in English.
              </small>
            </label>

            <label className="field">
              <span>Preferred communication mode</span>
              <select value={form.mode} onChange={(event) => update({ mode: event.target.value })}>
                {COMMUNICATION_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="inline-actions">
              <button type="submit" className="btn btn--primary">
                <Icon name="check" size={17} />
                Save profile
              </button>
              <Link to="/dashboard" className="btn btn--ghost">
                Go to dashboard
              </Link>
            </div>
            {saved ? (
              <Notice variant="info" title="Saved locally">
                Your profile preferences were saved in this browser’s localStorage.
              </Notice>
            ) : null}
          </Panel>

          <div className="stack">
            <Panel title="Communication preferences" subtitle="Applied across the avatar and captions" icon="settings">
              <label className="field field--tight">
                <span>Playback speed — {prefs.playbackSpeed}×</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.25"
                  value={prefs.playbackSpeed}
                  onChange={(event) => setPrefs({ playbackSpeed: Number(event.target.value) })}
                />
              </label>
              <div className="switch-row">
                <span>
                  <strong>Captions</strong>
                  <small>Always show captions with the avatar</small>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.captions}
                  className={`switch ${prefs.captions ? 'is-on' : ''}`}
                  onClick={() => setPrefs({ captions: !prefs.captions })}
                >
                  <span />
                </button>
              </div>
              <div className="switch-row">
                <span>
                  <strong>High contrast</strong>
                  <small>Stronger colours and borders</small>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.highContrast}
                  className={`switch ${prefs.highContrast ? 'is-on' : ''}`}
                  onClick={() => setPrefs({ highContrast: !prefs.highContrast })}
                >
                  <span />
                </button>
              </div>
              <div className="switch-row">
                <span>
                  <strong>Larger text</strong>
                  <small>Use a larger interface text size</small>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs.largeText}
                  className={`switch ${prefs.largeText ? 'is-on' : ''}`}
                  onClick={() => setPrefs({ largeText: !prefs.largeText })}
                >
                  <span />
                </button>
              </div>
            </Panel>

            <Panel title="Demo data" subtitle="Stored in this browser only" icon="download">
              <ul className="recent-list">
                <li>
                  <span className="recent-dot" aria-hidden="true" />
                  <div>
                    <strong>{conversation.length} conversation messages</strong>
                    <small>Shared between Communication Mode and the sign demo</small>
                  </div>
                </li>
                <li>
                  <span className="recent-dot" aria-hidden="true" />
                  <div>
                    <strong>{recent.length} recent activities</strong>
                    <small>Classroom simulations, generated sentences and gestures</small>
                  </div>
                </li>
              </ul>
              <div className="inline-actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={clearConversation}
                  disabled={!conversation.length}
                >
                  <Icon name="trash" size={15} />
                  Clear conversation history
                </button>
              </div>
              <p className="muted small">
                There is no account or cloud sync in the prototype. Clearing browser data removes these preferences.
              </p>
            </Panel>
          </div>
        </form>
      </div>
    </div>
  )
}
