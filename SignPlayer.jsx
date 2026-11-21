import { useCallback, useEffect, useRef, useState } from 'react'
import Avatar3D from './Avatar3D.jsx'
import { getPose, REST_POSE } from '../data/poses.js'
import { VOCAB_BY_ID } from '../data/vocabulary.js'
import { Icon } from './icons.jsx'
import { useApp } from '../context/AppContext.jsx'

const BASE_DURATION = 1500

/**
 * Plays a sign sequence on the 3D avatar with captions and controls.
 */
export default function SignPlayer({
  sequence = [],
  speed = 1,
  autoplay = true,
  allowSlow = true,
  allowReset = true,
  compact = false,
  captionLabel,
  emptyHint = 'Run a sentence through SignSync AI to see the sign demonstration.',
}) {
  const key = sequence.join('|')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(Boolean(autoplay && sequence.length))
  const [slow, setSlow] = useState(false)
  const timer = useRef(null)
  const { prefs } = useApp()
  const showCaptions = prefs?.captions !== false

  const effectiveSpeed = slow ? 0.55 : speed
  const signId = sequence[index]
  const entry = signId ? VOCAB_BY_ID[signId] : null

  const pose = signId ? getPose(signId) : REST_POSE

  // Restart when the sequence changes.
  useEffect(() => {
    setIndex(0)
    setPlaying(Boolean(autoplay && sequence.length))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    if (!playing || !sequence.length) return undefined
    const wait = BASE_DURATION / effectiveSpeed
    timer.current = window.setTimeout(() => {
      setIndex((current) => {
        const next = current + 1
        if (next >= sequence.length) {
          setPlaying(false)
          return current
        }
        return next
      })
    }, wait)
    return () => window.clearTimeout(timer.current)
  }, [playing, index, key, effectiveSpeed, sequence.length])

  const replay = useCallback(() => {
    setIndex(0)
    setPlaying(true)
  }, [])

  const reset = useCallback(() => {
    setIndex(0)
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (!sequence.length) return
    setPlaying((prev) => !prev)
  }, [sequence.length])

  const progress = sequence.length ? index / sequence.length : 0

  return (
    <div className={`sign-player ${compact ? 'sign-player--compact' : ''}`}>
      {captionLabel ? <div className="sign-player__label">{captionLabel}</div> : null}
      <div className="sign-player__stage">
        <Avatar3D pose={pose} />

        {!sequence.length ? (
          <div className="sign-player__empty">
            <span className="sign-player__empty-icon" aria-hidden="true">
              ✋
            </span>
            <p>{emptyHint}</p>
          </div>
        ) : null}

        {sequence.length && showCaptions ? (
          <div className="sign-player__caption" aria-live="polite">
            <span className="sign-player__caption-tag">Captions</span>
            <p>{entry ? entry.label : signId}</p>
            {entry ? <small>{entry.meaning}</small> : null}
          </div>
        ) : null}

        {sequence.length > 1 ? (
          <div className="sign-player__dots" aria-hidden="true">
            {sequence.map((id, i) => (
              <span key={`${id}-${i}`} className={i === index ? 'is-active' : i < index ? 'is-done' : ''} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="sign-player__controls">
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={toggle}
          disabled={!sequence.length}
          aria-label={playing ? 'Pause animation' : 'Play animation'}
        >
          <Icon name={playing ? 'pause' : 'play'} size={16} />
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={replay}
          disabled={!sequence.length}
          aria-label="Replay sign sequence"
        >
          <Icon name="replay" size={16} />
          Replay
        </button>
        {allowSlow ? (
          <button
            type="button"
            className={`btn btn--ghost btn--sm ${slow ? 'is-active' : ''}`}
            onClick={() => setSlow((s) => !s)}
            aria-pressed={slow}
            aria-label="Toggle slow animation"
          >
            <Icon name="slow" size={16} />
            Slow
          </button>
        ) : null}
        {allowReset ? (
          <button type="button" className="btn btn--ghost btn--sm" onClick={reset} aria-label="Reset animation">
            <Icon name="reset" size={16} />
            Reset
          </button>
        ) : null}
        <span className="sign-player__counter">
          {sequence.length ? `${Math.min(index + 1, sequence.length)} / ${sequence.length}` : '0 / 0'}
        </span>
      </div>

      <div className="sign-player__progress" aria-hidden="true">
        <span style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>

      {sequence.length ? (
        <div className="sign-player__sequence" aria-label="Sign sequence">
          {sequence.map((id, i) => (
            <button
              key={`${id}-${i}`}
              type="button"
              className={`seq-chip ${i === index ? 'is-active' : ''}`}
              onClick={() => {
                setIndex(i)
                setPlaying(true)
              }}
              aria-label={`Play sign ${VOCAB_BY_ID[id]?.label || id}`}
            >
              {VOCAB_BY_ID[id]?.label || id}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
