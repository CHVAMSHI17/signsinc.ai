import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/icons.jsx'
import { Chips, PageHero, Panel } from '../components/ui.jsx'
import { HOW_IT_WORKS_STAGES } from '../data/classroom.js'
import { VOCAB_BY_ID } from '../data/vocabulary.js'
import { ISL_DISCLAIMER, UNSUPPORTED_MESSAGE, processText } from '../lib/processor.js'
import { useApp } from '../context/AppContext.jsx'

const SAMPLE = 'Good morning students. Today we are learning about computers.'

const ACCESSIBILITY = [
  { icon: 'type', title: 'Large, readable text', text: 'A generous base type scale, with an optional larger-text setting.' },
  { icon: 'contrast', title: 'High contrast mode', text: 'A one-click palette with stronger text and border contrast.' },
  { icon: 'chat', title: 'Captions everywhere', text: 'Every sign demonstration is paired with text, never animation alone.' },
  { icon: 'keyboard', title: 'Keyboard accessible', text: 'All controls are native buttons and inputs with visible focus rings.' },
  { icon: 'slow', title: 'Playback speed', text: 'Pause, replay, slow motion and a speed slider for the avatar.' },
  { icon: 'globe', title: 'Language ready', text: 'An interface language selector starting with English, prepared for regional languages.' },
]

