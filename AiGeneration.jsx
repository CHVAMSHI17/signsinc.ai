import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SignPlayer from '../components/SignPlayer.jsx'
import { Icon } from '../components/icons.jsx'
import { Chips, Notice, PageHero, Panel, StepList } from '../components/ui.jsx'
import { useApp } from '../context/AppContext.jsx'
import { HOW_IT_WORKS_STAGES } from '../data/classroom.js'
import { VOCAB_BY_ID } from '../data/vocabulary.js'
import { ISL_DISCLAIMER, UNSUPPORTED_MESSAGE, processText } from '../lib/processor.js'

const EXAMPLES = [
  'Welcome to today’s science class.',
  'Good morning students. Today we are learning about artificial intelligence.',
  'Please ask a question if you do not understand.',
]

export default function AiGeneration() {
  const { prefs, addRecent } = useApp()
  const [text, setText] = useState(EXAMPLES[0])
  const [submitted, setSubmitted] = useState(EXAMPLES[0])
  const [stage, setStage] = useState(-1)
  const timers = useRef([])

  const processed = useMemo(() => processText(submitted), [submitted])
  const running = stage >= 0 && stage < HOW_IT_WORKS_STAGES.length - 1

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  const runPipeline = useCallback(
    (value) => {
      clearTimers()
      const next = (value ?? text).trim()
      if (!next) return
      setText(next)
      setSubmitted(next)
      setStage(0)
      HOW_IT_WORKS_STAGES.forEach((_, index) => {
        timers.current.push(window.setTimeout(() => setStage(index), 450 + index * 520))
      })
      addRecent({ kind: 'ai', title: 'Sign sequence generated', detail: next })
    },
    [addRecent, clearTimers, text],
  )

  useEffect(() => clearTimers, [clearTimers])

  const statuses = HOW_IT_WORKS_STAGES.map((item) => item.status)

  return (
    <div className="page">
      <PageHero
        eyebrow="AI-powered sign generation"
        title="From a sentence to a sign sequence"
        lead="Type a sentence or paragraph. SignSync AI identifies supported words and phrases, maps them into a structured sign sequence, and plays it on the 3D avatar."
      >
        <button type="button" className="btn btn--primary" onClick={() => runPipeline()}>
          <Icon name="sparkles" size={17} />
          {running ? 'Generating…' : 'Generate signs'}
        </button>
        <Link to="/classroom" className="btn btn--ghost">
          Use it in Classroom Mode
        </Link>
      </PageHero>

      <div className="container stack">
        <Panel title="Input" subtitle="A sentence, a paragraph, or one of the sample lines" icon="keyboard">
          <label className="field">
            <span>Text to convert to Indian Sign Language demonstrations</span>
            <textarea
              rows={3}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) runPipeline()
              }}
              placeholder="Welcome to today’s science class."
            />
          </label>
          <div className="inline-actions">
            <button type="button" className="btn btn--primary" onClick={() => runPipeline()}>
              <Icon name="sparkles" size={17} />
              Generate sign sequence
            </button>
            <span className="muted small">⌘/Ctrl + Enter also generates</span>
          </div>
          <div className="chip-row chip-row--suggest">
            {EXAMPLES.map((example) => (
              <button key={example} type="button" className="chip chip--button" onClick={() => runPipeline(example)}>
                {example}
              </button>
            ))}
          </div>
        </Panel>

        <div className="generate-grid">
          <div className="stack">
            <Panel title="Processing pipeline" subtitle="Live status for this generation" icon="sparkles">
              <StepList steps={HOW_IT_WORKS_STAGES} activeIndex={stage} statuses={statuses} />
            </Panel>

            <Panel title="What the system understood" subtitle="Fully transparent text processing" icon="target">
              <div className="readout">
                <span className="readout__label">Original sentence</span>
                <p>{submitted || '—'}</p>
              </div>

              <div className="readout">
                <span className="readout__label">Recognized keywords</span>
                <Chips
                  items={processed.keywords.map((k) => ({
                    id: k.id,
                    label: `${VOCAB_BY_ID[k.id]?.label || k.id}`,
                  }))}
                  empty="No supported words were found."
                  tone="sign"
                />
              </div>

              <div className="readout">
                <span className="readout__label">Generated sign sequence</span>
                {processed.sequence.length ? (
                  <ol className="sequence-list">
                    {processed.sequence.map((id, index) => (
                      <li key={`${id}-${index}`}>
                        <span>{index + 1}</span>
                        <strong>{VOCAB_BY_ID[id]?.label || id}</strong>
                        <small>{VOCAB_BY_ID[id]?.meaning}</small>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="muted">No supported signs in this text.</p>
                )}
              </div>

              {processed.isPartial ? (
                <Notice variant="warn" title="Some words are outside the demonstration vocabulary">
                  {UNSUPPORTED_MESSAGE}
                  <p className="small">
                    Unsupported: {processed.unsupported.map((word) => `“${word}”`).join(', ')} — these remain available
                    as text and are not silently dropped.
                  </p>
                </Notice>
              ) : null}
              <p className="muted small">{ISL_DISCLAIMER}</p>
            </Panel>
          </div>

          <div className="stack">
            <Panel className="stage-panel" title="Avatar animation" subtitle="Plays the generated sequence in order" icon="hand">
              <SignPlayer sequence={processed.sequence} speed={prefs.playbackSpeed} captionLabel="Generated sign sequence" />
            </Panel>

            <Panel title="How this is built" subtitle="Honest architecture for a 24-hour prototype" icon="settings">
              <ul className="tick-list">
                <li>
                  <Icon name="check" size={15} />
                  <div>
                    <strong>Deterministic vocabulary mapping</strong>
                    <p>Longest-phrase-first matching against a curated demo dictionary with light stemming.</p>
                  </div>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <div>
                    <strong>Structured sign sequence</strong>
                    <p>Each supported keyword maps to a pose rig (joint angles) and a caption; the sequence is played in order.</p>
                  </div>
                </li>
                <li>
                  <Icon name="check" size={15} />
                  <div>
                    <strong>Ready for a generative model</strong>
                    <p>
                      The interface between “understanding” and “animation” is a single sign-sequence array, so a future
                      ISL model could replace the mapping step without changing the player.
                    </p>
                  </div>
                </li>
                <li>
                  <Icon name="alert" size={15} />
                  <div>
                    <strong>Not a trained foundation model</strong>
                    <p>This prototype does not train or claim its own ISL model. No accuracy claims are made.</p>
                  </div>
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
