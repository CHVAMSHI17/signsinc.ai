import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SignPlayer from '../components/SignPlayer.jsx'
import { Icon } from '../components/icons.jsx'
import { Notice, PageHero, Panel } from '../components/ui.jsx'
import { useApp } from '../context/AppContext.jsx'
import {
  MIN_CONFIDENCE,
  SAMPLE_GESTURES,
  classifyHand,
  detectHands,
  drawLandmarks,
  loadHandLandmarker,
  simulatedDetection,
} from '../lib/gestures.js'

export default function SignRecognition() {
  const { addMessage, addRecent } = useApp()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const landmarkerRef = useRef(null)
  const rafRef = useRef(null)
  const stableRef = useRef({ id: null, count: 0 })
  const lastConfirmedRef = useRef({ id: null, at: 0 })
  const simIndexRef = useRef(0)
  const confirmRef = useRef(() => {})

  const [cameraOn, setCameraOn] = useState(false)
  const [modelState, setModelState] = useState('idle')
  const [message, setMessage] = useState('')
  const [live, setLive] = useState(null)
  const [confirmed, setConfirmed] = useState(null)
  const [manualId, setManualId] = useState(SAMPLE_GESTURES[0].id)
  const [detecting, setDetecting] = useState(false)

  const confirmGesture = useCallback(
    (gesture, { force = false } = {}) => {
      const now = Date.now()
      if (!force && lastConfirmedRef.current.id === gesture.id && now - lastConfirmedRef.current.at < 3500) {
        return
      }
      lastConfirmedRef.current = { id: gesture.id, at: now }
      setConfirmed(gesture)
      addMessage({
        person: 'B',
        text: `[Sign] ${gesture.label}${gesture.simulated ? ' (simulated)' : gesture.manual ? ' (manual fallback)' : ''}`,
        signs: [gesture.id],
        unsupported: [],
      })
      addRecent({
        kind: 'gesture',
        title: `Gesture recognised: ${gesture.label}`,
        detail: `${Math.round(gesture.confidence * 100)}% confidence${gesture.simulated ? ' · simulated' : ''}`,
      })
    },
    [addMessage, addRecent],
  )

  useEffect(() => {
    confirmRef.current = confirmGesture
  }, [confirmGesture])

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setDetecting(false)
  }, [])

  const startLoop = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setDetecting(true)
    let last = 0

    const loop = (timestamp) => {
      rafRef.current = requestAnimationFrame(loop)
      if (timestamp - last < 110) return
      last = timestamp
      const landmarker = landmarkerRef.current
      if (!landmarker || video.readyState < 2) return
      try {
        const landmarks = detectHands(landmarker, video, timestamp)
        const canvas = canvasRef.current
        if (canvas) {
          const width = video.videoWidth || 640
          const height = video.videoHeight || 480
          if (canvas.width !== width) canvas.width = width
          if (canvas.height !== height) canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, width, height)
          if (landmarks) drawLandmarks(ctx, landmarks, width, height)
        }
        if (!landmarks) {
          setLive(null)
          stableRef.current = { id: null, count: 0 }
          return
        }
        const result = classifyHand(landmarks)
        if (!result?.id || result.confidence < MIN_CONFIDENCE) {
          setLive(result ? { ...result, unsure: true } : null)
          stableRef.current = { id: null, count: 0 }
          return
        }
        setLive(result)
        const stable = stableRef.current
        if (stable.id === result.id) {
          stable.count += 1
        } else {
          stableRef.current = { id: result.id, count: 1 }
        }
        if (stableRef.current.count === 3) {
          const gesture = SAMPLE_GESTURES.find((g) => g.id === result.id)
          confirmRef.current({
            id: result.id,
            label: gesture?.label || result.id,
            confidence: result.confidence,
          })
        }
      } catch {
        // Detection errors should never break the page.
      }
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  const startCamera = async () => {
    setMessage('')
    setModelState('loading')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOn(true)
      try {
        landmarkerRef.current = await loadHandLandmarker()
        setModelState('ready')
        startLoop()
      } catch {
        setModelState('error')
        setMessage(
          'Hand tracking could not load in this browser or network. The camera preview still works — use the simulation button or the manual fallback to demonstrate the flow.',
        )
      }
    } catch {
      setModelState('idle')
      setCameraOn(false)
      setMessage('Camera permission was blocked or no camera is available. Use the simulation or manual fallback below — the demo still works end to end.')
    }
  }

  const stopCamera = useCallback(() => {
    stopLoop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOn(false)
    setLive(null)
    landmarkerRef.current = null
    setModelState('idle')
  }, [stopLoop])

  useEffect(
    () => () => {
      stopLoop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    },
    [stopLoop],
  )

  const runSimulation = () => {
    const result = simulatedDetection(simIndexRef.current)
    simIndexRef.current += 1
    confirmGesture(result, { force: true })
    setMessage('Simulated recognition is clearly labelled. It exists so the demonstration works without a camera.')
  }

  const useManual = () => {
    const gesture = SAMPLE_GESTURES.find((g) => g.id === manualId)
    if (!gesture) return
    confirmGesture({ id: gesture.id, label: gesture.label, confidence: 1, manual: true }, { force: true })
  }

  const liveLabel = live?.unsure ? 'Unclear hand shape' : live?.label

  return (
    <div className="page">
      <PageHero
        eyebrow="Demo C · Sign to text"
        title="Sign recognition demo"
        lead="A small, clearly labelled gesture recogniser. The camera captures a hand, compares a few hand-shape features, and converts a recognised sample gesture into text."
      >
        <Link to="/communication" className="btn btn--teal">
          <Icon name="chat" size={17} />
          Back to Communication Mode
        </Link>
        <Link to="/learn" className="btn btn--ghost">
          See the sample gestures
        </Link>
      </PageHero>

      <div className="container stack">
        <div className="camera-grid">
          <Panel
            title="Camera"
            subtitle="MediaPipe Hands when available, simulation otherwise"
            icon="camera"
            actions={
              <span className={`pill ${modelState === 'ready' ? 'pill--teal' : modelState === 'error' ? 'pill--warn' : 'pill--soft'}`}>
                {modelState === 'ready'
                  ? detecting
                    ? 'Tracking hand'
                    : 'Model ready'
                  : modelState === 'loading'
                    ? 'Loading model'
                    : modelState === 'error'
                      ? 'Simulation mode'
                      : 'Camera off'}
              </span>
            }
          >
            <div className="camera-view">
              <video ref={videoRef} className="camera-view__video" playsInline muted aria-label="Live camera preview" />
              <canvas ref={canvasRef} className="camera-view__overlay" aria-hidden="true" />
              {!cameraOn ? (
                <div className="camera-view__placeholder">
                  <Icon name="camera" size={30} />
                  <p>Camera preview appears here</p>
                  <small>Nothing is uploaded. Everything runs in your browser.</small>
                </div>
              ) : null}
              {cameraOn && live ? (
                <div className="camera-view__badge">
                  <strong>{liveLabel}</strong>
                  <span>{Math.round((live.confidence || 0) * 100)}% confidence</span>
                </div>
              ) : null}
            </div>

            <div className="control-row">
              <button
                type="button"
                className={`btn ${cameraOn ? 'btn--danger' : 'btn--primary'}`}
                onClick={cameraOn ? stopCamera : startCamera}
              >
                <Icon name={cameraOn ? 'stop' : 'camera'} size={17} />
                {cameraOn ? 'Stop camera' : 'Start camera'}
              </button>
              <button type="button" className="btn btn--teal" onClick={runSimulation}>
                <Icon name="sparkles" size={17} />
                Simulate a gesture
              </button>
            </div>

            {message ? <Notice variant="warn">{message}</Notice> : null}

            <div className="manual-fallback">
              <label className="field field--tight">
                <span>Manual fallback — choose the gesture you showed</span>
                <select value={manualId} onChange={(event) => setManualId(event.target.value)}>
                  {SAMPLE_GESTURES.map((gesture) => (
                    <option key={gesture.id} value={gesture.id}>
                      {gesture.label} — {gesture.shape}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn btn--secondary btn--sm" onClick={useManual}>
                <Icon name="check" size={15} />
                Use this gesture
              </button>
            </div>
          </Panel>

          <div className="stack">
            <Panel title="Recognised text" subtitle="Confidence is reported, not hidden" icon="keyboard">
              {confirmed ? (
                <div className="recognised">
                  <span className="recognised__word">{confirmed.label}</span>
                  <div className="confidence">
                    <div className="confidence__bar" aria-hidden="true">
                      <span style={{ width: `${Math.round(confirmed.confidence * 100)}%` }} />
                    </div>
                    <strong>{Math.round(confirmed.confidence * 100)}%</strong>
                  </div>
                  <p className="muted small">
                    Source:{' '}
                    {confirmed.simulated
                      ? 'simulated detection (clearly labelled)'
                      : confirmed.manual
                        ? 'manual fallback'
                        : 'camera hand tracking'}
                  </p>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() =>
                      confirmGesture(
                        { ...confirmed, confidence: 1, manual: true },
                        { force: true },
                      )
                    }
                  >
                    <Icon name="replay" size={15} />
                    Add to conversation again
                  </button>
                </div>
              ) : (
                <p className="muted">
                  No gesture recognised yet. Show one of the sample gestures, run the simulation, or use the manual
                  fallback.
                </p>
              )}

              <div className="live-row">
                <span>Live reading</span>
                <strong>{live ? `${liveLabel} · ${Math.round((live.confidence || 0) * 100)}%` : '—'}</strong>
              </div>
            </Panel>

            <Panel title="Avatar demonstration" subtitle="The recognised word is signed back" icon="hand">
              <SignPlayer
                sequence={confirmed ? [confirmed.id] : []}
                captionLabel={confirmed ? `Recognised: ${confirmed.label}` : undefined}
                emptyHint="A recognised gesture will be signed here as confirmation."
              />
            </Panel>
          </div>
        </div>

        <Panel title="Supported sample gestures" subtitle="Six hand shapes only — this is a demo dataset" icon="hand">
          <ul className="gesture-grid">
            {SAMPLE_GESTURES.map((gesture) => (
              <li key={gesture.id}>
                <strong>{gesture.label}</strong>
                <span className="gesture-shape">{gesture.shape}</span>
                <p>{gesture.meaning}</p>
              </li>
            ))}
          </ul>
          <Notice variant="warn" title="What this demo does not do">
            Indian Sign Language includes two-handed signs, movement, location, facial expression and grammar. This demo
            reads a single hand shape from a handful of samples. It is not complete ISL recognition and should not be
            presented as translation.
          </Notice>
        </Panel>
      </div>
    </div>
  )
}