export default function HowItWorks() {
  const { prefs } = useApp()
  const [text, setText] = useState(SAMPLE)
  const [stage, setStage] = useState(-1)
  const timers = useRef([])

  const processed = useMemo(() => processText(text), [text])
  const running = stage >= 0 && stage < HOW_IT_WORKS_STAGES.length - 1

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const run = () => {
    clearTimers()
    setStage(0)
    HOW_IT_WORKS_STAGES.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setStage(index), 350 + index * 650))
    })
  }

  useEffect(() => clearTimers, [clearTimers])

  const stageValues = [
    text,
    'Speech recognised as text (or typed directly)',
    `${processed.tokens.length} tokens after normalising and stemming`,
    `${processed.keywords.length} supported keyword${processed.keywords.length === 1 ? '' : 's'} matched`,
    processed.sequence.length ? processed.sequence.join(' → ') : 'No supported signs — text only',
    `${processed.sequence.length} pose${processed.sequence.length === 1 ? '' : 's'} blended on the rig`,
    'Avatar + captions delivered to the student',
  ]

  return (
    <div className="page">
      <PageHero
        eyebrow="Transparent AI processing"
        title="How SignSync AI works"
        lead="Every step of the pipeline is visible and reflects real prototype operations. Run the demonstration to watch the stages light up."
      >
        <Link to="/ai-generation" className="btn btn--primary">
          <Icon name="sparkles" size={17} />
          Try it with your own sentence
        </Link>
        <Link to="/about" className="btn btn--ghost">
          Limitations &amp; SDG 4
        </Link>
      </PageHero>

      <div className="container stack">
        <Panel title="Live pipeline" subtitle="Speech → text → vocabulary → sequence → animation → communication" icon="sparkles">
          <div className="input-row">
            <label className="field field--grow">
              <span>Sample input</span>
              <input type="text" value={text} onChange={(event) => setText(event.target.value)} />
            </label>
            <button type="button" className="btn btn--primary" onClick={run} disabled={running}>
              <Icon name="play" size={17} />
              {running ? 'Running…' : 'Run pipeline'}
            </button>
          </div>

          <ol className="flow" aria-label="Processing pipeline">
            {HOW_IT_WORKS_STAGES.map((item, index) => {
              const state = stage > index ? 'is-done' : stage === index ? 'is-active' : ''
              return (
                <li key={item.id} className={`flow__stage ${state}`}>
                  <div className="flow__marker" aria-hidden="true">
                    {stage > index ? <Icon name="check" size={14} /> : index + 1}
                  </div>
                  <div className="flow__content">
                    <div className="flow__title">
                      <h3>{item.label}</h3>
                      {stage >= index ? <span className="status-pill">{item.status}</span> : null}
                    </div>
                    <p>{item.detail}</p>
                    {stage >= index ? <code className="flow__value">{stageValues[index]}</code> : null}
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="readout-grid">
            <div className="readout">
              <span className="readout__label">Recognized keywords</span>
              <Chips
                items={processed.keywords.map((k) => ({ id: k.id, label: VOCAB_BY_ID[k.id]?.label || k.id }))}
                empty="No supported words in this input."
                tone="sign"
              />
              {processed.unsupported.length ? (
                <p className="small muted">
                  {UNSUPPORTED_MESSAGE} Unsupported: {processed.unsupported.join(', ')}
                </p>
              ) : null}
            </div>
            <div className="readout">
              <span className="readout__label">Sign sequence</span>
              <p>
                {processed.sequence.length
                  ? processed.sequence.map((id) => VOCAB_BY_ID[id]?.label || id).join(' · ')
                  : 'No signs generated for this input.'}
              </p>
              <small className="muted">{ISL_DISCLAIMER}</small>
            </div>
          </div>
        </Panel>

        <Panel title="System architecture" subtitle="Simple frontend-only prototype" icon="settings">
          <div className="arch-grid">
            <div className="arch-card">
              <span className="pill pill--soft">Input</span>
              <h3>Browser speech + text</h3>
              <p>Web Speech API where supported, with a typed fallback that always works.</p>
            </div>
            <div className="arch-card">
              <span className="pill pill--soft">Understanding</span>
              <h3>Rule-based text processing</h3>
              <p>Normalising, stemming and longest-phrase-first matching against the demo vocabulary.</p>
            </div>
            <div className="arch-card">
              <span className="pill pill--soft">Generation</span>
              <h3>Structured sign sequence</h3>
              <p>An ordered array of sign ids and captions, ready to be produced by a future ISL model.</p>
            </div>
            <div className="arch-card">
              <span className="pill pill--soft">Presentation</span>
              <h3>React Three Fiber avatar</h3>
              <p>A jointed 3D rig with pose blending, finger articulation, playback controls and captions.</p>
            </div>
          </div>
          <div className="architecture-note">
            <Icon name="lightbulb" size={18} />
            <p>
              The boundary between understanding and animation is deliberately small: a sign sequence array. A future
              generative ISL model can replace the mapping step, and the avatar player, captions and classroom UI keep
              working unchanged.
            </p>
          </div>
        </Panel>

        <Panel title="Accessibility features" subtitle="Built into the interface, not bolted on" icon="contrast">
          <ul className="access-grid">
            {ACCESSIBILITY.map((item) => (
              <li key={item.title}>
                <span className="feature-card__icon">
                  <Icon name={item.icon} size={20} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="muted small">
            Current preference: captions {prefs.captions ? 'on' : 'off'} · playback {prefs.playbackSpeed}× ·{' '}
            {prefs.highContrast ? 'high contrast' : 'standard colours'} · {prefs.largeText ? 'larger text' : 'default text size'}.
            Adjust these from the accessibility button in the header.
          </p>
        </Panel>

        <Panel title="Demo scenarios" subtitle="What to show in a live presentation" icon="play">
          <div className="scenario-grid">
            <Link to="/classroom" className="scenario-card">
              <span className="scenario-card__tag">Demo A</span>
              <h3>Classroom</h3>
              <p className="scenario-card__line">“Good morning students. Today we are learning about computers.”</p>
              <ol className="scenario-steps">
                <li>Run the teaching simulation or type the sentence.</li>
                <li>Show the recognised text and matched keywords.</li>
                <li>Let the avatar sign, then replay in slow motion.</li>
              </ol>
            </Link>
            <Link to="/communication" className="scenario-card">
              <span className="scenario-card__tag">Demo B</span>
              <h3>Everyday communication</h3>
              <p className="scenario-card__line">“Hello, how are you?”</p>
              <ol className="scenario-steps">
                <li>Speak or type the greeting as Person A.</li>
                <li>Switch attention to Person B’s panel and the avatar.</li>
                <li>Show the conversation history with sign badges.</li>
              </ol>
            </Link>
            <Link to="/sign-recognition" className="scenario-card">
              <span className="scenario-card__tag">Demo C</span>
              <h3>Sign recognition</h3>
              <p className="scenario-card__line">Show a sample gesture to the camera.</p>
              <ol className="scenario-steps">
                <li>Start the camera (or use the simulation).</li>
                <li>Show HELLO, YES or WATER and watch the confidence.</li>
                <li>See the recognised word signed back by the avatar.</li>
              </ol>
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  )
}
