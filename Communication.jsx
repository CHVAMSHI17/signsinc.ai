import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SignPlayer from '../components/SignPlayer.jsx'
import { Icon } from '../components/icons.jsx'
import { Chips, Notice, PageHero } from '../components/ui.jsx'
import { useApp } from '../context/AppContext.jsx'
import { VOCAB_BY_ID } from '../data/vocabulary.js'
import { createRecognizer, getSpeechSupport } from '../lib/speech.js'
import { ISL_DISCLAIMER, UNSUPPORTED_MESSAGE, processText } from '../lib/processor.js'

const QUICK_PHRASES = ['Hello, how are you?', 'Hello, can you help me?', 'Thank you. Please help my friend.', 'Where is the classroom?']

export default function Communication() {
  const { prefs, conversation, addMessage, clearConversation, addRecent } = useApp()
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [message, setMessage] = useState('')
  const recognizer = useRef(null)
  const speechSupport = useMemo(() => getSpeechSupport(), [])

  // The last message from Person A is the single source of truth for the
  // avatar, so clearing the history also clears the demonstration.
  const lastSpoken = useMemo(
    () => [...conversation].reverse().find((item) => item.person === 'A') || null,
    [conversation],
  )
  const processed = useMemo(() => (lastSpoken ? processText(lastSpoken.text) : null), [lastSpoken])

  const stageSequence = processed?.sequence ?? []

  const send = useCallback(
    (raw, person = 'A') => {
      const value = (raw || '').trim()
      if (!value) return
      const result = processText(value)
      addMessage({
        person,
        text: value,
        signs: result.sequence,
        unsupported: result.unsupported,
      })
      addRecent({
        kind: result.sequence.length ? 'communication' : 'warning',
        title: person === 'A' ? 'Person A spoke' : 'Person B typed',
        detail: value,
      })
      setInput('')
    },
    [addMessage, addRecent],
  )

  const stopMic = () => {
    recognizer.current?.stop()
    setListening(false)
    setInterim('')
  }

  const startMic = () => {
    setMessage('')
    if (!speechSupport.supported) {
      setMessage('Speech recognition is not available in this browser. Type the message — the avatar demo works the same way.')
      return
    }
    if (!recognizer.current) {
      recognizer.current = createRecognizer({
        lang: 'en-IN',
        onResult: ({ transcript, isFinal, interim: live }) => {
          setInterim(live || '')
          if (isFinal) {
            setInterim('')
            send(transcript, 'A')
          }
        },
        onStatus: ({ listening: isListening }) => setListening(Boolean(isListening)),
        onError: (text) => {
          setMessage(text)
          setListening(false)
        },
      })
    }
    recognizer.current.start()
    setListening(true)
  }

  useEffect(
    () => () => {
      recognizer.current?.abort?.()
    },
    [],
  )

  return (
    <div className="page">
      <PageHero
        eyebrow="Two-way communication"
        title="Communication Mode"
        lead="A hearing person speaks or types; the deaf person reads captions and watches a 3D avatar sign the supported vocabulary."
      >
        <Link to="/sign-recognition" className="btn btn--teal">
          <Icon name="camera" size={17} />
          Try sign to text
        </Link>
        <Link to="/how-it-works" className="btn btn--ghost">
          How it works
        </Link>
      </PageHero>

      <div className="container stack">
        <div className="split">
          <section className="split__side split__side--a" aria-label="Person A input">
            <header className="split__head">
              <div>
                <span className="pill pill--soft">Person A</span>
                <h2>Hearing person</h2>
                <p>Speak or type a message. Supported words appear as ISL signs for Person B.</p>
              </div>
              <span className="split__icon">
                <Icon name="mic" size={22} />
              </span>
            </header>

            <div className="control-row">
              <button
                type="button"
                className={`btn ${listening ? 'btn--danger' : 'btn--teal'}`}
                onClick={listening ? stopMic : startMic}
                aria-pressed={listening}
              >
                <Icon name="mic" size={17} />
                {listening ? 'Stop listening' : 'Speak'}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setInput('Hello, how are you?')}>
                <Icon name="keyboard" size={17} />
                Use text
              </button>
            </div>

            {listening ? (
              <div className="listening-bar" role="status">
                <span className="live-dot" aria-hidden="true" />
                Listening…
              </div>
            ) : null}
            {interim ? <p className="interim">{interim}</p> : null}
            {message ? <Notice variant="warn">{message}</Notice> : null}

            <div className="composer">
              <label className="field field--grow">
                <span>Type a message</span>
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') send(input, 'A')
                  }}
                  placeholder="Hello, how are you?"
                />
              </label>
              <button type="button" className="btn btn--primary" onClick={() => send(input, 'A')}>
                <Icon name="send" size={17} />
                Send
              </button>
            </div>

            <div className="chip-row chip-row--suggest">
              {QUICK_PHRASES.map((phrase) => (
                <button key={phrase} type="button" className="chip chip--button" onClick={() => send(phrase, 'A')}>
                  {phrase}
                </button>
              ))}
            </div>

            <div className="split__history">
              <h3>Conversation history</h3>
              {conversation.length ? (
                <ul className="messages">
                  {conversation.map((item) => (
                    <li key={item.id} className={`message message--${item.person === 'B' ? 'b' : 'a'}`}>
                      <span className="message__who">{item.person === 'B' ? 'Person B (deaf / hard of hearing)' : 'Person A (hearing)'}</span>
                      <p>{item.text}</p>
                      {item.signs?.length ? (
                        <small>
                          {item.signs.length} sign{item.signs.length > 1 ? 's' : ''}:{' '}
                          {item.signs.map((id) => VOCAB_BY_ID[id]?.label || id).join(' · ')}
                        </small>
                      ) : (
                        <small>No supported signs — shown as text.</small>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">Messages from both sides appear here. History is saved on this device.</p>
              )}
              {conversation.length ? (
                <button type="button" className="btn btn--ghost btn--sm" onClick={clearConversation}>
                  <Icon name="trash" size={15} />
                  Clear history
                </button>
              ) : null}
            </div>
          </section>

          <section className="split__side split__side--b" aria-label="Person B view">
            <header className="split__head">
              <div>
                <span className="pill pill--teal">Person B</span>
                <h2>Deaf or hard-of-hearing person</h2>
                <p>Watch the ISL demonstration and read the captions.</p>
              </div>
              <span className="split__icon split__icon--teal">
                <Icon name="hand" size={22} />
              </span>
            </header>

            <SignPlayer
              sequence={stageSequence}
              speed={prefs.playbackSpeed}
              captionLabel={lastSpoken ? 'Signing Person A’s message' : undefined}
              emptyHint="Person A’s supported words will be signed here."
            />

            {lastSpoken ? (
              <div className="analysis-block">
                <div className="readout">
                  <span className="readout__label">Message</span>
                  <p>{lastSpoken.text}</p>
                </div>
                <h3>Recognized keywords</h3>
                <Chips
                  items={(processed?.keywords || []).map((k) => ({ id: k.id, label: VOCAB_BY_ID[k.id]?.label || k.id }))}
                  empty="Nothing in this message matched the sample vocabulary."
                  tone="sign"
                />
                {processed?.isPartial ? (
                  <Notice variant="warn" title="Vocabulary limit">
                    {UNSUPPORTED_MESSAGE}
                    <p className="small">Not matched: {processed.unsupported.map((w) => `“${w}”`).join(', ')}</p>
                  </Notice>
                ) : null}
                <p className="muted small">{ISL_DISCLAIMER}</p>
              </div>
            ) : null}

            <div className="sign-to-text-teaser">
              <div>
                <h3>Sign to text</h3>
                <p>
                  Person B can also respond by showing a hand gesture to the camera. The prototype recognises a small
                  sample gesture set and converts it to text.
                </p>
              </div>
              <Link to="/sign-recognition" className="btn btn--secondary btn--sm">
                <Icon name="camera" size={16} />
                Open camera demo
              </Link>
            </div>
          </section>
        </div>

        <Notice variant="info" title="Prototype note">
          This two-way interface demonstrates the flow: speech or text becomes a sign sequence, and a gesture can become
          text. Gesture recognition covers a handful of sample hand shapes only — it is not complete ISL recognition.
        </Notice>
      </div>
    </div>
  )
}
